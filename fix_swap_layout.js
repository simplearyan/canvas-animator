const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

const oldLogic = `        btnToggleLayout.addEventListener('click', () => {
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

const newLogic = `        btnToggleLayout.addEventListener('click', () => {
            State.layout.isSideBySide = !State.layout.isSideBySide;
            const resizer = document.getElementById('timelineResizer');
            
            // Clear inline height from timeline resizing
            previewContainer.style.height = '';

            if (State.layout.isSideBySide) {
                mainWorkspace.classList.remove('flex-col');
                mainWorkspace.classList.add('flex-col', 'sm:flex-row'); 
                
                previewContainer.classList.remove('w-full', 'border-b');
                previewContainer.classList.add('sm:border-l', 'order-first', 'sm:order-last');
                
                previewContainer.classList.remove('h-[45%]');
                previewContainer.classList.add('h-[40%]', 'sm:w-[35%]', 'sm:min-w-[300px]', 'sm:h-full');
                
                if (resizer) resizer.classList.add('hidden');
                
                iconLayout.setAttribute('data-lucide', 'panel-top');
            } else {
                mainWorkspace.classList.remove('flex-col', 'sm:flex-row');
                mainWorkspace.classList.add('flex-col');
                
                previewContainer.classList.remove('sm:border-l', 'order-first', 'sm:order-last');
                previewContainer.classList.add('w-full', 'border-b');
                
                previewContainer.classList.remove('h-[40%]', 'sm:w-[35%]', 'sm:min-w-[300px]', 'sm:h-full');
                previewContainer.classList.add('h-[45%]');
                
                if (resizer) resizer.classList.remove('hidden');
                
                iconLayout.setAttribute('data-lucide', 'panel-right');
            }
            lucide.createIcons();
            setTimeout(() => { updateTimelineWidth(); drawRuler(); resizeCanvas(); }, 10);
        });`;

content = content.replace(oldLogic, newLogic);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Swap layout fixed.");
