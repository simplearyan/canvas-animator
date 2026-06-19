const fs = require('fs');
const lines = fs.readFileSync('thumb-maker ✅/studio_pro.html', 'utf8').split('\n');
console.log('Google Fonts Link:');
console.log(lines.find(l => l.includes('fonts.googleapis.com/css2')));

console.log('\nFont Select Options:');
lines.forEach((l, i) => {
    if(l.includes('<option value="Rubik">')) {
        console.log(lines.slice(i-2, i+15).join('\n'));
    }
});
