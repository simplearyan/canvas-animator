const fs = require('fs');

let html = fs.readFileSync('audio-editor ✅✅/studiopro_editor_text.html', 'utf8');

// Replace the 4 format labels
const formatOptions = [
    { value: 'video', title: 'MP4 Video', sub: 'Standard web video' },
    { value: 'gif', title: 'GIF Animation', sub: 'Looping image sequence' },
    { value: 'audio-webm', title: 'Audio (.webm)', sub: 'WebM audio format' },
    { value: 'audio-wav', title: 'WAV Audio', sub: 'Uncompressed audio' }
];

let startGrid = html.indexOf('<div class="grid grid-cols-2 gap-2">', html.indexOf('name="exportFormat"')) - 50;
let endGrid = html.indexOf('</div>', html.indexOf('name="exportFormat"')) + 200; // rough bound

// Find the precise start and end of the grid block
startGrid = html.indexOf('<div class="grid grid-cols-2 gap-2">', html.indexOf('Export Media'));
endGrid = html.indexOf('</div>', html.indexOf('</label>', startGrid + 500)) + 6;

if (startGrid !== -1 && endGrid !== -1) {
    let newGrid = `<div class="grid grid-cols-2 gap-2">\n`;
    
    formatOptions.forEach((opt, index) => {
        const checked = index === 0 ? ' checked' : '';
        newGrid += `                        <label class="cursor-pointer">
                            <input type="radio" name="exportFormat" value="${opt.value}" class="peer sr-only"${checked}>
                            <div class="p-3 border border-surface-200 dark:border-surface-700 rounded-lg peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-700 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors shadow-sm text-surface-900 dark:text-surface-300 peer-checked:text-brand-700 dark:peer-checked:text-white">
                                <div class="font-bold text-sm mb-0.5">${opt.title}</div>
                                <div class="text-[10px] opacity-70">${opt.sub}</div>
                            </div>
                        </label>\n`;
    });
    
    newGrid += `                    </div>`;
    
    let oldBlock = html.substring(startGrid, endGrid);
    // Find the exact end of the block properly by counting divs or just string replacement
    // Actually, since I know exactly what's inside, I will use regex or simple replacement
}

// Alternative approach: Replace specific classes globally in the file
html = html.replace(/dark:peer-checked:bg-brand-900/g, 'dark:peer-checked:bg-brand-700 text-surface-900 dark:text-surface-300 peer-checked:text-brand-700 dark:peer-checked:text-white');
html = html.replace(/<div class="font-bold text-sm text-surface-900 dark:text-white mb-0.5">/g, '<div class="font-bold text-sm mb-0.5">');
html = html.replace(/<div class="text-\[10px\] text-surface-500">/g, '<div class="text-[10px] opacity-70">');


fs.writeFileSync('audio-editor ✅✅/studiopro_editor_text.html', html, 'utf8');
console.log('Fixed export format colors for depth and contrast!');
