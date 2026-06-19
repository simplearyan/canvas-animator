const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Add color presets HTML
const oldTargetColorHtml = `<div class="flex items-center gap-2">
                                            <input type="color" id="editImgSelColor" value="#ff0000" class="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent">
                                            <button id="btnImgSelClear" class="text-[10px] text-red-500 hover:text-red-600"><i class="ph-bold ph-x"></i> Reset</button>
                                        </div>
                                    </div>`;

const newTargetColorHtml = `<div class="flex items-center gap-2">
                                            <input type="color" id="editImgSelColor" value="#ff0000" class="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent" title="Custom Color">
                                            <button id="btnImgSelClear" class="text-[10px] text-red-500 hover:text-red-600"><i class="ph-bold ph-x"></i> Reset</button>
                                        </div>
                                    </div>
                                    <div class="flex gap-1.5 mb-3">
                                        <button class="w-5 h-5 rounded-full border border-black/10 shadow-sm transition hover:scale-110" style="background-color: #ff007f;" onclick="document.getElementById('editImgSelColor').value='#ff007f'; document.getElementById('editImgSelColor').dispatchEvent(new Event('input'))" title="Pink"></button>
                                        <button class="w-5 h-5 rounded-full border border-black/10 shadow-sm transition hover:scale-110" style="background-color: #0080ff;" onclick="document.getElementById('editImgSelColor').value='#0080ff'; document.getElementById('editImgSelColor').dispatchEvent(new Event('input'))" title="Blue"></button>
                                        <button class="w-5 h-5 rounded-full border border-black/10 shadow-sm transition hover:scale-110" style="background-color: #ff00ff;" onclick="document.getElementById('editImgSelColor').value='#ff00ff'; document.getElementById('editImgSelColor').dispatchEvent(new Event('input'))" title="Magenta"></button>
                                        <button class="w-5 h-5 rounded-full border border-black/10 shadow-sm transition hover:scale-110" style="background-color: #8a2be2;" onclick="document.getElementById('editImgSelColor').value='#8a2be2'; document.getElementById('editImgSelColor').dispatchEvent(new Event('input'))" title="Violet"></button>
                                        <button class="w-5 h-5 rounded-full border border-black/10 shadow-sm transition hover:scale-110" style="background-color: #ffff00;" onclick="document.getElementById('editImgSelColor').value='#ffff00'; document.getElementById('editImgSelColor').dispatchEvent(new Event('input'))" title="Yellow"></button>
                                        <button class="w-5 h-5 rounded-full border border-black/10 shadow-sm transition hover:scale-110" style="background-color: #00ff00;" onclick="document.getElementById('editImgSelColor').value='#00ff00'; document.getElementById('editImgSelColor').dispatchEvent(new Event('input'))" title="Green"></button>
                                    </div>`;

if (content.includes(oldTargetColorHtml)) {
    content = content.replace(oldTargetColorHtml, newTargetColorHtml);
    console.log("Added presets HTML");
} else {
    // maybe already added?
    console.log("oldTargetColorHtml not found. Check if already replaced or mismatch.");
}

// 2. Add event listeners
const eventListeners = `
    const updateImgProp = (prop, valStr) => {
        if (!state.selectedIds) return;
        state.selectedIds.forEach(id => {
            const el = state.elements.find(e => e.id === id);
            if (el && el.type === 'image') {
                if (prop === 'filterSelColor') {
                    el[prop] = valStr;
                } else {
                    el[prop] = parseFloat(valStr);
                }
                
                if (['filterTemp','filterTint','filterVibrance','filterSelColor','filterSelTol','filterSelHue','filterSelSat'].includes(prop)) {
                    processImage(el);
                }
            }
        });
        saveCurrentArtboard();
        updateUI();
        render();
    };

    if (document.getElementById('editImgBrightness')) {
        document.getElementById('editImgBrightness').addEventListener('input', e => updateImgProp('filterBright', e.target.value));
        document.getElementById('editImgContrast').addEventListener('input', e => updateImgProp('filterContrast', e.target.value));
        document.getElementById('editImgSaturation').addEventListener('input', e => updateImgProp('filterSat', e.target.value));
        document.getElementById('editImgBlur').addEventListener('input', e => updateImgProp('filterBlur', e.target.value));
        
        document.getElementById('editImgTemp').addEventListener('input', e => updateImgProp('filterTemp', e.target.value));
        document.getElementById('editImgTint').addEventListener('input', e => updateImgProp('filterTint', e.target.value));
        document.getElementById('editImgVibrance').addEventListener('input', e => updateImgProp('filterVibrance', e.target.value));
        
        document.getElementById('editImgSelColor').addEventListener('input', e => updateImgProp('filterSelColor', e.target.value));
        document.getElementById('editImgSelTolerance').addEventListener('input', e => updateImgProp('filterSelTol', e.target.value));
        document.getElementById('editImgSelHue').addEventListener('input', e => updateImgProp('filterSelHue', e.target.value));
        document.getElementById('editImgSelSat').addEventListener('input', e => updateImgProp('filterSelSat', e.target.value));
        
        document.getElementById('btnImgSelClear').addEventListener('click', () => {
            if (!state.selectedIds) return;
            state.selectedIds.forEach(id => {
                const el = state.elements.find(e => e.id === id);
                if (el && el.type === 'image') {
                    el.filterSelColor = '#ff0000';
                    el.filterSelTol = 30;
                    el.filterSelHue = 0;
                    el.filterSelSat = 0;
                    document.getElementById('editImgSelColor').value = '#ff0000';
                    processImage(el);
                }
            });
            saveCurrentArtboard();
            updateUI();
            render();
        });
    }
`;

if (!content.includes('updateImgProp')) {
    content = content.replace('function setupEventListeners() {', 'function setupEventListeners() {\n' + eventListeners);
    console.log("Added event listeners");
} else {
    console.log("Event listeners already added.");
}

fs.writeFileSync(file, content);
console.log('Script done.');
