const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

const targetMatch = `        function render() {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);`;

const inject = `        function render() {
            const domBoxContainer = document.getElementById('domBoundingBoxContainer');
            if(domBoxContainer) domBoxContainer.innerHTML = '';
            
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);`;

if(content.includes(targetMatch)) {
    content = content.replace(targetMatch, inject);
    fs.writeFileSync(file, content);
    console.log('Fixed bbox duplication.');
} else {
    console.error('Target not found in render function');
}
