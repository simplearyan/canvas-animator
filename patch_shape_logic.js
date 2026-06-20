const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Render Logic Update
const targetRender = `                    ctx.fillStyle = el.color;
                    drawShapePath(ctx, el, 0, 0);
                    ctx.fill();`;
const replaceRender = `                    ctx.fillStyle = el.color;
                    if(el.feather) ctx.filter = \`blur(\${el.feather}px)\`;
                    drawShapePath(ctx, el, 0, 0);
                    ctx.fill();
                    if(el.feather) ctx.filter = 'none';`;

if (content.includes(targetRender)) {
    content = content.replace(targetRender, replaceRender);
    console.log("Shape render logic patched.");
} else {
    console.log("Shape render target not found");
}

// 2. UI Updates (updateUI function)
const targetUIUpdate = `                    editShapeRadius.value = el.radius || 0;
                    editShapeRadiusVal.textContent = \`\${el.radius || 0}px\`;`;
const replaceUIUpdate = `                    editShapeRadius.value = el.radius || 0;
                    editShapeRadiusVal.textContent = \`\${el.radius || 0}px\`;
                    editShapeFeather.value = el.feather || 0;
                    editShapeFeatherVal.textContent = \`\${el.feather || 0}px\`;
                    editShapeOpacity.value = el.opacity !== undefined ? el.opacity : 100;
                    editShapeOpacityVal.textContent = \`\${el.opacity !== undefined ? el.opacity : 100}%\`;
                    editShapeBlend.value = el.blendMode || 'source-over';`;

if (content.includes(targetUIUpdate)) {
    content = content.replace(targetUIUpdate, replaceUIUpdate);
    console.log("updateUI patched.");
} else {
    console.log("updateUI target not found");
}

// 3. Event Listeners
const targetEventListeners = `        editShapeRadius.addEventListener('input', (e) => { editShapeRadiusVal.textContent = \`\${e.target.value}px\`; updateProp('radius', parseInt(e.target.value)); });`;
const replaceEventListeners = `        editShapeRadius.addEventListener('input', (e) => { editShapeRadiusVal.textContent = \`\${e.target.value}px\`; updateProp('radius', parseInt(e.target.value)); });
        editShapeFeather.addEventListener('input', (e) => { editShapeFeatherVal.textContent = \`\${e.target.value}px\`; updateProp('feather', parseInt(e.target.value)); });
        editShapeOpacity.addEventListener('input', (e) => { editShapeOpacityVal.textContent = \`\${e.target.value}%\`; updateProp('opacity', parseInt(e.target.value)); });
        editShapeBlend.addEventListener('change', (e) => { updateProp('blendMode', e.target.value); });`;

if (content.includes(targetEventListeners)) {
    content = content.replace(targetEventListeners, replaceEventListeners);
    console.log("Event listeners patched.");
} else {
    console.log("Event listeners target not found");
}

fs.writeFileSync(file, content);
console.log("Done");
