const fs = require('fs');

let html = fs.readFileSync('audio-editor ✅✅/studiopro_editor_text.html', 'utf8');

// 1. Update updateCanvasResolution
let oldUpdateRes = `        function updateCanvasResolution() {
            const canvas = document.getElementById('renderCanvas');
            const aspectStr = ASPECT_RATIOS[State.preview.aspectIndex].value;
            const [wRatio, hRatio] = aspectStr.split('/').map(Number);
            
            let targetW, targetH;
            if (wRatio >= hRatio) {
                targetW = 1920;
                targetH = 1920 * (hRatio / wRatio);
            } else {
                targetH = 1920;
                targetW = 1920 * (wRatio / hRatio);
            }`;
let newUpdateRes = `        function updateCanvasResolution() {
            const canvas = document.getElementById('renderCanvas');
            const aspectStr = ASPECT_RATIOS[State.preview.aspectIndex].value;
            const [wRatio, hRatio] = aspectStr.split('/').map(Number);
            
            const baseRes = State.exportResolution || 1920;
            
            let targetW, targetH;
            if (wRatio >= hRatio) {
                targetW = baseRes;
                targetH = baseRes * (hRatio / wRatio);
            } else {
                targetH = baseRes;
                targetW = baseRes * (wRatio / hRatio);
            }`;
html = html.replace(oldUpdateRes, newUpdateRes);

// 2. Add Resolution UI into Export Modal
let oldDurationScope = `                <div>
                    <label class="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-2">Duration Scope</label>`;
let newResolutionBlock = `                <div>
                    <label class="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-2">Resolution</label>
                    <div class="grid grid-cols-3 gap-2">
                        <label class="cursor-pointer">
                            <input type="radio" name="exportResolution" value="1920" class="peer sr-only" checked>
                            <div class="px-2 py-2 border border-surface-200 dark:border-surface-700 rounded-lg peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-700 text-surface-900 dark:text-surface-300 peer-checked:text-brand-700 dark:peer-checked:text-white hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors shadow-sm text-center">
                                <div class="font-bold text-[13px] mb-0.5">1080p</div>
                                <div class="text-[10px] opacity-70">HD</div>
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" name="exportResolution" value="2560" class="peer sr-only">
                            <div class="px-2 py-2 border border-surface-200 dark:border-surface-700 rounded-lg peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-700 text-surface-900 dark:text-surface-300 peer-checked:text-brand-700 dark:peer-checked:text-white hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors shadow-sm text-center">
                                <div class="font-bold text-[13px] mb-0.5">1440p</div>
                                <div class="text-[10px] opacity-70">2K</div>
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" name="exportResolution" value="3840" class="peer sr-only">
                            <div class="px-2 py-2 border border-surface-200 dark:border-surface-700 rounded-lg peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-700 text-surface-900 dark:text-surface-300 peer-checked:text-brand-700 dark:peer-checked:text-white hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors shadow-sm text-center">
                                <div class="font-bold text-[13px] mb-0.5">2160p</div>
                                <div class="text-[10px] opacity-70">4K</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mb-2">Duration Scope</label>`;
html = html.replace(oldDurationScope, newResolutionBlock);

// 3. Update submitExport
let oldSubmit = `        function submitExport() {
            const format = document.querySelector('input[name="exportFormat"]:checked').value;
            const scope = document.querySelector('input[name="exportScope"]:checked').value;`;
let newSubmit = `        function submitExport() {
            const format = document.querySelector('input[name="exportFormat"]:checked').value;
            const scope = document.querySelector('input[name="exportScope"]:checked').value;
            State.exportResolution = parseInt(document.querySelector('input[name="exportResolution"]:checked').value);`;
html = html.replace(oldSubmit, newSubmit);

// 4. Reset resolution in recorder.onstop and cancelExport
let oldStop = `                State.isExporting = false;
                closeExportModal();
                stopMedia();`;
let newStop = `                State.isExporting = false;
                State.exportResolution = 1920;
                closeExportModal();
                stopMedia();`;
html = html.replace(oldStop, newStop);

let oldCancel = `        function cancelExport() {
            if (State.isExporting) {
                State.cancelExport = true;
            } else {
                closeExportModal();
            }
        }`;
let newCancel = `        function cancelExport() {
            if (State.isExporting) {
                State.cancelExport = true;
            } else {
                State.exportResolution = 1920;
                closeExportModal();
            }
        }`;
html = html.replace(oldCancel, newCancel);

fs.writeFileSync('audio-editor ✅✅/studiopro_editor_text.html', html, 'utf8');
console.log('Resolution logic injected!');
