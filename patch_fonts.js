const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

const oldLinkMatch = /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Plus\+Jakarta\+Sans:.*?rel="stylesheet">/;
// We must find the EXACT current link in the HTML.
// Let's just find the line that starts with `<link href="https://fonts.googleapis.com/css2`

const newLink = `<link href="https://fonts.googleapis.com/css2?family=Anton&family=Bangers&family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Fraunces:ital,wght@0,100..900;1,100..900&family=Fredoka:wght@600;700&family=Inter:ital,wght@0,100..900;1,100..900&family=League+Spartan:wght@100..900&family=Lilita+One&family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Outfit:wght@100..900&family=Oswald:wght@200..700&family=Paytone+One&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100..900;1,100..900&family=Press+Start+2P&family=Rubik:ital,wght@0,300..900;1,300..900&family=Rum+Raisin&family=Silkscreen:wght@400;700&family=Special+Elite&family=Titan+One&family=VT323&display=swap" rel="stylesheet">`;

content = content.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2.*?" rel="stylesheet">/, newLink);

// Replace font dropdown options
// I'll use a regex that matches from `<option value="Rubik">Rubik</option>` down to `<option value="VT323">VT323</option>`

const oldOptionsRegex = /<option value="Rubik">Rubik<\/option>[\s\S]*?<option value="VT323">VT323<\/option>/g;

const newOptions = `<option value="Rubik">Rubik</option>
<option value="Montserrat">Montserrat</option>
<option value="Inter">Inter</option>
<option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
<option value="League Spartan">League Spartan</option>
<option value="Bebas Neue">Bebas Neue</option>
<option value="Oswald">Oswald</option>
<option value="Playfair Display">Playfair Display</option>
<option value="DM Serif Display">DM Serif Display</option>
<option value="Fraunces">Fraunces</option>
<option value="Special Elite">Special Elite</option>
<option value="Bangers">Bangers</option>
<option value="Fredoka">Fredoka</option>
<option value="Lora">Lora</option>
<option value="Anton">Anton</option>
<option value="Press Start 2P">Press Start 2P</option>
<option value="Titan One">Titan One</option>
<option value="Lilita One">Lilita One</option>
<option value="Paytone One">Paytone One</option>
<option value="Poppins">Poppins</option>
<option value="Silkscreen">Silkscreen</option>
<option value="VT323">VT323</option>`;

// We have 3 selects: editFontFamily, advWordFont, advLetterFont
// We can just use global replace!
let replacedContent = content.replace(oldOptionsRegex, newOptions);

// ALSO need to add weights! The user asked for "all weights to choose from".
// Where is `editFontWeight`? Let's assume it has 400..900. I need to make sure 100..900 are available.
const oldWeightRegex = /<option value="400">Regular \(400\)<\/option>[\s\S]*?<option value="900">Black \(900\)<\/option>/g;
const newWeightOptions = `<option value="100">Thin (100)</option>
<option value="200">Extra Light (200)</option>
<option value="300">Light (300)</option>
<option value="400">Regular (400)</option>
<option value="500">Medium (500)</option>
<option value="600">Semi Bold (600)</option>
<option value="700">Bold (700)</option>
<option value="800">Extra Bold (800)</option>
<option value="900">Black (900)</option>`;

replacedContent = replacedContent.replace(oldWeightRegex, newWeightOptions);

fs.writeFileSync(file, replacedContent);
console.log('Fonts patched.');
