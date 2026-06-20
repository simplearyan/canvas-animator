const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// Bug 1: Default font family to 'Rubik'
content = content.replace(/fontFamily: 'Inter, sans-serif'/g, "fontFamily: 'Rubik'");

// Bug 2: Drop Shadow + Border Radius for image/video
const oldImageDraw = `                            // Apply Drop Shadow just to the image draw
                            if (clip.effects.shadowEnable) {
                                ctx.shadowColor = clip.effects.shadowColor || '#000000';
                                ctx.shadowBlur = clip.effects.shadowBlur || 20;
                                ctx.shadowOffsetX = clip.effects.shadowX || 0;
                                ctx.shadowOffsetY = clip.effects.shadowY || 10;
                            }

                            if (borderRadius > 0) {
                                ctx.beginPath();
                                if (ctx.roundRect) {
                                    ctx.roundRect(-dw/2, -dh/2, dw, dh, borderRadius);
                                } else {
                                    ctx.rect(-dw/2, -dh/2, dw, dh);
                                }
                                ctx.clip();
                            }

                            if (mosaicLevel > 0.05) {
                                const pSize = Math.max(1, mosaicLevel * 30);
                                const offCanvas = document.createElement('canvas');
                                const offCtx = offCanvas.getContext('2d');
                                offCanvas.width = dw;
                                offCanvas.height = dh;
                                offCtx.drawImage(source, 0, 0, dw, dh);

                                const smallCanvas = document.createElement('canvas');
                                const smallCtx = smallCanvas.getContext('2d');
                                smallCanvas.width = dw / pSize;
                                smallCanvas.height = dh / pSize;
                                smallCtx.drawImage(offCanvas, 0, 0, smallCanvas.width, smallCanvas.height);

                                ctx.imageSmoothingEnabled = false;
                                ctx.drawImage(smallCanvas, -dw/2, -dh/2, dw, dh);
                                ctx.imageSmoothingEnabled = true;
                            } else {
                                ctx.drawImage(source, -dw/2, -dh/2, dw, dh);
                            }
                            
                            // Reset shadow so it doesn't affect bounding box
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;`;

const newImageDraw = `                            if (clip.effects.shadowEnable || borderRadius > 0 || mosaicLevel > 0.05) {
                                const offCanvas = document.createElement('canvas');
                                const offCtx = offCanvas.getContext('2d');
                                offCanvas.width = dw;
                                offCanvas.height = dh;
                                
                                if (borderRadius > 0) {
                                    offCtx.beginPath();
                                    if (offCtx.roundRect) offCtx.roundRect(0, 0, dw, dh, borderRadius);
                                    else offCtx.rect(0, 0, dw, dh);
                                    offCtx.clip();
                                }
                                
                                if (mosaicLevel > 0.05) {
                                    const pSize = Math.max(1, mosaicLevel * 30);
                                    const smallCanvas = document.createElement('canvas');
                                    const smallCtx = smallCanvas.getContext('2d');
                                    smallCanvas.width = dw / pSize;
                                    smallCanvas.height = dh / pSize;
                                    smallCtx.drawImage(source, 0, 0, smallCanvas.width, smallCanvas.height);

                                    offCtx.imageSmoothingEnabled = false;
                                    offCtx.drawImage(smallCanvas, 0, 0, dw, dh);
                                    offCtx.imageSmoothingEnabled = true;
                                } else {
                                    offCtx.drawImage(source, 0, 0, dw, dh);
                                }
                                
                                if (clip.effects.shadowEnable) {
                                    ctx.shadowColor = clip.effects.shadowColor || '#000000';
                                    ctx.shadowBlur = clip.effects.shadowBlur || 20;
                                    ctx.shadowOffsetX = clip.effects.shadowX || 0;
                                    ctx.shadowOffsetY = clip.effects.shadowY || 10;
                                }
                                
                                ctx.drawImage(offCanvas, -dw/2, -dh/2, dw, dh);
                                
                                ctx.shadowColor = 'transparent';
                                ctx.shadowBlur = 0;
                            } else {
                                ctx.drawImage(source, -dw/2, -dh/2, dw, dh);
                            }`;

// Replace ignoring \r\n
const escapeRegex = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\\n/g, '\\s*');
const oldRegex = new RegExp(escapeRegex(oldImageDraw), 'g');
if (oldRegex.test(content)) {
    content = content.replace(oldRegex, newImageDraw);
} else {
    console.log("Could not find image draw logic to replace!");
}


// Bug 3: Store and restore details state
const sidebarFuncStart = `        function updateSidebarPanel() {
            const clip = State.clips.find(c => c.id === State.selectedClipId);`;
            
const sidebarFuncInject = `        function updateSidebarPanel() {
            // Save state
            State.ui = State.ui || { detailsState: {} };
            const currentDetails = sidebarContent.querySelectorAll('details');
            currentDetails.forEach(d => {
                const summary = d.querySelector('summary');
                if (summary) State.ui.detailsState[summary.textContent.trim()] = d.open;
            });

            const clip = State.clips.find(c => c.id === State.selectedClipId);`;

content = content.replace(sidebarFuncStart, sidebarFuncInject);

const sidebarFuncEnd = `            sidebarContent.innerHTML = html;
            lucide.createIcons();
        }`;

const sidebarFuncEndInject = `            sidebarContent.innerHTML = html;
            
            // Restore state
            const newDetails = sidebarContent.querySelectorAll('details');
            newDetails.forEach(d => {
                const summary = d.querySelector('summary');
                if (summary) {
                    const title = summary.textContent.trim();
                    if (State.ui.detailsState[title] !== undefined) {
                        if (State.ui.detailsState[title]) d.setAttribute('open', '');
                        else d.removeAttribute('open');
                    }
                }
            });

            lucide.createIcons();
        }`;

content = content.replace(sidebarFuncEnd, sidebarFuncEndInject);

fs.writeFileSync(file, content);
console.log('Successfully patched all 3 bugs.');
