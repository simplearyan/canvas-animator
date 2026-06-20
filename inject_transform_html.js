const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

const transformHTMLInjection = `
            const scaleVal = fx.scale !== undefined ? fx.scale : 1;
            const rotateVal = fx.rotate !== undefined ? fx.rotate : 0;
            const radiusVal = fx.borderRadius !== undefined ? fx.borderRadius : 0;

            const transformHTML = (clip.type === 'image' || clip.type === 'video' || clip.type === 'text') ? \\\`
                <details class="group bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 shadow-sm rounded-lg shrink-0 \\\${isHorizontal ? 'w-[280px]' : 'w-full'} overflow-hidden flex flex-col" open>
                    <summary class="flex items-center justify-between p-3 \\\${isHorizontal ? '' : 'cursor-pointer'} list-none appearance-none select-none bg-surface-100 dark:bg-surface-800/80 border-b border-surface-200 dark:border-surface-700 " onclick="\\\${isHorizontal ? 'event.preventDefault();' : ''}">
                        <div class="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2"><i data-lucide="maximize" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Transform</div>
                        \\\${isHorizontal ? '' : '<i data-lucide="chevron-down" class="w-4 h-4 text-surface-500 transition-transform group-open:rotate-180"></i>'}
                    </summary>
                    <div class="p-3 flex flex-col gap-2.5 bg-surface-50 dark:bg-surface-900/50 flex-1">
                        <div>
                            <div class="flex justify-between items-center mb-1.5">
                                <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Scale</label>
                                <span class="text-xs font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-2 py-0.5 rounded shadow-sm">\\\${Number(scaleVal).toFixed(2)}x</span>
                            </div>
                            <input type="range" min="0" max="3" step="0.05" value="\\\${scaleVal}" class="w-full custom-slider" oninput="setClipEffect('\\\${clip.id}', 'scale', this.value); this.previousElementSibling.querySelector('span').textContent = Number(this.value).toFixed(2) + 'x'; this.style.background = 'linear-gradient(to right, \\\${sliderFill} ' + (this.value/this.max)*100 + '%, \\\${sliderBg} ' + (this.value/this.max)*100 + '%)'; drawCanvas();">
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1.5">
                                <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Rotate</label>
                                <span class="text-xs font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-2 py-0.5 rounded shadow-sm">\\\${rotateVal}°</span>
                            </div>
                            <input type="range" min="0" max="360" step="1" value="\\\${rotateVal}" class="w-full custom-slider" oninput="setClipEffect('\\\${clip.id}', 'rotate', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + '°'; this.style.background = 'linear-gradient(to right, \\\${sliderFill} ' + (this.value/this.max)*100 + '%, \\\${sliderBg} ' + (this.value/this.max)*100 + '%)'; drawCanvas();">
                        </div>
                        \\\${clip.type !== 'text' ? \\\`
                        <div>
                            <div class="flex justify-between items-center mb-1.5">
                                <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Border Radius</label>
                                <span class="text-xs font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-2 py-0.5 rounded shadow-sm">\\\${radiusVal}px</span>
                            </div>
                            <input type="range" min="0" max="200" step="1" value="\\\${radiusVal}" class="w-full custom-slider" oninput="setClipEffect('\\\${clip.id}', 'borderRadius', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + 'px'; this.style.background = 'linear-gradient(to right, \\\${sliderFill} ' + (this.value/this.max)*100 + '%, \\\${sliderBg} ' + (this.value/this.max)*100 + '%)'; drawCanvas();">
                        </div>
                        \\\` : ''}
                    </div>
                </details>
            \\\` : '';
`;

if (!content.includes('const transformHTML =')) {
    content = content.replace(
        /const shadowHTML = `/g,
        transformHTMLInjection + "\n            const shadowHTML = `"
    );
}

const targetAssignment = /sidebarContent\.innerHTML = \(isText \? textHTML : ''\) \+ shadowHTML \+ animHTML;/;
if (content.match(targetAssignment)) {
    content = content.replace(
        targetAssignment,
        "sidebarContent.innerHTML = transformHTML + (isText ? textHTML : '') + shadowHTML + animHTML;"
    );
}

// Since I fixed the early return earlier, and I modified the innerHTML logic previously:
// Let me verify if my previous patch had: 
// `sidebarContent.innerHTML = (isText ? textHTML : '') + shadowHTML + animHTML;`
// It did! So replacing it with transformHTML + ... should work perfectly.

fs.writeFileSync(file, content);
console.log('Transform HTML injected!');
