import { AudioContext, isDarkMode, PALETTES, State, ASPECT_RATIOS, trackHeadersContainer, tracksContentContainer, timelineScrollArea, rulerWrapper, rulerCanvas, playhead, rulerPlayhead, playheadTimePopup, timeDisplay, previewTimeText, btnZoomIn, btnZoomOut, btnPlay, wrapperPlay, wrapperPause, btnStop, btnSplit, btnDelete, btnImport, btnAddText, mediaInput, canvasColorPicker, canvasColorIcon, btnToggleTimecode, headerProperties, headerPropertiesPlaceholder, mainAppWrapper, timelineContainer, timelineWorkspace, propertiesSidebar, sidebarContent, btnToggleInspector, btnDockInspector, btnCloseInspector, btnToggleWidth, iconDock, iconCloseInspector, iconWidth, btnExportMenu, exportDropdown, exportOverlay, exportProgressBar, exportProgressText, btnViewMenu, viewDropdown, btnToggleLayout, iconLayout, mainWorkspace, btnToggleAspect, btnTogglePreview, btnToggleTimeline, btnToggleTheme, previewContainer, previewWrapper, canvasAspectWrapper, iconAspect, iconEye, iconTheme, canvasDrag, timelineResizer, isResizingTimeline, startTimelineY, startPreviewHeight, btnToggleTrackHeight, TRACK_SIZES, currentTrackSize } from '../core/core.js';
import { init, ensureAudioContext, applyInspectorLayout, updateCanvasResolution, resizeCanvas, resizer, isResizingInspector, startResizingX, startInspectorWidth, easeOutQuart, drawCanvas, updateSidebarPanel, updatePropertiesPanel } from '../ui/ui.js';
import { getAvailableTrack, deleteSelectedClip, splitClipAtPlayhead, calcOverlaps, getCanvasMousePos, setupEventListeners, handleMouseDown, handleMouseMove, handleMouseUp } from '../timeline/timeline.js';
import { updateTimelineWidth, renderTrackHeaders, renderTracks, renderClips, drawCachedWaveform, drawRuler } from '../canvas/canvas.js';
import { openExportModal, closeExportModal, cancelExport, submitExport, startExport } from '../export/export.js';

// --- Web Audio Graph Builder ---
export function buildAudioGraph(clip) {
    ensureAudioContext();
    if (clip.audioNodes) return; 
    
    try {
        const source = audioCtx.createMediaElementSource(clip.audioEl || clip.videoEl);

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
        volume.connect(State.speakerNode);
        volume.connect(State.masterStreamNode); 

        tinny.connect(delay);
        delay.connect(echoFeedback);
        echoFeedback.connect(delay);
        delay.connect(echoVolume);
        echoVolume.connect(State.speakerNode);
        echoVolume.connect(State.masterStreamNode);

        tinny.connect(roboDelay);
        roboDelay.connect(roboFeedback);
        roboFeedback.connect(roboDelay);
        roboDelay.connect(roboVolume);
        roboVolume.connect(State.speakerNode);
        roboVolume.connect(State.masterStreamNode);

        clip.audioNodes = { source, noiseRed, eq, tinny, volume, delay, echoFeedback, echoVolume, roboDelay, roboFeedback, roboVolume };
        
        if (!clip.effects) clip.effects = {};
        if (clip.effects.volume === undefined) clip.effects.volume = 1;
        if (clip.effects.echo === undefined) clip.effects.echo = 0;
        if (clip.effects.cartoon === undefined) clip.effects.cartoon = 0;
        if (clip.effects.cinematic === undefined) clip.effects.cinematic = 0;
        if (clip.effects.robot === undefined) clip.effects.robot = 0;
        if (clip.effects.noiseRed === undefined) clip.effects.noiseRed = 0;
        applyAudioEffects(clip);

    } catch (err) {
        console.error("Audio graph build failed:", err);
    }
}

export function applyAudioEffects(clip) {
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
        if (label && typeof value === 'number') {
            if (effectName === 'scale') label.textContent = `${clip.effects[effectName].toFixed(2)}x`;
            else if (effectName === 'rotate') label.textContent = `${Math.round(clip.effects[effectName])}°`;
            else if (effectName === 'borderRadius') label.textContent = `${Math.round(clip.effects[effectName])}px`;
            else label.textContent = `${Math.round(clip.effects[effectName] * 100)}%`;
        }

        if (State.activePropertyTab === effectName && document.getElementById(`lbl_${effectName}`)) {
            updatePropertiesPanel();
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

// --- Audio Synchronization Engine ---
export function syncMediaElements() {
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

export function stopAllMedia() {
    State.clips.forEach(clip => {
        const el = clip.audioEl || clip.videoEl;
        if (el && !el.paused) {
            el.pause();
        }
    });
}

// --- Playback Engine ---

export function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    const ms = Math.floor((seconds % 1) * 100).toString().padStart(2, '0');
    return `${m}:${s}.${ms}`;
}

export function updatePlayhead() {
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

export function togglePlay() {
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

export function stopMedia() {
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

export function loop(now) {
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
