const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

const regex = /if\s*\(clip\.id === State\.selectedClipId && !State\.isExporting\)\s*\{\s*ctx\.strokeStyle = '#6366f1';[\s\S]*?ctx\.fillRect\(dw\/2 - handleSize\/2, dh\/2 - handleSize\/2, handleSize, handleSize\);\s*\}/g;

const newBox = `if (clip.id === State.selectedClipId && !State.isExporting) {
                            ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
                            ctx.shadowBlur = 8 / finalScale;
                            ctx.strokeStyle = '#6366f1';
                            ctx.lineWidth = 1.5 / finalScale;
                            ctx.strokeRect(-dw/2, -dh/2, dw, dh);
                            
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;
                            
                            ctx.fillStyle = '#ffffff';
                            const handleSize = 4 / finalScale;
                            const drawHandle = (hx, hy) => {
                                ctx.beginPath();
                                ctx.arc(hx, hy, handleSize, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.stroke();
                            };
                            
                            drawHandle(-dw/2, -dh/2);
                            drawHandle(dw/2, -dh/2);
                            drawHandle(-dw/2, dh/2);
                            drawHandle(dw/2, dh/2);
                        }`;

const count = (content.match(regex) || []).length;
console.log(`Found ${count} matches for the bounding box.`);

if (count > 0) {
    content = content.replace(regex, newBox);
    fs.writeFileSync(file, content);
    console.log('Successfully patched bounding boxes.');
}
