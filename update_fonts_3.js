const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Google Fonts URL
const oldFontUrl = '&family=Anton&family=Bebas+Neue&family=Fredoka:wght@600;700&family=Inter:wght@400;500;600;700;900&family=Lilita+One&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:ital,wght@0,800;1,800&family=Oswald:wght@700&family=Paytone+One&family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Press+Start+2P&family=Rubik:ital,wght@0,300..900;1,300..900&family=Silkscreen:wght@400;700&family=Titan+One&family=VT323&display=swap';
const newFontUrl = '&family=Anton&family=Bebas+Neue&family=Fredoka:wght@600;700&family=Inter:wght@400;500;600;700;900&family=Lilita+One&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:ital,wght@0,800;1,800&family=Oswald:wght@700&family=Paytone+One&family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Press+Start+2P&family=Rubik:ital,wght@0,300..900;1,300..900&family=Rum+Raisin&family=Silkscreen:wght@400;700&family=Titan+One&family=VT323&display=swap';
content = content.replace(oldFontUrl, newFontUrl);

// 2. Tailwind Config
const oldTw = `'vt323': ['VT323', 'monospace'],`;
const newTw = `'vt323': ['VT323', 'monospace'],
                        'rum-raisin': ['"Rum Raisin"', 'sans-serif'],`;
content = content.replace(oldTw, newTw);

// 3. editFontFamily options
const oldMainOptions = `<option value="VT323" class="font-vt323 text-lg">VT323 (Terminal)</option>`;
const newMainOptions = `<option value="VT323" class="font-vt323 text-lg">VT323 (Terminal)</option>
                                            <option value="Rum Raisin" class="font-rum-raisin text-lg">Rum Raisin (Casual Display)</option>`;
content = content.replace(oldMainOptions, newMainOptions);

// 4. advWordFont & advLetterFont options
const oldAdvOptions = `<option value="VT323">VT323</option>`;
const newAdvOptions = `<option value="VT323">VT323</option>
                                                <option value="Rum Raisin">Rum Raisin</option>`;
content = content.split(oldAdvOptions).join(newAdvOptions);

// 5. defaultWeight JS check
const oldWeight = `const defaultWeight = (['Bangers', 'Bebas Neue', 'Anton', 'Press Start 2P', 'Titan One', 'Lilita One', 'Paytone One', 'VT323'].includes(el.fontFamily)) ? '400' : '900';`;
const newWeight = `const defaultWeight = (['Bangers', 'Bebas Neue', 'Anton', 'Press Start 2P', 'Titan One', 'Lilita One', 'Paytone One', 'VT323', 'Rum Raisin'].includes(el.fontFamily)) ? '400' : '900';`;
content = content.split(oldWeight).join(newWeight);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Rum Raisin added.");
