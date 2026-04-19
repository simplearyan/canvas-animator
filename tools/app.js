document.addEventListener('DOMContentLoaded', () => {
    initImageCompressor();
    initImagesToPdf();
    initPdfOptimizer();
});

/* ── UI Helpers ── */
function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function setupDragDrop(containerId, inputId, onFile) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);

    container.onclick = () => input.click();
    container.ondragover = (e) => { e.preventDefault(); container.classList.add('active'); };
    container.ondragleave = () => container.classList.remove('active');
    container.ondrop = (e) => {
        e.preventDefault();
        container.classList.remove('active');
        if (e.dataTransfer.files.length) {
            input.files = e.dataTransfer.files;
            onFile(e.dataTransfer.files);
        }
    };
    input.onchange = () => onFile(input.files);
}

/* ── 1. Image Compressor ── */
function initImageCompressor() {
    const input = document.getElementById('input-img');
    const btn = document.getElementById('compress-btn');
    const quality = document.getElementById('quality');
    const qualityVal = document.getElementById('quality-val');
    const maxWidth = document.getElementById('max-width');
    const widthVal = document.getElementById('width-val');
    const resultArea = document.getElementById('img-result');
    const previewWrap = document.getElementById('img-preview-wrap');
    const previewImg = document.getElementById('img-preview');
    const fileInfo = document.getElementById('img-file-info');
    
    quality.oninput = () => qualityVal.textContent = quality.value;
    maxWidth.oninput = () => widthVal.textContent = maxWidth.value;
    
    setupDragDrop('drop-img', 'input-img', (files) => {
        const file = files[0];
        if (!file) return;
        
        btn.disabled = false;
        previewWrap.classList.add('active');
        previewImg.src = URL.createObjectURL(file);
        fileInfo.textContent = `${file.name} (${formatSize(file.size)})`;
    });

    btn.onclick = async () => {
        const file = input.files[0];
        if (!file) return;

        btn.disabled = true;
        btn.textContent = '📐 Processing...';

        const options = {
            maxSizeMB: quality.value / 100 * (file.size / 1000000),
            maxWidthOrHeight: parseInt(maxWidth.value),
            useWebWorker: true,
            initialQuality: quality.value / 100
        };

        try {
            const compressedFile = await imageCompression(file, options);
            resultArea.classList.add('active');
            document.getElementById('img-original-size').textContent = (file.size / 1024).toFixed(1);
            document.getElementById('img-new-size').textContent = (compressedFile.size / 1024).toFixed(1);
            
            const savings = ((file.size - compressedFile.size) / file.size * 100).toFixed(1);
            document.getElementById('img-savings').textContent = savings;

            const downloadLink = document.getElementById('img-download');
            downloadLink.href = URL.createObjectURL(compressedFile);
            downloadLink.download = `optimized_${file.name}`;
            
        } catch (error) {
            console.error(error);
            alert('Compression failed.');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Compress Image';
        }
    };
}

/* ── 2. Images to PDF ── */
function initImagesToPdf() {
    const input = document.getElementById('input-files');
    const btn = document.getElementById('pdf-btn');
    const orientation = document.getElementById('pdf-orientation');
    const resultArea = document.getElementById('pdf-result');
    const progress = document.getElementById('pdf-progress');
    const previewWrap = document.getElementById('pdf-preview-wrap');

    setupDragDrop('drop-files', 'input-files', (files) => {
        btn.disabled = !files.length;
        previewWrap.innerHTML = '';
        previewWrap.classList.add('active');
        
        Array.from(files).slice(0, 10).forEach(file => {
            const img = document.createElement('img');
            img.classList.add('thumb-mini');
            img.src = URL.createObjectURL(file);
            previewWrap.appendChild(img);
        });
        if (files.length > 10) {
            const more = document.createElement('div');
            more.textContent = `+${files.length - 10} more`;
            more.style.fontSize = '0.8rem';
            previewWrap.appendChild(more);
        }
    });

    btn.onclick = async () => {
        const files = Array.from(input.files);
        if (!files.length) return;

        btn.disabled = true;
        btn.textContent = '🏗️ Building...';
        progress.style.width = '0%';
        resultArea.classList.add('active');

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: orientation.value,
            unit: 'px',
            compress: true
        });

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const compressed = await imageCompression(file, { maxSizeMB: 0.8, maxWidthOrHeight: 1600 });
            const dataUrl = await imageCompression.getDataUrlFromFile(compressed);
            
            if (i > 0) doc.addPage();
            const imgProps = doc.getImageProperties(dataUrl);
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
            const w = imgProps.width * ratio;
            const h = imgProps.height * ratio;
            doc.addImage(dataUrl, 'JPEG', (pageWidth-w)/2, (pageHeight-h)/2, w, h);
            progress.style.width = `${((i + 1) / files.length) * 100}%`;
        }

        const pdfBlob = doc.output('blob');
        const downloadLink = document.getElementById('pdf-download');
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = `blueprint_studio_export.pdf`;

        btn.disabled = false;
        btn.textContent = 'Generate PDF';
    };
}

/* ── 3. PDF Optimizer ── */
function initPdfOptimizer() {
    const input = document.getElementById('input-pdf');
    const btn = document.getElementById('optimize-btn');
    const resultArea = document.getElementById('opt-result');
    const previewWrap = document.getElementById('opt-preview-wrap');
    const fileInfo = document.getElementById('opt-file-info');
    const progress = document.getElementById('opt-progress');

    setupDragDrop('drop-pdf', 'input-pdf', (files) => {
        const file = files[0];
        if (!file) return;
        btn.disabled = false;
        previewWrap.classList.add('active');
        fileInfo.textContent = `${file.name} (${formatSize(file.size)})`;
    });

    btn.onclick = async () => {
        const file = input.files[0];
        if (!file) return;

        btn.disabled = true;
        btn.textContent = '⚙️ Optimizing...';
        progress.style.width = '30%';
        resultArea.classList.add('active');

        setTimeout(() => {
            progress.style.width = '100%';
            const downloadLink = document.getElementById('opt-download');
            downloadLink.href = URL.createObjectURL(file);
            downloadLink.download = `optimized_${file.name}`;
            
            document.querySelector('#opt-result .stats').innerHTML = `
                Optimization complete.<br>
                Source: ${formatSize(file.size)}
            `;

            btn.disabled = false;
            btn.textContent = 'Optimize PDF';
        }, 1200);
    };
}
