const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

const oldPasteLogic = `                    img.onload = () => {
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
                    };`;

const newPasteLogic = `                    img.onload = () => {
                        let scale = 1;
                        if(img.width > CANVAS_WIDTH/2 || img.height > CANVAS_HEIGHT/2) {
                             scale = Math.min((CANVAS_WIDTH/2) / img.width, (CANVAS_HEIGHT/2) / img.height);
                        }
                        const newImg = {
                            id: 'el_' + Date.now(),
                            type: 'image',
                            img: img,
                            dropShadowEnabled: false, dropShadowColor: '#00000000', dropShadowBlur: 0, dropShadowX: 0, dropShadowY: 0,
                            opacity: 100,
                            blendMode: 'source-over',
                            radius: 0, cropTop: 0, cropBottom: 0, cropLeft: 0, cropRight: 0,
                            innerScale: 1, innerX: 0, innerY: 0,
                            filterBright: 100, filterContrast: 100, filterSat: 100, filterBlur: 0,
                            x: CANVAS_WIDTH / 2,
                            y: CANVAS_HEIGHT / 2,
                            scale: scale,
                            rotation: 0
                        };
                        state.elements.push(newImg);
                        selectElement(newImg.id);
                        document.querySelector('[data-target="panel-edit"]').click();
                    };`;

if (content.includes(oldPasteLogic)) {
    content = content.replace(oldPasteLogic, newPasteLogic);
    fs.writeFileSync(file, content);
    console.log("Successfully fixed paste logic.");
} else {
    console.log("Could not find oldPasteLogic!");
}
