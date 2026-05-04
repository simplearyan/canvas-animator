const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function generateThumbnails() {
    const dataPath = path.join(__dirname, 'gallery-data.json');
    if (!fs.existsSync(dataPath)) {
        console.error('gallery-data.json not found!');
        return;
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const thumbDir = path.join(__dirname, 'thumbnails');
    
    if (!fs.existsSync(thumbDir)) {
        fs.mkdirSync(thumbDir, { recursive: true });
    }

    console.log(`Processing ${data.items.length} items...`);

    for (const item of data.items) {
        if (!item.preview) continue;

        const videoPath = path.resolve(__dirname, item.preview);
        const thumbName = path.basename(item.preview, path.extname(item.preview)) + '.webp';
        const thumbPath = path.join(thumbDir, thumbName);
        const relativeThumbPath = `thumbnails/${thumbName}`;

        if (!fs.existsSync(videoPath)) {
            console.warn(`⚠️ Video not found: ${videoPath}`);
            continue;
        }

        try {
            console.log(`📸 Generating thumbnail for: ${item.title}`);
            // Extract frame at 0.1s, scale to fit if needed, save as webp
            execSync(`ffmpeg -y -i "${videoPath}" -ss 00:00:00.100 -vframes 1 -q:v 80 "${thumbPath}"`, { stdio: 'ignore' });
            
            item.thumbnail = relativeThumbPath;
            console.log(`   ✅ Saved to ${relativeThumbPath}`);
        } catch (e) {
            console.error(`   ❌ Failed: ${e.message}`);
        }
    }

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('\n✨ Done! gallery-data.json updated with thumbnail paths.');
}

generateThumbnails().catch(console.error);
