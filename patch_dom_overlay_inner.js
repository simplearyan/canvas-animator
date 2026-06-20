const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove drawDOMBoundingBox function and call
content = content.replace('            drawDOMBoundingBox();\n        }', '        }');

const funcRegex = /function drawDOMBoundingBox\(\) \{[\s\S]*?\}(?=\s*<\/script>)/;
content = content.replace(funcRegex, '');

// 2. Clear the container at the START of drawCanvas
// Find function drawCanvas
const drawCanvasStart = content.indexOf('function drawCanvas(targetCtx, targetW, targetH) {');
const drawCanvasBody = content.indexOf('{', drawCanvasStart) + 1;
content = content.substring(0, drawCanvasBody) + 
`\n            const domBoxContainer = document.getElementById('domBoundingBoxContainer');
            if (domBoxContainer && !State.isExporting) domBoxContainer.innerHTML = '';` + 
content.substring(drawCanvasBody);

// 3. Inject DOM logic directly inside the loop for Text and Image/Video
const domLogic = `
                        // DOM Box render inside loop
                        if (clip.id === State.selectedClipId && !State.isExporting) {
                            const container = document.getElementById('domBoundingBoxContainer');
                            if (container) {
                                const wrapper = document.getElementById('canvasAspectWrapper');
                                const scaleUI = wrapper.clientWidth / canvas.width;
                                
                                const finalScale = clip.effects.scale !== undefined ? clip.effects.scale : 1;
                                const rotate = clip.effects.rotate || 0;
                                const flipH = clip.effects.flipH ? -1 : 1;
                                const flipV = clip.effects.flipV ? -1 : 1;
                                const offsetX = (clip.effects.offsetX || 0) * (canvas.width / 100);
                                const offsetY = (clip.effects.offsetY || 0) * (canvas.height / 100);

                                const cx = (canvas.width / 2 + offsetX) * scaleUI;
                                const cy = (canvas.height / 2 + offsetY) * scaleUI;
                                
                                const pad = 32;
                                const w_box = Math.abs(dw * scaleUI * finalScale) + pad;
                                const h_box = Math.abs(dh * scaleUI * finalScale) + pad;
                                
                                const box = document.createElement('div');
                                box.style.position = 'absolute';
                                box.style.left = \`\${cx - w_box/2}px\`;
                                box.style.top = \`\${cy - h_box/2}px\`;
                                box.style.width = \`\${w_box}px\`;
                                box.style.height = \`\${h_box}px\`;
                                box.style.transform = \`rotate(\${rotate}deg) scale(\${flipH}, \${flipV})\`;
                                box.style.border = '2px solid #6366f1';
                                box.style.boxShadow = '0 0 10px rgba(99, 102, 241, 0.4)';
                                
                                const handleHtml = \`
                                    <div style="position: absolute; width: 12px; height: 12px; background: white; border: 3px solid #6366f1; border-radius: 50%; left: -7px; top: -7px;"></div>
                                    <div style="position: absolute; width: 12px; height: 12px; background: white; border: 3px solid #6366f1; border-radius: 50%; right: -7px; top: -7px;"></div>
                                    <div style="position: absolute; width: 12px; height: 12px; background: white; border: 3px solid #6366f1; border-radius: 50%; left: -7px; bottom: -7px;"></div>
                                    <div style="position: absolute; width: 12px; height: 12px; background: white; border: 3px solid #6366f1; border-radius: 50%; right: -7px; bottom: -7px;"></div>
                                    
                                    <div style="position: absolute; width: 36px; height: 14px; background: white; border: 3px solid #6366f1; border-radius: 7px; left: 50%; top: -7px; transform: translateX(-50%);"></div>
                                    <div style="position: absolute; width: 36px; height: 14px; background: white; border: 3px solid #6366f1; border-radius: 7px; left: 50%; bottom: -7px; transform: translateX(-50%);"></div>
                                    <div style="position: absolute; width: 14px; height: 36px; background: white; border: 3px solid #6366f1; border-radius: 7px; top: 50%; left: -7px; transform: translateY(-50%);"></div>
                                    <div style="position: absolute; width: 14px; height: 36px; background: white; border: 3px solid #6366f1; border-radius: 7px; top: 50%; right: -7px; transform: translateY(-50%);"></div>
                                    
                                    <div style="position: absolute; width: 2px; height: 40px; background: #6366f1; left: 50%; top: -40px; transform: translateX(-50%);"></div>
                                    <div style="position: absolute; width: 12px; height: 12px; background: #6366f1; border: 2px solid white; border-radius: 50%; left: 50%; top: -46px; transform: translateX(-50%);"></div>
                                \`;
                                box.innerHTML = handleHtml;
                                container.appendChild(box);
                            }
                        }
`;

while (content.includes('// DOM Box capture')) {
    const startIndex = content.indexOf('// DOM Box capture');
    const restoreIndex = content.indexOf('ctx.restore();', startIndex);
    if (restoreIndex !== -1) {
        content = content.substring(0, startIndex) + domLogic + '\n                        ' + content.substring(restoreIndex);
    } else {
        break; // safety
    }
}

fs.writeFileSync(file, content);
console.log('Successfully patched inner loop exactly.');
