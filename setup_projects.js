const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projects = ['solid-video-editor', 'svelte-video-editor'];

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,svelte}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
        },
        surface: {
          50: 'var(--color-surface-50)',
          100: 'var(--color-surface-100)',
          200: 'var(--color-surface-200)',
          300: 'var(--color-surface-300)',
          400: 'var(--color-surface-400)',
          500: 'var(--color-surface-500)',
          600: 'var(--color-surface-600)',
          700: 'var(--color-surface-700)',
          800: 'var(--color-surface-800)',
          900: 'var(--color-surface-900)',
        }
      }
    },
  },
  plugins: [],
}
`;

const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

const appCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-brand-400: #818cf8;
    --color-brand-500: #6366f1; /* Indigo */
    --color-brand-600: #4f46e5;
    
    --color-surface-50: #f8fafc;
    --color-surface-100: #f1f5f9;
    --color-surface-200: #e2e8f0;
    --color-surface-300: #cbd5e1;
    --color-surface-400: #94a3b8;
    --color-surface-500: #64748b;
    --color-surface-600: #475569;
    --color-surface-700: #334155;
    --color-surface-800: #1e293b;
    --color-surface-900: #0f172a;
  }

  /* Example custom theme */
  [data-theme="neon"] {
    --color-brand-400: #54ff33;
    --color-brand-500: #39ff14; /* Neon Green */
    --color-brand-600: #2be60a;
  }
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--color-surface-900);
  color: var(--color-surface-100);
}
`;

projects.forEach(proj => {
  const root = path.join(__dirname, proj);
  
  // Install Tailwind
  console.log('Installing Tailwind in ' + proj + '...');
  execSync('npm install -D tailwindcss postcss autoprefixer lucide', { cwd: root, stdio: 'inherit' });
  
  // Create configs
  fs.writeFileSync(path.join(root, 'tailwind.config.js'), tailwindConfig);
  fs.writeFileSync(path.join(root, 'postcss.config.js'), postcssConfig);
  
  // Create Folder Structure
  const dirs = [
    'src/components/ui',
    'src/components/timeline',
    'src/components/inspector',
    'src/components/canvas',
    'src/core',
    'src/store',
    'src/styles'
  ];
  
  dirs.forEach(d => fs.mkdirSync(path.join(root, d), { recursive: true }));
  
  // Create styles
  fs.writeFileSync(path.join(root, 'src', 'styles', 'app.css'), appCss);

  // Read index or App files to import styles
  const isSolid = proj.includes('solid');
  if (isSolid) {
    const mainJsxPath = path.join(root, 'src', 'index.jsx');
    if (fs.existsSync(mainJsxPath)) {
      let content = fs.readFileSync(mainJsxPath, 'utf8');
      content = content.replace("import './index.css';", "import './styles/app.css';");
      fs.writeFileSync(mainJsxPath, content);
      
      const appJsxPath = path.join(root, 'src', 'App.jsx');
      fs.writeFileSync(appJsxPath, `import { createSignal } from 'solid-js';\n\nfunction App() {\n  return (\n    <div class="flex flex-col h-screen w-full font-sans bg-surface-900 text-surface-100">\n      <header class="h-14 border-b border-surface-800 flex items-center px-4 shrink-0 bg-surface-900">\n        <h1 class="text-brand-500 font-bold text-lg">SolidJS StudioPro</h1>\n      </header>\n      <main class="flex-1 flex overflow-hidden">\n        <div class="flex-1 border-r border-surface-800 flex items-center justify-center bg-surface-900">\n          {/* Canvas Preview Area */}\n          <div class="text-surface-500">Preview Canvas</div>\n        </div>\n        <aside class="w-80 shrink-0 bg-surface-900 overflow-y-auto">\n          {/* Properties Inspector */}\n          <div class="p-4 border-b border-surface-800">\n            <h2 class="text-sm font-bold text-surface-400 uppercase tracking-wider mb-4">Properties</h2>\n          </div>\n        </aside>\n      </main>\n      <footer class="h-64 border-t border-surface-800 shrink-0 bg-surface-900">\n        {/* Timeline Area */}\n        <div class="p-4 text-surface-500 text-sm">Timeline Tracks</div>\n      </footer>\n    </div>\n  );\n}\n\nexport default App;\n`);
    }
  } else {
    // Svelte
    const mainJsPath = path.join(root, 'src', 'main.js');
    if (fs.existsSync(mainJsPath)) {
      let content = fs.readFileSync(mainJsPath, 'utf8');
      content = content.replace("import './app.css';", "import './styles/app.css';");
      fs.writeFileSync(mainJsPath, content);
      
      const appSveltePath = path.join(root, 'src', 'App.svelte');
      fs.writeFileSync(appSveltePath, `<script>\n  // Svelte Logic\n</script>\n\n<div class="flex flex-col h-screen w-full font-sans bg-surface-900 text-surface-100">\n  <header class="h-14 border-b border-surface-800 flex items-center px-4 shrink-0 bg-surface-900">\n    <h1 class="text-brand-500 font-bold text-lg">Svelte StudioPro</h1>\n  </header>\n  <main class="flex-1 flex overflow-hidden">\n    <div class="flex-1 border-r border-surface-800 flex items-center justify-center bg-surface-900">\n      <!-- Canvas Preview Area -->\n      <div class="text-surface-500">Preview Canvas</div>\n    </div>\n    <aside class="w-80 shrink-0 bg-surface-900 overflow-y-auto">\n      <!-- Properties Inspector -->\n      <div class="p-4 border-b border-surface-800">\n        <h2 class="text-sm font-bold text-surface-400 uppercase tracking-wider mb-4">Properties</h2>\n      </div>\n    </aside>\n  </main>\n  <footer class="h-64 border-t border-surface-800 shrink-0 bg-surface-900">\n    <!-- Timeline Area -->\n    <div class="p-4 text-surface-500 text-sm">Timeline Tracks</div>\n  </footer>\n</div>\n`);
    }
  }
});
console.log("Both projects configured perfectly!");
