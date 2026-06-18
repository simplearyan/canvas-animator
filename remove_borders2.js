const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Header border
content = content.replace(
    '<header class="h-14 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between px-2 sm:px-4 shrink-0 z-40 shadow-sm relative w-full gap-2">',
    '<header class="h-14 bg-white dark:bg-surface-800 flex items-center justify-between px-2 sm:px-4 shrink-0 z-40 shadow-sm relative w-full gap-2">'
);

// 2. Inspector panel header border
content = content.replace(
    '<div class="h-10 border-b border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 flex items-center justify-between px-4 shrink-0 shadow-sm sticky top-0 z-20">',
    '<div class="h-10 bg-white dark:bg-surface-800 flex items-center justify-between px-4 shrink-0 shadow-sm sticky top-0 z-20">'
);

// 3. Track lanes border
content = content.replace(
    /el\.className = `flex items-center px-2 border-b border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 relative z-0`;/g,
    'el.className = `flex items-center px-2 bg-surface-50 dark:bg-surface-900 relative z-0`;'
);

// 4. Track clips inner header border
content = content.replace(
    /border-b border-black\/10 z-20 backdrop-blur-sm pointer-events-none/g,
    'z-20 backdrop-blur-sm pointer-events-none'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Borders removed successfully.");
