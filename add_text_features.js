const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let html = fs.readFileSync(file, 'utf8');

// 1. Update setClipEffect
html = html.replace(
    /else if \(\['shadowColor', 'animIn', 'animOut', 'animLoop', 'extrudeColor', 'fillColor', 'fontFamily'\]\.includes\(effectName\)\) \{/,
    `else if (['shadowColor', 'animIn', 'animOut', 'animLoop', 'extrudeColor', 'fillColor', 'fontFamily', 'extrudeDir', 'textTransform', 'fontStyle', 'textDecoration', 'blendMode'].includes(effectName)) {`
);

// 2. Update Extrude Direction Dropdown options (lines 1566-1570)
const oldExtrudeDirs = `<option value="br" \${(fx.extrudeDir || 'br') === 'br' ? 'selected' : ''}>Bottom Right</option>
                                    <option value="bl" \${fx.extrudeDir === 'bl' ? 'selected' : ''}>Bottom Left</option>
                                    <option value="b" \${fx.extrudeDir === 'b' ? 'selected' : ''}>Bottom</option>`;
const newExtrudeDirs = `<option value="br" \${(fx.extrudeDir || 'br') === 'br' ? 'selected' : ''}>Bottom Right</option>
                                    <option value="bl" \${fx.extrudeDir === 'bl' ? 'selected' : ''}>Bottom Left</option>
                                    <option value="tr" \${fx.extrudeDir === 'tr' ? 'selected' : ''}>Top Right</option>
                                    <option value="tl" \${fx.extrudeDir === 'tl' ? 'selected' : ''}>Top Left</option>
                                    <option value="b" \${fx.extrudeDir === 'b' ? 'selected' : ''}>Bottom</option>
                                    <option value="t" \${fx.extrudeDir === 't' ? 'selected' : ''}>Top</option>
                                    <option value="l" \${fx.extrudeDir === 'l' ? 'selected' : ''}>Left</option>
                                    <option value="r" \${fx.extrudeDir === 'r' ? 'selected' : ''}>Right</option>`;
html = html.replace(oldExtrudeDirs, newExtrudeDirs);

// 3. Replace the Text Content UI properties section
const oldTextProps = `<div>
                                    <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Weight</label>
                                    <select class="w-full text-xs p-2 pl-3 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'fontWeight', parseInt(this.value))">
                                        <option value="400" \${fx.fontWeight === 400 ? 'selected' : ''}>Regular</option>
                                        <option value="600" \${fx.fontWeight === 600 ? 'selected' : ''}>Semi-Bold</option>
                                        <option value="700" \${fx.fontWeight === 700 ? 'selected' : ''}>Bold</option>
                                        <option value="900" \${fx.fontWeight === 900 ? 'selected' : ''}>Black</option>
                                    </select>
                                </div>
                                <div class="mt-2">
                                    <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Fill Color</label>`;

const newTextProps = `  <div class="grid grid-cols-2 gap-2 mt-2">
                                    <div>
                                        <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Weight</label>
                                        <select class="w-full text-xs p-2 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner appearance-none font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'fontWeight', parseInt(this.value))">
                                            <option value="400" \${fx.fontWeight === 400 ? 'selected' : ''}>Regular</option>
                                            <option value="600" \${fx.fontWeight === 600 ? 'selected' : ''}>SemiBold</option>
                                            <option value="700" \${fx.fontWeight === 700 ? 'selected' : ''}>Bold</option>
                                            <option value="900" \${fx.fontWeight === 900 ? 'selected' : ''}>ExtraBold</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Casing</label>
                                        <select class="w-full text-xs p-2 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner appearance-none font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'textTransform', this.value)">
                                            <option value="none" \${(fx.textTransform || 'none') === 'none' ? 'selected' : ''}>As Typed</option>
                                            <option value="uppercase" \${fx.textTransform === 'uppercase' ? 'selected' : ''}>UPPERCASE</option>
                                            <option value="lowercase" \${fx.textTransform === 'lowercase' ? 'selected' : ''}>lowercase</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Style</label>
                                        <select class="w-full text-xs p-2 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner appearance-none font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'fontStyle', this.value)">
                                            <option value="normal" \${(fx.fontStyle || 'normal') === 'normal' ? 'selected' : ''}>Normal</option>
                                            <option value="italic" \${fx.fontStyle === 'italic' ? 'selected' : ''}>Italic</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Decoration</label>
                                        <select class="w-full text-xs p-2 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner appearance-none font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'textDecoration', this.value)">
                                            <option value="none" \${(fx.textDecoration || 'none') === 'none' ? 'selected' : ''}>None</option>
                                            <option value="underline" \${fx.textDecoration === 'underline' ? 'selected' : ''}>Underline</option>
                                            <option value="line-through" \${fx.textDecoration === 'line-through' ? 'selected' : ''}>Strike</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="mt-3 flex flex-col gap-3 border-t border-surface-200 dark:border-surface-700 pt-3">
                                    <div>
                                        <div class="flex justify-between items-center mb-1.5">
                                            <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Size</label>
                                            <span class="text-[10px] font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">\${fx.fontSize || 100}px</span>
                                        </div>
                                        <input type="range" min="10" max="400" value="\${fx.fontSize || 100}" class="w-full custom-slider" oninput="setClipEffect('\${clip.id}', 'fontSize', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + 'px'; drawCanvas();">
                                    </div>
                                    <div>
                                        <div class="flex justify-between items-center mb-1.5">
                                            <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Letter Spacing</label>
                                            <span class="text-[10px] font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">\${fx.letterSpacing || 0}px</span>
                                        </div>
                                        <input type="range" min="-20" max="100" value="\${fx.letterSpacing || 0}" class="w-full custom-slider" oninput="setClipEffect('\${clip.id}', 'letterSpacing', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + 'px'; drawCanvas();">
                                    </div>
                                    <div>
                                        <div class="flex justify-between items-center mb-1.5">
                                            <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Line Height</label>
                                            <span class="text-[10px] font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">\${fx.lineHeight || 1.1}x</span>
                                        </div>
                                        <input type="range" min="0.5" max="3" step="0.1" value="\${fx.lineHeight || 1.1}" class="w-full custom-slider" oninput="setClipEffect('\${clip.id}', 'lineHeight', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + 'x'; drawCanvas();">
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Blend Mode</label>
                                        <select class="w-full text-xs p-2 border border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-900/80 shadow-inner appearance-none font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'blendMode', this.value); drawCanvas();">
                                            <option value="source-over" \${(fx.blendMode || 'source-over') === 'source-over' ? 'selected' : ''}>Normal</option>
                                            <option value="multiply" \${fx.blendMode === 'multiply' ? 'selected' : ''}>Multiply</option>
                                            <option value="screen" \${fx.blendMode === 'screen' ? 'selected' : ''}>Screen</option>
                                            <option value="overlay" \${fx.blendMode === 'overlay' ? 'selected' : ''}>Overlay</option>
                                        </select>
                                    </div>
                                    <div>
                                        <div class="flex justify-between items-center mb-1.5">
                                            <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Opacity</label>
                                            <span class="text-[10px] font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">\${fx.opacity !== undefined ? fx.opacity : 100}%</span>
                                        </div>
                                        <input type="range" min="0" max="100" value="\${fx.opacity !== undefined ? fx.opacity : 100}" class="w-full custom-slider" oninput="setClipEffect('\${clip.id}', 'opacity', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + '%'; drawCanvas();">
                                    </div>
                                </div>
                                
                                <div class="mt-2">
                                    <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Fill Color</label>`;
html = html.replace(oldTextProps, newTextProps);

// 4. Update the Text Rendering Engine block

const oldEngine = `                        // Drawing text clip
                        ctx.font = \`\${clip.effects.fontWeight} 100px \${clip.effects.fontFamily}\`;
                        const metrics = ctx.measureText(clip.text);
                        let dw = metrics.width;
                        let dh = 100; // rough estimation for height at 100px font

                        const baseScale = clip.effects.scale !== undefined ? clip.effects.scale : 1;
                        const rotate = clip.effects.rotate !== undefined ? clip.effects.rotate : 0;
                        const offsetX = clip.effects.offsetX || 0;
                        const offsetY = clip.effects.offsetY || 0;`;

const newEngine = `                        // Drawing text clip
                        const fontSize = clip.effects.fontSize || 100;
                        const fontStyle = clip.effects.fontStyle || 'normal';
                        ctx.font = \`\${fontStyle} \${clip.effects.fontWeight || 700} \${fontSize}px "\${clip.effects.fontFamily || 'Rubik'}"\`;
                        
                        // Parse text content
                        let renderText = clip.text || '';
                        if (clip.effects.textTransform === 'uppercase') renderText = renderText.toUpperCase();
                        else if (clip.effects.textTransform === 'lowercase') renderText = renderText.toLowerCase();
                        
                        const lines = renderText.split('\\n');
                        const metrics = ctx.measureText(renderText); // Rough max width
                        let dw = metrics.width;
                        let dh = fontSize * lines.length; 
                        
                        // New Text Properties
                        ctx.letterSpacing = (clip.effects.letterSpacing || 0) + "px";
                        const lh = (clip.effects.lineHeight || 1.1) * fontSize;
                        const startY = -((lines.length - 1) * lh) / 2;

                        const baseScale = clip.effects.scale !== undefined ? clip.effects.scale : 1;
                        const rotate = clip.effects.rotate !== undefined ? clip.effects.rotate : 0;
                        const offsetX = clip.effects.offsetX || 0;
                        const offsetY = clip.effects.offsetY || 0;`;
html = html.replace(oldEngine, newEngine);

// 5. Update animation math to handle opacity & blendMode
const oldAlpha = `ctx.globalAlpha = animAlpha;
                        ctx.translate(cx, cy);`;
const newAlpha = `ctx.globalAlpha = animAlpha * (clip.effects.opacity !== undefined ? clip.effects.opacity/100 : 1);
                        ctx.globalCompositeOperation = clip.effects.blendMode || 'source-over';
                        ctx.translate(cx, cy);`;
html = html.replace(oldAlpha, newAlpha);

// 6. Update Extrude Direction DX/DY parsing
function replaceExtrudeLogic(content) {
    const oldExt = `let dx = 1, dy = 1;
                                if (clip.effects.extrudeDir === 'bl') { dx = -1; dy = 1; }
                                else if (clip.effects.extrudeDir === 'b') { dx = 0; dy = 1; }`;
    const newExt = `let dx = 1, dy = 1;
                                const ed = clip.effects.extrudeDir || 'br';
                                if (ed === 'bl') { dx = -1; dy = 1; }
                                else if (ed === 'b') { dx = 0; dy = 1; }
                                else if (ed === 'br') { dx = 1; dy = 1; }
                                else if (ed === 'tr') { dx = 1; dy = -1; }
                                else if (ed === 'tl') { dx = -1; dy = -1; }
                                else if (ed === 't') { dx = 0; dy = -1; }
                                else if (ed === 'r') { dx = 1; dy = 0; }
                                else if (ed === 'l') { dx = -1; dy = 0; }`;
    // Replace all instances (main ctx and offCtx)
    return content.split(oldExt).join(newExt);
}
html = replaceExtrudeLogic(html);

// 7. Update fillText with line wrapping
function replaceFillText(content) {
    const oldFill = `for(let i = depth; i > 0; i -= 0.5) {
                                    ctx.fillText(clip.text, dx * i, dy * i);
                                }
                            }

                            // Drop shadow
                            if (clip.effects.shadowEnable) {
                                ctx.shadowColor = clip.effects.shadowColor || '#000000';
                                ctx.shadowBlur = clip.effects.shadowBlur || 20;
                                ctx.shadowOffsetX = clip.effects.shadowX || 0;
                                ctx.shadowOffsetY = clip.effects.shadowY || 10;
                            } else {
                                ctx.shadowColor = 'transparent';
                                ctx.shadowBlur = 0;
                            }

                            ctx.fillStyle = clip.effects.fillColor || '#ffffff';
                            ctx.fillText(clip.text, 0, 0);`;
                            
    const newFill = `for(let i = depth; i > 0; i -= 0.5) {
                                    lines.forEach((line, li) => {
                                        ctx.fillText(line, dx * i, startY + li * lh + dy * i);
                                    });
                                }
                            }

                            // Drop shadow
                            if (clip.effects.shadowEnable) {
                                ctx.shadowColor = clip.effects.shadowColor || '#000000';
                                ctx.shadowBlur = clip.effects.shadowBlur || 20;
                                ctx.shadowOffsetX = clip.effects.shadowX || 0;
                                ctx.shadowOffsetY = clip.effects.shadowY || 10;
                            } else {
                                ctx.shadowColor = 'transparent';
                                ctx.shadowBlur = 0;
                            }

                            ctx.fillStyle = clip.effects.fillColor || '#ffffff';
                            lines.forEach((line, li) => {
                                ctx.fillText(line, 0, startY + li * lh);
                                
                                // Text Decoration (Underline / Strike)
                                if (clip.effects.textDecoration === 'underline' || clip.effects.textDecoration === 'line-through') {
                                    const lm = ctx.measureText(line);
                                    const tdw = lm.width;
                                    ctx.fillRect(-tdw/2, startY + li * lh + (clip.effects.textDecoration === 'underline' ? fontSize*0.4 : -fontSize*0.1), tdw, fontSize*0.08);
                                }
                            });`;
    return content.replace(oldFill, newFill);
}

// And for offCtx:
function replaceOffFillText(content) {
    const oldFill = `for(let i = depth; i > 0; i -= 0.5) {
                                    offCtx.fillText(clip.text, dx * i, dy * i);
                                }
                            }
                            // Drop shadow on offscreen
                            if (clip.effects.shadowEnable) {
                                offCtx.shadowColor = clip.effects.shadowColor || '#000000';
                                offCtx.shadowBlur = clip.effects.shadowBlur || 20;
                                offCtx.shadowOffsetX = clip.effects.shadowX || 0;
                                offCtx.shadowOffsetY = clip.effects.shadowY || 10;
                            }
                            offCtx.fillStyle = clip.effects.fillColor || '#ffffff';
                            offCtx.fillText(clip.text, 0, 0);`;
                            
    const newFill = `for(let i = depth; i > 0; i -= 0.5) {
                                    lines.forEach((line, li) => {
                                        offCtx.fillText(line, dx * i, startY + li * lh + dy * i);
                                    });
                                }
                            }
                            // Drop shadow on offscreen
                            if (clip.effects.shadowEnable) {
                                offCtx.shadowColor = clip.effects.shadowColor || '#000000';
                                offCtx.shadowBlur = clip.effects.shadowBlur || 20;
                                offCtx.shadowOffsetX = clip.effects.shadowX || 0;
                                offCtx.shadowOffsetY = clip.effects.shadowY || 10;
                            }
                            offCtx.fillStyle = clip.effects.fillColor || '#ffffff';
                            lines.forEach((line, li) => {
                                offCtx.fillText(line, 0, startY + li * lh);
                            });`;
    return content.replace(oldFill, newFill);
}

html = replaceFillText(html);
html = replaceOffFillText(html);

// Remove the `onchange="setClipEffect('${clip.id}', 'fontWeight', parseInt(this.value))"` duplicate block since it was replaced.
fs.writeFileSync(file, html, 'utf8');
console.log('Text features added successfully!');
