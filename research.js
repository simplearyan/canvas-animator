const fs = require('fs');
const content = fs.readFileSync('thumb-maker ✅/studio_pro.html', 'utf8');

const lines = content.split('\n');

const editPanelStart = lines.findIndex(l => l.includes('id="panel-edit"'));
const editPanelEnd = editPanelStart + 500; // rough estimate

fs.writeFileSync('thumb-maker ✅/research_ui.html', lines.slice(editPanelStart, editPanelEnd).join('\n'));
console.log('Exported research_ui.html');
