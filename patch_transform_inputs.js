const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/updatePropertiesPanel\(\); drawCanvas\(\);/g, 'drawCanvas();');

fs.writeFileSync(file, content);
console.log('Removed updatePropertiesPanel from sliders!');
