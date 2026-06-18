const fs = require('fs');

const ae = fs.readFileSync('d:/Code/Antigravity/design_concepts/canvas-animator/audio-editor ✅✅/studiopro_editor_text.html', 'utf8');
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

console.log('--- AUDIO EDITOR ---');
console.log('Body:', extractBg(ae, /<body[^>]*>/));
console.log('Header:', extractBg(ae, /<header[^>]*>/));
console.log('Main Workspace:', extractBg(ae, /<div id="mainWorkspace"[^>]*>/));
console.log('Timeline:', extractBg(ae, /<div id="timelineContainer"[^>]*>/));
console.log('Sidebar:', extractBg(ae, /<aside id="propertiesSidebar"[^>]*>/));
console.log('Properties Header:', extractBg(ae, /<div class="h-10 bg-white[^>]*>/));

console.log('\n--- THUMB MAKER ---');
console.log('Body:', extractBg(tm, /<body[^>]*>/));
console.log('Header:', extractBg(tm, /<header[^>]*>/));
console.log('Main Workspace:', extractBg(tm, /<div id="mainWorkspace"[^>]*>/));
console.log('Sidebar:', extractBg(tm, /<aside id="propertiesSidebar"[^>]*>/));
console.log('Accordion:', extractBg(tm, /<details id="acc-text"[^>]*>/));
console.log('Accordion Header:', extractBg(tm, /<summary class="flex justify-between items-center font-bold cursor-pointer p-3 bg-pro-100 dark:bg-pro-800\/80[^>]*>/));
