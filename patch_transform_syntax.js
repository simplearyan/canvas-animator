const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /const transformHTML = \(clip\.type === 'image' \|\| clip\.type === 'video' \|\| clip\.type === 'text'\) \? \\`/g,
    "const transformHTML = (clip.type === 'image' || clip.type === 'video' || clip.type === 'text') ? `"
);

content = content.replace(
    /\\` : '';/g,
    "` : '';"
);

content = content.replace(
    /\\\$\{/g,
    "${"
);

content = content.replace(
    /\$\{clip\.type !== 'text' \? \\`/g,
    "${clip.type !== 'text' ? `"
);

content = content.replace(
    /\\` : ''\}/g,
    "` : ''}"
);


fs.writeFileSync(file, content);
console.log('Fixed escaped characters in transformHTML!');
