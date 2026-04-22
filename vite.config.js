import { defineConfig } from 'vite';
import { resolve } from 'path';
import { globSync } from 'glob';

// Dynamically grab all HTML files to bundle them properly for GitHub Pages SSG deployment
const htmlFiles = globSync('**/*.html', {
  ignore: ['node_modules/**', 'dist/**']
});

const input = {};
htmlFiles.forEach(file => {
  const name = file.replace(/\\/g, '/').replace('.html', '');
  input[name] = resolve(__dirname, file);
});

export default defineConfig({
  build: {
    rollupOptions: {
      input
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
