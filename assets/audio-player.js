class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.tracks = [
            {
                title: "Track 1 - DIY Resort Introduction",
                src: "public/audio/1.mp3",
                duration: "3:45"
            },
            {
                title: "Track 2 - Welcome Message",
                src: "public/audio/2.mp3", 
                duration: "2:30"
            },
            {
                title: "Track 3 - Getting Started Guide",
                src: "public/audio/3.mp3",
                duration: "4:15"
            },
            {
                title: "Track 4 - Tips and Tricks",
                src: "public/audio/4.mp3",
                duration: "3:20"
            },
            {
                title: "Track 5 - Advanced Features", 
                src: "public/audio/5.mp3",
                duration: "5:10"
            },
            {
                title: "Track 6 - Community Guidelines",
                src: "public/audio/6.mp3",
                duration: "2:45"
            },
            {
                title: "Track 7 - Success Stories",
                src: "public/audio/7.mp3",
                duration: "4:30"
            },
            {
                title: "Track 8 - Future Updates",
                src: "public/audio/8.mp3",
                duration: "3:00"
            },
            {
                title: "Track 9 - Q&A Session",
                src: "public/audio/9.mp3",
                duration: "6:20"
            },
            {
                title: "Track 10 - Closing Remarks",
                src: "public/audio/10.mp3",
                duration: "2:15"
            }
        ];
        
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderPlaylist();
        this.loadTrack(0);
    }
    
    initializeElements() {
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressBar = document.getElementById('progressBar');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeDisplay = document.getElementById('volumeDisplay');
        this.playlist = document.getElementById('playlist');
        this.currentTrackDisplay = document.getElementById('currentTrackDisplay');
    }
    
    setupEventListeners() {
        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Previous/Next buttons
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        // Progress bar
        this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        
        // Volume control
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('canplaythrough', () => {
            console.log('Audio ready to play:', this.tracks[this.currentTrackIndex].title);
        });
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            console.error('Error details:', this.audio.error);
            this.handleAudioError();
        });
        this.audio.addEventListener('loadstart', () => {
            console.log('Loading audio:', this.audio.src);
        });
    }
    
    handleAudioError() {
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.currentTrackDisplay.innerHTML = `
            <h4 style="color: #dc2626;">⚠️ Audio file not found: ${this.tracks[this.currentTrackIndex].title}</h4>
        `;
    }
    
    renderPlaylist() {
        this.playlist.innerHTML = '';
        
        this.tracks.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'track';
            trackElement.innerHTML = `
                <div class="track-info">
                    <div class="track-title">${track.title}</div>
                    <div class="track-duration">${track.duration}</div>
                </div>
                <button class="play-button">
                    ▶️
                </button>
            `;
            
            trackElement.addEventListener('click', () => this.selectTrack(index));
            this.playlist.appendChild(trackElement);
        });
        
        this.updatePlaylistUI();
    }
    
    selectTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            this.currentTrackIndex = index;
            this.loadTrack(index);
            this.updatePlaylistUI();
        }
    }
    
    loadTrack(index) {
        const track = this.tracks[index];
        this.audio.src = track.src;
        this.audio.load();
        
        this.currentTrackDisplay.innerHTML = `
            <h4>🎵 ${track.title}</h4>
        `;
        
        console.log('Loading track:', track.src);
        
        // Reset play state
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.updateProgress();
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.updatePlayPauseButton();
                this.updatePlaylistUI();
                console.log('Audio playing:', this.tracks[this.currentTrackIndex].title);
            }).catch(error => {
                console.error('Error playing audio:', error);
                this.isPlaying = false;
                this.updatePlayPauseButton();
                this.handleAudioError();
            });
        }
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.updatePlaylistUI();
        console.log('Audio paused');
    }
    
    previousTrack() {
        if (this.currentTrackIndex > 0) {
            this.selectTrack(this.currentTrackIndex - 1);
            if (this.isPlaying) {
                this.play();
            }
        }
    }
    
    nextTrack() {
        if (this.currentTrackIndex < this.tracks.length - 1) {
            this.selectTrack(this.currentTrackIndex + 1);
            if (this.isPlaying) {
                this.play();
            }
        }
    }
    
    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        
        if (duration) {
            this.audio.currentTime = (clickX / width) * duration;
        }
    }
    
    setVolume() {
        const volume = this.volumeSlider.value / 100;
        this.audio.volume = volume;
        this.volumeDisplay.textContent = `${this.volumeSlider.value}%`;
    }
    
    updateProgress() {
        const { currentTime, duration } = this.audio;
        
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            this.progressBar.style.width = `${progressPercent}%`;
        }
        
        this.currentTimeEl.textContent = this.formatTime(currentTime);
    }
    
    updateDuration() {
        this.durationEl.textContent = this.formatTime(this.audio.duration);
    }
    
    updatePlayPauseButton() {
        this.playPauseBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
    }
    
    updatePlaylistUI() {
        const trackElements = this.playlist.querySelectorAll('.track');
        
        trackElements.forEach((trackEl, index) => {
            trackEl.classList.remove('active');
            const playButton = trackEl.querySelector('.play-button');
            playButton.textContent = '▶️';
            
            if (index === this.currentTrackIndex) {
                trackEl.classList.add('active');
                playButton.textContent = this.isPlaying ? '⏸️' : '▶️';
            }
        });
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize the audio player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Professional Audio Player...');
    window.audioPlayer = new AudioPlayer();
    
    // Set initial volume
    window.audioPlayer.setVolume();
    
    console.log('Professional Audio Player ready!');
});