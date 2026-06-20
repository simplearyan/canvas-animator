const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /if \(!clip \|\| \(clip\.type !== 'image' && clip\.type !== 'video' && clip\.type !== 'text'\)\) {/,
    "if (!clip || !['image', 'video', 'text', 'audio'].includes(clip.type)) {"
);

fs.writeFileSync(file, content);
console.log('Early return fixed!');
