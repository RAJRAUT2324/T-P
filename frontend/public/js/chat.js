// --- AI CHAT LOGIC ---

const chatState = {
    isOpen: false,
    history: [],
    isSpeechEnabled: true // Default: Speech ON
};

// Toggle Chat Window
function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    chatState.isOpen = !chatState.isOpen;

    if (chatState.isOpen) {
        chatContainer.classList.add('active');
        // Ensure toggle button exists if not present
        addSpeechToggleUI();

        if (chatState.history.length === 0) {
            addMessage("bot", "Hello! I am your AI Placement Mentor. How can I help you today? You can ask about interview prep, resume tips, or upcoming drives.");
        }
    } else {
        chatContainer.classList.remove('active');
    }
}

// Dynamically add speech toggle if missing
function addSpeechToggleUI() {
    const header = document.querySelector('.chat-header');
    if (header && !document.getElementById('speechToggleBtn')) {
        // Create container if needed or just append
        const toggleBtn = document.createElement('span');
        toggleBtn.id = 'speechToggleBtn';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.marginRight = '15px';
        toggleBtn.title = "Toggle Speech";
        toggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        toggleBtn.onclick = toggleSpeech;

        // Insert before the close button (last child usually)
        header.insertBefore(toggleBtn, header.lastElementChild);
    }
}

function toggleSpeech() {
    chatState.isSpeechEnabled = !chatState.isSpeechEnabled;
    const icon = document.querySelector("#speechToggleBtn i");

    if (icon) {
        if (chatState.isSpeechEnabled) {
            icon.className = "fas fa-volume-up";
        } else {
            icon.className = "fas fa-volume-mute";
            window.speechSynthesis.cancel();
        }
    }
}

// Add Message to UI
function addMessage(sender, text) {
    const chatBody = document.getElementById('chat-body');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'bot' ? 'bot-msg' : 'user-msg');
    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    chatState.history.push({ sender, text });
}

// Send Message to Backend
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    // 1. Add User Message
    addMessage('user', message);
    input.value = '';

    // 2. Show Loading Indicator (Optional)
    const chatBody = document.getElementById('chat-body');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-msg loading';
    loadingDiv.innerText = '...';
    loadingDiv.id = 'chat-loading';
    chatBody.appendChild(loadingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        // 3. Call API
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        // Remove loading
        const loadingEl = document.getElementById('chat-loading');
        if (loadingEl) loadingEl.remove();

        // 4. Handle Response
        if (data.response) {
            addMessage('bot', data.response);
            speak(data.response);
        } else if (data.error) {
            addMessage('bot', "⚠️ " + data.error);
        } else {
            addMessage('bot', "I received an empty response. Please try again.");
        }

    } catch (error) {
        const loadingEl = document.getElementById('chat-loading');
        if (loadingEl) loadingEl.remove();
        addMessage('bot', "Network Error: Could not reach the server. Please check your connection.");
        console.error("Chat Error:", error);
    }
}

// Handle Enter Key
function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

// Text to Speech
function speak(text) {
    if (!chatState.isSpeechEnabled) return;

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        // utterance.rate = 1.1; 
        window.speechSynthesis.speak(utterance);
    }
}
