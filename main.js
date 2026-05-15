/* ==========================================
   TAPIFY - Main JavaScript
   ========================================== */

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNavbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

window.addEventListener('scroll', function() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== FLOATING VIDEO WIDGET =====
function closeVideoWidget() {
    const widget = document.getElementById('videoWidget');
    if (widget) {
        widget.style.transform = 'translateX(-300px)';
        widget.style.opacity = '0';
        setTimeout(() => {
            widget.style.display = 'none';
        }, 400);
    }
}

// ===== TESTIMONIALS SLIDER =====
function slideTestimonials(direction) {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;

    const cardWidth = 265; // card width + gap
    const scrollAmount = direction * cardWidth * 2;

    track.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// ===== COOKIE CONSENT BANNER =====
function showCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const cookieAccepted = localStorage.getItem('tapify_cookie_consent');

    if (!cookieAccepted && banner) {
        setTimeout(() => {
            banner.classList.add('show');
        }, 2000);
    }
}

function acceptCookies() {
    const banner = document.getElementById('cookieBanner');
    localStorage.setItem('tapify_cookie_consent', 'accepted');
    if (banner) {
        banner.classList.remove('show');
    }
}

function declineCookies() {
    const banner = document.getElementById('cookieBanner');
    localStorage.setItem('tapify_cookie_consent', 'declined');
    if (banner) {
        banner.classList.remove('show');
    }
}

// ===== INITIALIZE ON DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    // Show cookie banner
    showCookieBanner();

    // Add fade-in animation to elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe feature cards, step cards, etc.
    document.querySelectorAll('.feature-card, .step-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
});

// ===== KEYBOARD NAVIGATION FOR TESTIMONIALS =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        slideTestimonials(-1);
    } else if (e.key === 'ArrowRight') {
        slideTestimonials(1);
    }
});

// ===== FAQ ACCORDION ENHANCEMENT =====
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', function() {
        // Smooth animation handled by Bootstrap, just adding visual feedback
        this.blur();
    });
});

// ===== PREVENT FORM SUBMIT ON DEMO LINKS =====
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
    });
});

console.log('%c🚀 Tapify - The Future of Business Networking', 'color: #8338ec; font-size: 16px; font-weight: bold;');
console.log('%cWebsite loaded successfully!', 'color: #28a745; font-size: 12px;');
