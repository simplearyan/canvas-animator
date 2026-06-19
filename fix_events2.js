const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

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
                
                // If it's a color correction prop, we need to process image
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

const marker = '// Initial State setup';
if (content.includes(marker)) {
    content = content.replace(marker, eventListeners + '\n        ' + marker);
    fs.writeFileSync(file, content);
    console.log("Appended event listeners before Initial State setup successfully.");
} else {
    console.log("Could not find marker.");
}
