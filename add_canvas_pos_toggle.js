const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Add the HTML button for Canvas Position in viewDropdown
const insertAfterHtml = `<button id="btnToggleInspector" class="px-3 py-2.5 text-xs font-semibold text-left text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white flex items-center gap-2">
                        <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5"></i> Inspector
                    </button>`;
const buttonHtml = `
                    <button id="btnToggleCanvasPos" class="px-3 py-2.5 text-xs font-semibold text-left text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white flex items-center gap-2">
                        <i data-lucide="layout-template" id="iconCanvasPos" class="w-3.5 h-3.5"></i> Canvas Position
                    </button>`;

if (content.includes(insertAfterHtml)) {
    content = content.replace(insertAfterHtml, insertAfterHtml + buttonHtml);
    console.log("Button HTML added.");
} else {
    console.log("Could not find insert target for HTML button.");
}

// 2. Add the JS Logic
const insertAfterJs = `        btnToggleInspector.addEventListener('click', () => {`;
const jsLogic = `
        const btnToggleCanvasPos = document.getElementById('btnToggleCanvasPos');
        const iconCanvasPos = document.getElementById('iconCanvasPos');
        
        btnToggleCanvasPos.addEventListener('click', () => {
            State.preview = State.preview || { hidden: false };
            State.preview.position = State.preview.position === 'right' ? 'top' : 'right';
            
            if (State.preview.position === 'right') {
                mainWorkspace.classList.remove('flex-col');
                mainWorkspace.classList.add('flex-row'); 
                
                previewContainer.classList.remove('w-full', 'border-b');
                previewContainer.classList.add('border-l', 'order-last');
                
                previewContainer.style.height = ''; 
                previewContainer.classList.remove('h-[45%]');
                previewContainer.classList.add('w-[40%]', 'min-w-[300px]', 'h-full');
                
                timelineResizer.classList.add('hidden');
                iconCanvasPos.setAttribute('data-lucide', 'panel-right');
            } else {
                mainWorkspace.classList.remove('flex-row');
                mainWorkspace.classList.add('flex-col');
                
                previewContainer.classList.remove('border-l', 'order-last');
                previewContainer.classList.add('w-full', 'border-b');
                
                previewContainer.style.width = '';
                previewContainer.classList.remove('w-[40%]', 'min-w-[300px]', 'h-full');
                previewContainer.classList.add('h-[45%]');
                
                timelineResizer.classList.remove('hidden');
                iconCanvasPos.setAttribute('data-lucide', 'layout-template');
            }
            lucide.createIcons();
            setTimeout(() => { updateTimelineWidth(); drawRuler(); resizeCanvas(); }, 10);
        });

        btnToggleInspector.addEventListener('click', () => {`;

if (content.includes(insertAfterJs)) {
    content = content.replace(insertAfterJs, jsLogic);
    console.log("JS Logic added.");
} else {
    console.log("Could not find insert target for JS logic.");
}

fs.writeFileSync(file, content);
console.log("Done");
