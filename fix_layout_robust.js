const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

const oldToggleLayout = `        btnToggleLayout.addEventListener('click', () => {
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

const newToggleLayout = `        btnToggleLayout.addEventListener('click', () => {
            State.layout.isSideBySide = !State.layout.isSideBySide;
            const resizer = document.getElementById('timelineResizer');
            
            // Clear inline height/width from timeline resizing
            previewContainer.style.height = '';
            previewContainer.style.width = '';

            if (State.layout.isSideBySide) {
                mainWorkspace.classList.remove('flex-col');
                mainWorkspace.classList.add('flex-col', 'sm:flex-row'); 
                
                previewContainer.classList.remove('border-b');
                previewContainer.classList.add('sm:border-l', 'order-first', 'sm:order-last');
                
                previewContainer.classList.remove('h-[45%]');
                previewContainer.classList.add('sm:w-1/3', 'sm:min-w-[300px]', 'sm:h-full');
                
                if (resizer) resizer.style.display = 'none'; // Force hide over .flex
                
                iconLayout.setAttribute('data-lucide', 'panel-top');
            } else {
                mainWorkspace.classList.remove('flex-col', 'sm:flex-row');
                mainWorkspace.classList.add('flex-col');
                
                previewContainer.classList.remove('sm:border-l', 'order-first', 'sm:order-last');
                previewContainer.classList.add('border-b');
                
                previewContainer.classList.remove('sm:w-1/3', 'sm:min-w-[300px]', 'sm:h-full');
                previewContainer.classList.add('h-[45%]');
                
                if (resizer) resizer.style.display = 'flex'; // Restore flex display
                
                iconLayout.setAttribute('data-lucide', 'panel-right');
            }
            lucide.createIcons();
            setTimeout(() => { updateTimelineWidth(); drawRuler(); resizeCanvas(); }, 10);
        });`;

content = content.replace(oldToggleLayout, newToggleLayout);

// Also fix the toggle timeline logic just in case
const oldToggleTimeline = `        btnToggleTimeline.addEventListener('click', () => {
            const timelineContainer = document.getElementById('timelineContainer');
            const timelineResizer = document.getElementById('timelineResizer');
            if (timelineContainer.classList.contains('hidden')) {
                timelineContainer.classList.remove('hidden');
                if (timelineResizer) timelineResizer.classList.remove('hidden');
            } else {
                timelineContainer.classList.add('hidden');
                if (timelineResizer) timelineResizer.classList.add('hidden');
            }
            viewDropdown.classList.add('hidden');
            resizeCanvas();
        });`;

const newToggleTimeline = `        btnToggleTimeline.addEventListener('click', () => {
            const timelineContainer = document.getElementById('timelineContainer');
            const timelineResizer = document.getElementById('timelineResizer');
            if (timelineContainer.classList.contains('hidden')) {
                timelineContainer.classList.remove('hidden');
                // Only show resizer if we are NOT in side-by-side mode
                if (timelineResizer && !State.layout.isSideBySide) timelineResizer.style.display = 'flex';
            } else {
                timelineContainer.classList.add('hidden');
                if (timelineResizer) timelineResizer.style.display = 'none';
            }
            viewDropdown.classList.add('hidden');
            resizeCanvas();
        });`;

content = content.replace(oldToggleTimeline, newToggleTimeline);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Layout logic robustly fixed.");
