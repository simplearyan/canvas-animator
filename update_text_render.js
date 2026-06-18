const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// Update main canvas extrusion
content = content.replace(
    /if \(clip\.effects\.extrudeEnable\) \{\s*ctx\.fillStyle = clip\.effects\.extrudeColor \|\| '#000000';\s*const depth = clip\.effects\.extrudeDepth \|\| 5;\s*for\(let i = depth; i > 0; i -= 0\.5\) \{\s*ctx\.fillText\(clip\.text, i, i\);\s*\}\s*\}/g,
    `if (clip.effects.extrudeEnable) {
                                ctx.fillStyle = clip.effects.extrudeColor || '#000000';
                                const depth = clip.effects.extrudeDepth || 5;
                                let dx = 1, dy = 1;
                                if (clip.effects.extrudeDir === 'bl') { dx = -1; dy = 1; }
                                else if (clip.effects.extrudeDir === 'b') { dx = 0; dy = 1; }
                                for(let i = depth; i > 0; i -= 0.5) {
                                    ctx.fillText(clip.text, dx * i, dy * i);
                                }
                            }`
);

// Update offscreen canvas extrusion
content = content.replace(
    /if \(clip\.effects\.extrudeEnable\) \{\s*offCtx\.fillStyle = clip\.effects\.extrudeColor \|\| '#000000';\s*const depth = clip\.effects\.extrudeDepth \|\| 5;\s*for\(let i = depth; i > 0; i -= 0\.5\) \{\s*offCtx\.fillText\(clip\.text, i, i\);\s*\}\s*\}/g,
    `if (clip.effects.extrudeEnable) {
                                offCtx.fillStyle = clip.effects.extrudeColor || '#000000';
                                const depth = clip.effects.extrudeDepth || 5;
                                let dx = 1, dy = 1;
                                if (clip.effects.extrudeDir === 'bl') { dx = -1; dy = 1; }
                                else if (clip.effects.extrudeDir === 'b') { dx = 0; dy = 1; }
                                for(let i = depth; i > 0; i -= 0.5) {
                                    offCtx.fillText(clip.text, dx * i, dy * i);
                                }
                            }`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated text rendering extrusion logic.");
