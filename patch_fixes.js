const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Fix setClipEffect boolean bug
content = content.replace(
    /if \(effectName === 'shadowEnable' \|\| effectName === 'extrudeEnable'\) \{/,
    "if (typeof value === 'boolean') {"
);

// 2. Fix handleScaleUp
const oldScaleUp = `        function handleScaleUp() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip || !clip.effects) return;
            let current = clip.effects.scale !== undefined ? clip.effects.scale : 1;
            setClipEffect(clip.id, 'scale', Math.min(3, current * 1.1));
            updatePropertiesPanel();
        }`;
const newScaleUp = `        function handleScaleUp() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip || !clip.effects) return;
            if (clip.type === 'audio') {
                let current = clip.effects.volume !== undefined ? clip.effects.volume : 1;
                setClipEffect(clip.id, 'volume', Math.min(2, current + 0.1));
            } else {
                let current = clip.effects.scale !== undefined ? clip.effects.scale : 1;
                setClipEffect(clip.id, 'scale', Math.min(3, current * 1.1));
            }
            updatePropertiesPanel();
        }`;
content = content.replace(oldScaleUp, newScaleUp);

// 3. Fix handleScaleDown
const oldScaleDown = `        function handleScaleDown() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip || !clip.effects) return;
            let current = clip.effects.scale !== undefined ? clip.effects.scale : 1;
            setClipEffect(clip.id, 'scale', Math.max(0, current * 0.9));
            updatePropertiesPanel();
        }`;
const newScaleDown = `        function handleScaleDown() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip || !clip.effects) return;
            if (clip.type === 'audio') {
                let current = clip.effects.volume !== undefined ? clip.effects.volume : 1;
                setClipEffect(clip.id, 'volume', Math.max(0, current - 0.1));
            } else {
                let current = clip.effects.scale !== undefined ? clip.effects.scale : 1;
                setClipEffect(clip.id, 'scale', Math.max(0, current * 0.9));
            }
            updatePropertiesPanel();
        }`;
content = content.replace(oldScaleDown, newScaleDown);

// 4. Fix handleRotate
const oldRotate = `        function handleRotate() {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip || !clip.effects) return;
            let current = clip.effects.rotate !== undefined ? clip.effects.rotate : 0;
            setClipEffect(clip.id, 'rotate', (current + 90) % 360);
            updatePropertiesPanel();
        }`;
const newRotate = `        function handleRotate(deg = 90) {
            if (!State.selectedClipId) return;
            const clip = State.clips.find(c => c.id === State.selectedClipId);
            if (!clip || !clip.effects) return;
            let current = clip.effects.rotate !== undefined ? clip.effects.rotate : 0;
            setClipEffect(clip.id, 'rotate', (current + deg) % 360);
            updatePropertiesPanel();
        }`;
content = content.replace(oldRotate, newRotate);

// 5. Fix keydown shortcut for r
const oldKeydownR = `else if (k === 'r') handleRotate();`;
const newKeydownR = `else if (k === 'r') handleRotate(e.shiftKey ? 30 : 15);`;
content = content.replace(oldKeydownR, newKeydownR);

fs.writeFileSync(file, content);
console.log('Fixes applied successfully!');
