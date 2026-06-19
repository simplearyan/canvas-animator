const fs = require('fs');
const path = require('path');

const uiFile = path.join(__dirname, 'audio-editor-modular', 'js', 'ui', 'ui.js');
const engineFile = path.join(__dirname, 'solid-video-editor', 'src', 'core', 'engine.js');

const lines = fs.readFileSync(uiFile, 'utf8').split('\n');

const startLine = lines.findIndex(l => l.startsWith('// Helper for animations'));

if (startLine !== -1) {
    let engineLines = lines.slice(startLine);
    
    // Add imports at top
    engineLines.unshift(`import { State } from '../store/state';`);
    
    // Need to mock aspect ratios or import them
    engineLines.unshift(`export const ASPECT_RATIOS = {
    '16:9': { w: 1920, h: 1080 },
    '9:16': { w: 1080, h: 1920 },
    '1:1': { w: 1080, h: 1080 }
};`);

    fs.writeFileSync(engineFile, engineLines.join('\n'));
    console.log('Extracted to engine.js');
} else {
    console.error('Could not find start marker');
}
