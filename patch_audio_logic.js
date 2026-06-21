const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

const renderAudioLibraryFunction = `
        let audioLibSource = null;
        let audioLibAnimationFrame = null;
        let audioLibStartTime = 0;

        function setSidebarTab(tab) {
            State.sidebarTab = tab;
            
            const btnProps = document.getElementById('tabProperties');
            const btnAudio = document.getElementById('tabAudioLib');
            
            if (btnProps && btnAudio) {
                if (tab === 'properties') {
                    btnProps.className = "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors bg-white dark:bg-surface-700 text-brand-500 shadow-sm";
                    btnAudio.className = "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200";
                } else {
                    btnAudio.className = "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors bg-white dark:bg-surface-700 text-brand-500 shadow-sm";
                    btnProps.className = "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200";
                }
            }
            
            updateSidebarPanel();
        }

        function renderAudioLibrary() {
            sidebarContent.className = "flex flex-col gap-4 p-4 w-full flex-1 min-h-0 overflow-y-auto";
            
            let html = \`
                <div class="flex items-center justify-between shrink-0">
                    <h3 class="text-sm font-bold text-surface-900 dark:text-white">Audio Library</h3>
                    <label class="cursor-pointer bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-2">
                        <i data-lucide="upload" class="w-3 h-3"></i> Import
                        <input type="file" multiple accept="audio/*" class="hidden" onchange="handleAudioLibraryImport(event)">
                    </label>
                </div>
            \`;

            if (State.audioLibrary.length === 0) {
                html += \`
                    <div class="flex flex-col items-center justify-center text-surface-500 py-12 border-2 border-dashed border-surface-300 dark:border-surface-700 rounded-lg">
                        <i data-lucide="music" class="w-8 h-8 mb-2 opacity-50"></i>
                        <p class="text-xs text-center px-4">Import sound effects, music, or dialogue.</p>
                    </div>
                \`;
            } else {
                html += \`<div class="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">\`;
                State.audioLibrary.forEach(audio => {
                    const isSelected = State.selectedAudioLibId === audio.id;
                    const durationStr = (audio.duration).toFixed(1) + 's';
                    html += \`
                        <div onclick="selectAudioLibItem('\${audio.id}')" class="flex items-center justify-between p-2 rounded cursor-pointer transition-colors \${isSelected ? 'bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30' : 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-brand-300'}">
                            <div class="flex items-center gap-2 truncate">
                                <i data-lucide="\${isSelected && audio.isPlaying ? 'pause-circle' : 'music'}" class="w-4 h-4 \${isSelected ? 'text-brand-500' : 'text-surface-400'} shrink-0"></i>
                                <span class="text-xs font-medium truncate \${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-surface-700 dark:text-surface-300'}">\${audio.name}</span>
                            </div>
                            <span class="text-[10px] text-surface-400 font-mono shrink-0">\${durationStr}</span>
                        </div>
                    \`;
                });
                html += \`</div>\`;
            }

            if (State.selectedAudioLibId) {
                const audio = State.audioLibrary.find(a => a.id === State.selectedAudioLibId);
                if (audio) {
                    html += \`
                        <div class="mt-auto pt-4 border-t border-surface-200 dark:border-surface-700 flex flex-col gap-3 shrink-0">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold text-surface-900 dark:text-white truncate pr-2">\${audio.name}</span>
                                <button onclick="addAudioLibToTimeline()" class="bg-surface-900 dark:bg-white text-white dark:text-surface-900 px-3 py-1.5 rounded text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0">
                                    <i data-lucide="plus" class="w-3 h-3"></i> Add
                                </button>
                            </div>
                            
                            <div class="relative w-full h-16 bg-surface-100 dark:bg-surface-800 rounded select-none" id="audioLibWaveformContainer">
                                <canvas id="audioLibWaveform" class="absolute inset-0 w-full h-full rounded"></canvas>
                                <div id="audioLibTrimOverlay" class="absolute inset-y-0 bg-brand-500/20 border-x border-brand-500 pointer-events-none"></div>
                                <div id="audioLibHandleL" class="absolute top-0 bottom-0 w-4 -ml-2 cursor-ew-resize flex items-center justify-center group z-10" onmousedown="startAudioLibTrim(event, 'left')">
                                    <div class="w-1 h-8 bg-brand-500 rounded-full group-hover:bg-brand-400 shadow-sm"></div>
                                </div>
                                <div id="audioLibHandleR" class="absolute top-0 bottom-0 w-4 -ml-2 cursor-ew-resize flex items-center justify-center group z-10" onmousedown="startAudioLibTrim(event, 'right')">
                                    <div class="w-1 h-8 bg-brand-500 rounded-full group-hover:bg-brand-400 shadow-sm"></div>
                                </div>
                                <div id="audioLibPlayhead" class="absolute top-0 bottom-0 w-[2px] bg-red-500 pointer-events-none hidden z-20"></div>
                            </div>
                            
                            <div class="flex items-center justify-center">
                                <button onclick="toggleAudioLibPlayback()" class="p-2 rounded-full \${audio.isPlaying ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-brand-50 dark:bg-surface-800 text-brand-600 dark:text-brand-400 hover:bg-brand-100'} transition-colors">
                                    <i data-lucide="\${audio.isPlaying ? 'square' : 'play'}" class="w-5 h-5 fill-current"></i>
                                </button>
                            </div>
                        </div>
                    \`;
                }
            }

            sidebarContent.innerHTML = html;
            lucide.createIcons();
            
            if (State.selectedAudioLibId) {
                drawAudioLibWaveform();
                updateAudioLibHandles();
            }
        }

        async function handleAudioLibraryImport(event) {
            const files = event.target.files;
            if (!files.length) return;
            
            if (!audioCtx) audioCtx = new AudioContext();
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const arrayBuffer = await file.arrayBuffer();
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                
                const channelData = audioBuffer.getChannelData(0);
                const step = Math.ceil(channelData.length / 200);
                const peaks = [];
                for (let j = 0; j < 200; j++) {
                    let min = 1.0, max = -1.0;
                    for (let k = 0; k < step; k++) {
                        const datum = channelData[(j * step) + k];
                        if (datum < min) min = datum;
                        if (datum > max) max = datum;
                    }
                    peaks.push(Math.max(Math.abs(min), Math.abs(max)));
                }
                
                State.audioLibrary.push({
                    id: 'lib_' + Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    file: file,
                    buffer: audioBuffer,
                    duration: audioBuffer.duration,
                    peaks: peaks,
                    inPoint: 0,
                    outPoint: audioBuffer.duration,
                    isPlaying: false
                });
            }
            
            updateSidebarPanel();
        }

        function selectAudioLibItem(id) {
            stopAudioLibPlayback();
            State.selectedAudioLibId = id;
            updateSidebarPanel();
        }

        function drawAudioLibWaveform() {
            const canvas = document.getElementById('audioLibWaveform');
            if (!canvas) return;
            
            const audio = State.audioLibrary.find(a => a.id === State.selectedAudioLibId);
            if (!audio) return;
            
            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;
            ctx.scale(dpr, dpr);
            
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            
            ctx.clearRect(0, 0, w, h);
            
            ctx.fillStyle = isDarkMode ? '#334155' : '#e2e8f0';
            const barWidth = w / audio.peaks.length;
            
            audio.peaks.forEach((peak, i) => {
                const barH = peak * h;
                ctx.fillRect(i * barWidth, (h - barH) / 2, Math.max(1, barWidth - 0.5), barH);
            });
        }

        function updateAudioLibHandles() {
            const container = document.getElementById('audioLibWaveformContainer');
            if (!container) return;
            const audio = State.audioLibrary.find(a => a.id === State.selectedAudioLibId);
            if (!audio) return;
            
            const w = container.clientWidth;
            const leftPx = (audio.inPoint / audio.duration) * w;
            const rightPx = (audio.outPoint / audio.duration) * w;
            
            document.getElementById('audioLibHandleL').style.left = \`\${leftPx}px\`;
            document.getElementById('audioLibHandleR').style.left = \`\${rightPx}px\`;
            
            const overlay = document.getElementById('audioLibTrimOverlay');
            overlay.style.left = \`\${leftPx}px\`;
            overlay.style.width = \`\${rightPx - leftPx}px\`;
        }

        function startAudioLibTrim(e, side) {
            e.preventDefault();
            const container = document.getElementById('audioLibWaveformContainer');
            const audio = State.audioLibrary.find(a => a.id === State.selectedAudioLibId);
            if (!container || !audio) return;
            
            const w = container.clientWidth;
            const rect = container.getBoundingClientRect();
            
            function onMove(me) {
                let px = me.clientX - rect.left;
                px = Math.max(0, Math.min(px, w));
                let time = (px / w) * audio.duration;
                
                if (side === 'left') {
                    time = Math.min(time, audio.outPoint - 0.1);
                    audio.inPoint = time;
                } else {
                    time = Math.max(time, audio.inPoint + 0.1);
                    audio.outPoint = time;
                }
                updateAudioLibHandles();
            }
            
            function onUp() {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
            }
            
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        }

        function toggleAudioLibPlayback() {
            const audio = State.audioLibrary.find(a => a.id === State.selectedAudioLibId);
            if (!audio) return;
            
            if (audio.isPlaying) {
                stopAudioLibPlayback();
            } else {
                playAudioLibItem(audio);
            }
        }

        function playAudioLibItem(audio) {
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            stopAudioLibPlayback();
            
            audioLibSource = audioCtx.createBufferSource();
            audioLibSource.buffer = audio.buffer;
            audioLibSource.connect(audioCtx.destination);
            
            const durationToPlay = audio.outPoint - audio.inPoint;
            audioLibSource.start(0, audio.inPoint, durationToPlay);
            
            audio.isPlaying = true;
            audioLibStartTime = audioCtx.currentTime - audio.inPoint;
            updateSidebarPanel();
            
            const playhead = document.getElementById('audioLibPlayhead');
            const container = document.getElementById('audioLibWaveformContainer');
            
            if (playhead && container) {
                playhead.classList.remove('hidden');
                const w = container.clientWidth;
                
                function loop() {
                    if (!audio.isPlaying) return;
                    let currentPlayTime = audioCtx.currentTime - audioLibStartTime;
                    if (currentPlayTime >= audio.outPoint) {
                        stopAudioLibPlayback();
                        return;
                    }
                    const px = (currentPlayTime / audio.duration) * w;
                    playhead.style.left = \`\${px}px\`;
                    audioLibAnimationFrame = requestAnimationFrame(loop);
                }
                audioLibAnimationFrame = requestAnimationFrame(loop);
            }
            
            audioLibSource.onended = () => {
                if (audio.isPlaying) {
                    stopAudioLibPlayback();
                }
            };
        }

        function stopAudioLibPlayback() {
            const audio = State.audioLibrary.find(a => a.id === State.selectedAudioLibId);
            if (audio) {
                audio.isPlaying = false;
                updateSidebarPanel();
            }
            
            if (audioLibSource) {
                try { audioLibSource.stop(); } catch(e) {}
                audioLibSource = null;
            }
            if (audioLibAnimationFrame) {
                cancelAnimationFrame(audioLibAnimationFrame);
                audioLibAnimationFrame = null;
            }
            const playhead = document.getElementById('audioLibPlayhead');
            if (playhead) playhead.classList.add('hidden');
        }

        async function addAudioLibToTimeline() {
            const audio = State.audioLibrary.find(a => a.id === State.selectedAudioLibId);
            if (!audio) return;
            
            stopAudioLibPlayback();
            
            const trimmedDuration = audio.outPoint - audio.inPoint;
            
            const clip = {
                id: 'clip_' + Math.random().toString(36).substr(2, 9),
                type: 'audio',
                name: audio.name,
                duration: trimmedDuration,
                startTime: State.currentTime,
                sourceOffset: audio.inPoint,
                track: 0,
                color: 'bg-green-500',
                buffer: audio.buffer,
                file: audio.file,
                effects: { volume: 1 }
            };
            
            const peaks = [];
            const step = Math.ceil(audio.buffer.length / 50);
            const channelData = audio.buffer.getChannelData(0);
            for(let i=0; i<50; i++) {
                let min=1.0, max=-1.0;
                for(let j=0; j<step; j++) {
                    const datum = channelData[(i*step)+j];
                    if(datum < min) min = datum;
                    if(datum > max) max = datum;
                }
                peaks.push(Math.max(Math.abs(min), Math.abs(max)));
            }
            clip.peaks = peaks;
            
            State.clips.push(clip);
            renderTimeline();
            drawCanvas();
        }
`;

const insertPoint = `        // --- Quick Action Handlers ---`;
if (!content.includes("function setSidebarTab")) {
    content = content.replace(insertPoint, renderAudioLibraryFunction + '\n' + insertPoint);
}

fs.writeFileSync(file, content);
console.log('Audio logic functions injected safely.');
