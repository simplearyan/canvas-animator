const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'solid-video-editor', 'src', 'core', 'engine.js');
const dest = path.join(__dirname, 'svelte-video-editor', 'src', 'core', 'engine.js');

let content = fs.readFileSync(src, 'utf8');
content = content.replace("import { State } from '../store/state';", "import { State } from '../store/state.svelte';");

// Make sure directory exists
fs.mkdirSync(path.dirname(dest), { recursive: true });

fs.writeFileSync(dest, content);
console.log('Engine copied to Svelte successfully!');
