const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Update editShapeType options
const typeSelect = `<select id="editShapeType" class="w-full text-sm p-2 pl-3 pr-8 border border-pro-300 dark:border-pro-600 rounded bg-pro-50 dark:bg-pro-900 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-pro-800 dark:text-pro-200">
                                                <option value="rect">Rectangle</option>
                                                <option value="circle">Circle</option>
                                                <option value="triangle">Triangle</option>
                                                <option value="polygon">Polygon</option>
                                                <option value="star">Star</option>
                                            </select>`;
const newTypeSelect = `<select id="editShapeType" class="w-full text-sm p-2 pl-3 pr-8 border border-pro-300 dark:border-pro-600 rounded bg-pro-50 dark:bg-pro-900 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-pro-800 dark:text-pro-200">
                                                <option value="rect">Rectangle</option>
                                                <option value="circle">Circle</option>
                                                <option value="semi-circle">Semi Circle</option>
                                                <option value="triangle">Triangle</option>
                                                <option value="polygon">Polygon</option>
                                                <option value="star">Star</option>
                                                <option value="pointed-rect">Pointed Rect</option>
                                            </select>`;

if(content.includes(typeSelect)) {
    content = content.replace(typeSelect, newTypeSelect);
    console.log("Shape types added to UI");
} else {
    console.log("Shape types select not found");
}

// 2. Add Feather, Opacity, and Blend Mode UI to Shape Settings
const shapeRadiusContainer = `                                    <div id="shapeRadiusContainer">
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Border Radius</label>
                                            <span id="editShapeRadiusVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">0px</span>
                                        </div>
                                        <input type="range" id="editShapeRadius" min="0" max="200" value="0">
                                    </div>`;
const additionalShapeUI = `                                    <div id="shapeRadiusContainer">
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Border Radius</label>
                                            <span id="editShapeRadiusVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">0px</span>
                                        </div>
                                        <input type="range" id="editShapeRadius" min="0" max="200" value="0">
                                    </div>
                                    <hr class="border-pro-100 dark:border-pro-700">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Feather</label>
                                            <span id="editShapeFeatherVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">0px</span>
                                        </div>
                                        <input type="range" id="editShapeFeather" min="0" max="200" value="0">
                                    </div>
                                    <hr class="border-pro-100 dark:border-pro-700">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest">Opacity</label>
                                            <span id="editShapeOpacityVal" class="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded">100%</span>
                                        </div>
                                        <input type="range" id="editShapeOpacity" min="0" max="100" value="100">
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold text-pro-500 dark:text-pro-400 uppercase tracking-widest mb-2">Blend Mode</label>
                                        <div class="relative">
                                            <select id="editShapeBlend" class="w-full text-sm p-2 pl-3 pr-8 border border-pro-300 dark:border-pro-600 rounded bg-pro-50 dark:bg-pro-900 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-pro-800 dark:text-pro-200">
                                                <option value="source-over">Normal</option>
                                                <option value="multiply">Multiply</option>
                                                <option value="screen">Screen</option>
                                                <option value="overlay">Overlay</option>
                                                <option value="darken">Darken</option>
                                                <option value="lighten">Lighten</option>
                                                <option value="color-dodge">Color Dodge</option>
                                                <option value="color-burn">Color Burn</option>
                                                <option value="difference">Difference</option>
                                                <option value="exclusion">Exclusion</option>
                                            </select>
                                            <i class="ph-bold ph-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-pro-500 pointer-events-none"></i>
                                        </div>
                                    </div>`;

if(content.includes(shapeRadiusContainer)) {
    content = content.replace(shapeRadiusContainer, additionalShapeUI);
    console.log("Additional UI added");
} else {
    console.log("Shape radius container not found");
}

// 3. Update drawShapePath to include new shapes
const drawShapeStar = `            } else if (type === 'star') {
                const outerRx = w / 2;
                const outerRy = h / 2;
                const innerRx = outerRx / 2;
                const innerRy = outerRy / 2;
                const step = Math.PI / sides;
                for (let i = 0; i < sides * 2; i++) {
                    const rx = (i % 2 === 0) ? outerRx : innerRx;
                    const ry = (i % 2 === 0) ? outerRy : innerRy;
                    const px = x + rx * Math.cos(i * step - Math.PI/2);
                    const py = y + ry * Math.sin(i * step - Math.PI/2);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
            }`;

const drawShapeNew = `            } else if (type === 'star') {
                const outerRx = w / 2;
                const outerRy = h / 2;
                const innerRx = outerRx / 2;
                const innerRy = outerRy / 2;
                const step = Math.PI / sides;
                for (let i = 0; i < sides * 2; i++) {
                    const rx = (i % 2 === 0) ? outerRx : innerRx;
                    const ry = (i % 2 === 0) ? outerRy : innerRy;
                    const px = x + rx * Math.cos(i * step - Math.PI/2);
                    const py = y + ry * Math.sin(i * step - Math.PI/2);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
            } else if (type === 'semi-circle') {
                ctx.arc(x, y, w / 2, Math.PI, 0, false);
                ctx.closePath();
            } else if (type === 'pointed-rect') {
                const rx = w / 2;
                const ry = h / 2;
                const pt = Math.min(w * 0.2, h); 
                ctx.moveTo(x - rx, y); 
                ctx.lineTo(x - rx + pt, y - ry); 
                ctx.lineTo(x + rx - pt, y - ry); 
                ctx.lineTo(x + rx, y); 
                ctx.lineTo(x + rx - pt, y + ry); 
                ctx.lineTo(x - rx + pt, y + ry); 
                ctx.closePath();
            }`;

if (content.includes(drawShapeStar)) {
    content = content.replace(drawShapeStar, drawShapeNew);
    console.log("Shapes added to drawShapePath");
} else {
    console.log("drawShapeStar not found");
}

fs.writeFileSync(file, content);
console.log("HTML patched.");
