document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadContainer = document.getElementById('upload-container');
    const fileInput = document.getElementById('file-input');
    const originalImage = document.getElementById('original-image');
    const resultCanvas = document.getElementById('result-canvas');
    const processingIndicator = document.getElementById('processing-indicator');
    const processingArea = document.getElementById('processing-area');
    const downloadBtn = document.getElementById('download-btn');
    const tryAnotherBtn = document.getElementById('try-another-btn');

    // MediaPipe Selfie Segmentation
    let selfieSegmentation;

    // Initialize MediaPipe
    async function initializeMediaPipe() {
        selfieSegmentation = new SelfieSegmentation({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
            }
        });

        selfieSegmentation.setOptions({
            modelSelection: 1,
            selfieMode: false
        });

        selfieSegmentation.onResults(processResults);
    }

    // Process segmentation results from MediaPipe
    function processResults(results) {
        processingIndicator.classList.add('hidden');

        const ctx = resultCanvas.getContext('2d');
        resultCanvas.width = results.image.width;
        resultCanvas.height = results.image.height;

        ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

        ctx.save();
        ctx.drawImage(results.segmentationMask, 0, 0, resultCanvas.width, resultCanvas.height);

        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(results.image, 0, 0, resultCanvas.width, resultCanvas.height);

        ctx.restore();
    }

    // Remove background smartly with API priority
    async function smartRemoveBackground(imageElement, file) {
        processingIndicator.classList.remove('hidden');

        try {
            const processedImage = await tryRemoveBgAPI(file);
            drawToCanvas(processedImage);
            console.log('Used remove.bg API');
        } catch (e1) {
            console.warn('remove.bg failed:', e1);

            try {
                const processedImage = await tryPixianAPI(file);
                drawToCanvas(processedImage);
                console.log('Used Pixian.ai API');
            } catch (e2) {
                console.warn('Pixian.ai failed:', e2);

                try {
                    await selfieSegmentation.send({ image: imageElement });
                    console.log('Used MediaPipe fallback');
                } catch (e3) {
                    console.error('All background removal methods failed:', e3);
                    alert('All background removal methods failed. Please try another image.');
                    processingIndicator.classList.add('hidden');
                }
            }
        }
    }

    // Try remove.bg API
    async function tryRemoveBgAPI(file) {
        const apiKey = '8GiBpRi3q7kk4g9ZFKbu5U7P'; // <<-- put your key here

        const formData = new FormData();
        formData.append('image_file', file);
        formData.append('size', 'auto');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': apiKey
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('remove.bg API failed');
        }

        const blob = await response.blob();
        return createImageBitmap(blob);
    }

    // Try Pixian.ai API
    async function tryPixianAPI(file) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('https://api.pixian.ai/removebg', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Pixian.ai API failed');
        }

        const blob = await response.blob();
        return createImageBitmap(blob);
    }

    // Draw the processed image onto canvas
    function drawToCanvas(imageBitmap) {
        processingIndicator.classList.add('hidden');

        const ctx = resultCanvas.getContext('2d');
        resultCanvas.width = imageBitmap.width;
        resultCanvas.height = imageBitmap.height;

        ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
        ctx.drawImage(imageBitmap, 0, 0);
    }

    // Handle file upload
    function handleFileUpload(file) {
        if (!file.type.match('image.*')) {
            alert('Please upload an image file (JPEG or PNG)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size too large. Maximum 5MB allowed.');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            originalImage.onload = function() {
                processingArea.classList.remove('hidden');
                smartRemoveBackground(originalImage, file);
            };
            originalImage.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    // Download result
    function downloadResult() {
        const link = document.createElement('a');
        link.download = 'background-removed.png';
        link.href = resultCanvas.toDataURL('image/png');
        link.click();
    }

    // Reset the app
    function resetApp() {
        fileInput.value = '';
        processingArea.classList.add('hidden');
        originalImage.src = '';
        resultCanvas.getContext('2d').clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    }

    // Event Listeners
    uploadContainer.addEventListener('click', () => fileInput.click());

    uploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadContainer.classList.add('border-purple-500', 'bg-purple-50');
    });

    uploadContainer.addEventListener('dragleave', () => {
        uploadContainer.classList.remove('border-purple-500', 'bg-purple-50');
    });

    uploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadContainer.classList.remove('border-purple-500', 'bg-purple-50');

        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    });

    downloadBtn.addEventListener('click', downloadResult);
    tryAnotherBtn.addEventListener('click', resetApp);

    // Initialize the app
    initializeMediaPipe();
});

// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.faq-toggle').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const content = button.nextElementSibling;
            content.classList.toggle('active');

            document.querySelectorAll('.faq-toggle').forEach(otherButton => {
                if (otherButton !== button && otherButton.classList.contains('active')) {
                    otherButton.classList.remove('active');
                    otherButton.nextElementSibling.classList.remove('active');
                }
            });
        });

        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.click();
        });
    });
});
