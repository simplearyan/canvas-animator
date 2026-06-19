import { init, ensureAudioContext, applyInspectorLayout, updateCanvasResolution, resizeCanvas, resizer, isResizingInspector, startResizingX, startInspectorWidth, easeOutQuart, drawCanvas, updateSidebarPanel, updatePropertiesPanel } from '../ui/ui.js';
import { buildAudioGraph, applyAudioEffects, syncMediaElements, stopAllMedia, formatTime, updatePlayhead, togglePlay, stopMedia, loop } from '../audio/audio.js';
import { getAvailableTrack, deleteSelectedClip, splitClipAtPlayhead, calcOverlaps, getCanvasMousePos, setupEventListeners, handleMouseDown, handleMouseMove, handleMouseUp } from '../timeline/timeline.js';
import { updateTimelineWidth, renderTrackHeaders, renderTracks, renderClips, drawCachedWaveform, drawRuler } from '../canvas/canvas.js';
import { openExportModal, closeExportModal, cancelExport, submitExport, startExport } from '../export/export.js';


lucide.createIcons();

export const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

export let isDarkMode = document.documentElement.classList.contains('dark'); 

// --- Color Palettes (Vibrant Pastel BG & Deep Waveforms) ---
export const PALETTES = [
    { bg: '#bbf7d0', border: '#4ade80', wave: '#16a34a', text: '#14532d' }, // Vivid Mint
    { bg: '#bfdbfe', border: '#60a5fa', wave: '#2563eb', text: '#1e3a8a' }, // Vivid Blue
    { bg: '#e9d5ff', border: '#c084fc', wave: '#9333ea', text: '#581c87' }, // Vivid Purple
    { bg: '#fecaca', border: '#f87171', wave: '#dc2626', text: '#7f1d1d' }, // Vivid Red
    { bg: '#fef08a', border: '#facc15', wave: '#ca8a04', text: '#713f12' }, // Vivid Yellow
    { bg: '#e5e7eb', border: '#9ca3af', wave: '#4b5563', text: '#1f2937' }  // Vivid Gray
];

// --- State Management ---
export const State = {
    pixelsPerSecond: 50,
    duration: 60,
            currentTime: 0,
    isPlaying: false,
    isExporting: false,
    lastRenderTime: 0,
    selectedClipId: null,
    activePropertyTab: 'volume', 
    copiedClip: null,
    masterStreamNode: null,
    speakerNode: null,
    audioCtxInitialzed: false,
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

export const ASPECT_RATIOS = [
    { label: '16:9', value: '16/9', icon: 'monitor' },
    { label: '9:16', value: '9/16', icon: 'smartphone' },
    { label: '4:3', value: '4/3', icon: 'tv' },
    { label: '3:4', value: '3/4', icon: 'tablet' },
    { label: '1:1', value: '1/1', icon: 'square' },
    { label: '21:9 (Cinematic)', value: '21/9', icon: 'film' }
];

// --- DOM Elements ---
export const trackHeadersContainer = document.getElementById('trackHeaders');
export const tracksContentContainer = document.getElementById('tracksContent');
export let timelineScrollArea = document.getElementById('timelineScrollArea');
export const rulerWrapper = document.getElementById('rulerWrapper');
export const rulerCanvas = document.getElementById('rulerCanvas');
export const playhead = document.getElementById('playhead');
export const rulerPlayhead = document.getElementById('rulerPlayhead');
export const playheadTimePopup = document.getElementById('playheadTimePopup');
export let timeDisplay = document.getElementById('timeDisplay');
export let previewTimeText = document.getElementById('previewTimeText');
export let btnZoomIn = document.getElementById('btnZoomIn');
export let btnZoomOut = document.getElementById('btnZoomOut');
export let btnPlay = document.getElementById('btnPlay');
export const wrapperPlay = document.getElementById('wrapperPlay');
export const wrapperPause = document.getElementById('wrapperPause');
export let btnStop = document.getElementById('btnStop');
export let btnSplit = document.getElementById('btnSplit');
export let btnDelete = document.getElementById('btnDelete');
export let btnImport = document.getElementById('btnImport');
export let btnAddText = document.getElementById('btnAddText');
export const mediaInput = document.getElementById('mediaInput');
export let canvasColorPicker = document.getElementById('canvasColorPicker');
export let canvasColorIcon = document.getElementById('canvasColorIcon');
export let btnToggleTimecode = document.getElementById('btnToggleTimecode');

// Header Properties & Sidebar
export let headerProperties = document.getElementById('headerProperties');
export let headerPropertiesPlaceholder = document.getElementById('headerPropertiesPlaceholder');
export let mainAppWrapper = document.getElementById('mainAppWrapper');
export let timelineContainer = document.getElementById('timelineContainer');
export let timelineWorkspace = document.getElementById('timelineWorkspace');
export let propertiesSidebar = document.getElementById('propertiesSidebar');
export let sidebarContent = document.getElementById('sidebarContent');
export let btnToggleInspector = document.getElementById('btnToggleInspector');
export let btnDockInspector = document.getElementById('btnDockInspector');
export let btnCloseInspector = document.getElementById('btnCloseInspector');
export let btnToggleWidth = document.getElementById('btnToggleWidth');
export let iconDock = document.getElementById('iconDock');
export let iconCloseInspector = document.getElementById('iconCloseInspector');
export let iconWidth = document.getElementById('iconWidth');

// Export & Views
export let btnExportMenu = document.getElementById('btnExportMenu');
export let exportDropdown = document.getElementById('exportDropdown');
export let exportOverlay = document.getElementById('exportOverlay');
export let exportProgressBar = document.getElementById('exportProgressBar');
export let exportProgressText = document.getElementById('exportProgressText');

export let btnViewMenu = document.getElementById('btnViewMenu');
export let viewDropdown = document.getElementById('viewDropdown');

export let btnToggleLayout = document.getElementById('btnToggleLayout');
export let iconLayout = document.getElementById('iconLayout');
export let mainWorkspace = document.getElementById('mainWorkspace');
export let btnToggleAspect = document.getElementById('btnToggleAspect');
export let btnTogglePreview = document.getElementById('btnTogglePreview');
export let btnToggleTimeline = document.getElementById('btnToggleTimeline');
export let btnToggleTheme = document.getElementById('btnToggleTheme');
export let previewContainer = document.getElementById('previewContainer');
export let previewWrapper = document.getElementById('previewWrapper');
export const canvasAspectWrapper = document.getElementById('canvasAspectWrapper');
export let iconAspect = document.getElementById('iconAspect');
export let iconEye = document.getElementById('iconEye');
export let iconTheme = document.getElementById('iconTheme');

// Canvas Dragging State
export let canvasDrag = { active: false, clipId: null, startX: 0, startY: 0, initOffsetX: 0, initOffsetY: 0 };


// --- Workspace Vertical Resizer (Timeline Height) ---
export let timelineResizer = document.getElementById('timelineResizer');
export let isResizingTimeline = false;
export let startTimelineY = 0;
export let startPreviewHeight = 0;

export function setupCoreListeners() {
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
export let btnToggleTrackHeight = document.getElementById('btnToggleTrackHeight');
export const TRACK_SIZES = {
    'small': { height: 45, next: 'medium' },
    'medium': { height: 90, next: 'large' },
    'large': { height: 130, next: 'small' }
};
export let currentTrackSize = 'medium';

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

}