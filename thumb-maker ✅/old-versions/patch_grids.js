const fs = require('fs');

function patchGrids() {
    let s = fs.readFileSync('studio_pro.html', 'utf8');

    // 1. Replace the UI toggle
    const toggleHTML = `<label id="safeZoneToggleWrapper" class="flex items-center gap-2 cursor-pointer bg-pro-100 dark:bg-pro-900/50 px-3 py-1.5 rounded-full border border-pro-200 dark:border-pro-700 hidden">
                <span class="text-xs font-bold text-pro-600 dark:text-pro-300"><i class="ph-bold ph-bounding-box mr-1"></i>Safe Zones</span>
                <button type="button" id="toggleSafeZones" role="switch" class="w-8 h-4 bg-pro-300 dark:bg-pro-600 border border-pro-400 rounded-full relative">
                    <span class="w-3 h-3 bg-white rounded-full absolute left-0.5 top-[1px] pointer-events-none shadow-sm"></span>
                </button>
            </label>`;
            
    const newUI = `<div id="gridGuideWrapper" class="flex items-center gap-2 bg-pro-100 dark:bg-pro-900/50 px-2 py-1.5 rounded border border-pro-200 dark:border-pro-700">
                <i class="ph-bold ph-grid-four text-pro-500"></i>
                <select id="gridGuideSelect" class="bg-transparent text-xs font-bold text-pro-800 dark:text-pro-200 outline-none cursor-pointer">
                    <option value="none">No Grid</option>
                    <option value="safe">Safe Zones</option>
                    <option value="cinematic">Cinematic (Thirds)</option>
                    <option value="golden">Golden Ratio</option>
                    <option value="design">Design Grid</option>
                    <option value="typography">Typography Baseline</option>
                    <option value="eye">Viewer Eye Path</option>
                </select>
            </div>`;
    
    if (s.includes(toggleHTML)) {
        s = s.replace(toggleHTML, newUI);
        console.log("Replaced toggle UI.");
    } else {
        console.log("Could not find exact toggleHTML. Trying fallback regex.");
        const fallbackRegex = /<label id="safeZoneToggleWrapper"[\s\S]*?<\/label>/;
        s = s.replace(fallbackRegex, newUI);
    }

    // 2. Replace JS listeners
    const oldJS = `const toggleSafeZones = document.getElementById('toggleSafeZones');
        let showSafeZones = false;
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
        }`;

    const newJS = `const gridGuideSelect = document.getElementById('gridGuideSelect');
        let currentGrid = 'none';
        if (gridGuideSelect) {
            gridGuideSelect.addEventListener('change', (e) => {
                currentGrid = e.target.value;
                render();
            });
        }`;
    
    // We can just use a regex for this whole block
    const jsRegex = /const toggleSafeZones = document\.getElementById\('toggleSafeZones'\);[\s\S]*?render\(\);\s*\}\);\s*\}/;
    if (jsRegex.test(s)) {
        s = s.replace(jsRegex, newJS);
        console.log("Replaced JS listener.");
    } else {
        console.log("Could not find JS listener block.");
    }

    // 3. Inject new drawing functions and `drawSelectedGrid()`
    const newFunctions = `
        function drawSelectedGrid() {
            switch (currentGrid) {
                case 'safe':
                    if (CANVAS_WIDTH === 2560) drawSafeZones();
                    else drawThumbnailSafeZones();
                    break;
                case 'cinematic':
                    drawCinematicGrid();
                    break;
                case 'golden':
                    drawGoldenRatio();
                    break;
                case 'design':
                    drawDesignGrid();
                    break;
                case 'typography':
                    drawTypographyGrid();
                    break;
                case 'eye':
                    drawEyePath();
                    break;
            }
        }

        function drawThumbnailSafeZones() {
            ctx.save();
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'rgba(255, 50, 50, 0.8)';
            
            ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.fillRect(CANVAS_WIDTH - 250, CANVAS_HEIGHT - 100, 250, 100);
            ctx.strokeRect(CANVAS_WIDTH - 250, CANVAS_HEIGHT - 100, 250, 100);
            
            ctx.fillRect(CANVAS_WIDTH - 150, 0, 150, 100);
            ctx.strokeRect(CANVAS_WIDTH - 150, 0, 150, 100);
            
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.fillStyle = 'white';
            ctx.setLineDash([]);
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 4;
            ctx.fillText('Time Indicator Area', CANVAS_WIDTH - 240, CANVAS_HEIGHT - 40);
            ctx.fillText('Icons', CANVAS_WIDTH - 130, 50);
            ctx.restore();
        }

        function drawCinematicGrid() {
            ctx.save();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            
            const thirdW = CANVAS_WIDTH / 3;
            const thirdH = CANVAS_HEIGHT / 3;
            
            ctx.beginPath();
            ctx.moveTo(thirdW, 0); ctx.lineTo(thirdW, CANVAS_HEIGHT);
            ctx.moveTo(thirdW * 2, 0); ctx.lineTo(thirdW * 2, CANVAS_HEIGHT);
            ctx.moveTo(0, thirdH); ctx.lineTo(CANVAS_WIDTH, thirdH);
            ctx.moveTo(0, thirdH * 2); ctx.lineTo(CANVAS_WIDTH, thirdH * 2);
            ctx.stroke();

            ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
            [thirdW, thirdW * 2].forEach(x => {
                [thirdH, thirdH * 2].forEach(y => {
                    ctx.beginPath();
                    ctx.arc(x, y, 12, 0, Math.PI * 2);
                    ctx.fill();
                });
            });
            ctx.restore();
        }

        function drawGoldenRatio() {
            ctx.save();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
            
            const phi = 1.61803398875;
            const w1 = CANVAS_WIDTH / phi;
            const w2 = CANVAS_WIDTH - w1;
            const h1 = CANVAS_HEIGHT / phi;
            const h2 = CANVAS_HEIGHT - h1;

            ctx.beginPath();
            ctx.moveTo(w1, 0); ctx.lineTo(w1, CANVAS_HEIGHT);
            ctx.moveTo(w2, 0); ctx.lineTo(w2, CANVAS_HEIGHT);
            ctx.moveTo(0, h1); ctx.lineTo(CANVAS_WIDTH, h1);
            ctx.moveTo(0, h2); ctx.lineTo(CANVAS_WIDTH, h2);
            ctx.stroke();
            
            ctx.font = 'bold 20px Inter, sans-serif';
            ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
            ctx.shadowColor = 'black'; ctx.shadowBlur = 4;
            ctx.fillText('Golden Ratio (1 : 1.618)', 30, 40);
            ctx.restore();
        }

        function drawDesignGrid() {
            ctx.save();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
            
            const cols = 12;
            const colWidth = CANVAS_WIDTH / cols;
            for (let i = 1; i < cols; i++) {
                ctx.beginPath();
                ctx.moveTo(i * colWidth, 0);
                ctx.lineTo(i * colWidth, CANVAS_HEIGHT);
                ctx.stroke();
                
                ctx.fillStyle = 'rgba(100, 200, 255, 0.5)';
                ctx.fillRect(i * colWidth - 10, 0, 20, CANVAS_HEIGHT);
            }
            
            const rows = 10;
            const rowHeight = CANVAS_HEIGHT / rows;
            for (let i = 1; i < rows; i++) {
                ctx.beginPath();
                ctx.moveTo(0, i * rowHeight);
                ctx.lineTo(CANVAS_WIDTH, i * rowHeight);
                ctx.stroke();
            }
            ctx.restore();
        }

        function drawTypographyGrid() {
            ctx.save();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(50, 255, 150, 0.4)';
            
            const spacing = 40;
            for (let y = spacing; y < CANVAS_HEIGHT; y += spacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(CANVAS_WIDTH, y);
                ctx.stroke();
            }
            ctx.fillStyle = 'rgba(50, 255, 150, 0.8)';
            ctx.font = 'bold 16px Inter';
            ctx.shadowColor = 'black'; ctx.shadowBlur = 4;
            ctx.fillText('Baseline Grid (40px)', 20, 30);
            ctx.restore();
        }

        function drawEyePath() {
            ctx.save();
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'rgba(255, 100, 255, 0.6)';
            ctx.setLineDash([20, 15]);
            
            const padX = CANVAS_WIDTH * 0.15;
            const padY = CANVAS_HEIGHT * 0.15;
            
            ctx.beginPath();
            ctx.moveTo(padX, padY);
            ctx.lineTo(CANVAS_WIDTH - padX, padY);
            ctx.lineTo(padX, CANVAS_HEIGHT - padY);
            ctx.lineTo(CANVAS_WIDTH - padX, CANVAS_HEIGHT - padY);
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(255, 100, 255, 0.9)';
            ctx.setLineDash([]);
            const points = [
                [padX, padY],
                [CANVAS_WIDTH - padX, padY],
                [padX, CANVAS_HEIGHT - padY],
                [CANVAS_WIDTH - padX, CANVAS_HEIGHT - padY]
            ];
            
            points.forEach((p, i) => {
                ctx.beginPath();
                ctx.arc(p[0], p[1], 30, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = 'white';
                ctx.font = 'bold 30px Inter';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText((i+1).toString(), p[0], p[1]);
                ctx.fillStyle = 'rgba(255, 100, 255, 0.9)';
            });
            ctx.restore();
        }

        function drawSafeZones() {`; // This just prefixes the existing drawSafeZones

    s = s.replace('function drawSafeZones() {', newFunctions);
    
    // 4. Update the render() function to call drawSelectedGrid() instead of drawSafeZones()
    const callRegex = /if\s*\(.*showSafeZones.*CANVAS_WIDTH === 2560\)\s*\{\s*drawSafeZones\(\);\s*\}/g;
    s = s.replace(callRegex, `if (typeof currentGrid !== 'undefined' && currentGrid !== 'none') {\n            drawSelectedGrid();\n        }`);

    // Some residual checks like `if(typeof showSafeZones !== 'undefined' && ...)` might exist if my regex missed them.
    // Let's just blindly replace them if they are there.
    const callRegex2 = /if \((typeof showSafeZones !== 'undefined' && showSafeZones|showSafeZones) && CANVAS_WIDTH === 2560\) \{\s*drawSafeZones\(\);\s*\}/g;
    s = s.replace(callRegex2, `if (typeof currentGrid !== 'undefined' && currentGrid !== 'none') {\n            drawSelectedGrid();\n        }`);

    fs.writeFileSync('studio_pro.html', s);
    console.log('Added grid guides.');
}

patchGrids();
