// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navItems = document.querySelectorAll('.nav-links li a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade-in animations using Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.service-card, .program-step, .director-profile, .blog-post, .faq-item, .testimonial').forEach(el => {
    observer.observe(el);
});

// Blog category filtering
const tabBtns = document.querySelectorAll('.tab-btn');
const blogPosts = document.querySelectorAll('.blog-post');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const category = btn.dataset.category;

        blogPosts.forEach(post => {
            if (category === 'all' || post.classList.contains(category)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    });
});

// Blog post detail view
const blogReadMoreLinks = document.querySelectorAll('.read-more');
const blogContent = document.getElementById('blog-content');
const blogDetailSections = document.querySelectorAll('.blog-detail');

blogReadMoreLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = link.closest('.blog-post').dataset.post;
        const targetSection = document.getElementById(postId);

        // Hide all blog details
        blogDetailSections.forEach(section => {
            section.style.display = 'none';
        });

        // Show the clicked blog detail
        if (targetSection) {
            targetSection.style.display = 'block';
            blogContent.style.display = 'block';
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Form validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        const email = form.querySelector('input[type="email"]');
        const requiredFields = form.querySelectorAll('input[required], textarea[required]');

        let isValid = true;

        // Check required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        // Email validation
        if (email && email.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.classList.add('error');
                isValid = false;
            } else {
                email.classList.remove('error');
            }
        }

        if (!isValid) {
            e.preventDefault();
            alert('Please fill in all required fields correctly.');
        }
    });
});

// Newsletter signup
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]');
        if (email && email.value) {
            alert('Thank you for subscribing! We\'ll keep you updated with the latest fertility tips.');
            email.value = '';
        }
    });
}

// Contact form enhancement
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    const phoneInput = contactForm.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Remove non-numeric characters
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Program enrollment modal (placeholder for future implementation)
const ctaButtons = document.querySelectorAll('.btn.primary');
ctaButtons.forEach(btn => {
    if (btn.textContent.includes('Book') || btn.textContent.includes('Consultation')) {
        btn.addEventListener('click', (e) => {
            // This would typically open a modal or redirect to booking system
            alert('Consultation booking system coming soon! Please contact us directly.');
        });
    }
});

// Lazy loading for images (if needed in future)
const images = document.querySelectorAll('img[loading="lazy"]');
// Intersection Observer for lazy loading is already set up above

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Prevent form submission on enter for certain fields
const searchInputs = document.querySelectorAll('input[type="search"]');
searchInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Implement search functionality here if needed
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class removal for smooth transitions
    document.body.classList.add('loaded');

    // Initialize any sliders or carousels here if added later

    // Check for URL hash and scroll to element
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});

// Performance optimization: Debounce scroll events
let scrollTimer;
window.addEventListener('scroll', () => {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        // Any scroll-based functionality can go here
    }, 16); // ~60fps
});

// Error handling for missing elements
const safeQuerySelector = (selector) => {
    try {
        return document.querySelector(selector);
    } catch (e) {
        console.warn(`Selector "${selector}" not found:`, e);
        return null;
    }
};

// Export functions for potential use in other scripts
window.Heal360Utils = {
    toggleMobileMenu: () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    },
    smoothScroll: (target) => {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
};
