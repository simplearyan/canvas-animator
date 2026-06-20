const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Update Timeline Resizer HTML
content = content.replace(
    'class="h-1.5 w-full bg-surface-200 dark:bg-surface-800 cursor-row-resize shrink-0 z-20 flex items-center justify-center relative"',
    'class="h-1.5 w-full bg-surface-200 dark:bg-surface-800 cursor-row-resize shrink-0 z-20 flex flex-col items-center justify-center relative"'
);

// 2. Timeline Resizer mousedown logic
const startTLMouse = content.indexOf('if (timelineResizer && previewContainer) {');
const endTLMousedown = content.indexOf('});', startTLMouse + 100) + 3;

if (startTLMouse !== -1) {
    const newMousedown = `let startTimelineX = 0;
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
            
    content = content.substring(0, startTLMouse) + newMousedown + content.substring(endTLMousedown);
    console.log("Timeline mousedown patched.");
}

// 3. Timeline Resizer mousemove logic
const startTLMove = content.indexOf("window.addEventListener('mousemove', (e) => {", startTLMouse);
if (startTLMove !== -1) {
    const endTLMove = content.indexOf('resizeCanvas();\n            });', startTLMove) + 33;
    const newMousemove = `window.addEventListener('mousemove', (e) => {
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
            
    content = content.substring(0, startTLMove) + newMousemove + content.substring(endTLMove);
    console.log("Timeline mousemove patched.");
}

// 4. Update Canvas Layout Toggle classes
content = content.replace("timelineResizer.classList.add('hidden');", "timelineResizer.classList.remove('h-1.5', 'w-full', 'cursor-row-resize', 'flex-col'); timelineResizer.classList.add('w-1.5', 'h-full', 'cursor-col-resize', 'flex-row');");
content = content.replace("timelineResizer.classList.remove('hidden');", "timelineResizer.classList.remove('w-1.5', 'h-full', 'cursor-col-resize', 'flex-row'); timelineResizer.classList.add('h-1.5', 'w-full', 'cursor-row-resize', 'flex-col');");

// 5. Inspector Resizer Mousemove and classes
content = content.replace(
    "resizer.classList.remove('left-0', 'right-0', '-translate-x-1/2', 'translate-x-1/2');",
    "resizer.classList.remove('left-0', 'right-0', 'top-0', 'bottom-0', '-translate-x-1/2', 'translate-x-1/2', '-translate-y-1/2', 'translate-y-1/2', 'w-1', 'h-1', 'w-full', 'h-full', 'cursor-col-resize', 'cursor-row-resize');"
);

content = content.replace(
    "propertiesSidebar.classList.add('w-full', 'h-56', 'sm:h-64', 'border-t');", 
    "propertiesSidebar.classList.add('w-full', 'border-t'); propertiesSidebar.style.height = \`\${State.inspector.height || 256}px\`; if(resizer) { resizer.classList.remove('hidden'); resizer.classList.add('top-0', 'left-0', 'right-0', 'h-1', 'w-full', 'cursor-row-resize'); }"
);

content = content.replace(
    "propertiesSidebar.classList.add('w-full', 'h-56', 'sm:h-64', 'border-b');", 
    "propertiesSidebar.classList.add('w-full', 'border-b'); propertiesSidebar.style.height = \`\${State.inspector.height || 256}px\`; if(resizer) { resizer.classList.remove('hidden'); resizer.classList.add('bottom-0', 'left-0', 'right-0', 'h-1', 'w-full', 'cursor-row-resize'); }"
);

content = content.replace(
    "resizer.classList.add('left-0', '-translate-x-1/2');", 
    "resizer.classList.add('left-0', 'top-0', 'bottom-0', 'w-1', 'h-full', 'cursor-col-resize');"
);

content = content.replace(
    "resizer.classList.add('right-0', 'translate-x-1/2');", 
    "resizer.classList.add('right-0', 'top-0', 'bottom-0', 'w-1', 'h-full', 'cursor-col-resize');"
);

// 6. Inspector Resizer Events
const startInspMouse = content.indexOf('if (resizer) {\n            resizer.addEventListener(\'mousedown\',');
const endInspMousedown = content.indexOf('});', startInspMouse + 50) + 3;

if (startInspMouse !== -1) {
    const newInspMousedown = `let startResizingX = 0;
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
            
    content = content.substring(0, startInspMouse - 80) + newInspMousedown + content.substring(endInspMousedown);
    console.log("Inspector mousedown patched.");
}

const startInspMove = content.indexOf("window.addEventListener('mousemove', (e) => {", startInspMouse);
if (startInspMove !== -1) {
    const endInspMove = content.indexOf('resizeCanvas();\n                });\n            });', startInspMove) + 52;
    const newInspMousemove = `window.addEventListener('mousemove', (e) => {
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
                
                requestAnimationFrame(() => {
                    updateTimelineWidth();
                    drawRuler();
                    resizeCanvas();
                });
            });`;
            
    content = content.substring(0, startInspMove) + newInspMousemove + content.substring(endInspMove);
    console.log("Inspector mousemove patched.");
}

// 7. Fix Resizer Classes HTML
content = content.replace(
    `<div id="inspectorResizer" class="hidden absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-brand-500 z-50 transition-colors"></div>`,
    `<div id="inspectorResizer" class="hidden absolute hover:bg-brand-500 z-50 transition-colors"></div>`
);

fs.writeFileSync(file, content);
console.log("Done");
