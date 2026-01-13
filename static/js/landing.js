/**
 * RoyalERP Landing Page JavaScript
 * Clean, working version
 */

(function () {
    'use strict';

    // ==================== DOM ELEMENTS ====================
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const socialIcons = document.getElementById('social-icons');
    const heroSection = document.getElementById('hero');

    // ==================== NAVBAR & SCROLL EFFECTS ====================
    function initScrollEffects() {
        const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
        const scrollThreshold = 50;

        // Force initial visibility
        if (navbar) {
            navbar.style.cssText = 'position:fixed!important;top:0!important;left:0!important;right:0!important;z-index:2147483647!important;visibility:visible!important;opacity:1!important;display:block!important;';
        }

        if (scrollIndicator) {
            scrollIndicator.style.cssText = 'display:flex!important;visibility:visible!important;opacity:1!important;';
        }

        if (socialIcons) {
            socialIcons.style.cssText = 'display:flex!important;visibility:visible!important;opacity:1!important;';
        }

        function handleScroll() {
            const currentScroll = window.scrollY;
            const hideThreshold = heroHeight - 100;

            // Navbar - always visible, change background on scroll
            if (navbar && !document.body.classList.contains('menu-open')) {
                navbar.style.visibility = 'visible';
                navbar.style.opacity = '1';
                navbar.style.display = 'block';

                if (currentScroll > scrollThreshold) {
                    navbar.classList.add('scrolled', 'navbar-scrolled');
                    navbar.style.background = 'linear-gradient(135deg, #1e3a5f 0%, #6366f1 100%)';
                    navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
                } else {
                    navbar.classList.remove('scrolled', 'navbar-scrolled');
                    navbar.style.background = 'transparent';
                    navbar.style.boxShadow = 'none';
                }
            }

            // Scroll indicator - hide after hero section
            if (scrollIndicator) {
                if (currentScroll > hideThreshold) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                } else {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.pointerEvents = 'auto';
                }
            }

            // Social icons - hide after hero section
            if (socialIcons) {
                if (currentScroll > hideThreshold) {
                    socialIcons.style.opacity = '0';
                    socialIcons.style.pointerEvents = 'none';
                } else {
                    socialIcons.style.opacity = '1';
                    socialIcons.style.pointerEvents = 'auto';
                }
            }
        }

        // Initial call
        handleScroll();

        // Listen to scroll
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // ==================== MOBILE MENU ====================
    function initMobileMenu() {
        if (!hamburgerBtn || !mobileMenu) return;

        function openMenu() {
            mobileMenu.classList.add('open');
            hamburgerBtn.classList.add('active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');

            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.add('open');
            }

            // Hide navbar when menu is open
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

            // Show navbar when menu closes
            if (navbar) {
                navbar.style.opacity = '1';
                navbar.style.visibility = 'visible';
                navbar.style.pointerEvents = 'auto';
            }

            document.body.classList.remove('menu-open');
        }

        // Toggle on hamburger click
        hamburgerBtn.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close button
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

    // ==================== FAQ ACCORDION ====================
    function initFaqAccordion() {
        document.querySelectorAll('.faq-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const answer = button.nextElementSibling;
                const icon = button.querySelector('.faq-icon');
                const isOpen = answer.classList.toggle('open');

                if (icon) icon.classList.toggle('open', isOpen);
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
        }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

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
                    const el = entry.target;
                    const finalValue = el.dataset.value;
                    animateValue(el, finalValue);
                    observer.unobserve(el);
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

    // ==================== SECTION VIDEOS ====================
    function initSectionVideos() {
        document.querySelectorAll('.section-video-wrapper').forEach(wrapper => {
            const video = wrapper.querySelector('.section-video');
            if (!video) return;

            video.load();
            video.play().catch(() => { });

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
        initScrollEffects();
        initMobileMenu();
        initFaqAccordion();
        initScrollReveal();
        initSmoothScroll();
        initStatsCounter();
        initDashboardHover();
        initSectionVideos();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
