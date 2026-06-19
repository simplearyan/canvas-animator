const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

const regex = /<select id="editFontFamily"[\s\S]*?<\/select>/;

const newSelect = `<select id="editFontFamily" class="w-full text-sm p-2 pl-3 pr-8 border border-pro-300 dark:border-pro-600 rounded bg-pro-50 dark:bg-pro-900 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-bold text-pro-800 dark:text-pro-200">
                                            <option value="Rubik" class="font-bold">Rubik (Fireship)</option>
                                            <option value="Montserrat" class="font-bold">Montserrat (Clean)</option>
                                            <option value="Inter" class="font-bold">Inter (Utilitarian)</option>
                                            <option value="Plus Jakarta Sans" class="font-bold">Plus Jakarta Sans (Modern)</option>
                                            <option value="League Spartan" class="font-bold">League Spartan (Sharp)</option>
                                            <option value="Bebas Neue" class="text-lg">Bebas Neue (Impact)</option>
                                            <option value="Oswald" class="font-bold">Oswald (Tall)</option>
                                            <option value="Playfair Display" class="font-bold">Playfair Display (Elegant)</option>
                                            <option value="DM Serif Display" class="font-bold">DM Serif Display (Blocky)</option>
                                            <option value="Fraunces" class="font-bold">Fraunces (High Contrast)</option>
                                            <option value="Special Elite" class="text-lg">Special Elite (Typewriter)</option>
                                            <option value="Bangers" class="text-lg">Bangers (Comic)</option>
                                            <option value="Fredoka" class="font-bold">Fredoka (Round)</option>
                                            <option value="Lora" class="font-bold">Lora (Editorial)</option>
                                            <option value="Anton" class="text-lg">Anton (Heavy)</option>
                                            <option value="Press Start 2P" class="text-[10px]">Press Start 2P (Pixel)</option>
                                            <option value="Titan One" class="font-bold">Titan One (Heavy Round)</option>
                                            <option value="Lilita One" class="font-bold">Lilita One (Heavy Round)</option>
                                            <option value="Paytone One" class="font-bold">Paytone One (Heavy Casual)</option>
                                            <option value="Poppins" class="font-bold">Poppins (Geometric)</option>
                                            <option value="Silkscreen" class="text-[10px]">Silkscreen (Pixel Sharp)</option>
                                            <option value="VT323" class="text-lg">VT323 (Terminal)</option>
                                            <option value="Rum Raisin" class="text-lg">Rum Raisin (Casual Display)</option>
                                            <option value="Outfit" class="font-bold">Outfit (Clean Sans)</option>
                                        </select>`;

content = content.replace(regex, newSelect);
fs.writeFileSync(file, content);
console.log('Main font dropdown patched.');
