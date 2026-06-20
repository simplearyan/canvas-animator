const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /let displayVal = '';\s*if \(activeTab\.unit === '%'\) displayVal = `\$\{Math\.round\(val \* 100\)\}%\`;\s*else if \(activeTab\.unit === 'x'\) displayVal = `\$\{val\.toFixed\(2\)\}x\`;\s*else displayVal = `\$\{Math\.round\(val\)\}\$\{activeTab\.unit\}`;/g,
    `let displayVal = '';
            if (activeTab) {
                if (activeTab.unit === '%') displayVal = \`\${Math.round(val * 100)}%\`;
                else if (activeTab.unit === 'x') displayVal = \`\${val.toFixed(2)}x\`;
                else displayVal = \`\${Math.round(val)}\${activeTab.unit}\`;
            }`
);

content = content.replace(
    /const slider = headerProperties\.querySelector\('input\[type="range"\]'\);\s*if\(slider\) slider\.style\.background = `linear-gradient\(to right, \$\{sliderFill\} \$\{\(val\/activeTab\.max\)\*100\}%, \$\{sliderBg\} \$\{\(val\/activeTab\.max\)\*100\}%\)`;/g,
    `const slider = headerProperties.querySelector('input[type="range"]');
            if(slider && activeTab) slider.style.background = \`linear-gradient(to right, \${sliderFill} \${(val/activeTab.max)*100}%, \${sliderBg} \${(val/activeTab.max)*100}%)\`;`
);

fs.writeFileSync(file, content);
console.log('activeTab errors fixed!');
