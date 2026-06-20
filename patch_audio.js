const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(file, 'utf8');

// --- 1. Modify the Audio Effects defaults ---
content = content.replace(
    `effects: { volume: 1, echo: 0, cartoon: 0, cinematic: 0, robot: 0, noiseRed: 0 }`,
    `effects: { volume: 1, echo: 0.5, echoEnable: false, cartoon: 0.5, cartoonEnable: false, cinematic: 0.5, cinematicEnable: false, robot: 0.5, robotEnable: false, noiseRed: 0.5, noiseRedEnable: false }`
);

content = content.replace(
    /if \(clip\.effects\.volume === undefined\) clip\.effects\.volume = 1;/g,
    `if (clip.effects.volume === undefined) clip.effects.volume = 1;
        if (clip.effects.echoEnable === undefined) clip.effects.echoEnable = false;
        if (clip.effects.cartoonEnable === undefined) clip.effects.cartoonEnable = false;
        if (clip.effects.cinematicEnable === undefined) clip.effects.cinematicEnable = false;
        if (clip.effects.robotEnable === undefined) clip.effects.robotEnable = false;
        if (clip.effects.noiseRedEnable === undefined) clip.effects.noiseRedEnable = false;`
);

content = content.replace(
    /if \(clip\.effects\.echo === undefined\) clip\.effects\.echo = 0;\s*if \(clip\.effects\.cartoon === undefined\) clip\.effects\.cartoon = 0;\s*if \(clip\.effects\.cinematic === undefined\) clip\.effects\.cinematic = 0;\s*if \(clip\.effects\.robot === undefined\) clip\.effects\.robot = 0;\s*if \(clip\.effects\.noiseRed === undefined\) clip\.effects\.noiseRed = 0;/g,
    `if (clip.effects.echo === undefined) clip.effects.echo = 0.5;
                if (clip.effects.cartoon === undefined) clip.effects.cartoon = 0.5;
                if (clip.effects.cinematic === undefined) clip.effects.cinematic = 0.5;
                if (clip.effects.robot === undefined) clip.effects.robot = 0.5;
                if (clip.effects.noiseRed === undefined) clip.effects.noiseRed = 0.5;`
);

// --- 2. Modify Audio Node Application Logic ---
content = content.replace(
    /clip\.audioNodes\.volume\.gain\.value = fx\.volume;[\s\S]*?clip\.audioNodes\.noiseRed\.frequency\.value = 20000 - \(fx\.noiseRed \* 17000\);[\s]*\}/g,
    `clip.audioNodes.volume.gain.value = fx.volume;
                clip.audioNodes.echoVolume.gain.value = fx.echoEnable ? fx.echo : 0;
                clip.audioNodes.roboVolume.gain.value = fx.robotEnable ? fx.robot : 0;
            }

            clip.audioNodes.eq.gain.value = fx.cinematicEnable ? (fx.cinematic * 15) : 0;
            clip.audioNodes.tinny.frequency.value = fx.cartoonEnable ? Math.max(1, fx.cartoon * 1500) : 0;
            clip.audioNodes.noiseRed.frequency.value = fx.noiseRedEnable ? (20000 - (fx.noiseRed * 17000)) : 20000;
        }`
);

// --- 3. Modify updateUI to remove Audio from Action Bar ---
content = content.replace(
    /let tabs = \[\];\s*if \(clip\.type === 'image' \|\| clip\.type === 'video' \|\| clip\.type === 'text'\) \{[\s\S]*?\}\s*let tabsHTML =/m,
    `let tabs = [];
            if (clip.type === 'image' || clip.type === 'video' || clip.type === 'text') {
                if (!['scale', 'rotate'].includes(State.activePropertyTab)) {
                    State.activePropertyTab = 'scale';
                }
                tabs = [
                    { id: 'scale', icon: 'maximize', label: 'Scale', max: 3, step: 0.05, unit: 'x' },
                    { id: 'rotate', icon: 'rotate-cw', label: 'Rotate', max: 360, step: 1, unit: '°' }
                ];
                if (clip.type !== 'text') {
                    tabs.push({ id: 'borderRadius', icon: 'square', label: 'Radius', max: 200, step: 1, unit: 'px' });
                }
            }
            let tabsHTML =`
);

content = content.replace(
    /headerProperties\.innerHTML = `[\s\S]*?`;\s*const slider = headerProperties\.querySelector/m,
    `if (clip.type === 'audio') {
                headerProperties.innerHTML = \`
                    <div class="flex items-center gap-2 pl-3 shrink-0 max-w-[200px]">
                        <div class="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style="background-color: \${PALETTES[clip.colorIndex].wave}"></div>
                        <span class="text-[12px] font-bold text-surface-700 dark:text-surface-300 truncate">\${clip.title}</span>
                    </div>
                \`;
            } else {
                headerProperties.innerHTML = \`
                    \${tabsHTML}
                    <div class="flex items-center gap-2 sm:gap-3 px-3 py-1.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg w-40 sm:w-64 md:w-80 shadow-inner shrink-0">
                        <span class="hidden sm:block text-[11px] font-semibold text-surface-500 dark:text-surface-400 uppercase w-12 truncate">\${activeTab.label}</span>
                        <input type="range" min="0" max="\${activeTab.max}" step="\${activeTab.step}" value="\${val}"
                            class="flex-1 w-full custom-slider appearance-none outline-none bg-transparent"
                            oninput="setClipEffect('\${clip.id}', '\${State.activePropertyTab}', this.value); this.style.background = 'linear-gradient(to right, \${sliderFill} ' + (this.value/this.max)*100 + '%, \${sliderBg} ' + (this.value/this.max)*100 + '%)'">
                        <span class="text-[11px] sm:text-xs font-mono font-extrabold text-surface-900 dark:text-white w-10 text-right shrink-0" id="lbl_\${State.activePropertyTab}">\${displayVal}</span>
                    </div>
                    \${extraActionsHTML}
                    <div class="hidden lg:flex items-center gap-2 pl-3 border-l border-surface-200 dark:border-surface-700 shrink-0 max-w-[150px]">
                        <div class="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style="background-color: \${PALETTES[clip.colorIndex].wave}"></div>
                        <span class="text-[11px] font-semibold text-surface-700 dark:text-surface-300 truncate">\${clip.title}</span>
                    </div>
                \`;
            }
            const slider = headerProperties.querySelector`
);

// --- 4. Modify updatePropertiesPanel to inject audioHTML ---
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
                            \${enableKey ? \`
                            <label class="relative inline-flex items-center cursor-pointer" onclick="event.stopPropagation()">
                                <input type="checkbox" class="sr-only peer" \${enabled ? 'checked' : ''} onchange="setClipEffect('\${clip.id}', '\${enableKey}', this.checked); updateSidebarPanel();">
                                <div class="w-7 h-4 bg-surface-300 dark:bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-500"></div>
                            </label>
                            \` : ''}
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

fs.writeFileSync(file, content);
console.log('Audio logic patched!');
