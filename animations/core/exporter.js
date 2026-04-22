export class Exporter {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Function} renderFrameFn - Signature: async (progress) => void. Value from 0.0 to 1.0.
     */
    constructor(canvas, renderFrameFn) {
        this.canvas = canvas;
        this.renderFrameFn = renderFrameFn;
    }

    /**
     * High Quality Offline WebWorker Rendering
     */
    async renderOffline(format = 'mp4', fps = 60, durationMs = 5000, onProgress = null) {
        return new Promise(async (resolve, reject) => {
            const worker = new Worker(new URL('./mediabunny.worker.js', import.meta.url), { type: 'module' });
            
            const numFrames = Math.ceil((durationMs / 1000) * fps);
            const frameDurationUs = Math.floor((1000 / fps) * 1000);
            
            worker.onmessage = async (e) => {
                const { type, data, error } = e.data;
                
                if (type === 'READY') {
                    // Send all frames
                    for (let i = 0; i <= numFrames; i++) {
                        const progress = Math.min(1.0, i / numFrames);
                        const timeMs = progress * durationMs;
                        
                        await this.renderFrameFn(progress);
                        
                        const bitmap = await createImageBitmap(this.canvas);
                        worker.postMessage({
                            type: 'ENCODE_FRAME',
                            data: {
                                bitmap,
                                timestamp: timeMs * 1000, // convert ms to microseconds
                                duration: frameDurationUs
                            }
                        }, [bitmap]);
                    }
                    worker.postMessage({ type: 'FINALIZE' });
                }
                else if (type === 'PROGRESS') {
                    if (onProgress) onProgress(data.queueSize);
                }
                else if (type === 'COMPLETE') {
                    const blob = new Blob([data], { type: format === 'webm' ? 'video/webm' : 'video/mp4' });
                    this._downloadBlob(blob, `animation-render.${format}`);
                    worker.terminate();
                    resolve();
                }
                else if (type === 'ERROR') {
                    console.error("Worker error:", error);
                    worker.terminate();
                    reject(error);
                }
            };

            worker.postMessage({
                type: 'CONFIG',
                data: {
                    width: this.canvas.width,
                    height: this.canvas.height,
                    fps: fps,
                    format: format,
                    bitrate: 8000000 // 8 mbps
                }
            });
        });
    }

    /**
     * Ultra-fast Real-time Native Recording
     */
    async recordRealtime(format = 'webm', fps = 60, durationMs = 5000) {
        return new Promise(async (resolve, reject) => {
            let mediaRecorder;
            let recordedChunks = [];
            
            try {
                const stream = this.canvas.captureStream(fps); 
                let options = { mimeType: `video/${format};codecs=vp9` };
                
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    options = { mimeType: `video/${format}` };
                    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                        options = { mimeType: 'video/webm' };
                    }
                }
                options.videoBitsPerSecond = 8000000; 

                mediaRecorder = new MediaRecorder(stream, options);
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) recordedChunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: options.mimeType.split(';')[0] });
                    const ext = options.mimeType.includes('mp4') ? 'mp4' : 'webm';
                    this._downloadBlob(blob, `animation-record.${ext}`);
                    resolve();
                };

                // Pump a starting frame
                await this.renderFrameFn(0);
                mediaRecorder.start();
                await new Promise(r => setTimeout(r, 200)); // buffer start
                
                const startTime = performance.now();
                
                const animLoop = async (currentTime) => {
                    const elapsed = Math.max(0, currentTime - startTime);
                    let p = durationMs > 0 ? elapsed / durationMs : 1.0;
                    p = Math.max(0, Math.min(1, p));
                    
                    await this.renderFrameFn(p);

                    if (p < 1.0) {
                        requestAnimationFrame(animLoop);
                    } else {
                        setTimeout(() => mediaRecorder.stop(), 500); // 500ms post-roll
                    }
                };
                
                requestAnimationFrame(animLoop);

            } catch (err) {
                console.error("Recording failed:", err);
                reject(err);
            }
        });
    }

    _downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
}
