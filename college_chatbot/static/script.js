class CollegeChatbot {
    constructor() {
        this.sessionId = 'user_' + Date.now();
        this.isTyping = false;
        this.init();
    }

    init() {
        this.messagesContainer = document.getElementById('chatMessages');
        this.input = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.status = document.getElementById('chatStatus');
        this.themeToggle = document.getElementById('themeToggle');
        this.clearBtn = document.getElementById('clearBtn');
        this.voiceBtn = document.getElementById('voiceBtn');
        this.menuBtn = document.getElementById('menuBtn');

        this.bindEvents();
        this.welcomeMessage();
        this.loadTheme();
    }

    bindEvents() {
        this.sendBtn.onclick = () => this.sendMessage();
        this.input.onkeypress = (e) => e.key === 'Enter' && this.sendMessage();
        this.clearBtn.onclick = () => this.clearChat();
        this.themeToggle.onclick = () => this.toggleTheme();
        this.menuBtn.onclick = () => this.quickQuery('menu');
        this.voiceBtn.onclick = () => this.toggleVoice();

        // Auto-resize input
        this.input.oninput = () => {
            this.input.style.height = 'auto';
            this.input.style.height = this.input.scrollHeight + 'px';
        };
    }

    welcomeMessage() {
        this.addMessage('Namaste! 👋 Welcome to AI College Helpdesk v2.0<br><strong>Try quick buttons below or type <code>menu</code></strong>', 'bot');
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isTyping) return;

        this.input.value = '';
        this.addMessage(message, 'user');
        this.setStatus('CollegeBot is typing...');

        try {
            const response = await fetch('/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ msg: message, session_id: this.sessionId })
            });
            const data = await response.json();
            
            setTimeout(() => {
                this.addMessage(data.response, 'bot');
                this.setStatus(`Ready! (${data.history_length} messages)`);
            }, 800 + Math.random() * 1200); // Dynamic typing delay
        } catch (error) {
            this.addMessage('⚠️ Network error. Please check connection.', 'bot');
            this.setStatus('Error occurred');
        }
    }

    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.style.animationDelay = '0.1s';

        const avatar = type === 'user' 
            ? '<div class="avatar user"><i class="fas fa-user"></i></div>'
            : '<div class="avatar bot"><i class="fas fa-robot"></i></div>';

        messageDiv.innerHTML = `
            ${avatar}
            <div class="message-content">${content}</div>
        `;

        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    quickQuery(query) {
        this.input.value = query;
        this.sendMessage();
    }

    clearChat() {
        if (confirm('Clear chat history?')) {
            this.messagesContainer.innerHTML = '';
            fetch(`/clear?session_id=${this.sessionId}`);
            this.welcomeMessage();
        }
    }

    toggleTheme() {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', document.body.dataset.theme);
        this.themeToggle.innerHTML = document.body.dataset.theme === 'dark' 
            ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    loadTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) {
            document.body.dataset.theme = saved;
            this.themeToggle.innerHTML = saved === 'dark' 
                ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }

    setStatus(text) {
        this.status.textContent = text;
        this.isTyping = text.includes('typing');
    }

    toggleVoice() {
        alert('🎤 Voice input coming soon in v2.1!');
    }
}

// Initialize chatbot
const chatbot = new CollegeChatbot();
