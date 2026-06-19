const fs = require('fs');
const path = require('path');

const modDir = path.join(__dirname, 'audio-editor-modular', 'js');

// 1. Wrap core.js (Lines 148-196)
const coreFile = path.join(modDir, 'core', 'core.js');
let coreLines = fs.readFileSync(coreFile, 'utf8').split('\n');
// Find where timelineResizer if block starts
const coreStart = coreLines.findIndex(l => l.startsWith('if (timelineResizer && previewContainer) {'));
if (coreStart !== -1) {
    coreLines.splice(coreStart, 0, 'export function setupCoreListeners() {');
    coreLines.push('}');
    fs.writeFileSync(coreFile, coreLines.join('\n'));
}

// 2. Wrap timeline.js (Lines 67-334)
const timelineFile = path.join(modDir, 'timeline', 'timeline.js');
let tlLines = fs.readFileSync(timelineFile, 'utf8').split('\n');
const tlStart = tlLines.findIndex(l => l.startsWith('btnImport.addEventListener'));
const tlEnd = tlLines.findIndex(l => l.startsWith('export function calcOverlaps() {'));
if (tlStart !== -1 && tlEnd !== -1) {
    tlLines.splice(tlStart, 0, 'export function setupTimelineImportListeners() {');
    tlLines.splice(tlEnd + 1, 0, '}'); // Add } right before export function calcOverlaps
    fs.writeFileSync(timelineFile, tlLines.join('\n'));
}

// 3. Wrap ui.js (Lines 148-380)
const uiFile = path.join(modDir, 'ui', 'ui.js');
let uiLines = fs.readFileSync(uiFile, 'utf8').split('\n');
const uiStart = uiLines.findIndex(l => l.startsWith('btnToggleInspector.addEventListener'));
const uiEnd = uiLines.findIndex(l => l.startsWith('// --- Web Audio Graph Builder ---'));
if (uiStart !== -1 && uiEnd !== -1) {
    uiLines.splice(uiStart, 0, 'export function setupUIListeners() {');
    uiLines.splice(uiEnd + 1, 0, '}');
    
    // Also inject calls to init
    const initIdx = uiLines.findIndex(l => l.includes('applyInspectorLayout();'));
    if (initIdx !== -1) {
        uiLines.splice(initIdx, 0, '    setupCoreListeners();', '    setupTimelineImportListeners();', '    setupUIListeners();');
    }

    // Add imports to ui.js
    uiLines[0] = uiLines[0].replace(' } from \'../core/core.js\';', ', setupCoreListeners } from \'../core/core.js\';');
    uiLines[2] = uiLines[2].replace(' } from \'../timeline/timeline.js\';', ', setupTimelineImportListeners } from \'../timeline/timeline.js\';');

    fs.writeFileSync(uiFile, uiLines.join('\n'));
}

console.log("Wrapped!");
