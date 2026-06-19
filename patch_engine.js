const fs = require('fs');
const path = require('path');

const uiFile = path.join(__dirname, 'audio-editor-modular', 'js', 'ui', 'ui.js');
const engineFile = path.join(__dirname, 'solid-video-editor', 'src', 'core', 'engine.js');

const uiLines = fs.readFileSync(uiFile, 'utf8').split('\n');

const resStart = uiLines.findIndex(l => l.includes('export function updateCanvasResolution() {'));
let resEnd = -1;
if (resStart !== -1) {
    let braceCount = 0;
    for(let i = resStart; i < uiLines.length; i++) {
        braceCount += (uiLines[i].match(/\\{/g) || []).length;
        braceCount -= (uiLines[i].match(/\\}/g) || []).length;
        if(braceCount === 0 && i > resStart) {
            resEnd = i;
            break;
        }
    }
}

if(resStart !== -1 && resEnd !== -1) {
    const resFunc = uiLines.slice(resStart, resEnd + 1).join('\n');
    let engineContent = fs.readFileSync(engineFile, 'utf8');
    
    // Insert before easeOutQuart
    engineContent = engineContent.replace('export const easeOutQuart', resFunc + '\n\nexport const easeOutQuart');
    fs.writeFileSync(engineFile, engineContent);
    console.log('Added updateCanvasResolution to engine.js');
}
