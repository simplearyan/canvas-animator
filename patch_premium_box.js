const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

const regexClean = /if\s*\(clip\.id === State\.selectedClipId && !State\.isExporting\)\s*\{\s*ctx\.shadowColor = 'rgba\(99, 102, 241, 0\.4\)';[\s\S]*?drawHandle\(dw\/2, dh\/2\);\s*\}/g;

const newBox = `if (clip.id === State.selectedClipId && !State.isExporting) {
                            ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
                            ctx.shadowBlur = 10 / finalScale;
                            ctx.strokeStyle = '#6366f1';
                            ctx.lineWidth = 2.5 / finalScale;
                            ctx.strokeRect(-dw/2, -dh/2, dw, dh);
                            
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;
                            
                            const handleSize = 7 / finalScale;
                            const drawHandle = (hx, hy) => {
                                ctx.beginPath();
                                ctx.arc(hx, hy, handleSize, 0, Math.PI * 2);
                                ctx.fillStyle = '#ffffff';
                                ctx.fill();
                                ctx.lineWidth = 2.5 / finalScale;
                                ctx.strokeStyle = '#6366f1';
                                ctx.stroke();
                            };
                            
                            // Rotation Line
                            ctx.beginPath();
                            ctx.moveTo(0, -dh/2);
                            ctx.lineTo(0, -dh/2 - (40 / finalScale));
                            ctx.lineWidth = 2.5 / finalScale;
                            ctx.stroke();
                            
                            // 4 corners
                            drawHandle(-dw/2, -dh/2);
                            drawHandle(dw/2, -dh/2);
                            drawHandle(-dw/2, dh/2);
                            drawHandle(dw/2, dh/2);
                            
                            // Rotation Handle (like in studio_pro)
                            ctx.beginPath();
                            ctx.arc(0, -dh/2 - (40 / finalScale), handleSize * 0.9, 0, Math.PI * 2);
                            ctx.fillStyle = '#6366f1';
                            ctx.fill();
                            ctx.lineWidth = 2.5 / finalScale;
                            ctx.strokeStyle = '#ffffff';
                            ctx.stroke();
                        }`;

let count = (content.match(regexClean) || []).length;
console.log(`Found ${count} matches for the current bounding box.`);

if (count > 0) {
    content = content.replace(regexClean, newBox);
    fs.writeFileSync(file, content);
    console.log('Successfully patched to premium bounding box.');
} else {
    console.log("Could not find the bounding box to replace.");
}
