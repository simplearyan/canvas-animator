const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Inject UI buttons
const rotateUI = `<div class="px-2 border-r border-pro-700 dark:border-pro-600 flex gap-1">
                    <button id="ctxRotateCCW"`;
const flipUI = `<div class="px-2 border-r border-pro-700 dark:border-pro-600 flex gap-1">
                    <button id="ctxFlipH" class="p-2 hover:bg-pro-700 dark:hover:bg-pro-600 rounded-lg text-pro-300 hover:text-white flex items-center justify-center" title="Flip Horizontally">
                        <i class="ph-bold ph-arrows-left-right text-base"></i>
                    </button>
                    <button id="ctxFlipV" class="p-2 hover:bg-pro-700 dark:hover:bg-pro-600 rounded-lg text-pro-300 hover:text-white flex items-center justify-center" title="Flip Vertically">
                        <i class="ph-bold ph-arrows-up-down text-base"></i>
                    </button>
                </div>
                <div class="px-2 border-r border-pro-700 dark:border-pro-600 flex gap-1">
                    <button id="ctxRotateCCW"`;

if (content.includes(rotateUI)) {
    content = content.replace(rotateUI, flipUI);
    console.log("UI buttons added");
} else {
    console.log("rotateUI not found");
}

// 2. Inject Context Scale
const scaleLogic = `                ctx.scale(el.scale || 1, el.scale || 1);`;
const flipScaleLogic = `                let flipScaleX = el.scale || 1;
                let flipScaleY = el.scale || 1;
                if (el.flipH) flipScaleX *= -1;
                if (el.flipV) flipScaleY *= -1;
                ctx.scale(flipScaleX, flipScaleY);`;

if (content.includes(scaleLogic)) {
    content = content.replace(scaleLogic, flipScaleLogic);
    console.log("Canvas scale logic added");
} else {
    console.log("scaleLogic not found");
}

// 3. Inject DOM Box Transform
const boxTransform = `box.style.transform = \`rotate(\${el.rotation || 0}deg)\`;`;
const flipBoxTransform = `let transformStr = \`rotate(\${el.rotation || 0}deg)\`;
                        if (el.flipH) transformStr += \` scaleX(-1)\`;
                        if (el.flipV) transformStr += \` scaleY(-1)\`;
                        box.style.transform = transformStr;`;

if (content.includes(boxTransform)) {
    content = content.replace(boxTransform, flipBoxTransform);
    console.log("DOM box transform logic added");
} else {
    console.log("boxTransform not found");
}

// 4. Inject Event Listeners
const rotateEvent = `ctxRotateCW.addEventListener('click', () => {`;
const flipEvent = `const ctxFlipH = document.getElementById('ctxFlipH');
        const ctxFlipV = document.getElementById('ctxFlipV');
        
        if (ctxFlipH) {
            ctxFlipH.addEventListener('click', () => {
                const ids = state.selectedIds || [];
                ids.forEach(id => {
                    const el = state.elements.find(x => x.id === id);
                    if (el) el.flipH = !el.flipH;
                });
                render();
                debouncedSave();
            });
        }
        if (ctxFlipV) {
            ctxFlipV.addEventListener('click', () => {
                const ids = state.selectedIds || [];
                ids.forEach(id => {
                    const el = state.elements.find(x => x.id === id);
                    if (el) el.flipV = !el.flipV;
                });
                render();
                debouncedSave();
            });
        }
        
        ctxRotateCW.addEventListener('click', () => {`;

if (content.includes(rotateEvent)) {
    content = content.replace(rotateEvent, flipEvent);
    console.log("Event listeners added");
} else {
    console.log("rotateEvent not found");
}

fs.writeFileSync(file, content);
console.log("Done");
