const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

const logicBlock = `
        // --- Workspace Vertical Resizer (Timeline Height) ---
        const timelineResizer = document.getElementById('timelineResizer');
        let isResizingTimeline = false;
        let startTimelineY = 0;
        let startPreviewHeight = 0;

        if (timelineResizer && previewContainer) {
            timelineResizer.addEventListener('mousedown', (e) => {
                isResizingTimeline = true;
                startTimelineY = e.clientY;
                startPreviewHeight = previewContainer.offsetHeight;
                document.body.style.cursor = 'row-resize';
                document.body.style.userSelect = 'none';
            });

            window.addEventListener('mousemove', (e) => {
                if (!isResizingTimeline) return;
                const dy = e.clientY - startTimelineY;
                let newHeight = startPreviewHeight + dy;
                // Constraints
                const mainAppWrapper = document.getElementById('mainAppWrapper');
                const maxH = mainAppWrapper.offsetHeight - 140; // Leave space for timeline
                newHeight = Math.max(100, Math.min(maxH, newHeight));
                previewContainer.style.height = \`\${newHeight}px\`;
                resizeCanvas();
            });

            window.addEventListener('mouseup', () => {
                if (isResizingTimeline) {
                    isResizingTimeline = false;
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                }
            });
        }

        // --- Track Height Scaling ---
        const btnToggleTrackHeight = document.getElementById('btnToggleTrackHeight');
        const TRACK_SIZES = {
            'small': { height: 45, next: 'medium' },
            'medium': { height: 90, next: 'large' },
            'large': { height: 130, next: 'small' }
        };
        let currentTrackSize = 'medium';

        if (btnToggleTrackHeight) {
            btnToggleTrackHeight.addEventListener('click', () => {
                currentTrackSize = TRACK_SIZES[currentTrackSize].next;
                const newHeight = TRACK_SIZES[currentTrackSize].height;
                State.tracks.forEach(t => t.height = newHeight);
                renderTrackHeaders();
                renderTracks();
                renderClips();
            });
        }

        // --- Initialization ---`;

content = content.replace('// --- Initialization ---', logicBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Injected vertical resizer and track scale JS logic.");
