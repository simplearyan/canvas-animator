const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Google Fonts URL
const oldFontUrl = '&family=Anton&family=Bebas+Neue&family=Fredoka:wght@600;700&family=Inter:wght@400;500;600;700;900&family=Lilita+One&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:ital,wght@0,800;1,800&family=Oswald:wght@700&family=Paytone+One&family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Press+Start+2P&family=Rubik:ital,wght@0,300..900;1,300..900&family=Rum+Raisin&family=Silkscreen:wght@400;700&family=Titan+One&family=VT323&display=swap';
const newFontUrl = '&family=Anton&family=Bebas+Neue&family=Fredoka:wght@600;700&family=Inter:wght@400;500;600;700;900&family=Lilita+One&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:ital,wght@0,800;1,800&family=Outfit:wght@100..900&family=Oswald:wght@700&family=Paytone+One&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Press+Start+2P&family=Rubik:ital,wght@0,300..900;1,300..900&family=Rum+Raisin&family=Silkscreen:wght@400;700&family=Titan+One&family=VT323&display=swap';
content = content.replace(oldFontUrl, newFontUrl);

// 2. Tailwind Config
const oldTw = `'rum-raisin': ['"Rum Raisin"', 'sans-serif'],`;
const newTw = `'rum-raisin': ['"Rum Raisin"', 'sans-serif'],
                        'outfit': ['Outfit', 'sans-serif'],
                        'playfair': ['"Playfair Display"', 'serif'],`;
content = content.replace(oldTw, newTw);

// 3. editFontFamily options
const oldMainOptions = `<option value="Rum Raisin" class="font-rum-raisin text-lg">Rum Raisin (Casual Display)</option>`;
const newMainOptions = `<option value="Rum Raisin" class="font-rum-raisin text-lg">Rum Raisin (Casual Display)</option>
                                            <option value="Outfit" class="font-outfit font-bold">Outfit (Clean Sans)</option>
                                            <option value="Playfair Display" class="font-playfair font-bold">Playfair Display (Elegant)</option>`;
content = content.replace(oldMainOptions, newMainOptions);

// 4. advWordFont & advLetterFont options
const oldAdvOptions = `<option value="Rum Raisin">Rum Raisin</option>`;
const newAdvOptions = `<option value="Rum Raisin">Rum Raisin</option>
                                                <option value="Outfit">Outfit</option>
                                                <option value="Playfair Display">Playfair Display</option>`;
content = content.split(oldAdvOptions).join(newAdvOptions);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Outfit and Playfair added.");
