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

        const scrollThreshold = 50;
        const heroSection = document.getElementById('hero');
        const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

        // Initial check on page load
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled', 'navbar-scrolled');
            navbar.style.background = 'linear-gradient(135deg, #1e3a5f 0%, #6366f1 100%)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        }

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

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

    // ==================== 3D FEATURE CAROUSEL ====================
    function init3DCarousel() {
        const carousel = document.getElementById('features-carousel');
        if (!carousel) return;

        const items = carousel.querySelectorAll('.carousel-3d-item');
        const dotsContainer = document.getElementById('carousel-dots');
        const prevBtn = document.querySelector('.carousel-3d-prev');
        const nextBtn = document.querySelector('.carousel-3d-next');

        if (items.length === 0) return;

        let currentIndex = 0;
        const totalItems = items.length;

        // Create dots
        items.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-3d-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-3d-dot');

        function updateCarousel() {
            items.forEach((item, index) => {
                // Remove all position classes
                item.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');

                const diff = index - currentIndex;

                if (diff === 0) {
                    item.classList.add('active');
                } else if (diff === -1 || (currentIndex === 0 && index === totalItems - 1)) {
                    item.classList.add('prev');
                } else if (diff === 1 || (currentIndex === totalItems - 1 && index === 0)) {
                    item.classList.add('next');
                } else if (diff === -2 || (currentIndex <= 1 && index >= totalItems - 2)) {
                    item.classList.add('far-prev');
                } else if (diff === 2 || (currentIndex >= totalItems - 2 && index <= 1)) {
                    item.classList.add('far-next');
                } else {
                    item.classList.add('hidden');
                }
            });

            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = totalItems - 1;
            if (currentIndex >= totalItems) currentIndex = 0;
            updateCarousel();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        // Event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Click on item to make it active
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (!item.classList.contains('active')) {
                    goToSlide(index);
                }
            });
        });

        // Keyboard navigation
        carousel.setAttribute('tabindex', '0');
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        }, { passive: true });

        // Auto-play (optional)
        let autoPlayInterval;
        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        // Scroll-triggered parallax animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('parallax-in');
                        }, index * 100);
                    });
                    startAutoPlay();
                } else {
                    stopAutoPlay();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(carousel);

        // Initialize
        updateCarousel();
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
        init3DCarousel();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
