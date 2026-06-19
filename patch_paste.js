const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Update UI
const uiOld = `<label class="block text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest mb-2">Import URL</label>`;
const uiNew = `<div class="flex justify-between items-end mb-2">
        <label class="block text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Import URL or Paste Image</label>
        <span class="text-[9px] font-bold text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-1.5 py-0.5 rounded">Ctrl+V to Paste</span>
    </div>`;
content = content.replace(uiOld, uiNew);

// 2. Add Event Listener
// Find `document.addEventListener('keydown', (e) => {` and inject before it.
const jsOld = `document.addEventListener('keydown', (e) => {`;
const jsNew = `// Global Paste Listener for Images
        document.addEventListener('paste', (e) => {
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
                        showToast("Pasted image added!");
                    };
                    img.src = url;
                    e.preventDefault(); // Prevent default paste if inside an input? Wait, if inside input, allow text paste. 
                    // But if it's an image, prevent default.
                    break;
                }
            }
        });

        document.addEventListener('keydown', (e) => {`;
        
content = content.replace(jsOld, jsNew);

fs.writeFileSync(file, content);
console.log('Paste logic injected.');
