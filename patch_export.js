const fs = require('fs');

let html = fs.readFileSync('audio-editor ✅✅/studiopro_editor_text.html', 'utf8');

// 1. Replace the Export Menu in Navbar
let startExportMenu = html.indexOf('            <!-- Export Menu -->');
let endExportMenu = html.indexOf('            <!-- Workspace Settings Menu -->');
if (startExportMenu !== -1 && endExportMenu !== -1) {
    let oldMenu = html.substring(startExportMenu, endExportMenu);
    let newMenu = `            <!-- Export Button -->
            <div class="relative">
                <button onclick="openExportModal()" class="bg-surface-900 hover:bg-black dark:bg-white dark:hover:bg-surface-100 text-white dark:text-surface-900 px-3 sm:px-4 py-1.5 rounded-md text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <i data-lucide="download" class="w-3.5 h-3.5"></i> <span class="hidden sm:inline">Export</span>
                </button>
            </div>

`;
    html = html.replace(oldMenu, newMenu);
}

// 2. Replace the old exportOverlay
let startOverlay = html.indexOf('    <!-- Export Overlay -->');
let endOverlay = html.indexOf('    <!-- Compact Professional Navbar -->');
if (startOverlay !== -1 && endOverlay !== -1) {
    let oldOverlay = html.substring(startOverlay, endOverlay);
    let newOverlay = `    <!-- Export Overlay -->
    <div id="exportOverlay" class="fixed inset-0 bg-surface-950/80 backdrop-blur-sm z-[100] hidden flex-col items-center justify-center p-4 transition-all duration-300">
        
        <!-- Settings State -->
        <div id="exportSettings" class="bg-white dark:bg-surface-800 p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col max-w-md w-full border border-surface-200 dark:border-surface-700">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-2"><i data-lucide="download" class="w-5 h-5 text-brand-500"></i> Export Media</h2>
                <button onclick="closeExportModal()" class="text-surface-500 hover:text-surface-900 dark:hover:text-white bg-surface-100 dark:bg-surface-900 p-1.5 rounded-md"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            
            <div class="space-y-5">
                <div>
                    <label class="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-2">Format</label>
                    <div class="grid grid-cols-2 gap-2">
                        <label class="cursor-pointer">
                            <input type="radio" name="exportFormat" value="video" class="peer sr-only" checked>
                            <div class="p-3 border border-surface-200 dark:border-surface-700 rounded-lg peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-900/20 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                                <div class="font-bold text-sm text-surface-900 dark:text-white mb-0.5">MP4 Video</div>
                                <div class="text-[10px] text-surface-500">Standard web video</div>
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" name="exportFormat" value="gif" class="peer sr-only">
                            <div class="p-3 border border-surface-200 dark:border-surface-700 rounded-lg peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-900/20 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                                <div class="font-bold text-sm text-surface-900 dark:text-white mb-0.5">GIF Animation</div>
                                <div class="text-[10px] text-surface-500">Looping image sequence</div>
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" name="exportFormat" value="audio-webm" class="peer sr-only">
                            <div class="p-3 border border-surface-200 dark:border-surface-700 rounded-lg peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-900/20 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                                <div class="font-bold text-sm text-surface-900 dark:text-white mb-0.5">Audio (.webm)</div>
                                <div class="text-[10px] text-surface-500">WebM audio format</div>
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" name="exportFormat" value="audio-wav" class="peer sr-only">
                            <div class="p-3 border border-surface-200 dark:border-surface-700 rounded-lg peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-900/20 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                                <div class="font-bold text-sm text-surface-900 dark:text-white mb-0.5">WAV Audio</div>
                                <div class="text-[10px] text-surface-500">Uncompressed audio</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-2">Duration Scope</label>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2 text-sm font-semibold text-surface-700 dark:text-surface-300 cursor-pointer">
                            <input type="radio" name="exportScope" value="full" class="text-brand-500 focus:ring-brand-500 bg-surface-100 border-surface-300 dark:bg-surface-900 dark:border-surface-700" checked onchange="document.getElementById('customRangeInputs').classList.add('hidden')">
                            Full Timeline
                        </label>
                        <label class="flex items-center gap-2 text-sm font-semibold text-surface-700 dark:text-surface-300 cursor-pointer">
                            <input type="radio" name="exportScope" value="custom" class="text-brand-500 focus:ring-brand-500 bg-surface-100 border-surface-300 dark:bg-surface-900 dark:border-surface-700" onchange="document.getElementById('customRangeInputs').classList.remove('hidden')">
                            Custom Range
                        </label>
                    </div>
                </div>

                <div id="customRangeInputs" class="grid grid-cols-2 gap-4 hidden bg-surface-50 dark:bg-surface-900/50 p-4 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div>
                        <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Start Time (sec)</label>
                        <input type="number" id="exportStartTime" value="0" min="0" step="0.1" class="w-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm font-mono rounded-md px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none shadow-inner">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">End Time (sec)</label>
                        <input type="number" id="exportEndTime" value="10" min="0" step="0.1" class="w-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm font-mono rounded-md px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none shadow-inner">
                    </div>
                </div>
            </div>

            <div class="mt-8 flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-700">
                <button onclick="closeExportModal()" class="px-4 py-2 text-sm font-bold text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-700 rounded-md transition-colors">Cancel</button>
                <button onclick="submitExport()" class="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-md shadow-sm transition-colors flex items-center gap-2">Start Export <i data-lucide="arrow-right" class="w-4 h-4"></i></button>
            </div>
        </div>

        <!-- Rendering State -->
        <div id="exportProgress" class="bg-white dark:bg-surface-800 p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full border border-surface-200 dark:border-surface-700 hidden">
            <i data-lucide="loader-2" class="w-10 h-10 text-brand-500 animate-spin mb-4"></i>
            <h3 class="text-base font-semibold text-surface-900 dark:text-white mb-1">Rendering Masterpiece</h3>
            <p class="text-xs text-surface-500 dark:text-surface-400 mb-6 text-center leading-relaxed">Processing in real-time. Please do not close or switch tabs during export.</p>
            <div class="w-full bg-surface-100 dark:bg-surface-900 h-2.5 rounded-full overflow-hidden mb-2 border border-surface-200 dark:border-surface-700 shadow-inner">
                <div id="exportProgressBar" class="h-full bg-brand-500 w-0 ease-linear transition-all duration-75 relative overflow-hidden">
                    <div class="absolute inset-0 bg-white/20" style="background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent); background-size: 1rem 1rem; animation: progress-stripes 1s linear infinite;"></div>
                </div>
            </div>
            <p id="exportProgressText" class="text-sm font-bold text-brand-500 font-mono mb-6">0%</p>
            <button onclick="cancelExport()" class="px-4 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded border border-transparent hover:border-red-200 dark:hover:border-red-500/30 transition-all">Cancel Rendering</button>
        </div>
        <style>@keyframes progress-stripes { from { background-position: 1rem 0; } to { background-position: 0 0; } }</style>
    </div>
`;
    html = html.replace(oldOverlay, newOverlay);
}


// 3. Remove old dropdown event listeners
let startListener = html.indexOf("            document.querySelectorAll('.export-option').forEach");
let endListener = html.indexOf("            });", startListener) + 15;
if (startListener !== -1 && endListener !== -1) {
    let oldListener = html.substring(startListener, endListener);
    html = html.replace(oldListener, ""); // remove it entirely
}


// 4. Append new functions at the end of the script, right before </script>
let startExportFunc = html.indexOf('        function startExport(format) {');
let endExportFunc = html.indexOf('        function exportLoop(now) {');
endExportFunc = html.indexOf('        }', endExportFunc + 100) + 10; 

if (startExportFunc !== -1) {
    let newLogic = `
        function openExportModal() {
            document.getElementById('exportEndTime').value = State.duration.toFixed(1);
            document.getElementById('exportOverlay').classList.remove('hidden');
            document.getElementById('exportOverlay').classList.add('flex');
            document.getElementById('exportSettings').classList.remove('hidden');
            document.getElementById('exportProgress').classList.add('hidden');
        }

        function closeExportModal() {
            document.getElementById('exportOverlay').classList.add('hidden');
            document.getElementById('exportOverlay').classList.remove('flex');
        }

        function cancelExport() {
            if (State.isExporting) {
                State.cancelExport = true;
            } else {
                closeExportModal();
            }
        }

        function submitExport() {
            const format = document.querySelector('input[name="exportFormat"]:checked').value;
            const scope = document.querySelector('input[name="exportScope"]:checked').value;
            
            let startT = 0;
            let endT = State.duration;
            
            if (scope === 'custom') {
                startT = parseFloat(document.getElementById('exportStartTime').value) || 0;
                endT = parseFloat(document.getElementById('exportEndTime').value) || State.duration;
            }
            
            document.getElementById('exportSettings').classList.add('hidden');
            document.getElementById('exportProgress').classList.remove('hidden');
            document.getElementById('exportProgressBar').style.width = '0%';
            document.getElementById('exportProgressText').textContent = '0%';
            
            startExport(format, startT, endT);
        }

        function startExport(format, startTime, endTime) {
            if (State.isExporting) return;
            ensureAudioContext();
            
            State.isExporting = true;
            State.cancelExport = false;
            
            stopMedia();
            State.currentTime = startTime;
            
            const canvasEl = document.getElementById('renderCanvas');
            let finalStream;
            let mimeType;
            let extension;

            if (format === 'video' || format === 'gif') {
                const canvasStream = canvasEl.captureStream(30);
                const audioTracks = State.masterStreamNode.stream.getAudioTracks();
                if (audioTracks.length > 0) {
                    finalStream = new MediaStream([...canvasStream.getVideoTracks(), ...audioTracks]);
                } else {
                    finalStream = canvasStream;
                }
                mimeType = 'video/webm;codecs=vp9,opus';
                extension = format === 'gif' ? 'gif.webm' : 'webm'; // Browser can't export native gif from canvas
            } else {
                finalStream = State.masterStreamNode.stream;
                if (format === 'audio-wav') {
                    mimeType = 'audio/webm'; 
                    extension = 'wav';
                } else if (format === 'audio-mp3') {
                    mimeType = 'audio/webm';
                    extension = 'mp3';
                } else {
                    mimeType = 'audio/webm;codecs=opus'; 
                    extension = 'webm';
                }
            }

            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = format.includes('video') || format === 'gif' ? 'video/webm' : 'audio/webm';
            }

            const recorder = new MediaRecorder(finalStream, { mimeType: mimeType });
            const chunks = [];
            
            recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
            
            recorder.onstop = () => {
                if (!State.cancelExport) {
                    const blob = new Blob(chunks, { type: mimeType });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = \`StudioPro_Export.\${extension}\`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
                
                State.isExporting = false;
                closeExportModal();
                stopMedia();
            };

            State.lastRenderTime = performance.now();
            updatePlayhead();
            
            State.clips.forEach(clip => {
                const el = clip.audioEl || clip.videoEl;
                if (el && clip.start < endTime && (clip.start + clip.duration) > startTime) {
                    if (clip.audioEl) applyAudioEffects(clip);
                    
                    const offset = Math.max(0, startTime - clip.start);
                    el.currentTime = clip.sourceOffset + offset;
                    
                    if (startTime >= clip.start) {
                        el.play().catch(e=>{});
                    }
                }
            });

            recorder.start();
            
            function exportLoop(now) {
                if (!State.isExporting) return;

                if (State.cancelExport) {
                    recorder.stop();
                    return;
                }

                const dt = (now - State.lastRenderTime) / 1000;
                State.lastRenderTime = now;
                State.currentTime += dt;

                State.clips.forEach(clip => {
                    const el = clip.audioEl || clip.videoEl;
                    if (el) {
                        // Start media if playhead reaches its start
                        if (State.currentTime >= clip.start && (State.currentTime - dt) < clip.start) {
                            el.currentTime = clip.sourceOffset;
                            el.play().catch(e=>{});
                        }
                        // Stop media if playhead passes it
                        if (State.currentTime > clip.start + clip.duration) {
                            if (!el.paused) el.pause();
                        }
                    }
                });

                const durationRange = endTime - startTime;
                const elapsed = State.currentTime - startTime;
                const progress = Math.min(100, Math.max(0, Math.round((elapsed / durationRange) * 100)));
                
                document.getElementById('exportProgressBar').style.width = \`\${progress}%\`;
                document.getElementById('exportProgressText').textContent = \`\${progress}%\`;

                if (State.currentTime >= endTime) {
                    recorder.stop();
                } else {
                    requestAnimationFrame(exportLoop);
                }
            }
            requestAnimationFrame(exportLoop);
        }
`;
    // Find the end of `exportLoop` and replace the whole block
    let oldLogicBlock = html.substring(startExportFunc, endExportFunc);
    // The previous block ended with `requestAnimationFrame(exportLoop); }`
    let nextBrace = html.indexOf('}', html.indexOf('requestAnimationFrame(exportLoop);', startExportFunc));
    oldLogicBlock = html.substring(startExportFunc, nextBrace + 1);

    html = html.replace(oldLogicBlock, newLogic);
}

fs.writeFileSync('audio-editor ✅✅/studiopro_editor_text.html', html, 'utf8');
console.log('Export Modal UI and Logic patched!');
