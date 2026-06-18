const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'audio-editor ✅✅', 'studiopro_editor_text.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Custom Slider CSS
const oldSliderCSS = `        /* High Contrast Sliders */
        input[type=range].custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 14px; width: 14px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: 3px solid #111111;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            margin-top: -5px;
        }
        .dark input[type=range].custom-slider::-webkit-slider-thumb { 
            border-color: #ffffff;
            background: #111111;
        }
        input[type=range].custom-slider::-webkit-slider-runnable-track {
            height: 4px; border-radius: 2px;
        }`;

const newSliderCSS = `        /* Premium Sliders (Studio Pro Inspiration) */
        input[type=range].custom-slider {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
            height: 6px;
            border-radius: 4px;
        }
        input[type=range].custom-slider::-webkit-slider-runnable-track {
            width: 100%;
            height: 6px;
            background: #e5e5e5;
            border-radius: 4px;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
        }
        .dark input[type=range].custom-slider::-webkit-slider-runnable-track {
            background: #262626;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
        }
        input[type=range].custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #6366f1;
            cursor: pointer;
            margin-top: -5px;
            box-shadow: 0 2px 4px rgba(99, 102, 241, 0.4);
            border: 2px solid white;
            transition: transform 0.1s;
        }
        .dark input[type=range].custom-slider::-webkit-slider-thumb {
            border-color: #1a1a1a;
        }
        input[type=range].custom-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
        }`;

content = content.replace(oldSliderCSS, newSliderCSS);

// 2. Update form inputs to have more depth
// Current class fragments for inputs:
// bg-white dark:bg-surface-800/50
// border border-surface-300 dark:border-surface-600
const oldInputBg = "bg-white dark:bg-surface-800/50";
const oldInputBorder = "border border-surface-300 dark:border-surface-600";

const newInputBg = "bg-surface-50 dark:bg-surface-900/80 shadow-inner";
const newInputBorder = "border border-surface-200 dark:border-surface-700";

content = content.replaceAll(oldInputBg, newInputBg);
content = content.replaceAll(oldInputBorder, newInputBorder);

// Fix specific input types that might need focus rings updated
content = content.replaceAll("focus:border-brand-500", "focus:border-brand-500 focus:ring-1 focus:ring-brand-500");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Inputs, selects, and sliders updated for color depth.");
