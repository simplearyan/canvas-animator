const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// Replace ctx.scale
content = content.replace(
    /ctx\.scale\(finalScale, finalScale\);/g,
    "ctx.scale(finalScale * (clip.effects.flipH ? -1 : 1), finalScale * (clip.effects.flipV ? -1 : 1));"
);

// Replace activeVisualClips filter
content = content.replace(
    /let activeVisualClips = State\.clips\.filter\(c =>\s*\n\s*\(c\.type === 'video' \|\| c\.type === 'image' \|\| c\.type === 'text'\) &&/g,
    `let activeVisualClips = State.clips.filter(c =>\n                    !c.hidden &&\n                    (c.type === 'video' || c.type === 'image' || c.type === 'text') &&`
);


fs.writeFileSync(file, content);
console.log('drawCanvas patched!');
