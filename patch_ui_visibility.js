const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Add variable declarations
const targetVars = `        const accImageStyle = document.getElementById('acc-image-style');
        const accImageMask = document.getElementById('acc-image-mask');
        const accImageFilters = document.getElementById('acc-image-filters');`;
const replaceVars = `        const accImageStyle = document.getElementById('acc-image-style');
        const accImageMask = document.getElementById('acc-image-mask');
        const accColorGrading = document.getElementById('acc-color-grading');
        const accColorCorrection = document.getElementById('acc-color-correction');
        const accImageFilters = document.getElementById('acc-image-filters');`;

if (content.includes(targetVars)) {
    content = content.replace(targetVars, replaceVars);
    console.log("Variables added.");
}

// 2. Hide for Text/Emoji
const targetText = `                    acc3d.style.display = 'block';
                    accImageStyle.style.display = 'none';
                    accImageFilters.style.display = 'none';
                    accShape.style.display = 'none';`;
const replaceText = `                    acc3d.style.display = 'block';
                    accImageStyle.style.display = 'none';
                    accImageFilters.style.display = 'none';
                    accShape.style.display = 'none';
                    if(accImageMask) accImageMask.style.display = 'none';
                    if(accColorGrading) accColorGrading.style.display = 'none';
                    if(accColorCorrection) accColorCorrection.style.display = 'none';`;

if (content.includes(targetText)) {
    content = content.replace(targetText, replaceText);
    console.log("Text visibility patched.");
}

// 3. Hide for Shape
const targetShape = `                    acc3d.style.display = 'block';
                    accImageStyle.style.display = 'none';
                    accImageFilters.style.display = 'none';
                    accShape.style.display = 'block';`;
const replaceShape = `                    acc3d.style.display = 'block';
                    accImageStyle.style.display = 'none';
                    accImageFilters.style.display = 'none';
                    accShape.style.display = 'block';
                    if(accImageMask) accImageMask.style.display = 'none';
                    if(accColorGrading) accColorGrading.style.display = 'none';
                    if(accColorCorrection) accColorCorrection.style.display = 'none';`;

if (content.includes(targetShape)) {
    content = content.replace(targetShape, replaceShape);
    console.log("Shape visibility patched.");
}

// 4. Show for Image
const targetImage = `                    accImageStyle.style.display = 'block';
                    accImageMask.style.display = 'block';
                    accImageFilters.style.display = 'block';`;
const replaceImage = `                    accImageStyle.style.display = 'block';
                    if(accImageMask) accImageMask.style.display = 'block';
                    if(accColorGrading) accColorGrading.style.display = 'block';
                    if(accColorCorrection) accColorCorrection.style.display = 'block';
                    accImageFilters.style.display = 'block';`;

if (content.includes(targetImage)) {
    content = content.replace(targetImage, replaceImage);
    console.log("Image visibility patched.");
} else {
    // maybe it doesn't have accImageFilters.style.display = 'block' adjacent
    console.log("Target image visibility block not found exactly as written. Checking alternatives...");
}

fs.writeFileSync(file, content);
console.log("Done");
