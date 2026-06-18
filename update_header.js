const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// Update the HTML part
const oldHtml = `<div class="flex items-center gap-3">
                    <button id="btnToggleWidth" class="text-brand-600 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-400" title="Toggle Width">
                        <i data-lucide="minimize-2" id="iconWidth" class="w-5 h-5 stroke-[2.5]"></i>
                    </button>
                    <button id="btnDockInspector" class="text-brand-600 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-400" title="Change Dock Position">
                        <i data-lucide="move" id="iconDock" class="w-5 h-5 stroke-[2.5]"></i>
                    </button>
                    <div class="w-px h-4 bg-surface-200 dark:border-surface-700"></div>
                    <button id="btnCloseInspector" class="text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white" title="Collapse Inspector">
                        <i data-lucide="chevron-right" id="iconCloseInspector" class="w-5 h-5 stroke-[2.5]"></i>
                    </button>
                </div>`;

const newHtml = `<div class="flex items-center gap-1">
                    <button id="btnToggleWidth" class="p-1.5 rounded text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors" title="Toggle Width">
                        <i data-lucide="minimize-2" id="iconWidth" class="w-4 h-4"></i>
                    </button>
                    <button id="btnDockInspector" class="p-1.5 rounded text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors" title="Change Dock Position">
                        <i data-lucide="monitor" id="iconDock" class="w-4 h-4"></i>
                    </button>
                    <div class="w-px h-3 bg-surface-200 dark:bg-surface-700 mx-1"></div>
                    <button id="btnCloseInspector" class="p-1.5 rounded text-surface-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Close Inspector">
                        <i data-lucide="x" id="iconCloseInspector" class="w-4 h-4"></i>
                    </button>
                </div>`;

content = content.replace(oldHtml, newHtml);

// Update JavaScript setAttributes
content = content.replace(/iconDock.setAttribute\('data-lucide', 'panel-bottom'\);/g, "iconDock.setAttribute('data-lucide', 'monitor-down');");
content = content.replace(/iconDock.setAttribute\('data-lucide', 'panel-top'\);/g, "iconDock.setAttribute('data-lucide', 'monitor-up');");
content = content.replace(/iconDock.setAttribute\('data-lucide', 'panel-left'\);/g, "iconDock.setAttribute('data-lucide', 'monitor');");
content = content.replace(/iconDock.setAttribute\('data-lucide', 'panel-right'\);/g, "iconDock.setAttribute('data-lucide', 'monitor-smartphone');");

// Update Close icon setAttributes (since it's an X now, we can just leave it as an X always)
content = content.replace(/iconCloseInspector.setAttribute\('data-lucide', 'chevron-right'\);/g, "");
content = content.replace(/iconCloseInspector.setAttribute\('data-lucide', 'chevron-left'\);/g, "");
content = content.replace(/iconCloseInspector.setAttribute\('data-lucide', 'chevron-down'\);/g, "");
content = content.replace(/iconCloseInspector.setAttribute\('data-lucide', 'chevron-up'\);/g, "");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Header styling updated!');
