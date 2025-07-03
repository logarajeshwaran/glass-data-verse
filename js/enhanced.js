
// Enhanced Interactive Features

// Advanced Particle System
class AdvancedParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.className = 'particle-bg';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        document.body.appendChild(this.canvas);
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.min(window.innerWidth / 20, 100);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: ['#6366f1', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 3)]
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.x -= dx * 0.001;
                particle.y -= dy * 0.001;
            }
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
            this.ctx.fill();
            
            // Draw connections
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = particle.color + '20';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Enhanced Scroll Animations
class EnhancedScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.createScrollIndicator();
        this.collectElements();
        this.bindEvents();
    }
    
    createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = '<div class="scroll-progress"></div>';
        document.body.appendChild(indicator);
        
        this.progressBar = indicator.querySelector('.scroll-progress');
    }
    
    collectElements() {
        const elements = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .achievement-card');
        elements.forEach(el => {
            el.classList.add('timeline-item-enhanced');
            this.elements.push(el);
        });
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => {
            this.updateScrollProgress();
            this.handleElementAnimations();
        });
    }
    
    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        this.progressBar.style.width = scrollPercent + '%';
    }
    
    handleElementAnimations() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.elements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            
            if (scrollTop + windowHeight > elementTop + elementHeight * 0.1) {
                element.classList.add('animate');
            }
        });
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = Array.isArray(texts) ? texts : [texts];
        this.options = {
            typeSpeed: 100,
            deleteSpeed: 50,
            pauseTime: 2000,
            loop: true,
            ...options
        };
        
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        
        this.start();
    }
    
    start() {
        this.element.classList.add('typing-text');
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }
        
        let typeSpeed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
        
        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = this.options.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500;
            
            if (!this.options.loop && this.currentTextIndex === 0) {
                return;
            }
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Enhanced Modal System
class EnhancedModal {
    constructor() {
        this.modals = new Map();
        this.bindEvents();
    }
    
    create(id, content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-enhanced';
        modal.id = id;
        modal.innerHTML = `
            <div class="modal-content-enhanced">
                <span class="modal-close" style="position: absolute; top: 1rem; right: 1rem; font-size: 1.5rem; cursor: pointer; color: white;">&times;</span>
                <div class="modal-body">${content}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modals.set(id, modal);
        
        // Bind close events
        modal.querySelector('.modal-close').addEventListener('click', () => this.close(id));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close(id);
        });
        
        return modal;
    }
    
    open(id) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('show'), 10);
            document.body.style.overflow = 'hidden';
        }
    }
    
    close(id) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.modals.forEach((modal, id) => {
                    if (modal.classList.contains('show')) {
                        this.close(id);
                    }
                });
            }
        });
    }
}

// Enhanced Form Validation
class EnhancedFormValidation {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.classList.add('form-enhanced');
        this.bindEvents();
    }
    
    bindEvents() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.handleFocus(e));
            input.addEventListener('blur', (e) => this.handleBlur(e));
            input.addEventListener('input', (e) => this.handleInput(e));
        });
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleFocus(e) {
        e.target.classList.add('focused');
    }
    
    handleBlur(e) {
        e.target.classList.remove('focused');
        this.validateField(e.target);
    }
    
    handleInput(e) {
        this.clearFieldError(e.target);
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
        
        if (!isValid) {
            this.showFieldError(field, message);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#ef4444';
        const error = document.createElement('div');
        error.className = 'field-error';
        error.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s ease;
        `;
        error.textContent = message;
        
        field.parentNode.appendChild(error);
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        const error = field.parentNode.querySelector('.field-error');
        if (error) {
            error.remove();
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const inputs = this.form.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            this.submitForm();
        }
    }
    
    submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                this.form.reset();
            }, 2000);
        }, 2000);
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

// Initialize Enhanced Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle system
    new AdvancedParticleSystem();
    
    // Initialize enhanced scroll animations
    new EnhancedScrollAnimations();
    
    // Initialize typing animation for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        new TypingAnimation(heroSubtitle, [
            'Data Engineer | Automation Enthusiast | Cloud Native Thinker',
            'Building Scalable Data Solutions',
            'Transforming Data into Insights'
        ]);
    }
    
    // Initialize modal system
    const modalSystem = new EnhancedModal();
    
    // Add modals for project details
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        const projectTitle = card.querySelector('.project-title').textContent;
        const projectDescription = card.querySelector('.project-description').textContent;
        
        modalSystem.create(`project-${index}`, `
            <h2 style="margin-bottom: 1rem; color: white;">${projectTitle}</h2>
            <p style="line-height: 1.6; color: #9ca3af;">${projectDescription}</p>
            <div style="margin-top: 2rem;">
                <button class="btn btn-primary" onclick="window.open('#', '_blank')">
                    <i class="fab fa-github"></i> View on GitHub
                </button>
            </div>
        `);
        
        card.addEventListener('click', () => {
            modalSystem.open(`project-${index}`);
        });
    });
    
    // Initialize enhanced form validation
    new EnhancedFormValidation('#contact-form');
    
    // Add 3D effects to cards
    const cards = document.querySelectorAll('.glass-card, .project-card');
    cards.forEach(card => {
        card.classList.add('card-3d', 'hover-lift-3d');
        const inner = document.createElement('div');
        inner.className = 'card-3d-inner';
        while (card.firstChild) {
            inner.appendChild(card.firstChild);
        }
        card.appendChild(inner);
    });
    
    // Add neon effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.classList.add('btn-futuristic', 'neon-border');
    });
    
    // Add floating animation to tech stack
    const techTags = document.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
        tag.classList.add('tech-float');
    });
    
    // Enhance social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.classList.add('social-enhanced');
    });
    
    console.log('Enhanced portfolio features loaded successfully!');
});

// Export for global access
window.EnhancedPortfolio = {
    AdvancedParticleSystem,
    EnhancedScrollAnimations,
    TypingAnimation,
    EnhancedModal,
    EnhancedFormValidation
};
