/**
 * RoyalERP Landing Page JavaScript
 * WASender-style animations and interactions
 */

(function () {
    'use strict';

    // ==================== DOM ELEMENTS ====================
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const socialIcons = document.getElementById('social-icons');

    // ==================== NAVBAR SCROLL EFFECT ====================
    function initNavbarScroll() {
        if (!navbar) {
            console.warn('Navbar element not found!');
            return;
        }

        const scrollThreshold = 50;
        const heroSection = document.getElementById('hero');
        const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

        // Ensure navbar is always visible and on top with maximum z-index
        navbar.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 2147483647 !important;
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
        `;

        // Ensure scroll indicator and social icons are visible initially
        if (scrollIndicator) {
            scrollIndicator.style.display = 'flex';
            scrollIndicator.style.visibility = 'visible';
            scrollIndicator.style.opacity = '1';
        }
        if (socialIcons) {
            socialIcons.style.display = 'flex';
            socialIcons.style.visibility = 'visible';
            socialIcons.style.opacity = '1';
        }

        // Initial check on page load
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled', 'navbar-scrolled');
            navbar.style.background = 'linear-gradient(135deg, #1e3a5f 0%, #6366f1 100%)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        }

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            // Ensure navbar stays visible with maximum z-index
            navbar.style.zIndex = '2147483647';
            navbar.style.visibility = 'visible';
            navbar.style.opacity = '1';
            navbar.style.position = 'fixed';

            // Add/remove scrolled class and inline styles for reliability
            if (currentScroll > scrollThreshold) {
                navbar.classList.add('scrolled', 'navbar-scrolled');
                navbar.style.background = 'linear-gradient(135deg, #1e3a5f 0%, #6366f1 100%)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.classList.remove('scrolled', 'navbar-scrolled');
                navbar.style.background = 'transparent';
                navbar.style.boxShadow = 'none';
            }

            // Hide scroll indicator and social icons after hero section
            // They should only show in hero/home section
            const hideThreshold = heroHeight - 100;

            if (scrollIndicator) {
                if (currentScroll > hideThreshold) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                } else {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.pointerEvents = 'auto';
                }
            }

            if (socialIcons) {
                if (currentScroll > hideThreshold) {
                    socialIcons.style.opacity = '0';
                    socialIcons.style.pointerEvents = 'none';
                } else {
                    socialIcons.style.opacity = '1';
                    socialIcons.style.pointerEvents = 'auto';
                }
            }

        }, { passive: true });
    }

    // ==================== MOBILE MENU ====================
    function initMobileMenu() {
        if (!hamburgerBtn || !mobileMenu) return;

        const mobileMenuClose = document.getElementById('mobile-menu-close');

        function openMenu() {
            mobileMenu.classList.add('open');
            hamburgerBtn.classList.add('active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');

            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.add('open');
            }

            // Hide entire navbar when mobile menu is open
            if (navbar) {
                navbar.style.opacity = '0';
                navbar.style.visibility = 'hidden';
                navbar.style.pointerEvents = 'none';
            }

            document.body.classList.add('menu-open');
        }

        function closeMenu() {
            mobileMenu.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');

            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('open');
            }

            // Show navbar again when mobile menu closes
            if (navbar) {
                navbar.style.opacity = '1';
                navbar.style.visibility = 'visible';
                navbar.style.pointerEvents = 'auto';
            }

            document.body.classList.remove('menu-open');
        }

        function toggleMenu() {
            if (mobileMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        hamburgerBtn.addEventListener('click', toggleMenu);

        // Close button inside menu
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMenu);
        }

        // Close on overlay click
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMenu);
        }

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // ==================== SOCIAL ICONS - No parallax, just fade out ====================
    function initSocialParallax() {
        // Social icons now fade out after hero section
        // No parallax movement needed
    }

    // ==================== FAQ ACCORDION ====================
    function initFaqAccordion() {
        document.querySelectorAll('.faq-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const answer = button.nextElementSibling;
                const icon = button.querySelector('.faq-icon');
                const isOpen = answer.classList.toggle('open');
                icon?.classList.toggle('open', isOpen);
                button.setAttribute('aria-expanded', isOpen);

                // Close other FAQs (single open mode)
                document.querySelectorAll('.faq-toggle').forEach(otherBtn => {
                    if (otherBtn !== button) {
                        otherBtn.nextElementSibling?.classList.remove('open');
                        otherBtn.querySelector('.faq-icon')?.classList.remove('open');
                        otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });
            });
        });
    }

    // ==================== SCROLL REVEAL ====================
    function initScrollReveal() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
                el.classList.add('active');
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
            observer.observe(el);
        });
    }

    // ==================== SMOOTH SCROLL ====================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navbarHeight = navbar?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==================== STATS COUNTER ANIMATION ====================
    function initStatsCounter() {
        const statValues = document.querySelectorAll('.stat-value[data-value]');
        if (!statValues.length) return;

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const finalValue = el.dataset.value;
                    animateValue(el, finalValue);
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        statValues.forEach(el => observer.observe(el));
    }

    function animateValue(el, finalValue) {
        const numMatch = finalValue.match(/(\d+)/);
        if (!numMatch) {
            el.textContent = finalValue;
            return;
        }

        const num = parseInt(numMatch[1]);
        const prefix = finalValue.substring(0, finalValue.indexOf(numMatch[1]));
        const suffix = finalValue.substring(finalValue.indexOf(numMatch[1]) + numMatch[1].length);

        let current = 0;
        const duration = 2000;
        const step = num / (duration / 16);

        const timer = setInterval(() => {
            current += step;
            if (current >= num) {
                current = num;
                clearInterval(timer);
            }
            el.textContent = prefix + Math.floor(current) + suffix;
        }, 16);
    }

    // ==================== DASHBOARD HOVER EFFECT ====================
    function initDashboardHover() {
        const dashboardWrapper = document.querySelector('.dashboard-image-wrapper');
        if (!dashboardWrapper) return;

        dashboardWrapper.addEventListener('mouseenter', () => {
            dashboardWrapper.style.animationPlayState = 'paused';
        });

        dashboardWrapper.addEventListener('mouseleave', () => {
            dashboardWrapper.style.animationPlayState = 'running';
        });
    }

    // ==================== 3D TILT EFFECT ====================
    function init3DTilt() {
        // Disabled to prevent overflow issues
        // Cards will use simple hover effects instead
        return;
    }

    // ==================== 3D PARALLAX SECTIONS ====================
    function init3DParallax() {
        // Disabled to prevent overflow issues
        return;
    }

    // ==================== 3D FLOATING ELEMENTS ====================
    function init3DFloatingElements() {
        // Add floating animation to specific elements
        const floatingElements = document.querySelectorAll('.dashboard-mockup, .section-video-wrapper');

        floatingElements.forEach(el => {
            el.classList.add('float-3d');
        });

        // Add glow effect to buttons
        const buttons = document.querySelectorAll('.btn-primary, .btn-get-started');
        buttons.forEach(btn => {
            btn.classList.add('glow-3d');
        });
    }

    // ==================== SECTION VIDEO CONTROLS ====================
    function initSectionVideos() {
        const videoWrappers = document.querySelectorAll('.section-video-wrapper');

        videoWrappers.forEach(wrapper => {
            const video = wrapper.querySelector('.section-video');

            if (!video) return;

            // Ensure video loads and plays
            video.load();

            // Try to play video (will work if muted and autoplay is set)
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Auto-play was prevented, user needs to interact
                    console.log('Autoplay prevented, waiting for user interaction');
                });
            }

            // Pause floating animation when video is being interacted with
            video.addEventListener('play', () => {
                wrapper.style.animationPlayState = 'paused';
            });

            video.addEventListener('pause', () => {
                wrapper.style.animationPlayState = 'running';
            });

            // Pause animation on hover for better viewing
            wrapper.addEventListener('mouseenter', () => {
                wrapper.style.animationPlayState = 'paused';
            });

            wrapper.addEventListener('mouseleave', () => {
                if (video.paused) {
                    wrapper.style.animationPlayState = 'running';
                }
            });
        });
    }

    // ==================== INITIALIZE ====================
    function init() {
        initNavbarScroll();
        initMobileMenu();
        initSocialParallax();
        initFaqAccordion();
        initScrollReveal();
        initSmoothScroll();
        initStatsCounter();
        initDashboardHover();
        initSectionVideos();
        init3DTilt();
        init3DParallax();
        init3DFloatingElements();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
