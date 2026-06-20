const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Handlers
const handlers = `
        // --- Quick Action Handlers ---
        function handleScaleUp() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip || !clip.effects) return;
            let current = clip.effects.scale !== undefined ? clip.effects.scale : 1;
            setClipEffect(clip.id, 'scale', Math.min(3, current * 1.1));
            updatePropertiesPanel();
        }
        function handleScaleDown() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip || !clip.effects) return;
            let current = clip.effects.scale !== undefined ? clip.effects.scale : 1;
            setClipEffect(clip.id, 'scale', Math.max(0, current * 0.9));
            updatePropertiesPanel();
        }
        function handleRotate() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip || !clip.effects) return;
            let current = clip.effects.rotate !== undefined ? clip.effects.rotate : 0;
            setClipEffect(clip.id, 'rotate', (current + 90) % 360);
            updatePropertiesPanel();
        }
        function handleFlipH() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip) return;
            if (!clip.effects) clip.effects = {};
            clip.effects.flipH = !clip.effects.flipH;
            drawCanvas();
        }
        function handleFlipV() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip) return;
            if (!clip.effects) clip.effects = {};
            clip.effects.flipV = !clip.effects.flipV;
            drawCanvas();
        }
        function handleCenterH() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip) return;
            if (!clip.effects) clip.effects = {};
            clip.effects.offsetX = 0;
            drawCanvas();
            updatePropertiesPanel();
        }
        function handleCenterV() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip) return;
            if (!clip.effects) clip.effects = {};
            clip.effects.offsetY = 0;
            drawCanvas();
            updatePropertiesPanel();
        }
        function handleToggleVis() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip) return;
            clip.hidden = !clip.hidden;
            drawCanvas();
            updatePropertiesPanel();
        }

        function updatePropertiesPanel() {`;
content = content.replace(/function updatePropertiesPanel\(\) \{/, handlers);

// 2. Keydown
const originalKeydown = `            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                if (e.key.toLowerCase() === 's') splitClipAtPlayhead();
                else if (e.key === 'Delete' || e.key === 'Backspace') deleteSelectedClip();
                else if (e.code === 'Space') { 
                    e.preventDefault(); 
                    togglePlay(); 
                }
            });`;

const newKeydown = `            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                const k = e.key.toLowerCase();
                
                if (k === 's') splitClipAtPlayhead();
                else if (e.key === 'Delete' || e.key === 'Backspace') deleteSelectedClip();
                else if (e.code === 'Space') { 
                    e.preventDefault(); 
                    togglePlay(); 
                }
                else if (k === '+' || k === '=') handleScaleUp();
                else if (k === '-' || k === '_') handleScaleDown();
                else if (k === 'r') handleRotate();
                else if (k === 'h') {
                    if (e.shiftKey) handleCenterH();
                    else handleFlipH();
                }
                else if (k === 'v') {
                    if (e.shiftKey) handleCenterV();
                    else handleFlipV();
                }
                else if (k === '\\\\') handleToggleVis();
            });`;
content = content.replace(originalKeydown, newKeydown);

// 3. drawCanvas scale
content = content.replace(
    /ctx\.scale\(finalScale, finalScale\);/g,
    "ctx.scale(finalScale * (clip.effects.flipH ? -1 : 1), finalScale * (clip.effects.flipV ? -1 : 1));"
);

// 4. drawCanvas filter
content = content.replace(
    /let activeVisualClips = State\.clips\.filter\(c =>\s*\n\s*\(c\.type === 'video' \|\| c\.type === 'image' \|\| c\.type === 'text'\) &&/g,
    `let activeVisualClips = State.clips.filter(c =>\n                    !c.hidden &&\n                    (c.type === 'video' || c.type === 'image' || c.type === 'text') &&`
);

// 5. updatePropertiesPanel UI
const regexUI = /let tabs = \[\];[\s\S]*?if\s*\(slider && activeTab\)\s*slider\.style\.background = `linear-gradient[\s\S]*?%;/m;
const replacementUI = `
            const isVis = !clip.hidden;
            if (clip.type === 'audio') {
                headerProperties.innerHTML = \`
                    <div class="flex items-center gap-2 pl-3 shrink-0 max-w-[200px]">
                        <div class="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style="background-color: \${PALETTES[clip.colorIndex].wave}"></div>
                        <span class="text-[12px] font-bold text-surface-700 dark:text-surface-300 truncate">\${clip.title}</span>
                    </div>
                \`;
            } else {
                headerProperties.innerHTML = \`
                    <div class="flex items-center gap-1.5 sm:gap-2 bg-surface-100 dark:bg-surface-800 p-1 rounded-lg border border-surface-200 dark:border-surface-700 shrink-0">
                        <button onclick="handleScaleUp()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Scale Up (+)">
                            <i data-lucide="zoom-in" class="w-4 h-4"></i>
                        </button>
                        <button onclick="handleScaleDown()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Scale Down (-)">
                            <i data-lucide="zoom-out" class="w-4 h-4"></i>
                        </button>
                        <div class="w-px h-4 bg-surface-200 dark:bg-surface-700 mx-0.5"></div>
                        <button onclick="handleRotate()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Rotate (R)">
                            <i data-lucide="rotate-cw" class="w-4 h-4"></i>
                        </button>
                        <button onclick="handleFlipH()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Flip Horizontal (H)">
                            <i data-lucide="flip-horizontal" class="w-4 h-4"></i>
                        </button>
                        <button onclick="handleFlipV()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Flip Vertical (V)">
                            <i data-lucide="flip-vertical" class="w-4 h-4"></i>
                        </button>
                        <div class="w-px h-4 bg-surface-200 dark:bg-surface-700 mx-0.5"></div>
                        <button onclick="handleCenterH()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Center Horizontally (Shift+H)">
                            <i data-lucide="align-horizontal-space-around" class="w-4 h-4"></i>
                        </button>
                        <button onclick="handleCenterV()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Center Vertically (Shift+V)">
                            <i data-lucide="align-vertical-space-around" class="w-4 h-4"></i>
                        </button>
                        <div class="w-px h-4 bg-surface-200 dark:bg-surface-700 mx-0.5"></div>
                        <button onclick="handleToggleVis()" class="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-900" title="Toggle Visibility (\\\\)">
                            <i data-lucide="\${isVis ? 'eye' : 'eye-off'}" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteSelectedClip()" class="p-1.5 rounded-md text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30" title="Delete (Del/Backspace)">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <div class="hidden lg:flex items-center gap-2 pl-3 border-l border-surface-200 dark:border-surface-700 shrink-0 max-w-[150px]">
                        <div class="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style="background-color: \${PALETTES[clip.colorIndex].wave}"></div>
                        <span class="text-[11px] font-semibold text-surface-700 dark:text-surface-300 truncate">\${clip.title}</span>
                    </div>
                \`;
            }
`;
content = content.replace(regexUI, replacementUI.trim());

fs.writeFileSync(file, content);
console.log('All patches applied!');
