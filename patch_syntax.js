const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /\$\{enableKey \? \\\`/g,
    "${enableKey ? `"
);

content = content.replace(
    /\\\` : ''\}/g,
    "` : ''}"
);

fs.writeFileSync(file, content);
console.log('Fixed escaped backticks in template literal!');
