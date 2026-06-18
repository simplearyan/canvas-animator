const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. UI HTML
const strokeUI = `                        <!-- Accordion: Stroke (Outline) -->
                        <details id="acc-stroke" class="bg-white dark:bg-pro-800 border border-pro-300 dark:border-pro-700 rounded-lg shadow-sm overflow-hidden hidden" open>
                            <summary class="flex justify-between items-center font-bold cursor-pointer p-3 bg-pro-100 dark:bg-pro-800/80 text-sm text-pro-800 dark:text-pro-200 select-none border-b border-pro-300 dark:border-pro-700">
                                <div class="flex items-center gap-2"><i class="ph-bold ph-circle-notch text-pro-500 dark:text-pro-400"></i> Stroke & Outline</div>
                                <div class="flex items-center gap-3">
                                    <button id="toggleStrokeBtn" class="w-8 h-4 rounded-full relative border border-pro-400 dark:border-pro-600 bg-pro-300 dark:bg-pro-600 transition-colors duration-200">
                                        <div class="w-3 h-3 bg-white rounded-full absolute left-0.5 top-[1px] shadow-sm transition-transform duration-200"></div>
                                    </button>
                                    <i class="ph-bold ph-caret-down text-pro-500 dark:text-pro-400 pointer-events-none"></i>
                                </div>
                            </summary>
                            <div id="strokeSettings" class="p-3 bg-pro-50 dark:bg-pro-900 space-y-3 hidden">
                                <div class="bg-white dark:bg-pro-800 border border-pro-200 dark:border-pro-700 p-3 rounded-md shadow-sm space-y-4">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Stroke Color</label>
                                        </div>
                                        <div class="flex items-center gap-2 p-1 border border-pro-300 dark:border-pro-600 rounded bg-pro-50 dark:bg-pro-900">
                                            <div class="relative w-8 h-8 rounded border border-pro-300 dark:border-pro-600 overflow-hidden shrink-0 shadow-sm">
                                                <input type="color" id="editStrokeColor" class="absolute -top-2 -left-2 w-12 h-12 cursor-pointer">
                                            </div>
                                            <input type="text" id="editStrokeColorHex" class="w-full text-sm font-bold uppercase border-none focus:outline-none bg-transparent text-pro-800 dark:text-pro-200" readonly>
                                        </div>
                                    </div>
                                    <hr class="border-pro-100 dark:border-pro-700">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Stroke Width</label>
                                            <span id="editStrokeWidthVal" class="text-[10px] font-bold text-pro-800 dark:text-pro-200 bg-pro-100 dark:bg-pro-700 px-1.5 rounded">5px</span>
                                        </div>
                                        <input type="range" id="editStrokeWidth" min="1" max="50" value="5">
                                    </div>
                                </div>
                            </div>
                        </details>

`;
content = content.replace('                        <!-- Accordion: Image Styling (Image Only) -->', strokeUI + '                        <!-- Accordion: Image Styling (Image Only) -->');

// 2. JS Variables
const jsVars = `        const toggleExtrusionBtn = document.getElementById('toggleExtrusionBtn');
        const extrusionSettings = document.getElementById('extrusionSettings');
        const accStroke = document.getElementById('acc-stroke');
        const toggleStrokeBtn = document.getElementById('toggleStrokeBtn');
        const strokeSettings = document.getElementById('strokeSettings');
        const editStrokeColor = document.getElementById('editStrokeColor');
        const editStrokeColorHex = document.getElementById('editStrokeColorHex');
        const editStrokeWidth = document.getElementById('editStrokeWidth');
        const editStrokeWidthVal = document.getElementById('editStrokeWidthVal');`;
content = content.replace(`        const toggleExtrusionBtn = document.getElementById('toggleExtrusionBtn');
        const extrusionSettings = document.getElementById('extrusionSettings');`, jsVars);

// 3. JS Event Listeners
const jsEvents = `        editExtrusionDepth.addEventListener('input', (e) => {
            editExtrusionDepthVal.textContent = e.target.value;
            updateProp('extrusionDepth', parseInt(e.target.value));
        });

        toggleStrokeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(!state.selectedId) return;
            const el = state.elements.find(x => x.id === state.selectedId);
            if(el) {
                el.strokeEnabled = !el.strokeEnabled;
                updateUI();
                render();
            }
        });

        editStrokeColor.addEventListener('input', (e) => {
            editStrokeColorHex.value = e.target.value.toUpperCase();
            updateProp('strokeColor', e.target.value);
        });

        editStrokeWidth.addEventListener('input', (e) => {
            editStrokeWidthVal.textContent = \`\${e.target.value}px\`;
            updateProp('strokeWidth', parseInt(e.target.value));
        });`;
content = content.replace(`        editExtrusionDepth.addEventListener('input', (e) => {
            editExtrusionDepthVal.textContent = e.target.value;
            updateProp('extrusionDepth', parseInt(e.target.value));
        });`, jsEvents);

// 4. updateUI Visibility Logic
const uiVisOld = `                if (el.type === 'text' || el.type === 'emoji') {
                    accTypography.style.display = 'block';`;
const uiVisNew = `                if (el.type === 'text' || el.type === 'emoji' || el.type === 'image' || el.type === 'shape') {
                    accStroke.style.display = 'block';
                } else {
                    accStroke.style.display = 'none';
                }
                
                if (el.type === 'text' || el.type === 'emoji') {
                    accTypography.style.display = 'block';`;
content = content.replace(uiVisOld, uiVisNew);

// 5. updateUI State Logic
const uiStateOld = `                const extEnabled = el.extrusionEnabled !== false;
                toggleExtrusionBtn.className = \`w-8 h-4 rounded-full relative border border-pro-400 dark:border-pro-600  \${extEnabled ? 'bg-brand-500 border-brand-600' : 'bg-pro-300 dark:bg-pro-600 border-pro-400 dark:border-pro-500'}\`;
                toggleExtrusionBtn.firstElementChild.className = \`w-3 h-3 bg-white rounded-full absolute left-0.5 top-[1px] pointer-events-none shadow-sm  \${extEnabled ? 'translate-x-4' : ''}\`;
                extEnabled ? extrusionSettings.classList.remove('hidden') : extrusionSettings.classList.add('hidden');`;
const uiStateNew = uiStateOld + `

                const strkEnabled = el.strokeEnabled === true;
                toggleStrokeBtn.className = \`w-8 h-4 rounded-full relative border border-pro-400 dark:border-pro-600  \${strkEnabled ? 'bg-brand-500 border-brand-600' : 'bg-pro-300 dark:bg-pro-600 border-pro-400 dark:border-pro-500'}\`;
                toggleStrokeBtn.firstElementChild.className = \`w-3 h-3 bg-white rounded-full absolute left-0.5 top-[1px] pointer-events-none shadow-sm  \${strkEnabled ? 'translate-x-4' : ''}\`;
                strkEnabled ? strokeSettings.classList.remove('hidden') : strokeSettings.classList.add('hidden');

                editStrokeColor.value = el.strokeColor || '#ffffff';
                editStrokeColorHex.value = (el.strokeColor || '#ffffff').toUpperCase();
                editStrokeWidth.value = el.strokeWidth || 5;
                editStrokeWidthVal.textContent = \`\${el.strokeWidth || 5}px\`;`;
content = content.replace(uiStateOld, uiStateNew);

// 6. Text Stroke Rendering
const textDrawOld = `                                ctx.fillText(cm.text, -(cm.width - (el.letterSpacing || 0)) / 2, 0);`;
const textDrawNew = `                                if (el.strokeEnabled && el.strokeWidth > 0) {
                                    ctx.strokeStyle = isExtrusionShadow ? (el.shadowColor || '#000000') : (el.strokeColor || '#ffffff');
                                    ctx.lineWidth = el.strokeWidth * 2;
                                    ctx.lineJoin = 'round';
                                    ctx.miterLimit = 2;
                                    ctx.strokeText(cm.text, -(cm.width - (el.letterSpacing || 0)) / 2, 0);
                                }
                                ctx.fillText(cm.text, -(cm.width - (el.letterSpacing || 0)) / 2, 0);`;
content = content.replace(textDrawOld, textDrawNew);

// 7. Image Stroke Rendering
const imageDrawOld = `                    ctx.beginPath();
                    ctx.roundRect(drawX, drawY, cw, ch, el.radius || 0);

                    if(el.dropShadowEnabled && el.dropShadowColor && el.dropShadowColor !== '#00000000') {
                        ctx.shadowColor = el.dropShadowColor;
                        ctx.shadowBlur = el.dropShadowBlur || 0;
                        ctx.shadowOffsetX = el.dropShadowX || 0;
                        ctx.shadowOffsetY = el.dropShadowY || 0;
                        ctx.fillStyle = 'rgba(0,0,0,1)';
                        ctx.fill(); // Cast shadow
                    }
                    
                    ctx.shadowColor = 'transparent'; // Prevent image double-shadow
                    ctx.clip();
                    
                    const iScale = el.innerScale || 1;
                    const iX = (el.innerX || 0) / 100 * el.img.width;
                    const iY = (el.innerY || 0) / 100 * el.img.height;
                    const imgDrawW = el.img.width * iScale;
                    const imgDrawH = el.img.height * iScale;
                    const baseImgX = drawX - (cropL/100 * el.img.width) * iScale;
                    const baseImgY = drawY - (cropT/100 * el.img.height) * iScale;
                    
                    ctx.drawImage(el.img, baseImgX + iX, baseImgY + iY, imgDrawW, imgDrawH);`;

const imageDrawNew = `                    const sw = (el.strokeEnabled && el.strokeWidth > 0) ? el.strokeWidth : 0;
                    
                    const tmpCnv = document.createElement('canvas');
                    tmpCnv.width = cw + sw * 2;
                    tmpCnv.height = ch + sw * 2;
                    const tctx = tmpCnv.getContext('2d');
                    
                    tctx.beginPath();
                    tctx.roundRect(sw, sw, cw, ch, el.radius || 0);
                    tctx.clip();
                    
                    const iScale = el.innerScale || 1;
                    const iX = (el.innerX || 0) / 100 * el.img.width;
                    const iY = (el.innerY || 0) / 100 * el.img.height;
                    const imgDrawW = el.img.width * iScale;
                    const imgDrawH = el.img.height * iScale;
                    const baseImgX = sw - (cropL/100 * el.img.width) * iScale;
                    const baseImgY = sw - (cropT/100 * el.img.height) * iScale;
                    
                    tctx.drawImage(el.img, baseImgX + iX, baseImgY + iY, imgDrawW, imgDrawH);
                    
                    if(el.dropShadowEnabled && el.dropShadowColor && el.dropShadowColor !== '#00000000') {
                        ctx.shadowColor = el.dropShadowColor;
                        ctx.shadowBlur = el.dropShadowBlur || 0;
                        ctx.shadowOffsetX = el.dropShadowX || 0;
                        ctx.shadowOffsetY = el.dropShadowY || 0;
                    }
                    
                    if (sw > 0) {
                        const strokeCnv = document.createElement('canvas');
                        strokeCnv.width = tmpCnv.width;
                        strokeCnv.height = tmpCnv.height;
                        const sctx = strokeCnv.getContext('2d');
                        sctx.drawImage(tmpCnv, 0, 0);
                        sctx.globalCompositeOperation = 'source-in';
                        sctx.fillStyle = el.strokeColor || '#ffffff';
                        sctx.fillRect(0, 0, strokeCnv.width, strokeCnv.height);
                        
                        const steps = Math.max(8, Math.min(32, sw * 2));
                        for (let i = 0; i < steps; i++) {
                            const angle = (i / steps) * Math.PI * 2;
                            const sx = drawX - sw + Math.cos(angle) * sw;
                            const sy = drawY - sw + Math.sin(angle) * sw;
                            ctx.drawImage(strokeCnv, sx, sy);
                        }
                    }
                    
                    ctx.shadowColor = 'transparent';
                    ctx.drawImage(tmpCnv, drawX - sw, drawY - sw);`;

content = content.replace(imageDrawOld, imageDrawNew);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Stroke feature fully injected.");
