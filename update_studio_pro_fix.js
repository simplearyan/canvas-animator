const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix window.toggleLock injection
const toggleVisOrig = `        window.toggleVisibility = function(id) {
            const el = state.elements.find(e => e.id === id);
            if (el) {
                el.hidden = !el.hidden;
                render();
                updateLayerList();
            }
        };`;

const toggleLockCode = `
        window.toggleLock = function(id) {
            const el = state.elements.find(e => e.id === id);
            if (el) {
                el.locked = !el.locked;
                if (el.locked && state.selectedIds && state.selectedIds.includes(id)) {
                    state.selectedIds = state.selectedIds.filter(i => i !== id);
                    if(state.selectedId === id) state.selectedId = state.selectedIds[0] || null;
                    updateUI();
                }
                render();
                updateLayerList();
            }
        };`;

if(content.includes(toggleVisOrig)) {
    content = content.replace(toggleVisOrig, toggleVisOrig + toggleLockCode);
} else {
    console.error("toggleVisibility not found!");
}

// 2. Add Lock Icon to Context Toolbar
const ctxDeleteHTML = `<div class="pl-2 pr-1">
                    <button id="ctxDelete" class="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-red-500  flex items-center justify-center" title="Delete Element">
                        <i class="ph-bold ph-trash text-base"></i>
                    </button>
                </div>`;

const ctxLockHTML = `<div class="px-2 border-r border-pro-700 dark:border-pro-600 flex gap-1">
                    <button id="ctxLock" class="p-2 hover:bg-pro-700 dark:hover:bg-pro-600 rounded-lg text-pro-300 hover:text-white flex items-center justify-center" title="Lock Element">
                        <i class="ph-bold ph-lock-key text-base"></i>
                    </button>
                </div>
                ` + ctxDeleteHTML;

if(content.includes(ctxDeleteHTML)) {
    content = content.replace(ctxDeleteHTML, ctxLockHTML);
}

// 3. Wire up ctxLock
const ctxDeleteDecl = `const ctxDelete = document.getElementById('ctxDelete');`;
const ctxLockDecl = `const ctxDelete = document.getElementById('ctxDelete');\n        const ctxLock = document.getElementById('ctxLock');`;

content = content.replace(ctxDeleteDecl, ctxLockDecl);

const ctxDeleteEvent = `ctxDelete.addEventListener('click', () => btnDeleteSelected.click());`;
const ctxLockEvent = `ctxDelete.addEventListener('click', () => btnDeleteSelected.click());
        if(ctxLock) {
            ctxLock.addEventListener('click', () => {
                if(state.selectedIds && state.selectedIds.length > 0) {
                    state.selectedIds.forEach(id => {
                        const el = state.elements.find(e => e.id === id);
                        if(el) el.locked = true;
                    });
                    state.selectedIds = [];
                    state.selectedId = null;
                    updateUI();
                    render();
                    updateLayerList();
                }
            });
        }`;

content = content.replace(ctxDeleteEvent, ctxLockEvent);

// 4. Add Reset Buttons for Scale and Rotation
const scaleHTML = `<div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Scale</label>
                                            <span id="editScaleVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">1x</span>
                                        </div>`;
const scaleWithReset = `<div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest flex items-center gap-2">Scale <button id="btnResetScale" class="text-pro-400 hover:text-brand-500"><i class="ph-bold ph-arrow-counter-clockwise"></i></button></label>
                                            <span id="editScaleVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">1x</span>
                                        </div>`;
content = content.replace(scaleHTML, scaleWithReset);

const rotationHTML = `<div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Rotation</label>
                                            <span id="editRotationVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">0°</span>
                                        </div>`;
const rotationWithReset = `<div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest flex items-center gap-2">Rotation <button id="btnResetRotation" class="text-pro-400 hover:text-brand-500"><i class="ph-bold ph-arrow-counter-clockwise"></i></button></label>
                                            <span id="editRotationVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">0°</span>
                                        </div>`;
content = content.replace(rotationHTML, rotationWithReset);

// 5. Wire up Reset Buttons
const editRotationEvent = `editRotation.addEventListener('input', (e) => { editRotationVal.textContent = \`\${e.target.value}°\`; updateProp('rotation', parseInt(e.target.value)); });`;
const resetEvents = `
        const btnResetScale = document.getElementById('btnResetScale');
        if(btnResetScale) {
            btnResetScale.addEventListener('click', () => {
                updateProp('scale', 1);
                updateUI();
                render();
            });
        }
        const btnResetRotation = document.getElementById('btnResetRotation');
        if(btnResetRotation) {
            btnResetRotation.addEventListener('click', () => {
                updateProp('rotation', 0);
                updateUI();
                render();
            });
        }
`;
content = content.replace(editRotationEvent, editRotationEvent + resetEvents);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed toggleLock, added context lock button, added reset buttons.");
