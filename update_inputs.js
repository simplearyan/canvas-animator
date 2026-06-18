const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace Font Select
content = content.replace(
    /<div class="flex items-center justify-between gap-3">\s*<span class="text-\[11px\] font-semibold text-surface-500 dark:text-surface-400 w-12">Font<\/span>\s*<select class="flex-1 bg-white dark:bg-surface-800\/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white text-xs rounded px-2 py-1\.5 outline-none sidebar-select" onchange="setClipEffect\('\$\{clip\.id\}', 'fontFamily', this\.value\)">/g,
    `<div>
                                    <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Font</label>
                                    <select class="w-full text-xs p-2 pl-3 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-800/50 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'fontFamily', this.value)">`
);
content = content.replace(
    /<\/select>\s*<\/div>\s*<div class="flex items-center justify-between gap-3">\s*<span class="text-\[11px\] font-semibold text-surface-500 dark:text-surface-400 w-12">Weight<\/span>\s*<select class="flex-1 bg-white dark:bg-surface-800\/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white text-xs rounded px-2 py-1\.5 outline-none sidebar-select" onchange="setClipEffect\('\$\{clip\.id\}', 'fontWeight', parseInt\(this\.value\)\)">/g,
    `</select>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Weight</label>
                                    <select class="w-full text-xs p-2 pl-3 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-800/50 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'fontWeight', parseInt(this.value))">`
);

// Replace Fill Color
content = content.replace(
    /<div class="flex items-center justify-between gap-3">\s*<span class="text-\[11px\] font-semibold text-surface-500 dark:text-surface-400 w-12">Fill<\/span>\s*<input type="color" value="\$\{fx\.fillColor \|\| '#ffffff'\}" class="w-full h-6 rounded cursor-pointer border-0 p-0 bg-transparent" onchange="setClipEffect\('\$\{clip\.id\}', 'fillColor', this\.value\)">\s*<\/div>/g,
    `<div class="flex items-center justify-between gap-3 mt-1">
                                    <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Fill Color</label>
                                    <input type="color" value="\${fx.fillColor || '#ffffff'}" class="w-6 h-6 rounded cursor-pointer border border-surface-300 dark:border-surface-600 p-0 bg-transparent" onchange="setClipEffect('\${clip.id}', 'fillColor', this.value)">
                                </div>`
);

// Replace Extrude 3D Color
content = content.replace(
    /<div class="flex items-center justify-between gap-3">\s*<span class="text-\[11px\] font-semibold text-surface-500 dark:text-surface-400 w-12">Color<\/span>\s*<input type="color" value="\$\{fx\.extrudeColor \|\| '#000000'\}" class="w-full h-6 rounded cursor-pointer border-0 p-0 bg-transparent" onchange="setClipEffect\('\$\{clip\.id\}', 'extrudeColor', this\.value\)">\s*<\/div>/g,
    `<div class="flex items-center justify-between gap-3">
                                <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Color</label>
                                <input type="color" value="\${fx.extrudeColor || '#000000'}" class="w-6 h-6 rounded cursor-pointer border border-surface-300 dark:border-surface-600 p-0 bg-transparent" onchange="setClipEffect('\${clip.id}', 'extrudeColor', this.value)">
                            </div>`
);

// Replace Extrude 3D Depth
content = content.replace(
    /<div class="flex items-center justify-between gap-3">\s*<span class="text-\[11px\] font-semibold text-surface-500 dark:text-surface-400 w-12">Depth<\/span>\s*<input type="range" min="1" max="50" value="\$\{fx\.extrudeDepth \|\| 5\}" class="flex-1 custom-slider" oninput="setClipEffect\('\$\{clip\.id\}', 'extrudeDepth', this\.value\); this\.style\.background = 'linear-gradient\(to right, \$\{sliderFill\} ' \+ \(this\.value\/this\.max\)\*100 \+ '%, \$\{sliderBg\} ' \+ \(this\.value\/this\.max\)\*100 \+ '%\)'">\s*<span class="text-\[10px\] font-mono font-bold text-surface-900 dark:text-white w-6 text-right">\$\{fx\.extrudeDepth \|\| 5\}<\/span>\s*<\/div>/g,
    `<div>
                                <div class="flex justify-between items-center mb-1.5">
                                    <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Depth</label>
                                    <span class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">\${fx.extrudeDepth || 5}</span>
                                </div>
                                <input type="range" min="1" max="50" value="\${fx.extrudeDepth || 5}" class="w-full custom-slider" oninput="setClipEffect('\${clip.id}', 'extrudeDepth', this.value); this.previousElementSibling.querySelector('span').textContent = this.value; this.style.background = 'linear-gradient(to right, \${sliderFill} ' + (this.value/this.max)*100 + '%, \${sliderBg} ' + (this.value/this.max)*100 + '%)'">
                            </div>`
);

// Replace Drop Shadow Color
content = content.replace(
    /<div class="flex items-center justify-between gap-3">\s*<span class="text-\[11px\] font-semibold text-surface-500 dark:text-surface-400 w-12">Color<\/span>\s*<input type="color" value="\$\{shadowColor\}" class="w-full h-6 rounded cursor-pointer border-0 p-0 bg-transparent" onchange="setClipEffect\('\$\{clip\.id\}', 'shadowColor', this\.value\)">\s*<\/div>/g,
    `<div class="flex items-center justify-between gap-3 mb-1">
                            <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Shadow Color</label>
                            <input type="color" value="\${shadowColor}" class="w-6 h-6 rounded cursor-pointer border border-surface-300 dark:border-surface-600 p-0 bg-transparent" onchange="setClipEffect('\${clip.id}', 'shadowColor', this.value)">
                        </div>`
);

// Replace Drop Shadow Blur
content = content.replace(
    /<div class="flex items-center justify-between gap-3">\s*<span class="text-\[11px\] font-semibold text-surface-500 dark:text-surface-400 w-12">Blur<\/span>\s*<input type="range" min="0" max="100" value="\$\{shadowBlur\}" class="flex-1 custom-slider" oninput="setClipEffect\('\$\{clip\.id\}', 'shadowBlur', this\.value\); this\.style\.background = 'linear-gradient\(to right, \$\{sliderFill\} ' \+ \(this\.value\/this\.max\)\*100 \+ '%, \$\{sliderBg\} ' \+ \(this\.value\/this\.max\)\*100 \+ '%\)'">\s*<span class="text-\[10px\] font-mono font-bold text-surface-900 dark:text-white w-6 text-right">\$\{shadowBlur\}<\/span>\s*<\/div>/g,
    `<div>
                            <div class="flex justify-between items-center mb-1.5">
                                <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Blur</label>
                                <span class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">\${shadowBlur}</span>
                            </div>
                            <input type="range" min="0" max="100" value="\${shadowBlur}" class="w-full custom-slider" oninput="setClipEffect('\${clip.id}', 'shadowBlur', this.value); this.previousElementSibling.querySelector('span').textContent = this.value; this.style.background = 'linear-gradient(to right, \${sliderFill} ' + (this.value/this.max)*100 + '%, \${sliderBg} ' + (this.value/this.max)*100 + '%)'">
                        </div>`
);

// Replace Drop Shadow Off X
content = content.replace(
    /<div class="flex items-center justify-between gap-3">\s*<span class="text-\[11px\] font-semibold text-surface-500 dark:text-surface-400 w-12">Off X<\/span>\s*<input type="range" min="-100" max="100" value="\$\{shadowX\}" class="flex-1 custom-slider" oninput="setClipEffect\('\$\{clip\.id\}', 'shadowX', this\.value\); this\.style\.background = 'linear-gradient\(to right, \$\{sliderFill\} ' \+ \(\(this\.value-\(-100\)\)\/200\)\*100 \+ '%, \$\{sliderBg\} ' \+ \(\(this\.value-\(-100\)\)\/200\)\*100 \+ '%\)'">\s*<span class="text-\[10px\] font-mono font-bold text-surface-900 dark:text-white w-6 text-right">\$\{shadowX\}<\/span>\s*<\/div>/g,
    `<div>
                            <div class="flex justify-between items-center mb-1.5">
                                <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Offset X</label>
                                <span class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">\${shadowX}</span>
                            </div>
                            <input type="range" min="-100" max="100" value="\${shadowX}" class="w-full custom-slider" oninput="setClipEffect('\${clip.id}', 'shadowX', this.value); this.previousElementSibling.querySelector('span').textContent = this.value; this.style.background = 'linear-gradient(to right, \${sliderFill} ' + ((this.value-(-100))/200)*100 + '%, \${sliderBg} ' + ((this.value-(-100))/200)*100 + '%)'">
                        </div>`
);

// Replace Drop Shadow Off Y
content = content.replace(
    /<div class="flex items-center justify-between gap-3">\s*<span class="text-\[11px\] font-semibold text-surface-500 dark:text-surface-400 w-12">Off Y<\/span>\s*<input type="range" min="-100" max="100" value="\$\{shadowY\}" class="flex-1 custom-slider" oninput="setClipEffect\('\$\{clip\.id\}', 'shadowY', this\.value\); this\.style\.background = 'linear-gradient\(to right, \$\{sliderFill\} ' \+ \(\(this\.value-\(-100\)\)\/200\)\*100 \+ '%, \$\{sliderBg\} ' \+ \(\(this\.value-\(-100\)\)\/200\)\*100 \+ '%\)'">\s*<span class="text-\[10px\] font-mono font-bold text-surface-900 dark:text-white w-6 text-right">\$\{shadowY\}<\/span>\s*<\/div>/g,
    `<div>
                            <div class="flex justify-between items-center mb-1.5">
                                <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Offset Y</label>
                                <span class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">\${shadowY}</span>
                            </div>
                            <input type="range" min="-100" max="100" value="\${shadowY}" class="w-full custom-slider" oninput="setClipEffect('\${clip.id}', 'shadowY', this.value); this.previousElementSibling.querySelector('span').textContent = this.value; this.style.background = 'linear-gradient(to right, \${sliderFill} ' + ((this.value-(-100))/200)*100 + '%, \${sliderBg} ' + ((this.value-(-100))/200)*100 + '%)'">
                        </div>`
);

// AnimIn Select
content = content.replace(
    /<select class="w-full bg-white dark:bg-surface-800\/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white text-xs rounded px-2 py-1\.5 outline-none sidebar-select" onchange="setClipEffect\('\$\{clip\.id\}', 'animIn', this\.value\); updateSidebarPanel\(\);\">/g,
    `<select class="w-full text-xs p-2 pl-3 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-800/50 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'animIn', this.value); updateSidebarPanel();">`
);

// AnimIn Slider
content = content.replace(
    /<div class="flex items-center justify-between gap-2 mt-1 \$\{animIn === 'none' \? 'hidden' : ''\}">\s*<i data-lucide="clock" class="w-3 h-3 text-surface-400 shrink-0"><\/i>\s*<input type="range" min="0\.1" max="5\.0" step="0\.1" value="\$\{animInDur\}" class="flex-1 custom-slider w-full" oninput="setClipEffect\('\$\{clip\.id\}', 'animInDur', this\.value\); this\.nextElementSibling\.textContent=this\.value\+'s'; this\.style\.background = 'linear-gradient\(to right, \$\{sliderFill\} ' \+ \(this\.value\/this\.max\)\*100 \+ '%, \$\{sliderBg\} ' \+ \(this\.value\/this\.max\)\*100 \+ '%\)'">\s*<span class="text-\[10px\] font-mono font-bold text-surface-900 dark:text-white w-8 text-right shrink-0">\$\{animInDur\}s<\/span>\s*<\/div>/g,
    `<div class="mt-3 \${animIn === 'none' ? 'hidden' : ''}">
                                <div class="flex justify-between items-center mb-1.5">
                                    <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> Duration</label>
                                    <span class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">\${animInDur}s</span>
                                </div>
                                <input type="range" min="0.1" max="5.0" step="0.1" value="\${animInDur}" class="w-full custom-slider" oninput="setClipEffect('\${clip.id}', 'animInDur', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + 's'; this.style.background = 'linear-gradient(to right, \${sliderFill} ' + (this.value/this.max)*100 + '%, \${sliderBg} ' + (this.value/this.max)*100 + '%)'">
                            </div>`
);

// AnimOut Select
content = content.replace(
    /<select class="w-full bg-white dark:bg-surface-800\/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white text-xs rounded px-2 py-1\.5 outline-none sidebar-select" onchange="setClipEffect\('\$\{clip\.id\}', 'animOut', this\.value\); updateSidebarPanel\(\);\">/g,
    `<select class="w-full text-xs p-2 pl-3 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-800/50 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'animOut', this.value); updateSidebarPanel();">`
);

// AnimOut Slider
content = content.replace(
    /<div class="flex items-center justify-between gap-2 mt-1 \$\{animOut === 'none' \? 'hidden' : ''\}">\s*<i data-lucide="clock" class="w-3 h-3 text-surface-400 shrink-0"><\/i>\s*<input type="range" min="0\.1" max="5\.0" step="0\.1" value="\$\{animOutDur\}" class="flex-1 custom-slider w-full" oninput="setClipEffect\('\$\{clip\.id\}', 'animOutDur', this\.value\); this\.nextElementSibling\.textContent=this\.value\+'s'; this\.style\.background = 'linear-gradient\(to right, \$\{sliderFill\} ' \+ \(this\.value\/this\.max\)\*100 \+ '%, \$\{sliderBg\} ' \+ \(this\.value\/this\.max\)\*100 \+ '%\)'">\s*<span class="text-\[10px\] font-mono font-bold text-surface-900 dark:text-white w-8 text-right shrink-0">\$\{animOutDur\}s<\/span>\s*<\/div>/g,
    `<div class="mt-3 \${animOut === 'none' ? 'hidden' : ''}">
                                <div class="flex justify-between items-center mb-1.5">
                                    <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> Duration</label>
                                    <span class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">\${animOutDur}s</span>
                                </div>
                                <input type="range" min="0.1" max="5.0" step="0.1" value="\${animOutDur}" class="w-full custom-slider" oninput="setClipEffect('\${clip.id}', 'animOutDur', this.value); this.previousElementSibling.querySelector('span').textContent = this.value + 's'; this.style.background = 'linear-gradient(to right, \${sliderFill} ' + (this.value/this.max)*100 + '%, \${sliderBg} ' + (this.value/this.max)*100 + '%)'">
                            </div>`
);

// AnimLoop Select
content = content.replace(
    /<select class="w-full bg-white dark:bg-surface-800\/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white text-xs rounded px-2 py-1\.5 outline-none sidebar-select" onchange="setClipEffect\('\$\{clip\.id\}', 'animLoop', this\.value\)">/g,
    `<select class="w-full text-xs p-2 pl-3 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-800/50 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'animLoop', this.value)">`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Sliders and selects updated successfully!');
