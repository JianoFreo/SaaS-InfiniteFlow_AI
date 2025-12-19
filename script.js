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

// Handle prompts from the left navigation panels
async function handlePromptSubmit(mode) {
    const textarea = document.getElementById(`prompt-${mode}`);
    if (!textarea) return;
    const prompt = textarea.value.trim();
    if (!prompt) {
        alert('Please enter a prompt first.');
        return;
    }

    const statusEl = document.getElementById(`prompt-status-${mode}`);
    if (statusEl) {
        statusEl.textContent = 'Sending prompt to AI...';
        statusEl.classList.remove('text-red-400');
        statusEl.classList.remove('text-green-300');
        statusEl.classList.add('text-blue-300');
    }

    // Get OpenAI API key from Settings panel input
    const keyInput = document.getElementById('openai-api-key');
    const apiKey = keyInput?.value.trim();
    if (!apiKey) {
        if (statusEl) {
            statusEl.textContent = 'Add your OpenAI API key in Settings to use this.';
            statusEl.classList.remove('text-blue-300');
            statusEl.classList.add('text-red-400');
        }
        return;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4.1-mini',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You help turn casual wishes about how to edit a video or frames into short, concrete instructions. Keep answers concise and practical.',
                    },
                    {
                        role: 'user',
                        content:
                            `Edit mode: ${mode}\nUser description: ${prompt}\n\nReturn 2-3 short sentences describing how the video should be edited.`,
                    },
                ],
                max_tokens: 150,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const detail = errorData?.detail || 'Failed to get a response from AI.';
            if (statusEl) {
                statusEl.textContent = detail;
                statusEl.classList.remove('text-blue-300');
                statusEl.classList.add('text-red-400');
            }
            return;
        }

        const data = await response.json();
        if (statusEl) {
            const suggestion = data?.choices?.[0]?.message?.content?.trim();
            statusEl.textContent = suggestion || 'AI responded, but no suggestion was provided.';
            statusEl.classList.remove('text-blue-300');
            statusEl.classList.remove('text-red-400');
            statusEl.classList.add('text-green-300');
        }
    } catch (err) {
        console.error('Error sending prompt:', err);
        if (statusEl) {
            statusEl.textContent = 'Network error while contacting OpenAI API.';
            statusEl.classList.remove('text-blue-300');
            statusEl.classList.add('text-red-400');
        }
    }
}

// Sidebar navigation: switch visible panel
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeSidePanelBtn = document.getElementById('closeSidePanelBtn');
    const sidePanel = document.getElementById('sidePanel');
    const sideOverlay = document.getElementById('sideOverlay');

    function openSidebar() {
        sidePanel.classList.remove('-translate-x-full');
        sideOverlay.classList.remove('-translate-x-full');
        sideOverlay.style.left = '16rem'; // 64px (w-64)
    }

    function closeSidebar() {
        sidePanel.classList.add('-translate-x-full');
        sideOverlay.classList.add('-translate-x-full');
        sideOverlay.style.left = '0';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openSidebar);
    }

    if (closeSidePanelBtn) {
        closeSidePanelBtn.addEventListener('click', closeSidebar);
    }

    if (sideOverlay) {
        sideOverlay.addEventListener('click', closeSidebar);
    }

    // Panel navigation
    const navButtons = document.querySelectorAll('[data-panel-target]');
    const panels = document.querySelectorAll('.panel-section');
    const uploadSection = document.getElementById('uploadSection');
    const headerTitle = document.querySelector('main .text-center h2');

    const panelTitles = {
        'panel-edit-1': 'Enhance Your Videos with AI',
        'panel-edit-2': 'Enhance Your Videos with AI',
        'panel-edit-3': 'Enhance Your Videos with AI',
        'panel-settings': 'Settings',
        'panel-about': 'About',
        'panel-profile': 'Profile'
    };

    function setActivePanel(targetId) {
        panels.forEach((panel) => {
            if (panel.id === targetId) {
                panel.classList.remove('hidden');
            } else {
                panel.classList.add('hidden');
            }
        });

        navButtons.forEach((btn) => {
            const isActive = btn.getAttribute('data-panel-target') === targetId;
            if (isActive) {
                btn.classList.add('sidebar-item-active');
            } else {
                btn.classList.remove('sidebar-item-active');
            }
        });

        // Show/hide upload section based on panel type
        if (targetId.startsWith('panel-edit')) {
            uploadSection.classList.remove('hidden');
        } else {
            uploadSection.classList.add('hidden');
        }

        // Update header title
        if (headerTitle) {
            headerTitle.textContent = panelTitles[targetId] || 'Enhance Your Videos with AI';
        }

        // Close sidebar on mobile after clicking
        if (window.innerWidth < 768) {
            sidePanel.classList.add('-translate-x-full');
            sideOverlay.classList.add('-translate-x-full');
        }
    }

    navButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-panel-target');
            if (targetId) setActivePanel(targetId);
        });
    });

    // Set a default active panel if available
    if (navButtons.length > 0) {
        const firstTarget = navButtons[0].getAttribute('data-panel-target');
        if (firstTarget) setActivePanel(firstTarget);
    }
});

// Profile Sign In / Sign Out
function handleProfileSignIn() {
    const email = document.getElementById('profileEmail')?.value.trim();
    const password = document.getElementById('profilePassword')?.value.trim();
    const statusEl = document.getElementById('profileStatus');

    if (!email || !password) {
        if (statusEl) statusEl.textContent = 'Please fill in both email and password.';
        return;
    }

    // Simulate successful login (in production, this would call your backend)
    document.getElementById('profileLoggedOut').classList.add('hidden');
    document.getElementById('profileLoggedIn').classList.remove('hidden');
    document.getElementById('profileUsername').textContent = email.split('@')[0];
    if (statusEl) statusEl.textContent = 'Logged in successfully!';
}

function handleProfileSignOut() {
    document.getElementById('profileLoggedOut').classList.remove('hidden');
    document.getElementById('profileLoggedIn').classList.add('hidden');
    document.getElementById('profileEmail').value = '';
    document.getElementById('profilePassword').value = '';
    const statusEl = document.getElementById('profileStatus');
    if (statusEl) statusEl.textContent = 'Signed out.';
}
