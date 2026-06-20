const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove HTML
const htmlTarget = `                    <button id="btnToggleLayout" class="px-3 py-2.5 text-xs font-semibold text-left text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white flex items-center gap-2">
                        <i data-lucide="panel-right" id="iconLayout" class="w-3.5 h-3.5"></i> Swap Layout
                    </button>`;
if (content.includes(htmlTarget)) {
    content = content.replace(htmlTarget + '\n', '');
    console.log("Removed HTML.");
}

// 2. Remove JS Declaration
const jsDeclTarget = `        const btnToggleLayout = document.getElementById('btnToggleLayout');`;
if (content.includes(jsDeclTarget)) {
    content = content.replace(jsDeclTarget + '\n', '');
    console.log("Removed JS Decl.");
}

// 3. Remove JS Logic
const jsLogicTarget = `        btnToggleLayout.addEventListener('click', () => {
            State.layout.isSideBySide = !State.layout.isSideBySide;
            if (State.layout.isSideBySide) {
                mainWorkspace.classList.remove('flex-col');
                mainWorkspace.classList.add('flex-col', 'sm:flex-row'); 
                
                previewContainer.classList.remove('w-full', 'border-b');
                previewContainer.classList.add('sm:border-l', 'order-first', 'sm:order-last');
                
                previewContainer.classList.remove('h-[45%]');
                previewContainer.classList.add('h-[40%]', 'sm:w-[35%]', 'sm:min-w-[300px]', 'sm:h-full');
                
                iconLayout.setAttribute('data-lucide', 'panel-top');
            } else {
                mainWorkspace.classList.remove('flex-col', 'sm:flex-row');
                mainWorkspace.classList.add('flex-col');
                
                previewContainer.classList.remove('sm:border-l', 'order-first', 'sm:order-last');
                previewContainer.classList.add('w-full', 'border-b');
                
                previewContainer.classList.remove('h-[40%]', 'sm:w-[35%]', 'sm:min-w-[300px]', 'sm:h-full');
                previewContainer.classList.add('h-[45%]');
                
                iconLayout.setAttribute('data-lucide', 'panel-right');
            }
            lucide.createIcons();
            setTimeout(() => { updateTimelineWidth(); drawRuler(); resizeCanvas(); }, 10);
        });`;

if (content.includes(jsLogicTarget)) {
    content = content.replace(jsLogicTarget + '\n', '');
    console.log("Removed JS Logic.");
}

fs.writeFileSync(file, content);
console.log("Done");
