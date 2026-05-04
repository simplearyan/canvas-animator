const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function generateThumbnails() {
    const dataFiles = [
        { path: 'gallery-data.json', itemsKey: 'items', folder: 'thumbnails' },
        { path: 'vertical-data.json', itemsKey: 'items', folder: 'thumbnails_vertical' }
    ];

    for (const fileInfo of dataFiles) {
        const dataPath = path.join(__dirname, fileInfo.path);
        if (!fs.existsSync(dataPath)) continue;

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const thumbDir = path.join(__dirname, fileInfo.folder);
        
        if (!fs.existsSync(thumbDir)) {
            fs.mkdirSync(thumbDir, { recursive: true });
        }

        console.log(`\n📂 Processing ${fileInfo.path} (${data[fileInfo.itemsKey].length} items)...`);

        for (const item of data[fileInfo.itemsKey]) {
            // Support both 'preview' and 'file' (for shorts where file is the video)
            const videoSource = item.preview || item.file;
            if (!videoSource || videoSource === '#') continue;

            const videoPath = path.resolve(__dirname, videoSource);
            const thumbName = path.basename(videoSource, path.extname(videoSource)) + '.webp';
            const thumbPath = path.join(thumbDir, thumbName);
            const relativeThumbPath = `${fileInfo.folder}/${thumbName}`;

            if (!fs.existsSync(videoPath)) {
                console.warn(`⚠️ Video not found: ${videoPath}`);
                continue;
            }

            try {
                console.log(`📸 Generating thumbnail for: ${item.title}`);
                execSync(`ffmpeg -y -i "${videoPath}" -ss 00:00:00.100 -vframes 1 -q:v 80 "${thumbPath}"`, { stdio: 'ignore' });
                
                item.thumbnail = relativeThumbPath;
                console.log(`   ✅ Saved to ${relativeThumbPath}`);
            } catch (e) {
                console.error(`   ❌ Failed: ${e.message}`);
            }
        }

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    }

    console.log('\n✨ All clear. Gallery and Vertical data updated.');
}

generateThumbnails().catch(console.error);
