const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `            btnPlay.addEventListener('click', togglePlay);`;
const replacementStr = `            btnPlay.addEventListener('click', togglePlay);
            
            // Global Keyboard Shortcuts (Space and K to play/pause)
            document.addEventListener('keydown', (e) => {
                // Ignore if user is typing in an input, textarea, or contenteditable element
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
                
                if (e.code === 'Space' || e.key.toLowerCase() === 'k') {
                    e.preventDefault(); // Prevent page scroll on Space
                    togglePlay();
                }
            });`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(filePath, content, 'utf8');
console.log("Keyboard shortcuts added successfully.");
