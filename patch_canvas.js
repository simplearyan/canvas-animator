const fs = require('fs');

let html = fs.readFileSync('audio-editor ✅✅/studiopro_editor_text.html', 'utf8');

let startIndex = html.indexOf('                        // Drawing text clip');
let endIndex = html.indexOf('                        // Interactive Bounding Box for Selected');

if (startIndex !== -1 && endIndex !== -1) {
    let oldBlock = html.substring(startIndex, endIndex);

    let newBlock = `                        // Drawing text clip
                        const fontSize = clip.effects.fontSize || 100;
                        const fontStyle = clip.effects.fontStyle || 'normal';
                        ctx.font = \`\${fontStyle} \${clip.effects.fontWeight || 700} \${fontSize}px "\${clip.effects.fontFamily || 'Rubik'}"\`;
                        
                        // Parse text content
                        let renderText = clip.text || '';
                        if (clip.effects.textTransform === 'uppercase') renderText = renderText.toUpperCase();
                        else if (clip.effects.textTransform === 'lowercase') renderText = renderText.toLowerCase();
                        
                        const lines = renderText.split('\\n');
                        const metrics = ctx.measureText(renderText); // Rough max width
                        let dw = metrics.width;
                        let dh = fontSize * lines.length; 
                        
                        // New Text Properties
                        ctx.letterSpacing = (clip.effects.letterSpacing || 0) + "px";
                        const lh = (clip.effects.lineHeight || 1.1) * fontSize;
                        const startY = -((lines.length - 1) * lh) / 2;

                        const baseScale = clip.effects.scale !== undefined ? clip.effects.scale : 1;
                        const rotate = clip.effects.rotate !== undefined ? clip.effects.rotate : 0;
                        const offsetX = clip.effects.offsetX || 0;
                        const offsetY = clip.effects.offsetY || 0;

                        // Animation Math
                        let animAlpha = 1;
                        let animScale = 1;
                        let animY = 0;
                        let mosaicLevel = 0;
                        const clipTime = State.currentTime - clip.start;
                        const timeLeft = clip.duration - clipTime;

                        if (clip.effects.animIn && clip.effects.animIn !== 'none') {
                            const dur = clip.effects.animInDur || 1;
                            if (clipTime < dur) {
                                const p = easeOutQuart(clipTime / dur);
                                if (clip.effects.animIn === 'fade') animAlpha *= p;
                                if (clip.effects.animIn === 'slideUp') { animAlpha *= p; animY += (1-p) * 200; }
                                if (clip.effects.animIn === 'zoom') { animAlpha *= p; animScale *= (0.5 + 0.5*p); }
                                if (clip.effects.animIn === 'mosaic') { mosaicLevel = 1 - p; }
                            }
                        }
                        if (clip.effects.animOut && clip.effects.animOut !== 'none') {
                            const dur = clip.effects.animOutDur || 1;
                            if (timeLeft < dur) {
                                const p = easeOutQuart(timeLeft / dur);
                                if (clip.effects.animOut === 'fade') animAlpha = Math.min(animAlpha, p);
                                if (clip.effects.animOut === 'slideDown') { animAlpha = Math.min(animAlpha, p); animY += (1-p) * 200; }
                                if (clip.effects.animOut === 'zoom') { animAlpha = Math.min(animAlpha, p); animScale *= Math.max(0.01, p); }
                                if (clip.effects.animOut === 'mosaic') { mosaicLevel = Math.max(mosaicLevel, 1 - p); }
                            }
                        }
                        if (clip.effects.animLoop && clip.effects.animLoop !== 'none') {
                            if (clip.effects.animLoop === 'pulse') animScale *= (1 + 0.05 * Math.sin(clipTime * Math.PI * 2));
                            if (clip.effects.animLoop === 'float') animY += 15 * Math.sin(clipTime * Math.PI);
                        }

                        ctx.save();
                        const finalScale = baseScale * animScale;
                        const cx = w/2 + offsetX;
                        const cy = h/2 + offsetY + animY;

                        ctx.globalAlpha = animAlpha * (clip.effects.opacity !== undefined ? clip.effects.opacity/100 : 1);
                        ctx.globalCompositeOperation = clip.effects.blendMode || 'source-over';
                        ctx.translate(cx, cy);
                        ctx.rotate(rotate * Math.PI / 180);
                        ctx.scale(finalScale, finalScale);

                        ctx.textBaseline = 'middle';
                        ctx.textAlign = 'center';

                        let drawText = () => {
                            // Extrude
                            if (clip.effects.extrudeEnable) {
                                ctx.fillStyle = clip.effects.extrudeColor || '#000000';
                                const depth = clip.effects.extrudeDepth || 5;
                                let dx = 1, dy = 1;
                                const ed = clip.effects.extrudeDir || 'br';
                                if (ed === 'bl') { dx = -1; dy = 1; }
                                else if (ed === 'b') { dx = 0; dy = 1; }
                                else if (ed === 'br') { dx = 1; dy = 1; }
                                else if (ed === 'tr') { dx = 1; dy = -1; }
                                else if (ed === 'tl') { dx = -1; dy = -1; }
                                else if (ed === 't') { dx = 0; dy = -1; }
                                else if (ed === 'r') { dx = 1; dy = 0; }
                                else if (ed === 'l') { dx = -1; dy = 0; }

                                for(let i = depth; i > 0; i -= 0.5) {
                                    lines.forEach((line, li) => {
                                        ctx.fillText(line, dx * i, startY + li * lh + dy * i);
                                    });
                                }
                            }

                            // Drop shadow
                            if (clip.effects.shadowEnable) {
                                ctx.shadowColor = clip.effects.shadowColor || '#000000';
                                ctx.shadowBlur = clip.effects.shadowBlur || 20;
                                ctx.shadowOffsetX = clip.effects.shadowX || 0;
                                ctx.shadowOffsetY = clip.effects.shadowY || 10;
                            } else {
                                ctx.shadowColor = 'transparent';
                                ctx.shadowBlur = 0;
                            }

                            ctx.fillStyle = clip.effects.fillColor || '#ffffff';
                            lines.forEach((line, li) => {
                                ctx.fillText(line, 0, startY + li * lh);
                                
                                // Text Decoration (Underline / Strike)
                                if (clip.effects.textDecoration === 'underline' || clip.effects.textDecoration === 'line-through') {
                                    const lm = ctx.measureText(line);
                                    const tdw = lm.width;
                                    ctx.fillRect(-tdw/2, startY + li * lh + (clip.effects.textDecoration === 'underline' ? fontSize*0.4 : -fontSize*0.1), tdw, fontSize*0.08);
                                }
                            });

                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;
                        };

                        if (mosaicLevel > 0.05) {
                            const pSize = Math.max(1, mosaicLevel * 30);
                            const offCanvas = document.createElement('canvas');
                            const offCtx = offCanvas.getContext('2d');
                            offCanvas.width = dw + 100;
                            offCanvas.height = dh + 100;
                            offCtx.translate(offCanvas.width/2, offCanvas.height/2);
                            offCtx.textBaseline = 'middle';
                            offCtx.textAlign = 'center';
                            offCtx.font = ctx.font;
                            offCtx.letterSpacing = ctx.letterSpacing;
                            
                            // Extrude on offscreen
                            if (clip.effects.extrudeEnable) {
                                offCtx.fillStyle = clip.effects.extrudeColor || '#000000';
                                const depth = clip.effects.extrudeDepth || 5;
                                let dx = 1, dy = 1;
                                const ed = clip.effects.extrudeDir || 'br';
                                if (ed === 'bl') { dx = -1; dy = 1; }
                                else if (ed === 'b') { dx = 0; dy = 1; }
                                else if (ed === 'br') { dx = 1; dy = 1; }
                                else if (ed === 'tr') { dx = 1; dy = -1; }
                                else if (ed === 'tl') { dx = -1; dy = -1; }
                                else if (ed === 't') { dx = 0; dy = -1; }
                                else if (ed === 'r') { dx = 1; dy = 0; }
                                else if (ed === 'l') { dx = -1; dy = 0; }
                                for(let i = depth; i > 0; i -= 0.5) {
                                    lines.forEach((line, li) => {
                                        offCtx.fillText(line, dx * i, startY + li * lh + dy * i);
                                    });
                                }
                            }
                            // Drop shadow on offscreen
                            if (clip.effects.shadowEnable) {
                                offCtx.shadowColor = clip.effects.shadowColor || '#000000';
                                offCtx.shadowBlur = clip.effects.shadowBlur || 20;
                                offCtx.shadowOffsetX = clip.effects.shadowX || 0;
                                offCtx.shadowOffsetY = clip.effects.shadowY || 10;
                            }
                            offCtx.fillStyle = clip.effects.fillColor || '#ffffff';
                            lines.forEach((line, li) => {
                                offCtx.fillText(line, 0, startY + li * lh);
                                // Text Decoration (Underline / Strike) on offscreen
                                if (clip.effects.textDecoration === 'underline' || clip.effects.textDecoration === 'line-through') {
                                    const lm = offCtx.measureText(line);
                                    const tdw = lm.width;
                                    offCtx.fillRect(-tdw/2, startY + li * lh + (clip.effects.textDecoration === 'underline' ? fontSize*0.4 : -fontSize*0.1), tdw, fontSize*0.08);
                                }
                            });

                            // Draw to main canvas pixelated
                            const smallCanvas = document.createElement('canvas');
                            const smallCtx = smallCanvas.getContext('2d');
                            smallCanvas.width = offCanvas.width / pSize;
                            smallCanvas.height = offCanvas.height / pSize;
                            smallCtx.drawImage(offCanvas, 0, 0, smallCanvas.width, smallCanvas.height);

                            ctx.imageSmoothingEnabled = false;
                            ctx.drawImage(smallCanvas, -offCanvas.width/2, -offCanvas.height/2, offCanvas.width, offCanvas.height);
                            ctx.imageSmoothingEnabled = true;
                        } else {
                            drawText();
                        }
\n`;
    html = html.replace(oldBlock, newBlock);
    fs.writeFileSync('audio-editor ✅✅/studiopro_editor_text.html', html, 'utf8');
    console.log("Canvas Rendering Logic Updated!");
} else {
    console.log("Could not find start or end index!");
}
