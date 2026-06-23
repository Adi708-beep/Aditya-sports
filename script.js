/* ==========================================================================
   ADITYA'S STREAM PRO - INTERACTIVE FUNCTIONALITY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Channel Database
    const channels = [
        { id: 'portugal-uzbekistan', name: "Portugal vs Uzbekistan - Live Match", category: "sports", url: "https://dami-tv.pro/embed/?id=wc%2F2026-06-23%2Fpor-uzb", views: "142K", logo: "⚽", ph: "WC" },
        { id: 'discovery-usa', name: "Discovery USA", category: "documentary", url: "https://dami-tv.pro/embed/channel/?id=espn-usa", views: "45K", logo: "🌏", ph: "DSC" },
        { id: 'animal-planet', name: "Animal Planet USA", category: "wildlife", url: "https://dami-tv.pro/embed/channel/?id=animal-planet", views: "38K", logo: "🦁", ph: "APL" },
        { id: 'hbo-usa', name: "HBO USA", category: "movies", url: "https://dami-tv.pro/embed/channel/?id=hbo-usa", views: "120K", logo: "🎬", ph: "HBO" },
        { id: 'mtv-usa', name: "MTV USA", category: "music", url: "https://dami-tv.pro/embed/channel/?id=mtv-usa", views: "29K", logo: "🎵", ph: "MTV" },
        { id: 'fox-usa', name: "FOX USA", category: "movies", url: "https://dami-tv.pro/embed/channel/?id=fox-usa", views: "85K", logo: "FOX" }
    ];

    // Local Storage state management keys
    const STORAGE_FAV_KEY = "adityastream_favorites";
    const STORAGE_RECENT_KEY = "adityastream_recent";
    const STORAGE_LAST_WATCHED_KEY = "adityastream_lastwatched";

    let favorites = JSON.parse(localStorage.getItem(STORAGE_FAV_KEY)) || [];
    let recentChannels = JSON.parse(localStorage.getItem(STORAGE_RECENT_KEY)) || [];

    // Elements cache
    const playerIframe = document.getElementById('player');
    const playerSkeleton = document.getElementById('player-skeleton');
    const nowPlayingTitle = document.getElementById('now-playing-title');
    const playerStreamCategory = document.getElementById('player-stream-category');
    const sportsScoreboard = document.getElementById('sports-scoreboard');
    const scoreboardFooter = document.getElementById('scoreboard-footer-details');
    const adShieldToggle = document.getElementById('ad-shield-toggle');
    const heartFavoritesBtn = document.getElementById('favorites-tab-btn');

    // 2. Global Sticky Header Scroll
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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

    // 3. Navigation Controls (Hamburger Menu)
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close on clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Mobile channels toggle
    const channelsMenuBtn = document.getElementById('channels-menu-btn');
    const megaMenu = document.getElementById('mega-menu');
    if (channelsMenuBtn && megaMenu) {
        channelsMenuBtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 1200) {
                e.preventDefault();
                megaMenu.classList.toggle('active');
            }
        });
    }

    // 4. Header Clock and Local Calendar
    const clockEl = document.getElementById('header-clock');
    const clockHeroEl = document.getElementById('dynamic-clock');
    const dateHeroEl = document.getElementById('dynamic-date');
    const copyrightYear = document.getElementById('copyright-year');

    function updateClock() {
        const now = new Date();
        
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        const timeStr = `${hours}:${minutes}:${seconds}`;

        if (clockEl) clockEl.textContent = timeStr;
        if (clockHeroEl) clockHeroEl.textContent = timeStr;

        const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        if (dateHeroEl) dateHeroEl.textContent = `${month} ${day}, ${year}`;
        if (copyrightYear) copyrightYear.textContent = year;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 5. Header Search Trigger
    const searchTriggerBtn = document.getElementById('search-trigger-btn');
    const headerSearchWrap = document.getElementById('header-search-wrap');
    const headerSearchInput = document.getElementById('header-search-input');
    
    if (searchTriggerBtn && headerSearchWrap) {
        searchTriggerBtn.addEventListener('click', () => {
            headerSearchWrap.classList.toggle('active');
            if (headerSearchWrap.classList.contains('active')) {
                headerSearchInput.focus();
            }
        });

        // Search trigger on keypress
        headerSearchInput.addEventListener('input', () => {
            const query = headerSearchInput.value.trim();
            const mainSearch = document.getElementById('channel-search');
            if (mainSearch) {
                mainSearch.value = query;
                // Scroll to live-tv section
                document.getElementById('live-tv').scrollIntoView({ behavior: 'smooth' });
                // Trigger filter search
                handleChannelFiltering();
            }
        });
    }

    // 6. Theater Mode & Fullscreen API
    const mainPlayerWrapper = document.getElementById('main-player-wrapper');
    const theaterBtn = document.getElementById('theater-btn');
    const fullscreenBtnPlayer = document.getElementById('fullscreen-btn-player');
    const playerContainerFull = document.getElementById('player-container-full');

    if (theaterBtn) {
        theaterBtn.addEventListener('click', () => {
            mainPlayerWrapper.classList.toggle('theater-active');
            const span = theaterBtn.querySelector('span');
            if (mainPlayerWrapper.classList.contains('theater-active')) {
                span.textContent = 'Default Mode';
            } else {
                span.textContent = 'Theater Mode';
            }
        });
    }

    if (fullscreenBtnPlayer && playerContainerFull) {
        fullscreenBtnPlayer.addEventListener('click', () => {
            // Apply fullscreen to player container (retains low opacity watermark overlay)
            if (!document.fullscreenElement) {
                playerContainerFull.requestFullscreen().then(() => {
                    fullscreenBtnPlayer.querySelector('span').textContent = 'Exit Screen';
                }).catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else {
                document.exitFullscreen().then(() => {
                    fullscreenBtnPlayer.querySelector('span').textContent = 'Fullscreen';
                });
            }
        });

        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                fullscreenBtnPlayer.querySelector('span').textContent = 'Fullscreen';
            }
        });
    }

    // Header fullscreen button fallback
    const globalFullscreenBtn = document.getElementById('fullscreen-btn');
    if (globalFullscreenBtn) {
        globalFullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Error: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }

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
        
        if (gameMinutes >= 94) {
            if (matchTimerEl) matchTimerEl.textContent = "90:00 +4' FT";
            return;
        }

        const displayMins = gameMinutes < 10 ? '0' + gameMinutes : gameMinutes;
        const displaySecs = gameSeconds < 10 ? '0' + gameSeconds : gameSeconds;
        
        if (matchTimerEl) {
            if (gameMinutes >= 90) {
                matchTimerEl.textContent = `90:00 +${gameMinutes - 90}'`;
            } else {
                matchTimerEl.textContent = `${displayMins}:${displaySecs}`;
            }
        }
    }
    setInterval(runMatchClock, 1000);

    // 8. World Cup Countdown Timer (Argentina vs France)
    const targetDate = new Date('2026-06-24T18:00:00+05:30').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById('countdown-hours').textContent = "00";
            document.getElementById('countdown-mins').textContent = "00";
            document.getElementById('countdown-secs').textContent = "00";
            return;
        }

        const hours = Math.floor((distance / (1000 * 60 * 60)));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const hrsEl = document.getElementById('countdown-hours');
        const minsEl = document.getElementById('countdown-mins');
        const secsEl = document.getElementById('countdown-secs');

        if (hrsEl) hrsEl.textContent = hours < 10 ? '0' + hours : hours;
        if (minsEl) minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        if (secsEl) secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 9. Floating Background SVGs generator
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
        if (!particleContainer) return;
        const numParticles = 8;
        for (let i = 0; i < numParticles; i++) {
            const ball = document.createElement('div');
            ball.className = 'floating-ball';
            ball.innerHTML = ballSVG;
            const size = Math.random() * 80 + 40; 
            ball.style.width = `${size}px`;
            ball.style.height = `${size}px`;
            ball.style.left = `${Math.random() * 100}%`;
            ball.style.top = `${Math.random() * 80 + 10}%`;
            ball.style.animationDuration = `${Math.random() * 20 + 20}s`;
            ball.style.animationDelay = `${Math.random() * -20}s`;
            particleContainer.appendChild(ball);
        }
    }
    createParticles();

    // 10. Scroll Reveals & Stats Animators
    const revealElements = document.querySelectorAll('.section-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -100px 0px" });

    revealElements.forEach(element => revealObserver.observe(element));

    // Stats counter animation
    const teamCards = document.querySelectorAll('.team-card');
    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                
                // Animate bars
                const bars = card.querySelectorAll('.bar-fill');
                bars.forEach(bar => {
                    const w = bar.style.width;
                    bar.style.width = '0%';
                    bar.offsetHeight; // reflow
                    bar.style.transition = 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    bar.style.width = w;
                });

                // Animate text counters
                const counters = card.querySelectorAll('.counter-num');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 1500;
                    const start = performance.now();

                    function count(time) {
                        const elapsed = time - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.floor(ease * target);
                        if (progress < 1) requestAnimationFrame(count);
                        else counter.textContent = target;
                    }
                    requestAnimationFrame(count);
                });
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    teamCards.forEach(card => statObserver.observe(card));

    // 11. Built-in Ad Blocker (Ad-Shield) Click Handlers
    let isAdShieldActive = true;

    if (adShieldToggle && playerIframe) {
        adShieldToggle.addEventListener('click', () => {
            isAdShieldActive = !isAdShieldActive;
            const span = adShieldToggle.querySelector('span');
            
            // Temporary clear for refresh
            const src = playerIframe.src;
            playerIframe.src = '';

            if (isAdShieldActive) {
                adShieldToggle.classList.remove('inactive');
                span.textContent = 'AD-SHIELD: ACTIVE';
                playerIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
                adShieldToggle.setAttribute('title', 'Disable Built-in Ad Blocker');
            } else {
                adShieldToggle.classList.add('inactive');
                span.textContent = 'AD-SHIELD: OFF';
                playerIframe.removeAttribute('sandbox');
                adShieldToggle.setAttribute('title', 'Enable Built-in Ad Blocker');
            }

            // Reload iframe
            setTimeout(() => {
                playerIframe.src = src;
                if (playerSkeleton) {
                    playerSkeleton.classList.remove('fade-out');
                    setTimeout(() => playerSkeleton.classList.add('fade-out'), 1000);
                }
            }, 100);
        });
    }

    // 12. Instant Channel Switching Engine
    window.switchChannel = function(channelId) {
        const channel = channels.find(c => c.id === channelId);
        if (!channel || !playerIframe) return;

        // Save last watched state
        localStorage.setItem(STORAGE_LAST_WATCHED_KEY, channelId);

        // Highlight scoreboard if sports channel, hide otherwise
        if (channel.category === 'sports') {
            if (sportsScoreboard) sportsScoreboard.style.display = 'flex';
        } else {
            if (sportsScoreboard) sportsScoreboard.style.display = 'none';
        }

        // Scroll to player section smoothly
        document.getElementById('live-section').scrollIntoView({ behavior: 'smooth' });

        // Show buffer skeleton
        if (playerSkeleton) {
            playerSkeleton.classList.remove('fade-out');
        }

        // Set metadata
        if (nowPlayingTitle) nowPlayingTitle.textContent = `NOW PLAYING: ${channel.name}`;
        if (playerStreamCategory) playerStreamCategory.textContent = `${channel.category.toUpperCase()} &bull; GLOBAL BROADCAST`;

        // Switch source and apply sandbox
        playerIframe.src = '';
        setTimeout(() => {
            // Reapply sandbox security based on current ad shield toggle state
            if (isAdShieldActive) {
                playerIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
            } else {
                playerIframe.removeAttribute('sandbox');
            }
            playerIframe.src = channel.url;

            // Manage recent history tracking
            recentChannels = recentChannels.filter(id => id !== channelId);
            recentChannels.unshift(channelId);
            if (recentChannels.length > 5) recentChannels.pop(); // Keep last 5
            localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(recentChannels));

            // Hide buffer loader
            setTimeout(() => {
                if (playerSkeleton) playerSkeleton.classList.add('fade-out');
            }, 1000);
        }, 150);

        // Update active class on channels grid cards
        document.querySelectorAll('.channel-card').forEach(card => {
            card.classList.remove('active');
            if (card.getAttribute('onclick') && card.getAttribute('onclick').includes(channelId)) {
                card.classList.add('active');
            }
        });
    };

    // 13. Channel Search & Tabs Filtering Engine
    const searchInput = document.getElementById('channel-search');
    const filterTabs = document.querySelectorAll('.filter-tab-btn');
    const netflixRows = document.getElementById('netflix-rows-container');
    const filterGrid = document.getElementById('filtered-results-grid');

    let currentFilter = 'all';
    let searchQuery = '';

    function handleChannelFiltering() {
        searchQuery = searchInput.value.toLowerCase().trim();

        // If no filter and no search query, show row format
        if (currentFilter === 'all' && searchQuery === '') {
            netflixRows.classList.remove('hidden');
            filterGrid.classList.add('hidden');
            return;
        }

        // Otherwise, show single grid list format
        netflixRows.classList.add('hidden');
        filterGrid.classList.remove('hidden');

        // Apply filters
        let filtered = channels;
        
        if (currentFilter !== 'all') {
            if (currentFilter === 'favorites') {
                filtered = channels.filter(c => favorites.includes(c.id));
            } else {
                filtered = channels.filter(c => c.category === currentFilter);
            }
        }

        if (searchQuery !== '') {
            filtered = filtered.filter(c => c.name.toLowerCase().includes(searchQuery));
        }

        renderFilteredChannels(filtered);
    }

    function renderFilteredChannels(channelList) {
        if (!filterGrid) return;
        filterGrid.innerHTML = '';

        if (channelList.length === 0) {
            filterGrid.innerHTML = `
                <div class="no-results-ph" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <p style="font-size: 16px;">No channels found matching the parameters.</p>
                </div>
            `;
            return;
        }

        channelList.forEach(c => {
            const isFav = favorites.includes(c.id) ? 'active' : '';
            const card = document.createElement('div');
            card.className = 'channel-card glass-card';
            card.innerHTML = `
                <div class="channel-logo-wrapper" onclick="switchChannel('${c.id}')">
                    <span class="channel-logo-text-ph">${c.ph}</span>
                    <span class="live-indicator-tag">LIVE</span>
                    <div class="card-hover-overlay">
                        <div class="card-play-circle">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="play-svg"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                </div>
                <div class="channel-card-body">
                    <div class="channel-meta-info">
                        <span class="channel-tag">${c.category}</span>
                        <span class="views-counter">${c.views} Viewers</span>
                    </div>
                    <div class="channel-card-title" onclick="switchChannel('${c.id}')">
                        <h4>${c.name}</h4>
                    </div>
                    <div class="channel-card-footer">
                        <button class="fav-btn ${isFav}" data-channel-id="${c.id}" onclick="toggleFavorite(event, '${c.id}')">
                            <svg class="heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </button>
                        <span class="open-channel-btn-text" onclick="switchChannel('${c.id}')">Watch Channel</span>
                    </div>
                </div>
            `;
            filterGrid.appendChild(card);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', handleChannelFiltering);
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.getAttribute('data-filter');
            handleChannelFiltering();
        });
    });

    // 14. Local Storage Favorites Toggle
    window.toggleFavorite = function(e, channelId) {
        e.stopPropagation(); // Avoid triggering card click
        const btn = e.currentTarget;

        const index = favorites.indexOf(channelId);
        if (index > -1) {
            favorites.splice(index, 1);
            btn.classList.remove('active');
        } else {
            favorites.push(channelId);
            btn.classList.add('active');
        }

        // Save state
        localStorage.setItem(STORAGE_FAV_KEY, JSON.stringify(favorites));
        
        // Update favorites count and labels
        updateFavoritesStats();
        
        // If favorites filter is open, re-render
        if (currentFilter === 'favorites') {
            handleChannelFiltering();
        }
    };

    function updateFavoritesStats() {
        if (heartFavoritesBtn) {
            heartFavoritesBtn.textContent = `Favorites (${favorites.length})`;
        }
        // Update heart icons on cards inside scrollable tracks
        document.querySelectorAll('.fav-btn').forEach(btn => {
            const cId = btn.getAttribute('data-channel-id');
            if (favorites.includes(cId)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    updateFavoritesStats(); // Initial check

    // 15. Initial State Load (Continue Watching / Last Watched)
    const lastWatched = localStorage.getItem(STORAGE_LAST_WATCHED_KEY);
    if (lastWatched && channels.some(c => c.id === lastWatched)) {
        // Automatically switch to last watched channel on load
        switchChannel(lastWatched);
    } else {
        // Load default World Cup stream
        switchChannel('portugal-uzbekistan');
    }

    // 16. Back to Top Tracking
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
