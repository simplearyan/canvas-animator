import { AudioContext, isDarkMode, PALETTES, State, ASPECT_RATIOS, trackHeadersContainer, tracksContentContainer, timelineScrollArea, rulerWrapper, rulerCanvas, playhead, rulerPlayhead, playheadTimePopup, timeDisplay, previewTimeText, btnZoomIn, btnZoomOut, btnPlay, wrapperPlay, wrapperPause, btnStop, btnSplit, btnDelete, btnImport, btnAddText, mediaInput, canvasColorPicker, canvasColorIcon, btnToggleTimecode, headerProperties, headerPropertiesPlaceholder, mainAppWrapper, timelineContainer, timelineWorkspace, propertiesSidebar, sidebarContent, btnToggleInspector, btnDockInspector, btnCloseInspector, btnToggleWidth, iconDock, iconCloseInspector, iconWidth, btnExportMenu, exportDropdown, exportOverlay, exportProgressBar, exportProgressText, btnViewMenu, viewDropdown, btnToggleLayout, iconLayout, mainWorkspace, btnToggleAspect, btnTogglePreview, btnToggleTimeline, btnToggleTheme, previewContainer, previewWrapper, canvasAspectWrapper, iconAspect, iconEye, iconTheme, canvasDrag, timelineResizer, isResizingTimeline, startTimelineY, startPreviewHeight, btnToggleTrackHeight, TRACK_SIZES, currentTrackSize } from '../core/core.js';
import { init, ensureAudioContext, applyInspectorLayout, updateCanvasResolution, resizeCanvas, resizer, isResizingInspector, startResizingX, startInspectorWidth, easeOutQuart, drawCanvas, updateSidebarPanel, updatePropertiesPanel } from '../ui/ui.js';
import { buildAudioGraph, applyAudioEffects, syncMediaElements, stopAllMedia, formatTime, updatePlayhead, togglePlay, stopMedia, loop } from '../audio/audio.js';
import { updateTimelineWidth, renderTrackHeaders, renderTracks, renderClips, drawCachedWaveform, drawRuler } from '../canvas/canvas.js';
import { openExportModal, closeExportModal, cancelExport, submitExport, startExport } from '../export/export.js';

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

export function getAvailableTrack(type, start, duration) {
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

export function setupTimelineImportListeners() {
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

export function deleteSelectedClip() {
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

export function splitClipAtPlayhead() {
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

}
export function calcOverlaps() {
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

// --- Canvas & Drag Logic ---
export function getCanvasMousePos(e) {
    const rect = canvasAspectWrapper.getBoundingClientRect();
    const canvas = document.getElementById('renderCanvas');
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

export function setupEventListeners() {
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

    btnViewMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        viewDropdown.classList.toggle('hidden');
        viewDropdown.classList.toggle('flex');
    });

    document.addEventListener('click', () => {
        if(!viewDropdown.classList.contains('hidden')){
            viewDropdown.classList.add('hidden');
            viewDropdown.classList.remove('flex');
        }
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

export function handleMouseDown(e) {
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

export function handleMouseMove(e) {
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

export function handleMouseUp(e) {
    if (!State.drag.active) return;
    const clipEl = document.querySelector(`.clip[data-clip-id="${State.drag.clipId}"]`);
    if (clipEl) clipEl.classList.remove('dragging');
    State.drag.active = false;
    
    calcOverlaps();
    renderClips();
    syncMediaElements(); 
    drawCanvas();
}
