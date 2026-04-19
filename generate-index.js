/**
 * generate-index.js
 * Blueprint-themed hierarchical index generator for Animator Studio.
 */
const fs = require('fs');
const path = require('path');
const config = require('./_config');

const rootDir = __dirname;
const outputFile = path.join(rootDir, 'index.html');

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
        } else if (file.name.endsWith('.html') && file.name !== 'index.html') {
            const cleanRelPath = relativePath.replace(/\\/g, '/');
            const screenshotPathStr = cleanRelPath ? `${cleanRelPath}/${file.name.replace('.html', '.png')}` : file.name.replace('.html', '.png');
            const screenshotRel = `./screenshots/${screenshotPathStr}`;
            const screenshotAbs = path.join(rootDir, 'screenshots', relativePath, file.name.replace('.html', '.png'));
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

function renderHierarchy(items, depth = 0) {
    let html = '';
    
    for (const item of items) {
        if (item.type === 'directory') {
            const catInfo = config.categories[item.name] || {};
            const icon = catInfo.icon || '📁';
            const label = catInfo.label || item.label;
            const desc = catInfo.desc || '';
            const relPath = item.path.replace(/\\/g, '/');
            
            const hasSubDirectories = item.children.some(c => c.type === 'directory');
            
            html += `
            <div class="section depth-${depth}" data-name="${label.toLowerCase()}" data-path="${relPath}">
                <div class="section-header">
                    <div class="section-title-group">
                        <span class="section-icon">${icon}</span>
                        <div>
                            <h2 class="section-title">${label}</h2>
                            ${desc ? `<p class="section-desc">${desc}</p>` : ''}
                        </div>
                    </div>
                </div>
                <div class="${hasSubDirectories ? 'section-nested' : 'section-content'}">
                    ${renderHierarchy(item.children, depth + 1)}
                </div>
            </div>`;
        } else {
            html += `
            <a href="${item.path}" class="card" data-name="${item.cleanName.toLowerCase()}" data-path="${item.path.toLowerCase()}" data-folder="${item.path.split('/')[0].toLowerCase()}" target="_blank">
                <div class="card-thumb">
                    ${item.screenshot 
                        ? `<img src="${item.screenshot}" alt="${item.cleanName}" loading="lazy">`
                        : `<div class="card-thumb-placeholder"><span>📐</span></div>`
                    }
                </div>
                <div class="card-body">
                    <div class="card-name">${item.cleanName}</div>
                    <code class="card-path">${item.path}</code>
                </div>
            </a>`;
        }
    }
    return html;
}

function generateHTML(hierarchy) {
    const totalCount = hierarchy.reduce((acc, item) => acc + countFiles(item), 0);
    const buildDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title} // Research Lab</title>
    <meta name="description" content="${config.description}">
    <meta name="keywords" content="${config.keywords}">
    <meta name="author" content="${config.author}">
    
    <!-- Open Graph / SEO -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${config.title}">
    <meta property="og:description" content="${config.description}">
    <meta property="og:image" content="${config.ogImage}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg:           #e8eff6;
            --surface:      #ffffff;
            --border:       #0047AB;
            --text:         #002a66;
            --text-muted:   #546e7a;
            --accent:       #ff6b6b;
            --grid:         rgba(0, 71, 171, 0.08);
            --radius:       4px;
        }

        body {
            background-color: var(--bg);
            background-image: 
                linear-gradient(var(--grid) 1px, transparent 1px),
                linear-gradient(90deg, var(--grid) 1px, transparent 1px);
            background-size: 24px 24px;
            color: var(--text);
            font-family: 'Outfit', sans-serif;
            margin: 0;
            line-height: 1.6;
        }

        .wrapper { max-width: 1300px; margin: 0 auto; padding: 2rem; }

        .site-header {
            border-bottom: 2px solid var(--border);
            padding: 2rem 0;
            margin-bottom: 3rem;
            position: relative;
        }
        .site-header::after {
            content: 'STUDIO-V1.0';
            position: absolute;
            bottom: -1px;
            right: 0;
            background: var(--border);
            color: #fff;
            padding: 2px 8px;
            font-size: 10px;
            font-weight: 800;
        }

        .header-inner { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .logo { font-size: 2.5rem; font-weight: 800; text-transform: uppercase; letter-spacing: -1px; border: 3px solid var(--border); padding: 0 10px; }
        .logo span { color: var(--accent); }

        @media (max-width: 768px) {
            .logo { font-size: 2rem; }
        }

        .search-wrap { position: relative; width: 300px; }
        #search {
            width: 100%;
            background: rgba(255,255,255,0.8);
            border: 2px solid var(--border);
            padding: 10px;
            font-size: 1rem;
            font-family: inherit;
            outline: none;
        }

        .hero p { max-width: 700px; font-size: 1.1rem; border-left: 4px solid var(--border); padding-left: 1rem; margin: 1rem 0; }

        .section { margin-bottom: 4rem; }
        .section-header { border-bottom: 1px dashed var(--border); margin-bottom: 2rem; padding-bottom: 1rem; position: relative; }
        .section-title { font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; color: var(--border); }
        .section-desc { font-size: 0.9rem; color: var(--text-muted); }

        .section-content {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
        }

        .section-nested {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .card {
            background: #fff;
            border: 1px solid var(--border);
            text-decoration: none;
            color: inherit;
            transition: all 0.2s ease;
            position: relative;
        }
        .card::before {
            content: '';
            position: absolute;
            top: -4px; right: -4px; bottom: -4px; left: -4px;
            border: 1px solid rgba(0, 71, 171, 0.1);
            pointer-events: none;
        }
        .card:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--border); }

        .card-thumb { aspect-ratio: 16/9; background: #f0f4f8; overflow: hidden; border-bottom: 1px solid var(--border); position: relative; }
        .card-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .card-thumb-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; opacity: 0.5; }

        .card-body { padding: 1rem; }
        .card-name { font-weight: 700; margin-bottom: 0.25rem; font-size: 1rem; }
        .card-path { font-size: 0.7rem; color: var(--text-muted); font-family: monospace; }
    </style>
</head>
<body>
    <main class="wrapper">
        <header class="site-header">
            <div class="header-inner">
                <div class="logo">ANIMATOR<span>STUDIO</span></div>
                <div class="search-wrap">
                    <input type="text" id="search" placeholder="Filter research components…">
                </div>
            </div>
        </header>

        <section class="hero">
            <p>${config.description}</p>
        </section>

        <div id="content">
            ${renderHierarchy(hierarchy)}
        </div>

        <footer style="margin-top: 5rem; font-size: 0.8rem; border-top: 1px solid var(--border); padding-top: 1rem; color: var(--text-muted);">
            BUILD_${buildDate.toUpperCase().replace(/\s/g, '_')} // TOTAL_COMPONENTS: ${totalCount}
        </footer>
    </main>

    <script>
        document.getElementById('search').addEventListener('input', function(e) {
            const q = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.card').forEach(card => {
                const name = card.dataset.name || '';
                const path = card.dataset.path || '';
                const folder = card.dataset.folder || '';
                
                const isMatch = name.includes(q) || path.includes(q) || folder.includes(q);
                card.style.display = isMatch ? 'block' : 'none';
            });
            
            // Show/hide sections based on visibility of their children
            document.querySelectorAll('.section').forEach(section => {
                const hasVisible = Array.from(section.querySelectorAll('.card')).some(c => c.style.display !== 'none');
                section.style.display = hasVisible ? 'block' : 'none';
            });
        });
    </script>
</body>
</html>`;
}

function countFiles(item) {
    if (item.type === 'file') return 1;
    return item.children.reduce((acc, child) => acc + countFiles(child), 0);
}

console.log('📋 Building Blueprint Study...');
const hierarchy = scanRecursive(rootDir);
const html = generateHTML(hierarchy);
fs.writeFileSync(outputFile, html, 'utf8');
console.log('✅ Blueprint index updated.');
