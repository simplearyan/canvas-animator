const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

const startStr = '            let tabs = [];';
const endStr = '            lucide.createIcons();';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `
            const isVis = !clip.hidden;
            if (clip.type === 'audio') {
                headerProperties.innerHTML = \`
                    <div class="flex items-center gap-2 pl-3 shrink-0 max-w-[200px]">
                        <div class="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style="background-color: \${PALETTES[clip.colorIndex].wave}"></div>
                        <span class="text-[12px] font-bold text-surface-700 dark:text-surface-300 truncate">\${clip.title}</span>
                    </div>
                \`;
            } else {
                headerProperties.innerHTML = \`
                    <div class="flex items-center gap-1.5 sm:gap-2 bg-surface-100 dark:bg-surface-800 p-1 rounded-lg border border-surface-200 dark:border-surface-700 shrink-0">
                        <button onclick="handleScaleUp()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Scale Up (+)">
                            <i data-lucide="zoom-in" class="w-4 h-4"></i>
                        </button>
                        <button onclick="handleScaleDown()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Scale Down (-)">
                            <i data-lucide="zoom-out" class="w-4 h-4"></i>
                        </button>
                        <div class="w-px h-4 bg-surface-200 dark:bg-surface-700 mx-0.5"></div>
                        <button onclick="handleRotate()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Rotate (R)">
                            <i data-lucide="rotate-cw" class="w-4 h-4"></i>
                        </button>
                        <button onclick="handleFlipH()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Flip Horizontal (H)">
                            <i data-lucide="flip-horizontal" class="w-4 h-4"></i>
                        </button>
                        <button onclick="handleFlipV()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Flip Vertical (V)">
                            <i data-lucide="flip-vertical" class="w-4 h-4"></i>
                        </button>
                        <div class="w-px h-4 bg-surface-200 dark:bg-surface-700 mx-0.5"></div>
                        <button onclick="handleCenterH()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Center Horizontally (Shift+H)">
                            <i data-lucide="align-horizontal-space-around" class="w-4 h-4"></i>
                        </button>
                        <button onclick="handleCenterV()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Center Vertically (Shift+V)">
                            <i data-lucide="align-vertical-space-around" class="w-4 h-4"></i>
                        </button>
                        <div class="w-px h-4 bg-surface-200 dark:bg-surface-700 mx-0.5"></div>
                        <button onclick="handleToggleVis()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Toggle Visibility (\\\\)">
                            <i data-lucide="\${isVis ? 'eye' : 'eye-off'}" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteSelectedClip()" class="p-1.5 rounded-md text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30" title="Delete (Del/Backspace)">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <div class="hidden lg:flex items-center gap-2 pl-3 border-l border-surface-200 dark:border-surface-700 shrink-0 max-w-[150px]">
                        <div class="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style="background-color: \${PALETTES[clip.colorIndex].wave}"></div>
                        <span class="text-[11px] font-semibold text-surface-700 dark:text-surface-300 truncate">\${clip.title}</span>
                    </div>
                \`;
            }
            
            lucide.createIcons();`;
    
    content = content.substring(0, startIdx) + replacement.trim() + content.substring(endIdx + endStr.length);
    fs.writeFileSync(file, content);
    console.log('UI Patched successfully!');
} else {
    console.log('Could not find start or end index!');
}
