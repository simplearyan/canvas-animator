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
            const isPngSeq = format === 'png-sequence' || format === 'png_sequence';
            const workerUrl = isPngSeq 
                ? new URL('./zip.worker.js', import.meta.url) 
                : new URL('./mediabunny.worker.js', import.meta.url);
            
            const worker = new Worker(workerUrl, { type: 'module' });
            
            const numFrames = Math.ceil((durationMs / 1000) * fps);
            const microDtMs = 1000000 / fps;

            let currentFrame = 0;
            let pendingFrames = 0;
            
            worker.onmessage = async (e) => {
                const { type, data, error } = e.data;
                
                if (type === 'READY') {
                    const pushNextBatch = async () => {
                        while (currentFrame <= numFrames) {
                            if (pendingFrames > 12) {
                                await new Promise(r => setTimeout(r, 20));
                                continue;
                            }

                            const progress = Math.min(1.0, currentFrame / numFrames);
                            await this.renderFrameFn(progress);
                            await new Promise(r => setTimeout(r, 0)); 
                            
                            const bitmap = await createImageBitmap(this.canvas);
                            
                            worker.postMessage({
                                type: 'ENCODE_FRAME',
                                data: {
                                    bitmap,
                                    timestamp: Math.round(currentFrame * microDtMs),
                                    duration: Math.round(microDtMs)
                                }
                            }, [bitmap]);

                            currentFrame++;
                            pendingFrames++;

                            if (onProgress) {
                                onProgress({ current: currentFrame, total: numFrames, pending: pendingFrames });
                            }
                        }
                        worker.postMessage({ type: 'FINALIZE' });
                    };
                    pushNextBatch();
                }
                else if (type === 'FRAME_DONE') {
                    pendingFrames--;
                }
                else if (type === 'COMPLETE') {
                    let mimeType = 'video/mp4';
                    if (format === 'webm') mimeType = 'video/webm';
                    if (format === 'mov') mimeType = 'video/quicktime';
                    if (isPngSeq) mimeType = 'application/zip';
                    
                    const blob = new Blob([data], { type: mimeType });
                    const ext = isPngSeq ? 'zip' : format;
                    this._downloadBlob(blob, `animation-render.${ext}`);
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
                    bitrate: 8000000
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
