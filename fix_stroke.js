const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(filePath, 'utf8');

const oldVis = `                // Accordion visibility logic
                if (el.type === 'text' || el.type === 'emoji') {`;

const newVis = `                // Accordion visibility logic
                if (el.type === 'text' || el.type === 'emoji' || el.type === 'image' || el.type === 'shape') {
                    accStroke.classList.remove('hidden');
                } else {
                    accStroke.classList.add('hidden');
                }

                if (el.type === 'text' || el.type === 'emoji') {`;

content = content.replace(oldVis, newVis);
fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed Stroke Accordion Visibility!");
