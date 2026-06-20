const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// Fix dragging logic in handleMouseMove equivalent
const dragLogicSearch = `                        clip.effects.offsetX = canvasDrag.initOffsetX + (pos.x - canvasDrag.startX);
                        clip.effects.offsetY = canvasDrag.initOffsetY + (pos.y - canvasDrag.startY);`;

const dragLogicReplace = `                        const canvas = document.getElementById('renderCanvas');
                        const dxPercent = ((pos.x - canvasDrag.startX) / canvas.width) * 100;
                        const dyPercent = ((pos.y - canvasDrag.startY) / canvas.height) * 100;
                        clip.effects.offsetX = canvasDrag.initOffsetX + dxPercent;
                        clip.effects.offsetY = canvasDrag.initOffsetY + dyPercent;`;

if (content.includes(dragLogicSearch)) {
    content = content.replace(dragLogicSearch, dragLogicReplace);
    console.log('Successfully patched canvas drag logic.');
} else {
    console.log('Could not find drag logic. Maybe already patched?');
}

// Fix hit detection cx/cy to use percentages
const hitDetectionSearch = `                    const offsetX = clip.effects.offsetX || 0;
                    const offsetY = clip.effects.offsetY || 0;

                    const cx = canvas.width/2 + offsetX;
                    const cy = canvas.height/2 + offsetY;`;

const hitDetectionReplace = `                    const offsetX = clip.effects.offsetX || 0;
                    const offsetY = clip.effects.offsetY || 0;
                    const pX = (offsetX * canvas.width) / 100;
                    const pY = (offsetY * canvas.height) / 100;

                    const cx = canvas.width/2 + pX;
                    const cy = canvas.height/2 + pY;`;

if (content.includes(hitDetectionSearch)) {
    content = content.replace(hitDetectionSearch, hitDetectionReplace);
    console.log('Successfully patched hit detection logic.');
} else {
    console.log('Could not find hit detection logic. Maybe already patched?');
}

fs.writeFileSync(file, content);
