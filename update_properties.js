const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// Update summary classes to add border-b
content = content.replace(/<summary class="flex items-center justify-between p-3 \${isHorizontal \? '' : 'cursor-pointer'} list-none appearance-none select-none bg-surface-100 dark:bg-surface-800\/80 "/g, 
    `<summary class="flex items-center justify-between p-3 \${isHorizontal ? '' : 'cursor-pointer'} list-none appearance-none select-none bg-surface-100 dark:bg-surface-800/80 border-b border-surface-200 dark:border-surface-700 "`);

// Add icon to Extrude 3D
content = content.replace(
    `<div class="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2">Extrude 3D</div>`,
    `<div class="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2"><i data-lucide="box" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Extrude 3D</div>`
);

// Better icons for Drop Shadow and Animations
content = content.replace(
    `<i data-lucide="layers" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Drop Shadow`,
    `<i data-lucide="copy" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Drop Shadow`
);
content = content.replace(
    `<i data-lucide="zap" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Animations`,
    `<i data-lucide="sparkles" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Animations`
);
content = content.replace(
    `<i data-lucide="type" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Text Content`,
    `<i data-lucide="type" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> Text Content`
);

// In Audio Editor, the inner content of the details is `bg-white dark:bg-surface-800`.
// Since the details wrapper is already `bg-white dark:bg-surface-800`, the inner bg blends in.
// In Thumb Maker, the outer is `bg-white dark:bg-pro-800` and inner is the same but the summary is `bg-pro-100 dark:bg-pro-800/80`.
// Let's change the inner padding area to `bg-surface-50 dark:bg-surface-900/50` for better contrast like a well.

content = content.replace(
    /<div class="p-3 flex flex-col gap-3 bg-white dark:bg-surface-800 flex-1">/g,
    `<div class="p-3 flex flex-col gap-3 bg-surface-50 dark:bg-surface-900/50 flex-1">`
);

content = content.replace(
    /<div class="p-3 flex flex-col gap-2.5 bg-white dark:bg-surface-800 flex-1 \${!fx.extrudeEnable \? 'opacity-50 pointer-events-none' : ''}">/g,
    `<div class="p-3 flex flex-col gap-2.5 bg-surface-50 dark:bg-surface-900/50 flex-1 \${!fx.extrudeEnable ? 'opacity-50 pointer-events-none' : ''}">`
);

content = content.replace(
    /<div class="p-3 flex flex-col gap-2.5 bg-white dark:bg-surface-800 flex-1 \${!shadowEnable \? 'opacity-50 pointer-events-none' : ''}">/g,
    `<div class="p-3 flex flex-col gap-2.5 bg-surface-50 dark:bg-surface-900/50 flex-1 \${!shadowEnable ? 'opacity-50 pointer-events-none' : ''}">`
);

// Remove the redundant `bg-white dark:bg-surface-800` from the Animations div too
content = content.replace(
    /<div class="p-3 flex flex-col gap-3 w-full bg-white dark:bg-surface-800 flex-1">/g,
    `<div class="p-3 flex flex-col gap-3 w-full bg-surface-50 dark:bg-surface-900/50 flex-1">`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Properties panel updated successfully.');
