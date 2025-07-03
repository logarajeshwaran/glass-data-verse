
// Animations JavaScript
// Advanced animation controllers and effects

// GSAP-like animation utilities (without requiring GSAP)
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.timeline = [];
    }
    
    // Animate element properties
    animate(element, properties, options = {}) {
        const {
            duration = 1000,
            easing = 'ease-out',
            delay = 0,
            onComplete = null
        } = options;
        
        const startTime = performance.now() + delay;
        const endTime = startTime + duration;
        
        // Get initial values
        const initialValues = {};
        const targetValues = {};
        
        Object.keys(properties).forEach(prop => {
            if (prop === 'x' || prop === 'y') {
                initialValues[prop] = 0;
            } else {
                const computed = getComputedStyle(element);
                initialValues[prop] = parseFloat(computed[prop]) || 0;
            }
            targetValues[prop] = properties[prop];
        });
        
        const animate = (currentTime) => {
            if (currentTime < startTime) {
                requestAnimationFrame(animate);
                return;
            }
            
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = this.easeOut(progress);
            
            Object.keys(properties).forEach(prop => {
                const start = initialValues[prop];
                const end = targetValues[prop];
                const current = start + (end - start) * easedProgress;
                
                if (prop === 'x') {
                    element.style.transform = `translateX(${current}px)`;
                } else if (prop === 'y') {
                    element.style.transform = `translateY(${current}px)`;
                } else if (prop === 'opacity') {
                    element.style.opacity = current;
                } else if (prop === 'scale') {
                    element.style.transform = `scale(${current})`;
                } else {
                    element.style[prop] = current + (prop.includes('width') || prop.includes('height') ? 'px' : '');
                }
            });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (onComplete) {
                onComplete();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // Easing functions
    easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    easeIn(t) {
        return t * t * t;
    }
    
    easeInOut(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// Scroll-triggered animations
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.observer = null;
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.collectElements();
        this.addCustomAnimations();
    }
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
    }
    
    collectElements() {
        // Collect elements with animation classes
        const selectors = [
            '.fade-in-on-scroll',
            '.slide-in-left-on-scroll',
            '.slide-in-right-on-scroll',
            '.scale-in-on-scroll',
            '.rotate-in-on-scroll'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                this.observer.observe(el);
            });
        });
    }
    
    triggerAnimation(element) {
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            element.classList.add('animate');
            
            // Add stagger effect for children
            const children = element.querySelectorAll('.stagger-child');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('animate');
                }, index * 100);
            });
        }, delay);
        
        this.observer.unobserve(element);
    }
    
    addCustomAnimations() {
        // Counter animation
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            this.observer.observe(counter);
            counter.addEventListener('animate', () => {
                this.animateCounter(counter);
            });
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(target * this.easeOut(progress));
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

// Parallax effects
class ParallaxController {
    constructor() {
        this.elements = [];
        this.ticking = false;
        this.init();
    }
    
    init() {
        this.collectElements();
        this.bindEvents();
    }
    
    collectElements() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(el => {
            this.elements.push({
                element: el,
                speed: parseFloat(el.dataset.parallax) || 0.5,
                offset: el.offsetTop
            });
        });
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }
    
    updateParallax() {
        const scrollTop = window.pageYOffset;
        
        this.elements.forEach(item => {
            const yPos = -(scrollTop - item.offset) * item.speed;
            item.element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Text reveal animations
class TextRevealAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.splitTextElements();
        this.observeElements();
    }
    
    splitTextElements() {
        const textElements = document.querySelectorAll('.text-reveal');
        textElements.forEach(el => {
            const text = el.textContent;
            const words = text.split(' ');
            
            el.innerHTML = words.map(word => 
                `<span class="word">${word.split('').map(char => 
                    `<span class="char">${char}</span>`
                ).join('')}</span>`
            ).join(' ');
        });
    }
    
    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateText(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.text-reveal').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateText(element) {
        const chars = element.querySelectorAll('.char');
        chars.forEach((char, index) => {
            setTimeout(() => {
                char.style.opacity = '1';
                char.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
}

// Magnetic hover effects
class MagneticEffects {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        const magneticElements = document.querySelectorAll('.magnetic');
        magneticElements.forEach(el => {
            this.addMagneticEffect(el);
        });
    }
    
    addMagneticEffect(element) {
        let isHovering = false;
        
        element.addEventListener('mouseenter', () => {
            isHovering = true;
        });
        
        element.addEventListener('mouseleave', () => {
            isHovering = false;
            element.style.transform = 'translate(0, 0)';
        });
        
        element.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.3;
            const moveY = y * 0.3;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
}

// Morphing shapes
class MorphingShapes {
    constructor() {
        this.shapes = [];
        this.init();
    }
    
    init() {
        this.createShapes();
        this.animateShapes();
    }
    
    createShapes() {
        const container = document.querySelector('.morphing-bg');
        if (!container) return;
        
        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            shape.className = 'morphing-shape';
            shape.style.cssText = `
                position: absolute;
                width: ${Math.random() * 200 + 50}px;
                height: ${Math.random() * 200 + 50}px;
                background: linear-gradient(45deg, 
                    rgba(99, 102, 241, 0.1), 
                    rgba(139, 92, 246, 0.1));
                border-radius: 50%;
                filter: blur(1px);
                animation: morph ${Math.random() * 10 + 10}s infinite ease-in-out;
            `;
            
            container.appendChild(shape);
            this.shapes.push(shape);
        }
    }
    
    animateShapes() {
        this.shapes.forEach((shape, index) => {
            const animate = () => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                const scale = Math.random() * 0.5 + 0.5;
                
                shape.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
                
                setTimeout(animate, Math.random() * 5000 + 3000);
            };
            
            setTimeout(animate, index * 1000);
        });
    }
}

// Page transition effects
class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.init();
    }
    
    init() {
        this.createTransitionOverlay();
        this.bindEvents();
    }
    
    createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--background);
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
        `;
        
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }
    
    bindEvents() {
        // Add to navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    this.smoothScrollTransition(e, link);
                }
            });
        });
    }
    
    smoothScrollTransition(e, link) {
        e.preventDefault();
        
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        // Show overlay
        this.overlay.style.opacity = '0.3';
        
        // Scroll to section
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Hide overlay after scroll
            setTimeout(() => {
                this.overlay.style.opacity = '0';
                this.isTransitioning = false;
            }, 800);
        }
    }
}

// Initialize all animation systems
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animation controllers
    const animationController = new AnimationController();
    const scrollAnimations = new ScrollAnimations();
    const parallaxController = new ParallaxController();
    const textRevealAnimations = new TextRevealAnimations();
    const magneticEffects = new MagneticEffects();
    const morphingShapes = new MorphingShapes();
    const pageTransitions = new PageTransitions();
    
    // Add CSS for morphing animation
    const morphingCSS = `
        @keyframes morph {
            0%, 100% {
                border-radius: 50% 30% 70% 40%;
            }
            25% {
                border-radius: 30% 70% 40% 50%;
            }
            50% {
                border-radius: 70% 40% 50% 30%;
            }
            75% {
                border-radius: 40% 50% 30% 70%;
            }
        }
        
        .char {
            display: inline-block;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        
        .morphing-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = morphingCSS;
    document.head.appendChild(styleSheet);
    
    console.log('Advanced animations initialized');
});

// Export animation controllers
window.AnimationSystem = {
    AnimationController,
    ScrollAnimations,
    ParallaxController,
    TextRevealAnimations,
    MagneticEffects,
    MorphingShapes,
    PageTransitions
};
