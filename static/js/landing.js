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
        if (!navbar) return;

        const scrollThreshold = 100;
        const heroSection = document.getElementById('hero');
        const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            // Add/remove scrolled class
            if (currentScroll > scrollThreshold) {
                navbar.classList.add('scrolled', 'navbar-scrolled');
            } else {
                navbar.classList.remove('scrolled', 'navbar-scrolled');
            }

            // Hide scroll indicator after scrolling
            if (scrollIndicator) {
                if (currentScroll > 200) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                } else {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.pointerEvents = 'auto';
                }
            }

            // Hide social icons after hero section
            if (socialIcons) {
                if (currentScroll > heroHeight - 200) {
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
        const navbarCta = document.querySelector('.navbar-cta');

        function openMenu() {
            mobileMenu.classList.add('open');
            hamburgerBtn.classList.add('active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');

            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.add('open');
            }

            // Hide entire navbar-cta except hamburger button
            if (navbarCta) {
                // Hide all children except hamburger
                const children = navbarCta.children;
                for (let i = 0; i < children.length; i++) {
                    if (children[i].id !== 'hamburger-btn') {
                        children[i].style.opacity = '0';
                        children[i].style.visibility = 'hidden';
                    }
                }
            }

            // Hide desktop menu
            const navbarMenu = document.querySelector('.navbar-menu');
            if (navbarMenu) {
                navbarMenu.style.opacity = '0';
                navbarMenu.style.visibility = 'hidden';
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

            // Show navbar-cta children again
            if (navbarCta) {
                const children = navbarCta.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].style.opacity = '1';
                    children[i].style.visibility = 'visible';
                }
            }

            // Show desktop menu
            const navbarMenu = document.querySelector('.navbar-menu');
            if (navbarMenu) {
                navbarMenu.style.opacity = '1';
                navbarMenu.style.visibility = 'visible';
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
        const tiltElements = document.querySelectorAll('.card-hover, .testimonial-card, .pricing-card-3d, .feature-card-3d, .integration-card-3d, .faq-item-3d');

        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px) scale(1.02)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
            });
        });
    }

    // ==================== 3D PARALLAX SECTIONS ====================
    function init3DParallax() {
        const sections = document.querySelectorAll('section');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + scrollY;
                const sectionHeight = rect.height;

                // Check if section is in viewport
                if (scrollY > sectionTop - window.innerHeight && scrollY < sectionTop + sectionHeight) {
                    const progress = (scrollY - (sectionTop - window.innerHeight)) / (window.innerHeight + sectionHeight);
                    const translateZ = Math.sin(progress * Math.PI) * 20;

                    // Apply subtle 3D effect to section content
                    const content = section.querySelector('.reveal, .stagger-children');
                    if (content) {
                        content.style.transform = `perspective(1000px) translateZ(${translateZ}px)`;
                    }
                }
            });
        }, { passive: true });
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
            const playBtn = wrapper.querySelector('.video-play-btn');
            const overlay = wrapper.querySelector('.video-overlay');

            if (!video || !playBtn) return;

            // Toggle play/pause on button click
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleVideo(video, playBtn);
            });

            // Toggle play/pause on overlay click
            if (overlay) {
                overlay.addEventListener('click', () => {
                    toggleVideo(video, playBtn);
                });
            }

            // Update button state when video plays/pauses
            video.addEventListener('play', () => {
                playBtn.classList.add('playing');
            });

            video.addEventListener('pause', () => {
                playBtn.classList.remove('playing');
            });
        });
    }

    function toggleVideo(video, playBtn) {
        if (video.paused) {
            video.play();
            playBtn.classList.add('playing');
        } else {
            video.pause();
            playBtn.classList.remove('playing');
        }
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
