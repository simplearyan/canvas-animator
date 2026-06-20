const fs = require('fs');

const content = fs.readFileSync('audio-editor ✅✅/studiopro_editor_text.html', 'utf8');

const scripts = [...content.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)];
const js = scripts[scripts.length - 1][1];

let lineNum = 1;
let openTemplate = false;
let parens = 0;
let braces = 0;
let brackets = 0;
let braceLines = [];

for (let i = 0; i < js.length; i++) {
    const c = js[i];
    
    if (c === '\n') lineNum++;
    
    if (c === '`' && js[i-1] !== '\\') {
        openTemplate = !openTemplate;
    }
    
    if (!openTemplate) {
        if (c === '(') parens++;
        if (c === ')') parens--;
        if (c === '{') { braces++; braceLines.push(lineNum); }
        if (c === '}') { braces--; braceLines.pop(); }
        if (c === '[') brackets++;
        if (c === ']') brackets--;
    }
}

console.log({ openTemplate, parens, braces, brackets, unclosedBraceLine: braceLines });
