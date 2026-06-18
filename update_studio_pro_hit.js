const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix checkHit
const checkHitOriginal = `        function checkHit(pos) {
            for (let i = state.elements.length - 1; i >= 0; i--) {
                const el = state.elements[i];
                ctx.save();`;

const checkHitFixed = `        function checkHit(pos) {
            for (let i = state.elements.length - 1; i >= 0; i--) {
                const el = state.elements[i];
                if (el.hidden || el.locked) continue;
                ctx.save();`;

content = content.replace(checkHitOriginal, checkHitFixed);

// 2. Add Visibility (Eye) to Top Action Bar
// We previously added ctxLock right before ctxDelete. Let's find it.
const lockHTML = `<div class="px-2 border-r border-pro-700 dark:border-pro-600 flex gap-1">
                    <button id="ctxLock" class="p-2 hover:bg-pro-700 dark:hover:bg-pro-600 rounded-lg text-pro-300 hover:text-white flex items-center justify-center" title="Lock Element">
                        <i class="ph-bold ph-lock-key text-base"></i>
                    </button>
                </div>`;

const lockAndVisHTML = `<div class="px-2 border-r border-pro-700 dark:border-pro-600 flex gap-1">
                    <button id="ctxLock" class="p-2 hover:bg-pro-700 dark:hover:bg-pro-600 rounded-lg text-pro-300 hover:text-white flex items-center justify-center" title="Lock Element">
                        <i class="ph-bold ph-lock-key text-base"></i>
                    </button>
                    <button id="ctxVisibility" class="p-2 hover:bg-pro-700 dark:hover:bg-pro-600 rounded-lg text-pro-300 hover:text-white flex items-center justify-center" title="Toggle Visibility">
                        <i class="ph-bold ph-eye text-base"></i>
                    </button>
                </div>`;

if(content.includes(lockHTML)) {
    content = content.replace(lockHTML, lockAndVisHTML);
}

// 3. Wire up ctxVisibility
const ctxLockDecl = `const ctxDelete = document.getElementById('ctxDelete');
        const ctxLock = document.getElementById('ctxLock');`;
const ctxLockVisDecl = `const ctxDelete = document.getElementById('ctxDelete');
        const ctxLock = document.getElementById('ctxLock');
        const ctxVisibility = document.getElementById('ctxVisibility');`;

content = content.replace(ctxLockDecl, ctxLockVisDecl);

const ctxLockEvent = `if(ctxLock) {
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

const ctxLockVisEvent = `if(ctxLock) {
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
        }
        
        if(ctxVisibility) {
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

content = content.replace(ctxLockEvent, ctxLockVisEvent);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed canvas hit detection and added visibility icon.");
