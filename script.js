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

    // Robust autoplay + resume logic
    // - video.loop ensures continuous restart
    // - userPaused tracks explicit user pause to avoid auto-resume
    // - try muted autoplay fallback, then unmute after success
    let userPaused = false;
    video.loop = true;

    // If play button toggles playback, mark user intent
    playPauseBtn.addEventListener('click', function() {
        if (video.paused) {
            userPaused = false; // user chose to play
            video.play().catch(err => console.log('Play failed:', err));
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            userPaused = true; // user chose to pause
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // If the video ends (backup) try to restart immediately
    video.addEventListener('ended', function() {
        if (!userPaused) {
            this.currentTime = 0;
            this.play().catch(e => console.log('Restart prevented:', e));
        }
    }, false);

    // If video is paused for any reason and not by the user, resume it
    video.addEventListener('pause', function() {
        if (!userPaused) {
            // tiny delay to avoid race conditions
            setTimeout(() => {
                if (video.paused) {
                    video.play().catch(err => console.log('Auto-resume prevented:', err));
                }
            }, 150);
        }
    });

    // Try to start playback on load (muted first for autoplay policies)
    (function tryAutoplay() {
        // ensure muted for autoplay compatibility
        const tryPlay = () => {
            video.muted = true;
            video.play().then(() => {
                // Unmute after short delay so browsers accept autoplay
                setTimeout(() => {
                    video.muted = false;
                    if (volumeSlider) {
                        video.volume = 0.3;
                        volumeSlider.value = 30;
                    }
                }, 800);
            }).catch(err => {
                console.log('Autoplay prevented:', err);
                // keep muted and retry on interaction
            });
        };
        tryPlay();
        // also attempt again when user interacts with page
        ['click', 'touchstart', 'keydown'].forEach(ev => {
            const once = function() {
                tryPlay();
                window.removeEventListener(ev, once);
            };
            window.addEventListener(ev, once);
        });
    })();

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

    // Resume handlers: ensure video keeps playing unless user explicitly paused
    // Resume when tab becomes visible
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible' && !userPaused) {
            video.play().catch(err => console.log('Visibility resume prevented:', err));
        }
    });

    // Try to recover from buffering/stall states
    ['waiting', 'stalled', 'suspend'].forEach(evt => {
        video.addEventListener(evt, function() {
            if (!userPaused) {
                video.play().catch(err => console.log(evt + ' resume prevented:', err));
            }
        });
    });

    // Periodic guard: if playback stopped unintentionally, try to restart
    const resumeGuard = setInterval(() => {
        if (!video.paused && !video.ended) return; // already playing or ended
        if (!userPaused) {
            video.play().catch(() => {/* ignore */});
        }
    }, 1000);

    // Clear guard when page unloads
    window.addEventListener('beforeunload', () => clearInterval(resumeGuard));
});

// Update progress bar on video load
document.addEventListener('loadedmetadata', function() {
    const video = document.getElementById('loveVideo');
    if (video && video.duration) {
        console.log('Video duration: ' + video.duration);
    }
});

const video = document.getElementById("loveVideo");
const muteBtn = document.getElementById("muteBtn");
const volumeSlider = document.getElementById("volumeSlider");
const muteIcon = muteBtn.querySelector("i");

/* Ensure autoplay */
window.addEventListener("load", () => {
    video.muted = true;
    video.volume = 0.3;
    video.play();
});

/* Mute / Unmute */
muteBtn.addEventListener("click", () => {
    if (video.muted) {
        video.muted = false;
        video.volume = volumeSlider.value / 100;
        muteIcon.classList.remove("fa-volume-mute");
        muteIcon.classList.add("fa-volume-up");
    } else {
        video.muted = true;
        muteIcon.classList.remove("fa-volume-up");
        muteIcon.classList.add("fa-volume-mute");
    }
});

/* Volume slider control */
volumeSlider.addEventListener("input", () => {
    video.volume = volumeSlider.value / 100;
    video.muted = volumeSlider.value == 0;
});

