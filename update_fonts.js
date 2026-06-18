const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Google Fonts URL
const oldFontUrl = '&family=Bebas+Neue&family=Fredoka:wght@600;700&family=Inter:wght@400;500;600;700;900&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:ital,wght@0,800;1,800&family=Oswald:wght@700&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap';
const newFontUrl = '&family=Anton&family=Bebas+Neue&family=Fredoka:wght@600;700&family=Inter:wght@400;500;600;700;900&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:ital,wght@0,800;1,800&family=Oswald:wght@700&family=Press+Start+2P&family=Rubik:ital,wght@0,300..900;1,300..900&family=Titan+One&display=swap';
content = content.replace(oldFontUrl, newFontUrl);

// 2. Tailwind Config
const oldTw = `                        fredoka: ['Fredoka', 'sans-serif'],`;
const newTw = `                        fredoka: ['Fredoka', 'sans-serif'],
                        anton: ['Anton', 'sans-serif'],
                        'press-start': ['"Press Start 2P"', 'cursive'],
                        'titan-one': ['"Titan One"', 'cursive'],`;
content = content.replace(oldTw, newTw);

// 3. editFontFamily options
const oldMainOptions = `<option value="Fredoka" class="font-fredoka font-bold">Fredoka (Round)</option>
                                            <option value="Lora" class="font-lora font-bold">Lora (Editorial)</option>`;
const newMainOptions = `<option value="Fredoka" class="font-fredoka font-bold">Fredoka (Round)</option>
                                            <option value="Lora" class="font-lora font-bold">Lora (Editorial)</option>
                                            <option value="Anton" class="font-anton text-lg">Anton (Heavy)</option>
                                            <option value="Press Start 2P" class="font-press-start text-[10px]">Press Start 2P (Pixel)</option>
                                            <option value="Titan One" class="font-titan-one font-bold">Titan One (Heavy Round)</option>`;
content = content.replace(oldMainOptions, newMainOptions);

// 4. advWordFont & advLetterFont options (these appear twice)
const oldAdvOptions = `<option value="Fredoka">Fredoka</option>
                                                <option value="Lora">Lora</option>`;
const newAdvOptions = `<option value="Fredoka">Fredoka</option>
                                                <option value="Lora">Lora</option>
                                                <option value="Anton">Anton</option>
                                                <option value="Press Start 2P">Press Start 2P</option>
                                                <option value="Titan One">Titan One</option>`;
content = content.split(oldAdvOptions).join(newAdvOptions);

// 5. defaultWeight JS check (appears 3 times)
const oldWeight = `const defaultWeight = (el.fontFamily === 'Bangers' || el.fontFamily === 'Bebas Neue') ? '400' : '900';`;
const newWeight = `const defaultWeight = (el.fontFamily === 'Bangers' || el.fontFamily === 'Bebas Neue' || el.fontFamily === 'Anton' || el.fontFamily === 'Press Start 2P' || el.fontFamily === 'Titan One') ? '400' : '900';`;
content = content.split(oldWeight).join(newWeight);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fonts updated successfully.");
