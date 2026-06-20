const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

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

fs.writeFileSync(file, content);
console.log('Handlers and keydown patched!');
