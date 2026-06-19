const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Add global deleteElement function
const deleteFunc = `
        window.deleteElement = (id) => {
            state.elements = state.elements.filter(e => e.id !== id);
            if(state.selectedId === id) selectElement(null);
            else if(state.selectedIds && state.selectedIds.includes(id)) {
                state.selectedIds = state.selectedIds.filter(i => i !== id);
            }
            debouncedSave();
            updateUI();
            render();
        };

        function updateLayerList() {`;

content = content.replace('        function updateLayerList() {', deleteFunc);

// 2. Modify Layer List HTML
const oldLayerHtml = `
                    <div class="flex items-center gap-1">
                        <button onclick="event.stopPropagation(); window.toggleLock('\${el.id}')" class="text-pro-400 hover:text-pro-600 dark:hover:text-white p-1" title="Toggle Lock">
                            <i class="ph-bold \${el.locked ? 'ph-lock-key' : 'ph-lock-key-open'} text-lg"></i>
                        </button>
                        <button onclick="event.stopPropagation(); window.toggleVisibility('\${el.id}')" class="text-pro-400 hover:text-pro-600 dark:hover:text-white p-1" title="Toggle Visibility">
                            <i class="ph-bold \${el.hidden ? 'ph-eye-slash' : 'ph-eye'} text-lg"></i>
                        </button>
                    </div>`;

const newLayerHtml = `
                    <div class="flex items-center gap-1">
                        <button onclick="event.stopPropagation(); window.toggleLock('\${el.id}')" class="p-1 transition-colors \${el.locked ? 'text-brand-500 hover:text-brand-600' : 'text-pro-400 hover:text-pro-600 dark:text-pro-500 dark:hover:text-white'}" title="Toggle Lock">
                            <i class="\${el.locked ? 'ph-fill ph-lock-key' : 'ph-bold ph-lock-key-open'} text-lg"></i>
                        </button>
                        <button onclick="event.stopPropagation(); window.toggleVisibility('\${el.id}')" class="p-1 transition-colors \${el.hidden ? 'text-pro-300 dark:text-pro-600' : 'text-pro-400 hover:text-pro-600 dark:text-pro-500 dark:hover:text-white'}" title="Toggle Visibility">
                            <i class="\${el.hidden ? 'ph-bold ph-eye-slash' : 'ph-bold ph-eye'} text-lg"></i>
                        </button>
                        <button onclick="event.stopPropagation(); window.deleteElement('\${el.id}')" class="p-1 text-pro-400 hover:text-red-500 dark:text-pro-500 dark:hover:text-red-400 transition-colors" title="Delete Layer">
                            <i class="ph-bold ph-trash text-lg"></i>
                        </button>
                    </div>`;

content = content.replace(oldLayerHtml, newLayerHtml);

// 3. Add Bounding Box DOM overlay container
const oldContainer = `<div id="canvasContainer" class="relative bg-grid rounded-lg shadow-2xl ring-1 ring-pro-900/10 dark:ring-white/10 overflow-hidden shrink min-h-0" style="max-height: 100%; max-width: 100%; width: auto; aspect-ratio: 16/9;">
                    <canvas id="thumbCanvas" class="w-full h-full cursor-grab active:cursor-grabbing object-contain"></canvas>
                </div>`;
const newContainer = `<div id="canvasContainer" class="relative bg-grid rounded-lg shadow-2xl ring-1 ring-pro-900/10 dark:ring-white/10 shrink min-h-0" style="max-height: 100%; max-width: 100%; width: auto; aspect-ratio: 16/9;">
                    <canvas id="thumbCanvas" class="w-full h-full cursor-grab active:cursor-grabbing object-contain"></canvas>
                    <div id="domBoundingBoxContainer" class="absolute inset-0 pointer-events-none"></div>
                </div>`;
content = content.replace(oldContainer, newContainer);

// 4. Update render() function to use DOM bounding box instead of Canvas bounds
// We will replace the ctx.strokeRect block entirely.
const renderBoundingBoxMatch = `                    ctx.strokeRect(ox, oy, w, h);
                    
                    // Control Handle indicator
                    ctx.fillStyle = '#6366f1';
                    ctx.setLineDash([]);
                    ctx.beginPath();
                    ctx.arc(0, oy - 20 / (el.scale || 1), 6 / (el.scale || 1), 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();`;

const domBoundingBoxLogic = `                    ctx.restore();
                    
                    // --- DOM BOUNDING BOX ---
                    const domBoxContainer = document.getElementById('domBoundingBoxContainer');
                    if (domBoxContainer) {
                        const containerRect = document.getElementById('canvasContainer').getBoundingClientRect();
                        const scaleX = containerRect.width / CANVAS_WIDTH;
                        const scaleY = containerRect.height / CANVAS_HEIGHT;
                        
                        const elScale = el.scale || 1;
                        const wScaled = w * elScale;
                        const hScaled = h * elScale;
                        const oxScaled = ox * elScale;
                        const oyScaled = oy * elScale;

                        const left = (el.x + oxScaled) * scaleX;
                        const top = (el.y + oyScaled) * scaleY;
                        const width = wScaled * scaleX;
                        const height = hScaled * scaleY;

                        const box = document.createElement('div');
                        box.style.position = 'absolute';
                        box.style.left = \`\${left}px\`;
                        box.style.top = \`\${top}px\`;
                        box.style.width = \`\${width}px\`;
                        box.style.height = \`\${height}px\`;
                        box.style.transformOrigin = \`\${-oxScaled * scaleX}px \${-oyScaled * scaleY}px\`;
                        box.style.transform = \`rotate(\${el.rotation || 0}deg)\`;
                        box.style.border = '2px solid #6366f1';
                        
                        box.innerHTML = \`
                            <div style="position: absolute; top: -5px; left: -5px; width: 10px; height: 10px; background: white; border: 2px solid #6366f1; border-radius: 50%;"></div>
                            <div style="position: absolute; top: -5px; right: -5px; width: 10px; height: 10px; background: white; border: 2px solid #6366f1; border-radius: 50%;"></div>
                            <div style="position: absolute; bottom: -5px; left: -5px; width: 10px; height: 10px; background: white; border: 2px solid #6366f1; border-radius: 50%;"></div>
                            <div style="position: absolute; bottom: -5px; right: -5px; width: 10px; height: 10px; background: white; border: 2px solid #6366f1; border-radius: 50%;"></div>
                            <div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); width: 2px; height: 30px; background: #6366f1;"></div>
                            <div style="position: absolute; top: -35px; left: 50%; transform: translateX(-50%); width: 10px; height: 10px; border-radius: 50%; background: #6366f1; border: 2px solid white;"></div>
                        \`;
                        
                        domBoxContainer.appendChild(box);
                    }`;

content = content.replace(renderBoundingBoxMatch, domBoundingBoxLogic);

// We must also clear the domBoxContainer at the VERY START of render()
const renderStartMatch = `        function render() {
            if (!ctx) return;`;
const renderStartInject = `        function render() {
            if (!ctx) return;
            const domBoxContainer = document.getElementById('domBoundingBoxContainer');
            if(domBoxContainer) domBoxContainer.innerHTML = '';`;

content = content.replace(renderStartMatch, renderStartInject);

// Remove the canvas stroke styles that were previously applied
const canvasStrokeMatch = `                    ctx.strokeStyle = '#6366f1'; // Brand Indigo
                    ctx.lineWidth = 3 / (el.scale || 1);
                    ctx.setLineDash([10 / (el.scale || 1), 10 / (el.scale || 1)]);`;
content = content.replace(canvasStrokeMatch, '');

fs.writeFileSync(file, content);
console.log('Successfully patched studio_pro.html');
