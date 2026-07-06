const fs = require('fs');
let s = fs.readFileSync('studio_pro.html', 'utf8');

// 1. Fix tranpro typo
s = s.replace(/tranpro-/g, 'translate-');

// 2. Fix broken Starter Presets UI
const badUIStart = s.indexOf('<div class="grid grid-cols-2 gap-2">');
const badUIEnd = s.indexOf('</div>\n                    </div>\n                </div>\n\n                <!-- LAYERS PANEL -->');
if (badUIStart !== -1 && badUIEnd !== -1) {
    const fixedUI = `
        <div class="grid grid-cols-2 gap-2">
            <button class="preset-btn text-left bg-pro-50 dark:bg-pro-900 hover:bg-brand-50 dark:hover:bg-pro-800 border border-pro-200 dark:border-pro-700 hover:border-brand-300 dark:hover:border-pro-500 p-2.5 rounded-md group" data-preset="0">
                <div class="font-bold text-xs text-pro-800 dark:text-pro-200 group-hover:text-brand-600 dark:group-hover:text-white">The Classic (Thumb)</div>
            </button>
            <button class="preset-btn text-left bg-pro-50 dark:bg-pro-900 hover:bg-brand-50 dark:hover:bg-pro-800 border border-pro-200 dark:border-pro-700 hover:border-brand-300 dark:hover:border-pro-500 p-2.5 rounded-md group" data-preset="1">
                <div class="font-bold text-xs text-pro-800 dark:text-pro-200 group-hover:text-brand-600 dark:group-hover:text-white">Drama (Thumb)</div>
            </button>
            <button class="preset-btn text-left bg-pro-50 dark:bg-pro-900 hover:bg-brand-50 dark:hover:bg-pro-800 border border-pro-200 dark:border-pro-700 hover:border-brand-300 dark:hover:border-pro-500 p-2.5 rounded-md group" data-preset="4">
                <div class="font-bold text-xs text-pro-800 dark:text-pro-200 group-hover:text-brand-600 dark:group-hover:text-white">Tech (Banner)</div>
            </button>
            <button class="preset-btn text-left bg-pro-50 dark:bg-pro-900 hover:bg-brand-50 dark:hover:bg-pro-800 border border-pro-200 dark:border-pro-700 hover:border-brand-300 dark:hover:border-pro-500 p-2.5 rounded-md group" data-preset="5">
                <div class="font-bold text-xs text-pro-800 dark:text-pro-200 group-hover:text-brand-600 dark:group-hover:text-white">Gaming (Banner)</div>
            </button>
        </div>
    `;
    s = s.substring(0, badUIStart) + fixedUI.trim() + s.substring(badUIEnd);
}

// 3. Inject Canvas logic
const injectedVars = `
        let CANVAS_WIDTH = 1280;
        let CANVAS_HEIGHT = 720;

        // --- DOM Elements ---
        const canvas = document.getElementById('thumbCanvas');
        
        const canvasType = document.getElementById('canvasType');
        const toggleSafeZones = document.getElementById('toggleSafeZones');
        const safeZoneToggleWrapper = document.getElementById('safeZoneToggleWrapper');
        let showSafeZones = false;
        
        if (canvasType) {
            canvasType.addEventListener('change', (e) => {
                if (e.target.value === 'banner') {
                    CANVAS_WIDTH = 2560;
                    CANVAS_HEIGHT = 1440;
                    if(safeZoneToggleWrapper) safeZoneToggleWrapper.classList.remove('hidden');
                } else {
                    CANVAS_WIDTH = 1280;
                    CANVAS_HEIGHT = 720;
                    if(safeZoneToggleWrapper) safeZoneToggleWrapper.classList.add('hidden');
                }
                canvas.width = CANVAS_WIDTH;
                canvas.height = CANVAS_HEIGHT;
                render();
            });
        }

        if (toggleSafeZones) {
            toggleSafeZones.addEventListener('click', (e) => {
                showSafeZones = !showSafeZones;
                const thumb = toggleSafeZones.querySelector('span');
                if (showSafeZones) {
                    toggleSafeZones.classList.add('bg-brand-500', 'border-brand-600');
                    toggleSafeZones.classList.remove('bg-pro-300', 'dark:bg-pro-600', 'border-pro-400');
                    thumb.classList.add('translate-x-4');
                } else {
                    toggleSafeZones.classList.remove('bg-brand-500', 'border-brand-600');
                    toggleSafeZones.classList.add('bg-pro-300', 'dark:bg-pro-600', 'border-pro-400');
                    thumb.classList.remove('translate-x-4');
                }
                render();
            });
        }

        function drawSafeZones() {
            const cy = CANVAS_HEIGHT / 2;
            const cx = CANVAS_WIDTH / 2;

            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(0, 0, CANVAS_WIDTH, cy - 423/2);
            ctx.fillRect(0, cy + 423/2, CANVAS_WIDTH, CANVAS_HEIGHT - (cy + 423/2));
            ctx.fillRect(0, cy - 423/2, cx - 1546/2, 423);
            ctx.fillRect(cx + 1546/2, cy - 423/2, CANVAS_WIDTH - (cx + 1546/2), 423);

            ctx.lineWidth = 2;
            ctx.setLineDash([10, 10]);
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)';
            ctx.strokeRect(0, cy - 423/2, 2560, 423);
            
            ctx.strokeStyle = 'rgba(255, 200, 100, 0.8)';
            ctx.strokeRect(cx - 1855/2, cy - 423/2, 1855, 423);

            ctx.strokeStyle = 'rgba(100, 255, 100, 0.9)';
            ctx.strokeRect(cx - 1546/2, cy - 423/2, 1546, 423);

            ctx.font = 'bold 18px Inter, sans-serif';
            ctx.fillStyle = 'white';
            ctx.setLineDash([]);
            ctx.shadowColor = 'black'; 
            ctx.shadowBlur = 10;
            
            ctx.fillText('Desktop View (2560 x 423)', 30, cy - 423/2 + 30);
            ctx.fillText('Tablet View (1855 x 423)', cx - 1855/2 + 30, cy - 423/2 + 30);
            ctx.fillText('Mobile Safe Area (1546 x 423) - ALWAYS VISIBLE', cx - 1546/2 + 30, cy - 423/2 + 30);
            
            ctx.font = 'bold 32px Inter, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.textAlign = 'center';
            ctx.fillText('TV Only Area', cx, cy - 423/2 - 100);
            ctx.fillText('TV Only Area', cx, cy + 423/2 + 150);

            ctx.restore();
        }`;
        
s = s.replace(/const CANVAS_WIDTH = 1280;\s*const CANVAS_HEIGHT = 720;\s*\/\/\s*---\s*DOM\s*Elements\s*---\s*const canvas = document\.getElementById\('thumbCanvas'\);/, injectedVars);

// 4. Inject drawSafeZones into render()
s = s.replace('// Draw Selection Highlight', `
        if (typeof showSafeZones !== 'undefined' && showSafeZones && CANVAS_WIDTH === 2560) {
            drawSafeZones();
        }
        // Draw Selection Highlight`);

fs.writeFileSync('studio_pro.html', s);
console.log('Patch complete.');
