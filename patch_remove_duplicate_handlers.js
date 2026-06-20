const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// There are TWO "function handleScaleUp()" definitions.
// We want to delete from the SECOND "// --- Quick Action Handlers ---" 
// up to just before "function updatePropertiesPanel() {"

const sIdx = content.lastIndexOf("// --- Quick Action Handlers ---");
const eIdx = content.indexOf("function updatePropertiesPanel() {", sIdx);

if (sIdx !== -1 && eIdx !== -1) {
    // We make sure it's the second one!
    if (content.indexOf("// --- Quick Action Handlers ---") !== sIdx) {
        content = content.substring(0, sIdx) + content.substring(eIdx);
        fs.writeFileSync(file, content);
        console.log("Duplicate handlers removed!");
    } else {
        console.log("Only one handler block found!");
    }
} else {
    console.log("Could not find blocks.");
}
