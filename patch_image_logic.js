const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Add processImage function
const processImageFn = `
function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) r = g = b = l; 
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function processImage(el) {
    if(!el.img || !el.img.width) return;
    
    const temp = el.filterTemp || 0;
    const tint = el.filterTint || 0;
    const vib = el.filterVibrance || 0;
    const targetHex = el.filterSelColor || '#ff0000';
    const selTol = el.filterSelTol || 30;
    const selHue = el.filterSelHue || 0;
    const selSat = el.filterSelSat || 0;
    
    if (temp === 0 && tint === 0 && vib === 0 && selHue === 0 && selSat === 0) {
        el.processedImg = el.img;
        return;
    }
    
    if(!el.processedCnv) {
        el.processedCnv = document.createElement('canvas');
        el.processedCtx = el.processedCnv.getContext('2d', { willReadFrequently: true });
    }
    
    el.processedCnv.width = el.img.width;
    el.processedCnv.height = el.img.height;
    const pctx = el.processedCtx;
    pctx.drawImage(el.img, 0, 0);
    
    const imgData = pctx.getImageData(0, 0, el.img.width, el.img.height);
    const data = imgData.data;
    
    const rT = parseInt(targetHex.substr(1,2),16);
    const gT = parseInt(targetHex.substr(3,2),16);
    const bT = parseInt(targetHex.substr(5,2),16);
    const targetHsl = rgbToHsl(rT, gT, bT);
    const tHue = targetHsl[0] * 360;
    
    for(let i=0; i<data.length; i+=4) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];
        const a = data[i+3];
        if (a === 0) continue;
        
        if (temp !== 0) {
            r = Math.min(255, Math.max(0, r + temp));
            b = Math.min(255, Math.max(0, b - temp));
        }
        if (tint !== 0) {
            g = Math.min(255, Math.max(0, g + tint));
        }
        
        if (vib !== 0) {
            let max = Math.max(r, g, b);
            let avg = (r + g + b) / 3;
            let amt = ((Math.abs(max - avg) * 2 / 255) * vib) / 100;
            if (r !== max) r += (max - r) * amt;
            if (g !== max) g += (max - g) * amt;
            if (b !== max) b += (max - b) * amt;
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
        }
        
        if (selHue !== 0 || selSat !== 0) {
            let hsl = rgbToHsl(r, g, b);
            let pixelH = hsl[0] * 360;
            let dist = Math.abs(pixelH - tHue);
            if (dist > 180) dist = 360 - dist;
            
            if (dist <= selTol) {
                let weight = 1 - (dist / selTol);
                pixelH += (selHue * weight);
                if (pixelH < 0) pixelH += 360;
                if (pixelH > 360) pixelH -= 360;
                
                let s = hsl[1] + (selSat / 100 * weight);
                s = Math.min(1, Math.max(0, s));
                
                let rgb = hslToRgb(pixelH / 360, s, hsl[2]);
                r = rgb[0];
                g = rgb[1];
                b = rgb[2];
            }
        }
        
        data[i] = r;
        data[i+1] = g;
        data[i+2] = b;
    }
    
    pctx.putImageData(imgData, 0, 0);
    el.processedImg = el.processedCnv;
}
`;

// Insert processImage just before function updateUI
content = content.replace('function updateUI() {', processImageFn + '\nfunction updateUI() {');

// 2. Modify updateUI to show the new accordions and populate them
const oldUIUpdate = `                    accImageStyle.style.display = 'block';
                    accImageMask.style.display = 'block';
                    accImageFilters.style.display = 'block';
                    accShape.style.display = 'none';`;

const newUIUpdate = `                    accImageStyle.style.display = 'block';
                    accImageMask.style.display = 'block';
                    if (typeof accImageFilters !== 'undefined' && accImageFilters) accImageFilters.style.display = 'none'; // hide old if exists
                    const cg = document.getElementById('acc-color-grading');
                    const cc = document.getElementById('acc-color-correction');
                    if(cg) cg.style.display = 'block';
                    if(cc) cc.style.display = 'block';
                    accShape.style.display = 'none';`;

content = content.replace(oldUIUpdate, newUIUpdate);

// and also populate them
const oldUIPopulate = `                    editFilterBlurVal.textContent = \`\${el.filterBlur || 0}px\`;`;
const newUIPopulate = `                    editFilterBlurVal.textContent = \`\${el.filterBlur || 0}px\`;
                    
                    if (document.getElementById('editImgBrightness')) {
                        document.getElementById('editImgBrightness').value = el.filterBright !== undefined ? el.filterBright : 100;
                        document.getElementById('editImgBrightnessVal').textContent = \`\${el.filterBright !== undefined ? el.filterBright : 100}%\`;
                        document.getElementById('editImgContrast').value = el.filterContrast !== undefined ? el.filterContrast : 100;
                        document.getElementById('editImgContrastVal').textContent = \`\${el.filterContrast !== undefined ? el.filterContrast : 100}%\`;
                        document.getElementById('editImgSaturation').value = el.filterSat !== undefined ? el.filterSat : 100;
                        document.getElementById('editImgSaturationVal').textContent = \`\${el.filterSat !== undefined ? el.filterSat : 100}%\`;
                        document.getElementById('editImgBlur').value = el.filterBlur || 0;
                        document.getElementById('editImgBlurVal').textContent = \`\${el.filterBlur || 0}px\`;

                        document.getElementById('editImgTemp').value = el.filterTemp || 0;
                        document.getElementById('editImgTempVal').textContent = el.filterTemp || 0;
                        document.getElementById('editImgTint').value = el.filterTint || 0;
                        document.getElementById('editImgTintVal').textContent = el.filterTint || 0;
                        document.getElementById('editImgVibrance').value = el.filterVibrance || 0;
                        document.getElementById('editImgVibranceVal').textContent = el.filterVibrance || 0;
                        document.getElementById('editImgSelColor').value = el.filterSelColor || '#ff0000';
                        document.getElementById('editImgSelTolerance').value = el.filterSelTol || 30;
                        document.getElementById('editImgSelToleranceVal').textContent = el.filterSelTol || 30;
                        document.getElementById('editImgSelHue').value = el.filterSelHue || 0;
                        document.getElementById('editImgSelHueVal').textContent = \`\${el.filterSelHue || 0}°\`;
                        document.getElementById('editImgSelSat').value = el.filterSelSat || 0;
                        document.getElementById('editImgSelSatVal').textContent = el.filterSelSat || 0;
                    }`;

content = content.replace(oldUIPopulate, newUIPopulate);

// 3. Inject event listeners
const eventListeners = `
    const updateImgProp = (prop, valStr) => {
        if (!state.selectedIds) return;
        state.selectedIds.forEach(id => {
            const el = state.elements.find(e => e.id === id);
            if (el && el.type === 'image') {
                if (prop === 'filterSelColor') {
                    el[prop] = valStr;
                } else {
                    el[prop] = parseFloat(valStr);
                }
                
                // If it's a color correction prop, we need to process image
                if (['filterTemp','filterTint','filterVibrance','filterSelColor','filterSelTol','filterSelHue','filterSelSat'].includes(prop)) {
                    processImage(el);
                }
            }
        });
        saveCurrentArtboard();
        updateUI();
        render();
    };

    if (document.getElementById('editImgBrightness')) {
        document.getElementById('editImgBrightness').addEventListener('input', e => updateImgProp('filterBright', e.target.value));
        document.getElementById('editImgContrast').addEventListener('input', e => updateImgProp('filterContrast', e.target.value));
        document.getElementById('editImgSaturation').addEventListener('input', e => updateImgProp('filterSat', e.target.value));
        document.getElementById('editImgBlur').addEventListener('input', e => updateImgProp('filterBlur', e.target.value));
        
        document.getElementById('editImgTemp').addEventListener('input', e => updateImgProp('filterTemp', e.target.value));
        document.getElementById('editImgTint').addEventListener('input', e => updateImgProp('filterTint', e.target.value));
        document.getElementById('editImgVibrance').addEventListener('input', e => updateImgProp('filterVibrance', e.target.value));
        
        document.getElementById('editImgSelColor').addEventListener('input', e => updateImgProp('filterSelColor', e.target.value));
        document.getElementById('editImgSelTolerance').addEventListener('input', e => updateImgProp('filterSelTol', e.target.value));
        document.getElementById('editImgSelHue').addEventListener('input', e => updateImgProp('filterSelHue', e.target.value));
        document.getElementById('editImgSelSat').addEventListener('input', e => updateImgProp('filterSelSat', e.target.value));
        
        document.getElementById('btnImgSelClear').addEventListener('click', () => {
            if (!state.selectedIds) return;
            state.selectedIds.forEach(id => {
                const el = state.elements.find(e => e.id === id);
                if (el && el.type === 'image') {
                    el.filterSelColor = '#ff0000';
                    el.filterSelTol = 30;
                    el.filterSelHue = 0;
                    el.filterSelSat = 0;
                    processImage(el);
                }
            });
            saveCurrentArtboard();
            updateUI();
            render();
        });
    }
`;

// Insert listeners inside setupEventListeners or at bottom. Let's just put it near the end of `<script>`
content = content.replace('// Initialization', eventListeners + '\n        // Initialization');

// 4. Update render() to use processedImg and fallback to original
const renderOld = `if (tmpCnv.width === 0 || tmpCnv.height === 0) {
                        ctx.restore();
                        return;
                    }
                    ctx.drawImage(tmpCnv, -w/2, -h/2, w, h);`;

const renderNew = `if (tmpCnv.width === 0 || tmpCnv.height === 0) {
                        ctx.restore();
                        return;
                    }
                    if (el.processedImg) {
                        ctx.drawImage(el.processedImg, -w/2, -h/2, w, h);
                    } else {
                        ctx.drawImage(tmpCnv, -w/2, -h/2, w, h);
                    }`;

content = content.replace(renderOld, renderNew);

fs.writeFileSync(file, content);
console.log('Image processing logic injected.');
