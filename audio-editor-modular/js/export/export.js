import { AudioContext, isDarkMode, PALETTES, State, ASPECT_RATIOS, trackHeadersContainer, tracksContentContainer, timelineScrollArea, rulerWrapper, rulerCanvas, playhead, rulerPlayhead, playheadTimePopup, timeDisplay, previewTimeText, btnZoomIn, btnZoomOut, btnPlay, wrapperPlay, wrapperPause, btnStop, btnSplit, btnDelete, btnImport, btnAddText, mediaInput, canvasColorPicker, canvasColorIcon, btnToggleTimecode, headerProperties, headerPropertiesPlaceholder, mainAppWrapper, timelineContainer, timelineWorkspace, propertiesSidebar, sidebarContent, btnToggleInspector, btnDockInspector, btnCloseInspector, btnToggleWidth, iconDock, iconCloseInspector, iconWidth, btnExportMenu, exportDropdown, exportOverlay, exportProgressBar, exportProgressText, btnViewMenu, viewDropdown, btnToggleLayout, iconLayout, mainWorkspace, btnToggleAspect, btnTogglePreview, btnToggleTimeline, btnToggleTheme, previewContainer, previewWrapper, canvasAspectWrapper, iconAspect, iconEye, iconTheme, canvasDrag, timelineResizer, isResizingTimeline, startTimelineY, startPreviewHeight, btnToggleTrackHeight, TRACK_SIZES, currentTrackSize } from '../core/core.js';
import { init, ensureAudioContext, applyInspectorLayout, updateCanvasResolution, resizeCanvas, resizer, isResizingInspector, startResizingX, startInspectorWidth, easeOutQuart, drawCanvas, updateSidebarPanel, updatePropertiesPanel } from '../ui/ui.js';
import { buildAudioGraph, applyAudioEffects, syncMediaElements, stopAllMedia, formatTime, updatePlayhead, togglePlay, stopMedia, loop } from '../audio/audio.js';
import { getAvailableTrack, deleteSelectedClip, splitClipAtPlayhead, calcOverlaps, getCanvasMousePos, setupEventListeners, handleMouseDown, handleMouseMove, handleMouseUp } from '../timeline/timeline.js';
import { updateTimelineWidth, renderTrackHeaders, renderTracks, renderClips, drawCachedWaveform, drawRuler } from '../canvas/canvas.js';

// --- Export Engine ---

export function openExportModal() {
    document.getElementById('exportEndTime').value = State.duration.toFixed(1);
    document.getElementById('exportOverlay').classList.remove('hidden');
    document.getElementById('exportOverlay').classList.add('flex');
    document.getElementById('exportSettings').classList.remove('hidden');
    document.getElementById('exportProgress').classList.add('hidden');
}

export function closeExportModal() {
    document.getElementById('exportOverlay').classList.add('hidden');
    document.getElementById('exportOverlay').classList.remove('flex');
}

export function cancelExport() {
    if (State.isExporting) {
        State.cancelExport = true;
    } else {
        State.exportResolution = 1920;
        closeExportModal();
    }
}

export function submitExport() {
    const format = document.querySelector('input[name="exportFormat"]:checked').value;
    const scope = document.querySelector('input[name="exportScope"]:checked').value;
    State.exportResolution = parseInt(document.querySelector('input[name="exportResolution"]:checked').value);
    
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

export function startExport(format, startTime, endTime) {
    if (State.isExporting) return;
    ensureAudioContext();
    
    State.isExporting = true;
    State.cancelExport = false;
    
    stopMedia();
    State.currentTime = startTime;
    
    let exportCanvas = null;
    let exportCtx = null;
    let exportW, exportH;
    
    let finalStream;
    let mimeType;
    let extension;

    if (format.includes('video') || format === 'gif') {
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
        const audioTracks = State.masterStreamNode.stream.getAudioTracks();
        if (audioTracks.length > 0) {
            finalStream = new MediaStream([...canvasStream.getVideoTracks(), ...audioTracks]);
        } else {
            finalStream = canvasStream;
        }
        
        if (format === 'video-mp4') {
            mimeType = 'video/mp4;codecs="avc1, mp4a.40.2"'; // H.264 + AAC
            extension = 'mp4';
        } else {
            mimeType = 'video/webm;codecs=vp9,opus';
            extension = format === 'gif' ? 'gif.webm' : 'webm';
        }
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
            a.download = `StudioPro_Export.${extension}`;
            a.click();
            URL.revokeObjectURL(url);
        }
        
        State.isExporting = false;
        State.exportResolution = 1920;
        if (State.speakerNode) State.speakerNode.gain.value = 1;
        closeExportModal();
        stopMedia();
    };

    State.lastRenderTime = performance.now();
    updatePlayhead();
    
    if (State.speakerNode) State.speakerNode.gain.value = 0;
    
    State.clips.forEach(clip => {
        const el = clip.audioEl || clip.videoEl;
        if (el && clip.start < endTime && (clip.start + clip.duration) > startTime) {
            buildAudioGraph(clip);
            applyAudioEffects(clip);
            
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

        if (exportCanvas && exportCtx) {
            drawCanvas(exportCtx, exportW, exportH);
        } else {
            drawCanvas();
        }

        const durationRange = endTime - startTime;
        const elapsed = State.currentTime - startTime;
        const progress = Math.min(100, Math.max(0, Math.round((elapsed / durationRange) * 100)));
        
        document.getElementById('exportProgressBar').style.width = `${progress}%`;
        document.getElementById('exportProgressText').textContent = `${progress}%`;

        if (State.currentTime >= endTime) {
            recorder.stop();
        } else {
            requestAnimationFrame(exportLoop);
        }
    }
    requestAnimationFrame(exportLoop);
}