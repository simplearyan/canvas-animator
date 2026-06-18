const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update checkHit
content = content.replace(
    'if (el.hidden) continue;',
    'if (el.hidden || el.locked) continue;'
);

// 2. Add toggleLock globally (near toggleVisibility)
const toggleVis = `        window.toggleVisibility = function(id) {
            const el = state.elements.find(e => e.id === id);
            if(el) {
                el.hidden = !el.hidden;
                if(el.hidden && state.selectedIds && state.selectedIds.includes(id)) {
                    state.selectedIds = state.selectedIds.filter(i => i !== id);
                    if(state.selectedId === id) state.selectedId = state.selectedIds[0] || null;
                }
                updateUI();
                render();
            }
        };`;
        
const toggleLock = `
        window.toggleLock = function(id) {
            const el = state.elements.find(e => e.id === id);
            if(el) {
                el.locked = !el.locked;
                if(el.locked && state.selectedIds && state.selectedIds.includes(id)) {
                    state.selectedIds = state.selectedIds.filter(i => i !== id);
                    if(state.selectedId === id) state.selectedId = state.selectedIds[0] || null;
                }
                updateUI();
                render();
            }
        };`;
content = content.replace(toggleVis, toggleVis + toggleLock);

// 3. Update layer list UI
const oldLayerIcons = `                    <button onclick="event.stopPropagation(); window.toggleVisibility('\${el.id}')" class="text-pro-400 hover:text-pro-600 dark:hover:text-white p-1" title="Toggle Visibility">
                        <i class="ph-bold \${el.hidden ? 'ph-eye-slash' : 'ph-eye'} text-lg"></i>
                    </button>`;
const newLayerIcons = `                    <div class="flex items-center gap-1">
                        <button onclick="event.stopPropagation(); window.toggleLock('\${el.id}')" class="text-pro-400 hover:text-pro-600 dark:hover:text-white p-1" title="Toggle Lock">
                            <i class="ph-bold \${el.locked ? 'ph-lock-key' : 'ph-lock-key-open'} text-lg"></i>
                        </button>
                        <button onclick="event.stopPropagation(); window.toggleVisibility('\${el.id}')" class="text-pro-400 hover:text-pro-600 dark:hover:text-white p-1" title="Toggle Visibility">
                            <i class="ph-bold \${el.hidden ? 'ph-eye-slash' : 'ph-eye'} text-lg"></i>
                        </button>
                    </div>`;
content = content.replace(oldLayerIcons, newLayerIcons);

// 4. Add Lock to top action bar (Transform & Arrange accordion)
const bringForwardBtnHTML = `<button id="btnBringForward"`;
const lockBtnHTML = `<button id="btnLockSelected" class="flex-1 py-2 bg-white dark:bg-pro-700 hover:bg-pro-100 dark:hover:bg-pro-600 border border-pro-300 dark:border-pro-600 text-pro-700 dark:text-pro-200 text-[11px] uppercase tracking-wider font-bold rounded-md flex items-center justify-center gap-1.5 shadow-sm ">
                                        <i class="ph-bold ph-lock-key text-pro-500 dark:text-pro-400"></i> Lock
                                    </button>
                                    <button id="btnBringForward"`;
content = content.replace(bringForwardBtnHTML, lockBtnHTML);

// 5. Wire up btnLockSelected
const btnBringForwardConst = `const btnBringForward = document.getElementById('btnBringForward');`;
const btnLockConst = `const btnBringForward = document.getElementById('btnBringForward');
        const btnLockSelected = document.getElementById('btnLockSelected');`;
content = content.replace(btnBringForwardConst, btnLockConst);

const btnBringForwardEvent = `        btnBringForward.addEventListener('click', () => {`;
const btnLockEvent = `        btnLockSelected.addEventListener('click', () => {
            if(state.selectedIds && state.selectedIds.length > 0) {
                state.selectedIds.forEach(id => {
                    const el = state.elements.find(e => e.id === id);
                    if(el) el.locked = true;
                });
                state.selectedIds = [];
                state.selectedId = null;
                updateUI();
                render();
            }
        });

        btnBringForward.addEventListener('click', () => {`;
content = content.replace(btnBringForwardEvent, btnLockEvent);

// 6. Change default canvas and preset background colors to #231F20
// Replace initial HTML values
content = content.replace(/value="#1a1a1a"/g, 'value="#231F20"');
content = content.replace(/value="#1A1A1A"/g, 'value="#231F20"');

// Replace JS state assignments
content = content.replace(/bgColor: '#0f172a'/g, "bgColor: '#231F20'");
content = content.replace(/bgColor: '#fffefa'/g, "bgColor: '#231F20'");
content = content.replace(/bgColor: '#ffa200'/g, "bgColor: '#231F20'");
content = content.replace(/state\.bgColor = '#171717';/g, "state.bgColor = '#231F20';");
content = content.replace(/state\.bgColor = '#0f172a';/g, "state.bgColor = '#231F20';");
content = content.replace(/preset\.bgColor \|\| '#e4decb'/g, "preset.bgColor || '#231F20'");
content = content.replace(/preset\.bgColor \|\| '#0f172a'/g, "preset.bgColor || '#231F20'");


fs.writeFileSync(filePath, content, 'utf8');
console.log("Studio Pro UI updated successfully.");
