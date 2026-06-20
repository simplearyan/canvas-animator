const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove HTML
const btnStart = content.indexOf('<button id="btnToggleLayout"');
if (btnStart !== -1) {
    const btnEnd = content.indexOf('</button>', btnStart) + 9;
    content = content.substring(0, btnStart) + content.substring(btnEnd);
    console.log("HTML Button removed.");
}

// 2. Remove Event Listener
const evtStart = content.indexOf("btnToggleLayout.addEventListener('click',");
if (evtStart !== -1) {
    // The event listener ends after `resizeCanvas(); }, 10);` and `});`
    // Let's find the closing `});`
    const resizeCanvasStr = 'resizeCanvas(); }, 10);';
    const resizeIdx = content.indexOf(resizeCanvasStr, evtStart);
    if (resizeIdx !== -1) {
        const evtEnd = content.indexOf('});', resizeIdx) + 3;
        content = content.substring(0, evtStart) + content.substring(evtEnd);
        console.log("Event listener removed.");
    } else {
        console.log("Could not find resizeCanvas inside evtListener");
    }
}

fs.writeFileSync(file, content);
console.log("Done");
