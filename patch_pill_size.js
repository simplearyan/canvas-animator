const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

const regex = /\/\/\s*Pill-shaped middle handles[\s\S]*?drawPillV\(dw\/2, 0\);/g;

const newPillCode = `// Pill-shaped middle handles
                            const pillW = 36 / finalScale;
                            const pillH = 14 / finalScale;
                            const pillRad = 7 / finalScale;
                            
                            const drawPillH = (px, py) => {
                                ctx.beginPath();
                                ctx.roundRect(px - pillW/2, py - pillH/2, pillW, pillH, pillRad);
                                ctx.fillStyle = '#ffffff';
                                ctx.fill();
                                ctx.lineWidth = 5 / finalScale;
                                ctx.strokeStyle = '#6366f1';
                                ctx.stroke();
                            };
                            
                            const drawPillV = (px, py) => {
                                ctx.beginPath();
                                ctx.roundRect(px - pillH/2, py - pillW/2, pillH, pillW, pillRad);
                                ctx.fillStyle = '#ffffff';
                                ctx.fill();
                                ctx.lineWidth = 5 / finalScale;
                                ctx.strokeStyle = '#6366f1';
                                ctx.stroke();
                            };
                            
                            drawPillH(0, -dh/2);
                            drawPillH(0, dh/2);
                            drawPillV(-dw/2, 0);
                            drawPillV(dw/2, 0);`;

const count = (content.match(regex) || []).length;
console.log('Matches:', count);
if (count > 0) {
    content = content.replace(regex, newPillCode);
    fs.writeFileSync(file, content);
    console.log('Successfully updated pill sizes.');
}
