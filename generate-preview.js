/**
 * generate-preview.js
 * Recursive screenshot capture for Animator Studio.
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const crypto = require('crypto');

const rootDir = __dirname;
const screenshotsDir = path.join(rootDir, 'public', 'screenshots');
const manifestPath = path.join(screenshotsDir, 'manifest.json');
const FORCE = process.argv.includes('--force');

function getHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

function scanRecursive(dir, relativePath = '') {
    const demos = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            if (['node_modules', '.git', 'screenshots', '.github'].includes(file.name)) continue;
            demos.push(...scanRecursive(path.join(dir, file.name), path.join(relativePath, file.name)));
        } else if (file.name.endsWith('.html') && file.name !== 'index.html') {
            demos.push({
                name: file.name,
                relDir: relativePath,
                fullPath: path.join(dir, file.name)
            });
        }
    }
    return demos;
}

async function captureScreenshots(demos) {
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

    let manifest = {};
    if (fs.existsSync(manifestPath)) {
        try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (e) {}
    }

    const toCapture = demos.filter(demo => {
        const pngPath = path.join(screenshotsDir, demo.relDir, demo.name.replace('.html', '.png'));
        const htmlHash = getHash(demo.fullPath);
        demo.hash = htmlHash;
        
        const id = path.join(demo.relDir, demo.name).replace(/\\/g, '/'); // Normalize path for manifest keys
        demo.id = id;

        return FORCE || !fs.existsSync(pngPath) || manifest[id] !== htmlHash;
    });

    if (toCapture.length === 0) {
        console.log('✅ All studio previews are up to date. Use --force to regenerate.');
        return;
    }

    const CONCURRENCY = 4;
    console.log(`📸 Studio: Capturing ${toCapture.length} preview(s) using ${CONCURRENCY} workers…`);

    const isCI = !!process.env.CI;
    const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: isCI ? undefined : (
            process.platform === 'win32'
                ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                : '/usr/bin/google-chrome'
        ),
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const workQueue = [...toCapture];
    const total = toCapture.length;
    let completed = 0;

    const worker = async () => {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        while (workQueue.length > 0) {
            const demo = workQueue.shift();
            const currentIdx = ++completed;
            const folderPath = path.join(screenshotsDir, demo.relDir);
            if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

            const pngPath = path.join(folderPath, demo.name.replace('.html', '.png'));

            try {
                console.log(`  [${currentIdx}/${total}] ${demo.id}`);
                await page.goto(`file://${demo.fullPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
                await new Promise(r => setTimeout(r, 1500)); 
                await page.screenshot({ path: pngPath, type: 'png' });
                
                // Update manifest on success
                manifest[demo.id] = demo.hash;
                fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
            } catch (err) {
                console.error(`  ✖ Failed: ${demo.name} — ${err.message}`);
            }
        }
        await page.close();
    };

    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, toCapture.length) }, worker));
    await browser.close();
    console.log(`✅ Previews generated. Skipped: ${demos.length - toCapture.length}.`);
}

(async () => {
    try {
        const demos = scanRecursive(rootDir);
        await captureScreenshots(demos);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
})();
