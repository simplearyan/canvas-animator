const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

const pillCode = `
                            // Pill-shaped middle handles
                            const pillW = 24 / finalScale;
                            const pillH = 8 / finalScale;
                            
                            const drawPillH = (px, py) => {
                                ctx.beginPath();
                                ctx.roundRect(px - pillW/2, py - pillH/2, pillW, pillH, 4 / finalScale);
                                ctx.fillStyle = '#ffffff';
                                ctx.fill();
                                ctx.lineWidth = 4 / finalScale;
                                ctx.strokeStyle = '#6366f1';
                                ctx.stroke();
                            };
                            
                            const drawPillV = (px, py) => {
                                ctx.beginPath();
                                ctx.roundRect(px - pillH/2, py - pillW/2, pillH, pillW, 4 / finalScale);
                                ctx.fillStyle = '#ffffff';
                                ctx.fill();
                                ctx.lineWidth = 4 / finalScale;
                                ctx.strokeStyle = '#6366f1';
                                ctx.stroke();
                            };
                            
                            drawPillH(0, -dh/2);
                            drawPillH(0, dh/2);
                            drawPillV(-dw/2, 0);
                            drawPillV(dw/2, 0);
                            
                            // Rotation Handle
`;

content = content.replace(/\/\/ Rotation Handle/g, pillCode);

fs.writeFileSync(file, content);
console.log('Successfully added pill handles to the bounding box!');
