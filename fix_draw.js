const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

const oldDrawImage = `tctx.drawImage(el.img, baseImgX + iX, baseImgY + iY, imgDrawW, imgDrawH);`;
const newDrawImage = `tctx.drawImage(el.processedImg || el.img, baseImgX + iX, baseImgY + iY, imgDrawW, imgDrawH);`;

if (content.includes(oldDrawImage)) {
    content = content.replace(oldDrawImage, newDrawImage);
    fs.writeFileSync(file, content);
    console.log("Successfully replaced tctx.drawImage");
} else {
    console.log("Still could not find tctx.drawImage to replace! Try replacing by regex.");
}
