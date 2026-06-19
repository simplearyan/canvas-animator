const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Update tailwind.config
const tailwindConfigRegex = /lora:\s*\['Lora',\s*'serif'\],/;
const tailwindConfigInject = `lora: ['Lora', 'serif'],
                        'dm-serif': ['"DM Serif Display"', 'serif'],
                        'fraunces': ['Fraunces', 'serif'],
                        'special-elite': ['"Special Elite"', 'cursive'],
                        'league-spartan': ['"League Spartan"', 'sans-serif'],
                        'jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],`;
content = content.replace(tailwindConfigRegex, tailwindConfigInject);

// 2. Generate new select options with optgroups and tailwind font classes
const optgroupHtml = `
<optgroup label="Geometric & Heavy">
    <option value="Rubik" class="font-rubik font-bold">Rubik (Fireship)</option>
    <option value="Montserrat" class="font-montserrat font-bold">Montserrat (Clean)</option>
    <option value="Plus Jakarta Sans" class="font-jakarta font-bold">Plus Jakarta Sans (Modern)</option>
    <option value="League Spartan" class="font-league-spartan font-bold">League Spartan (Sharp)</option>
    <option value="Poppins" class="font-poppins font-bold">Poppins (Geometric)</option>
    <option value="Inter" class="font-inter font-bold">Inter (Utilitarian)</option>
    <option value="Outfit" class="font-outfit font-bold">Outfit (Clean Sans)</option>
</optgroup>
<optgroup label="Condensed & Documentary">
    <option value="Oswald" class="font-oswald font-bold">Oswald (Tall)</option>
    <option value="Bebas Neue" class="font-bebas text-lg">Bebas Neue (Impact)</option>
    <option value="Special Elite" class="font-special-elite text-lg">Special Elite (Typewriter)</option>
</optgroup>
<optgroup label="Editorial & Serif">
    <option value="Playfair Display" class="font-playfair font-bold">Playfair Display (Elegant)</option>
    <option value="DM Serif Display" class="font-dm-serif font-bold">DM Serif Display (Blocky)</option>
    <option value="Fraunces" class="font-fraunces font-bold">Fraunces (High Contrast)</option>
    <option value="Lora" class="font-lora font-bold">Lora (Classic)</option>
</optgroup>
<optgroup label="Loud & Display">
    <option value="Anton" class="font-anton text-lg">Anton (Heavy)</option>
    <option value="Titan One" class="font-titan-one font-bold">Titan One (Heavy Round)</option>
    <option value="Lilita One" class="font-lilita-one font-bold">Lilita One (Heavy Round)</option>
    <option value="Paytone One" class="font-paytone-one font-bold">Paytone One (Heavy Casual)</option>
    <option value="Bangers" class="font-bangers text-lg">Bangers (Comic)</option>
    <option value="Fredoka" class="font-fredoka font-bold">Fredoka (Round)</option>
    <option value="Rum Raisin" class="font-rum-raisin text-lg">Rum Raisin (Casual Display)</option>
</optgroup>
<optgroup label="Retro & Pixel">
    <option value="Press Start 2P" class="font-press-start text-[10px]">Press Start 2P (Pixel)</option>
    <option value="Silkscreen" class="font-silkscreen text-[10px]">Silkscreen (Pixel Sharp)</option>
    <option value="VT323" class="font-vt323 text-lg">VT323 (Terminal)</option>
</optgroup>
`;

// Replace in editFontFamily
const editRegex = /<select id="editFontFamily"[^>]*>[\s\S]*?<\/select>/;
const editInject = `<select id="editFontFamily" class="w-full text-sm p-2 pl-3 pr-8 border border-pro-300 dark:border-pro-600 rounded bg-pro-50 dark:bg-pro-900 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-pro-800 dark:text-pro-200">
${optgroupHtml}
</select>`;
content = content.replace(editRegex, editInject);

// Replace in advWordFont
const wordRegex = /<select id="advWordFont"[^>]*>[\s\S]*?<\/select>/;
const wordInject = `<select id="advWordFont" class="w-full text-[10px] p-2 pl-3 pr-8 border border-pro-300 dark:border-pro-600 rounded bg-pro-50 dark:bg-pro-900 appearance-none font-bold">
<option value="">Default Font</option>
${optgroupHtml}
</select>`;
content = content.replace(wordRegex, wordInject);

// Replace in advLetterFont
const letterRegex = /<select id="advLetterFont"[^>]*>[\s\S]*?<\/select>/;
const letterInject = `<select id="advLetterFont" class="w-full text-[10px] p-2 pl-3 pr-8 border border-pro-300 dark:border-pro-600 rounded bg-pro-50 dark:bg-pro-900 appearance-none font-bold">
<option value="">Default Font</option>
${optgroupHtml}
</select>`;
content = content.replace(letterRegex, letterInject);

fs.writeFileSync(file, content);
console.log('Font optgroups and previews patched successfully!');
