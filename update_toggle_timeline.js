const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add HTML button
const btnPreviewHtml = `<button id="btnTogglePreview" class="px-3 py-2.5 text-xs font-semibold text-left text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white flex items-center gap-2">
                        <i data-lucide="eye-off" id="iconEye" class="w-3.5 h-3.5"></i> Toggle Preview
                    </button>`;
const btnTimelineHtml = `<button id="btnTogglePreview" class="px-3 py-2.5 text-xs font-semibold text-left text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white flex items-center gap-2">
                        <i data-lucide="eye-off" id="iconEye" class="w-3.5 h-3.5"></i> Toggle Preview
                    </button>
                    <button id="btnToggleTimeline" class="px-3 py-2.5 text-xs font-semibold text-left text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white flex items-center gap-2">
                        <i data-lucide="layers" class="w-3.5 h-3.5"></i> Toggle Timeline
                    </button>`;
content = content.replace(btnPreviewHtml, btnTimelineHtml);

// 2. Add JS variable definition
content = content.replace(
    "const btnTogglePreview = document.getElementById('btnTogglePreview');",
    "const btnTogglePreview = document.getElementById('btnTogglePreview');\n        const btnToggleTimeline = document.getElementById('btnToggleTimeline');"
);

// 3. Add JS event listener
const previewEventJs = `        btnTogglePreview.addEventListener('click', () => {
            State.preview.hidden = !State.preview.hidden;
            if (State.preview.hidden) {
                previewContainer.classList.add('hidden');
                iconEye.setAttribute('data-lucide', 'eye');
            } else {
                previewContainer.classList.remove('hidden');
                iconEye.setAttribute('data-lucide', 'eye-off');
            }
            lucide.createIcons();
            viewDropdown.classList.add('hidden');
            resizeCanvas();
        });`;

const timelineEventJs = `        btnTogglePreview.addEventListener('click', () => {
            State.preview.hidden = !State.preview.hidden;
            if (State.preview.hidden) {
                previewContainer.classList.add('hidden');
                iconEye.setAttribute('data-lucide', 'eye');
            } else {
                previewContainer.classList.remove('hidden');
                iconEye.setAttribute('data-lucide', 'eye-off');
            }
            lucide.createIcons();
            viewDropdown.classList.add('hidden');
            resizeCanvas();
        });

        btnToggleTimeline.addEventListener('click', () => {
            const timelineContainer = document.getElementById('timelineContainer');
            const timelineResizer = document.getElementById('timelineResizer');
            if (timelineContainer.classList.contains('hidden')) {
                timelineContainer.classList.remove('hidden');
                if (timelineResizer) timelineResizer.classList.remove('hidden');
            } else {
                timelineContainer.classList.add('hidden');
                if (timelineResizer) timelineResizer.classList.add('hidden');
            }
            viewDropdown.classList.add('hidden');
            resizeCanvas();
        });`;
content = content.replace(previewEventJs, timelineEventJs);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Timeline toggle added successfully.");
