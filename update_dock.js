const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
    "inspector: { visible: false, dock: 'right', fullWidth: false, width: 320 }",
    "inspector: { visible: false, dock: 'left', fullWidth: false, width: 320 }"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Default dock set to left.");
