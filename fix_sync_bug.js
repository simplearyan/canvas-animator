const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `            State.clips.forEach(clip => {
                const track = State.tracks.find(t => t.id === clip.trackId);
                const el = clip.audioEl || clip.videoEl;
                
                if (el) {
                    if (track && track.muted && clip.audioEl) {`;
                    
const replacementStr = `            State.clips.forEach(clip => {
                const track = State.tracks.find(t => t.id === clip.trackId);
                const el = clip.audioEl || clip.videoEl;
                
                if (el) {
                    // CRITICAL FIX: Do not attempt to seek or play if the media file hasn't loaded its metadata yet.
                    // Doing so causes the browser to ignore the seek and play from 00:00 when it finally loads.
                    if (el.readyState === 0) return;

                    if (track && track.muted && clip.audioEl) {`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(filePath, content, 'utf8');
console.log("Sync bug fixed with readyState check.");
