/**
 * CARSI Australia Landing Page
 * Interactive JavaScript Features
 */

// ==========================================
// Mobile Navigation Toggle
// ==========================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// ==========================================
// Navbar Scroll Effect
// ==========================================

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==========================================
// Smooth Scrolling for Anchor Links
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// Intersection Observer for Animations
// ==========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
const animateElements = document.querySelectorAll('.course-card, .benefit-card, .testimonial-card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    fadeInObserver.observe(el);
});

// ==========================================
// Counter Animation for Stats
// ==========================================

const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;

    const updateCounter = () => {
        current += increment;

        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };

    updateCounter();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statNumbers = entry.target.querySelectorAll('.stat-number');

            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const hasPlus = text.includes('+');
                const hasPercent = text.includes('%');
                const number = parseInt(text.replace(/[^0-9]/g, ''));

                if (!isNaN(number)) {
                    stat.textContent = '0';
                    animateCounter(stat, number);

                    // Add suffix after animation
                    setTimeout(() => {
                        if (hasPlus) stat.textContent += '+';
                        if (hasPercent) stat.textContent += '%';
                    }, 2000);
                }
            });
        }
    });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ==========================================
// Form Handling
// ==========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            course: document.getElementById('course').value,
            message: document.getElementById('message').value
        };

        // In a real implementation, you would send this to a server
        console.log('Form submitted:', formData);

        // Show success message (you can customize this)
        alert('Thank you for your interest! We will contact you soon.');

        // Reset form
        contactForm.reset();

        // Optional: Send to analytics or marketing platform
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Contact',
                'event_label': 'Contact Form Submission'
            });
        }
    });
}

// ==========================================
// Image Lazy Loading with Error Handling
// ==========================================

const images = document.querySelectorAll('img[src]');

images.forEach(img => {
    if (!img.complete) {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    }

    // Handle image load errors gracefully
    img.addEventListener('error', function() {
        console.warn('Image failed to load:', this.src);
        // Image onerror handlers in HTML will handle fallbacks
    });
});

// ==========================================
// Parallax Effect for Hero Section
// ==========================================

const heroSection = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image-wrapper');

if (heroSection && heroImage) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;

        if (scrolled < heroHeight) {
            const parallaxSpeed = 0.5;
            heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// ==========================================
// Floating Badge Animation Enhancement
// ==========================================

const floatingBadge = document.querySelector('.floating-badge');

if (floatingBadge) {
    // Add subtle interactive hover effect
    floatingBadge.addEventListener('mouseenter', () => {
        floatingBadge.style.transform = 'scale(1.05) translateY(-5px)';
    });

    floatingBadge.addEventListener('mouseleave', () => {
        floatingBadge.style.transform = 'scale(1) translateY(0)';
    });
}

// ==========================================
// Performance Optimization: Debounce Scroll
// ==========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy operations
window.addEventListener('scroll', debounce(() => {
    // Any heavy scroll operations can go here
}, 100));

// ==========================================
// Accessibility: Keyboard Navigation
// ==========================================

// Trap focus in mobile menu when open
if (navMenu) {
    const focusableElements = navMenu.querySelectorAll('a, button');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && navMenu.classList.contains('active')) {
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }

        // Close menu with Escape key
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.focus();
        }
    });
}

// ==========================================
// Page Load Performance
// ==========================================

window.addEventListener('load', () => {
    // Hide loading screen if you add one
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }

    // Log page load time for analytics
    const loadTime = window.performance.timing.domContentLoadedEventEnd -
                     window.performance.timing.navigationStart;
    console.log('Page loaded in:', loadTime, 'ms');
});

// ==========================================
// Browser Compatibility Checks
// ==========================================

// Check for IntersectionObserver support
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported. Animations may not work.');
    // Fallback: show all elements immediately
    animateElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}

// ==========================================
// SEO & Analytics Helpers
// ==========================================

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', debounce(() => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        // Track milestones
        if (maxScroll >= 25 && maxScroll < 50 && typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', {'scroll_percentage': 25});
        } else if (maxScroll >= 50 && maxScroll < 75 && typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', {'scroll_percentage': 50});
        } else if (maxScroll >= 75 && maxScroll < 90 && typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', {'scroll_percentage': 75});
        }
    }
}, 500));

// Track CTA button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                'event_category': 'Engagement',
                'event_label': e.target.textContent.trim()
            });
        }
    });
});

// ==========================================
// Console Easter Egg
// ==========================================

console.log('%c🎓 CARSI Australia - Restoration Training Excellence',
    'color: #2490ed; font-size: 18px; font-weight: bold; padding: 10px;');
console.log('%cInterested in learning more? Visit https://carsi.com.au or call 1300 CARSI',
    'color: #ed9d24; font-size: 14px;');

// ==========================================
// Utility: Detect if user is on mobile
// ==========================================

const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Add class to body for mobile-specific styles
if (isMobile()) {
    document.body.classList.add('mobile');
}

// ==========================================
// Ready State
// ==========================================

console.log('CARSI Landing Page initialized successfully!');
