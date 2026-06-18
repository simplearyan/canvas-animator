const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix syncMediaElements to force buffer flush on seek
const oldSync = `                        if (Math.abs(el.currentTime - targetTime) > 0.15) {
                            el.currentTime = targetTime;
                        }`;
const newSync = `                        if (Math.abs(el.currentTime - targetTime) > 0.15) {
                            if (!el.paused) el.pause(); // Force buffer flush
                            el.currentTime = targetTime;
                        }`;
content = content.replace(oldSync, newSync);

// 2. Pause playback while scrubbing the ruler
const oldRulerMouseDown = `            rulerCanvas.addEventListener('mousedown', (e) => {
                ensureAudioContext();
                
                const updateTimeFromMouse = (ev) => {`;
const newRulerMouseDown = `            rulerCanvas.addEventListener('mousedown', (e) => {
                ensureAudioContext();
                
                // Pause while seeking/scrubbing for better UX and to prevent buffer glitches
                const wasPlaying = State.isPlaying;
                if (wasPlaying) {
                    State.isPlaying = false;
                    syncMediaElements();
                }
                
                const updateTimeFromMouse = (ev) => {`;
content = content.replace(oldRulerMouseDown, newRulerMouseDown);

const oldRulerMouseUp = `                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };`;
const newRulerMouseUp = `                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    // Resume playback if it was playing before scrub
                    if (wasPlaying) {
                        State.isPlaying = true;
                        State.lastRenderTime = performance.now();
                    }
                };`;
content = content.replace(oldRulerMouseUp, newRulerMouseUp);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Audio seek fix applied.");
