/**
 * Advanced Animations JavaScript
 * Author: Imad Maalouf
 */

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initHoverEffects();
    initTextScramble();
    initGradientShift();
    initFloatingElements();
    initMorphingShapes();
    initConnectionLines();
});

// ===== Scroll-triggered Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.getAttribute('data-animate');
                entry.target.classList.add(animation);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
}

// ===== Hover Effects =====
function initHoverEffects() {
    // Glow effect on cards
    const glowCards = document.querySelectorAll('.glow-card');
    glowCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 0 30px rgba(14, 165, 233, 0.4)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });
    
    // Scale effect on images
    const scaleImages = document.querySelectorAll('.scale-hover');
    scaleImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
        });
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
}

// ===== Text Scramble Effect =====
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

function initTextScramble() {
    const scrambleElements = document.querySelectorAll('[data-scramble]');
    scrambleElements.forEach(el => {
        const fx = new TextScramble(el);
        const originalText = el.textContent;
        
        el.addEventListener('mouseenter', () => {
            fx.setText(originalText);
        });
    });
}

// ===== Gradient Shift Animation =====
function initGradientShift() {
    const gradientElements = document.querySelectorAll('.gradient-shift');
    if (gradientElements.length === 0) return;
    
    let hue = 0;
    
    function animate() {
        hue = (hue + 0.5) % 360;
        gradientElements.forEach(el => {
            el.style.background = `linear-gradient(${hue}deg, var(--primary-500), var(--accent-500))`;
        });
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ===== Floating Elements =====
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating');
    if (floatingElements.length === 0) return;
    
    floatingElements.forEach((el, index) => {
        const delay = index * 0.5;
        const duration = 3 + Math.random() * 2;
        
        el.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
}

// ===== Morphing Shapes =====
function initMorphingShapes() {
    const morphShapes = document.querySelectorAll('.morph-shape');
    if (morphShapes.length === 0) return;
    
    const shapes = [
        'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', // Pentagon
        'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', // Hexagon
        'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', // Star
        'circle(50% at 50% 50%)', // Circle
        'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', // Trapezoid
    ];
    
    let currentShape = 0;
    
    function morph() {
        morphShapes.forEach(shape => {
            shape.style.clipPath = shapes[currentShape];
            shape.style.transition = 'clip-path 1s ease-in-out';
        });
        
        currentShape = (currentShape + 1) % shapes.length;
    }
    
    setInterval(morph, 3000);
}

// ===== Connection Lines (Network Effect) =====
function initConnectionLines() {
    const canvas = document.getElementById('connectionCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 50;
    const connectionDistance = 150;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw particles
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(14, 165, 233, 0.5)';
            ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(14, 165, 233, ${0.2 * (1 - distance / connectionDistance)})`;
                    ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(drawParticles);
    }
    
    resize();
    createParticles();
    drawParticles();
    
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
}

// ===== Wave Animation =====
function createWave(element, options = {}) {
    const defaults = {
        amplitude: 20,
        frequency: 0.02,
        speed: 0.05,
        color: '#0ea5e9'
    };
    
    const settings = { ...defaults, ...options };
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    element.appendChild(canvas);
    
    let width, height;
    let offset = 0;
    
    function resize() {
        width = canvas.width = element.offsetWidth;
        height = canvas.height = element.offsetHeight;
    }
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        
        for (let x = 0; x < width; x++) {
            const y = height / 2 + Math.sin(x * settings.frequency + offset) * settings.amplitude;
            ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = settings.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        offset += settings.speed;
        requestAnimationFrame(draw);
    }
    
    resize();
    draw();
    
    window.addEventListener('resize', resize);
}

// ===== Glitch Effect =====
class GlitchEffect {
    constructor(element) {
        this.element = element;
        this.originalText = element.textContent;
        this.glitchChars = '!<>-_\\/[]{}—=+*^?#';
        this.isGlitching = false;
    }
    
    glitch() {
        if (this.isGlitching) return;
        this.isGlitching = true;
        
        let iterations = 0;
        const maxIterations = 10;
        
        const interval = setInterval(() => {
            this.element.textContent = this.originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return this.originalText[index];
                    }
                    return this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
                })
                .join('');
            
            iterations += 1 / 3;
            
            if (iterations >= this.originalText.length) {
                clearInterval(interval);
                this.element.textContent = this.originalText;
                this.isGlitching = false;
            }
        }, 30);
    }
}

function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('[data-glitch]');
    glitchElements.forEach(el => {
        const glitch = new GlitchEffect(el);
        
        el.addEventListener('mouseenter', () => glitch.glitch());
        
        // Random glitch
        setInterval(() => {
            if (Math.random() > 0.95) {
                glitch.glitch();
            }
        }, 3000);
    });
}

// ===== Aurora Background =====
function initAuroraBackground() {
    const aurora = document.querySelector('.aurora-bg');
    if (!aurora) return;
    
    const colors = [
        'rgba(14, 165, 233, 0.3)',
        'rgba(6, 182, 212, 0.3)',
        'rgba(99, 102, 241, 0.3)',
        'rgba(139, 92, 246, 0.3)'
    ];
    
    let time = 0;
    
    function animate() {
        time += 0.005;
        
        const gradient = colors.map((color, i) => {
            const x = 50 + Math.sin(time + i * 1.5) * 30;
            const y = 50 + Math.cos(time + i * 1.2) * 30;
            return `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, transparent 50%)`;
        }).join(', ');
        
        aurora.style.background = gradient;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ===== Spotlight Effect =====
function initSpotlightEffect() {
    const spotlightElements = document.querySelectorAll('.spotlight');
    if (spotlightElements.length === 0) return;
    
    spotlightElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            el.style.setProperty('--spotlight-x', `${x}%`);
            el.style.setProperty('--spotlight-y', `${y}%`);
        });
    });
}

// ===== Number Counter Animation =====
function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===== Smooth Reveal on Scroll =====
function initSmoothReveal() {
    const revealItems = document.querySelectorAll('.smooth-reveal');
    if (revealItems.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealItems.forEach(item => observer.observe(item));
}

// ===== Magnetic Cursor Effect =====
function initMagneticCursor() {
    const magneticElements = document.querySelectorAll('.magnetic');
    if (magneticElements.length === 0) return;
    
    document.addEventListener('mousemove', (e) => {
        magneticElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = 100;
            
            if (distance < maxDistance) {
                const strength = (maxDistance - distance) / maxDistance;
                const moveX = deltaX * strength * 0.3;
                const moveY = deltaY * strength * 0.3;
                
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                el.style.transform = 'translate(0, 0)';
            }
        });
    });
}

// ===== Scroll Progress Bar =====
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = `${scrollPercent}%`;
    });
}

// ===== Parallax Layers =====
function initParallaxLayers() {
    const layers = document.querySelectorAll('.parallax-layer');
    if (layers.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        layers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed')) || 0.5;
            const yPos = -(scrollY * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===== Initialize All =====
function initAllAnimations() {
    initScrollAnimations();
    initHoverEffects();
    initTextScramble();
    initGradientShift();
    initFloatingElements();
    initMorphingShapes();
    initConnectionLines();
    initGlitchEffect();
    initAuroraBackground();
    initSpotlightEffect();
    initSmoothReveal();
    initMagneticCursor();
    initScrollProgress();
    initParallaxLayers();
}

// Export for use in other scripts
window.Animations = {
    TextScramble,
    GlitchEffect,
    createWave,
    animateValue,
    initAllAnimations
};
