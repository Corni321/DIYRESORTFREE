// 🎵 DIY Resort Free - Audio Player JavaScript Code
// Add this code to make your audio buttons functional

// Audio player class to handle all audio functionality
class AudioPlayer {
    constructor() {
        this.currentAudio = null;
        this.currentButton = null;
        this.audioFiles = {
            'welcome-intro': '/assets/welcome_introduction.mp3',
            'attorney-scam': '/assets/attorney_scam_exposed.mp3',
            'diy-benefits': '/assets/diy_solution_benefits.mp3',
            'exit-club': '/assets/exit_club_benefits.mp3'
        };
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupButtons());
        } else {
            this.setupButtons();
        }
    }

    setupButtons() {
        // Find all audio buttons (adapt these selectors to match your actual buttons)
        const audioButtons = document.querySelectorAll('[data-audio], .audio-button, button[id*="audio"]');
        
        // If no buttons found with data attributes, try to find by text content
        if (audioButtons.length === 0) {
            this.setupByTextContent();
            return;
        }

        audioButtons.forEach(button => {
            const audioId = button.getAttribute('data-audio') || this.getAudioIdFromButton(button);
            if (audioId && this.audioFiles[audioId]) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleAudio(audioId, button);
                });
                
                // Add visual feedback classes
                button.classList.add('audio-ready');
            }
        });
    }

    setupByTextContent() {
        // Fallback: find buttons by their text content
        const buttonMappings = [
            { text: 'Welcome Introduction', id: 'welcome-intro' },
            { text: 'Attorney Scam Exposed', id: 'attorney-scam' },
            { text: 'DIY Solution Benefits', id: 'diy-benefits' },
            { text: 'Exit Club Benefits', id: 'exit-club' }
        ];

        buttonMappings.forEach(mapping => {
            // Try different selectors to find the buttons
            const selectors = [
                `button:contains("${mapping.text}")`,
                `[role="button"]:contains("${mapping.text}")`,
                `.button:contains("${mapping.text}")`,
                `*:contains("${mapping.text}")`
            ];

            let button = null;
            
            // Manual search for buttons containing the text
            const allButtons = document.querySelectorAll('button, [role="button"], .button, div, span');
            allButtons.forEach(el => {
                if (el.textContent.trim().includes(mapping.text)) {
                    button = el;
                }
            });

            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleAudio(mapping.id, button);
                });
                
                // Add data attribute for future reference
                button.setAttribute('data-audio', mapping.id);
                button.classList.add('audio-ready');
                
                console.log(`✅ Audio button setup: ${mapping.text}`);
            } else {
                console.warn(`⚠️ Could not find button for: ${mapping.text}`);
            }
        });
    }

    getAudioIdFromButton(button) {
        const text = button.textContent.toLowerCase();
        if (text.includes('welcome')) return 'welcome-intro';
        if (text.includes('attorney') || text.includes('scam')) return 'attorney-scam';
        if (text.includes('diy') || text.includes('solution')) return 'diy-benefits';
        if (text.includes('exit') || text.includes('club')) return 'exit-club';
        return null;
    }

    toggleAudio(audioId, button) {
        // If this audio is already playing, stop it
        if (this.currentAudio && this.currentButton === button) {
            this.stopAudio();
            return;
        }

        // Stop any currently playing audio
        this.stopAudio();

        // Start new audio
        this.playAudio(audioId, button);
    }

    playAudio(audioId, button) {
        const audioFile = this.audioFiles[audioId];
        if (!audioFile) {
            console.error(`Audio file not found for: ${audioId}`);
            return;
        }

        try {
            // Create new audio instance
            this.currentAudio = new Audio(audioFile);
            this.currentButton = button;

            // Add event listeners
            this.currentAudio.addEventListener('loadstart', () => {
                this.updateButtonState(button, 'loading');
            });

            this.currentAudio.addEventListener('canplay', () => {
                this.updateButtonState(button, 'ready');
            });

            this.currentAudio.addEventListener('play', () => {
                this.updateButtonState(button, 'playing');
            });

            this.currentAudio.addEventListener('pause', () => {
                this.updateButtonState(button, 'paused');
            });

            this.currentAudio.addEventListener('ended', () => {
                this.stopAudio();
            });

            this.currentAudio.addEventListener('error', (e) => {
                console.error('Audio playback error:', e);
                this.updateButtonState(button, 'error');
                this.stopAudio();
            });

            // Start playback
            this.currentAudio.play().catch(error => {
                console.error('Error playing audio:', error);
                this.updateButtonState(button, 'error');
            });

        } catch (error) {
            console.error('Error initializing audio:', error);
            this.updateButtonState(button, 'error');
        }
    }

    stopAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }

        if (this.currentButton) {
            this.updateButtonState(this.currentButton, 'stopped');
            this.currentButton = null;
        }
    }

    updateButtonState(button, state) {
        // Remove all state classes
        button.classList.remove('audio-loading', 'audio-playing', 'audio-paused', 'audio-error', 'audio-stopped');
        
        // Add current state class
        button.classList.add(`audio-${state}`);

        // Update button text/appearance based on state
        const originalText = button.getAttribute('data-original-text') || button.textContent;
        
        if (!button.getAttribute('data-original-text')) {
            button.setAttribute('data-original-text', button.textContent);
        }

        switch (state) {
            case 'loading':
                this.addLoadingIndicator(button);
                break;
            case 'playing':
                this.addPlayingIndicator(button);
                break;
            case 'error':
                button.textContent = originalText + ' (Error)';
                break;
            case 'stopped':
                button.textContent = originalText;
                this.removeIndicators(button);
                break;
        }
    }

    addLoadingIndicator(button) {
        this.removeIndicators(button);
        const indicator = document.createElement('span');
        indicator.className = 'audio-loading-spinner';
        indicator.innerHTML = ' ⏳';
        button.appendChild(indicator);
    }

    addPlayingIndicator(button) {
        this.removeIndicators(button);
        const indicator = document.createElement('span');
        indicator.className = 'audio-playing-indicator';
        indicator.innerHTML = ' ▶️';
        button.appendChild(indicator);
    }

    removeIndicators(button) {
        const indicators = button.querySelectorAll('.audio-loading-spinner, .audio-playing-indicator');
        indicators.forEach(indicator => indicator.remove());
    }
}

// CSS Styles for audio player (add to your CSS file)
const audioPlayerStyles = `
/* Audio Player Styles */
.audio-ready {
    cursor: pointer;
    transition: all 0.3s ease;
}

.audio-ready:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.audio-loading {
    opacity: 0.7;
    pointer-events: none;
}

.audio-playing {
    background-color: #4CAF50 !important;
    color: white !important;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.audio-error {
    background-color: #f44336 !important;
    color: white !important;
}

.audio-loading-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .audio-ready {
        font-size: 14px;
        padding: 8px 12px;
    }
}
`;

// Function to inject CSS styles
function injectAudioStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = audioPlayerStyles;
    document.head.appendChild(styleSheet);
}

// Initialize the audio player when the script loads
let audioPlayerInstance = null;

function initializeAudioPlayer() {
    if (!audioPlayerInstance) {
        injectAudioStyles();
        audioPlayerInstance = new AudioPlayer();
        console.log('🎵 DIY Resort Free Audio Player initialized!');
    }
}

// Auto-initialize
initializeAudioPlayer();

// Export for manual initialization if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioPlayer;
} else if (typeof window !== 'undefined') {
    window.DIYAudioPlayer = AudioPlayer;
    window.initializeAudioPlayer = initializeAudioPlayer;
}
