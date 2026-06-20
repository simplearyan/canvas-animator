const fs = require('fs');
const lines = fs.readFileSync('audio-editor ✅✅/studiopro_editor_text.html', 'utf8').split('\n');
const idx1 = lines.findIndex(l => l.includes('id="previewContainer"'));
const idx2 = lines.findIndex(l => l.includes('id="timelineResizer"'));
const idx3 = lines.findIndex(l => l.includes('id="timelineContainer"'));
console.log('preview:', idx1, 'resizer:', idx2, 'timeline:', idx3);
