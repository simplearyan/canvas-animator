const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Fix engine.js
const enginePath = path.join(__dirname, 'solid-video-editor', 'src', 'core', 'engine.js');
let engineLines = fs.readFileSync(enginePath, 'utf8').split('\n');
const funcStart = engineLines.findIndex(l => l.includes('export function updateCanvasResolution() {'));
if(funcStart !== -1) {
  engineLines.splice(funcStart, 2, `export function updateCanvasResolution() {
    const canvas = document.getElementById('renderCanvas');
    if (!canvas) return { w: 1920, h: 1080 };
    let aspectStr = State.aspectRatio || '16:9';
    const [wRatio, hRatio] = aspectStr.split(':').map(Number);
    const baseRes = 1920; 
    let targetW, targetH;
    if (wRatio >= hRatio) {
        targetW = baseRes;
        targetH = baseRes * (hRatio / wRatio);
    } else {
        targetH = baseRes;
        targetW = baseRes * (wRatio / hRatio);
    }
    canvas.width = targetW;
    canvas.height = targetH;
    return { w: targetW, h: targetH };
}`);
  fs.writeFileSync(enginePath, engineLines.join('\n'));
}

// 2. Fix PostCSS configs and packages
const projs = ['solid-video-editor', 'svelte-video-editor'];
projs.forEach(p => {
  const root = path.join(__dirname, p);
  execSync('npm install -D @tailwindcss/postcss', { cwd: root, stdio: 'inherit' });
  fs.writeFileSync(path.join(root, 'postcss.config.js'), `export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}`);
});
console.log('Fixed engine and PostCSS config!');
