const fs = require('fs');
const path = require('path');

const baseFile = path.join(__dirname, 'v0.8.6-sidebar-perfect.html');
const outputFolder = path.join(__dirname, 'v0.8.6-brand-demo');

if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

const baseHTML = fs.readFileSync(baseFile, 'utf8');

const brands = [
    {
        name: 'hollow-industrial',
        fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@800&family=JetBrains+Mono:wght@700&display=swap',
        styles: `
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        body { font-family: 'JetBrains Mono', monospace !important; }
        .dark body, .dark header { background-color: #0c0c0e !important; }
        .dark aside, .dark .template-card-container { background-color: #111114 !important; border-color: #27272a !important; }
        .dark .bg-checker { background-color: #0c0c0e !important; }
        h1, h2, h3, h4, .group-hover\\:text-brand-600 { font-family: 'Syne', sans-serif; font-weight: 800; letter-spacing: -0.02em; text-transform: uppercase; }
        
        .logo-stroke { -webkit-text-stroke: 1.2px #000; }
        .dark .logo-stroke { -webkit-text-stroke: 1.2px #fff !important; }
        `,
        logoHtml: `
            <a href="#" class="flex items-center gap-2.5 sm:gap-3 group">
                <div class="w-7 h-7 sm:w-8 sm:h-8 bg-zinc-950 dark:bg-white rounded flex items-center justify-center text-white dark:text-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.15)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] border border-black/10 dark:border-white/20 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <rect x="4" y="4" width="16" height="16" rx="1" />
                        <rect x="9" y="9" width="6" height="6" rx="0.5" />
                    </svg>
                </div>
                <div class="flex items-baseline -ml-1">
                    <span class="text-xl sm:text-2xl font-syne font-black uppercase leading-none text-transparent logo-stroke" style="letter-spacing: -0.05em;">canvas</span>
                    <span class="text-[8px] sm:text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 font-bold leading-none mt-1 ml-1">labs</span>
                </div>
            </a>`
    },
    {
        name: 'luxury-gold',
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
        `,
        logoHtml: `
            <a href="#" class="flex items-center gap-2.5 sm:gap-3 group">
                <div class="w-7 h-7 sm:w-8 sm:h-8 bg-[#eab308] rounded-full flex items-center justify-center text-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] border border-yellow-600/20 flex-shrink-0">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                </div>
                <div class="flex items-baseline gap-1.5">
                    <span class="text-xl sm:text-2xl font-serif italic text-gray-900 dark:text-white leading-none">Canvas</span>
                    <span class="text-[10px] font-outfit uppercase tracking-[0.4em] text-[#d97706] dark:text-[#eab308] font-bold leading-none">Labs</span>
                </div>
            </a>`
    },
    {
        name: 'macos-monterey',
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
        `,
        logoHtml: `
            <a href="#" class="flex items-center gap-3 sm:gap-4 group">
                <div class="flex items-center gap-1 bg-gray-100 dark:bg-[#2c2c2e] px-2 py-1.5 rounded-lg border border-gray-200 dark:border-white/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                    <div class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ff5f57] shadow-inner"></div>
                    <div class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#febc2e] shadow-inner"></div>
                    <div class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#28c840] shadow-inner"></div>
                </div>
                <div class="flex items-baseline">
                    <span class="text-xl sm:text-2xl font-outfit font-bold tracking-tight text-gray-900 dark:text-white leading-none">Canvas</span>
                    <span class="text-xl sm:text-2xl font-outfit font-light tracking-tight text-gray-500 dark:text-zinc-400 leading-none">Labs</span>
                </div>
            </a>`
    },
    {
        name: 'cyber-future',
        fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;700&family=JetBrains+Mono:wght@500&display=swap',
        styles: `
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        body { font-family: 'Space Grotesk', sans-serif !important; }
        .dark body, .dark header { background-color: #000000 !important; }
        .dark aside, .dark .template-card-container { background-color: #0a0a0a !important; border-color: #33ff0033 !important; }
        .text-brand-600 { color: #33ff00 !important; }
        .bg-brand-600 { background-color: #33ff00 !important; color: black !important; }
        .dark .bg-checker { background-color: #050505 !important; }
        
        .cyber-glow { text-shadow: 0 0 10px #33ff0066; }
        `,
        logoHtml: `
            <a href="#" class="flex items-center gap-2.5 sm:gap-3 group">
                <div class="w-7 h-7 sm:w-8 sm:h-8 bg-black border border-[#33ff00] rounded flex items-center justify-center text-[#33ff00] shadow-[0_0_10px_#33ff0033,inset_0_0_5px_#33ff0033]">
                    <i data-lucide="zap" class="w-4 h-4 sm:w-5 h-5"></i>
                </div>
                <div class="flex items-baseline">
                    <span class="text-xl sm:text-2xl font-space font-bold uppercase tracking-tighter text-[#33ff00] cyber-glow">CANVAS</span>
                    <span class="text-xl sm:text-2xl font-space font-light uppercase tracking-widest text-zinc-500 ml-1">_LABS</span>
                </div>
            </a>`
    },
    {
        name: 'minimalist-studio',
        fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@200;800&display=swap',
        styles: `
        .font-manrope { font-family: 'Manrope', sans-serif; }
        body { font-family: 'Inter', sans-serif !important; }
        .dark body, .dark header { background-color: #ffffff !important; color: #000 !important; }
        .dark aside, .dark .template-card-container { background-color: #fafafa !important; border-color: #eeeeee !important; }
        .dark .text-gray-900, .dark .text-white { color: #000 !important; }
        .dark .text-gray-500, .dark .text-zinc-400 { color: #666 !important; }
        .text-brand-600, .dark .text-brand-600 { color: #000 !important; }
        .bg-brand-600, .dark .bg-brand-600 { background-color: #000 !important; color: #fff !important; }
        `,
        logoHtml: `
            <a href="#" class="flex items-center gap-2 group">
                <div class="w-6 h-6 bg-black rounded-none flex items-center justify-center text-white">
                    <div class="w-2 h-2 bg-white"></div>
                </div>
                <span class="text-xl font-manrope font-extrabold uppercase tracking-[0.2em] text-black">STUDIO</span>
            </a>`
    }
];

const fontRegex = /<link href="https:\/\/fonts\.googleapis\.com[^>]*?rel="stylesheet">/s;
const logoRegex = /<!-- Logo -->\s*<a href="#" class="flex items-center gap-[\d.]+ sm:gap-\d+ group">.*?<\/a>/s;
const drawerLogoRegex = /<aside id="sidebarDrawer"[\s\S]*?<a href="#" class="flex items-center gap-[\d.]+ sm:gap-\d+ group">.*?<\/a>/s;
const styleInsertRegex = /<\/style>/;
const titleRegex = /<title>.*?<\/title>/;

brands.forEach(brand => {
    let newHTML = baseHTML;
    
    // Replace fonts
    newHTML = newHTML.replace(fontRegex, `<link href="${brand.fonts}" rel="stylesheet">`);
    
    // Replace Header Logo
    newHTML = newHTML.replace(logoRegex, `<!-- Logo -->\n${brand.logoHtml}`);
    
    // Replace Drawer Logo
    newHTML = newHTML.replace(drawerLogoRegex, match => {
        return match.replace(/<a href="#" class="flex items-center gap-[\d.]+ sm:gap-\d+ group">.*?<\/a>/s, brand.logoHtml);
    });
    
    // Inject extra styles
    newHTML = newHTML.replace(styleInsertRegex, `${brand.styles}\n    </style>`);

    // Update Title
    newHTML = newHTML.replace(titleRegex, `<title>Canvas Labs | ${brand.name.toUpperCase()}</title>`);
    
    // Update OG Title
    newHTML = newHTML.replace(/property="og:title" content=".*?"/, `property="og:title" content="Canvas Labs | ${brand.name.toUpperCase()}"`);
    
    const outPath = path.join(outputFolder, `v0.8.6-brand-${brand.name}.html`);
    fs.writeFileSync(outPath, newHTML);
    console.log(`Created ${outPath}`);
});
