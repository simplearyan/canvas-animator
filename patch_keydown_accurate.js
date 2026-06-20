const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// There are two document.addEventListener('keydown'. The second one is what we want.
let sIdx = content.indexOf("            document.addEventListener('keydown', (e) => {", content.indexOf("            document.addEventListener('click', () => {"));
let eIdx = content.indexOf("            });", sIdx);

if (sIdx !== -1 && eIdx !== -1) {
    const replacement = `            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                const k = e.key.toLowerCase();
                
                if (k === 's') splitClipAtPlayhead();
                else if (e.key === 'Delete' || e.key === 'Backspace') deleteSelectedClip();
                else if (e.code === 'Space') { 
                    e.preventDefault(); 
                    togglePlay(); 
                }
                else if (k === '+' || k === '=') handleScaleUp();
                else if (k === '-' || k === '_') handleScaleDown();
                else if (k === 'r') handleRotate();
                else if (k === 'h') {
                    if (e.shiftKey) handleCenterH();
                    else handleFlipH();
                }
                else if (k === 'v') {
                    if (e.shiftKey) handleCenterV();
                    else handleFlipV();
                }
                else if (e.key === '\\\\') handleToggleVis();
`;
    
    content = content.substring(0, sIdx) + replacement + content.substring(eIdx);
    fs.writeFileSync(file, content);
    console.log("Keydown patched!");
} else {
    console.log("Failed to find keydown listener index.");
}
