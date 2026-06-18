const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// Update details container classes
content = content.replace(
    /class="group bg-white dark:bg-surface-900\/60 backdrop-blur-md border border-surface-200 dark:border-white\/5 shadow-sm rounded-xl shrink-0 \$\{isHorizontal \? 'w-\[300px\]' : 'w-full'\}"/g,
    `class="group bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-md rounded-xl shrink-0 \$\{isHorizontal ? 'w-[280px]' : 'w-full'\} overflow-hidden"`
);

// Update details container for Text Content
content = content.replace(
    /<details class="group bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-md rounded-xl shrink-0 \$\{isHorizontal \? 'w-\[280px\]' : 'w-full'\} overflow-hidden" open>/g,
    `<details class="group bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-md rounded-xl shrink-0 \$\{isHorizontal ? 'w-[280px]' : 'w-full'\} overflow-hidden flex flex-col" open>`
);

// Update summary classes and chevron
content = content.replace(
    /<summary class="flex items-center justify-between p-3 cursor-pointer list-none appearance-none select-none">/g,
    `<summary class="flex items-center justify-between p-3 \$\{isHorizontal ? '' : 'cursor-pointer'\} list-none appearance-none select-none bg-surface-50 dark:bg-surface-800/80 border-b border-surface-100 dark:border-surface-700" onclick="\$\{isHorizontal ? 'event.preventDefault();' : ''\}">`
);

// Update chevron down to be hidden if horizontal
content = content.replace(
    /<i data-lucide="chevron-down" class="w-4 h-4 text-surface-500 transition-transform group-open:rotate-180"><\/i>/g,
    `\$\{isHorizontal ? '' : '<i data-lucide="chevron-down" class="w-4 h-4 text-surface-500 transition-transform group-open:rotate-180"></i>'\}`
);

// Specifically for Extrude 3D and Drop Shadow where chevron is inside a div
content = content.replace(
    /<div class="flex items-center gap-2">\s*<label[\s\S]*?<\/label>\s*<i data-lucide="chevron-down" class="w-4 h-4 text-surface-500 transition-transform group-open:rotate-180"><\/i>\s*<\/div>/g,
    (match) => {
        return match.replace(
            /<i data-lucide="chevron-down" class="w-4 h-4 text-surface-500 transition-transform group-open:rotate-180"><\/i>/,
            `\$\{isHorizontal ? '' : '<i data-lucide="chevron-down" class="w-4 h-4 text-surface-500 transition-transform group-open:rotate-180"></i>'\}`
        );
    }
);

// Update inner div backgrounds
content = content.replace(
    /<div class="p-3 pt-0 flex flex-col gap-3">/g,
    `<div class="p-3 flex flex-col gap-3 bg-white dark:bg-surface-900/50 flex-1">`
);

content = content.replace(
    /<div class="p-3 pt-0 flex flex-col gap-2\.5 \$\{\!fx\.extrudeEnable \? 'opacity-50 pointer-events-none' : ''\}">/g,
    `<div class="p-3 flex flex-col gap-2.5 bg-white dark:bg-surface-900/50 flex-1 \$\{!fx.extrudeEnable ? 'opacity-50 pointer-events-none' : ''\}">`
);

content = content.replace(
    /<div class="p-3 pt-0 flex flex-col gap-2\.5 \$\{\!shadowEnable \? 'opacity-50 pointer-events-none' : ''\}">/g,
    `<div class="p-3 flex flex-col gap-2.5 bg-white dark:bg-surface-900/50 flex-1 \$\{!shadowEnable ? 'opacity-50 pointer-events-none' : ''\}">`
);

content = content.replace(
    /<div class="p-3 pt-0 flex flex-col gap-3 w-full">/g,
    `<div class="p-3 flex flex-col gap-3 w-full bg-white dark:bg-surface-900/50 flex-1">`
);

// Make text area and inputs darker
content = content.replace(
    /class="w-full h-20 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700/g,
    `class="w-full h-20 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-600 shadow-inner`
);

content = content.replace(
    /bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700/g,
    `bg-surface-50 dark:bg-surface-950 border border-surface-300 dark:border-surface-600 shadow-inner`
);

content = content.replace(
    /bg-surface-50 dark:bg-surface-800 border border-surface-300 dark:border-surface-700/g,
    `bg-surface-50 dark:bg-surface-950 border border-surface-300 dark:border-surface-600 shadow-inner`
);

// Update inner block sections (Animations In, Out, Loop)
content = content.replace(
    /class="bg-surface-50 dark:bg-surface-800 p-2\.5 rounded-lg border border-surface-200 dark:border-surface-700 flex flex-col gap-2 w-full"/g,
    `class="bg-surface-50 dark:bg-surface-800/80 p-2.5 rounded-lg border border-surface-200 dark:border-surface-700 shadow-sm flex flex-col gap-2 w-full"`
);

// High Contrast Sliders need better track colors if dark mode
// We already have `sliderBg = isDarkMode ? '#262626' : '#e5e5e5';`. We can change it for deeper dark mode.
content = content.replace(
    /const sliderBg = isDarkMode \? '#262626' : '#e5e5e5';/g,
    `const sliderBg = isDarkMode ? '#404040' : '#e5e5e5';`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Done replacing inspector styles.');
