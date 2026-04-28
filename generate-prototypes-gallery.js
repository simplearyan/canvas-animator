/**
 * generate-prototypes-gallery.js
 * macOS-themed gallery generator for Animator Studio.
 */
const fs = require('fs');
const path = require('path');
const config = require('./_config');

const rootDir = __dirname;
const outputFile = path.join(rootDir, 'prototypes-gallery.html');

function scanRecursive(dir, relativePath = '') {
    const items = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            if (['node_modules', '.git', 'screenshots', '.github'].includes(file.name)) continue;
            
            const subItems = scanRecursive(path.join(dir, file.name), path.join(relativePath, file.name));
            if (subItems.length > 0) {
                items.push({
                    type: 'directory',
                    name: file.name,
                    label: file.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    path: path.join(relativePath, file.name),
                    children: subItems
                });
            }
        } else if (file.name.endsWith('.html') && file.name !== 'index.html' && file.name !== 'prototypes-gallery.html') {
            const cleanRelPath = relativePath.replace(/\\/g, '/');
            const screenshotPathStr = cleanRelPath ? `${cleanRelPath}/${file.name.replace('.html', '.png')}` : file.name.replace('.html', '.png');
            const screenshotRel = `./screenshots/${screenshotPathStr}`;
            const screenshotAbs = path.join(rootDir, 'public', 'screenshots', relativePath, file.name.replace('.html', '.png'));
            const hasScreenshot = fs.existsSync(screenshotAbs);

            items.push({
                type: 'file',
                name: file.name,
                path: path.join(relativePath, file.name).replace(/\\/g, '/'),
                cleanName: file.name.replace('.html', '').replace(/[-_.]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                screenshot: hasScreenshot ? screenshotRel : null
            });
        }
    }
    
    return items.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
}

function extractCategories(hierarchy) {
    const categories = [];
    function traverse(items, depth) {
        for (const item of items) {
            if (item.type === 'directory') {
                categories.push({
                    id: item.path.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                    name: item.label,
                    depth: depth,
                    path: item.path
                });
                traverse(item.children, depth + 1);
            }
        }
    }
    traverse(hierarchy, 0);
    return categories;
}

function extractAllFiles(hierarchy) {
    const files = [];
    function traverse(items, currentCategory) {
        for (const item of items) {
            if (item.type === 'directory') {
                traverse(item.children, item.path.toLowerCase().replace(/[^a-z0-9]/g, '-'));
            } else if (item.type === 'file') {
                files.push({ ...item, categoryId: currentCategory });
            }
        }
    }
    traverse(hierarchy, 'all');
    return files;
}

function generateHTML(hierarchy) {
    const categories = extractCategories(hierarchy);
    const files = extractAllFiles(hierarchy);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prototypes Gallery // ${config.title}</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            /* Light Mode (macOS Light) */
            --bg-body: #f5f5f7;
            --bg-sidebar: rgba(235, 235, 240, 0.7);
            --bg-content: #ffffff;
            --bg-card: #ffffff;
            --text-main: #1d1d1f;
            --text-muted: #86868b;
            --text-sidebar: #424245;
            --border-color: rgba(0, 0, 0, 0.1);
            --accent-blue: #0071e3;
            --shadow-card: 0 4px 12px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02);
            --shadow-card-hover: 0 12px 24px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04);
            --search-bg: rgba(0,0,0,0.05);
            --active-bg: rgba(0,0,0,0.06);
            --blur: blur(25px);
        }

        [data-theme="dark"] {
            /* Dark Mode (macOS Dark) */
            --bg-body: #000000;
            --bg-sidebar: rgba(30, 30, 30, 0.6);
            --bg-content: #1e1e1e;
            --bg-card: #2c2c2e;
            --text-main: #f5f5f7;
            --text-muted: #a1a1a6;
            --text-sidebar: #e5e5ea;
            --border-color: rgba(255, 255, 255, 0.1);
            --accent-blue: #0a84ff;
            --shadow-card: 0 4px 12px rgba(0,0,0,0.3);
            --shadow-card-hover: 0 12px 24px rgba(0,0,0,0.5);
            --search-bg: rgba(255,255,255,0.1);
            --active-bg: rgba(255,255,255,0.1);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-body);
            color: var(--text-main);
            height: 100vh;
            overflow: hidden;
            display: flex;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* macOS Window Frame */
        .app-window {
            display: flex;
            flex: 1;
            margin: 20px;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--border-color);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            background-color: var(--bg-content);
            transition: all 0.3s ease;
        }

        /* Sidebar */
        .sidebar {
            width: 260px;
            background: var(--bg-sidebar);
            backdrop-filter: var(--blur);
            -webkit-backdrop-filter: var(--blur);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            z-index: 10;
        }

        .window-controls {
            padding: 16px;
            display: flex;
            gap: 8px;
        }

        .traffic-light {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        .traffic-light.close { background: #ff5f56; border: 1px solid #e0443e; }
        .traffic-light.minimize { background: #ffbd2e; border: 1px solid #dea123; }
        .traffic-light.maximize { background: #27c93f; border: 1px solid #1aab29; }

        .sidebar-title {
            padding: 0 16px 8px;
            font-size: 11px;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 10px;
        }

        .nav-list {
            list-style: none;
            overflow-y: auto;
            flex: 1;
            padding: 0 10px 16px;
        }

        .nav-item {
            padding: 6px 10px;
            margin-bottom: 2px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            color: var(--text-sidebar);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.1s ease;
        }

        .nav-item:hover {
            background: var(--active-bg);
        }

        .nav-item.active {
            background: var(--accent-blue);
            color: #fff;
            font-weight: 500;
        }
        
        .nav-item.active .folder-icon {
            filter: brightness(2) saturate(0);
        }

        .folder-icon {
            font-size: 16px;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: var(--bg-content);
            position: relative;
        }

        /* Top Bar */
        .topbar {
            height: 52px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            padding: 0 20px;
            justify-content: space-between;
            background: rgba(var(--bg-content), 0.8);
            backdrop-filter: var(--blur);
            -webkit-backdrop-filter: var(--blur);
            z-index: 5;
        }

        .search-container {
            display: flex;
            align-items: center;
            background: var(--search-bg);
            border-radius: 6px;
            padding: 4px 10px;
            width: 240px;
            border: 1px solid transparent;
            transition: border 0.2s ease, background 0.2s ease;
        }
        
        .search-container:focus-within {
            border: 1px solid var(--accent-blue);
            background: var(--bg-card);
        }

        .search-icon {
            font-size: 12px;
            color: var(--text-muted);
            margin-right: 6px;
        }

        .search-input {
            border: none;
            background: transparent;
            outline: none;
            color: var(--text-main);
            font-size: 13px;
            width: 100%;
            font-family: inherit;
        }
        
        .search-input::placeholder {
            color: var(--text-muted);
        }

        .theme-toggle {
            background: transparent;
            border: none;
            color: var(--text-main);
            cursor: pointer;
            font-size: 18px;
            padding: 4px;
            border-radius: 50%;
            transition: background 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .theme-toggle:hover {
            background: var(--active-bg);
        }

        /* Gallery Grid */
        .gallery-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }

        .gallery-header {
            margin-bottom: 24px;
        }

        .gallery-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .gallery-count {
            font-size: 13px;
            color: var(--text-muted);
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 20px;
        }

        .card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            overflow: hidden;
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
            box-shadow: var(--shadow-card);
            cursor: pointer;
        }

        .card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-card-hover);
        }

        .card-thumb {
            aspect-ratio: 16/10;
            background: var(--search-bg);
            border-bottom: 1px solid var(--border-color);
            position: relative;
            overflow: hidden;
        }

        .card-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
        }
        
        .card:hover .card-thumb img {
            transform: scale(1.05);
        }

        .card-thumb-placeholder {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            opacity: 0.2;
        }

        .card-body {
            padding: 12px 14px;
        }

        .card-name {
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .card-path {
            font-size: 11px;
            color: var(--text-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
        }
        
        .empty-state {
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            color: var(--text-muted);
            text-align: center;
        }
        
        .empty-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
        }
        
        .empty-title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 8px;
            color: var(--text-main);
        }

        .mobile-menu-btn {
            display: none;
            background: transparent;
            border: none;
            color: var(--text-main);
            font-size: 20px;
            cursor: pointer;
            padding: 4px 8px;
            margin-right: 8px;
        }

        .overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.4);
            z-index: 8;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .overlay.active {
            opacity: 1;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .app-window { margin: 0; border-radius: 0; border: none; }
            .sidebar { width: 220px; }
            .grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
        }
        
        @media (max-width: 600px) {
            .mobile-menu-btn { display: block; }
            .sidebar {
                position: fixed;
                top: 0;
                bottom: 0;
                left: -260px;
                width: 260px;
                z-index: 10;
                transition: transform 0.3s ease;
            }
            .sidebar.mobile-open {
                transform: translateX(260px);
            }
            .grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px;}
            .card-body { padding: 10px; }
            .search-container { width: auto; flex: 1; margin: 0 10px; }
        }
    </style>
</head>
<body>
    <div class="app-window">
        <div class="overlay" id="sidebar-overlay"></div>
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="window-controls">
                <div class="traffic-light close"></div>
                <div class="traffic-light minimize"></div>
                <div class="traffic-light maximize"></div>
            </div>
            
            <div class="sidebar-title">Locations</div>
            <ul class="nav-list" id="category-list">
                <li class="nav-item active" data-category="all">
                    <span class="folder-icon">🌟</span> All Prototypes
                </li>
                ${categories.map(cat => `
                <li class="nav-item" data-category="${cat.id}" style="padding-left: ${10 + cat.depth * 10}px">
                    <span class="folder-icon">📁</span> ${cat.name}
                </li>`).join('')}
            </ul>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Top Bar -->
            <header class="topbar">
                <button class="mobile-menu-btn" id="mobile-menu-btn">☰</button>
                <div class="search-container">
                    <span class="search-icon">🔍</span>
                    <input type="text" class="search-input" id="search" placeholder="Search prototypes..." autocomplete="off">
                </div>
                
                <button class="theme-toggle" id="theme-btn" title="Toggle Theme">
                    <span id="theme-icon">🌓</span>
                </button>
            </header>

            <!-- Gallery -->
            <div class="gallery-scroll">
                <div class="gallery-header">
                    <h1 class="gallery-title" id="current-category-title">All Prototypes</h1>
                    <div class="gallery-count" id="item-count">${files.length} items</div>
                </div>
                
                <div class="grid" id="gallery-grid">
                    ${files.map(file => `
                    <a href="${file.path}" class="card" target="_blank" data-name="${file.cleanName.toLowerCase()}" data-path="${file.path.toLowerCase()}" data-category="${file.categoryId}">
                        <div class="card-thumb">
                            ${file.screenshot 
                                ? `<img src="${file.screenshot}" alt="${file.cleanName}" loading="lazy">`
                                : `<div class="card-thumb-placeholder">🎨</div>`
                            }
                        </div>
                        <div class="card-body">
                            <div class="card-name">${file.cleanName}</div>
                            <span class="card-path">${file.path}</span>
                        </div>
                    </a>
                    `).join('')}
                </div>
                
                <div class="empty-state" id="empty-state">
                    <div class="empty-icon">📂</div>
                    <div class="empty-title">No prototypes found</div>
                    <div style="font-size: 13px">Try adjusting your search or category filter.</div>
                </div>
            </div>
        </main>
    </div>

    <script>
        // Theme Management
        const themeBtn = document.getElementById('theme-btn');
        const themeIcon = document.getElementById('theme-icon');
        
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Initial set based on localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        } else if (prefersDark.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
        }
        
        // Toggle theme
        themeBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });

        // Filter and Search Logic
        const searchInput = document.getElementById('search');
        const categoryItems = document.querySelectorAll('.nav-item');
        const cards = document.querySelectorAll('.card');
        const currentCategoryTitle = document.getElementById('current-category-title');
        const itemCount = document.getElementById('item-count');
        const emptyState = document.getElementById('empty-state');
        
        let currentCategory = 'all';
        let searchQuery = '';

        function updateGallery() {
            let visibleCount = 0;
            
            cards.forEach(card => {
                const name = card.dataset.name || '';
                const path = card.dataset.path || '';
                const cat = card.dataset.category || '';
                
                const matchesSearch = name.includes(searchQuery) || path.includes(searchQuery);
                const matchesCategory = currentCategory === 'all' || cat === currentCategory || cat.startsWith(currentCategory + '-');
                
                if (matchesSearch && matchesCategory) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            itemCount.textContent = visibleCount + ' item' + (visibleCount !== 1 ? 's' : '');
            
            if (visibleCount === 0) {
                emptyState.style.display = 'flex';
            } else {
                emptyState.style.display = 'none';
            }
        }

        // Search listener
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            updateGallery();
        });

        // Category listener
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active state
                categoryItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Update variables
                currentCategory = item.dataset.category;
                currentCategoryTitle.textContent = item.textContent.trim().replace(/^[^a-zA-Z0-9]+/, '');
                
                // If it's a child category and we change category, we might want to clear search, but keeping it is fine too.
                updateGallery();
                
                // Close menu on mobile
                if (window.innerWidth <= 600 && sidebar.classList.contains('mobile-open')) {
                    toggleMobileMenu();
                }
            });
        });
        
        // Mobile Menu Logic
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        function toggleMobileMenu() {
            sidebar.classList.toggle('mobile-open');
            if (sidebar.classList.contains('mobile-open')) {
                overlay.style.display = 'block';
                // Trigger reflow for animation
                setTimeout(() => overlay.classList.add('active'), 10);
            } else {
                overlay.classList.remove('active');
                setTimeout(() => overlay.style.display = 'none', 300);
            }
        }
        
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        overlay.addEventListener('click', toggleMobileMenu);
    </script>
</body>
</html>`;
}

console.log('🎨 Generating macOS Prototypes Gallery...');
const hierarchy = scanRecursive(rootDir);
const html = generateHTML(hierarchy);
fs.writeFileSync(outputFile, html, 'utf8');
console.log('✅ Prototypes Gallery created at prototypes-gallery.html');
