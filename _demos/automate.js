const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function automate() {
  const configPath = path.join(__dirname, 'automation-config.json');
  if (!fs.existsSync(configPath)) {
    console.error('Config file not found!');
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const { outputDir, format, fps } = config.global;
  const absOutputDir = path.resolve(__dirname, outputDir);
  const galleryDataPath = path.join(__dirname, 'gallery-data.json');
  const galleryItems = [];

  if (!fs.existsSync(absOutputDir)) {
    fs.mkdirSync(absOutputDir, { recursive: true });
  }

  console.log(`Starting automation for ${config.presets.length} presets...`);

  const isCI = !!process.env.CI;
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: isCI ? undefined : (
      process.platform === 'win32'
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : '/usr/bin/google-chrome'
    ),
    args: [
      '--hide-scrollbars',
      '--mute-audio',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-renderer-backgrounding',
      '--disable-background-timer-throttling'
    ]
  });

  for (const preset of config.presets) {
    console.log(`Processing: ${preset.title}...`);
    
    const page = await browser.newPage();
    
    // Debugging
    page.on('console', msg => {
        if (!msg.text().includes('tailwindcss')) console.log('PAGE:', msg.text());
    });

    await page.setViewport({ width: preset.width, height: preset.height });

    // Load the file
    const fileUrl = `file://${path.resolve(__dirname, preset.file)}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle2' });

    // 1. Inject Background-Task Fix & Download Interceptor
    await page.evaluate(() => {
        // Fix: Force requestAnimationFrame to run in background
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = (callback) => {
            return setTimeout(() => {
                callback(performance.now());
            }, 1000 / 60);
        };

        // Interceptor: Capture the Blob instead of downloading
        window.saveRecordingBridge = (blobBase64, filename) => {
             window.onExportComplete(blobBase64, filename);
        };

        // Override a.click for the specific export case
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = function(blob) {
            const url = originalCreateObjectURL.call(URL, blob);
            if (window.isAutomatedExport) {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    window.saveRecording(reader.result.split(',')[1], window.automatedFilename);
                };
            }
            return url;
        };
    });

    // 2. Prepare Saving Bridge
    let exportCompletePromise = new Promise((resolve) => {
        page.exposeFunction('saveRecording', (base64Data, filename) => {
            const buffer = Buffer.from(base64Data, 'base64');
            const outputPath = path.join(absOutputDir, filename);
            fs.writeFileSync(outputPath, buffer);
            console.log(`  ✅ SUCCESS: Saved ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
            resolve();
        });
    });

    // 3. Apply Overrides & Trigger Native Export
    const outputFilename = `${path.basename(preset.file, '.html')}.${format}`;
    await page.evaluate(async (p, filename) => {
        // Apply State Overrides
        if (p.stateOverrides) {
            for (const [key, value] of Object.entries(p.stateOverrides)) {
                try { eval(`${key} = ${JSON.stringify(value)}`); } catch (e) {}
            }
        }
        
        window.isAutomatedExport = true;
        window.automatedFilename = filename;

        // Call the preset's native export function
        if (typeof exportVideo === 'function') {
            console.log('Triggering native exportVideo...');
            const exportScale = p.width / 1920;
            exportVideo(p.width, exportScale);
        } else {
            console.error('exportVideo function not found in preset!');
        }
    }, preset, outputFilename);

    // 4. Wait for export to finish (up to 30s)
    await Promise.race([
        exportCompletePromise,
        new Promise((_, reject) => setTimeout(() => reject('Timeout'), 45000))
    ]).catch(err => console.error(`  ❌ FAILED: ${preset.title} - ${err}`));

    galleryItems.push({
      title: preset.title,
      file: preset.file,
      preview: `${outputDir}/${outputFilename}`,
      width: preset.width,
      height: preset.height
    });

    await page.close();
  }

  // Save Gallery Data
  fs.writeFileSync(galleryDataPath, JSON.stringify(galleryItems, null, 2));
  console.log(`\nGallery data updated at ${galleryDataPath}`);

  await browser.close();
  console.log('All clear. Automation complete!');
}

automate().catch(console.error);
