const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

const targetH = `<i class="ph-bold ph-arrows-left-right text-base"></i>`;
const replaceH = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke-dasharray="4 4" d="M12 3v18"></path>
                            <path d="M8 7l-5 5 5 5V7z"></path>
                            <path d="M16 7l5 5-5 5V7z"></path>
                        </svg>`;

const targetV = `<i class="ph-bold ph-arrows-up-down text-base"></i>`;
const replaceV = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke-dasharray="4 4" d="M3 12h18"></path>
                            <path d="M7 8l5-5 5 5H7z"></path>
                            <path d="M7 16l5 5 5-5H7z"></path>
                        </svg>`;

let updated = false;

if (content.includes(targetH)) {
    content = content.replace(targetH, replaceH);
    updated = true;
    console.log("Replaced H icon");
} else {
    console.log("H target not found");
}

if (content.includes(targetV)) {
    content = content.replace(targetV, replaceV);
    updated = true;
    console.log("Replaced V icon");
} else {
    console.log("V target not found");
}

if (updated) {
    fs.writeFileSync(file, content);
    console.log("Done");
}
