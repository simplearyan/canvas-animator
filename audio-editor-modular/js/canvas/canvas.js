import { AudioContext, isDarkMode, PALETTES, State, ASPECT_RATIOS, trackHeadersContainer, tracksContentContainer, timelineScrollArea, rulerWrapper, rulerCanvas, playhead, rulerPlayhead, playheadTimePopup, timeDisplay, previewTimeText, btnZoomIn, btnZoomOut, btnPlay, wrapperPlay, wrapperPause, btnStop, btnSplit, btnDelete, btnImport, btnAddText, mediaInput, canvasColorPicker, canvasColorIcon, btnToggleTimecode, headerProperties, headerPropertiesPlaceholder, mainAppWrapper, timelineContainer, timelineWorkspace, propertiesSidebar, sidebarContent, btnToggleInspector, btnDockInspector, btnCloseInspector, btnToggleWidth, iconDock, iconCloseInspector, iconWidth, btnExportMenu, exportDropdown, exportOverlay, exportProgressBar, exportProgressText, btnViewMenu, viewDropdown, btnToggleLayout, iconLayout, mainWorkspace, btnToggleAspect, btnTogglePreview, btnToggleTimeline, btnToggleTheme, previewContainer, previewWrapper, canvasAspectWrapper, iconAspect, iconEye, iconTheme, canvasDrag, timelineResizer, isResizingTimeline, startTimelineY, startPreviewHeight, btnToggleTrackHeight, TRACK_SIZES, currentTrackSize } from '../core/core.js';
import { init, ensureAudioContext, applyInspectorLayout, updateCanvasResolution, resizeCanvas, resizer, isResizingInspector, startResizingX, startInspectorWidth, easeOutQuart, drawCanvas, updateSidebarPanel, updatePropertiesPanel } from '../ui/ui.js';
import { buildAudioGraph, applyAudioEffects, syncMediaElements, stopAllMedia, formatTime, updatePlayhead, togglePlay, stopMedia, loop } from '../audio/audio.js';
import { getAvailableTrack, deleteSelectedClip, splitClipAtPlayhead, calcOverlaps, getCanvasMousePos, setupEventListeners, handleMouseDown, handleMouseMove, handleMouseUp } from '../timeline/timeline.js';
import { openExportModal, closeExportModal, cancelExport, submitExport, startExport } from '../export/export.js';

// --- Rendering Logic ---

export function updateTimelineWidth() {
    const totalWidth = State.duration * State.pixelsPerSecond;
    const finalWidth = Math.max(totalWidth, timelineScrollArea.clientWidth);
    tracksContentContainer.style.width = `${finalWidth}px`;
    rulerWrapper.style.width = `${finalWidth}px`;
    drawRuler(); 
}

export function renderTrackHeaders() {
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

export function renderTracks() {
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

export function renderClips() {
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

export function drawCachedWaveform(canvas, clip, palette) {
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

export function drawRuler() {
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
