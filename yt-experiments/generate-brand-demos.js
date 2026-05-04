const fs = require('fs');
const path = require('path');

const baseFile = path.join(__dirname, 'video-jitter-v0.8.2.html');
const baseHTML = fs.readFileSync(baseFile, 'utf8');

const brands = [
    {
        name: 'hollow-pro',
        fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@800&family=JetBrains+Mono:wght@700&display=swap',
        styles: `
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        body { font-family: 'JetBrains Mono', monospace !important; }
        .dark body, .dark header { background-color: #0c0c0e !important; }
        .dark aside, .dark .template-card-container { background-color: #111114 !important; border-color: #27272a !important; }
        .dark .bg-checker { background-color: #0c0c0e !important; }
        h1, h2, h3, h4, .group-hover\\:text-brand-600 { font-family: 'Syne', sans-serif; font-weight: 800; letter-spacing: -0.02em; text-transform: uppercase; }
        `,
        logoHtml: `
            <a href="#" class="flex items-center gap-3 group translate-y-[-1px]">
                <div class="w-8 h-8 bg-zinc-950 dark:bg-white rounded flex items-center justify-center text-white dark:text-black shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <rect x="4" y="4" width="16" height="16" rx="1" />
                        <rect x="9" y="9" width="6" height="6" rx="0.5" />
                    </svg>
                </div>
                <div class="hidden sm:flex flex-col justify-center -ml-1">
                    <span class="text-3xl font-outfit font-black uppercase leading-none text-transparent logo-stroke" style="letter-spacing: -0.05em;">canvas</span>
                    <span class="text-[8px] font-mono uppercase tracking-[0.5em] text-zinc-500 dark:text-zinc-400 font-bold leading-none mt-1.5 ml-1">labs.pro</span>
                </div>
            </a>
            <style>
                .logo-stroke { -webkit-text-stroke: 1.2px #000; }
                .dark .logo-stroke { -webkit-text-stroke: 1.2px #fff !important; }
            </style>`
    },
    {
        name: 'luxury-silk',
        fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,700&family=Outfit:wght@400;700&display=swap',
        styles: `
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-outfit { font-family: 'Outfit', sans-serif; }
        body { font-family: 'Outfit', sans-serif !important; }
        h1, h2, h3, .group-hover\\:text-brand-600 { font-family: 'Playfair Display', serif !important; font-style: italic; }
        .dark body, .dark header { background-color: #050505 !important; }
        .dark aside, .dark .template-card-container { background-color: #0a0a0a !important; border-color: #1a1a1a !important; }
        .dark .bg-checker { background-color: #050505 !important; }
        .text-brand-600 { color: #d97706 !important; }
        .bg-brand-600 { background-color: #d97706 !important; color: white !important; }
        .dark .text-brand-600 { color: #eab308 !important; }
        .dark .bg-brand-600 { background-color: #eab308 !important; color: black !important; }
        .dark .ring-brand-500 { --tw-ring-color: #eab308 !important; }
        `,
        logoHtml: `
            <a href="#" class="flex items-center gap-3 group">
                <div class="w-8 h-8 bg-[#eab308] rounded-full flex items-center justify-center text-black shadow-sm">
                    <i data-lucide="pen-tool" class="w-4 h-4"></i>
                </div>
                <div class="hidden sm:flex items-baseline gap-1.5">
                    <span class="text-2xl font-serif italic text-gray-900 dark:text-white leading-none">Canvas</span>
                    <span class="text-[10px] font-outfit uppercase tracking-[0.4em] text-[#d97706] dark:text-[#eab308] font-bold leading-none">Labs</span>
                </div>
            </a>`
    },
    {
        name: 'macos-studio',
        fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;700;800&display=swap',
        styles: `
        .font-outfit { font-family: 'Outfit', sans-serif; }
        body { font-family: 'Outfit', sans-serif !important; }
        .dark body, .dark header { background-color: #1c1c1e !important; color: #f5f5f7 !important; }
        .dark aside, .dark .template-card-container { background-color: #2c2c2e !important; border-color: rgba(255,255,255,0.1) !important; }
        .dark .bg-checker { background-color: #1c1c1e !important; }
        .text-brand-600 { color: #0066cc !important; }
        .bg-brand-600 { background-color: #0066cc !important; }
        .dark .text-brand-600 { color: #2997ff !important; }
        .dark .bg-brand-600 { background-color: #2997ff !important; }
        .dark .ring-brand-500 { --tw-ring-color: #2997ff !important; }
        `,
        logoHtml: `
            <a href="#" class="flex items-center gap-4 group">
                <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-[#2c2c2e] px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/5 shadow-sm">
                    <div class="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                </div>
                <div class="hidden sm:flex items-baseline">
                    <span class="text-2xl font-outfit font-bold tracking-tight text-gray-900 dark:text-white leading-none">Canvas</span>
                    <span class="text-2xl font-outfit font-light tracking-tight text-gray-500 dark:text-zinc-400 leading-none">Labs</span>
                </div>
            </a>`,
        drawerLogoHtml: `
            <a href="#" class="flex items-center gap-3 group">
                <div class="w-8 h-8 bg-[#0066cc] rounded flex items-center justify-center text-white shadow-lg">
                    <i data-lucide="aperture" class="w-5 h-5"></i>
                </div>
                <div class="flex items-baseline">
                    <span class="text-xl font-outfit font-bold tracking-tight text-gray-900 dark:text-white leading-none">Canvas</span>
                    <span class="text-xl font-outfit font-light tracking-tight text-gray-500 dark:text-zinc-400 leading-none ml-0.5">Labs</span>
                </div>
            </a>`
    },
    {
        name: 'blueprint-pro',
        fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@800&family=JetBrains+Mono:wght@700&display=swap',
        styles: `
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        h1, h2, h3, .group-hover\\:text-brand-600 { font-family: 'Syne', sans-serif; font-weight: 800; text-transform: uppercase; }
        .dark body, .dark .bg-checker { 
            background-color: #1e3a8a !important; 
            background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px) !important; 
            background-size: 20px 20px !important;
            color: #eff6ff !important;
        }
        .dark header { background-color: rgba(30, 58, 138, 0.8) !important; backdrop-filter: blur(10px); border-bottom-color: rgba(255,255,255,0.1) !important; }
        .dark aside { background-color: rgba(30, 58, 138, 0.95) !important; backdrop-filter: blur(10px); border-right-color: rgba(255,255,255,0.1) !important; }
        .dark .template-card-container { background-color: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.1) !important; backdrop-filter: blur(10px); }
        .dark .text-brand-600 { color: #60a5fa !important; }
        .dark .bg-brand-600 { background-color: #60a5fa !important; color: #1e3a8a !important; }
        .dark .ring-brand-500 { --tw-ring-color: #60a5fa !important; }
        `,
        logoHtml: `
            <a href="#" class="flex items-center gap-3 group">
                <div class="w-8 h-8 bg-[#1e3a8a] rounded-md flex items-center justify-center text-white shadow-sm border border-blue-400/30">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M3 3h18v18H3z"/><path d="M3 12h18"/><path d="M12 3v18"/><circle cx="12" cy="12" r="4" opacity="0.5"/>
                    </svg>
                </div>
                <div class="hidden sm:flex flex-col justify-center">
                    <span class="text-[1.35rem] font-syne uppercase font-black tracking-tighter text-gray-900 dark:text-white leading-none">Canvas</span>
                    <div class="flex items-center gap-1 mt-0.5">
                        <div class="h-1.5 w-4 bg-[#1e3a8a] dark:bg-blue-400"></div>
                        <span class="text-[8px] font-mono uppercase text-gray-500 dark:text-blue-200 font-bold tracking-[0.2em] leading-none">LABS.PRO</span>
                    </div>
                </div>
            </a>`
    },
    {
        name: 'handcrafted-script',
        fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Dancing+Script:wght@700&display=swap',
        styles: `
        .font-script { font-family: 'Dancing Script', cursive; }
        h1 { font-family: 'Dancing Script', cursive !important; font-size: 2.5rem !important; text-transform: lowercase; }
        .dark body, .dark header { background-color: #111 !important; }
        .dark aside, .dark .template-card-container { background-color: #1a1a1a !important; border-color: #222 !important; }
        .dark .bg-checker { background-color: #111 !important; }
        `,
        logoHtml: `
            <a href="#" class="flex items-center gap-3 group">
                <div class="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black shadow-sm">
                    <span class="text-xl font-script leading-none translate-y-[-1px]">c</span>
                </div>
                <div class="hidden sm:flex items-center">
                    <span class="text-3xl font-script tracking-tight text-gray-900 dark:text-white leading-none translate-y-[2px]">canvas</span>
                </div>
            </a>`
    }
];

const fontRegex = /<link href="https:\/\/fonts\.googleapis\.com[^>]*?rel="stylesheet">/s;
const logoRegex = /<!-- Logo -->\s*<a href="#" class="flex items-center gap-\d+ group">.*?<\/a>/s;
const styleInsertRegex = /<\/style>/;
const titleRegex = /<title>.*?<\/title>/;

brands.forEach(brand => {
    let newHTML = baseHTML;
    
    // Replace fonts
    newHTML = newHTML.replace(fontRegex, `<link href="${brand.fonts}" rel="stylesheet">`);
    
    // Replace logo in all locations
    // 1. Main Header Logo
    newHTML = newHTML.replace(logoRegex, `<!-- Logo -->\n${brand.logoHtml}`);
    
    // 2. Sidebar Logo Placeholder (Desktop)
    newHTML = newHTML.replace(/<!-- Sidebar Logo Placeholder -->/, brand.logoHtml);
    
    // 3. Drawer Logo (Mobile Hamburger Menu)
    const drawerLogoRegex = /<aside id="sidebarDrawer"[\s\S]*?<a href="#" class="flex items-center gap-3 group">[\s\S]*?<\/a>/;
    const finalDrawerLogo = brand.drawerLogoHtml || brand.logoHtml;
    newHTML = newHTML.replace(drawerLogoRegex, match => {
        return match.replace(/<a href="#" class="flex items-center gap-3 group">[\s\S]*?<\/a>/, finalDrawerLogo);
    });
    
    // Inject extra styles before </style>
    newHTML = newHTML.replace(styleInsertRegex, `${brand.styles}\n    </style>`);

    // Replace Title
    newHTML = newHTML.replace(titleRegex, `<title>Canvas Labs | ${brand.name}</title>`);
    
    const outPath = path.join(__dirname, `demo-${brand.name}.html`);
    fs.writeFileSync(outPath, newHTML);
    console.log(`Created ${outPath}`);
});
