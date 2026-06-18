const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Insert Workspace Resizer
const resizerHtml = `
            <!-- Workspace Vertical Resizer (Timeline Height) -->
            <div id="timelineResizer" class="h-1.5 w-full bg-surface-200 dark:bg-surface-800 cursor-row-resize shrink-0 z-20 flex items-center justify-center relative">
                <div class="w-8 h-0.5 bg-surface-400 rounded-full"></div>
            </div>

            <!-- Bottom Area: Timeline -->`;
content = content.replace('<!-- Bottom Area: Timeline -->', resizerHtml);

// 2. Insert Track Height Button in Toolbar
const trackHeightBtnHtml = `
                        <!-- Track Size -->
                        <button id="btnToggleTrackHeight" class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-brand-600 dark:hover:text-brand-400 text-surface-600 dark:text-surface-400" title="Toggle Track Height">
                            <i data-lucide="align-justify" class="w-4 h-4"></i>
                        </button>
                        
                        <div class="w-px h-6 bg-surface-200 dark:bg-surface-700 hidden sm:block mx-1"></div>

                        <!-- Zoom -->`;
content = content.replace('<!-- Zoom -->', trackHeightBtnHtml);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated HTML with resizer and track scale button.");
