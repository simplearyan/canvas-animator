const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Google Fonts URL
const oldFontUrl = '&family=Anton&family=Bebas+Neue&family=Fredoka:wght@600;700&family=Inter:wght@400;500;600;700;900&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:ital,wght@0,800;1,800&family=Oswald:wght@700&family=Press+Start+2P&family=Rubik:ital,wght@0,300..900;1,300..900&family=Titan+One&display=swap';
const newFontUrl = '&family=Anton&family=Bebas+Neue&family=Fredoka:wght@600;700&family=Inter:wght@400;500;600;700;900&family=Lilita+One&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:ital,wght@0,800;1,800&family=Oswald:wght@700&family=Paytone+One&family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Press+Start+2P&family=Rubik:ital,wght@0,300..900;1,300..900&family=Silkscreen:wght@400;700&family=Titan+One&family=VT323&display=swap';
content = content.replace(oldFontUrl, newFontUrl);

// 2. Tailwind Config
const oldTw = `'titan-one': ['"Titan One"', 'cursive'],`;
const newTw = `'titan-one': ['"Titan One"', 'cursive'],
                        'lilita-one': ['"Lilita One"', 'cursive'],
                        'paytone-one': ['"Paytone One"', 'sans-serif'],
                        'poppins': ['Poppins', 'sans-serif'],
                        'silkscreen': ['Silkscreen', 'cursive'],
                        'vt323': ['VT323', 'monospace'],`;
content = content.replace(oldTw, newTw);

// 3. editFontFamily options
const oldMainOptions = `<option value="Titan One" class="font-titan-one font-bold">Titan One (Heavy Round)</option>`;
const newMainOptions = `<option value="Titan One" class="font-titan-one font-bold">Titan One (Heavy Round)</option>
                                            <option value="Lilita One" class="font-lilita-one font-bold">Lilita One (Heavy Round)</option>
                                            <option value="Paytone One" class="font-paytone-one font-bold">Paytone One (Heavy Casual)</option>
                                            <option value="Poppins" class="font-poppins font-bold">Poppins (Geometric)</option>
                                            <option value="Silkscreen" class="font-silkscreen text-[10px]">Silkscreen (Pixel Sharp)</option>
                                            <option value="VT323" class="font-vt323 text-lg">VT323 (Terminal)</option>`;
content = content.replace(oldMainOptions, newMainOptions);

// 4. advWordFont & advLetterFont options
const oldAdvOptions = `<option value="Titan One">Titan One</option>`;
const newAdvOptions = `<option value="Titan One">Titan One</option>
                                                <option value="Lilita One">Lilita One</option>
                                                <option value="Paytone One">Paytone One</option>
                                                <option value="Poppins">Poppins</option>
                                                <option value="Silkscreen">Silkscreen</option>
                                                <option value="VT323">VT323</option>`;
content = content.split(oldAdvOptions).join(newAdvOptions);

// 5. defaultWeight JS check
const oldWeight = `const defaultWeight = (el.fontFamily === 'Bangers' || el.fontFamily === 'Bebas Neue' || el.fontFamily === 'Anton' || el.fontFamily === 'Press Start 2P' || el.fontFamily === 'Titan One') ? '400' : '900';`;
const newWeight = `const defaultWeight = (['Bangers', 'Bebas Neue', 'Anton', 'Press Start 2P', 'Titan One', 'Lilita One', 'Paytone One', 'VT323'].includes(el.fontFamily)) ? '400' : '900';`;
content = content.split(oldWeight).join(newWeight);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Additional fonts added successfully.");
