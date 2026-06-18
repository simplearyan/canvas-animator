const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace `#1f2937` with `#231F20` where it relates to canvas background
content = content.replace(
    'id="canvasColorPicker" class="absolute -top-4 -left-4 w-16 h-16 cursor-pointer opacity-0 z-10" value="#1f2937"',
    'id="canvasColorPicker" class="absolute -top-4 -left-4 w-16 h-16 cursor-pointer opacity-0 z-10" value="#231F20"'
);

content = content.replace(
    '<i data-lucide="palette" class="w-4 h-4 text-surface-600 dark:text-surface-300 pointer-events-none relative z-0" id="canvasColorIcon" style="color: #1f2937;"></i>',
    '<i data-lucide="palette" class="w-4 h-4 text-surface-600 dark:text-surface-300 pointer-events-none relative z-0" id="canvasColorIcon" style="color: #231F20;"></i>'
);

content = content.replace(
    '<div id="canvasAspectWrapper" class="relative rounded-lg shadow-2xl border border-surface-700 overflow-hidden ring-1 ring-white/5 shrink-0" style="background-color: #1f2937;">',
    '<div id="canvasAspectWrapper" class="relative rounded-lg shadow-2xl border border-surface-700 overflow-hidden ring-1 ring-white/5 shrink-0" style="background-color: #231F20;">'
);

content = content.replace(
    "canvasBgColor: '#1f2937',",
    "canvasBgColor: '#231F20',"
);

content = content.replace(
    "ctx.fillStyle = isDark ? '#1f2937' : '#f3f4f6';",
    "ctx.fillStyle = isDark ? '#231F20' : '#f3f4f6';"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Canvas default background updated to #231F20.");
