const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Update Tooltips
content = content.replace('title="Decrease Scale"', 'title="Decrease Scale (-)"');
content = content.replace('title="Increase Scale"', 'title="Increase Scale (+)"');
content = content.replace('title="Lock Element"', 'title="Lock Element (L)"');
content = content.replace('title="Toggle Visibility"', 'title="Toggle Visibility (V)"');
content = content.replace('title="Delete Element"', 'title="Delete Element (Del)"');

// 2. Inject keydown listener
const targetInit = `        // Initial Render
        render();`;
const shortcutLogic = `        // Global Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            const isInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
            if (isInput) return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                const btn = document.getElementById('ctxDelete');
                if (btn) btn.click();
            } else if (e.key.toLowerCase() === 'v') {
                const btn = document.getElementById('ctxVisibility');
                if (btn) btn.click();
            } else if (e.key.toLowerCase() === 'l') {
                const btn = document.getElementById('ctxLock');
                if (btn) btn.click();
            } else if (e.key === '+' || e.key === '=') {
                const btn = document.getElementById('ctxScaleUp');
                if (btn) btn.click();
            } else if (e.key === '-' || e.key === '_') {
                const btn = document.getElementById('ctxScaleDown');
                if (btn) btn.click();
            }
        });

        // Initial Render
        render();`;

if (content.includes(targetInit)) {
    content = content.replace(targetInit, shortcutLogic);
    console.log("Shortcuts injected successfully");
} else {
    console.log("Target init not found");
}

fs.writeFileSync(file, content);
console.log("Done");
