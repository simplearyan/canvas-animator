const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Fix paste listener: Append it inside setupEventListeners or at the end of the script tag.
const pasteLogic = `
        // Global Paste Listener for Images
        window.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (const item of items) {
                if (item.type.indexOf('image') === 0) {
                    const blob = item.getAsFile();
                    const url = URL.createObjectURL(blob);
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.onload = () => {
                        const newImg = {
                            id: 'el_' + Date.now(),
                            type: 'image',
                            img: img,
                            opacity: 100,
                            blendMode: 'source-over',
                            radius: 0,
                            x: CANVAS_WIDTH / 2,
                            y: CANVAS_HEIGHT / 2,
                            scale: 1,
                            rotation: 0
                        };
                        state.elements.push(newImg);
                        state.selectedId = newImg.id;
                        state.selectedIds = [newImg.id];
                        updateLayerList();
                        render();
                    };
                    img.src = url;
                    break;
                }
            }
        });
`;
if (!content.includes("window.addEventListener('paste'")) {
    content = content.replace('// --- Initialization ---', pasteLogic + '\n        // --- Initialization ---');
    // If '// --- Initialization ---' doesn't exist, try just 'setupEventListeners();'
    if (!content.includes('// --- Initialization ---')) {
        content = content.replace('setupEventListeners();', pasteLogic + '\n        setupEventListeners();');
    }
}

// 2. Fix the render function to actually use el.processedImg
const oldDrawImage = `tctx.drawImage(el.img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);`;
const newDrawImage = `tctx.drawImage(el.processedImg || el.img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);`;

if (content.includes(oldDrawImage)) {
    content = content.replace(oldDrawImage, newDrawImage);
} else {
    console.log("Could not find tctx.drawImage to replace!");
}

// 3. Remove the broken renderOld from previous patch attempt if it somehow matched
const brokenRenderStr = `if (el.processedImg) {
                        ctx.drawImage(el.processedImg, -w/2, -h/2, w, h);
                    } else {
                        ctx.drawImage(tmpCnv, -w/2, -h/2, w, h);
                    }`;
if (content.includes(brokenRenderStr)) {
    content = content.replace(brokenRenderStr, `ctx.drawImage(tmpCnv, -w/2, -h/2, w, h);`);
}

fs.writeFileSync(file, content);
console.log('Fixes applied successfully.');
