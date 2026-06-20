const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// 1. wrapper and container
content = content.replace('overflow-hidden ring-1 ring-white/5 shrink-0"', 'overflow-visible ring-1 ring-white/5 shrink-0"');
const canvasRegex = /<canvas id="renderCanvas" class="absolute inset-0 w-full h-full object-contain hidden"><\/canvas>/;
content = content.replace(canvasRegex, '<canvas id="renderCanvas" class="absolute inset-0 w-full h-full object-contain hidden"></canvas>\n                        <div id="domBoundingBoxContainer" class="absolute inset-0 pointer-events-none z-50"></div>');

// 2. Replace the two bounding box blocks exactly
while (content.includes('// Interactive Bounding Box for Selected')) {
    const startIndex = content.indexOf('// Interactive Bounding Box for Selected');
    const restoreIndex = content.indexOf('ctx.restore();', startIndex);
    if (restoreIndex !== -1) {
        const replacement = `// DOM Box capture
                        if (clip.id === State.selectedClipId && !State.isExporting) {
                            clip._renderW = dw;
                            clip._renderH = dh;
                        }

                        `;
        content = content.substring(0, startIndex) + replacement + content.substring(restoreIndex);
    } else {
        break; // safety
    }
}

// 3. Inject drawDOMBoundingBox() at the end of drawCanvas
const endOfDrawCanvas = `            } else {
                placeholder.classList.remove('hidden');
                canvas.classList.add('hidden');
            }
        }`;
const replacementEnd = `            } else {
                placeholder.classList.remove('hidden');
                canvas.classList.add('hidden');
            }
            drawDOMBoundingBox();
        }`;
content = content.replace(endOfDrawCanvas, replacementEnd);

// 4. Inject drawDOMBoundingBox() function
const funcDef = `
        function drawDOMBoundingBox() {
            const container = document.getElementById('domBoundingBoxContainer');
            if (!container) return;
            container.innerHTML = '';
            
            if (!State.selectedClipId || State.isExporting) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip || clip.hidden || clip.type === 'audio') return;
            
            const dw = clip._renderW || 0;
            const dh = clip._renderH || 0;
            if (dw === 0 || dh === 0) return;
            
            const canvas = document.getElementById('renderCanvas');
            const wrapper = document.getElementById('canvasAspectWrapper');
            const scaleUI = wrapper.clientWidth / canvas.width;
            
            const scale = clip.effects.scale !== undefined ? clip.effects.scale : 1;
            const rotate = clip.effects.rotate || 0;
            const flipH = clip.effects.flipH ? -1 : 1;
            const flipV = clip.effects.flipV ? -1 : 1;
            const offsetX = (clip.effects.offsetX || 0) * (canvas.width / 100);
            const offsetY = (clip.effects.offsetY || 0) * (canvas.height / 100);

            const cx = (canvas.width / 2 + offsetX) * scaleUI;
            const cy = (canvas.height / 2 + offsetY) * scaleUI;
            
            const pad = 32; // Screen pixels padding
            const w = Math.abs(dw * scaleUI * scale) + pad;
            const h = Math.abs(dh * scaleUI * scale) + pad;
            
            const box = document.createElement('div');
            box.style.position = 'absolute';
            box.style.left = \`\${cx - w/2}px\`;
            box.style.top = \`\${cy - h/2}px\`;
            box.style.width = \`\${w}px\`;
            box.style.height = \`\${h}px\`;
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
`;

if (!content.includes('function drawDOMBoundingBox()')) {
    const endScriptIndex = content.lastIndexOf('</script>');
    if (endScriptIndex !== -1) {
        content = content.substring(0, endScriptIndex) + funcDef + '\\n    ' + content.substring(endScriptIndex);
    }
}

fs.writeFileSync(file, content);
console.log('Successfully patched exactly.');
