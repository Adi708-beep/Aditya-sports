/* ==========================================================================
   ADITYA'S STREAM - INTERACTIVE FUNCTIONALITY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Sticky Header & Active Scroll State
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 180)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 2. Mobile Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // 3. Fullscreen Button Toggle
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                updateFullscreenButton(true);
            }).catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen().then(() => {
                updateFullscreenButton(false);
            });
        }
    });

    // Handle ESC or native fullscreen changes
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            updateFullscreenButton(true);
        } else {
            updateFullscreenButton(false);
        }
    });

    function updateFullscreenButton(isFullscreen) {
        const span = fullscreenBtn.querySelector('span');
        const svg = fullscreenBtn.querySelector('svg');
        if (isFullscreen) {
            span.textContent = 'Exit Full';
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3 3m12 6V4.5M15 9h4.5M15 9l6-6m-6 12v4.5M15 15h4.5M15 15l6 6m-12-6v4.5M9 15H4.5M9 15l-6 6" />';
        } else {
            span.textContent = 'Fullscreen';
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />';
        }
    }

    // 4. Simulated Iframe Skeleton Loader
    const playerSkeleton = document.getElementById('player-skeleton');
    const iframe = document.getElementById('player');

    // Hide loader once iframe completes loading or after safety duration
    if (iframe) {
        iframe.addEventListener('load', () => {
            setTimeout(() => {
                playerSkeleton.classList.add('fade-out');
            }, 600);
        });
        // Safety timeout (1.5 seconds) in case load event doesn't fire due to sandbox settings
        setTimeout(() => {
            playerSkeleton.classList.add('fade-out');
        }, 1500);
    }

    // 5. Dynamic Local Clock and Calendar
    const clockEl = document.getElementById('dynamic-clock');
    const dateEl = document.getElementById('dynamic-date');
    const copyrightYear = document.getElementById('copyright-year');

    function updateClock() {
        const now = new Date();
        
        // Time
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        clockEl.textContent = `${hours}:${minutes}:${seconds}`;

        // Date
        const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        dateEl.textContent = `${month} ${day}, ${year}`;
        
        // Copyright year
        if (copyrightYear) {
            copyrightYear.textContent = year;
        }
    }
    setInterval(updateClock, 1000);
    updateClock(); // Initial run

    // 6. Match Countdown Timer (Argentina vs France - Tomorrow 18:00)
    // Setup target date (June 24, 2026 at 18:00:00)
    const targetDate = new Date('2026-06-24T18:00:00+05:30').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // If the time has passed, show next day relative
            document.getElementById('countdown-hours').textContent = "00";
            document.getElementById('countdown-mins').textContent = "00";
            document.getElementById('countdown-secs').textContent = "00";
            return;
        }

        const hours = Math.floor((distance / (1000 * 60 * 60)));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('countdown-hours').textContent = hours < 10 ? '0' + hours : hours;
        document.getElementById('countdown-mins').textContent = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('countdown-secs').textContent = seconds < 10 ? '0' + seconds : seconds;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 7. Live Match Scoreboard & Game Timer Simulator
    const matchTimerEl = document.getElementById('match-live-timer');
    let gameMinutes = 78;
    let gameSeconds = 42;

    function runMatchClock() {
        gameSeconds++;
        if (gameSeconds >= 60) {
            gameSeconds = 0;
            gameMinutes++;
        }
        
        // Stop timer at 90:00 + injury time simulation
        if (gameMinutes >= 94) {
            matchTimerEl.textContent = "90:00 +4' FT";
            return;
        }

        const displayMins = gameMinutes < 10 ? '0' + gameMinutes : gameMinutes;
        const displaySecs = gameSeconds < 10 ? '0' + gameSeconds : gameSeconds;
        
        if (gameMinutes >= 90) {
            matchTimerEl.textContent = `90:00 +${gameMinutes - 90}'`;
        } else {
            matchTimerEl.textContent = `${displayMins}:${displaySecs}`;
        }
    }
    setInterval(runMatchClock, 1000);

    // 8. Numerical Stats Count-up & Team Progress Bar Animation
    const counterNums = document.querySelectorAll('.counter-num');
    const progressBars = document.querySelectorAll('.bar-fill');

    const statObserverOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                
                // Animate progress bars in this card
                const bars = card.querySelectorAll('.bar-fill');
                bars.forEach(bar => {
                    const widthStyle = bar.style.width;
                    bar.style.width = '0%';
                    // Force a reflow
                    bar.offsetHeight;
                    bar.style.transition = 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    bar.style.width = widthStyle;
                });

                // Animate numbers in this card
                const counters = card.querySelectorAll('.counter-num');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 1500; // 1.5 seconds
                    const startTime = performance.now();

                    function count(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Ease out cubic
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        const currentVal = Math.floor(easeProgress * target);
                        
                        counter.textContent = currentVal;
                        
                        if (progress < 1) {
                            requestAnimationFrame(count);
                        } else {
                            counter.textContent = target;
                        }
                    }
                    requestAnimationFrame(count);
                });

                // Unobserve card since animations are complete
                observer.unobserve(card);
            }
        });
    }, statObserverOptions);

    // Observe each team card separately to trigger their stats
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        statObserver.observe(card);
    });

    // 9. Particle / Floating SVG Soccer Ball Generator
    const particleContainer = document.getElementById('particle-container');
    const ballSVG = `
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" class="floating-ball-svg">
            <circle cx="50" cy="50" r="48"/>
            <polygon points="50,22 69,35 62,58 38,58 31,35" fill="none"/>
            <line x1="50" y1="22" x2="50" y2="2"/>
            <line x1="69" y1="35" x2="88" y2="28"/>
            <line x1="62" y1="58" x2="77" y2="72"/>
            <line x1="38" y1="58" x2="23" y2="72"/>
            <line x1="31" y1="35" x2="12" y2="28"/>
            <path d="M50,2 L70,8 L88,28 M88,28 L82,48 L77,72 M77,72 L50,88 L23,72 M23,72 L18,48 L12,28 M12,28 L30,8 L50,2"/>
        </svg>
    `;

    function createParticles() {
        const numParticles = 8;
        for (let i = 0; i < numParticles; i++) {
            const ball = document.createElement('div');
            ball.className = 'floating-ball';
            ball.innerHTML = ballSVG;
            
            // Randomized positioning & sizing
            const size = Math.random() * 80 + 40; // 40px to 120px
            ball.style.width = `${size}px`;
            ball.style.height = `${size}px`;
            ball.style.left = `${Math.random() * 100}%`;
            ball.style.top = `${Math.random() * 80 + 10}%`;
            
            // Randomized timings
            const duration = Math.random() * 20 + 20; // 20s to 40s
            const delay = Math.random() * -20; // Start immediately in mid-animation
            ball.style.animationDuration = `${duration}s`;
            ball.style.animationDelay = `${delay}s`;
            
            particleContainer.appendChild(ball);
        }
    }
    createParticles();

    // 10. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.section-reveal');

    const revealObserverOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 11. Back to Top Button Behavior
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
