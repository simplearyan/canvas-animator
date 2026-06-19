const fs = require('fs');
const path = require('path');

const uiFile = path.join(__dirname, 'audio-editor-modular', 'js', 'ui', 'ui.js');
let uiLines = fs.readFileSync(uiFile, 'utf8').split('\n');

const uiStart = uiLines.findIndex(l => l.includes('btnToggleInspector.addEventListener'));
const uiEnd = uiLines.findIndex(l => l.includes('// Helper for animations'));

if (uiStart !== -1 && uiEnd !== -1) {
    uiLines.splice(uiStart, 0, 'export function setupUIListeners() {');
    uiLines.splice(uiEnd + 1, 0, '}');
    
    // Inject calls to init
    const initIdx = uiLines.findIndex(l => l.includes('applyInspectorLayout();'));
    if (initIdx !== -1) {
        uiLines.splice(initIdx + 1, 0, '    setupCoreListeners();', '    setupTimelineImportListeners();', '    setupUIListeners();');
    }

    // Add imports to ui.js
    uiLines[0] = uiLines[0].replace(" } from '../core/core.js';", ", setupCoreListeners } from '../core/core.js';");
    uiLines[2] = uiLines[2].replace(" } from '../timeline/timeline.js';", ", setupTimelineImportListeners } from '../timeline/timeline.js';");

    fs.writeFileSync(uiFile, uiLines.join('\n'));
    console.log('UI wrapped successfully.');
} else {
    console.log('Could not find boundaries.', uiStart, uiEnd);
}
