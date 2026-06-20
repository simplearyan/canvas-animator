const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

const audioHTMLInjection = `
            const vol = clip.effects.volume !== undefined ? clip.effects.volume : 1;
            const echo = clip.effects.echo !== undefined ? clip.effects.echo : 0.5;
            const echoEnable = clip.effects.echoEnable || false;
            const noiseRed = clip.effects.noiseRed !== undefined ? clip.effects.noiseRed : 0.5;
            const noiseRedEnable = clip.effects.noiseRedEnable || false;
            const cinematic = clip.effects.cinematic !== undefined ? clip.effects.cinematic : 0.5;
            const cinematicEnable = clip.effects.cinematicEnable || false;
            const robot = clip.effects.robot !== undefined ? clip.effects.robot : 0.5;
            const robotEnable = clip.effects.robotEnable || false;
            const cartoon = clip.effects.cartoon !== undefined ? clip.effects.cartoon : 0.5;
            const cartoonEnable = clip.effects.cartoonEnable || false;

            const createAudioAccordion = (id, icon, title, enableKey, valKey, val, enabled) => \`
                <details class="group bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 shadow-sm rounded-lg shrink-0 \${isHorizontal ? 'w-[280px]' : 'w-full'} overflow-hidden flex flex-col" open>
                    <summary class="flex items-center justify-between p-3 \${isHorizontal ? '' : 'cursor-pointer'} list-none appearance-none select-none bg-surface-100 dark:bg-surface-800/80 border-b border-surface-200 dark:border-surface-700 " onclick="\${isHorizontal ? 'event.preventDefault();' : ''}">
                        <div class="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2"><i data-lucide="\${icon}" class="w-4 h-4 text-surface-500 dark:text-surface-400"></i> \${title}</div>
                        <div class="flex items-center gap-2">
                            \${enableKey ? \\\`
                            <label class="relative inline-flex items-center cursor-pointer" onclick="event.stopPropagation()">
                                <input type="checkbox" class="sr-only peer" \${enabled ? 'checked' : ''} onchange="setClipEffect('\${clip.id}', '\${enableKey}', this.checked); updateSidebarPanel();">
                                <div class="w-7 h-4 bg-surface-300 dark:bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-500"></div>
                            </label>
                            \\\` : ''}
                            \${isHorizontal ? '' : '<i data-lucide="chevron-down" class="w-4 h-4 text-surface-500 transition-transform group-open:rotate-180"></i>'}
                        </div>
                    </summary>
                    
                    <div class="p-3 flex flex-col gap-2.5 bg-surface-50 dark:bg-surface-900/50 flex-1 \${(enableKey && !enabled) ? 'opacity-50 pointer-events-none' : ''}">
                        <div>
                            <div class="flex justify-between items-center mb-1.5">
                                <label class="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Intensity</label>
                                <span class="text-xs font-bold text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-2 py-0.5 rounded shadow-sm">\${Math.round(val * 100)}%</span>
                            </div>
                            <input type="range" min="0" max="\${id === 'volume' ? '2' : '1'}" step="0.05" value="\${val}" class="w-full custom-slider" oninput="setClipEffect('\${clip.id}', '\${valKey}', this.value); this.previousElementSibling.querySelector('span').textContent = Math.round(this.value * 100) + '%'; this.style.background = 'linear-gradient(to right, \${sliderFill} ' + (this.value/this.max)*100 + '%, \${sliderBg} ' + (this.value/this.max)*100 + '%)'">
                        </div>
                    </div>
                </details>
            \`;

            const audioHTML = 
                createAudioAccordion('volume', 'volume-2', 'Volume', null, 'volume', vol, true) +
                createAudioAccordion('noiseRed', 'mic-off', 'Denoise', 'noiseRedEnable', 'noiseRed', noiseRed, noiseRedEnable) +
                createAudioAccordion('echo', 'waves', 'Echo', 'echoEnable', 'echo', echo, echoEnable) +
                createAudioAccordion('cinematic', 'speaker', 'Bass (Cinematic)', 'cinematicEnable', 'cinematic', cinematic, cinematicEnable) +
                createAudioAccordion('robot', 'bot', 'Robot Voice', 'robotEnable', 'robot', robot, robotEnable) +
                createAudioAccordion('cartoon', 'smile', 'Cartoon Voice', 'cartoonEnable', 'cartoon', cartoon, cartoonEnable);
`;

if (!content.includes('createAudioAccordion')) {
    content = content.replace(
        /const animHTML = `/g,
        audioHTMLInjection + "\\n            const animHTML = `"
    );
}

const targetReplacement = "sidebarContent.innerHTML = (isText ? textHTML : '') + shadowHTML + animHTML;";
const replacementCode = `if (clip.type === 'audio') {
                sidebarContent.innerHTML = audioHTML;
            } else {
                sidebarContent.innerHTML = (isText ? textHTML : '') + shadowHTML + animHTML;
            }`;

if (content.includes(targetReplacement)) {
    content = content.replace(targetReplacement, replacementCode);
    console.log("Replaced assignment successfully!");
}

fs.writeFileSync(file, content);
console.log("Done.");
