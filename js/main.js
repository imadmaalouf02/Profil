/**
 * Main JavaScript for Portfolio
 * Author: Imad Maalouf
 */

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initThemeToggle();
    initNavigation();
    initMobileMenu();
    initSmoothScroll();
    initScrollSpy();
    initBackToTop();
    initSkillBars();
    initCounters();
    initProjectFilter();
    initContactForm();
    initParticles();
    initTypewriter();
});

// ===== Loading Screen =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Trigger reveal animations after loading
            setTimeout(() => {
                document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
                    el.classList.add('revealed');
                });
            }, 300);
        }, 500);
    });
}

// ===== Theme Toggle =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ===== Navigation =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!mobileToggle || !navMenu) return;
    
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const navbar = document.getElementById('navbar');
            const navHeight = navbar ? navbar.offsetHeight : 70;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ===== Scroll Spy =====
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observerOptions = {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// ===== Back to Top =====
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Skill Bars Animation =====
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                if (width) {
                    setTimeout(() => {
                        bar.style.width = `${width}%`;
                    }, 200);
                }
                observer.unobserve(bar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ===== Counter Animation =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// ===== Project Filter =====
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterBtns.length === 0 || projectCards.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInScale 0.5s ease-out forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show success message
        showNotification('Message envoye avec succes !', 'success');
        
        // Reset form
        form.reset();
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
        color: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Particles Animation =====
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 30;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            animation: float ${duration}s ease-in-out ${delay}s infinite;
        `;
        
        container.appendChild(particle);
        particles.push(particle);
    }
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 100;
        mouseY = (e.clientY / window.innerHeight) * 100;
        
        particles.forEach((particle, index) => {
            if (index % 5 === 0) { // Only affect every 5th particle for performance
                const rect = particle.getBoundingClientRect();
                const particleX = (rect.left / window.innerWidth) * 100;
                const particleY = (rect.top / window.innerHeight) * 100;
                
                const dx = mouseX - particleX;
                const dy = mouseY - particleY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 20) {
                    const force = (20 - distance) / 20;
                    particle.style.transform = `translate(${-dx * force * 0.5}px, ${-dy * force * 0.5}px)`;
                }
            }
        });
    });
}

// ===== Typewriter Effect =====
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;
    
    const text = element.textContent;
    element.textContent = '';
    
    let i = 0;
    const speed = 100;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Add cursor after typing
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            element.appendChild(cursor);
        }
    }
    
    // Start typing after a delay
    setTimeout(type, 1000);
}

// ===== Scroll Reveal Animation =====
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        revealObserver.observe(el);
    });
}

// ===== Parallax Effect =====
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                
                parallaxElements.forEach(el => {
                    const speed = el.getAttribute('data-speed') || 0.5;
                    el.style.transform = `translateY(${scrollY * speed}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ===== Magnetic Button Effect =====
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    if (magneticBtns.length === 0) return;
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ===== Tilt Effect for Cards =====
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.tilt-effect');
    if (tiltCards.length === 0) return;
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// ===== Console Easter Egg =====
console.log('%c👋 Bonjour!', 'color: #0ea5e9; font-size: 24px; font-weight: bold;');
console.log('%cBienvenue sur le portfolio d\'Imad Maalouf', 'color: #64748b; font-size: 14px;');
console.log('%cDoctorant en IA & Data Science', 'color: #06b6d4; font-size: 12px;');
console.log('%cContact: imadmaalouf02@gmail.com', 'color: #64748b; font-size: 12px;');

// ===== Add CSS animations for notifications =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
