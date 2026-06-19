const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'thumb-maker ✅', 'studio_pro.html');
let content = fs.readFileSync(file, 'utf8');

const pasteLogic = `
        // Global Paste Listener for Images
        window.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (const item of items) {
                if (item.type.indexOf('image') === 0) {
                    const blob = item.getAsFile();
                    const url = URL.createObjectURL(blob);
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.onload = () => {
                        const newImg = {
                            id: 'el_' + Date.now(),
                            type: 'image',
                            img: img,
                            opacity: 100,
                            blendMode: 'source-over',
                            radius: 0,
                            x: CANVAS_WIDTH / 2,
                            y: CANVAS_HEIGHT / 2,
                            scale: 1,
                            rotation: 0
                        };
                        state.elements.push(newImg);
                        state.selectedId = newImg.id;
                        state.selectedIds = [newImg.id];
                        updateLayerList();
                        render();
                    };
                    img.src = url;
                    break;
                }
            }
        });
`;

if (!content.includes("window.addEventListener('paste'")) {
    content = content.replace('</script>', pasteLogic + '\n</script>');
    fs.writeFileSync(file, content);
    console.log("Paste logic appended before </script>.");
} else {
    console.log("Paste logic already exists!");
}
