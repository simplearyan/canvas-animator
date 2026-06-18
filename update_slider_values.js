const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

const oldClass = 'text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded';
const newClass = 'text-xs font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-2 py-0.5 rounded shadow-sm';

content = content.replaceAll(oldClass, newClass);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Slider values styling updated.");
