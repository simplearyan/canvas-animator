const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix the top properties header
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="btnToggleWidth"')) {
        lines[i] = lines[i].replace('text-brand-600 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-400', 'p-1.5 rounded text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors');
    }
    if (lines[i].includes('id="iconWidth"')) {
        lines[i] = lines[i].replace('w-5 h-5 stroke-[2.5]', 'w-4 h-4');
    }
    if (lines[i].includes('id="btnDockInspector"')) {
        lines[i] = lines[i].replace('text-brand-600 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-400', 'p-1.5 rounded text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors');
    }
    if (lines[i].includes('id="iconDock"')) {
        lines[i] = lines[i].replace('w-5 h-5 stroke-[2.5]', 'w-4 h-4').replace('data-lucide="move"', 'data-lucide="monitor"');
    }
    if (lines[i].includes('id="btnCloseInspector"')) {
        lines[i] = lines[i].replace('text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white', 'p-1.5 rounded text-surface-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors');
    }
    if (lines[i].includes('id="iconCloseInspector"')) {
        lines[i] = lines[i].replace('w-5 h-5 stroke-[2.5]', 'w-4 h-4').replace('data-lucide="chevron-right"', 'data-lucide="x"');
    }
    // Also the gap for the flex container
    if (lines[i].includes('class="flex items-center gap-3"') && i > 430 && i < 440) {
        lines[i] = lines[i].replace('gap-3', 'gap-1');
    }
}
content = lines.join('\n');

// 2. Update JavaScript setAttributes for dock and close
content = content.replace(/iconDock.setAttribute\('data-lucide', 'panel-bottom'\);/g, "iconDock.setAttribute('data-lucide', 'monitor-down');");
content = content.replace(/iconDock.setAttribute\('data-lucide', 'panel-top'\);/g, "iconDock.setAttribute('data-lucide', 'monitor-up');");
content = content.replace(/iconDock.setAttribute\('data-lucide', 'panel-left'\);/g, "iconDock.setAttribute('data-lucide', 'monitor');");
content = content.replace(/iconDock.setAttribute\('data-lucide', 'panel-right'\);/g, "iconDock.setAttribute('data-lucide', 'monitor-smartphone');");

content = content.replace(/iconCloseInspector.setAttribute\('data-lucide', 'chevron-right'\);/g, "");
content = content.replace(/iconCloseInspector.setAttribute\('data-lucide', 'chevron-left'\);/g, "");
content = content.replace(/iconCloseInspector.setAttribute\('data-lucide', 'chevron-down'\);/g, "");
content = content.replace(/iconCloseInspector.setAttribute\('data-lucide', 'chevron-up'\);/g, "");


// 3. Update Color Pickers
// Fill Color
const oldFillColor = `<div class="flex items-center justify-between gap-3 mt-1">
                                    <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Fill Color</label>
                                    <input type="color" value="\${fx.fillColor || '#ffffff'}" class="w-6 h-6 rounded cursor-pointer border border-surface-200 dark:border-surface-700 p-0 bg-transparent" onchange="setClipEffect('\${clip.id}', 'fillColor', this.value)">
                                </div>`;
const newFillColor = `<div class="flex items-center justify-between gap-3 mt-1">
                                    <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Fill Color</label>
                                </div>
                                <div class="relative flex items-center bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded p-1.5 cursor-pointer shadow-inner w-full mt-1">
                                    <div class="w-6 h-6 rounded shadow-sm" style="background-color: \${fx.fillColor || '#ffffff'}"></div>
                                    <span class="ml-3 font-mono font-bold text-xs text-surface-700 dark:text-surface-200 uppercase">\${fx.fillColor || '#ffffff'}</span>
                                    <input type="color" value="\${fx.fillColor || '#ffffff'}" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" oninput="setClipEffect('\${clip.id}', 'fillColor', this.value); this.previousElementSibling.textContent = this.value; this.previousElementSibling.previousElementSibling.style.backgroundColor = this.value;">
                                </div>`;
content = content.split(oldFillColor).join(newFillColor);

// Extrude Color
const oldExtrudeColor = `<div class="flex items-center justify-between gap-3">
                                <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Color</label>
                                <input type="color" value="\${fx.extrudeColor || '#000000'}" class="w-6 h-6 rounded cursor-pointer border border-surface-200 dark:border-surface-700 p-0 bg-transparent" onchange="setClipEffect('\${clip.id}', 'extrudeColor', this.value)">
                            </div>`;
const newExtrudeColor = `<div>
                                <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1">Color</label>
                                <div class="relative flex items-center bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded p-1.5 cursor-pointer shadow-inner w-full">
                                    <div class="w-6 h-6 rounded shadow-sm" style="background-color: \${fx.extrudeColor || '#000000'}"></div>
                                    <span class="ml-3 font-mono font-bold text-xs text-surface-700 dark:text-surface-200 uppercase">\${fx.extrudeColor || '#000000'}</span>
                                    <input type="color" value="\${fx.extrudeColor || '#000000'}" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" oninput="setClipEffect('\${clip.id}', 'extrudeColor', this.value); this.previousElementSibling.textContent = this.value; this.previousElementSibling.previousElementSibling.style.backgroundColor = this.value;">
                                </div>
                            </div>`;
content = content.split(oldExtrudeColor).join(newExtrudeColor);

// Shadow Color
const oldShadowColor = `<div class="flex items-center justify-between gap-3 mb-1">
                            <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Shadow Color</label>
                            <input type="color" value="\${shadowColor}" class="w-6 h-6 rounded cursor-pointer border border-surface-200 dark:border-surface-700 p-0 bg-transparent" onchange="setClipEffect('\${clip.id}', 'shadowColor', this.value)">
                        </div>`;
const newShadowColor = `<div>
                            <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1">Shadow Color</label>
                            <div class="relative flex items-center bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded p-1.5 cursor-pointer shadow-inner w-full mb-2">
                                <div class="w-6 h-6 rounded shadow-sm" style="background-color: \${shadowColor}"></div>
                                <span class="ml-3 font-mono font-bold text-xs text-surface-700 dark:text-surface-200 uppercase">\${shadowColor}</span>
                                <input type="color" value="\${shadowColor}" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" oninput="setClipEffect('\${clip.id}', 'shadowColor', this.value); this.previousElementSibling.textContent = this.value; this.previousElementSibling.previousElementSibling.style.backgroundColor = this.value;">
                            </div>
                        </div>`;
content = content.split(oldShadowColor).join(newShadowColor);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed properties header and color pickers!');
