import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// __dirname equivalent for ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

// Dynamically grab all HTML files to bundle them properly for GitHub Pages SSG deployment.
// This ensures that all prototypes in design-demos, paper-animator, and animations are captured.
const htmlFiles = globSync('**/*.html', {
  ignore: ['node_modules/**', 'dist/**', '**/node_modules/**']
});

const input = {};
htmlFiles.forEach(file => {
  // Normalize path for consistent keys
  const normalized = file.replace(/\\/g, '/');
  const name = normalized.replace('.html', '');
  input[name] = resolve(__dirname, normalized);
});

export default defineConfig({
  base: './',
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
