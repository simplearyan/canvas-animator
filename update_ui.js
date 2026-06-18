const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// Update <details> container classes
content = content.replace(/class="group bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-md rounded-xl shrink-0/g,
    'class="group bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 shadow-sm rounded-lg shrink-0');

// Update <summary> container classes
content = content.replace(/class="flex items-center justify-between p-3 \$\{isHorizontal \? '' : 'cursor-pointer'\} list-none appearance-none select-none bg-surface-50 dark:bg-surface-800\/80 border-b border-surface-100 dark:border-surface-700"/g,
    'class="flex items-center justify-between p-3 ${isHorizontal ? \'\' : \'cursor-pointer\'} list-none appearance-none select-none bg-surface-100 dark:bg-surface-800/80 border-b border-surface-300 dark:border-surface-700"');

// Update Typography of <h4> to <div> and text sizes
// Text Content
content = content.replace(/<h4 class="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider flex items-center gap-1\.5"><i data-lucide="type" class="w-3\.5 h-3\.5 text-brand-500"><\/i> Text Content<\/h4>/g,
    '<div class="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2"><i data-lucide="type" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Text Content</div>');

// Extrude 3D
content = content.replace(/<h4 class="text-\[11px\] font-bold text-surface-900 dark:text-white uppercase tracking-wider flex items-center gap-1\.5">Extrude 3D<\/h4>/g,
    '<div class="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2">Extrude 3D</div>');

// Drop Shadow
content = content.replace(/<h4 class="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider flex items-center gap-1\.5"><i data-lucide="layers" class="w-3\.5 h-3\.5 text-brand-500"><\/i> Drop Shadow<\/h4>/g,
    '<div class="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2"><i data-lucide="layers" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Drop Shadow</div>');

// Animations
content = content.replace(/<h4 class="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider flex items-center gap-1\.5"><i data-lucide="zap" class="w-3\.5 h-3\.5 text-brand-500"><\/i> Animations<\/h4>/g,
    '<div class="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2"><i data-lucide="zap" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Animations</div>');

// Update Panel Bodies
content = content.replace(/bg-white dark:bg-surface-900\/50/g, 'bg-white dark:bg-surface-800');

// Update Textareas
content = content.replace(/bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-600 shadow-inner/g,
    'bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600');

// Update Selects
content = content.replace(/bg-surface-50 dark:bg-surface-950 border border-surface-300 dark:border-surface-600 shadow-inner/g,
    'bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600');

fs.writeFileSync(filePath, content, 'utf8');
console.log('UI redesign applied successfully!');
