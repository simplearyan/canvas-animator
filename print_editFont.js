const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('id="editFontFamily"'));
console.log(lines.slice(idx, idx + 40).join('\n'));
