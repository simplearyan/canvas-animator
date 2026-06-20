const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Inject loadAndDownscaleImage
const targetFunc = `        const generateId = () =>`;
const injectFunc = `        const loadAndDownscaleImage = (imgSrc, callback) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const MAX_DIM = 2500;
                if (img.width > MAX_DIM || img.height > MAX_DIM) {
                    const ratio = Math.min(MAX_DIM / img.width, MAX_DIM / img.height);
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.round(img.width * ratio);
                    canvas.height = Math.round(img.height * ratio);
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const resizedImg = new Image();
                    resizedImg.onload = () => callback(resizedImg);
                    resizedImg.src = canvas.toDataURL('image/png');
                } else {
                    callback(img);
                }
            };
            img.src = imgSrc;
        };

        const generateId = () =>`;

if (content.includes(targetFunc) && !content.includes('loadAndDownscaleImage')) {
    content = content.replace(targetFunc, injectFunc);
    console.log("Injected loadAndDownscaleImage");
}

// 2. Patch Paste Handler
const pasteTarget = `                    const url = URL.createObjectURL(blob);
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.onload = () => {
                        let scale = 1;
                        if(img.width > CANVAS_WIDTH/2 || img.height > CANVAS_HEIGHT/2) {
                             scale = Math.min((CANVAS_WIDTH/2) / img.width, (CANVAS_HEIGHT/2) / img.height);
                        }
                        const newImg = {`;
const pasteReplace = `                    const url = URL.createObjectURL(blob);
                    loadAndDownscaleImage(url, (img) => {
                        let scale = 1;
                        if(img.width > CANVAS_WIDTH/2 || img.height > CANVAS_HEIGHT/2) {
                             scale = Math.min((CANVAS_WIDTH/2) / img.width, (CANVAS_HEIGHT/2) / img.height);
                        }
                        const newImg = {`;

if (content.includes(pasteTarget)) {
    content = content.replace(pasteTarget, pasteReplace);
    // remove the trailing 'img.src = url;' from paste block
    content = content.replace(`                        document.querySelector('[data-target="panel-edit"]').click();\n                    };\n                    img.src = url;`, `                        document.querySelector('[data-target="panel-edit"]').click();\n                    });`);
    console.log("Patched paste handler");
}

// 3. Patch handleImageUpload
const uploadTarget = `            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let scale = 1;
                    if(img.width > CANVAS_WIDTH/2 || img.height > CANVAS_HEIGHT/2) {
                         scale = Math.min((CANVAS_WIDTH/2) / img.width, (CANVAS_HEIGHT/2) / img.height);
                    }
                    const newImg = {`;
const uploadReplace = `            reader.onload = (e) => {
                loadAndDownscaleImage(e.target.result, (img) => {
                    let scale = 1;
                    if(img.width > CANVAS_WIDTH/2 || img.height > CANVAS_HEIGHT/2) {
                         scale = Math.min((CANVAS_WIDTH/2) / img.width, (CANVAS_HEIGHT/2) / img.height);
                    }
                    const newImg = {`;

if (content.includes(uploadTarget)) {
    content = content.replace(uploadTarget, uploadReplace);
    content = content.replace(`                    document.querySelector('[data-target="panel-edit"]').click();\n                };\n                img.src = e.target.result;\n            };`, `                    document.querySelector('[data-target="panel-edit"]').click();\n                });\n            };`);
    console.log("Patched upload handler");
}

// 4. Patch URL loader
const urlTarget = `            const objectUrl = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                let scale = 1;
                if(img.width > CANVAS_WIDTH/2 || img.height > CANVAS_HEIGHT/2) scale = Math.min((CANVAS_WIDTH/2) / img.width, (CANVAS_HEIGHT/2) / img.height);
                const newImg = {`;
const urlReplace = `            const objectUrl = URL.createObjectURL(blob);
            loadAndDownscaleImage(objectUrl, (img) => {
                let scale = 1;
                if(img.width > CANVAS_WIDTH/2 || img.height > CANVAS_HEIGHT/2) scale = Math.min((CANVAS_WIDTH/2) / img.width, (CANVAS_HEIGHT/2) / img.height);
                const newImg = {`;

if (content.includes(urlTarget)) {
    content = content.replace(urlTarget, urlReplace);
    content = content.replace(`                imageUrlInput.value = '';\n                document.querySelector('[data-target="panel-edit"]').click();\n            };\n            img.src = objectUrl;`, `                imageUrlInput.value = '';\n                document.querySelector('[data-target="panel-edit"]').click();\n            });`);
    console.log("Patched URL handler");
}

fs.writeFileSync(file, content);
console.log("Done");
