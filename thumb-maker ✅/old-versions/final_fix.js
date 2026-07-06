const fs = require('fs');

function fixStudioPro() {
    let s = fs.readFileSync('studio_pro.html', 'utf8');

    // 1. Fix the stray </div>
    const regex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- LAYERS PANEL -->/;
    if (regex.test(s)) {
        s = s.replace(regex, '</div>\n                    </div>\n                </div>\n\n                <!-- LAYERS PANEL -->');
        console.log("Fixed 4 div closings to 3.");
    } else {
        console.log("Could not find the 4 div closings. Regex failed.");
    }

    // 2. Append Banner Presets to presetData
    try {
        const bannerHTML = fs.readFileSync('youtube_banner_maker.html', 'utf8');
        const bannerMatch = bannerHTML.match(/const presetData = \[\s*([\s\S]*?)\];/);
        
        if (bannerMatch) {
            const bannerPresets = bannerMatch[1].trim(); 
            
            const presetMatch = s.match(/const presetData = \[\s*([\s\S]*?)\n\s*\];/);
            if (presetMatch) {
                let currentPresets = presetMatch[1];
                if (!currentPresets.includes('TECH & CODE WEEKLY')) {
                    const newPresets = `const presetData = [\n${currentPresets},\n${bannerPresets}\n];`;
                    s = s.replace(/const presetData = \[\s*([\s\S]*?)\n\s*\];/, newPresets);
                    console.log("Appended Banner presets.");
                } else {
                    console.log("Banner presets already present.");
                }
            } else {
                console.log("Could not match presetData array in studio_pro.");
            }
        } else {
            console.log("Could not match presetData in banner file.");
        }
    } catch (e) {
        console.error("Error with banner presets:", e);
    }

    fs.writeFileSync('studio_pro.html', s);
}

fixStudioPro();
