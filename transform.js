const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_pro.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace slate with pro
content = content.replace(/\bslate\b/g, 'pro');
content = content.replace(/text-pro-900\/80/g, 'text-pro-900/80 dark:text-white/80');

// 2. Add dark mode classes mapping
const classMap = {
    'bg-white': 'bg-white dark:bg-pro-800',
    'bg-pro-50': 'bg-pro-50 dark:bg-pro-900',
    'bg-pro-100': 'bg-pro-100 dark:bg-pro-800',
    'bg-pro-200': 'bg-pro-200 dark:bg-pro-950',
    
    'text-pro-900': 'text-pro-900 dark:text-white',
    'text-pro-800': 'text-pro-800 dark:text-pro-200',
    'text-pro-700': 'text-pro-700 dark:text-pro-300',
    'text-pro-600': 'text-pro-600 dark:text-pro-300',
    'text-pro-500': 'text-pro-500 dark:text-pro-400',
    'text-pro-400': 'text-pro-400 dark:text-pro-500',
    
    'border-pro-200': 'border-pro-200 dark:border-pro-700',
    'border-pro-100': 'border-pro-100 dark:border-pro-800',
    'border-pro-300': 'border-pro-300 dark:border-pro-700',
    
    'hover:bg-pro-50': 'hover:bg-pro-50 dark:hover:bg-pro-700',
    'hover:bg-pro-100': 'hover:bg-pro-100 dark:hover:bg-pro-700',
    'hover:text-pro-900': 'hover:text-pro-900 dark:hover:text-white',
    
    'border-b border-pro-200': 'border-b border-pro-200 dark:border-pro-700',
    'border-r border-pro-200': 'border-r border-pro-200 dark:border-pro-700',
    'border-t border-pro-200': 'border-t border-pro-200 dark:border-pro-700',
};

// We only want to replace whole words within class attributes.
// This is a simple regex that finds class="..." and replaces inside it.
content = content.replace(/class="([^"]+)"/g, (match, classes) => {
    let classArray = classes.split(/\s+/);
    classArray = classArray.map(c => classMap[c] ? classMap[c] : c);
    // Flatten in case classMap[c] returned a string with spaces
    classArray = classArray.join(' ').split(/\s+/);
    // Remove duplicates
    classArray = [...new Set(classArray)];
    return `class="${classArray.join(' ')}"`;
});

// 3. Inject Tailwind Config and Dark Mode Script
const headStart = content.indexOf('<head>') + 6;
const newHeadStuff = `
    <!-- Dark Mode Init -->
    <script>
        (function() {
            try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                } else {
                    var hour = new Date().getHours();
                    if (hour >= 6 && hour < 18) {
                        document.documentElement.classList.remove('dark');
                    } else {
                        document.documentElement.classList.add('dark');
                    }
                }
            } catch (e) {}
        })();
    </script>
`;

content = content.slice(0, headStart) + newHeadStuff + content.slice(headStart);

// Update tailwind config
content = content.replace(/tailwind\.config = \{[\s\S]*?\}/, `tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
                    colors: {
                        pro: { 50: '#f8f8f8', 100: '#eeeeee', 200: '#dddddd', 300: '#bbbbbb', 400: '#888888', 500: '#555555', 600: '#333333', 700: '#262626', 800: '#1a1a1a', 900: '#111111', 950: '#0a0a0a' },
                        brand: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' }
                    }
                }
            }
        }`);

// Font import replacement
content = content.replace('family=Inter:wght@400;500;600;700', 'family=Plus+Jakarta+Sans:wght@400;500;600;700;800');

// Inject the dark mode toggle button in the header
const headerMatch = content.indexOf('<!-- RIGHT: Import / Export -->');
if(headerMatch !== -1) {
    const toggleButton = `
            <button id="btnToggleTheme" class="p-2 text-pro-500 hover:text-pro-800 dark:text-pro-400 dark:hover:text-white rounded-full hover:bg-pro-100 dark:hover:bg-pro-700 shrink-0">
                <i data-lucide="moon" class="w-4 h-4 dark:hidden"></i>
                <i data-lucide="sun" class="w-4 h-4 hidden dark:block"></i>
            </button>
            <div class="hidden sm:block w-px h-4 bg-pro-200 dark:bg-pro-700 mx-0.5"></div>
            `;
    content = content.slice(0, headerMatch) + toggleButton + content.slice(headerMatch);
}

// Write the result
fs.writeFileSync(filePath, content, 'utf8');
console.log('Done transforming studiopro_editor_pro.html');
