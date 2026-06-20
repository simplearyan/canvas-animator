const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove overflow-hidden from canvasAspectWrapper
content = content.replace('overflow-hidden ring-1 ring-white/5 shrink-0"', 'overflow-visible ring-1 ring-white/5 shrink-0"');

// 2. Add domBoundingBoxContainer after renderCanvas
const canvasRegex = /<canvas id="renderCanvas" class="absolute inset-0 w-full h-full object-contain hidden"><\/canvas>/;
content = content.replace(canvasRegex, '<canvas id="renderCanvas" class="absolute inset-0 w-full h-full object-contain hidden"></canvas>\n                        <div id="domBoundingBoxContainer" class="absolute inset-0 pointer-events-none z-50"></div>');

// 3. Replace canvas bounding box logic
const boxRegex1 = /\/\/\s*Interactive Bounding Box for Selected[\s\S]*?ctx\.stroke\(\);\s*\}/g;

const count = (content.match(boxRegex1) || []).length;
console.log('Matches for canvas bounding box:', count);

content = content.replace(boxRegex1, `// Interactive Bounding Box for Selected
                        if (clip.id === State.selectedClipId && !State.isExporting) {
                            clip._renderW = dw;
                            clip._renderH = dh;
                        }`);

// 4. Inject drawDOMBoundingBox() call at the end of drawCanvas
// Right before "if (targetCtx)" around line 1690
const endDrawCanvasRegex = /if\s*\(targetCtx\)\s*\{\s*targetCtx\.drawImage\(canvas,\s*0,\s*0,\s*targetW,\s*targetH\);\s*\}/;
content = content.replace(endDrawCanvasRegex, `drawDOMBoundingBox();\n            if (targetCtx) {\n                targetCtx.drawImage(canvas, 0, 0, targetW, targetH);\n            }`);

// 5. Inject drawDOMBoundingBox() function definition at the end of the script block
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
        
        // --- End function
        `;

content = content.replace('// --- Helpers ---', funcDef + '\n        // --- Helpers ---');

fs.writeFileSync(file, content);
console.log('Successfully patched DOM overlay.');
