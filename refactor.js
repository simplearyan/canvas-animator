const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'audio-editor-modular', 'js', 'full_script.js');
const outDir = path.join(__dirname, 'audio-editor-modular', 'js');
const lines = fs.readFileSync(srcFile, 'utf8').split('\n');

const chunksConfig = [
    { name: 'core.js', startLine: 0, endLine: 733 },
    { name: 'ui.js', startLine: 734, endLine: 1492, extraStart: 1622, extraEnd: 2059 },
    { name: 'audio.js', startLine: 1493, endLine: 1621, extraStart: 2975, extraEnd: 3118 },
    { name: 'timeline.js', startLine: 2060, endLine: 2405, extraStart: 2622, extraEnd: 2974 },
    { name: 'canvas.js', startLine: 2406, endLine: 2621 },
    { name: 'export.js', startLine: 3119, endLine: lines.length }
];

const modules = {};

// 1. Extract and add "export"
chunksConfig.forEach(cfg => {
    let chunkLines = lines.slice(cfg.startLine, cfg.endLine + 1);
    if (cfg.extraStart) {
        chunkLines = chunkLines.concat(lines.slice(cfg.extraStart, cfg.extraEnd + 1));
    }
    
    // Add export to root level declarations (EXACTLY 8 spaces)
    chunkLines = chunkLines.map(line => {
        // Special fix for DOM elements that are queried, convert const to let and export
        if (line.match(/^ {8}const\s+(btn|canvasColor|time|file|zoom|icon)[a-zA-Z0-9_]*\s*=\s*document\.getElementById/)) {
            return line.replace(/^ {8}const/, '        export let');
        }
        if (line.match(/^ {8}(const|let|var)\s+[a-zA-Z0-9_]+\s*=/)) {
            return line.replace(/^ {8}(const|let|var)/, '        export $1');
        }
        if (line.match(/^ {8}function\s+[a-zA-Z0-9_]+\s*\(/)) {
            return line.replace(/^ {8}function/, '        export function');
        }
        return line;
    });

    // Special fix for State object
    chunkLines = chunkLines.map(line => line.replace('        const State =', '        export const State ='));

    modules[cfg.name] = {
        lines: chunkLines,
        exports: []
    };
});

// 2. Discover all exports
for (const [name, mod] of Object.entries(modules)) {
    mod.lines.forEach(line => {
        const match = line.match(/^ {8}export\s+(?:const|let|var|function)\s+([a-zA-Z0-9_]+)/);
        if (match && match[1]) {
            mod.exports.push(match[1]);
        }
    });
}

// 3. Generate imports for each module
for (const [name, mod] of Object.entries(modules)) {
    let importBlock = '';
    for (const [otherName, otherMod] of Object.entries(modules)) {
        if (name !== otherName && otherMod.exports.length > 0) {
            importBlock += `import { ${otherMod.exports.join(', ')} } from './${otherName}';\n`;
        }
    }
    
    // Remove the 8 space indentation for the final module content
    const unindentedLines = mod.lines.map(l => l.startsWith('        ') ? l.substring(8) : l);
    mod.finalContent = importBlock + '\n' + unindentedLines.join('\n');
    
    fs.writeFileSync(path.join(outDir, name), mod.finalContent);
}

// 4. Create main.js
const mainJs = `
import { init } from './ui.js';
document.addEventListener('DOMContentLoaded', init);
`;
fs.writeFileSync(path.join(outDir, 'main.js'), mainJs.trim());

console.log("Refactoring complete. Modules created safely.");
