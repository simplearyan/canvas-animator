const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

const targetStr = `id="btnToggleInspector"`;
const inspectorIdx = content.indexOf(targetStr);

if (inspectorIdx !== -1) {
    const endOfButtonIdx = content.indexOf('</button>', inspectorIdx) + 9;
    
    const buttonHtml = `
                    <button id="btnToggleCanvasPos" class="px-3 py-2.5 text-xs font-semibold text-left text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white flex items-center gap-2">
                        <i data-lucide="layout-template" id="iconCanvasPos" class="w-3.5 h-3.5"></i> Canvas Position
                    </button>`;
                    
    content = content.substring(0, endOfButtonIdx) + buttonHtml + content.substring(endOfButtonIdx);
    console.log("Button HTML added using precise index.");
} else {
    console.log("Could not find btnToggleInspector.");
}

fs.writeFileSync(file, content);
console.log("Done");
