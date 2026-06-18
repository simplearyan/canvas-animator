const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Font Options
const fontSelectRegex = /<select class="w-full text-xs p-2 pl-3 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-800\/50 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect\('\$\{clip\.id\}', 'fontFamily', this\.value\)">\s*<option value="Inter, sans-serif" \$\{fx\.fontFamily === 'Inter, sans-serif' \? 'selected' : ''\}>Inter<\/option>\s*<option value="Arial, sans-serif" \$\{fx\.fontFamily === 'Arial, sans-serif' \? 'selected' : ''\}>Arial<\/option>\s*<option value="Impact, sans-serif" \$\{fx\.fontFamily === 'Impact, sans-serif' \? 'selected' : ''\}>Impact<\/option>\s*<option value="'JetBrains Mono', monospace" \$\{fx\.fontFamily === "'JetBrains Mono', monospace" \? 'selected' : ''\}>JetBrains Mono<\/option>\s*<option value="'Comic Sans MS', cursive" \$\{fx\.fontFamily === "'Comic Sans MS', cursive" \? 'selected' : ''\}>Comic Sans<\/option>\s*<\/select>/g;

const premiumFonts = `<select class="w-full text-xs p-2 pl-3 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-800/50 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'fontFamily', this.value)">
                                        <option value="Rubik" class="font-rubik font-bold" \${fx.fontFamily === 'Rubik' ? 'selected' : ''}>Rubik (Fireship)</option>
                                        <option value="Montserrat" class="font-montserrat font-bold" \${fx.fontFamily === 'Montserrat' ? 'selected' : ''}>Montserrat (Clean)</option>
                                        <option value="Inter" class="font-inter font-bold" \${fx.fontFamily === 'Inter' ? 'selected' : ''}>Inter (Modern)</option>
                                        <option value="Oswald" class="font-oswald font-bold" \${fx.fontFamily === 'Oswald' ? 'selected' : ''}>Oswald (Tall)</option>
                                        <option value="Bebas Neue" class="font-bebas font-bold" \${fx.fontFamily === 'Bebas Neue' ? 'selected' : ''}>Bebas Neue (Impact)</option>
                                        <option value="Bangers" class="font-bangers font-bold" \${fx.fontFamily === 'Bangers' ? 'selected' : ''}>Bangers (Comic)</option>
                                        <option value="Fredoka" class="font-fredoka font-bold" \${fx.fontFamily === 'Fredoka' ? 'selected' : ''}>Fredoka (Round)</option>
                                        <option value="Lora" class="font-lora font-bold" \${fx.fontFamily === 'Lora' ? 'selected' : ''}>Lora (Serif)</option>
                                        <option value="Plus Jakarta Sans" class="font-sans font-bold" \${fx.fontFamily === 'Plus Jakarta Sans' ? 'selected' : ''}>Jakarta (UI)</option>
                                    </select>`;

content = content.replace(fontSelectRegex, premiumFonts);

// 2. Add Extrude Direction
const extrudeHtmlTarget = /<div class="flex items-center justify-between gap-3">\s*<label class="text-\[10px\] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Color<\/label>\s*<input type="color" value="\$\{fx\.extrudeColor \|\| '#000000'\}" class="w-6 h-6 rounded cursor-pointer border border-surface-300 dark:border-surface-600 p-0 bg-transparent" onchange="setClipEffect\('\$\{clip\.id\}', 'extrudeColor', this\.value\)">\s*<\/div>\s*<div>\s*<div class="flex justify-between items-center mb-1\.5">/g;

const extrudeDirectionHtml = `<div class="flex items-center justify-between gap-3">
                                <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Color</label>
                                <input type="color" value="\${fx.extrudeColor || '#000000'}" class="w-6 h-6 rounded cursor-pointer border border-surface-300 dark:border-surface-600 p-0 bg-transparent" onchange="setClipEffect('\${clip.id}', 'extrudeColor', this.value)">
                            </div>
                            <div class="mt-1">
                                <label class="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-1.5">Direction</label>
                                <select class="w-full text-xs p-2 pl-3 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-800/50 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-surface-800 dark:text-surface-200" onchange="setClipEffect('\${clip.id}', 'extrudeDir', this.value)">
                                    <option value="br" \${(fx.extrudeDir || 'br') === 'br' ? 'selected' : ''}>Bottom Right</option>
                                    <option value="bl" \${fx.extrudeDir === 'bl' ? 'selected' : ''}>Bottom Left</option>
                                    <option value="b" \${fx.extrudeDir === 'b' ? 'selected' : ''}>Bottom</option>
                                </select>
                            </div>
                            <div class="mt-1">
                                <div class="flex justify-between items-center mb-1.5">`;

content = content.replace(extrudeHtmlTarget, extrudeDirectionHtml);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated font list and extrude UI");
