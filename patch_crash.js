const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

const targetMatch = `                    const tmpCnv = document.createElement('canvas');
                    tmpCnv.width = cw + sw * 2;
                    tmpCnv.height = ch + sw * 2;
                    const tctx = tmpCnv.getContext('2d');`;

const inject = `                    const tmpCnv = document.createElement('canvas');
                    tmpCnv.width = cw + sw * 2;
                    tmpCnv.height = ch + sw * 2;
                    
                    if (tmpCnv.width === 0 || tmpCnv.height === 0) {
                        ctx.restore();
                        return; // Skip rendering this image placeholder to avoid crash
                    }
                    
                    const tctx = tmpCnv.getContext('2d');`;

if(content.includes(targetMatch)) {
    content = content.replace(targetMatch, inject);
    fs.writeFileSync(file, content);
    console.log('Fixed canvas crash bug.');
} else {
    console.error('Target not found in render function');
}
