/**
 * RoyalERP Landing Page JavaScript
 * Enterprise-Grade SaaS Landing Page
 * Version: 2.0
 */

(function () {
    'use strict';

    // ==================== CONSTANTS ====================
    const SCROLL_THRESHOLD = 50;
    const NAVBAR_HEIGHT = 70;

    // ==================== DOM ELEMENTS ====================
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const socialIcons = document.getElementById('social-icons');
    const heroSection = document.getElementById('hero');

    // ==================== UTILITY FUNCTIONS ====================
    function getHeroHeight() {
        return heroSection ? heroSection.offsetHeight : window.innerHeight;
    }

    // ==================== NAVBAR - ENTERPRISE GRADE ====================
    function initNavbar() {
        if (!navbar) {
            console.warn('[Navbar] Element not found');
            return;
        }

        // Force navbar to be visible with critical inline styles
        function forceNavbarVisible() {
            navbar.style.position = 'fixed';
            navbar.style.top = '0';
            navbar.style.left = '0';
            navbar.style.right = '0';
            navbar.style.width = '100%';
            navbar.style.zIndex = '2147483647';
            navbar.style.display = 'block';
            navbar.style.visibility = 'visible';
            navbar.style.opacity = '1';
            navbar.style.pointerEvents = 'auto';
            navbar.style.transform = 'none';
        }

        // Update navbar background based on scroll position
        function updateNavbarStyle(scrollY) {
            if (scrollY > SCROLL_THRESHOLD) {
                navbar.classList.add('scrolled', 'navbar-scrolled');
                navbar.style.background = 'linear-gradient(135deg, #1e3a5f 0%, #6366f1 100%)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.classList.remove('scrolled', 'navbar-scrolled');
                navbar.style.background = 'transparent';
                navbar.style.boxShadow = 'none';
            }
        }

        // Update scroll indicator and social icons
        function updateSideElements(scrollY) {
            const heroHeight = getHeroHeight();
            const hideThreshold = heroHeight - 100;

            if (scrollIndicator) {
                scrollIndicator.style.opacity = scrollY > hideThreshold ? '0' : '1';
                scrollIndicator.style.pointerEvents = scrollY > hideThreshold ? 'none' : 'auto';
            }

            if (socialIcons) {
                socialIcons.style.opacity = scrollY > hideThreshold ? '0' : '1';
                socialIcons.style.pointerEvents = scrollY > hideThreshold ? 'none' : 'auto';
            }
        }

        // Main scroll handler
        function handleScroll() {
            const scrollY = window.scrollY || window.pageYOffset;

            // CRITICAL: Always keep navbar visible
            forceNavbarVisible();

            // Update styles
            updateNavbarStyle(scrollY);
            updateSideElements(scrollY);
        }

        // Initialize navbar
        forceNavbarVisible();
        handleScroll();

        // Initialize side elements with transitions
        if (scrollIndicator) {
            scrollIndicator.style.transition = 'opacity 0.5s ease';
            scrollIndicator.style.display = 'flex';
        }
        if (socialIcons) {
            socialIcons.style.transition = 'opacity 0.5s ease';
            socialIcons.style.display = 'flex';
        }

        // Event listeners
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        window.addEventListener('load', forceNavbarVisible);

        // MutationObserver to prevent external style changes
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'style') {
                    const zIndex = navbar.style.zIndex;
                    const visibility = navbar.style.visibility;
                    if (zIndex !== '2147483647' || visibility === 'hidden') {
                        // Only restore if menu is not open
                        if (!document.body.classList.contains('menu-open')) {
                            forceNavbarVisible();
                        }
                    }
                }
            });
        });
        observer.observe(navbar, { attributes: true, attributeFilter: ['style', 'class'] });
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

            // Hide navbar when mobile menu is open
            if (navbar) {
                navbar.style.opacity = '0';
                navbar.style.visibility = 'hidden';
                navbar.style.pointerEvents = 'none';
            }

            document.body.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            mobileMenu.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');

            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('open');
            }

            // Restore navbar when mobile menu closes
            if (navbar) {
                navbar.style.opacity = '1';
                navbar.style.visibility = 'visible';
                navbar.style.pointerEvents = 'auto';
            }

            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }

        function toggleMenu() {
            mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
        }

        // Event listeners
        hamburgerBtn.addEventListener('click', toggleMenu);

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMenu);
        }

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

    // ==================== FAQ ACCORDION ====================
    function initFaqAccordion() {
        document.querySelectorAll('.faq-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const answer = button.nextElementSibling;
                const icon = button.querySelector('.faq-icon');
                const isOpen = answer.classList.toggle('open');
                icon?.classList.toggle('open', isOpen);
                button.setAttribute('aria-expanded', isOpen);

                // Close other FAQs
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
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
                el.classList.add('active');
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -100px 0px', threshold: 0.1 });

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
                    const navHeight = navbar?.offsetHeight || NAVBAR_HEIGHT;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });
    }

    // ==================== STATS COUNTER ====================
    function initStatsCounter() {
        const statValues = document.querySelectorAll('.stat-value[data-value]');
        if (!statValues.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue(entry.target, entry.target.dataset.value);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

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

    // ==================== DASHBOARD HOVER ====================
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

    // ==================== VIDEO CONTROLS ====================
    function initSectionVideos() {
        document.querySelectorAll('.section-video-wrapper').forEach(wrapper => {
            const video = wrapper.querySelector('.section-video');
            if (!video) return;

            video.load();
            video.play().catch(() => { });

            video.addEventListener('play', () => wrapper.style.animationPlayState = 'paused');
            video.addEventListener('pause', () => wrapper.style.animationPlayState = 'running');

            wrapper.addEventListener('mouseenter', () => wrapper.style.animationPlayState = 'paused');
            wrapper.addEventListener('mouseleave', () => {
                if (video.paused) wrapper.style.animationPlayState = 'running';
            });
        });
    }

    // ==================== 3D EFFECTS ====================
    function init3DEffects() {
        // Add glow effect to buttons
        document.querySelectorAll('.btn-primary, .btn-get-started').forEach(btn => {
            btn.classList.add('glow-3d');
        });

        // Add float effect to dashboard
        document.querySelectorAll('.dashboard-mockup, .section-video-wrapper').forEach(el => {
            el.classList.add('float-3d');
        });
    }

    // ==================== INITIALIZE ====================
    function init() {
        initNavbar();
        initMobileMenu();
        initFaqAccordion();
        initScrollReveal();
        initSmoothScroll();
        initStatsCounter();
        initDashboardHover();
        initSectionVideos();
        init3DEffects();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
