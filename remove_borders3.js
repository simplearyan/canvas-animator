const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Ruler border
content = content.replace(
    '<div id="rulerWrapper" class="h-7 border-b border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 sticky top-0 z-30 shrink-0 shadow-sm min-w-full overflow-visible">',
    '<div id="rulerWrapper" class="h-7 bg-white dark:bg-surface-800 sticky top-0 z-30 shrink-0 shadow-sm min-w-full overflow-visible">'
);

// 2. Accordion headers border
// They appear multiple times, e.g., Text Content, Font, Extrude 3D, Drop Shadow, Animations
content = content.replace(
    /border-b border-surface-300 dark:border-surface-700/g,
    ''
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Ruler and accordion borders removed.");
