const API_URL = 'http://localhost:8000';

async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    document.getElementById('fileName').textContent = file.name;
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('processingSection').classList.remove('hidden');
    document.getElementById('features').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
    document.getElementById('actionButtons').classList.add('hidden');

    try {
        // Simulate upload
        let progress = 0;
        const uploadInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 40) {
                clearInterval(uploadInterval);
                progress = 40;
            }
            updateProgress(Math.floor(progress));
        }, 300);

        // Simulate processing
        setTimeout(() => {
            updateStatusMessage(' Processing with AI...', 'Generating interpolated frames');
            let processingProgress = 40;
            const processingInterval = setInterval(() => {
                processingProgress += Math.random() * 15;
                if (processingProgress > 99) {
                    clearInterval(processingInterval);
                    processingProgress = 100;
                    updateProgress(100);
                    updateStatusMessage('✓ Complete!', 'Your video is ready to download', 'completed');
                    document.getElementById('actionButtons').classList.remove('hidden');
                } else {
                    updateProgress(Math.floor(processingProgress));
                }
            }, 400);
        }, 2000);

    } catch (err) {
        showError('Failed to process video');
    }
}

function updateProgress(percent) {
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('progressPercent').textContent = percent + '%';
}

function updateStatusMessage(title, subtitle, status = null) {
    const msg = document.getElementById('statusMessage');
    msg.innerHTML = `<p class="text-lg font-semibold ${status === 'completed' ? 'text-green-300' : 'text-blue-300'}">${title}</p><p class="text-gray-400 text-sm">${subtitle}</p>`;
}

function showError(text) {
    document.getElementById('errorText').textContent = text;
    document.getElementById('errorMessage').classList.remove('hidden');
    document.getElementById('processingSection').classList.add('hidden');
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('features').classList.remove('hidden');
}

function handleReset() {
    document.getElementById('fileInput').value = '';
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('processingSection').classList.add('hidden');
    document.getElementById('features').classList.remove('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
    updateProgress(0);
}
