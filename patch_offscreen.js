const fs = require('fs');

let html = fs.readFileSync('audio-editor ✅✅/studiopro_editor_text.html', 'utf8');

// 1. Refactor drawCanvas definition
let oldDrawCanvas = `        function drawCanvas() {
            const canvas = document.getElementById('renderCanvas');
            const ctx = canvas.getContext('2d');
            const placeholder = document.getElementById('previewPlaceholder');

            const { w, h } = updateCanvasResolution();
            ctx.clearRect(0, 0, w, h);`;
let newDrawCanvas = `        function drawCanvas(targetCtx, targetW, targetH) {
            const canvas = document.getElementById('renderCanvas');
            const ctx = targetCtx || canvas.getContext('2d');
            const placeholder = document.getElementById('previewPlaceholder');

            let w, h;
            if (targetCtx && targetW && targetH) {
                w = targetW;
                h = targetH;
            } else {
                const res = updateCanvasResolution();
                w = res.w;
                h = res.h;
            }
            ctx.clearRect(0, 0, w, h);`;

html = html.replace(oldDrawCanvas, newDrawCanvas);

// 2. Refactor startExport to create offscreen canvas
let oldStartExportBlock = `            const canvasEl = document.getElementById('renderCanvas');
            let finalStream;
            let mimeType;
            let extension;

            if (format === 'video' || format === 'gif') {
                const canvasStream = canvasEl.captureStream(30);
                const audioTracks = State.masterStreamNode.stream.getAudioTracks();`;

let newStartExportBlock = `            let exportCanvas = null;
            let exportCtx = null;
            let exportW, exportH;
            
            let finalStream;
            let mimeType;
            let extension;

            if (format === 'video' || format === 'gif') {
                const aspectStr = ASPECT_RATIOS[State.preview.aspectIndex].value;
                const [wRatio, hRatio] = aspectStr.split('/').map(Number);
                const baseRes = State.exportResolution || 1920;
                
                if (wRatio >= hRatio) {
                    exportW = baseRes;
                    exportH = baseRes * (hRatio / wRatio);
                } else {
                    exportH = baseRes;
                    exportW = baseRes * (wRatio / hRatio);
                }
                
                exportCanvas = document.createElement('canvas');
                exportCanvas.width = exportW;
                exportCanvas.height = exportH;
                exportCtx = exportCanvas.getContext('2d');
                
                const canvasStream = exportCanvas.captureStream(30);
                const audioTracks = State.masterStreamNode.stream.getAudioTracks();`;

html = html.replace(oldStartExportBlock, newStartExportBlock);

// 3. Update recorder.onstop to reset resolution safely
let oldRecorderOnStop = `            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = \`export_\${Date.now()}.\${extension}\`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
                
                State.isExporting = false;
                closeExportModal();
                stopMedia();
            };`;

let newRecorderOnStop = `            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = \`export_\${Date.now()}.\${extension}\`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
                
                State.isExporting = false;
                State.exportResolution = 1920;
                closeExportModal();
                stopMedia();
            };`;
            
html = html.replace(oldRecorderOnStop, newRecorderOnStop);

// 4. Update exportLoop to pass the offscreen context
let oldExportLoopDraw = `                });

                drawCanvas();

                const durationRange = endTime - startTime;`;

let newExportLoopDraw = `                });

                if (exportCanvas && exportCtx) {
                    drawCanvas(exportCtx, exportW, exportH);
                } else {
                    drawCanvas();
                }

                const durationRange = endTime - startTime;`;

html = html.replace(oldExportLoopDraw, newExportLoopDraw);

// Update updateCanvasResolution to completely ignore State.exportResolution
// since the main canvas should ALWAYS preview at max 1920 (or less based on CSS)
// offscreen canvas handles the real export resolution!
let oldUpdateRes = `        function updateCanvasResolution() {
            const canvas = document.getElementById('renderCanvas');
            const aspectStr = ASPECT_RATIOS[State.preview.aspectIndex].value;
            const [wRatio, hRatio] = aspectStr.split('/').map(Number);
            
            const baseRes = State.exportResolution || 1920;
            
            let targetW, targetH;
            if (wRatio >= hRatio) {
                targetW = baseRes;
                targetH = baseRes * (hRatio / wRatio);
            } else {
                targetH = baseRes;
                targetW = baseRes * (wRatio / hRatio);
            }`;
let newUpdateRes = `        function updateCanvasResolution() {
            const canvas = document.getElementById('renderCanvas');
            const aspectStr = ASPECT_RATIOS[State.preview.aspectIndex].value;
            const [wRatio, hRatio] = aspectStr.split('/').map(Number);
            
            const baseRes = 1920; // Always 1920 for UI Preview
            
            let targetW, targetH;
            if (wRatio >= hRatio) {
                targetW = baseRes;
                targetH = baseRes * (hRatio / wRatio);
            } else {
                targetH = baseRes;
                targetW = baseRes * (wRatio / hRatio);
            }`;
html = html.replace(oldUpdateRes, newUpdateRes);

fs.writeFileSync('audio-editor ✅✅/studiopro_editor_text.html', html, 'utf8');
console.log('Off-canvas export architecture injected!');
