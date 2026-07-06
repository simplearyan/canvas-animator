const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('studio_pro.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

setTimeout(() => {
    console.log("noSelectionMsg display:", document.getElementById('noSelectionMsg').style.display, document.getElementById('noSelectionMsg').className);
    console.log("editControls display:", document.getElementById('editControls').style.display, document.getElementById('editControls').className);
    
    // Simulate selecting preset 0 (The Classic) which contains text elements
    if (window.presetData && window.presetData.length > 0) {
        window.loadPreset(0);
        // Select the first element
        window.selectElement(window.state.elements[0].id);
        
        console.log("After selection:");
        const accContent = document.getElementById('acc-content');
        console.log("accContent style:", accContent.style.display, accContent.className);
        console.log("accContent offsetHeight (JSDOM usually 0):", accContent.offsetHeight);
        
        // Print the HTML inside editControls briefly to see if something is weird
        const editControls = document.getElementById('editControls');
        console.log("editControls children count:", editControls.children.length);
        console.log("editControls first child id:", editControls.firstElementChild.id);
    }
}, 1000);
