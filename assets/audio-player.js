class AudioPlayer {
    constructor() {
        this.audioFiles = {
            'welcome-intro': '/assets/welcome_introduction.mp3',
            'attorney-scam': '/assets/attorney_scam_exposed.mp3',
            'diy-benefits': '/assets/diy_solution_benefits.mp3',
            'exit-club': '/assets/exit_club_benefits.mp3'
        };
        
        this.currentAudio = null;
        this.currentButton = null;
        this.initializePlayer();
        this.injectStyles();
    }

    initializePlayer() {
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.attachListeners());
        } else {
            this.attachListeners();
        }
    }

    attachListeners() {
        // Find buttons by their text content
        const buttons = this.findAudioButtons();
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleButtonClick(button);
            });
        });
    }

    findAudioButtons() {
        const allButtons = document.querySelectorAll('button, .btn, a');
        const audioButtons = [];

        allButtons.forEach(button => {
            const text = button.textContent.toLowerCase().trim();
            
            if (text.includes('welcome') || text.includes('introduction')) {
                button.dataset.audioKey = 'welcome-intro';
                audioButtons.push(button);
            } else if (text.includes('attorney') || text.includes('scam')) {
                button.dataset.audioKey = 'attorney-scam';
                audioButtons.push(button);
            } else if (text.includes('diy') || text.includes('solution')) {
                button.dataset.audioKey = 'diy-benefits';
                audioButtons.push(button);
            } else if (text.includes('exit') || text.includes('club')) {
                button.dataset.audioKey = 'exit-club';
                audioButtons.push(button);
            }
        });

        return audioButtons;
    }

    handleButtonClick(button) {
        const audioKey = button.dataset.audioKey;
        const audioUrl = this.audioFiles[audioKey];

        if (!audioUrl) {
            console.log('No audio file found for this button');
            return;
        }

        // Stop current audio if playing
        if (this.currentAudio && !this.currentAudio.paused) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.resetButtonState(this.currentButton);
        }

        // Create new audio instance
        this.currentAudio = new Audio(audioUrl);
        this.currentButton = button;

        // Set button to playing state
        this.setButtonPlaying(button);

        // Handle audio events
        this.currentAudio.addEventListener('loadstart', () => {
            console.log('Audio loading started:', audioUrl);
        });

        this.currentAudio.addEventListener('error', (e) => {
            console.log('Audio error:', e);
            console.log('Failed to load:', audioUrl);
            this.resetButtonState(button);
        });

        this.currentAudio.addEventListener('ended', () => {
            this.resetButtonState(button);
        });

        this.currentAudio.addEventListener('pause', () => {
            this.resetButtonState(button);
        });

        // Play the audio
        this.currentAudio.play().then(() => {
            console.log('Audio playing successfully:', audioUrl);
        }).catch(error => {
            console.log('Audio play failed:', error);
            this.resetButtonState(button);
        });
    }

    setButtonPlaying(button) {
        button.classList.add('audio-playing');
        button.classList.remove('audio-stopped');
    }

    resetButtonState(button) {
        if (button) {
            button.classList.remove('audio-playing');
            button.classList.add('audio-stopped');
        }
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .audio-playing {
                background-color: #22c55e !important;
                color: white !important;
                transform: scale(1.05);
                transition: all 0.3s ease;
            }
            
            .audio-stopped {
                transform: scale(1);
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the audio player when the page loads
new AudioPlayer();
