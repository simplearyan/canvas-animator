const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Update Timeline Resizer HTML
content = content.replace(
    `class="h-1.5 w-full bg-surface-200 dark:bg-surface-800 cursor-row-resize shrink-0 z-20 flex items-center justify-center relative"`,
    `class="h-1.5 w-full bg-surface-200 dark:bg-surface-800 cursor-row-resize shrink-0 z-20 flex flex-col items-center justify-center relative"`
);

// 2. Update Timeline Resizer Logic
const targetTimelineResizerAddEvent = `        if (timelineResizer && previewContainer) {
            timelineResizer.addEventListener('mousedown', (e) => {
                isResizingTimeline = true;
                startTimelineY = e.clientY;
                startPreviewHeight = previewContainer.offsetHeight;
                document.body.style.cursor = 'row-resize';
                document.body.style.userSelect = 'none';
            });`;

const newTimelineResizerAddEvent = `        let startTimelineX = 0;
        let startPreviewWidth = 0;
        if (timelineResizer && previewContainer) {
            timelineResizer.addEventListener('mousedown', (e) => {
                isResizingTimeline = true;
                startTimelineY = e.clientY;
                startTimelineX = e.clientX;
                startPreviewHeight = previewContainer.offsetHeight;
                startPreviewWidth = previewContainer.offsetWidth;
                document.body.style.cursor = (State.preview && State.preview.position === 'right') ? 'col-resize' : 'row-resize';
                document.body.style.userSelect = 'none';
            });`;

content = content.replace(targetTimelineResizerAddEvent, newTimelineResizerAddEvent);

const targetTimelineMousemove = `            window.addEventListener('mousemove', (e) => {
                if (!isResizingTimeline) return;
                const dy = e.clientY - startTimelineY;
                let newHeight = startPreviewHeight + dy;
                // Constraints
                const mainAppWrapper = document.getElementById('mainAppWrapper');
                const maxH = mainAppWrapper.offsetHeight - 140; // Leave space for timeline
                newHeight = Math.max(100, Math.min(maxH, newHeight));
                previewContainer.style.height = \`\${newHeight}px\`;
                resizeCanvas();
            });`;

const newTimelineMousemove = `            window.addEventListener('mousemove', (e) => {
                if (!isResizingTimeline) return;
                
                if (State.preview && State.preview.position === 'right') {
                    const dx = e.clientX - startTimelineX;
                    let newWidth = startPreviewWidth - dx; 
                    newWidth = Math.max(200, Math.min(window.innerWidth - 300, newWidth));
                    previewContainer.style.width = \`\${newWidth}px\`;
                } else {
                    const dy = e.clientY - startTimelineY;
                    let newHeight = startPreviewHeight + dy;
                    const mainAppWrapper = document.getElementById('mainAppWrapper');
                    const maxH = mainAppWrapper.offsetHeight - 140; 
                    newHeight = Math.max(100, Math.min(maxH, newHeight));
                    previewContainer.style.height = \`\${newHeight}px\`;
                }
                resizeCanvas();
            });`;

content = content.replace(targetTimelineMousemove, newTimelineMousemove);

// 3. Update Canvas Pos Layout toggle to handle timelineResizer classes properly
const oldCanvasPosHidden = `timelineResizer.classList.add('hidden');`;
const newCanvasPosCol = `timelineResizer.classList.remove('h-1.5', 'w-full', 'cursor-row-resize', 'flex-col');
                timelineResizer.classList.add('w-1.5', 'h-full', 'cursor-col-resize', 'flex-row');`;
content = content.replace(oldCanvasPosHidden, newCanvasPosCol);

const oldCanvasPosShow = `timelineResizer.classList.remove('hidden');`;
const newCanvasPosRow = `timelineResizer.classList.remove('w-1.5', 'h-full', 'cursor-col-resize', 'flex-row');
                timelineResizer.classList.add('h-1.5', 'w-full', 'cursor-row-resize', 'flex-col');`;
content = content.replace(oldCanvasPosShow, newCanvasPosRow);

// 4. Update Inspector Layout Logic
const oldResizerClasses = `            const resizer = document.getElementById('inspectorResizer');
            if (resizer) {
                resizer.classList.add('hidden');
                resizer.classList.remove('left-0', 'right-0', '-translate-x-1/2', 'translate-x-1/2');
            }`;
const newResizerClasses = `            const resizer = document.getElementById('inspectorResizer');
            if (resizer) {
                resizer.classList.add('hidden');
                resizer.classList.remove('left-0', 'right-0', 'top-0', 'bottom-0', '-translate-x-1/2', 'translate-x-1/2', '-translate-y-1/2', 'translate-y-1/2', 'w-1', 'h-1', 'w-full', 'h-full', 'cursor-col-resize', 'cursor-row-resize');
            }`;
content = content.replace(oldResizerClasses, newResizerClasses);

// Inject height for bottom/top and classes for resizer
content = content.replace(`propertiesSidebar.classList.add('w-full', 'h-56', 'sm:h-64', 'border-t');`, `propertiesSidebar.classList.add('w-full', 'border-t'); propertiesSidebar.style.height = \`\${State.inspector.height || 256}px\`; if(resizer) { resizer.classList.remove('hidden'); resizer.classList.add('top-0', 'left-0', 'right-0', 'h-1', 'w-full', 'cursor-row-resize'); }`);
content = content.replace(`propertiesSidebar.classList.add('w-full', 'h-56', 'sm:h-64', 'border-b');`, `propertiesSidebar.classList.add('w-full', 'border-b'); propertiesSidebar.style.height = \`\${State.inspector.height || 256}px\`; if(resizer) { resizer.classList.remove('hidden'); resizer.classList.add('bottom-0', 'left-0', 'right-0', 'h-1', 'w-full', 'cursor-row-resize'); }`);
content = content.replace(`resizer.classList.add('left-0', '-translate-x-1/2');`, `resizer.classList.add('left-0', 'top-0', 'bottom-0', 'w-1', 'h-full', 'cursor-col-resize');`);
content = content.replace(`resizer.classList.add('right-0', 'translate-x-1/2');`, `resizer.classList.add('right-0', 'top-0', 'bottom-0', 'w-1', 'h-full', 'cursor-col-resize');`);

// 5. Update Inspector Resizer Mousemove
const oldInspMousedown = `        let startResizingX = 0;
        let startInspectorWidth = 0;

        if (resizer) {
            resizer.addEventListener('mousedown', (e) => {
                isResizingInspector = true;
                startResizingX = e.clientX;
                startInspectorWidth = propertiesSidebar.offsetWidth;
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
                e.preventDefault();
            });`;

const newInspMousedown = `        let startResizingX = 0;
        let startResizingY = 0;
        let startInspectorWidth = 0;
        let startInspectorHeight = 0;

        if (resizer) {
            resizer.addEventListener('mousedown', (e) => {
                isResizingInspector = true;
                startResizingX = e.clientX;
                startResizingY = e.clientY;
                startInspectorWidth = propertiesSidebar.offsetWidth;
                startInspectorHeight = propertiesSidebar.offsetHeight;
                document.body.style.cursor = (State.inspector.dock === 'bottom' || State.inspector.dock === 'top') ? 'row-resize' : 'col-resize';
                document.body.style.userSelect = 'none';
                e.preventDefault();
            });`;
content = content.replace(oldInspMousedown, newInspMousedown);

const oldInspMousemove = `            window.addEventListener('mousemove', (e) => {
                if (!isResizingInspector) return;
                
                const dx = e.clientX - startResizingX;
                let newWidth = startInspectorWidth;
                
                if (State.inspector.dock === 'right') {
                    newWidth = startInspectorWidth - dx;
                } else if (State.inspector.dock === 'left') {
                    newWidth = startInspectorWidth + dx;
                }
                
                // Clamp width between 200 and 800
                newWidth = Math.max(200, Math.min(800, newWidth));
                State.inspector.width = newWidth;
                propertiesSidebar.style.width = \`\${newWidth}px\`;
                
                // Request animation frame for smooth redraw
                requestAnimationFrame(() => {
                    updateTimelineWidth();
                    drawRuler();
                    resizeCanvas();
                });
            });`;

const newInspMousemove = `            window.addEventListener('mousemove', (e) => {
                if (!isResizingInspector) return;
                
                if (State.inspector.dock === 'right' || State.inspector.dock === 'left') {
                    const dx = e.clientX - startResizingX;
                    let newWidth = startInspectorWidth;
                    
                    if (State.inspector.dock === 'right') {
                        newWidth = startInspectorWidth - dx;
                    } else if (State.inspector.dock === 'left') {
                        newWidth = startInspectorWidth + dx;
                    }
                    
                    newWidth = Math.max(200, Math.min(800, newWidth));
                    State.inspector.width = newWidth;
                    propertiesSidebar.style.width = \`\${newWidth}px\`;
                } else {
                    const dy = e.clientY - startResizingY;
                    let newHeight = startInspectorHeight;
                    
                    if (State.inspector.dock === 'bottom') {
                        newHeight = startInspectorHeight - dy;
                    } else if (State.inspector.dock === 'top') {
                        newHeight = startInspectorHeight + dy;
                    }
                    
                    newHeight = Math.max(100, Math.min(600, newHeight));
                    State.inspector.height = newHeight;
                    propertiesSidebar.style.height = \`\${newHeight}px\`;
                }
                
                // Request animation frame for smooth redraw
                requestAnimationFrame(() => {
                    updateTimelineWidth();
                    drawRuler();
                    resizeCanvas();
                });
            });`;
content = content.replace(oldInspMousemove, newInspMousemove);

// 6. Fix resizer DOM initial classes
content = content.replace(
    `<div id="inspectorResizer" class="hidden absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-brand-500 z-50 transition-colors"></div>`,
    `<div id="inspectorResizer" class="hidden absolute hover:bg-brand-500 z-50 transition-colors"></div>`
);

fs.writeFileSync(file, content);
console.log("Done");
