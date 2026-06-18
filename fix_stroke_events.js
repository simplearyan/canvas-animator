const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(filePath, 'utf8');

const jsEvents = `
        // Stroke Bindings
        toggleStrokeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(!state.selectedId) return;
            const el = state.elements.find(x => x.id === state.selectedId);
            if(el) {
                el.strokeEnabled = !el.strokeEnabled;
                updateUI();
                render();
            }
        });

        editStrokeColor.addEventListener('input', (e) => {
            editStrokeColorHex.value = e.target.value.toUpperCase();
            updateProp('strokeColor', e.target.value);
        });

        editStrokeWidth.addEventListener('input', (e) => {
            editStrokeWidthVal.textContent = \`\${e.target.value}px\`;
            updateProp('strokeWidth', parseInt(e.target.value));
        });

        // 3D Shadow Bindings`;

content = content.replace('        // 3D Shadow Bindings', jsEvents);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Stroke Event Bindings added!");
