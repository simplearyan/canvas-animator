const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Inject UI Accordions before acc-shadow
const uiInjectionPoint = `<!-- Accordion: Normal Drop Shadow (Text & Image) -->`;
const imageUI = `
                        <!-- Accordion: Color Grading (Image Only) -->
                        <details id="acc-color-grading" class="bg-white dark:bg-pro-800 border border-pro-300 dark:border-pro-700 rounded-lg shadow-sm overflow-hidden hidden" open>
                            <summary class="flex justify-between items-center font-bold cursor-pointer p-3 bg-pro-100 dark:bg-pro-800/80 text-sm text-pro-800 dark:text-pro-200 select-none border-b border-pro-300 dark:border-pro-700">
                                <div class="flex items-center gap-2"><i class="ph-bold ph-sliders-horizontal text-pro-500 dark:text-pro-400"></i> Color Grading</div>
                                <i class="ph-bold ph-caret-down text-pro-500 dark:text-pro-400"></i>
                            </summary>
                            <div class="p-3 bg-pro-50 dark:bg-pro-900 space-y-3">
                                <div class="bg-white dark:bg-pro-800 border border-pro-200 dark:border-pro-700 p-3 rounded-md shadow-sm space-y-4">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Brightness</label>
                                            <span id="editImgBrightnessVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">100%</span>
                                        </div>
                                        <input type="range" id="editImgBrightness" min="0" max="200" value="100">
                                    </div>
                                    <hr class="border-pro-100 dark:border-pro-700">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Contrast</label>
                                            <span id="editImgContrastVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">100%</span>
                                        </div>
                                        <input type="range" id="editImgContrast" min="0" max="200" value="100">
                                    </div>
                                    <hr class="border-pro-100 dark:border-pro-700">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Saturation</label>
                                            <span id="editImgSaturationVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">100%</span>
                                        </div>
                                        <input type="range" id="editImgSaturation" min="0" max="200" value="100">
                                    </div>
                                    <hr class="border-pro-100 dark:border-pro-700">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Blur</label>
                                            <span id="editImgBlurVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">0px</span>
                                        </div>
                                        <input type="range" id="editImgBlur" min="0" max="50" value="0">
                                    </div>
                                </div>
                            </div>
                        </details>

                        <!-- Accordion: Color Correction (Image Only) -->
                        <details id="acc-color-correction" class="bg-white dark:bg-pro-800 border border-pro-300 dark:border-pro-700 rounded-lg shadow-sm overflow-hidden hidden" open>
                            <summary class="flex justify-between items-center font-bold cursor-pointer p-3 bg-pro-100 dark:bg-pro-800/80 text-sm text-pro-800 dark:text-pro-200 select-none border-b border-pro-300 dark:border-pro-700">
                                <div class="flex items-center gap-2"><i class="ph-bold ph-palette text-pro-500 dark:text-pro-400"></i> Color Correction</div>
                                <i class="ph-bold ph-caret-down text-pro-500 dark:text-pro-400"></i>
                            </summary>
                            <div class="p-3 bg-pro-50 dark:bg-pro-900 space-y-3">
                                <div class="bg-white dark:bg-pro-800 border border-pro-200 dark:border-pro-700 p-3 rounded-md shadow-sm space-y-4">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Temperature (C/W)</label>
                                            <span id="editImgTempVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">0</span>
                                        </div>
                                        <input type="range" id="editImgTemp" min="-100" max="100" value="0">
                                    </div>
                                    <hr class="border-pro-100 dark:border-pro-700">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Tint (G/M)</label>
                                            <span id="editImgTintVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">0</span>
                                        </div>
                                        <input type="range" id="editImgTint" min="-100" max="100" value="0">
                                    </div>
                                    <hr class="border-pro-100 dark:border-pro-700">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Vibrance</label>
                                            <span id="editImgVibranceVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">0</span>
                                        </div>
                                        <input type="range" id="editImgVibrance" min="-100" max="100" value="0">
                                    </div>
                                </div>
                                <div class="bg-white dark:bg-pro-800 border border-pro-200 dark:border-pro-700 p-3 rounded-md shadow-sm space-y-4">
                                    <label class="block text-[11px] font-bold text-pro-700 dark:text-pro-200 uppercase tracking-wider mb-2"><i class="ph-bold ph-eyedropper text-brand-500"></i> Selective Color</label>
                                    
                                    <div class="flex items-center justify-between mb-2">
                                        <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Target Color</label>
                                        <div class="flex items-center gap-2">
                                            <input type="color" id="editImgSelColor" value="#ff0000" class="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent">
                                            <button id="btnImgSelClear" class="text-[10px] text-red-500 hover:text-red-600"><i class="ph-bold ph-x"></i> Reset</button>
                                        </div>
                                    </div>
                                    <hr class="border-pro-100 dark:border-pro-700">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Tolerance</label>
                                            <span id="editImgSelToleranceVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">30</span>
                                        </div>
                                        <input type="range" id="editImgSelTolerance" min="1" max="100" value="30">
                                    </div>
                                    <hr class="border-pro-100 dark:border-pro-700">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Hue Shift</label>
                                            <span id="editImgSelHueVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">0°</span>
                                        </div>
                                        <input type="range" id="editImgSelHue" min="-180" max="180" value="0">
                                    </div>
                                    <hr class="border-pro-100 dark:border-pro-700">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Saturation Shift</label>
                                            <span id="editImgSelSatVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">0</span>
                                        </div>
                                        <input type="range" id="editImgSelSat" min="-100" max="100" value="0">
                                    </div>
                                </div>
                            </div>
                        </details>
`;

content = content.replace(uiInjectionPoint, imageUI + '\n' + uiInjectionPoint);

fs.writeFileSync(file, content);
console.log('UI Injected');
