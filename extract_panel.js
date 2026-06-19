const fs = require('fs');
const content = fs.readFileSync('thumb-maker ✅/studio_pro.html', 'utf8');

const lines = content.split('\n');
const editPanelStart = lines.findIndex(l => l.includes('id="panel-edit"'));
const panelsEnd = lines.findIndex((l, i) => i > editPanelStart && l.includes('id="panel-layers"'));

fs.writeFileSync('thumb-maker ✅/research_ui2.html', lines.slice(editPanelStart, panelsEnd).join('\n'));
console.log('Exported research_ui2.html');
