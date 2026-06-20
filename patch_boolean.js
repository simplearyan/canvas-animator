const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /if \(effectName === 'shadowEnable' \|\| effectName === 'extrudeEnable'\) \{/g,
    `if (effectName === 'shadowEnable' || effectName === 'extrudeEnable' || effectName.endsWith('Enable')) {`
);

fs.writeFileSync(file, content);
console.log('Boolean logic patched!');
