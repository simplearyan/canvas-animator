const fs = require('fs');
let s = fs.readFileSync('studio_pro.html', 'utf8');
const search = `if (typeof currentGrid !== 'undefined' && currentGrid !== 'none') {
            drawSelectedGrid();
        }
        
        if (typeof currentGrid !== 'undefined' && currentGrid !== 'none') {
            drawSelectedGrid();
        }`;
const replacement = `if (typeof currentGrid !== 'undefined' && currentGrid !== 'none') {
            drawSelectedGrid();
        }`;
s = s.replace(search, replacement);

fs.writeFileSync('studio_pro.html', s);
