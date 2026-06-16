const fs = require('fs');
const s = fs.readFileSync('studio_pro.html', 'utf8');
console.log('accContent exists:', s.includes('const accContent ='));
console.log('accTypography exists:', s.includes('const accTypography ='));
console.log('acc3d exists:', s.includes('const acc3d ='));
