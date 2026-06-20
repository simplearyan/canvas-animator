const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

const targetStr = `                    }
                    
                    ctx.shadowColor = 'transparent';
                    ctx.drawImage(tmpCnv, drawX - sw, drawY - sw);`;

const replacement = `                        ctx.shadowColor = 'transparent';
                    }
                    
                    ctx.drawImage(tmpCnv, drawX - sw, drawY - sw);`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacement);
    fs.writeFileSync(file, content);
    console.log("Successfully fixed shadow clear logic.");
} else {
    // try a more robust regex replacement if whitespace differs
    const regex = /}\s*ctx\.shadowColor\s*=\s*'transparent';\s*ctx\.drawImage\(tmpCnv,\s*drawX\s*-\s*sw,\s*drawY\s*-\s*sw\);/g;
    if (regex.test(content)) {
        content = content.replace(regex, `    ctx.shadowColor = 'transparent';\n                    }\n                    \n                    ctx.drawImage(tmpCnv, drawX - sw, drawY - sw);`);
        fs.writeFileSync(file, content);
        console.log("Successfully fixed shadow clear logic using regex.");
    } else {
        console.log("Could not find the target string or regex match.");
    }
}
