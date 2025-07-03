
// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeAnimations();
    initializeComponents();
    loadDynamicContent();
    initializeContactForm();
    
    console.log('Portfolio website initialized successfully!');
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.9)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.05)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.fade-in-on-scroll, .slide-in-left-on-scroll, .slide-in-right-on-scroll, .scale-in-on-scroll'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Floating elements parallax effect
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Initialize interactive components
function initializeComponents() {
    // Resume tabs functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Download resume functionality
    const downloadBtn = document.getElementById('download-resume');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Create a simple resume download (you can replace this with actual resume file)
            const resumeContent = generateResumeText();
            downloadTextAsFile(resumeContent, 'Loga_Rajeshwaran_Resume.txt');
        });
    }
}

// Load dynamic content from JSON files
async function loadDynamicContent() {
    try {
        // Load projects
        const projectsResponse = await fetch('data/projects.json');
        const projects = await projectsResponse.json();
        renderProjects(projects);

        // Load resume data
        const resumeResponse = await fetch('data/resume.json');
        const resumeData = await resumeResponse.json();
        renderResume(resumeData);

        // Load blog posts
        const blogResponse = await fetch('data/blog.json');
        const blogPosts = await blogResponse.json();
        renderBlogPosts(blogPosts);

        // Load testimonials
        const testimonialsResponse = await fetch('data/testimonials.json');
        const testimonials = await testimonialsResponse.json();
        renderTestimonials(testimonials);

    } catch (error) {
        console.error('Error loading dynamic content:', error);
        // Fallback to static content if JSON files fail to load
        renderFallbackContent();
    }
}

// Render projects
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = projects.map(project => `
        <div class="project-card fade-in-on-scroll">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-role">${project.role}</div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="tech-stack">
                ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                <a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener">
                    <i class="fab fa-github"></i>
                    GitHub
                </a>
                ${project.liveUrl ? `
                    <a href="${project.liveUrl}" class="project-link" target="_blank" rel="noopener">
                        <i class="fas fa-external-link-alt"></i>
                        Live Demo
                    </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Render resume sections
function renderResume(resumeData) {
    // Render experience timeline
    const timelineContainer = document.getElementById('timeline-container');
    if (timelineContainer && resumeData.experience) {
        timelineContainer.innerHTML = resumeData.experience.map(exp => `
            <div class="timeline-item fade-in-on-scroll">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${exp.date}</div>
                    <h3 class="timeline-title">${exp.title}</h3>
                    <div class="timeline-company">${exp.company}</div>
                    <p class="timeline-description">${exp.description}</p>
                    <div class="tech-stack">
                        ${exp.skills.map(skill => `<span class="tech-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render skills
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer && resumeData.skills) {
        skillsContainer.innerHTML = resumeData.skills.map(skillCategory => `
            <div class="skill-category scale-in-on-scroll">
                <div class="skill-icon">
                    <i class="${skillCategory.icon}"></i>
                </div>
                <h3 class="skill-title">${skillCategory.category}</h3>
                <ul class="skill-list">
                    ${skillCategory.skills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // Render achievements
    const achievementsContainer = document.getElementById('achievements-container');
    if (achievementsContainer && resumeData.achievements) {
        achievementsContainer.innerHTML = resumeData.achievements.map(achievement => `
            <div class="achievement-card fade-in-on-scroll">
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <h3 class="achievement-title">${achievement.title}</h3>
                <p class="achievement-description">${achievement.description}</p>
            </div>
        `).join('');
    }
}

// Render blog posts
function renderBlogPosts(blogPosts) {
    const container = document.getElementById('blog-container');
    if (!container) return;

    container.innerHTML = blogPosts.map(post => `
        <article class="blog-card fade-in-on-scroll">
            <div class="blog-date">${new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</div>
            <h3 class="blog-title">
                <a href="${post.url}" target="_blank" rel="noopener">${post.title}</a>
            </h3>
            <p class="blog-summary">${post.summary}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="blog-read-time">${post.readTime}</span>
                <a href="${post.url}" class="blog-link" target="_blank" rel="noopener">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `).join('');
}

// Render testimonials
function renderTestimonials(testimonials) {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    container.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card scale-in-on-scroll">
            <p class="testimonial-content">${testimonial.content}</p>
            <div class="testimonial-author">${testimonial.author}</div>
            <div class="testimonial-title">${testimonial.title}</div>
        </div>
    `).join('');
}

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await simulateFormSubmission(data);
            
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Utility functions
function generateResumeText() {
    return `
LOGA RAJESHWARAN - DATA ENGINEER
=====================================

Contact: [Your Email] | [Your Phone] | [Your Location]
LinkedIn: [Your LinkedIn] | GitHub: [Your GitHub]

SUMMARY
-------
Data Engineer with 6+ years of experience specializing in building scalable data pipelines, 
cloud-native architectures, and automation solutions. Proven track record of optimizing 
data processing workflows and leading cross-functional teams.

EXPERIENCE
----------
Senior Data Engineer | TechCorp Solutions | 2021 - Present
• Lead data engineering initiatives for enterprise clients
• Design and implement scalable data pipelines processing 10TB+ daily
• Mentor junior engineers and drive adoption of best practices

Data Engineer | DataFlow Inc. | 2019 - 2021
• Built and maintained ETL pipelines for real-time and batch processing
• Implemented data quality frameworks and automated testing
• Reduced data processing costs by 35% through optimization

TECHNICAL SKILLS
---------------
Languages: Python, SQL, Scala, Java
Data Processing: Apache Spark, Apache Kafka, Apache Beam
Cloud Platforms: GCP, AWS, Azure
Orchestration: Apache Airflow, Prefect
Databases: PostgreSQL, BigQuery, MongoDB

CERTIFICATIONS
--------------
• Google Cloud Professional Data Engineer
• AWS Certified Solutions Architect
• Apache Airflow Certification
• Databricks Data Engineer Associate
    `.trim();
}

function downloadTextAsFile(text, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful submission
            console.log('Form submitted:', data);
            resolve();
        }, 2000);
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
        color: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideInFromRight 0.3s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutToRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function renderFallbackContent() {
    console.log('Loading fallback content...');
    // Add fallback content here if JSON files fail to load
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutToRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
