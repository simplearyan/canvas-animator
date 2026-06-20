const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// We need to replace the box.style.left, top, and transform lines inside the DOM logic.
// Find the DOM Box render inside loop

content = content.replace(/box\.style\.left = `\${cx - w_box\/2}px`;/g, 'box.style.left = `${cx}px`;');
content = content.replace(/box\.style\.top = `\${cy - h_box\/2}px`;/g, 'box.style.top = `${cy}px`;');
content = content.replace(/box\.style\.transform = `rotate\(\${rotate}deg\) scale\(\${flipH}, \${flipV}\)`;/g, 'box.style.transform = `translate(-50%, -50%) rotate(${rotate}deg) scale(${flipH}, ${flipV})`;');

fs.writeFileSync(file, content);
console.log('Successfully patched translate(-50%, -50%).');
