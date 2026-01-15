// Mobile menu toggle
const mobileMenu = document.getElementById('mobileMenu');
const navLinksContainer = document.getElementById('navLinks');

if (mobileMenu && navLinksContainer) {
    mobileMenu.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Resume download functionality
const resumeBtn = document.querySelector('.resume-btn');
if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Replace 'Anthony_Obot_Resume.pdf' with your actual resume filename
        // const resumeFileName = 'Anthony_Obot_Resume.pdf';
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = resumeFileName;
        link.download = resumeFileName;
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Optional: Show a notification
        showNotification('Resume download started! 📄');
    });
}

// Notification function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Load comments from localStorage (for blog page)
function loadComments() {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="color: var(--text-light);">No comments yet. Be the first to comment!</p>';
        return;
    }
    
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-header">
                <span class="comment-author">${comment.name}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
        </div>
    `).join('');
}

// Handle comment submission (for blog page)
const commentForm = document.getElementById('commentForm');
if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('commentName').value;
        const email = document.getElementById('commentEmail').value;
        const text = document.getElementById('commentText').value;
        
        // Get existing comments
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        
        // Add new comment
        comments.push({
            name,
            email,
            text,
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            })
        });
        
        // Save to localStorage
        localStorage.setItem('comments', JSON.stringify(comments));
        
        // Clear form
        commentForm.reset();
        
        // Reload comments
        loadComments();
        
        showNotification('Thank you for your comment! 🎉');
    });
}

// Handle contact form submission (for contact page)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Store message in localStorage
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push({
            name,
            email,
            subject,
            message,
            date: new Date().toISOString()
        });
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        // Show success message
        const formMessage = document.getElementById('formMessage');
        if (formMessage) {
            formMessage.style.display = 'block';
            formMessage.style.color = 'green';
            formMessage.innerHTML = '✅ Thank you for your message! I\'ll get back to you soon.';
        }
        
        // Clear form
        contactForm.reset();
        
        // Show notification
        showNotification('Message sent successfully! ✅');
        
        // Hide message after 5 seconds
        setTimeout(() => {
            if (formMessage) {
                formMessage.style.display = 'none';
            }
        }, 5000);
    });
}

// Handle newsletter form
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Thank you for subscribing! 📬');
        e.target.reset();
    });
}

// Initialize comments on blog page
if (document.getElementById('commentsList')) {
    loadComments();
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinksContainer) {
            navLinksContainer.classList.remove('active');
        }
    });
});

// Smooth scroll animation for internal links
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

// Add scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.project-card, .blog-card, .about-content, .contact-container');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});