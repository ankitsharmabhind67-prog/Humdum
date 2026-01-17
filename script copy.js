// ===== NETFLIX-STYLE VIDEO PLAYER CONTROLS =====

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('loveVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const skipBackBtn = document.getElementById('skipBackBtn');
    const skipForwardBtn = document.getElementById('skipForwardBtn');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    const volumeSlider = document.getElementById('volumeSlider');
    const ccBtn = document.getElementById('ccBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // Skip backwards 10 seconds
    skipBackBtn.addEventListener('click', function() {
        video.currentTime = Math.max(0, video.currentTime - 10);
    });

    // Skip forward 10 seconds
    skipForwardBtn.addEventListener('click', function() {
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
    });

    // Update progress bar as video plays
    video.addEventListener('timeupdate', function() {
        const percentage = (video.currentTime / video.duration) * 100;
        progressFill.style.width = percentage + '%';
        progressHandle.style.left = percentage + '%';
    });

    // Click on progress bar to seek
    progressBar.addEventListener('click', function(e) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    });

    // Drag progress handle
    let isDragging = false;
    progressHandle.addEventListener('mousedown', function() {
        isDragging = true;
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const rect = progressBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        video.currentTime = percent * video.duration;
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Volume control - FIX FOR BUG
    const muteBtn = document.getElementById('muteBtn');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function(e) {
            const volumeValue = parseFloat(e.target.value) / 100;
            video.volume = Math.max(0, Math.min(1, volumeValue));
            video.muted = false;
            if (muteBtn) {
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
            console.log('Volume set to:', video.volume);
        });
        
        // Initialize volume - UNMUTED after autoplay starts
        setTimeout(() => {
            video.muted = false;
            video.volume = 0.3;
            volumeSlider.value = 30;
            if (muteBtn) {
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
            console.log('Video autoplay started with volume: 30%');
        }, 1000);
    }

    // Mute/Unmute button functionality
    if (muteBtn) {
        muteBtn.addEventListener('click', function() {
            if (video.muted) {
                video.muted = false;
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                console.log('Video unmuted');
            } else {
                video.muted = true;
                muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                console.log('Video muted');
            }
        });
    }

    // Closed Captions toggle
    ccBtn.addEventListener('click', function() {
        const tracks = video.querySelectorAll('track');
        tracks.forEach(track => {
            if (track.kind === 'captions') {
                track.track.mode = track.track.mode === 'showing' ? 'hidden' : 'showing';
            }
        });
        ccBtn.style.opacity = tracks[0]?.track.mode === 'showing' ? '1' : '0.5';
    });

    // Fullscreen toggle
    fullscreenBtn.addEventListener('click', function() {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        }
    });

    // Update play/pause button based on video state
    video.addEventListener('play', function() {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });

    video.addEventListener('pause', function() {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    // ===== LOVE SYMBOL ANIMATIONS =====
    
    // Add romantic floating animation to all love symbols
    const symbols = document.querySelectorAll('.symbol, .decoration-line');
    symbols.forEach((symbol, index) => {
        symbol.style.animationDelay = (index * 0.1) + 's';
    });

    // Add gentle pulse to heart ornaments
    const hearts = document.querySelectorAll('.hero-ornament i, .about-hearts i');
    hearts.forEach((heart) => {
        heart.style.animation = 'heartbeat 1s ease-in-out infinite';
    });

    // Animate frame symbols on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'cardPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
            }
        });
    });

    document.querySelectorAll('.heart-frame-card').forEach(card => {
        observer.observe(card);
    });

    // ===== NATURE BACKGROUND LEAF ANIMATION =====
    
    // Create multiple floating leaves
    const leafContainer = document.querySelector('.floating-leaves');
    if (leafContainer) {
        for (let i = 0; i < 8; i++) {
            const leaf = document.createElement('span');
            leaf.textContent = '🍃';
            leaf.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 2 + 1}em;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.4 + 0.3};
                animation: float-down ${Math.random() * 4 + 6}s linear infinite;
                animation-delay: ${i * 1}s;
                pointer-events: none;
            `;
            leafContainer.appendChild(leaf);
        }
    }

    // ===== RESPONSIVE VIDEO CONTROLS =====
    
    // Ensure progress bar is always clickable on mobile
    if (window.innerWidth <= 768) {
        video.addEventListener('play', function() {
            document.querySelector('.video-controls').style.opacity = '1';
        });
    }
});

// Update progress bar on video load
document.addEventListener('loadedmetadata', function() {
    const video = document.getElementById('loveVideo');
    if (video && video.duration) {
        console.log('Video duration: ' + video.duration);
    }
});
