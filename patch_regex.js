const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// Replace using regex to avoid \r\n issues
content = content.replace(/const cx = w\/2 \+ offsetX;/g, 'const cx = w/2 + (offsetX * w) / 100;');
content = content.replace(/const cy = h\/2 \+ offsetY \+ animY;/g, 'const cy = h/2 + (offsetY * h) / 100 + animY;');

fs.writeFileSync(file, content);
console.log('Successfully patched using regex.');
