const fs = require('fs');
const lines = fs.readFileSync('thumb-maker ✅/studio_pro.html', 'utf8').split('\n');
const pasteIdx = lines.findIndex(l => l.includes("window.addEventListener('paste'"));
if (pasteIdx !== -1) {
    console.log("Paste event found at " + pasteIdx);
    console.log(lines.slice(pasteIdx, pasteIdx+5).join('\n'));
} else {
    console.log("Paste event NOT found");
}
