// UI Configuration and Rendering Logic
const CONFIG = {
    sidebar: [
        { label: 'Prompt: Enhance quality', target: 'panel-edit-1' },
        { label: 'Prompt: Change style', target: 'panel-edit-2' },
        { label: 'Prompt: Background clean-up', target: 'panel-edit-3' },
    ],
    footer: [
        { label: ' Settings', target: 'panel-settings' },
        { label: ' Profile', target: 'panel-profile' },
        { label: 'ⓘ About', target: 'panel-about' },
    ],
    panels: [
        { id: 'edit-1', title: 'Enhance video quality with AI', desc: 'Describe how you want the video to be enhanced.', placeholder: 'E.g. Make the motion smoother and reduce noise in dark scenes...' },
        { id: 'edit-2', title: 'Change visual style', desc: 'Describe the target style for your video (e.g. cinematic, anime, watercolor).', placeholder: 'E.g. Make this video look like a cinematic movie trailer...' },
        { id: 'edit-3', title: 'Background clean-up', desc: 'Describe how you want the background treated (e.g. blur, replace, remove distractions).', placeholder: 'E.g. Blur the background slightly and keep people in focus...' },
    ],
    features: [
        { title: 'Fast', desc: 'GPU-accelerated processing' },
        { title: 'Intelligent', desc: 'AI-generated frames' },
        { title: 'Smooth', desc: '2x frame rate playback' },
    ],
};

function renderUI() {
    // Render sidebar items
    const sidebarItems = document.getElementById('sidebarItems');
    if (sidebarItems) {
        sidebarItems.innerHTML = CONFIG.sidebar
            .map(item => `<button class="sidebar-item" data-panel-target="${item.target}">${item.label}</button>`)
            .join('');
    }

    // Render sidebar footer
    const sidebarFooter = document.getElementById('sidebarFooter');
    if (sidebarFooter) {
        sidebarFooter.innerHTML = CONFIG.footer
            .map(item => `<button class="sidebar-item" data-panel-target="${item.target}">${item.label}</button>`)
            .join('');
    }

    // Render panels
    const panelsContainer = document.getElementById('panelsContainer');
    if (panelsContainer) {
        panelsContainer.innerHTML = [
            ...CONFIG.panels.map(panel => `
                <div id="panel-${panel.id}" class="panel-section glass rounded-2xl p-5 md:p-8 hidden">
                    <h3 class="text-lg md:text-xl font-semibold text-white mb-2">${panel.title}</h3>
                    <p class="text-sm md:text-base text-gray-400 mb-4">${panel.desc}</p>
                    <textarea id="prompt-${panel.id}" rows="3" class="w-full rounded-xl bg-black/40 border border-white/10 text-sm md:text-base text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="${panel.placeholder}"></textarea>
                    <div class="mt-3 flex justify-end">
                        <button onclick="handlePromptSubmit('${panel.id}')" class="px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-xs md:text-sm rounded-lg shadow-lg">Send prompt</button>
                    </div>
                    <p id="prompt-status-${panel.id}" class="mt-2 text-xs md:text-sm text-gray-400"></p>
                </div>
            `),
            `
            <div id="panel-settings" class="panel-section glass rounded-2xl p-5 md:p-8 hidden">
                <h3 class="text-lg md:text-xl font-semibold text-white mb-2">Settings</h3>
                <p class="text-sm md:text-base text-gray-400 mb-4">Configure how InfiniteFlow AI should work. These are placeholders you can later connect to real backend settings.</p>
                <div class="space-y-3 text-sm md:text-base text-gray-200">
                    <div class="flex flex-col gap-1">
                        <span>OpenAI API key (kept only in this browser tab)</span>
                        <input id="openai-api-key" type="password" class="w-full rounded-lg bg-black/40 border border-white/10 text-xs md:text-sm text-gray-100 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent" placeholder="sk-..." />
                    </div>
                    <div class="flex items-center justify-between">
                        <span>Use AI for style guidance</span>
                        <input type="checkbox" class="w-4 h-4" checked>
                    </div>
                    <div class="flex items-center justify-between">
                        <span>Strength of AI edits</span>
                        <select class="bg-black/40 border border-white/10 rounded-lg text-xs md:text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option>Subtle</option>
                            <option selected>Balanced</option>
                            <option>Strong</option>
                        </select>
                    </div>
                </div>
            </div>
            <div id="panel-profile" class="panel-section glass rounded-2xl p-5 md:p-8 hidden">
                <h3 class="text-lg md:text-xl font-semibold text-white mb-2">Profile</h3>
                <div id="profileLoggedOut" class="space-y-3">
                    <p class="text-sm md:text-base text-gray-400 mb-4">Sign in to save your edits and preferences.</p>
                    <input id="profileEmail" type="email" placeholder="Email" class="w-full rounded-lg bg-black/40 border border-white/10 text-sm text-gray-100 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <input id="profilePassword" type="password" placeholder="Password" class="w-full rounded-lg bg-black/40 border border-white/10 text-sm text-gray-100 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <button onclick="handleProfileSignIn()" class="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm rounded-lg">Sign In</button>
                </div>
                <div id="profileLoggedIn" class="hidden space-y-3">
                    <p class="text-sm text-gray-300">Welcome, <span id="profileUsername" class="font-semibold text-white">User</span>!</p>
                    <button onclick="handleProfileSignOut()" class="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 font-semibold text-sm rounded-lg">Sign Out</button>
                </div>
                <p id="profileStatus" class="mt-3 text-xs text-gray-500"></p>
            </div>
            <div id="panel-about" class="panel-section glass rounded-2xl p-5 md:p-8 hidden">
                <h3 class="text-lg md:text-xl font-semibold text-white mb-2">About InfiniteFlow AI</h3>
                <p class="text-sm md:text-base text-gray-400 mb-2">InfiniteFlow AI uses GPU-accelerated interpolation to create smooth videos and can be extended with prompts for creative video editing.</p>
                <p class="text-xs md:text-sm text-gray-500">Use the options in the left navigation to choose how you want to guide the AI. You can later wire these prompts to your backend to call the APIs.</p>
            </div>
            `
        ].join('');
    }

    // Render features
    const featuresContainer = document.getElementById('featuresContainer');
    if (featuresContainer) {
        featuresContainer.innerHTML = CONFIG.features
            .map(feature => `
                <div class="glass rounded-xl md:rounded-2xl p-4 md:p-8 text-center hover:bg-white/10 transition-all">
                    <h3 class="font-bold text-white mb-2 md:mb-6 text-sm md:text-base">${feature.title}</h3>
                    <p class="text-gray-400 text-xs md:text-sm">${feature.desc}</p>
                </div>
            `)
            .join('');
    }
}

// Initialize UI when DOM is ready
document.addEventListener('DOMContentLoaded', renderUI);
