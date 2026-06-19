const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

const markerStart = 'const updateImgProp = (prop, valStr) => {';
const markerEnd = 'updateUI();\n            render();\n        });\n    }';

let startIndex = content.indexOf(markerStart);
let endIndex = content.indexOf(markerEnd) + markerEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
    // We only want to remove the FIRST occurrence (the one near line 65)
    if (startIndex < 5000) { // arbitrary threshold to ensure we only target the top one
        content = content.substring(0, startIndex) + content.substring(endIndex);
        fs.writeFileSync(file, content);
        console.log('Removed top duplicate block.');
    } else {
        console.log('First occurrence is not at the top.');
    }
} else {
    console.log('Markers not found.');
}
