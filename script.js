document.addEventListener('DOMContentLoaded', () => {
    // Sound effects
    const sounds = {
        heartbeat: new Audio('sounds/heartbeat_fast_0.wav')
    };

    // Key Jiggle sound for neural gate
    const keyJiggleSound = new Audio('sounds/Key Jiggle.wav');
    keyJiggleSound.volume = 0.5;

    // Preload sounds and attempt to play them to bypass autoplay restrictions
    function initializeSounds() {
        Object.values(sounds).forEach(sound => {
            sound.volume = 0.3;
            
            // Attempt to play and immediately pause each sound
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
            }).catch(error => {
                console.log('Autoplay prevented:', error);
            });
        });
    }

    // Call sound initialization
    initializeSounds();

    // Add key jiggle sound for neural gate
    const neuralGate = document.querySelector('.neural-gate-wrapper');
    if (neuralGate) {
        neuralGate.addEventListener('click', () => {
            // Play sound once
            keyJiggleSound.currentTime = 0;
            keyJiggleSound.play().catch(error => {
                console.log('Neural gate click sound error:', error);
            });
        });
    } else {
        console.error('Neural gate wrapper not found!');
    }

    // Background Heartbeat Sound
    function setupHeartbeatSound() {
        sounds.heartbeat.loop = true;
        sounds.heartbeat.volume = 0.2; // Slightly lower volume

        // Add play/pause controls
        const toggleHeartbeat = document.createElement('button');
        toggleHeartbeat.innerHTML = ' Toggle Heartbeat';
        toggleHeartbeat.style.position = 'fixed';
        toggleHeartbeat.style.bottom = '20px';
        toggleHeartbeat.style.right = '20px';
        toggleHeartbeat.style.zIndex = '1000';
        toggleHeartbeat.style.backgroundColor = 'rgba(0,255,255,0.2)';
        toggleHeartbeat.style.color = 'cyan';
        toggleHeartbeat.style.border = '2px solid cyan';
        toggleHeartbeat.style.borderRadius = '5px';
        toggleHeartbeat.style.padding = '10px';
        toggleHeartbeat.style.cursor = 'pointer';

        let isHeartbeatPlaying = false;

        toggleHeartbeat.addEventListener('click', () => {
            if (isHeartbeatPlaying) {
                sounds.heartbeat.pause();
                sounds.heartbeat.currentTime = 0;
                toggleHeartbeat.style.backgroundColor = 'rgba(0,255,255,0.2)';
                toggleHeartbeat.style.color = 'cyan';
            } else {
                sounds.heartbeat.play();
                toggleHeartbeat.style.backgroundColor = 'rgba(255,0,102,0.2)';
                toggleHeartbeat.style.color = 'magenta';
            }
            isHeartbeatPlaying = !isHeartbeatPlaying;
        });

        // Automatically start heartbeat when page loads
        sounds.heartbeat.play().catch(error => {
            console.log('Heartbeat sound play error:', error);
        });
        isHeartbeatPlaying = true;

        document.body.appendChild(toggleHeartbeat);
    }

    // Birth year input sound
    const birthYearInput = document.getElementById('birth-year');
    birthYearInput.addEventListener('focus', () => {
        console.log('Birth year input focused');
    });

    const ageCheckForm = document.getElementById('age-check');
    const ageQuiz = document.getElementById('age-quiz');
    const verifyBtn = document.getElementById('verify-btn');
    const errorMessage = document.getElementById('error-message');

    ageCheckForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const birthYear = parseInt(birthYearInput.value);

        // Future-proof age calculation
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-indexed
        const currentDay = currentDate.getDate();

        // Calculate age considering month and day
        let age = currentYear - birthYear;
        
        // Adjust age if birthday hasn't occurred this year
        const birthMonth = 1; // Default to January if month not specified
        const birthDay = 1;   // Default to 1st if day not specified
        
        if (currentMonth < birthMonth || 
            (currentMonth === birthMonth && currentDay < birthDay)) {
            age--;
        }

        // Reset previous error states
        errorMessage.style.display = 'none';
        birthYearInput.classList.remove('error');

        // Validate birth year
        if (isNaN(birthYear) || birthYear < 1900 || birthYear > currentYear) {
            errorMessage.textContent = 'Please enter a valid birth year.';
            errorMessage.style.display = 'block';
            birthYearInput.classList.add('error');
            return;
        }

        if (age < 18) {
            // Redirect to poem page before YouTube Kids
            window.location.href = 'childexit.html';
            return;
        }

        // If age is 18+, show quiz
        if (!ageQuiz.style.display || ageQuiz.style.display === 'none') {
            ageQuiz.style.display = 'block';
            birthYearInput.disabled = true;
            verifyBtn.textContent = 'Submit Quiz';
            return;
        }

        // Check quiz answers
        const quizQ1 = document.querySelector('input[name="quiz-q1"]:checked');

        if (!quizQ1) {
            errorMessage.textContent = 'Please answer the quiz question';
            errorMessage.style.color = '#ff0066';
            return;
        }

        // Verify quiz answers
        if (quizQ1.value !== 'rome') {
            errorMessage.textContent = 'Incorrect quiz answer. Access denied.';
            errorMessage.style.color = '#ff0066';
            return;
        }

        // Successful authentication
        errorMessage.textContent = 'Verification Successful';
        errorMessage.style.color = '#00ffff';

        // Redirect to cyborg realm after a short delay
        setTimeout(() => {
            window.location.href = 'cyborgrealm.html';
        }, 1500);
    });

    // Prevent non-numeric input
    birthYearInput.addEventListener('input', (e) => {
        // Remove any non-digit characters
        e.target.value = e.target.value.replace(/[^\d]/g, '');
        
        // Limit to 4 digits
        if (e.target.value.length > 4) {
            e.target.value = e.target.value.slice(0, 4);
        }
    });

    // Heartbeat sound as background
    const heartbeatSound = new Audio('sounds/heartbeat_fast_0.wav');
    
    // Adjust playback rate to be faster
    heartbeatSound.playbackRate = 0.75; // Less slow, closer to original speed
    
    heartbeatSound.loop = true;
    heartbeatSound.volume = 0.3; // Slightly lower volume

    // Attempt to play sound immediately
    const playPromise = heartbeatSound.play();

    // Handle potential autoplay restrictions
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('Heartbeat sound started successfully');
        }).catch(error => {
            console.log('Autoplay prevented:', error);
            // Fallback: add one-time click listener
            const startSound = () => {
                heartbeatSound.play().catch(console.error);
                document.removeEventListener('click', startSound);
            };
            document.addEventListener('click', startSound);
        });
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        heartbeatSound.pause();
        heartbeatSound.currentTime = 0;
    });
});
