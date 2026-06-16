const fs = require('fs');

const bannerPath = 'd:/Code/Antigravity/design_concepts/canvas-animator/thumb-maker ✅/youtube_banner_maker.html';
const thumbPath = 'd:/Code/Antigravity/design_concepts/canvas-animator/thumb-maker ✅/thumbnail_maker (12).html';

const bannerHTML = fs.readFileSync(bannerPath, 'utf8');
const thumbHTML = fs.readFileSync(thumbPath, 'utf8');

let newHTML = thumbHTML;

// 1. Theme Configuration
newHTML = newHTML.replace(/colors: {/g, "colors: { pro: { 50: '#f8f8f8', 100: '#eeeeee', 200: '#dddddd', 300: '#bbbbbb', 400: '#888888', 500: '#555555', 600: '#333333', 700: '#262626', 800: '#1a1a1a', 900: '#111111', 950: '#0a0a0a' },");

// 2. Replace slate with pro (and keep slate-50 logic if needed, but pro-50 is fine)
newHTML = newHTML.replace(/slate-/g, 'pro-');

// 3. Remove transitions
newHTML = newHTML.replace(/transition-[a-z-]+/g, '');
newHTML = newHTML.replace(/duration-\d+/g, '');

// 4. Update Header for Canvas Type Switcher
const headerMatch = newHTML.match(/<header.*?<\/header>/s);
if (headerMatch) {
    let header = headerMatch[0];
    header = header.replace('FireThumb', 'Studio Pro');
    // Inject Safe zones and Mode switcher
    const controls = `
        <div class="flex items-center gap-3">
            <label id="safeZoneToggleWrapper" class="flex items-center gap-2 cursor-pointer bg-pro-100 dark:bg-pro-900/50 px-3 py-1.5 rounded-full border border-pro-200 dark:border-pro-700 hidden">
                <span class="text-xs font-bold text-pro-600 dark:text-pro-300"><i class="ph-bold ph-bounding-box mr-1"></i>Safe Zones</span>
                <button type="button" id="toggleSafeZones" role="switch" class="w-8 h-4 bg-pro-300 dark:bg-pro-600 border border-pro-400 rounded-full relative">
                    <span class="w-3 h-3 bg-white rounded-full absolute left-0.5 top-[1px] pointer-events-none shadow-sm"></span>
                </button>
            </label>
            <select id="canvasType" class="bg-pro-100 dark:bg-pro-800 text-xs font-bold text-pro-800 dark:text-pro-200 px-2 py-1.5 rounded-md border border-pro-200 dark:border-pro-700 outline-none cursor-pointer">
                <option value="thumbnail">Thumbnail (1280x720)</option>
                <option value="banner">YT Banner (2560x1440)</option>
            </select>
    `;
    header = header.replace(/<div class="flex items-center gap-3">/, controls);
    newHTML = newHTML.replace(headerMatch[0], header);
}

// 5. Update Preset Data to include Banner presets
const bannerPresetsMatch = bannerHTML.match(/const presetData = \[[\\s\\S]*?\];/);
const thumbPresetsMatch = newHTML.match(/const presetData = \[[\\s\\S]*?\];/);

if (thumbPresetsMatch && bannerPresetsMatch) {
    const thumbData = thumbPresetsMatch[0].replace('const presetData = [', '').replace(/];$/, '');
    const bannerData = bannerPresetsMatch[0].replace('const presetData = [', '').replace(/];$/, '');
    
    const combinedPresets = `const presetData = [\n${thumbData},\n${bannerData}\n];`;
    newHTML = newHTML.replace(thumbPresetsMatch[0], combinedPresets);
}

// 6. Update Starter Presets UI
const presetsUIMatch = newHTML.match(/<div class="grid grid-cols-2 gap-2\">[\s\S]*?<\/div>/);
if (presetsUIMatch) {
    const newPresetsUI = `
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
    newHTML = newHTML.replace(presetsUIMatch[0], newPresetsUI);
}

// 7. Inject SafeZones drawing logic and Canvas resizing logic
const jsVarsMatch = newHTML.match(/const canvas = document.getElementById\('mainCanvas'\);/);
if (jsVarsMatch) {
    const injectedVars = `
        const canvasType = document.getElementById('canvasType');
        const toggleSafeZones = document.getElementById('toggleSafeZones');
        const safeZoneToggleWrapper = document.getElementById('safeZoneToggleWrapper');
        
        let CANVAS_WIDTH = 1280;
        let CANVAS_HEIGHT = 720;
        let showSafeZones = false;
        
        canvasType.addEventListener('change', (e) => {
            if (e.target.value === 'banner') {
                CANVAS_WIDTH = 2560;
                CANVAS_HEIGHT = 1440;
                safeZoneToggleWrapper.classList.remove('hidden');
            } else {
                CANVAS_WIDTH = 1280;
                CANVAS_HEIGHT = 720;
                safeZoneToggleWrapper.classList.add('hidden');
            }
            canvas.width = CANVAS_WIDTH;
            canvas.height = CANVAS_HEIGHT;
            render();
        });

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
        }

        const canvas = document.getElementById('mainCanvas');
    `;
    // We replace the original CANVAS_WIDTH/HEIGHT variables with the new logic
    newHTML = newHTML.replace(/const CANVAS_WIDTH = 1280;\s*const CANVAS_HEIGHT = 720;\s*const canvas = document\.getElementById\('mainCanvas'\);/, injectedVars);
}

// 8. Inject SafeZones call in render
const renderMatch = newHTML.match(/\/\/ Draw Selection Highlight/);
if (renderMatch) {
    const updatedRender = `
        if (showSafeZones && CANVAS_WIDTH === 2560) {
            drawSafeZones();
        }
        // Draw Selection Highlight
    `;
    newHTML = newHTML.replace(renderMatch[0], updatedRender);
}

// 9. Fix loadPreset to change canvas type
const loadPresetMatch = newHTML.match(/function loadPreset\(index\) {[\s\S]*?showToast\("Preset loaded successfully!"\);\s*}/);
if(loadPresetMatch) {
    let lp = loadPresetMatch[0];
    lp = lp.replace('state.elements = JSON.parse(JSON.stringify(presetData[index]));', `
        state.elements = JSON.parse(JSON.stringify(presetData[index]));
        if (index >= 4) {
            canvasType.value = 'banner';
            canvasType.dispatchEvent(new Event('change'));
        } else {
            canvasType.value = 'thumbnail';
            canvasType.dispatchEvent(new Event('change'));
        }
    `);
    newHTML = newHTML.replace(loadPresetMatch[0], lp);
}

// Output to studio_pro.html
fs.writeFileSync('d:/Code/Antigravity/design_concepts/canvas-animator/thumb-maker ✅/studio_pro.html', newHTML);
console.log('Merge complete. Output saved to studio_pro.html');
