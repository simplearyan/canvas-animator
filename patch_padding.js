const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

const regex = /if\s*\(clip\.id === State\.selectedClipId && !State\.isExporting\)\s*\{\s*ctx\.shadowColor = 'rgba\(99, 102, 241, 0\.4\)';/g;

const count = (content.match(regex) || []).length;
console.log('Matches:', count);

if (count > 0) {
    content = content.replace(regex, "if (clip.id === State.selectedClipId && !State.isExporting) {\n                            dw += 32 / finalScale;\n                            dh += 32 / finalScale;\n                            ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';");
    fs.writeFileSync(file, content);
    console.log('Successfully added padding to bounding box.');
}
