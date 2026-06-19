const fs = require('fs');
const lines = fs.readFileSync('thumb-maker ✅/studio_pro.html', 'utf8').split('\n');
const pasteIdx = lines.findIndex(l => l.includes("addEventListener('paste'"));
if (pasteIdx !== -1) {
    console.log(lines.slice(pasteIdx - 2, pasteIdx + 20).join('\n'));
} else {
    console.log("No paste listener found!");
}
