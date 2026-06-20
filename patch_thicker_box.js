const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// I will just do a string replacement for ctx.lineWidth = 2.5 / finalScale; to ctx.lineWidth = 5 / finalScale;
// and for the rotation stick and handles.

// Replace lineWidth for strokeRect
content = content.replace(/ctx\.lineWidth = 2\.5 \/ finalScale;\s*ctx\.strokeRect/g, "ctx.lineWidth = 5 / finalScale;\n                            ctx.strokeRect");

// Replace lineWidth inside drawHandle
content = content.replace(/ctx\.lineWidth = 2\.5 \/ finalScale;\s*ctx\.strokeStyle = '#6366f1';\s*ctx\.stroke\(\);/g, "ctx.lineWidth = 4 / finalScale;\n                                ctx.strokeStyle = '#6366f1';\n                                ctx.stroke();");

// Replace lineWidth for rotation stick
content = content.replace(/ctx\.lineTo\(0, -dh\/2 - \(40 \/ finalScale\)\);\s*ctx\.lineWidth = 2\.5 \/ finalScale;\s*ctx\.stroke\(\);/g, "ctx.lineTo(0, -dh/2 - (40 / finalScale));\n                            ctx.lineWidth = 4 / finalScale;\n                            ctx.stroke();");

// Replace lineWidth for rotation handle
content = content.replace(/ctx\.fillStyle = '#6366f1';\s*ctx\.fill\(\);\s*ctx\.lineWidth = 2\.5 \/ finalScale;\s*ctx\.strokeStyle = '#ffffff';\s*ctx\.stroke\(\);/g, "ctx.fillStyle = '#6366f1';\n                            ctx.fill();\n                            ctx.lineWidth = 4 / finalScale;\n                            ctx.strokeStyle = '#ffffff';\n                            ctx.stroke();");

// Also scale up handleSize a bit from 7 to 9
content = content.replace(/const handleSize = 7 \/ finalScale;/g, "const handleSize = 9 / finalScale;");

fs.writeFileSync(file, content);
console.log('Successfully made the bounding box thicker!');
