const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

const buggyTextSearch = `                        const cx = w/2 + offsetX;
                        const cy = h/2 + offsetY + animY;`;

const fixTextReplace = `                        const cx = w/2 + (offsetX * w) / 100;
                        const cy = h/2 + (offsetY * h) / 100 + animY;`;

const buggyImageSearch = `                            const cx = w/2 + offsetX;
                            const cy = h/2 + offsetY + animY;`;

const fixImageReplace = `                            const cx = w/2 + (offsetX * w) / 100;
                            const cy = h/2 + (offsetY * h) / 100 + animY;`;

content = content.replace(buggyTextSearch, fixTextReplace);
content = content.replace(buggyImageSearch, fixImageReplace);

fs.writeFileSync(file, content);
console.log('Successfully patched canvas translation bugs.');
