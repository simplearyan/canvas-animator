import { AudioContext, isDarkMode, PALETTES, State, ASPECT_RATIOS, trackHeadersContainer, tracksContentContainer, timelineScrollArea, rulerWrapper, rulerCanvas, playhead, rulerPlayhead, playheadTimePopup, timeDisplay, previewTimeText, btnZoomIn, btnZoomOut, btnPlay, wrapperPlay, wrapperPause, btnStop, btnSplit, btnDelete, btnImport, btnAddText, mediaInput, canvasColorPicker, canvasColorIcon, btnToggleTimecode, headerProperties, headerPropertiesPlaceholder, mainAppWrapper, timelineContainer, timelineWorkspace, propertiesSidebar, sidebarContent, btnToggleInspector, btnDockInspector, btnCloseInspector, btnToggleWidth, iconDock, iconCloseInspector, iconWidth, btnExportMenu, exportDropdown, exportOverlay, exportProgressBar, exportProgressText, btnViewMenu, viewDropdown, btnToggleLayout, iconLayout, mainWorkspace, btnToggleAspect, btnTogglePreview, btnToggleTimeline, btnToggleTheme, previewContainer, previewWrapper, canvasAspectWrapper, iconAspect, iconEye, iconTheme, canvasDrag, timelineResizer, isResizingTimeline, startTimelineY, startPreviewHeight, btnToggleTrackHeight, TRACK_SIZES, currentTrackSize, setupCoreListeners } from '../core/core.js';
import { buildAudioGraph, applyAudioEffects, syncMediaElements, stopAllMedia, formatTime, updatePlayhead, togglePlay, stopMedia, loop } from '../audio/audio.js';
import { getAvailableTrack, deleteSelectedClip, splitClipAtPlayhead, calcOverlaps, getCanvasMousePos, setupEventListeners, handleMouseDown, handleMouseMove, handleMouseUp, setupTimelineImportListeners } from '../timeline/timeline.js';
import { updateTimelineWidth, renderTrackHeaders, renderTracks, renderClips, drawCachedWaveform, drawRuler } from '../canvas/canvas.js';
import { openExportModal, closeExportModal, cancelExport, submitExport, startExport } from '../export/export.js';
// --- Initialization ---
export function init() {
    renderTrackHeaders();
    renderTracks();
    updateTimelineWidth();
    updatePlayhead();
    setupEventListeners();
    resizeCanvas();
    applyInspectorLayout();
    setupCoreListeners();
    setupTimelineImportListeners();
    setupUIListeners();
    updatePropertiesPanel();
}

export function ensureAudioContext() {
    if (!State.audioCtxInitialzed) {
        audioCtx = new AudioContext();
        State.masterStreamNode = audioCtx.createMediaStreamDestination();
        State.speakerNode = audioCtx.createGain();
        State.speakerNode.connect(audioCtx.destination);
        State.audioCtxInitialzed = true;
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

// --- Inspector Layout Logic ---
export function applyInspectorLayout() {
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

export function setupUIListeners() {
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
            const icon = btnToggleTimecode.querySelector('svg') || btnToggleTimecode.querySelector('i');
            if (icon) {
                if (timeText.classList.contains('hidden')) {
                    icon.style.opacity = '0.5';
                } else {
                    icon.style.opacity = '1';
                }
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

export function updateCanvasResolution() {
    const canvas = document.getElementById('renderCanvas');
    const aspectStr = ASPECT_RATIOS[State.preview.aspectIndex].value;
    const [wRatio, hRatio] = aspectStr.split('/').map(Number);
    
    const baseRes = 1920; 
    
    let targetW, targetH;
    if (wRatio >= hRatio) {
        targetW = baseRes;
        targetH = baseRes * (hRatio / wRatio);
    } else {
        targetH = baseRes;
        targetW = baseRes * (wRatio / hRatio);
    }
    
    if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
    }
    return { w: targetW, h: targetH };
}

export function resizeCanvas() {
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
export const resizer = document.getElementById('inspectorResizer');
export let isResizingInspector = false;
export let startResizingX = 0;
export let startInspectorWidth = 0;

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

}
// Helper for animations
export const easeOutQuart = x => 1 - Math.pow(1 - x, 4);

export function drawCanvas(targetCtx, targetW, targetH) {
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

                // Interactive Bounding Box for Selected
                if (clip.id === State.selectedClipId && !State.isExporting) {
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
                    if (clip.id === State.selectedClipId && !State.isExporting) {
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

// --- Sidebar Inspector UI ---
export function updateSidebarPanel() {
    const clip = State.clips.find(c => c.id === State.selectedClipId);
    
    if (!clip || (clip.type !== 'image' && clip.type !== 'video' && clip.type !== 'text')) {
        sidebarContent.className = "flex flex-col items-center justify-center p-4 w-full h-full";
        sidebarContent.innerHTML = `
            <div class="flex flex-col items-center justify-center text-surface-500 dark:text-surface-400 py-16 h-full w-full">
                <div class="w-16 h-16 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm rounded-full flex items-center justify-center mb-4">
                    <i data-lucide="mouse-pointer-click" class="w-8 h-8 opacity-50"></i>
                </div>
                <p class="text-sm font-bold text-surface-700 dark:text-surface-300">Select an element to edit</p>
                <p class="text-xs mt-1 text-center max-w-[200px] text-surface-500 dark:text-surface-400">Click any clip on the timeline to view its properties.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    if (!State.inspector.visible) {
        State.inspector.visible = true;
        applyInspectorLayout();
    }

    if (!clip.effects) clip.effects = {};
    const fx = clip.effects;
    
    // Defaults
    const shadowEnable = fx.shadowEnable || false;
    const shadowColor = fx.shadowColor || '#000000';
    const shadowBlur = fx.shadowBlur !== undefined ? fx.shadowBlur : 20;
    const shadowX = fx.shadowX || 0;
    const shadowY = fx.shadowY !== undefined ? fx.shadowY : 10;

    const animIn = fx.animIn || 'none';
    const animInDur = fx.animInDur || 1.0;
    const animOut = fx.animOut || 'none';
    const animOutDur = fx.animOutDur || 1.0;
    const animLoop = fx.animLoop || 'none';

    const isHorizontal = State.inspector.dock === 'bottom' || State.inspector.dock === 'top';

    // High Contrast Slider settings
    const sliderFill = isDarkMode ? '#ffffff' : '#111111';
    const sliderBg = isDarkMode ? '#404040' : '#e5e5e5';

const isText = clip.type === 'text';
    let textHTML = '';
    if (isText) {
        textHTML = `
            <details class="group bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 shadow-sm rounded-lg shrink-0 ${isHorizontal ? 'w-[280px]' : 'w-full'} overflow-hidden flex flex-col" open>
                <summary class="flex items-center justify-between p-3 ${isHorizontal ? '' : 'cursor-pointer'} list-none appearance-none select-none bg-surface-100 dark:bg-surface-800/80 border-b border-surface-200 dark:border-surface-700 " onclick="${isHorizontal ? 'event.preventDefault();' : ''}">
                    <div class="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2"><i data-lucide="type" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Text Content</div>
                    ${isHorizontal ? '' : '<i data-lucide="chevron-down" class="w-4 h-4 text-surface-500 transition-transform group-open:rotate-180"></i>'}
                </summary>
                <div class="p-3 flex flex-col gap-3 bg-surface-50 dark:bg-surface-900/50 flex-1">
                    <textarea class="w-full h-20 bg-surface-50 dark:bg-surface-900/80 shadow-inner border border-surface-200 dark:border-surface-700 rounded-lg p-2 text-sm text-surface-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" oninput="State.clips.find(c=>c.id==='${clip.id}').text=this.value; drawCanvas();">${clip.text}</textarea>
                    
                    <div class="flex flex-col gap-2 mt-1">
                        <div>
                            <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Font</label>
                            <select class="w-full text-xs p-2 pl-3 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('${clip.id}', 'fontFamily', this.value)">
                                <option value="Rubik" class="font-rubik font-bold" ${fx.fontFamily === 'Rubik' ? 'selected' : ''}>Rubik (Fireship)</option>
                                <option value="Montserrat" class="font-montserrat font-bold" ${fx.fontFamily === 'Montserrat' ? 'selected' : ''}>Montserrat (Clean)</option>
                                <option value="Inter" class="font-inter font-bold" ${fx.fontFamily === 'Inter' ? 'selected' : ''}>Inter (Modern)</option>
                                <option value="Oswald" class="font-oswald font-bold" ${fx.fontFamily === 'Oswald' ? 'selected' : ''}>Oswald (Tall)</option>
                                <option value="Bebas Neue" class="font-bebas font-bold" ${fx.fontFamily === 'Bebas Neue' ? 'selected' : ''}>Bebas Neue (Impact)</option>
                                <option value="Bangers" class="font-bangers font-bold" ${fx.fontFamily === 'Bangers' ? 'selected' : ''}>Bangers (Comic)</option>
                                <option value="Fredoka" class="font-fredoka font-bold" ${fx.fontFamily === 'Fredoka' ? 'selected' : ''}>Fredoka (Round)</option>
                                <option value="Lora" class="font-lora font-bold" ${fx.fontFamily === 'Lora' ? 'selected' : ''}>Lora (Serif)</option>
                                <option value="Plus Jakarta Sans" class="font-sans font-bold" ${fx.fontFamily === 'Plus Jakarta Sans' ? 'selected' : ''}>Jakarta (UI)</option>
                            </select>
                        </div>
                        <div class="grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Weight</label>
                                <select class="w-full text-xs p-2 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner appearance-none font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('${clip.id}', 'fontWeight', parseInt(this.value))">
                                    <option value="400" ${fx.fontWeight === 400 ? 'selected' : ''}>Regular</option>
                                    <option value="600" ${fx.fontWeight === 600 ? 'selected' : ''}>SemiBold</option>
                                    <option value="700" ${fx.fontWeight === 700 ? 'selected' : ''}>Bold</option>
                                    <option value="900" ${fx.fontWeight === 900 ? 'selected' : ''}>ExtraBold</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Casing</label>
                                <select class="w-full text-xs p-2 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner appearance-none font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('${clip.id}', 'textTransform', this.value)">
                                    <option value="none" ${(fx.textTransform || 'none') === 'none' ? 'selected' : ''}>As Typed</option>
                                    <option value="uppercase" ${fx.textTransform === 'uppercase' ? 'selected' : ''}>UPPERCASE</option>
                                    <option value="lowercase" ${fx.textTransform === 'lowercase' ? 'selected' : ''}>lowercase</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Style</label>
                                <select class="w-full text-xs p-2 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner appearance-none font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('${clip.id}', 'fontStyle', this.value)">
                                    <option value="normal" ${(fx.fontStyle || 'normal') === 'normal' ? 'selected' : ''}>Normal</option>
                                    <option value="italic" ${fx.fontStyle === 'italic' ? 'selected' : ''}>Italic</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Decoration</label>
                                <select class="w-full text-xs p-2 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner appearance-none font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('${clip.id}', 'textDecoration', this.value)">
                                    <option value="none" ${(fx.textDecoration || 'none') === 'none' ? 'selected' : ''}>None</option>
                                    <option value="underline" ${fx.textDecoration === 'underline' ? 'selected' : ''}>Underline</option>
                                    <option value="line-through" ${fx.textDecoration === 'line-through' ? 'selected' : ''}>Strike</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="mt-3 flex flex-col gap-3 border-t border-surface-200 dark:border-surface-700 pt-3">
                            <div>
                                <div class="flex justify-between items-center mb-1.5">
                                    <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Size</label>
                                    <span class="text-[10px] font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">${fx.fontSize || 100}px</span>
                                </div>
                                <input type="range" min="10" max="400" value="${fx.fontSize || 100}" class="w-full custom-slider" oninput="setClipEffect('${clip.id}', 'fontSize', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + 'px'; drawCanvas();">
                            </div>
                            <div>
                                <div class="flex justify-between items-center mb-1.5">
                                    <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Letter Spacing</label>
                                    <span class="text-[10px] font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">${fx.letterSpacing || 0}px</span>
                                </div>
                                <input type="range" min="-20" max="100" value="${fx.letterSpacing || 0}" class="w-full custom-slider" oninput="setClipEffect('${clip.id}', 'letterSpacing', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + 'px'; drawCanvas();">
                            </div>
                            <div>
                                <div class="flex justify-between items-center mb-1.5">
                                    <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Line Height</label>
                                    <span class="text-[10px] font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">${fx.lineHeight || 1.1}x</span>
                                </div>
                                <input type="range" min="0.5" max="3" step="0.1" value="${fx.lineHeight || 1.1}" class="w-full custom-slider" oninput="setClipEffect('${clip.id}', 'lineHeight', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + 'x'; drawCanvas();">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Blend Mode</label>
                                <select class="w-full text-xs p-2 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner appearance-none font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('${clip.id}', 'blendMode', this.value); drawCanvas();">
                                    <option value="source-over" ${(fx.blendMode || 'source-over') === 'source-over' ? 'selected' : ''}>Normal</option>
                                    <option value="multiply" ${fx.blendMode === 'multiply' ? 'selected' : ''}>Multiply</option>
                                    <option value="screen" ${fx.blendMode === 'screen' ? 'selected' : ''}>Screen</option>
                                    <option value="overlay" ${fx.blendMode === 'overlay' ? 'selected' : ''}>Overlay</option>
                                </select>
                            </div>
                            <div>
                                <div class="flex justify-between items-center mb-1.5">
                                    <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Opacity</label>
                                    <span class="text-[10px] font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">${fx.opacity !== undefined ? fx.opacity : 100}%</span>
                                </div>
                                <input type="range" min="0" max="100" value="${fx.opacity !== undefined ? fx.opacity : 100}" class="w-full custom-slider" oninput="setClipEffect('${clip.id}', 'opacity', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + '%'; drawCanvas();">
                            </div>
                        </div>
                        <div class="mt-2">
                            <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Fill Color</label>
                            <div class="relative flex items-center bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded p-1.5 cursor-pointer shadow-inner w-full">
                                <div class="w-6 h-6 rounded shadow-sm" style="background-color: ${fx.fillColor || '#ffffff'}"></div>
                                <span class="ml-3 font-mono font-bold text-xs text-surface-700 dark:text-surface-200 uppercase">${fx.fillColor || '#ffffff'}</span>
                                <input type="color" value="${fx.fillColor || '#ffffff'}" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" oninput="setClipEffect('${clip.id}', 'fillColor', this.value); this.previousElementSibling.textContent = this.value; this.previousElementSibling.previousElementSibling.style.backgroundColor = this.value; drawCanvas();">
                            </div>
                        </div>
                    </div>
                </div>
            </details>
            
            <details class="group bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 shadow-sm rounded-lg shrink-0 ${isHorizontal ? 'w-[280px]' : 'w-full'} overflow-hidden flex flex-col" open>
                <summary class="flex items-center justify-between p-3 ${isHorizontal ? '' : 'cursor-pointer'} list-none appearance-none select-none bg-surface-100 dark:bg-surface-800/80 border-b border-surface-200 dark:border-surface-700 " onclick="${isHorizontal ? 'event.preventDefault();' : ''}">
                    <div class="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2"><i data-lucide="box" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Extrude 3D</div>
                    <div class="flex items-center gap-2">
                        <label class="relative inline-flex items-center cursor-pointer" onclick="event.stopPropagation()">
                            <input type="checkbox" class="sr-only peer" ${fx.extrudeEnable ? 'checked' : ''} onchange="setClipEffect('${clip.id}', 'extrudeEnable', this.checked); updateSidebarPanel();">
                            <div class="w-7 h-4 bg-surface-300 dark:bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-500"></div>
                        </label>
                        ${isHorizontal ? '' : '<i data-lucide="chevron-down" class="w-4 h-4 text-surface-500 transition-transform group-open:rotate-180"></i>'}
                    </div>
                </summary>
                <div class="p-3 flex flex-col gap-2.5 bg-surface-50 dark:bg-surface-900/50 flex-1 ${!fx.extrudeEnable ? 'opacity-50 pointer-events-none' : ''}">
                    <div>
                        <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Color</label>
                        <div class="relative flex items-center bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded p-1.5 cursor-pointer shadow-inner w-full">
                            <div class="w-6 h-6 rounded shadow-sm" style="background-color: ${fx.extrudeColor || '#000000'}"></div>
                            <span class="ml-3 font-mono font-bold text-xs text-surface-700 dark:text-surface-200 uppercase">${fx.extrudeColor || '#000000'}</span>
                            <input type="color" value="${fx.extrudeColor || '#000000'}" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" oninput="setClipEffect('${clip.id}', 'extrudeColor', this.value); this.previousElementSibling.textContent = this.value; this.previousElementSibling.previousElementSibling.style.backgroundColor = this.value; drawCanvas();">
                        </div>
                    </div>
                    <div class="mt-1">
                        <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Direction</label>
                        <select class="w-full text-xs p-2 pl-3 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('${clip.id}', 'extrudeDir', this.value)">
                            <option value="br" ${(fx.extrudeDir || 'br') === 'br' ? 'selected' : ''}>Bottom Right</option>
                            <option value="bl" ${fx.extrudeDir === 'bl' ? 'selected' : ''}>Bottom Left</option>
                            <option value="tr" ${fx.extrudeDir === 'tr' ? 'selected' : ''}>Top Right</option>
                            <option value="tl" ${fx.extrudeDir === 'tl' ? 'selected' : ''}>Top Left</option>
                            <option value="b" ${fx.extrudeDir === 'b' ? 'selected' : ''}>Bottom</option>
                            <option value="t" ${fx.extrudeDir === 't' ? 'selected' : ''}>Top</option>
                            <option value="l" ${fx.extrudeDir === 'l' ? 'selected' : ''}>Left</option>
                            <option value="r" ${fx.extrudeDir === 'r' ? 'selected' : ''}>Right</option>
                        </select>
                    </div>
                    <div class="mt-1">
                        <div class="flex justify-between items-center mb-1.5">
                            <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Depth</label>
                            <span class="text-xs font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-2 py-0.5 rounded shadow-sm">${fx.extrudeDepth || 5}</span>
                        </div>
                        <input type="range" min="1" max="50" value="${fx.extrudeDepth || 5}" class="w-full custom-slider" oninput="setClipEffect('${clip.id}', 'extrudeDepth', this.value); this.previousElementSibling.querySelector('span').textContent = this.value; this.style.background = 'linear-gradient(to right, ${sliderFill} ' + (this.value/this.max)*100 + '%, ${sliderBg} ' + (this.value/this.max)*100 + '%)'">
                    </div>
                </div>
            </details>
        `;
    }

    const shadowHTML = `
        <details class="group bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 shadow-sm rounded-lg shrink-0 ${isHorizontal ? 'w-[280px]' : 'w-full'} overflow-hidden flex flex-col" open>
            <summary class="flex items-center justify-between p-3 ${isHorizontal ? '' : 'cursor-pointer'} list-none appearance-none select-none bg-surface-100 dark:bg-surface-800/80 border-b border-surface-200 dark:border-surface-700 " onclick="${isHorizontal ? 'event.preventDefault();' : ''}">
                <div class="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2"><i data-lucide="copy" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Drop Shadow</div>
                <div class="flex items-center gap-2">
                    <label class="relative inline-flex items-center cursor-pointer" onclick="event.stopPropagation()">
                        <input type="checkbox" class="sr-only peer" ${shadowEnable ? 'checked' : ''} onchange="setClipEffect('${clip.id}', 'shadowEnable', this.checked); updateSidebarPanel();">
                        <div class="w-7 h-4 bg-surface-300 dark:bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                    ${isHorizontal ? '' : '<i data-lucide="chevron-down" class="w-4 h-4 text-surface-500 transition-transform group-open:rotate-180"></i>'}
                </div>
            </summary>
            
            <div class="p-3 flex flex-col gap-2.5 bg-surface-50 dark:bg-surface-900/50 flex-1 ${!shadowEnable ? 'opacity-50 pointer-events-none' : ''}">
                <div class="mb-2">
                    <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Shadow Color</label>
                    <div class="relative flex items-center bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded p-1.5 cursor-pointer shadow-inner w-full">
                        <div class="w-6 h-6 rounded shadow-sm" style="background-color: ${shadowColor}"></div>
                        <span class="ml-3 font-mono font-bold text-xs text-surface-700 dark:text-surface-200 uppercase">${shadowColor}</span>
                        <input type="color" value="${shadowColor}" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" oninput="setClipEffect('${clip.id}', 'shadowColor', this.value); this.previousElementSibling.textContent = this.value; this.previousElementSibling.previousElementSibling.style.backgroundColor = this.value; drawCanvas();">
                    </div>
                </div>
                <div>
                    <div class="flex justify-between items-center mb-1.5">
                        <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Blur</label>
                        <span class="text-xs font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-2 py-0.5 rounded shadow-sm">${shadowBlur}</span>
                    </div>
                    <input type="range" min="0" max="100" value="${shadowBlur}" class="w-full custom-slider" oninput="setClipEffect('${clip.id}', 'shadowBlur', this.value); this.previousElementSibling.querySelector('span').textContent = this.value; this.style.background = 'linear-gradient(to right, ${sliderFill} ' + (this.value/this.max)*100 + '%, ${sliderBg} ' + (this.value/this.max)*100 + '%)'">
                </div>
                <div>
                    <div class="flex justify-between items-center mb-1.5">
                        <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Offset X</label>
                        <span class="text-xs font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-2 py-0.5 rounded shadow-sm">${shadowX}</span>
                    </div>
                    <input type="range" min="-100" max="100" value="${shadowX}" class="w-full custom-slider" oninput="setClipEffect('${clip.id}', 'shadowX', this.value); this.previousElementSibling.querySelector('span').textContent = this.value; this.style.background = 'linear-gradient(to right, ${sliderFill} ' + ((this.value-(-100))/200)*100 + '%, ${sliderBg} ' + ((this.value-(-100))/200)*100 + '%)'">
                </div>
                <div>
                    <div class="flex justify-between items-center mb-1.5">
                        <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Offset Y</label>
                        <span class="text-xs font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-2 py-0.5 rounded shadow-sm">${shadowY}</span>
                    </div>
                    <input type="range" min="-100" max="100" value="${shadowY}" class="w-full custom-slider" oninput="setClipEffect('${clip.id}', 'shadowY', this.value); this.previousElementSibling.querySelector('span').textContent = this.value; this.style.background = 'linear-gradient(to right, ${sliderFill} ' + ((this.value-(-100))/200)*100 + '%, ${sliderBg} ' + ((this.value-(-100))/200)*100 + '%)'">
                </div>
            </div>
        </details>
    `;

    const animHTML = `
        <details class="group bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 shadow-sm rounded-lg shrink-0 ${isHorizontal ? 'w-[280px]' : 'w-full'} overflow-hidden flex flex-col" open>
            <summary class="flex items-center justify-between p-3 ${isHorizontal ? '' : 'cursor-pointer'} list-none appearance-none select-none bg-surface-100 dark:bg-surface-800/80 border-b border-surface-200 dark:border-surface-700 " onclick="${isHorizontal ? 'event.preventDefault();' : ''}">
                <div class="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2"><i data-lucide="sparkles" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Animations</div>
                ${isHorizontal ? '' : '<i data-lucide="chevron-down" class="w-4 h-4 text-surface-500 transition-transform group-open:rotate-180"></i>'}
            </summary>
            
            <div class="p-3 flex flex-col gap-3 w-full bg-surface-50 dark:bg-surface-900/50 flex-1">
                <div class="bg-surface-50 dark:bg-surface-800/80 p-2.5 rounded-lg border border-surface-200 dark:border-surface-700 shadow-sm flex flex-col gap-2 w-full">
                    <span class="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase">In</span>
                    <select class="w-full text-xs p-2 pl-3 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('${clip.id}', 'animIn', this.value); updateSidebarPanel();">
                        <option value="none" ${animIn === 'none' ? 'selected' : ''}>None</option>
                        <option value="fade" ${animIn === 'fade' ? 'selected' : ''}>Fade</option>
                        <option value="slideUp" ${animIn === 'slideUp' ? 'selected' : ''}>Slide Up</option>
                        <option value="zoom" ${animIn === 'zoom' ? 'selected' : ''}>Zoom In</option>
                        <option value="mosaic" ${animIn === 'mosaic' ? 'selected' : ''}>Mosaic</option>
                    </select>
                    <div class="mt-3 ${animIn === 'none' ? 'hidden' : ''}">
                        <div class="flex justify-between items-center mb-1.5">
                            <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> Duration</label>
                            <span class="text-xs font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-2 py-0.5 rounded shadow-sm">${animInDur}s</span>
                        </div>
                        <input type="range" min="0.1" max="5.0" step="0.1" value="${animInDur}" class="w-full custom-slider" oninput="setClipEffect('${clip.id}', 'animInDur', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + 's'; this.style.background = 'linear-gradient(to right, ${sliderFill} ' + (this.value/this.max)*100 + '%, ${sliderBg} ' + (this.value/this.max)*100 + '%)'">
                    </div>
                </div>

                <div class="bg-surface-50 dark:bg-surface-800/80 p-2.5 rounded-lg border border-surface-200 dark:border-surface-700 shadow-sm flex flex-col gap-2 w-full">
                    <span class="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase">Out</span>
                    <select class="w-full text-xs p-2 pl-3 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('${clip.id}', 'animOut', this.value); updateSidebarPanel();">
                        <option value="none" ${animOut === 'none' ? 'selected' : ''}>None</option>
                        <option value="fade" ${animOut === 'fade' ? 'selected' : ''}>Fade</option>
                        <option value="slideDown" ${animOut === 'slideDown' ? 'selected' : ''}>Slide Down</option>
                        <option value="zoom" ${animOut === 'zoom' ? 'selected' : ''}>Zoom Out</option>
                        <option value="mosaic" ${animOut === 'mosaic' ? 'selected' : ''}>Mosaic</option>
                    </select>
                    <div class="mt-3 ${animOut === 'none' ? 'hidden' : ''}">
                        <div class="flex justify-between items-center mb-1.5">
                            <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> Duration</label>
                            <span class="text-xs font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-2 py-0.5 rounded shadow-sm">${animOutDur}s</span>
                        </div>
                        <input type="range" min="0.1" max="5.0" step="0.1" value="${animOutDur}" class="w-full custom-slider" oninput="setClipEffect('${clip.id}', 'animOutDur', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + 's'; this.style.background = 'linear-gradient(to right, ${sliderFill} ' + (this.value/this.max)*100 + '%, ${sliderBg} ' + (this.value/this.max)*100 + '%)'">
                    </div>
                </div>

                <div class="bg-surface-50 dark:bg-surface-800/80 p-2.5 rounded-lg border border-surface-200 dark:border-surface-700 shadow-sm flex flex-col gap-2 w-full">
                    <span class="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase">Loop</span>
                    <select class="w-full text-xs p-2 pl-3 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('${clip.id}', 'animLoop', this.value)">
                        <option value="none" ${animLoop === 'none' ? 'selected' : ''}>None</option>
                        <option value="pulse" ${animLoop === 'pulse' ? 'selected' : ''}>Pulse</option>
                        <option value="float" ${animLoop === 'float' ? 'selected' : ''}>Float</option>
                    </select>
                </div>
            </div>
        </details>
    `;

    // Use a clean layout for the sidebar items
    sidebarContent.className = isHorizontal ? "flex flex-row flex-nowrap overflow-x-auto gap-4 p-2 w-full h-full no-scrollbar" : "flex flex-col gap-3 p-2 w-full overflow-y-auto";
    sidebarContent.innerHTML = (isText ? textHTML : '') + shadowHTML + animHTML;
    
    // Set initial gradient bg for sliders in sidebar
    sidebarContent.querySelectorAll('input[type="range"]').forEach(s => {
        let p = (s.value / s.max) * 100;
        if(s.min < 0) p = ((s.value - s.min) / (s.max - s.min)) * 100;
        s.style.background = `linear-gradient(to right, ${sliderFill} ${p}%, ${sliderBg} ${p}%)`;
    });

    lucide.createIcons();
}

// --- Context-Based Top Header Properties UI ---
export function updatePropertiesPanel() {
    if (!State.selectedClipId) {
        headerProperties.classList.add('hidden');
        headerProperties.classList.remove('flex');
        headerPropertiesPlaceholder.classList.remove('hidden');
        return;
    }

    const clip = State.clips.find(c => c.id === State.selectedClipId);
    if (!clip || !clip.effects) return;

    headerProperties.classList.remove('hidden');
    headerProperties.classList.add('flex');
    headerPropertiesPlaceholder.classList.add('hidden');
    
    updateSidebarPanel(); 

    let tabs = [];
    if (clip.type === 'image' || clip.type === 'video' || clip.type === 'text') {
        if (!['scale', 'rotate'].includes(State.activePropertyTab)) {
            State.activePropertyTab = 'scale';
        }
        tabs = [
            { id: 'scale', icon: 'maximize', label: 'Scale', max: 3, step: 0.05, unit: 'x' },
            { id: 'rotate', icon: 'rotate-cw', label: 'Rotate', max: 360, step: 1, unit: '°' }
        ];
        if (clip.type !== 'text') {
            tabs.push({ id: 'borderRadius', icon: 'square', label: 'Radius', max: 200, step: 1, unit: 'px' });
        }
    } else {
        if (!['volume', 'noiseRed', 'echo', 'cinematic', 'robot', 'cartoon'].includes(State.activePropertyTab)) {
            State.activePropertyTab = 'volume';
        }
        tabs = [
            { id: 'volume', icon: 'volume-2', label: 'Volume', max: 2, step: 0.05, unit: '%' },
            { id: 'noiseRed', icon: 'mic-off', label: 'Denoise', max: 1, step: 0.05, unit: '%' },
            { id: 'echo', icon: 'waves', label: 'Echo', max: 1, step: 0.05, unit: '%' },
            { id: 'cinematic', icon: 'speaker', label: 'Bass', max: 1, step: 0.05, unit: '%' },
            { id: 'robot', icon: 'bot', label: 'Robot', max: 1, step: 0.05, unit: '%' },
            { id: 'cartoon', icon: 'smile', label: 'Cartoon', max: 1, step: 0.05, unit: '%' }
        ];
    }

    let tabsHTML = `<div class="flex gap-0.5 sm:gap-1 bg-surface-100 dark:bg-surface-800 p-0.5 sm:p-1 rounded-lg border border-surface-200 dark:border-surface-700 shrink-0">`;
    tabs.forEach(t => {
        const isActive = State.activePropertyTab === t.id;
        const activeClass = isActive 
            ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-sm ring-1 ring-surface-300 dark:ring-surface-700' 
            : 'text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 border-transparent';
        tabsHTML += `
            <button onclick="setActivePropertyTab('${t.id}')" class="p-1.5 rounded-md ${activeClass}" title="${t.label}">
                <i data-lucide="${t.icon}" class="w-4 h-4"></i>
            </button>
        `;
    });
    tabsHTML += `</div>`;

    let extraActionsHTML = '';
    if (clip.type === 'image' || clip.type === 'video') {
        extraActionsHTML = `
            <div class="hidden sm:block w-px h-4 bg-surface-200 dark:bg-surface-700 mx-1"></div>
            <div class="flex gap-0.5 bg-surface-100 dark:bg-surface-800 p-0.5 rounded-lg border border-surface-200 dark:border-surface-700 shrink-0">
                <button onclick="alignClip('h')" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Align Center Horizontally">
                    <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
                </button>
                <button onclick="alignClip('v')" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Align Center Vertically">
                    <i data-lucide="arrow-up-down" class="w-4 h-4"></i>
                </button>
            </div>
        `;
    }

    const activeTab = tabs.find(t => t.id === State.activePropertyTab);
    const val = clip.effects[State.activePropertyTab] || 0;
    
    let iconType = 'film';
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
