
        lucide.createIcons();

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        let audioCtx;

        let isDarkMode = document.documentElement.classList.contains('dark'); 

        // --- Color Palettes (Vibrant Pastel BG & Deep Waveforms) ---
        const PALETTES = [
            { bg: '#bbf7d0', border: '#4ade80', wave: '#16a34a', text: '#14532d' }, // Vivid Mint
            { bg: '#bfdbfe', border: '#60a5fa', wave: '#2563eb', text: '#1e3a8a' }, // Vivid Blue
            { bg: '#e9d5ff', border: '#c084fc', wave: '#9333ea', text: '#581c87' }, // Vivid Purple
            { bg: '#fecaca', border: '#f87171', wave: '#dc2626', text: '#7f1d1d' }, // Vivid Red
            { bg: '#fef08a', border: '#facc15', wave: '#ca8a04', text: '#713f12' }, // Vivid Yellow
            { bg: '#e5e7eb', border: '#9ca3af', wave: '#4b5563', text: '#1f2937' }  // Vivid Gray
        ];

        // --- State Management ---
        const State = {
            pixelsPerSecond: 50,
            duration: 60,
            currentTime: 0,
            isPlaying: false,
            isExporting: false,
            lastRenderTime: 0,
            selectedClipId: null,
            activePropertyTab: 'volume', 
            masterStreamNode: null, 
            canvasBgColor: '#231F20',
            
            tracks: [
                { id: 'v1', type: 'video', name: 'V1', height: 90, colorIndex: 0, muted: false }, 
                { id: 'a1', type: 'audio', name: 'A1', height: 90, colorIndex: 1, muted: false },
                { id: 'a2', type: 'audio', name: 'A2', height: 90, colorIndex: 2, muted: false }
            ],
            clips: [],

            drag: {
                active: false,
                type: null,
                clipId: null,
                startX: 0,
                initialStart: 0,
                initialDuration: 0,
                initialSourceOffset: 0,
                initialTrackId: null
            },
            
            preview: { hidden: false, aspectIndex: 0 },
            layout: { isSideBySide: false },
            inspector: { visible: false, dock: 'left', fullWidth: false, width: 320 }
        };

        const ASPECT_RATIOS = [
            { label: '16:9', value: '16/9', icon: 'monitor' },
            { label: '9:16', value: '9/16', icon: 'smartphone' },
            { label: '4:3', value: '4/3', icon: 'tv' },
            { label: '3:4', value: '3/4', icon: 'tablet' },
            { label: '1:1', value: '1/1', icon: 'square' },
            { label: '21:9 (Cinematic)', value: '21/9', icon: 'film' }
        ];

        // --- DOM Elements ---
        const trackHeadersContainer = document.getElementById('trackHeaders');
        const tracksContentContainer = document.getElementById('tracksContent');
        const timelineScrollArea = document.getElementById('timelineScrollArea');
        const rulerWrapper = document.getElementById('rulerWrapper');
        const rulerCanvas = document.getElementById('rulerCanvas');
        const playhead = document.getElementById('playhead');
        const rulerPlayhead = document.getElementById('rulerPlayhead');
        const playheadTimePopup = document.getElementById('playheadTimePopup');
        const timeDisplay = document.getElementById('timeDisplay');
        const previewTimeText = document.getElementById('previewTimeText');
        const btnZoomIn = document.getElementById('btnZoomIn');
        const btnZoomOut = document.getElementById('btnZoomOut');
        const btnPlay = document.getElementById('btnPlay');
        const wrapperPlay = document.getElementById('wrapperPlay');
        const wrapperPause = document.getElementById('wrapperPause');
        const btnStop = document.getElementById('btnStop');
        const btnSplit = document.getElementById('btnSplit');
        const btnDelete = document.getElementById('btnDelete');
        const btnImport = document.getElementById('btnImport');
        const btnAddText = document.getElementById('btnAddText');
        const mediaInput = document.getElementById('mediaInput');
        const canvasColorPicker = document.getElementById('canvasColorPicker');
        const canvasColorIcon = document.getElementById('canvasColorIcon');
        const btnToggleTimecode = document.getElementById('btnToggleTimecode');
        
        // Header Properties & Sidebar
        const headerProperties = document.getElementById('headerProperties');
        const headerPropertiesPlaceholder = document.getElementById('headerPropertiesPlaceholder');
        const mainAppWrapper = document.getElementById('mainAppWrapper');
        const timelineContainer = document.getElementById('timelineContainer');
        const timelineWorkspace = document.getElementById('timelineWorkspace');
        const propertiesSidebar = document.getElementById('propertiesSidebar');
        const sidebarContent = document.getElementById('sidebarContent');
        const btnToggleInspector = document.getElementById('btnToggleInspector');
        const btnDockInspector = document.getElementById('btnDockInspector');
        const btnCloseInspector = document.getElementById('btnCloseInspector');
        const btnToggleWidth = document.getElementById('btnToggleWidth');
        const iconDock = document.getElementById('iconDock');
        const iconCloseInspector = document.getElementById('iconCloseInspector');
        const iconWidth = document.getElementById('iconWidth');
        
        // Export & Views
        const btnExportMenu = document.getElementById('btnExportMenu');
        const exportDropdown = document.getElementById('exportDropdown');
        const exportOverlay = document.getElementById('exportOverlay');
        const exportProgressBar = document.getElementById('exportProgressBar');
        const exportProgressText = document.getElementById('exportProgressText');
        
        const btnViewMenu = document.getElementById('btnViewMenu');
        const viewDropdown = document.getElementById('viewDropdown');
        
        const btnToggleLayout = document.getElementById('btnToggleLayout');
        const iconLayout = document.getElementById('iconLayout');
        const mainWorkspace = document.getElementById('mainWorkspace');
        const btnToggleAspect = document.getElementById('btnToggleAspect');
        const btnTogglePreview = document.getElementById('btnTogglePreview');
        const btnToggleTimeline = document.getElementById('btnToggleTimeline');
        const btnToggleTheme = document.getElementById('btnToggleTheme');
        const previewContainer = document.getElementById('previewContainer');
        const previewWrapper = document.getElementById('previewWrapper');
        const canvasAspectWrapper = document.getElementById('canvasAspectWrapper');
        const iconAspect = document.getElementById('iconAspect');
        const iconEye = document.getElementById('iconEye');
        const iconTheme = document.getElementById('iconTheme');
        
        // Canvas Dragging State
        let canvasDrag = { active: false, clipId: null, startX: 0, startY: 0, initOffsetX: 0, initOffsetY: 0 };

        
        // --- Workspace Vertical Resizer (Timeline Height) ---
        const timelineResizer = document.getElementById('timelineResizer');
        let isResizingTimeline = false;
        let startTimelineY = 0;
        let startPreviewHeight = 0;

        if (timelineResizer && previewContainer) {
            timelineResizer.addEventListener('mousedown', (e) => {
                isResizingTimeline = true;
                startTimelineY = e.clientY;
                startPreviewHeight = previewContainer.offsetHeight;
                document.body.style.cursor = 'row-resize';
                document.body.style.userSelect = 'none';
            });

            window.addEventListener('mousemove', (e) => {
                if (!isResizingTimeline) return;
                const dy = e.clientY - startTimelineY;
                let newHeight = startPreviewHeight + dy;
                // Constraints
                const mainAppWrapper = document.getElementById('mainAppWrapper');
                const maxH = mainAppWrapper.offsetHeight - 140; // Leave space for timeline
                newHeight = Math.max(100, Math.min(maxH, newHeight));
                previewContainer.style.height = `${newHeight}px`;
                resizeCanvas();
            });

            window.addEventListener('mouseup', () => {
                if (isResizingTimeline) {
                    isResizingTimeline = false;
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                }
            });
        }

        // --- Track Height Scaling ---
        const btnToggleTrackHeight = document.getElementById('btnToggleTrackHeight');
        const TRACK_SIZES = {
            'small': { height: 45, next: 'medium' },
            'medium': { height: 90, next: 'large' },
            'large': { height: 130, next: 'small' }
        };
        let currentTrackSize = 'medium';

        if (btnToggleTrackHeight) {
            btnToggleTrackHeight.addEventListener('click', () => {
                currentTrackSize = TRACK_SIZES[currentTrackSize].next;
                const newHeight = TRACK_SIZES[currentTrackSize].height;
                State.tracks.forEach(t => t.height = newHeight);
                renderTrackHeaders();
                renderTracks();
                renderClips();
            });
        }

        // --- Initialization ---
        function init() {
            renderTrackHeaders();
            renderTracks();
            updateTimelineWidth();
            updatePlayhead();
            setupEventListeners();
            resizeCanvas();
            applyInspectorLayout();
        }

        function ensureAudioContext() {
            if (!audioCtx) {
                audioCtx = new AudioContext();
                State.masterStreamNode = audioCtx.createMediaStreamDestination();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }

        // --- Inspector Layout Logic ---
        function applyInspectorLayout() {
            const hasVisualClip = State.selectedClipId && ['image','video','text'].includes(State.clips.find(c=>c.id===State.selectedClipId)?.type);
            
            // Sync Menu Item State
            if (State.inspector.visible && hasVisualClip) {
                btnToggleInspector.classList.add('text-brand-600', 'dark:text-brand-400');
                btnToggleInspector.classList.remove('text-surface-700', 'dark:text-surface-300');
            } else {
                btnToggleInspector.classList.remove('text-brand-600', 'dark:text-brand-400');
                btnToggleInspector.classList.add('text-surface-700', 'dark:text-surface-300');
            }

            if (!State.inspector.visible || !hasVisualClip) {
                propertiesSidebar.classList.add('hidden');
                propertiesSidebar.classList.remove('flex');
                setTimeout(() => { updateTimelineWidth(); drawRuler(); resizeCanvas(); }, 10);
                return;
            }

            propertiesSidebar.classList.remove('hidden');
            propertiesSidebar.classList.add('flex');

            // Reset base classes that might conflict from different dock states
            propertiesSidebar.classList.remove('w-72', 'sm:w-80', 'w-full', 'h-full', 'h-56', 'sm:h-64', 'border-l', 'border-t', 'border-b', 'max-h-64', 'h-auto', 'border-r');
            sidebarContent.classList.remove('flex-col', 'flex-row', 'flex-wrap', 'flex-nowrap', 'overflow-x-auto');
            
            const resizer = document.getElementById('inspectorResizer');
            if (resizer) {
                resizer.classList.add('hidden');
                resizer.classList.remove('left-0', 'right-0', '-translate-x-1/2', 'translate-x-1/2');
            }
            propertiesSidebar.style.width = '';

            if (State.inspector.dock === 'right') {
                mainAppWrapper.appendChild(propertiesSidebar);
                mainAppWrapper.classList.remove('flex-col');
                mainAppWrapper.classList.add('flex-row');
                
                propertiesSidebar.classList.add('h-full', 'border-l');
                propertiesSidebar.style.width = `${State.inspector.width || 320}px`;
                sidebarContent.classList.add('flex-col');
                
                if (resizer) {
                    resizer.classList.remove('hidden');
                    resizer.classList.add('left-0', '-translate-x-1/2'); 
                }
                
                btnToggleWidth.classList.add('hidden');
                
                iconDock.setAttribute('data-lucide', 'monitor-down');
                
                btnDockInspector.title = "Dock to Bottom";
            } else if (State.inspector.dock === 'left') {
                mainAppWrapper.insertBefore(propertiesSidebar, mainWorkspace);
                mainAppWrapper.classList.remove('flex-col');
                mainAppWrapper.classList.add('flex-row');
                
                propertiesSidebar.classList.add('h-full', 'border-r');
                propertiesSidebar.style.width = `${State.inspector.width || 320}px`;
                sidebarContent.classList.add('flex-col');
                
                if (resizer) {
                    resizer.classList.remove('hidden');
                    resizer.classList.add('right-0', 'translate-x-1/2'); 
                }
                
                btnToggleWidth.classList.add('hidden');
                
                iconDock.setAttribute('data-lucide', 'monitor-up');
                
                btnDockInspector.title = "Dock to Top";
            } else {
                btnToggleWidth.classList.remove('hidden');
                if (State.inspector.fullWidth) {
                    iconWidth.setAttribute('data-lucide', 'minimize-2');
                    btnToggleWidth.title = "Shrink to Timeline Width";
                } else {
                    iconWidth.setAttribute('data-lucide', 'maximize-2');
                    btnToggleWidth.title = "Expand to Full Width";
                }

                if (State.inspector.dock === 'bottom') {
                    if (State.inspector.fullWidth) {
                        mainAppWrapper.appendChild(propertiesSidebar);
                        mainAppWrapper.classList.remove('flex-row');
                        mainAppWrapper.classList.add('flex-col');
                    } else {
                        timelineContainer.appendChild(propertiesSidebar);
                    }
                    
                    propertiesSidebar.classList.add('w-full', 'h-56', 'sm:h-64', 'border-t');
                    sidebarContent.classList.add('flex-row', 'flex-nowrap', 'overflow-x-auto');
                    
                    iconDock.setAttribute('data-lucide', 'monitor');
                    
                    btnDockInspector.title = "Dock to Left";
                } else if (State.inspector.dock === 'top') {
                    if (State.inspector.fullWidth) {
                        mainAppWrapper.insertBefore(propertiesSidebar, mainWorkspace);
                        mainAppWrapper.classList.remove('flex-row');
                        mainAppWrapper.classList.add('flex-col');
                    } else {
                        timelineContainer.insertBefore(propertiesSidebar, timelineContainer.firstChild);
                    }
                    
                    propertiesSidebar.classList.add('w-full', 'h-auto', 'max-h-64', 'border-b');
                    sidebarContent.classList.add('flex-row', 'flex-nowrap', 'overflow-x-auto');
                    
                    iconDock.setAttribute('data-lucide', 'monitor-smartphone');
                    
                    btnDockInspector.title = "Dock to Right";
                }
            }

            lucide.createIcons();
            setTimeout(() => { updateTimelineWidth(); drawRuler(); resizeCanvas(); }, 10);
        }

        btnToggleInspector.addEventListener('click', () => {
            const hasVisualClip = State.selectedClipId && ['image','video','text'].includes(State.clips.find(c=>c.id===State.selectedClipId)?.type);
            if(hasVisualClip) {
                State.inspector.visible = !State.inspector.visible;
                applyInspectorLayout();
            }
        });

        btnToggleWidth.addEventListener('click', () => {
            State.inspector.fullWidth = !State.inspector.fullWidth;
            applyInspectorLayout();
        });

        btnCloseInspector.addEventListener('click', () => {
            State.inspector.visible = false;
            applyInspectorLayout();
        });

        btnDockInspector.addEventListener('click', () => {
            if (State.inspector.dock === 'right') State.inspector.dock = 'bottom';
            else if (State.inspector.dock === 'bottom') State.inspector.dock = 'left';
            else if (State.inspector.dock === 'left') State.inspector.dock = 'top';
            else State.inspector.dock = 'right';
            
            updateSidebarPanel(); // Re-render contents for appropriate min-widths
            applyInspectorLayout();
        });

        if (canvasColorPicker) {
            canvasColorPicker.addEventListener('input', (e) => {
                State.canvasBgColor = e.target.value;
                canvasColorIcon.style.color = e.target.value;
                document.getElementById('canvasAspectWrapper').style.backgroundColor = e.target.value;
                drawCanvas();
            });
        }

        if (btnToggleTimecode) {
            btnToggleTimecode.addEventListener('click', () => {
                const timeText = document.getElementById('previewTimeText');
                if (timeText) {
                    timeText.classList.toggle('hidden');
                    const icon = btnToggleTimecode.querySelector('i');
                    if (timeText.classList.contains('hidden')) {
                        icon.style.opacity = '0.5';
                    } else {
                        icon.style.opacity = '1';
                    }
                }
            });
        }

        // --- Keyboard Shortcuts ---
        btnToggleTheme.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
                iconTheme.setAttribute('data-lucide', 'sun');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                iconTheme.setAttribute('data-lucide', 'moon');
                localStorage.setItem('theme', 'light');
            }
            lucide.createIcons();
            drawRuler();
            updatePropertiesPanel(); 
        });

        btnToggleLayout.addEventListener('click', () => {
            State.layout.isSideBySide = !State.layout.isSideBySide;
            if (State.layout.isSideBySide) {
                mainWorkspace.classList.remove('flex-col');
                mainWorkspace.classList.add('flex-col', 'sm:flex-row'); 
                
                previewContainer.classList.remove('w-full', 'border-b');
                previewContainer.classList.add('sm:border-l', 'order-first', 'sm:order-last');
                
                previewContainer.classList.remove('h-[45%]');
                previewContainer.classList.add('h-[40%]', 'sm:w-[35%]', 'sm:min-w-[300px]', 'sm:h-full');
                
                iconLayout.setAttribute('data-lucide', 'panel-top');
            } else {
                mainWorkspace.classList.remove('flex-col', 'sm:flex-row');
                mainWorkspace.classList.add('flex-col');
                
                previewContainer.classList.remove('sm:border-l', 'order-first', 'sm:order-last');
                previewContainer.classList.add('w-full', 'border-b');
                
                previewContainer.classList.remove('h-[40%]', 'sm:w-[35%]', 'sm:min-w-[300px]', 'sm:h-full');
                previewContainer.classList.add('h-[45%]');
                
                iconLayout.setAttribute('data-lucide', 'panel-right');
            }
            lucide.createIcons();
            setTimeout(() => { updateTimelineWidth(); drawRuler(); resizeCanvas(); }, 10);
        });

        btnTogglePreview.addEventListener('click', () => {
            State.preview.hidden = !State.preview.hidden;
            if (State.preview.hidden) {
                previewContainer.classList.add('hidden');
                iconEye.setAttribute('data-lucide', 'eye');
            } else {
                previewContainer.classList.remove('hidden');
                iconEye.setAttribute('data-lucide', 'eye-off');
            }
            lucide.createIcons();
            setTimeout(() => { updateTimelineWidth(); drawRuler(); resizeCanvas(); }, 10);
        });

        btnToggleAspect.addEventListener('click', () => {
            State.preview.aspectIndex = (State.preview.aspectIndex + 1) % ASPECT_RATIOS.length;
            const aspect = ASPECT_RATIOS[State.preview.aspectIndex];
            
            iconAspect.setAttribute('data-lucide', aspect.icon);
            btnToggleAspect.title = `Aspect Ratio: ${aspect.label}`;
            
            resizeCanvas();
            lucide.createIcons();
        });

        function updateCanvasResolution() {
            const canvas = document.getElementById('renderCanvas');
            const aspectStr = ASPECT_RATIOS[State.preview.aspectIndex].value;
            const [wRatio, hRatio] = aspectStr.split('/').map(Number);
            
            let targetW, targetH;
            if (wRatio >= hRatio) {
                targetW = 1920;
                targetH = 1920 * (hRatio / wRatio);
            } else {
                targetH = 1920;
                targetW = 1920 * (wRatio / hRatio);
            }
            
            if (canvas.width !== targetW || canvas.height !== targetH) {
                canvas.width = targetW;
                canvas.height = targetH;
            }
            return { w: targetW, h: targetH };
        }

        function resizeCanvas() {
            const pw = previewWrapper.clientWidth;
            const ph = previewWrapper.clientHeight;
            if (pw === 0 || ph === 0) return;

            const padding = window.innerWidth < 640 ? 16 : 32; 
            const availW = pw - padding;
            const availH = ph - padding;

            const aspectStr = ASPECT_RATIOS[State.preview.aspectIndex].value;
            const [wRatio, hRatio] = aspectStr.split('/').map(Number);
            const ratio = wRatio / hRatio;

            let finalW = availW;
            let finalH = finalW / ratio;

            if (finalH > availH) {
                finalH = availH;
                finalW = finalH * ratio;
            }

            canvasAspectWrapper.style.width = `${finalW}px`;
            canvasAspectWrapper.style.height = `${finalH}px`;
            
            drawCanvas();
        }

        window.addEventListener('resize', resizeCanvas);

        // --- Resizer Logic ---
        const resizer = document.getElementById('inspectorResizer');
        let isResizingInspector = false;
        let startResizingX = 0;
        let startInspectorWidth = 0;

        if (resizer) {
            resizer.addEventListener('mousedown', (e) => {
                isResizingInspector = true;
                startResizingX = e.clientX;
                startInspectorWidth = propertiesSidebar.offsetWidth;
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
                e.preventDefault();
            });

            window.addEventListener('mousemove', (e) => {
                if (!isResizingInspector) return;
                
                const dx = e.clientX - startResizingX;
                let newWidth = startInspectorWidth;
                
                if (State.inspector.dock === 'right') {
                    newWidth = startInspectorWidth - dx;
                } else if (State.inspector.dock === 'left') {
                    newWidth = startInspectorWidth + dx;
                }
                
                // Clamp width between 200 and 800
                newWidth = Math.max(200, Math.min(800, newWidth));
                State.inspector.width = newWidth;
                propertiesSidebar.style.width = `${newWidth}px`;
                
                // Request animation frame for smooth redraw
                requestAnimationFrame(() => {
                    updateTimelineWidth();
                    drawRuler();
                    resizeCanvas();
                });
            });

            window.addEventListener('mouseup', () => {
                if (isResizingInspector) {
                    isResizingInspector = false;
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                    updateTimelineWidth();
                    drawRuler();
                    resizeCanvas();
                }
            });
        }
        
        // Ensure timeline gets updated size on window resize
        window.addEventListener('resize', () => {
            if (State.inspector.visible) {
                applyInspectorLayout();
            }
        });

        // Helper for animations
        const easeOutQuart = x => 1 - Math.pow(1 - x, 4);

        let activeVisualClips = State.clips.filter(c => !c.hidden && (c.type === 'video' || c.type === 'image' || c.type === 'text') &&function drawCanvas() {
            const canvas = document.getElementById('renderCanvas');
            const ctx = canvas.getContext('2d');
            const placeholder = document.getElementById('previewPlaceholder');

            const { w, h } = updateCanvasResolution();
            ctx.clearRect(0, 0, w, h);
            
            if (State.canvasBgColor && State.canvasBgColor !== 'transparent') {
                ctx.fillStyle = State.canvasBgColor;
                ctx.fillRect(0, 0, w, h);
            }

            let activeVisualClips = State.clips.filter(c =>
                (c.type === 'video' || c.type === 'image' || c.type === 'text') &&
                State.currentTime >= c.start &&
                State.currentTime < c.start + c.duration
            );

            if (activeVisualClips.length > 0) {
                placeholder.classList.add('hidden');
                canvas.classList.remove('hidden');

                activeVisualClips.sort((a, b) => {
                    const idxA = State.tracks.findIndex(t => t.id === a.trackId);
                    const idxB = State.tracks.findIndex(t => t.id === b.trackId);
                    return idxB - idxA; 
                });

                activeVisualClips.forEach(clip => {
                    if (clip.type === 'text') {
                        // Drawing text clip
                        const fontSize = clip.effects.fontSize || 100;
                        const fontStyle = clip.effects.fontStyle || 'normal';
                        ctx.font = `${fontStyle} ${clip.effects.fontWeight || 700} ${fontSize}px "${clip.effects.fontFamily || 'Rubik'}"`;
                        
                        // Parse text content
                        let renderText = clip.text || '';
                        if (clip.effects.textTransform === 'uppercase') renderText = renderText.toUpperCase();
                        else if (clip.effects.textTransform === 'lowercase') renderText = renderText.toLowerCase();
                        
                        const lines = renderText.split('\n');
                        const metrics = ctx.measureText(renderText); // Rough max width
                        let dw = metrics.width;
                        let dh = fontSize * lines.length; 
                        
                        // New Text Properties
                        ctx.letterSpacing = (clip.effects.letterSpacing || 0) + "px";
                        const lh = (clip.effects.lineHeight || 1.1) * fontSize;
                        const startY = -((lines.length - 1) * lh) / 2;

                        const baseScale = clip.effects.scale !== undefined ? clip.effects.scale : 1;
                        const rotate = clip.effects.rotate !== undefined ? clip.effects.rotate : 0;
                        const offsetX = clip.effects.offsetX || 0;
                        const offsetY = clip.effects.offsetY || 0;

                        // Animation Math
                        let animAlpha = 1;
                        let animScale = 1;
                        let animY = 0;
                        let mosaicLevel = 0;
                        const clipTime = State.currentTime - clip.start;
                        const timeLeft = clip.duration - clipTime;

                        if (clip.effects.animIn && clip.effects.animIn !== 'none') {
                            const dur = clip.effects.animInDur || 1;
                            if (clipTime < dur) {
                                const p = easeOutQuart(clipTime / dur);
                                if (clip.effects.animIn === 'fade') animAlpha *= p;
                                if (clip.effects.animIn === 'slideUp') { animAlpha *= p; animY += (1-p) * 200; }
                                if (clip.effects.animIn === 'zoom') { animAlpha *= p; animScale *= (0.5 + 0.5*p); }
                                if (clip.effects.animIn === 'mosaic') { mosaicLevel = 1 - p; }
                            }
                        }
                        if (clip.effects.animOut && clip.effects.animOut !== 'none') {
                            const dur = clip.effects.animOutDur || 1;
                            if (timeLeft < dur) {
                                const p = easeOutQuart(timeLeft / dur);
                                if (clip.effects.animOut === 'fade') animAlpha = Math.min(animAlpha, p);
                                if (clip.effects.animOut === 'slideDown') { animAlpha = Math.min(animAlpha, p); animY += (1-p) * 200; }
                                if (clip.effects.animOut === 'zoom') { animAlpha = Math.min(animAlpha, p); animScale *= Math.max(0.01, p); }
                                if (clip.effects.animOut === 'mosaic') { mosaicLevel = Math.max(mosaicLevel, 1 - p); }
                            }
                        }
                        if (clip.effects.animLoop && clip.effects.animLoop !== 'none') {
                            if (clip.effects.animLoop === 'pulse') animScale *= (1 + 0.05 * Math.sin(clipTime * Math.PI * 2));
                            if (clip.effects.animLoop === 'float') animY += 15 * Math.sin(clipTime * Math.PI);
                        }

                        ctx.save();
                        const finalScale = baseScale * animScale;
                        const cx = w/2 + offsetX;
                        const cy = h/2 + offsetY + animY;

                        ctx.globalAlpha = animAlpha * (clip.effects.opacity !== undefined ? clip.effects.opacity/100 : 1);
                        ctx.globalCompositeOperation = clip.effects.blendMode || 'source-over';
                        ctx.translate(cx, cy);
                        ctx.rotate(rotate * Math.PI / 180);
                        ctx.scale(finalScale, finalScale);

                        ctx.textBaseline = 'middle';
                        ctx.textAlign = 'center';

                        let drawText = () => {
                            // Extrude
                            if (clip.effects.extrudeEnable) {
                                ctx.fillStyle = clip.effects.extrudeColor || '#000000';
                                const depth = clip.effects.extrudeDepth || 5;
                                let dx = 1, dy = 1;
                                const ed = clip.effects.extrudeDir || 'br';
                                if (ed === 'bl') { dx = -1; dy = 1; }
                                else if (ed === 'b') { dx = 0; dy = 1; }
                                else if (ed === 'br') { dx = 1; dy = 1; }
                                else if (ed === 'tr') { dx = 1; dy = -1; }
                                else if (ed === 'tl') { dx = -1; dy = -1; }
                                else if (ed === 't') { dx = 0; dy = -1; }
                                else if (ed === 'r') { dx = 1; dy = 0; }
                                else if (ed === 'l') { dx = -1; dy = 0; }

                                for(let i = depth; i > 0; i -= 0.5) {
                                    lines.forEach((line, li) => {
                                        ctx.fillText(line, dx * i, startY + li * lh + dy * i);
                                    });
                                }
                            }

                            // Drop shadow
                            if (clip.effects.shadowEnable) {
                                ctx.shadowColor = clip.effects.shadowColor || '#000000';
                                ctx.shadowBlur = clip.effects.shadowBlur || 20;
                                ctx.shadowOffsetX = clip.effects.shadowX || 0;
                                ctx.shadowOffsetY = clip.effects.shadowY || 10;
                            } else {
                                ctx.shadowColor = 'transparent';
                                ctx.shadowBlur = 0;
                            }

                            ctx.fillStyle = clip.effects.fillColor || '#ffffff';
                            lines.forEach((line, li) => {
                                ctx.fillText(line, 0, startY + li * lh);
                                
                                // Text Decoration (Underline / Strike)
                                if (clip.effects.textDecoration === 'underline' || clip.effects.textDecoration === 'line-through') {
                                    const lm = ctx.measureText(line);
                                    const tdw = lm.width;
                                    ctx.fillRect(-tdw/2, startY + li * lh + (clip.effects.textDecoration === 'underline' ? fontSize*0.4 : -fontSize*0.1), tdw, fontSize*0.08);
                                }
                            });

                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;
                        };

                        if (mosaicLevel > 0.05) {
                            const pSize = Math.max(1, mosaicLevel * 30);
                            const offCanvas = document.createElement('canvas');
                            const offCtx = offCanvas.getContext('2d');
                            offCanvas.width = dw + 100;
                            offCanvas.height = dh + 100;
                            offCtx.translate(offCanvas.width/2, offCanvas.height/2);
                            offCtx.textBaseline = 'middle';
                            offCtx.textAlign = 'center';
                            offCtx.font = ctx.font;
                            offCtx.letterSpacing = ctx.letterSpacing;
                            
                            // Extrude on offscreen
                            if (clip.effects.extrudeEnable) {
                                offCtx.fillStyle = clip.effects.extrudeColor || '#000000';
                                const depth = clip.effects.extrudeDepth || 5;
                                let dx = 1, dy = 1;
                                const ed = clip.effects.extrudeDir || 'br';
                                if (ed === 'bl') { dx = -1; dy = 1; }
                                else if (ed === 'b') { dx = 0; dy = 1; }
                                else if (ed === 'br') { dx = 1; dy = 1; }
                                else if (ed === 'tr') { dx = 1; dy = -1; }
                                else if (ed === 'tl') { dx = -1; dy = -1; }
                                else if (ed === 't') { dx = 0; dy = -1; }
                                else if (ed === 'r') { dx = 1; dy = 0; }
                                else if (ed === 'l') { dx = -1; dy = 0; }
                                for(let i = depth; i > 0; i -= 0.5) {
                                    lines.forEach((line, li) => {
                                        offCtx.fillText(line, dx * i, startY + li * lh + dy * i);
                                    });
                                }
                            }
                            // Drop shadow on offscreen
                            if (clip.effects.shadowEnable) {
                                offCtx.shadowColor = clip.effects.shadowColor || '#000000';
                                offCtx.shadowBlur = clip.effects.shadowBlur || 20;
                                offCtx.shadowOffsetX = clip.effects.shadowX || 0;
                                offCtx.shadowOffsetY = clip.effects.shadowY || 10;
                            }
                            offCtx.fillStyle = clip.effects.fillColor || '#ffffff';
                            lines.forEach((line, li) => {
                                offCtx.fillText(line, 0, startY + li * lh);
                                // Text Decoration (Underline / Strike) on offscreen
                                if (clip.effects.textDecoration === 'underline' || clip.effects.textDecoration === 'line-through') {
                                    const lm = offCtx.measureText(line);
                                    const tdw = lm.width;
                                    offCtx.fillRect(-tdw/2, startY + li * lh + (clip.effects.textDecoration === 'underline' ? fontSize*0.4 : -fontSize*0.1), tdw, fontSize*0.08);
                                }
                            });

                            // Draw to main canvas pixelated
                            const smallCanvas = document.createElement('canvas');
                            const smallCtx = smallCanvas.getContext('2d');
                            smallCanvas.width = offCanvas.width / pSize;
                            smallCanvas.height = offCanvas.height / pSize;
                            smallCtx.drawImage(offCanvas, 0, 0, smallCanvas.width, smallCanvas.height);

                            ctx.imageSmoothingEnabled = false;
                            ctx.drawImage(smallCanvas, -offCanvas.width/2, -offCanvas.height/2, offCanvas.width, offCanvas.height);
                            ctx.imageSmoothingEnabled = true;
                        } else {
                            drawText();
                        }

                        // Interactive Bounding Box for Selected// Interactive Bounding Box for Selected
                        if (clip.id === State.selectedClipId) {
                            ctx.strokeStyle = '#6366f1';
                            ctx.lineWidth = 4 / finalScale;
                            ctx.setLineDash([10 / finalScale, 10 / finalScale]);
                            ctx.strokeRect(-dw/2, -dh/2, dw, dh);
                            ctx.setLineDash([]);
                            
                            ctx.fillStyle = '#ffffff';
                            const handleSize = 16 / finalScale;
                            ctx.fillRect(-dw/2 - handleSize/2, -dh/2 - handleSize/2, handleSize, handleSize);
                            ctx.fillRect(dw/2 - handleSize/2, -dh/2 - handleSize/2, handleSize, handleSize);
                            ctx.fillRect(-dw/2 - handleSize/2, dh/2 - handleSize/2, handleSize, handleSize);
                            ctx.fillRect(dw/2 - handleSize/2, dh/2 - handleSize/2, handleSize, handleSize);
                        }

                        ctx.restore();
                    } else {
                        let source = clip.type === 'image' ? clip.imageEl : clip.videoEl;
                    if (source) {
                        const sRatio = (source.naturalWidth || source.videoWidth) / (source.naturalHeight || source.videoHeight);
                        const cRatio = w / h;
                        let dw = w, dh = h;

                        if (!isNaN(sRatio) && sRatio > 0) {
                            if (sRatio > cRatio) {
                                dh = w / sRatio;
                            } else {
                                dw = h * sRatio;
                            }

                            const baseScale = clip.effects.scale !== undefined ? clip.effects.scale : 1;
                            const rotate = clip.effects.rotate !== undefined ? clip.effects.rotate : 0;
                            const borderRadius = clip.effects.borderRadius !== undefined ? clip.effects.borderRadius : 0;
                            const offsetX = clip.effects.offsetX || 0;
                            const offsetY = clip.effects.offsetY || 0;

                            // Animation Math
                            let animAlpha = 1;
                            let animScale = 1;
                            let animY = 0;
                            const clipTime = State.currentTime - clip.start;
                            const timeLeft = clip.duration - clipTime;

                            let mosaicLevel = 0;
                            // Anim In
                            if (clip.effects.animIn && clip.effects.animIn !== 'none') {
                                const dur = clip.effects.animInDur || 1;
                                if (clipTime < dur) {
                                    const p = easeOutQuart(clipTime / dur);
                                    if (clip.effects.animIn === 'fade') animAlpha *= p;
                                    if (clip.effects.animIn === 'slideUp') { animAlpha *= p; animY += (1-p) * 200; }
                                    if (clip.effects.animIn === 'zoom') { animAlpha *= p; animScale *= (0.5 + 0.5*p); }
                                    if (clip.effects.animIn === 'mosaic') { mosaicLevel = 1 - p; }
                                }
                            }
                            // Anim Out
                            if (clip.effects.animOut && clip.effects.animOut !== 'none') {
                                const dur = clip.effects.animOutDur || 1;
                                if (timeLeft < dur) {
                                    const p = easeOutQuart(timeLeft / dur);
                                    if (clip.effects.animOut === 'fade') animAlpha = Math.min(animAlpha, p);
                                    if (clip.effects.animOut === 'slideDown') { animAlpha = Math.min(animAlpha, p); animY += (1-p) * 200; }
                                    if (clip.effects.animOut === 'zoom') { animAlpha = Math.min(animAlpha, p); animScale *= Math.max(0.01, p); }
                                    if (clip.effects.animOut === 'mosaic') { mosaicLevel = Math.max(mosaicLevel, 1 - p); }
                                }
                            }
                            // Anim Loop
                            if (clip.effects.animLoop && clip.effects.animLoop !== 'none') {
                                if (clip.effects.animLoop === 'pulse') animScale *= (1 + 0.05 * Math.sin(clipTime * Math.PI * 2));
                                if (clip.effects.animLoop === 'float') animY += 15 * Math.sin(clipTime * Math.PI);
                            }

                            ctx.save();
                            const finalScale = baseScale * animScale;
                            const cx = w/2 + offsetX;
                            const cy = h/2 + offsetY + animY;

                            ctx.globalAlpha = animAlpha;
                            ctx.translate(cx, cy);
                            ctx.rotate(rotate * Math.PI / 180);
                            ctx.scale(finalScale, finalScale);

                            // Apply Drop Shadow just to the image draw
                            if (clip.effects.shadowEnable) {
                                ctx.shadowColor = clip.effects.shadowColor || '#000000';
                                ctx.shadowBlur = clip.effects.shadowBlur || 20;
                                ctx.shadowOffsetX = clip.effects.shadowX || 0;
                                ctx.shadowOffsetY = clip.effects.shadowY || 10;
                            }

                            if (borderRadius > 0) {
                                ctx.beginPath();
                                if (ctx.roundRect) {
                                    ctx.roundRect(-dw/2, -dh/2, dw, dh, borderRadius);
                                } else {
                                    ctx.rect(-dw/2, -dh/2, dw, dh);
                                }
                                ctx.clip();
                            }

                            if (mosaicLevel > 0.05) {
                                const pSize = Math.max(1, mosaicLevel * 30);
                                const offCanvas = document.createElement('canvas');
                                const offCtx = offCanvas.getContext('2d');
                                offCanvas.width = dw;
                                offCanvas.height = dh;
                                offCtx.drawImage(source, 0, 0, dw, dh);

                                const smallCanvas = document.createElement('canvas');
                                const smallCtx = smallCanvas.getContext('2d');
                                smallCanvas.width = dw / pSize;
                                smallCanvas.height = dh / pSize;
                                smallCtx.drawImage(offCanvas, 0, 0, smallCanvas.width, smallCanvas.height);

                                ctx.imageSmoothingEnabled = false;
                                ctx.drawImage(smallCanvas, -dw/2, -dh/2, dw, dh);
                                ctx.imageSmoothingEnabled = true;
                            } else {
                                ctx.drawImage(source, -dw/2, -dh/2, dw, dh);
                            }
                            
                            // Reset shadow so it doesn't affect bounding box
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;

                            // Interactive Bounding Box for Selected
                            if (clip.id === State.selectedClipId) {
                                ctx.strokeStyle = '#6366f1';
                                ctx.lineWidth = 4 / finalScale;
                                ctx.setLineDash([10 / finalScale, 10 / finalScale]);
                                ctx.strokeRect(-dw/2, -dh/2, dw, dh);
                                ctx.setLineDash([]);
                                
                                ctx.fillStyle = '#ffffff';
                                const handleSize = 16 / finalScale;
                                ctx.fillRect(-dw/2 - handleSize/2, -dh/2 - handleSize/2, handleSize, handleSize);
                                ctx.fillRect(dw/2 - handleSize/2, -dh/2 - handleSize/2, handleSize, handleSize);
                                ctx.fillRect(-dw/2 - handleSize/2, dh/2 - handleSize/2, handleSize, handleSize);
                                ctx.fillRect(dw/2 - handleSize/2, dh/2 - handleSize/2, handleSize, handleSize);
                            }

                            ctx.restore();
                        }
                    }
                    }
                });
            } else {
                placeholder.classList.remove('hidden');
                canvas.classList.add('hidden');
            }
        }

        // --- Web Audio Graph Builder ---
        function buildAudioGraph(clip) {
            ensureAudioContext();
            if (clip.audioNodes) return; 
            
            try {
                const source = audioCtx.createMediaElementSource(clip.audioEl);

                const noiseRed = audioCtx.createBiquadFilter();
                noiseRed.type = 'lowpass';
                noiseRed.frequency.value = 20000;

                const eq = audioCtx.createBiquadFilter();
                eq.type = 'lowshelf';
                eq.frequency.value = 120;

                const tinny = audioCtx.createBiquadFilter();
                tinny.type = 'highpass';
                tinny.frequency.value = 0;

                const volume = audioCtx.createGain();

                const delay = audioCtx.createDelay(5.0);
                delay.delayTime.value = 0.3;
                const echoFeedback = audioCtx.createGain();
                echoFeedback.gain.value = 0.4;
                const echoVolume = audioCtx.createGain();

                const roboDelay = audioCtx.createDelay(0.1);
                roboDelay.delayTime.value = 0.025; 
                const roboFeedback = audioCtx.createGain();
                roboFeedback.gain.value = 0.8;
                const roboVolume = audioCtx.createGain();

                source.connect(noiseRed);
                noiseRed.connect(eq);
                eq.connect(tinny);
                
                tinny.connect(volume);
                volume.connect(audioCtx.destination);
                volume.connect(State.masterStreamNode); 

                tinny.connect(delay);
                delay.connect(echoFeedback);
                echoFeedback.connect(delay);
                delay.connect(echoVolume);
                echoVolume.connect(audioCtx.destination);
                echoVolume.connect(State.masterStreamNode);

                tinny.connect(roboDelay);
                roboDelay.connect(roboFeedback);
                roboFeedback.connect(roboDelay);
                roboDelay.connect(roboVolume);
                roboVolume.connect(audioCtx.destination);
                roboVolume.connect(State.masterStreamNode);

                clip.audioNodes = { source, noiseRed, eq, tinny, volume, delay, echoFeedback, echoVolume, roboDelay, roboFeedback, roboVolume };
                
                if(!clip.effects) clip.effects = { volume: 1, echo: 0, cartoon: 0, cinematic: 0, robot: 0, noiseRed: 0 };
                applyAudioEffects(clip);

            } catch (err) {
                console.error("Audio graph build failed:", err);
            }
        }

        function applyAudioEffects(clip) {
            if (!clip.audioNodes) return;
            const fx = clip.effects;
            
            const track = State.tracks.find(t => t.id === clip.trackId);
            if (track && track.muted) {
                clip.audioNodes.volume.gain.value = 0;
                clip.audioNodes.echoVolume.gain.value = 0;
                clip.audioNodes.roboVolume.gain.value = 0;
            } else {
                clip.audioNodes.volume.gain.value = fx.volume;
                clip.audioNodes.echoVolume.gain.value = fx.echo;
                clip.audioNodes.roboVolume.gain.value = fx.robot;
            }

            clip.audioNodes.eq.gain.value = fx.cinematic * 15; 
            clip.audioNodes.tinny.frequency.value = fx.cartoon * 1500; 
            clip.audioNodes.noiseRed.frequency.value = 20000 - (fx.noiseRed * 17000); 
        }

        window.setClipEffect = (clipId, effectName, value) => {
            const clip = State.clips.find(c => c.id === clipId);
            if (clip) {
                if (effectName === 'shadowEnable' || effectName === 'extrudeEnable') {
                    clip.effects[effectName] = value;
                } else if (['shadowColor', 'animIn', 'animOut', 'animLoop', 'extrudeColor', 'fillColor', 'fontFamily', 'extrudeDir', 'textTransform', 'fontStyle', 'textDecoration', 'blendMode'].includes(effectName)) {
                    clip.effects[effectName] = value;
                } else {
                    clip.effects[effectName] = parseFloat(value);
                }
                
                if (clip.type === 'image' || clip.type === 'video' || clip.type === 'text') drawCanvas();
                if (clip.audioNodes) applyAudioEffects(clip);
                
                const label = document.getElementById(`lbl_${effectName}`);
                if (label) {
                    if (effectName === 'scale') label.textContent = `${clip.effects[effectName].toFixed(2)}x`;
                    else if (effectName === 'rotate') label.textContent = `${Math.round(clip.effects[effectName])}°`;
                    else if (effectName === 'borderRadius') label.textContent = `${Math.round(clip.effects[effectName])}px`;
                    else if (['volume', 'noiseRed', 'echo', 'cinematic', 'robot', 'cartoon'].includes(effectName)) label.textContent = `${Math.round(clip.effects[effectName] * 100)}%`;
                }
            }
        };

        window.alignClip = (axis) => {
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip) return;
            if (!clip.effects) clip.effects = {};
            if (axis === 'h') clip.effects.offsetX = 0;
            if (axis === 'v') clip.effects.offsetY = 0;
            drawCanvas();
        };

        window.toggleVisibility = () => {
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip) return;
            clip.hidden = !clip.hidden;
            if (clip.type === 'audio') iconType = 'music';
            else if (clip.type === 'image') iconType = 'image';
            else if (clip.type === 'text') iconType = 'type';
            
            let displayVal = '';
            if (activeTab.unit === '%') displayVal = `${Math.round(val * 100)}%`;
            else if (activeTab.unit === 'x') displayVal = `${val.toFixed(2)}x`;
            else displayVal = `${Math.round(val)}${activeTab.unit}`;

            // High Contrast Slider settings
            const sliderFill = isDarkMode ? '#ffffff' : '#111111';
            const sliderBg = isDarkMode ? '#404040' : '#e5e5e5';

            headerProperties.innerHTML = `
                ${tabsHTML}
                <div class="flex items-center gap-2 sm:gap-3 px-3 py-1.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg w-40 sm:w-64 md:w-80 shadow-inner shrink-0">
                    <span class="hidden sm:block text-[11px] font-semibold text-surface-500 dark:text-surface-400 uppercase w-12 truncate">${activeTab.label}</span>
                    <input type="range" min="0" max="${activeTab.max}" step="${activeTab.step}" value="${val}"
                        class="flex-1 w-full custom-slider appearance-none outline-none bg-transparent"
                        oninput="setClipEffect('${clip.id}', '${State.activePropertyTab}', this.value); this.style.background = 'linear-gradient(to right, ${sliderFill} ' + (this.value/this.max)*100 + '%, ${sliderBg} ' + (this.value/this.max)*100 + '%)'">
                    <span class="text-[11px] sm:text-xs font-mono font-extrabold text-surface-900 dark:text-white w-10 text-right shrink-0" id="lbl_${State.activePropertyTab}">${displayVal}</span>
                </div>
                ${extraActionsHTML}
                <div class="hidden lg:flex items-center gap-2 pl-3 border-l border-surface-200 dark:border-surface-700 shrink-0 max-w-[150px]">
                    <div class="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style="background-color: ${PALETTES[clip.colorIndex].wave}"></div>
                    <span class="text-[11px] font-semibold text-surface-700 dark:text-surface-300 truncate">${clip.title}</span>
                </div>
            `;
            
            const slider = headerProperties.querySelector('input[type="range"]');
            if(slider) slider.style.background = `linear-gradient(to right, ${sliderFill} ${(val/activeTab.max)*100}%, ${sliderBg} ${(val/activeTab.max)*100}%)`;
            
            lucide.createIcons();
        }

        window.setActivePropertyTab = (tabId) => {
            State.activePropertyTab = tabId;
            updatePropertiesPanel();
        }

        // --- Track Management ---
        window.addTrack = (type) => {
            const count = State.tracks.filter(t => t.type === type).length + 1;
            const newTrack = {
                id: type.charAt(0) + Date.now(),
                type: type,
                name: `${type === 'video' ? 'V' : 'A'}${count}`,
                height: 90, 
                colorIndex: State.tracks.length % PALETTES.length,
                muted: false
            };
            if (type === 'video') {
                State.tracks.unshift(newTrack);
            } else {
                State.tracks.push(newTrack);
            }
            renderTrackHeaders();
            renderTracks();
            renderClips();
        };

        function getAvailableTrack(type, start, duration) {
            for (const track of State.tracks.filter(t => t.type === type)) {
                const hasOverlap = State.clips.some(c => 
                    c.trackId === track.id && 
                    (start < c.start + c.duration && start + duration > c.start)
                );
                if (!hasOverlap) return track.id;
            }
            const count = State.tracks.filter(t => t.type === type).length + 1;
            const newTrack = {
                id: type.charAt(0) + Date.now(),
                type: type,
                name: `${type === 'video' ? 'V' : 'A'}${count}`,
                height: 90,
                colorIndex: State.tracks.length % PALETTES.length,
                muted: false
            };
            if (type === 'video') {
                State.tracks.unshift(newTrack);
            } else {
                State.tracks.push(newTrack);
            }
            renderTrackHeaders();
            renderTracks();
            return newTrack.id;
        }

        window.toggleMute = (trackId) => {
            const track = State.tracks.find(t => t.id === trackId);
            if (track) {
                track.muted = !track.muted;
                renderTrackHeaders();
                renderTracks();
                renderClips();
                State.clips.filter(c => c.trackId === trackId).forEach(c => {
                    if (c.audioNodes) applyAudioEffects(c);
                });
            }
        };

        btnImport.addEventListener('click', () => {
                ensureAudioContext();
                mediaInput.click();
            });

            btnAddText.addEventListener('click', () => {
                let targetTrackId = getAvailableTrack('video', State.currentTime, 5);
                let targetTrack = State.tracks.find(t=>t.id===targetTrackId);
                let clipColor = (targetTrack.colorIndex + 3) % PALETTES.length;

                const newTextClip = {
                    id: 'c_' + Date.now() + Math.random().toString(36).substr(2, 5),
                    trackId: targetTrackId,
                    colorIndex: clipColor,
                    type: 'text',
                    title: 'New Text',
                    text: 'NEW TEXT',
                    start: State.currentTime,
                    duration: 5,
                    sourceOffset: 0,
                    maxDuration: 3600,
                    effects: { 
                        scale: 1, rotate: 0, offsetX: 0, offsetY: 0, 
                        fontFamily: 'Inter, sans-serif', fontWeight: 700, fillColor: '#ffffff',
                        shadowEnable: false, shadowColor: '#000000', shadowBlur: 20, shadowX: 0, shadowY: 10, 
                        extrudeEnable: false, extrudeDepth: 5, extrudeColor: '#000000',
                        animIn: 'none', animOut: 'none', animLoop: 'none', animInDur: 1.0, animOutDur: 1.0 
                    }
                };
                State.clips.push(newTextClip);
                
                if (State.currentTime + 5 > State.duration) {
                    State.duration = Math.ceil(State.currentTime + 5 + 10);
                    updateTimelineWidth();
                }
                
                calcOverlaps();
                renderClips();
                drawCanvas();
            });

        mediaInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            btnImport.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>`;
            lucide.createIcons();

            await Promise.all(files.map(async (file) => {
                const isVideo = file.type.startsWith('video/');
                const isImage = file.type.startsWith('image/');
                const isAudio = file.type.startsWith('audio/');
                
                try {
                    const objectUrl = URL.createObjectURL(file);
                    
                    if (isImage) {
                        const img = new Image();
                        img.src = objectUrl;
                        await new Promise(r => img.onload = r);

                        const duration = 5; 
                        let targetTrackId = getAvailableTrack('video', State.currentTime, duration);
                        let targetTrack = State.tracks.find(t=>t.id===targetTrackId);
                        let clipColor = (targetTrack.colorIndex + 1 + Math.floor(Math.random() * 3)) % PALETTES.length;

                        const newClip = {
                            id: 'c_' + Date.now() + Math.random().toString(36).substr(2, 5),
                            trackId: targetTrackId,
                            colorIndex: clipColor,
                            type: 'image',
                            title: file.name,
                            start: State.currentTime,
                            duration: duration,
                            sourceOffset: 0,
                            maxDuration: 3600,
                            fileUrl: objectUrl,
                            imageEl: img,
                            effects: { scale: 1, rotate: 0, borderRadius: 0, offsetX: 0, offsetY: 0, shadowEnable: false, shadowColor: '#000000', shadowBlur: 20, shadowX: 0, shadowY: 10, animIn: 'none', animOut: 'none', animLoop: 'none', animInDur: 1.0, animOutDur: 1.0 }
                        };
                        State.clips.push(newClip);
                        
                        if (State.currentTime + duration > State.duration) {
                            State.duration = Math.ceil(State.currentTime + duration + 10);
                            updateTimelineWidth();
                        }
                    } else if (isAudio || isVideo) {
                        ensureAudioContext();
                        let duration = 5; 
                        let peaks = [];
                        let peaksPerSecond = 100; 
                        let audioEl = new Audio(objectUrl);
                        audioEl.crossOrigin = "anonymous";
                        
                        try {
                            const arrayBuffer = await file.arrayBuffer();
                            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                            duration = audioBuffer.duration;
                            
                            const data = audioBuffer.getChannelData(0);
                            const step = Math.floor(audioBuffer.sampleRate / peaksPerSecond);
                            for (let i = 0; i < data.length; i += step) {
                                let max = 0, min = 0;
                                for (let j = 0; j < step && i + j < data.length; j++) {
                                    const val = data[i + j];
                                    if (val > max) max = val;
                                    if (val < min) min = val;
                                }
                                peaks.push({ max, min });
                            }
                        } catch(err) {
                            if (!isVideo) throw err; 
                            await new Promise((resolve) => {
                                const v = document.createElement('video');
                                v.onloadedmetadata = () => { duration = v.duration; resolve(); };
                                v.onerror = resolve;
                                v.src = objectUrl;
                            });
                        }
                        
                        if (State.currentTime + duration > State.duration) {
                            State.duration = Math.ceil(State.currentTime + duration + 10);
                            updateTimelineWidth();
                        }

                        if (isVideo) {
                            const v = document.createElement('video');
                            v.src = objectUrl;
                            v.crossOrigin = "anonymous";
                            v.muted = true;
                            v.load();

                            let videoTargetTrackId = getAvailableTrack('video', State.currentTime, duration);
                            let videoTargetTrack = State.tracks.find(t=>t.id===videoTargetTrackId);
                            let clipColor = (videoTargetTrack.colorIndex + 1 + Math.floor(Math.random() * 3)) % PALETTES.length;

                            const newVideoClip = {
                                id: 'c_' + Date.now() + Math.random().toString(36).substr(2, 5),
                                trackId: videoTargetTrackId,
                                colorIndex: clipColor,
                                type: 'video',
                                title: file.name,
                                start: State.currentTime,
                                duration: duration,
                                sourceOffset: 0,
                                maxDuration: duration,
                                fileUrl: objectUrl,
                                videoEl: v,
                                effects: { scale: 1, rotate: 0, borderRadius: 0, offsetX: 0, offsetY: 0, shadowEnable: false, shadowColor: '#000000', shadowBlur: 20, shadowX: 0, shadowY: 10, animIn: 'none', animOut: 'none', animLoop: 'none', animInDur: 1.0, animOutDur: 1.0 }
                            };
                            State.clips.push(newVideoClip);
                        }
                        
                        let audioTargetTrackId = getAvailableTrack('audio', State.currentTime, duration);
                        let audioTargetTrack = State.tracks.find(t=>t.id===audioTargetTrackId);
                        let clipColor = (audioTargetTrack.colorIndex + 2 + Math.floor(Math.random() * 3)) % PALETTES.length;

                        const newAudioClip = {
                            id: 'c_' + Date.now() + Math.random().toString(36).substr(2, 5),
                            trackId: audioTargetTrackId,
                            colorIndex: clipColor,
                            type: 'audio',
                            title: isVideo ? file.name + ' (Audio)' : file.name,
                            start: State.currentTime,
                            duration: duration,
                            sourceOffset: 0,
                            audioEl: audioEl,
                            peaks: peaks,
                            peaksPerSecond: peaksPerSecond,
                            maxDuration: duration,
                            fileUrl: objectUrl,
                            effects: { volume: 1, echo: 0, cartoon: 0, cinematic: 0, robot: 0, noiseRed: 0 }
                        };

                        buildAudioGraph(newAudioClip);
                        State.clips.push(newAudioClip);
                    }
                } catch (err) {
                    console.error("Error processing file", file.name, err);
                }
            }));

            btnImport.innerHTML = `<i data-lucide="folder-plus" class="w-4 h-4"></i>`;
            lucide.createIcons();
            
            calcOverlaps();
            renderClips();
            drawCanvas();
            mediaInput.value = ''; 
        });

        // --- Editing Tools (Split & Delete) ---
        
        function deleteSelectedClip() {
            if (!State.selectedClipId) return;
            const clipToDelete = State.clips.find(c => c.id === State.selectedClipId);
            
            if (clipToDelete && clipToDelete.audioEl) {
                clipToDelete.audioEl.pause();
                clipToDelete.audioEl.removeAttribute('src');
                if(clipToDelete.audioNodes) clipToDelete.audioNodes.source.disconnect();
            }
            
            State.clips = State.clips.filter(c => c.id !== State.selectedClipId);
            State.selectedClipId = null;
            calcOverlaps();
            renderClips();
            updatePropertiesPanel();
            drawCanvas();
        }

        function splitClipAtPlayhead() {
            const time = State.currentTime;
            let targetClip = null;
            
            if (State.selectedClipId) {
                const c = State.clips.find(c => c.id === State.selectedClipId);
                if (c && time > c.start + 0.05 && time < c.start + c.duration - 0.05) {
                    targetClip = c;
                }
            }
            
            if (!targetClip) {
                const clipsUnderPlayhead = State.clips.filter(c => time > c.start + 0.05 && time < c.start + c.duration - 0.05);
                if (clipsUnderPlayhead.length > 0) {
                    targetClip = clipsUnderPlayhead[clipsUnderPlayhead.length - 1]; 
                }
            }
            
            if (!targetClip) return;
            
            const leftDuration = time - targetClip.start;
            const rightDuration = targetClip.duration - leftDuration;
            
            const newAudioEl = targetClip.audioEl ? new Audio(targetClip.fileUrl) : null;
            if (newAudioEl) newAudioEl.crossOrigin = "anonymous";
            
            const newVideoEl = targetClip.videoEl ? document.createElement('video') : null;
            if (newVideoEl) {
                newVideoEl.src = targetClip.fileUrl;
                newVideoEl.crossOrigin = "anonymous";
                newVideoEl.muted = true;
                newVideoEl.load();
            }

            const newClip = {
                ...targetClip,
                id: 'c_' + Date.now() + Math.random().toString(36).substr(2, 5),
                start: time,
                sourceOffset: targetClip.sourceOffset + leftDuration,
                duration: rightDuration,
                audioEl: newAudioEl,
                videoEl: newVideoEl,
                effects: JSON.parse(JSON.stringify(targetClip.effects)), 
                audioNodes: null 
            };
            
            if (newClip.audioEl) buildAudioGraph(newClip);

            targetClip.duration = leftDuration;
            State.clips.push(newClip);
            State.selectedClipId = newClip.id; 
            
            calcOverlaps();
            renderClips();
            updatePropertiesPanel();
            drawCanvas();
        }

        function calcOverlaps() {
            State.clips.forEach(c => c.overlapping = false);
            for(let i=0; i<State.clips.length; i++) {
                for(let j=i+1; j<State.clips.length; j++) {
                    const c1 = State.clips[i];
                    const c2 = State.clips[j];
                    if(c1.trackId === c2.trackId) {
                        if(c1.start < c2.start + c2.duration - 0.01 && c1.start + c1.duration > c2.start + 0.01) {
                            c1.overlapping = true;
                            c2.overlapping = true;
                        }
                    }
                }
            }
        }

        // --- Rendering Logic ---

        function updateTimelineWidth() {
            const totalWidth = State.duration * State.pixelsPerSecond;
            const finalWidth = Math.max(totalWidth, timelineScrollArea.clientWidth);
            tracksContentContainer.style.width = `${finalWidth}px`;
            rulerWrapper.style.width = `${finalWidth}px`;
            drawRuler(); 
        }

        function renderTrackHeaders() {
            trackHeadersContainer.innerHTML = '';
            State.tracks.forEach(track => {
                const palette = PALETTES[track.colorIndex];
                const muteIcon = track.muted ? 'volume-x' : 'volume-2';
                const muteClass = track.muted ? 'text-red-500 bg-red-50 dark:bg-red-500/10 dark:text-red-400' : 'text-surface-400 dark:text-surface-500';
                
                const el = document.createElement('div');
                el.className = `flex items-center px-2 bg-surface-50 dark:bg-surface-900 relative z-0`;
                el.style.height = `${track.height}px`;
                
                el.innerHTML = `
                    <div class="flex items-center gap-2 overflow-hidden w-full">
                        <div class="w-2.5 h-2.5 rounded-full shrink-0 shadow-inner" style="background-color: ${palette.wave}"></div>
                        <span class="text-[11px] font-medium text-surface-700 dark:text-surface-300 truncate flex-1">${track.name}</span>
                        <button onclick="toggleMute('${track.id}')" class="w-6 h-6 rounded flex items-center justify-center shrink-0 ${muteClass}" title="Mute Track">
                            <i data-lucide="${muteIcon}" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                `;
                trackHeadersContainer.appendChild(el);
            });
            lucide.createIcons();
        }

        function renderTracks() {
            const elementsToRemove = tracksContentContainer.querySelectorAll('.track-lane');
            elementsToRemove.forEach(e => e.remove());

            State.tracks.forEach(track => {
                const el = document.createElement('div');
                el.className = `track-lane track-separator relative w-full`;
                el.style.height = `${track.height}px`;
                el.dataset.trackId = track.id;
                if (track.muted) {
                    el.style.backgroundColor = isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)';
                }
                tracksContentContainer.appendChild(el);
            });
        }

        function renderClips() {
            document.querySelectorAll('.clip').forEach(e => e.remove());

            State.clips.forEach(clip => {
                const track = State.tracks.find(t => t.id === clip.trackId);
                if (!track) return;

                const lane = tracksContentContainer.querySelector(`.track-lane[data-track-id="${clip.trackId}"]`);
                if (!lane) return;

                const el = document.createElement('div');
                const palette = PALETTES[clip.colorIndex];
                
                let extraClasses = '';
                if(clip.overlapping) extraClasses += ' overlapping';
                if(State.selectedClipId === clip.id) extraClasses += ' selected';

                el.className = `clip absolute top-[3px] bottom-[3px] rounded border overflow-hidden cursor-pointer ${extraClasses}`;
                if(track.muted) el.style.opacity = '0.4';
                
                el.dataset.clipId = clip.id;
                el.style.left = `${clip.start * State.pixelsPerSecond}px`;
                el.style.width = `${clip.duration * State.pixelsPerSecond}px`;
                el.style.backgroundColor = palette.bg;
                el.style.borderColor = palette.border;

                let icon = 'film';
                if (clip.type === 'audio') icon = 'music';
                else if (clip.type === 'image') icon = 'image';

                const hasWaveform = clip.peaks && clip.peaks.length > 0;
                
                el.innerHTML = `
                    <div class="absolute inset-x-0 top-0 h-4 sm:h-5 flex items-center px-1.5 sm:px-2 gap-1.5 z-20 backdrop-blur-sm pointer-events-none" style="background-color: ${palette.bg}cc">
                        <i data-lucide="${icon}" class="w-3 h-3 shrink-0" style="color: ${palette.text}"></i>
                        <span class="text-[10px] font-semibold truncate" style="color: ${palette.text}">${clip.title}</span>
                    </div>
                    <div class="trim-handle left" data-action="trimLeft"></div>
                    <div class="trim-handle right" data-action="trimRight"></div>
                    ${hasWaveform ? `<canvas class="waveform-canvas absolute inset-0 w-full h-full z-10 opacity-90"></canvas>` : ''}
                `;

                lane.appendChild(el);

                if(hasWaveform) {
                    const cvs = el.querySelector('.waveform-canvas');
                    drawCachedWaveform(cvs, clip, palette);
                }
            });
            lucide.createIcons();
        }

        function drawCachedWaveform(canvas, clip, palette) {
            if (!clip.peaks || clip.peaks.length === 0) return;
            
            const cssWidth = clip.duration * State.pixelsPerSecond;
            const trackHeight = State.tracks.find(t=>t.id===clip.trackId).height;
            const cssHeight = trackHeight; 

            canvas.style.width = '100%';
            canvas.style.height = '100%';

            const internalWidth = Math.min(Math.ceil(cssWidth), 8192); 
            canvas.width = internalWidth;
            canvas.height = cssHeight;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, internalWidth, cssHeight);

            const midY = (cssHeight / 2) + 10; 
            const maxAmplitude = (cssHeight / 2) * 0.75; 
            
            ctx.fillStyle = palette.wave;
            ctx.beginPath();
            ctx.moveTo(0, midY);

            const startPeakIdx = clip.sourceOffset * clip.peaksPerSecond;
            const durationPeaks = clip.duration * clip.peaksPerSecond;
            const peaksPerPixel = durationPeaks / internalWidth;
            
            for (let x = 0; x < internalWidth; x++) {
                let max = 0;
                const peakStart = Math.floor(startPeakIdx + x * peaksPerPixel);
                const peakEnd = Math.floor(startPeakIdx + (x + 1) * peaksPerPixel);
                for(let p = peakStart; p < peakEnd && p < clip.peaks.length; p++) {
                    if(clip.peaks[p].max > max) max = clip.peaks[p].max;
                }
                ctx.lineTo(x, midY - (max * maxAmplitude));
            }
            
            for (let x = internalWidth - 1; x >= 0; x--) {
                let min = 0;
                const peakStart = Math.floor(startPeakIdx + x * peaksPerPixel);
                const peakEnd = Math.floor(startPeakIdx + (x + 1) * peaksPerPixel);
                for(let p = peakStart; p < peakEnd && p < clip.peaks.length; p++) {
                    if(clip.peaks[p].min < min) min = clip.peaks[p].min;
                }
                ctx.lineTo(x, midY - (min * maxAmplitude));
            }
            
            ctx.closePath();
            ctx.fill();
        }

        function drawRuler() {
            const ctx = rulerCanvas.getContext('2d');
            const scrollLeft = timelineScrollArea.scrollLeft;
            const w = timelineScrollArea.clientWidth;
            const h = 28;
            
            if (rulerCanvas.width !== w) {
                rulerCanvas.style.width = w + 'px';
                rulerCanvas.width = w;
            }
            if (rulerCanvas.height !== h) rulerCanvas.height = h;
            
ctx.clearRect(0, 0, w, h);
            const isDark = document.documentElement.classList.contains('dark');
            ctx.fillStyle = isDark ? '#231F20' : '#f3f4f6'; // Tailwind gray-800 / gray-100
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = isDarkMode ? '#1a1a1a' : '#ffffff';
            ctx.fillRect(0, 0, w, h);
            
            ctx.fillStyle = isDarkMode ? '#a3a3a3' : '#737373';
            ctx.font = '600 10px "JetBrains Mono"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            const secondsPer100px = 100 / State.pixelsPerSecond;
            let majorTickSecs = 1;
            if (secondsPer100px > 5) majorTickSecs = 10;
            else if (secondsPer100px > 2) majorTickSecs = 5;
            else if (secondsPer100px > 0.5) majorTickSecs = 1;
            else majorTickSecs = 0.5;

            const startTime = scrollLeft / State.pixelsPerSecond;
            const endTime = (scrollLeft + w) / State.pixelsPerSecond;
            const firstTick = Math.floor(startTime / majorTickSecs) * majorTickSecs;

            for (let sec = firstTick; sec <= endTime; sec += majorTickSecs) {
                if (sec < 0) continue;
                
                const x = (sec * State.pixelsPerSecond) - scrollLeft;
                
                ctx.beginPath(); ctx.moveTo(x, h - 6); ctx.lineTo(x, h);
                ctx.strokeStyle = isDarkMode ? '#525252' : '#d4d4d4';
                ctx.stroke();

                const mins = Math.floor(sec / 60);
                const secs = Math.floor(sec % 60).toString().padStart(2, '0');
                const text = majorTickSecs >= 1 ? `${mins}:${secs}` : `${secs}.${(sec%1)*10}`;
                ctx.fillText(text, x, 3);

                const minorDivs = majorTickSecs >= 1 ? 5 : 2;
                for(let j=1; j<minorDivs; j++) {
                    const mx = x + (j * majorTickSecs / minorDivs) * State.pixelsPerSecond;
                    if (mx >= 0 && mx <= w) {
                        ctx.beginPath(); ctx.moveTo(mx, h - 3); ctx.lineTo(mx, h);
                        ctx.strokeStyle = isDarkMode ? '#262626' : '#e5e5e5';
                        ctx.stroke();
                    }
                }
            }
        }

        // --- Canvas & Drag Logic ---
        function getCanvasMousePos(e) {
            const rect = canvasAspectWrapper.getBoundingClientRect();
            const canvas = document.getElementById('renderCanvas');
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        }

        function setupEventListeners() {
            function setZoom(newPPS) {
                newPPS = Math.max(10, Math.min(300, newPPS));
                if (newPPS === State.pixelsPerSecond) return;
                
                const centerTime = (timelineScrollArea.scrollLeft + timelineScrollArea.clientWidth / 2) / State.pixelsPerSecond;
                
                State.pixelsPerSecond = newPPS;
                updateTimelineWidth();
                renderClips();
                updatePlayhead();
                
                timelineScrollArea.scrollLeft = (centerTime * State.pixelsPerSecond) - (timelineScrollArea.clientWidth / 2);
                drawRuler(); 
            }

            btnZoomIn.addEventListener('click', () => setZoom(State.pixelsPerSecond + 25));
            btnZoomOut.addEventListener('click', () => setZoom(State.pixelsPerSecond - 25));

            btnPlay.addEventListener('click', togglePlay);
            
            // Global Keyboard Shortcuts (Space and K to play/pause)
            document.addEventListener('keydown', (e) => {
                // Ignore if user is typing in an input, textarea, or contenteditable element
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
                
                if (e.code === 'Space' || e.key.toLowerCase() === 'k') {
                    e.preventDefault(); // Prevent page scroll on Space
                    togglePlay();
                }
            });
            btnStop.addEventListener('click', stopMedia);
            btnSplit.addEventListener('click', splitClipAtPlayhead);
            btnDelete.addEventListener('click', deleteSelectedClip);

            btnExportMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                exportDropdown.classList.toggle('hidden');
                exportDropdown.classList.toggle('flex');
            });

            btnViewMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                viewDropdown.classList.toggle('hidden');
                viewDropdown.classList.toggle('flex');
            });

            document.addEventListener('click', () => {
                if(!exportDropdown.classList.contains('hidden')){
                    exportDropdown.classList.add('hidden');
                    exportDropdown.classList.remove('flex');
                }
                if(!viewDropdown.classList.contains('hidden')){
                    viewDropdown.classList.add('hidden');
                    viewDropdown.classList.remove('flex');
                }
            });

            document.querySelectorAll('.export-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const format = e.currentTarget.dataset.format;
                    startExport(format);
                });
            });

            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                if (e.key.toLowerCase() === 's') splitClipAtPlayhead();
                else if (e.key === 'Delete' || e.key === 'Backspace') deleteSelectedClip();
                else if (e.code === 'Space') { 
                    e.preventDefault(); 
                    togglePlay(); 
                }
            });

            // Canvas Interaction Handlers
            canvasAspectWrapper.addEventListener('mousedown', (e) => {
                const pos = getCanvasMousePos(e);
                
                let activeVisualClips = State.clips.filter(c =>
                    (c.type === 'video' || c.type === 'image' || c.type === 'text') &&
                    State.currentTime >= c.start &&
                    State.currentTime < c.start + c.duration
                );

                activeVisualClips.sort((a, b) => {
                    const idxA = State.tracks.findIndex(t => t.id === a.trackId);
                    const idxB = State.tracks.findIndex(t => t.id === b.trackId);
                    return idxA - idxB; 
                });

                let clickedClip = null;
                const canvas = document.getElementById('renderCanvas');

                for (let clip of activeVisualClips) {

                    let dw = canvas.width, dh = canvas.height;
                    
                    if (clip.type === 'text') {
                        const ctx = canvas.getContext('2d');
                        ctx.font = `${clip.effects.fontWeight} 100px ${clip.effects.fontFamily}`;
                        const metrics = ctx.measureText(clip.text);
                        dw = metrics.width;
                        dh = 100;
                    } else {
                        let source = clip.type === 'image' ? clip.imageEl : clip.videoEl;
                        if (!source) continue;
                        const sRatio = (source.naturalWidth || source.videoWidth) / (source.naturalHeight || source.videoHeight);
                        const cRatio = canvas.width / canvas.height;
                        if (!isNaN(sRatio) && sRatio > 0) {
                            if (sRatio > cRatio) dh = canvas.width / sRatio;
                            else dw = canvas.height * sRatio;
                        }
                    }

                    const scale = clip.effects.scale !== undefined ? clip.effects.scale : 1;
                    const rotate = clip.effects.rotate !== undefined ? clip.effects.rotate : 0;
                    const offsetX = clip.effects.offsetX || 0;
                    const offsetY = clip.effects.offsetY || 0;

                    const cx = canvas.width/2 + offsetX;
                    const cy = canvas.height/2 + offsetY;

                    let mx = pos.x - cx;
                    let my = pos.y - cy;

                    const rad = -rotate * Math.PI / 180;
                    const rmx = mx * Math.cos(rad) - my * Math.sin(rad);
                    const rmy = mx * Math.sin(rad) + my * Math.cos(rad);

                    const smx = rmx / scale;
                    const smy = rmy / scale;

                    if (smx >= -dw/2 && smx <= dw/2 && smy >= -dh/2 && smy <= dh/2) {
                        clickedClip = clip;
                        break;
                    }
                }

                if (clickedClip) {
                    State.selectedClipId = clickedClip.id;
                    updatePropertiesPanel();
                    renderClips();
                    drawCanvas();
                    
                    canvasDrag.active = true;
                    canvasDrag.clipId = clickedClip.id;
                    canvasDrag.startX = pos.x;
                    canvasDrag.startY = pos.y;
                    canvasDrag.initOffsetX = clickedClip.effects.offsetX || 0;
                    canvasDrag.initOffsetY = clickedClip.effects.offsetY || 0;
                    document.getElementById('renderCanvas').classList.add('dragging');
                } else {
                    State.selectedClipId = null;
                    updatePropertiesPanel();
                    renderClips();
                    drawCanvas();
                }
            });

            window.addEventListener('mousemove', (e) => {
                if (canvasDrag.active) {
                    const pos = getCanvasMousePos(e);
                    const clip = State.clips.find(c => c.id === canvasDrag.clipId);
                    if (clip) {
                        if (!clip.effects) clip.effects = {};
                        clip.effects.offsetX = canvasDrag.initOffsetX + (pos.x - canvasDrag.startX);
                        clip.effects.offsetY = canvasDrag.initOffsetY + (pos.y - canvasDrag.startY);
                        drawCanvas();
                    }
                }
            });

            window.addEventListener('mouseup', () => {
                canvasDrag.active = false;
                document.getElementById('renderCanvas').classList.remove('dragging');
            });


            // Timeline Ruler
            rulerCanvas.addEventListener('mousedown', (e) => {
                ensureAudioContext();
                
                const updateTimeFromMouse = (ev) => {
                    const rect = rulerCanvas.getBoundingClientRect();
                    const xInVisibleRuler = ev.clientX - rect.left;
                    const absoluteX = timelineScrollArea.scrollLeft + xInVisibleRuler;
                    State.currentTime = Math.max(0, Math.min(absoluteX / State.pixelsPerSecond, State.duration));
                    updatePlayhead();
                    syncMediaElements();
                    drawCanvas();
                };
                updateTimeFromMouse(e);
                
                const onMouseMove = (ev) => updateTimeFromMouse(ev);
                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            // Synchronize vertical scroll of track headers
            timelineScrollArea.addEventListener('scroll', () => {
                document.getElementById('trackHeaders').style.transform = `translateY(-${timelineScrollArea.scrollTop}px)`;
                drawRuler();
            });

            tracksContentContainer.addEventListener('mousedown', (e) => {
                if (!e.target.closest('.clip')) {
                    State.selectedClipId = null;
                    renderClips(); 
                    updatePropertiesPanel();
                    drawCanvas();
                }
                handleMouseDown(e);
            });
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        function handleMouseDown(e) {
            const trimHandle = e.target.closest('.trim-handle');
            const clipEl = e.target.closest('.clip');
            if (!clipEl) return;

            const clipId = clipEl.dataset.clipId;
            const clip = State.clips.find(c => c.id === clipId);
            if (!clip) return;

            if (State.selectedClipId !== clipId) {
                State.selectedClipId = clipId;
                renderClips(); 
                updatePropertiesPanel();
                drawCanvas();
            }

            State.drag.active = true;
            State.drag.clipId = clipId;
            State.drag.initialStart = clip.start;
            State.drag.initialDuration = clip.duration;
            State.drag.initialSourceOffset = clip.sourceOffset;
            State.drag.initialTrackId = clip.trackId;
            State.drag.startX = e.clientX;

            if (trimHandle) {
                State.drag.type = trimHandle.dataset.action;
            } else {
                State.drag.type = 'move';
                const freshClipEl = document.querySelector(`.clip[data-clip-id="${clip.id}"]`);
                if(freshClipEl) freshClipEl.classList.add('dragging');
            }
        }

        function handleMouseMove(e) {
            if (!State.drag.active) return;

            const clip = State.clips.find(c => c.id === State.drag.clipId);
            const clipEl = document.querySelector(`.clip[data-clip-id="${clip.id}"]`);
            if (!clip || !clipEl) return;

            const deltaX = e.clientX - State.drag.startX;
            let deltaTime = deltaX / State.pixelsPerSecond;

            const palette = PALETTES[clip.colorIndex];

            if (State.drag.type === 'move') {
                clip.start = Math.max(0, State.drag.initialStart + deltaTime);
                clipEl.style.left = `${clip.start * State.pixelsPerSecond}px`;

                const rect = tracksContentContainer.getBoundingClientRect();
                const yPos = e.clientY - rect.top;
                
                let currentY = 0;
                let hoveredTrackId = null;
                for (const tr of State.tracks) {
                    if (yPos >= currentY && yPos < currentY + tr.height) { hoveredTrackId = tr.id; break; }
                    currentY += tr.height;
                }

                if (hoveredTrackId && hoveredTrackId !== clip.trackId) {
                    const tgtTrack = State.tracks.find(t=>t.id===hoveredTrackId);
                    
                    const isVisual = clip.type === 'video' || clip.type === 'image';
                    const isTgtVisual = tgtTrack.type === 'video';
                    const isAudio = clip.type === 'audio';
                    const isTgtAudio = tgtTrack.type === 'audio';

                    if ((isVisual && isTgtVisual) || (isAudio && isTgtAudio)) {
                        clip.trackId = hoveredTrackId;
                        const newLane = tracksContentContainer.querySelector(`.track-lane[data-track-id="${hoveredTrackId}"]`);
                        if(newLane) newLane.appendChild(clipEl);
                    }
                }

            } else if (State.drag.type === 'trimLeft') {
                let newStart = State.drag.initialStart + deltaTime;
                let newSourceOffset = State.drag.initialSourceOffset + deltaTime;
                let newDuration = State.drag.initialDuration - deltaTime;

                if (newSourceOffset < 0) {
                    deltaTime = -State.drag.initialSourceOffset;
                    newStart = State.drag.initialStart + deltaTime;
                    newSourceOffset = 0;
                    newDuration = State.drag.initialDuration - deltaTime;
                }
                
                if (newDuration < 0.2) {
                    newDuration = 0.2;
                    newStart = (State.drag.initialStart + State.drag.initialDuration) - 0.2;
                    newSourceOffset = (State.drag.initialSourceOffset + State.drag.initialDuration) - 0.2;
                }

                clip.start = newStart;
                clip.sourceOffset = newSourceOffset;
                clip.duration = newDuration;
                
                clipEl.style.left = `${clip.start * State.pixelsPerSecond}px`;
                clipEl.style.width = `${clip.duration * State.pixelsPerSecond}px`;
                
                drawCachedWaveform(clipEl.querySelector('.waveform-canvas'), clip, palette);

            } else if (State.drag.type === 'trimRight') {
                let newDuration = State.drag.initialDuration + deltaTime;
                
                const maxAllowedDuration = clip.maxDuration - clip.sourceOffset;
                if (newDuration > maxAllowedDuration) newDuration = maxAllowedDuration;
                if (newDuration < 0.2) newDuration = 0.2;
                
                clip.duration = newDuration;
                clipEl.style.width = `${clip.duration * State.pixelsPerSecond}px`;
                
                drawCachedWaveform(clipEl.querySelector('.waveform-canvas'), clip, palette);
            }
            
            calcOverlaps();
            if(clip.overlapping) clipEl.classList.add('overlapping');
            else clipEl.classList.remove('overlapping');
            
            if (State.drag.type === 'move' || State.drag.type === 'trimLeft' || State.drag.type === 'trimRight') {
                drawCanvas();
            }
        }

        function handleMouseUp(e) {
            if (!State.drag.active) return;
            const clipEl = document.querySelector(`.clip[data-clip-id="${State.drag.clipId}"]`);
            if (clipEl) clipEl.classList.remove('dragging');
            State.drag.active = false;
            
            calcOverlaps();
            renderClips();
            syncMediaElements(); 
            drawCanvas();
        }

        // --- Audio Synchronization Engine ---
        function syncMediaElements() {
            State.clips.forEach(clip => {
                const track = State.tracks.find(t => t.id === clip.trackId);
                const el = clip.audioEl || clip.videoEl;
                
                if (el) {
                    if (track && track.muted && clip.audioEl) {
                        if (!clip.audioEl.paused) clip.audioEl.pause();
                        return;
                    }

                    const shouldPlay = State.isPlaying && State.currentTime >= clip.start && State.currentTime <= clip.start + clip.duration;
                    
                    if (shouldPlay) {
                        if (clip.audioEl) applyAudioEffects(clip);
                        
                        const targetTime = clip.sourceOffset + (State.currentTime - clip.start);
                        
                        if (Math.abs(el.currentTime - targetTime) > 0.15) {
                            el.currentTime = targetTime;
                        }
                        
                        if (el.paused) {
                            el.play().catch(e => console.warn("Auto-play prevented:", e));
                        }
                    } else {
                        if (!el.paused) {
                            el.pause();
                        }
                        if (!State.isPlaying && State.currentTime >= clip.start && State.currentTime <= clip.start + clip.duration) {
                            const targetTime = clip.sourceOffset + (State.currentTime - clip.start);
                            el.currentTime = targetTime;
                        }
                    }
                }
            });
        }

        function stopAllMedia() {
            State.clips.forEach(clip => {
                const el = clip.audioEl || clip.videoEl;
                if (el && !el.paused) {
                    el.pause();
                }
            });
        }

        // --- Playback Engine ---

        function formatTime(seconds) {
            const m = Math.floor(seconds / 60).toString().padStart(2, '0');
            const s = Math.floor(seconds % 60).toString().padStart(2, '0');
            const ms = Math.floor((seconds % 1) * 100).toString().padStart(2, '0');
            return `${m}:${s}.${ms}`;
        }

        function updatePlayhead() {
            const x = State.currentTime * State.pixelsPerSecond;
            playhead.style.transform = `translateX(${x}px)`;
            rulerPlayhead.style.transform = `translateX(${x}px)`;
            
            const timeStr = formatTime(State.currentTime);
            timeDisplay.textContent = timeStr;
            previewTimeText.textContent = timeStr;
            playheadTimePopup.textContent = timeStr;
            
            if (State.isPlaying) {
                const containerRect = timelineScrollArea.getBoundingClientRect();
                const relativeX = x - timelineScrollArea.scrollLeft;
                if (relativeX > containerRect.width * 0.85) {
                    timelineScrollArea.scrollLeft = x - (containerRect.width * 0.85);
                }
            }
        }

        function togglePlay() {
            ensureAudioContext();

            if (State.currentTime >= State.duration) State.currentTime = 0;
            
            State.isPlaying = !State.isPlaying;
            State.lastRenderTime = performance.now();
            
            if (State.isPlaying) {
                wrapperPlay.classList.add('hidden');
                wrapperPlay.classList.remove('flex');
                wrapperPause.classList.remove('hidden');
                wrapperPause.classList.add('flex');
                
                btnPlay.classList.add('opacity-80');
                
                syncMediaElements();
                requestAnimationFrame(loop);
            } else {
                wrapperPause.classList.add('hidden');
                wrapperPause.classList.remove('flex');
                wrapperPlay.classList.remove('hidden');
                wrapperPlay.classList.add('flex');
                
                btnPlay.classList.remove('opacity-80');
                
                stopAllMedia();
            }
        }

        function stopMedia() {
            State.isPlaying = false;
            State.currentTime = 0;
            
            wrapperPause.classList.add('hidden');
            wrapperPause.classList.remove('flex');
            wrapperPlay.classList.remove('hidden');
            wrapperPlay.classList.add('flex');
            
            btnPlay.classList.remove('opacity-80');
            
            stopAllMedia();
            updatePlayhead();
            drawCanvas();
            timelineScrollArea.scrollLeft = 0;
        }

        function loop(now) {
            if (!State.isPlaying && !State.isExporting) return;

            const dt = (now - State.lastRenderTime) / 1000;
            State.lastRenderTime = now;
            State.currentTime += dt;

            if (State.currentTime >= State.duration) {
                if(!State.isExporting) stopMedia();
                return;
            }

            if(!State.isExporting) {
                syncMediaElements();
                drawCanvas();
            }
            
            updatePlayhead();
            requestAnimationFrame(loop);
        }

        // --- Export Engine ---
        function startExport(format) {
            if (State.isExporting) return;
            ensureAudioContext();
            
            State.isExporting = true;
            exportOverlay.classList.remove('hidden');
            exportOverlay.classList.add('flex');
            
            stopMedia();
            State.currentTime = 0;
            
            const canvasEl = document.getElementById('renderCanvas');
            let finalStream;
            let mimeType;
            let extension;

            if (format === 'video') {
                const canvasStream = canvasEl.captureStream(30);
                const audioTracks = State.masterStreamNode.stream.getAudioTracks();
                if (audioTracks.length > 0) {
                    finalStream = new MediaStream([...canvasStream.getVideoTracks(), ...audioTracks]);
                } else {
                    finalStream = canvasStream;
                }
                mimeType = 'video/webm;codecs=vp9,opus';
                extension = 'webm';
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
                mimeType = format === 'video' ? 'video/webm' : 'audio/webm';
            }

            const recorder = new MediaRecorder(finalStream, { mimeType: mimeType });
            const chunks = [];
            
            recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
            
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `StudioPro_Export.${extension}`;
                a.click();
                URL.revokeObjectURL(url);
                
                State.isExporting = false;
                exportOverlay.classList.add('hidden');
                exportOverlay.classList.remove('flex');
                stopMedia();
            };

            State.currentTime = 0;
            State.lastRenderTime = performance.now();
            updatePlayhead();
            
            State.clips.forEach(clip => {
                const el = clip.audioEl || clip.videoEl;
                if (el) {
                    if (clip.audioEl) applyAudioEffects(clip);
                    el.currentTime = clip.sourceOffset;
                    el.play().catch(e=>{});
                }
            });

            recorder.start();
            
            function exportLoop(now) {
                if (!State.isExporting) return;

                const dt = (now - State.lastRenderTime) / 1000;
                State.lastRenderTime = now;
                State.currentTime += dt;

                State.clips.forEach(clip => {
                    const el = clip.audioEl || clip.videoEl;
                    if (el && State.currentTime > clip.start + clip.duration) {
                        if (!el.paused) el.pause();
                    }
                });

                const progress = Math.min(100, Math.round((State.currentTime / State.duration) * 100));
                exportProgressBar.style.width = `${progress}%`;
                exportProgressText.textContent = `${progress}%`;

                if (State.currentTime >= State.duration) {
                    recorder.stop(); 
                    return;
                }

                updatePlayhead();
                drawCanvas();
                requestAnimationFrame(exportLoop);
            }
            
            requestAnimationFrame(exportLoop);
        }

        updatePropertiesPanel();
        init();
    