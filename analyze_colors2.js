const fs = require('fs');

const tm = fs.readFileSync('d:/Code/Antigravity/design_concepts/canvas-animator/thumb-maker ✅/studio_pro.html', 'utf8');

function extractBg(html, regex) {
    const match = html.match(regex);
    if (!match) return 'not found';
    const classMatch = match[0].match(/class="([^"]+)"/);
    if (!classMatch) return 'no class';
    const classes = classMatch[1].split(' ');
    const bgs = classes.filter(c => c.startsWith('dark:bg-') || c.startsWith('bg-'));
    return bgs.join(' ');
}

console.log('\n--- THUMB MAKER ---');
console.log('Body:', extractBg(tm, /<body[^>]*>/));
console.log('Sidebar:', extractBg(tm, /<aside id="rightSidebar"[^>]*>/));
console.log('Canvas Container:', extractBg(tm, /<div id="canvasContainer"[^>]*>/));
console.log('Top Action Bar:', extractBg(tm, /<div id="topActionBar"[^>]*>/));
console.log('Right Sidebar Headers:', extractBg(tm, /<div class="h-14 bg-white[^>]*>/));
console.log('Accordion:', extractBg(tm, /<details id="acc-drop-shadow"[^>]*>/));
console.log('Accordion Header:', extractBg(tm, /<summary class="flex justify-between items-center font-bold cursor-pointer p-3 bg-pro-100 dark:bg-pro-800\/80[^>]*>/));
