/* ============================================
   WAKY LABS — Main JavaScript
   Author: Waky Labs
   Version: 1.0.0
   ============================================ */

(function() {
    'use strict';

    /* ============================================
       SCROLL REVEAL ANIMATION
       ============================================ */
    const revealObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealObserverOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ============================================
       NAVIGATION SCROLL EFFECT
       ============================================ */
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;

    function handleNavScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    /* ============================================
       SMOOTH SCROLL FOR NAV LINKS
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

    /* ============================================
       MOBILE MENU TOGGLE
       ============================================ */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    /* ============================================
       PARALLAX FLOATING CARDS
       ============================================ */
    const floatingCards = document.querySelectorAll('.float-card');
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isMouseActive = false;
    let mouseTimeout;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        isMouseActive = true;

        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            isMouseActive = false;
        }, 100);
    });

    function animateParallax() {
        if (isMouseActive) {
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;

            floatingCards.forEach((card, i) => {
                const factor = (i + 1) * 0.5;
                card.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
            });
        }
        requestAnimationFrame(animateParallax);
    }

    if (floatingCards.length > 0 && window.innerWidth > 768) {
        animateParallax();
    }

    /* ============================================
       STAT COUNTER ANIMATION
       ============================================ */
    const statNumbers = document.querySelectorAll('.stat-number');

    const countUp = (element, target, duration = 2000) => {
        const startTime = performance.now();
        const startValue = 0;
        const isDecimal = target % 1 !== 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (target - startValue) * easeProgress;

            if (isDecimal) {
                element.textContent = currentValue.toFixed(1);
            } else {
                element.textContent = Math.floor(currentValue);
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                const suffix = element.dataset.suffix || '';
                element.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
            }
        }

        requestAnimationFrame(update);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseFloat(entry.target.dataset.target);
                countUp(entry.target, target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    /* ============================================
       BUTTON CLICK HANDLERS
       ============================================ */
    document.querySelectorAll('.btn-primary, .cta-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes dynamically
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    /* ============================================
       SERVICE CARD TILT EFFECT
       ============================================ */
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    /* ============================================
       TYPING EFFECT FOR HERO (Optional)
       ============================================ */
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        // Subtle entrance animation already handled by CSS
        // This is a placeholder for any additional JS animations
    }

    /* ============================================
       LAZY LOAD IMAGES (if any added later)
       ============================================ */
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    /* ============================================
       CONSOLE GREETING
       ============================================ */
    console.log('%c Waky Labs ', 'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%c System Design Studio — Crafting systems that scale. ', 'color: #8888a0; font-size: 14px;');

})();
