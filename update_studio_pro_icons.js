const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove forced deselection logic
const oldVisEvent = `if(ctxVisibility) {
            ctxVisibility.addEventListener('click', () => {
                if(state.selectedIds && state.selectedIds.length > 0) {
                    state.selectedIds.forEach(id => {
                        const el = state.elements.find(e => e.id === id);
                        if(el) el.hidden = !el.hidden;
                    });
                    // Same logic: if hidden, deselect
                    let allHidden = state.selectedIds.every(id => {
                         let e = state.elements.find(el => el.id === id);
                         return e && e.hidden;
                    });
                    if (allHidden) {
                        state.selectedIds = [];
                        state.selectedId = null;
                    }
                    updateUI();
                    render();
                    updateLayerList();
                }
            });
        }`;

const newVisEvent = `if(ctxVisibility) {
            ctxVisibility.addEventListener('click', () => {
                if(state.selectedIds && state.selectedIds.length > 0) {
                    state.selectedIds.forEach(id => {
                        const el = state.elements.find(e => e.id === id);
                        if(el) el.hidden = !el.hidden;
                    });
                    // DO NOT DESELECT - just let it stay selected so user can toggle it back easily
                    updateUI();
                    render();
                    updateLayerList();
                }
            });
        }`;
if(content.includes(oldVisEvent)) {
    content = content.replace(oldVisEvent, newVisEvent);
}

const oldLockEvent = `if(ctxLock) {
            ctxLock.addEventListener('click', () => {
                if(state.selectedIds && state.selectedIds.length > 0) {
                    state.selectedIds.forEach(id => {
                        const el = state.elements.find(e => e.id === id);
                        // Toggle instead of force lock, but user says "lock unlock" so toggle makes sense
                        if(el) el.locked = !el.locked;
                    });
                    // Keep selection so user can unlock it immediately if they want? 
                    // No, if they lock it, it should deselect according to requirements so they can't interact.
                    // But if it toggles, and it was locked, it unlocks.
                    let allLocked = state.selectedIds.every(id => {
                         let e = state.elements.find(el => el.id === id);
                         return e && e.locked;
                    });
                    if (allLocked) {
                        state.selectedIds = [];
                        state.selectedId = null;
                    }
                    updateUI();
                    render();
                    updateLayerList();
                }
            });
        }`;

const newLockEvent = `if(ctxLock) {
            ctxLock.addEventListener('click', () => {
                if(state.selectedIds && state.selectedIds.length > 0) {
                    state.selectedIds.forEach(id => {
                        const el = state.elements.find(e => e.id === id);
                        if(el) el.locked = !el.locked;
                    });
                    // DO NOT DESELECT - keep it selected so user can unlock it using the floating bar
                    updateUI();
                    render();
                    updateLayerList();
                }
            });
        }`;
if(content.includes(oldLockEvent)) {
    content = content.replace(oldLockEvent, newLockEvent);
}

// 2. Update updateUI to refresh icons dynamically
const oldContextVis = `                // Context Toolbar Visibility 
                contextToolbar.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
                contextToolbar.classList.add('opacity-100', 'scale-100');`;

const newContextVis = `                // Context Toolbar Visibility 
                contextToolbar.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
                contextToolbar.classList.add('opacity-100', 'scale-100');
                
                const ctxLockBtn = document.getElementById('ctxLock');
                if (ctxLockBtn) {
                    ctxLockBtn.innerHTML = el.locked ? '<i class="ph-bold ph-lock-key text-base text-red-400"></i>' : '<i class="ph-bold ph-lock-key-open text-base"></i>';
                }
                const ctxVisBtn = document.getElementById('ctxVisibility');
                if (ctxVisBtn) {
                    ctxVisBtn.innerHTML = el.hidden ? '<i class="ph-bold ph-eye-slash text-base text-pro-400"></i>' : '<i class="ph-bold ph-eye text-base"></i>';
                }`;

if(content.includes(oldContextVis)) {
    content = content.replace(oldContextVis, newContextVis);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated toggle behaviors and dynamic icons.");
