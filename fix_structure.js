const fs = require('fs');
const path = require('path');

const srcHTML = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
const destDir = path.join(__dirname, 'audio-editor-modular');

// 1. Fix HTML
const htmlContent = fs.readFileSync(srcHTML, 'utf8');
const scriptStart = htmlContent.lastIndexOf('<script>');
const scriptEnd = htmlContent.lastIndexOf('</script>');

const newHtml = htmlContent.substring(0, scriptStart) + '<script type="module" src="./js/main.js"></script>\n</body>\n</html>';
fs.writeFileSync(path.join(destDir, 'index.html'), newHtml);

// 2. Extract full script
const fullScript = htmlContent.substring(scriptStart + 8, scriptEnd);
const lines = fullScript.split('\n');

// 3. Define structure
const chunksConfig = [
    { name: 'core.js', folder: 'core', startLine: 0, endLine: 191 }, // Palettes, State, DOM
    { name: 'ui.js', folder: 'ui', startLine: 192, endLine: 950, extraStart: 1080, extraEnd: 1517 }, // Init, Keys, Inspector
    { name: 'audio.js', folder: 'audio', startLine: 951, endLine: 1079, extraStart: 2433, extraEnd: 2576 }, // WebAudio, Playback
    { name: 'timeline.js', folder: 'timeline', startLine: 1518, endLine: 1863, extraStart: 2080, extraEnd: 2432 }, // Tracks, Edit, Canvas Drag
    { name: 'canvas.js', folder: 'canvas', startLine: 1864, endLine: 2079 }, // Render
    { name: 'export.js', folder: 'export', startLine: 2577, endLine: lines.length - 1 }
];

const modules = {};

chunksConfig.forEach(cfg => {
    let chunkLines = lines.slice(cfg.startLine, cfg.endLine + 1);
    if (cfg.extraStart) {
        chunkLines = chunkLines.concat(lines.slice(cfg.extraStart, cfg.extraEnd + 1));
    }
    
    chunkLines = chunkLines.map(line => {
        if (line.match(/^ {8}const\s+(btn|canvasColor|time|file|zoom|icon|header|main|timeline|properties|sidebar|export|view|preview)[a-zA-Z0-9_]*\s*=\s*document\.getElementById/)) {
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

    chunkLines = chunkLines.map(line => line.replace('        const State =', '        export const State ='));

    modules[cfg.name] = {
        folder: cfg.folder,
        lines: chunkLines,
        exports: []
    };
});

// Find exports
for (const [name, mod] of Object.entries(modules)) {
    mod.lines.forEach(line => {
        const match = line.match(/^ {8}export\s+(?:const|let|var|function)\s+([a-zA-Z0-9_]+)/);
        if (match && match[1]) {
            mod.exports.push(match[1]);
        }
    });
}

// Generate imports with relative paths
for (const [name, mod] of Object.entries(modules)) {
    let importBlock = '';
    for (const [otherName, otherMod] of Object.entries(modules)) {
        if (name !== otherName && otherMod.exports.length > 0) {
            importBlock += `import { ${otherMod.exports.join(', ')} } from '../${otherMod.folder}/${otherName}';\n`;
        }
    }
    
    const unindentedLines = mod.lines.map(l => l.startsWith('        ') ? l.substring(8) : l);
    mod.finalContent = importBlock + '\n' + unindentedLines.join('\n');
    
    const targetFilePath = path.join(destDir, 'js', mod.folder, name);
    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
    fs.writeFileSync(targetFilePath, mod.finalContent);
}

const mainJs = `import { init } from './ui/ui.js';\ndocument.addEventListener('DOMContentLoaded', init);`;
fs.writeFileSync(path.join(destDir, 'js', 'main.js'), mainJs);

console.log("Fix complete with correct boundaries!");
