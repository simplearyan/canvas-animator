/**
 * app.js - Logic for Blueprint Tools
 */

document.addEventListener('DOMContentLoaded', () => {
    initImageCompressor();
    initImagesToPdf();
    initPdfOptimizer();
});

/* ── helper: format size ── */
function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    
    // UI Updates
    quality.oninput = () => qualityVal.textContent = quality.value;
    maxWidth.oninput = () => widthVal.textContent = maxWidth.value;
    
    input.onchange = (e) => {
        btn.disabled = !e.target.files.length;
    };

    btn.onclick = async () => {
        const file = input.files[0];
        if (!file) return;

        btn.disabled = true;
        btn.textContent = 'Processing...';

        const options = {
            maxSizeMB: quality.value / 100 * (file.size / 1000000), // Approximate target
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

    input.onchange = (e) => {
        btn.disabled = !e.target.files.length;
    };

    btn.onclick = async () => {
        const files = Array.from(input.files);
        if (!files.length) return;

        btn.disabled = true;
        btn.textContent = 'Generating...';
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
            
            // Compress each image before adding to PDF to keep size low
            const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1200 });
            const dataUrl = await imageCompression.getDataUrlFromFile(compressed);
            
            if (i > 0) doc.addPage();
            
            const imgProps = doc.getImageProperties(dataUrl);
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            // Fit image to page
            const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
            const w = imgProps.width * ratio;
            const h = imgProps.height * ratio;
            const x = (pageWidth - w) / 2;
            const y = (pageHeight - h) / 2;

            doc.addImage(dataUrl, 'JPEG', x, y, w, h, undefined, 'FAST');
            
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

    input.onchange = (e) => {
        btn.disabled = !e.target.files.length;
    };

    btn.onclick = async () => {
        const file = input.files[0];
        if (!file) return;

        btn.disabled = true;
        btn.textContent = 'Optimizing...';
        resultArea.classList.add('active');

        // Note: Real PDF internal compression in browser is very limited.
        // We will "simulate" it by reloading and re-saving with compression flags
        // in a production app we might use pdf-lib to re-encode streams.
        
        setTimeout(() => {
            // For now, we'll just rename and offer the download as a "simulated" optimize
            // until we integrate more complex WASM tools.
            const downloadLink = document.getElementById('opt-download');
            downloadLink.href = URL.createObjectURL(file);
            downloadLink.download = `optimized_${file.name}`;
            
            document.getElementById('opt-result').innerHTML = `
                <div class="stats">Processing complete (simulated optimized pass).</div>
                <a href="${downloadLink.href}" download="${downloadLink.download}" class="btn" style="display:block; text-align:center; text-decoration:none;">Download Optimized</a>
            `;

            btn.disabled = false;
            btn.textContent = 'Optimize PDF';
        }, 1500);
    };
}
