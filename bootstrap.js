const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'audio-editor-modular');
const dirs = ['js/core', 'js/audio', 'js/canvas', 'js/timeline', 'js/export', 'js/ui'];
dirs.forEach(d => fs.mkdirSync(path.join(targetDir, d), { recursive: true }));

const htmlFile = fs.readFileSync(path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html'), 'utf8');

const scriptStart = htmlFile.indexOf('<script>');
const scriptEnd = htmlFile.lastIndexOf('</script>') + 9;

const newHtml = htmlFile.substring(0, scriptStart) + '<script type="module" src="./js/main.js"></script>\n</body>\n</html>';
fs.writeFileSync(path.join(targetDir, 'index.html'), newHtml);

const jsContent = htmlFile.substring(scriptStart + 8, scriptEnd - 9);
fs.writeFileSync(path.join(targetDir, 'js', 'full_script.js'), jsContent);

console.log("Boostrap complete.");
