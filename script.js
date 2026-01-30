// Mobile menu toggle
const mobileMenu = document.getElementById('mobileMenu');
const navLinksContainer = document.getElementById('navLinks');

if (mobileMenu && navLinksContainer) {
    mobileMenu.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });
}
// Typing effect for hero section

        // Array of texts to display
        const texts = ["A driven and passionate engineer ", "with experience in Reservoir Performance Evaluation ", "Data Engineering, and Software Development. ", "Petroleum Engineer ", "Tech Enthusiast ", "Exploring the world of Technology "];
        let index = 0; // Index of the current text
        let charIndex = 0; // Index of the current character being typed
        let currentText = ""; // Current text being typed
        let isDeleting = false; // To handle deleting before typing the next text

        // Function to handle the typing effect
        function typeText() {
            const textDisplay = document.getElementById("text-display");

            // If text is not being deleted, type the next character
            if (!isDeleting && charIndex <= texts[index].length) {
                currentText = texts[index].slice(0, charIndex);
                textDisplay.innerHTML = currentText;
                charIndex++; // Move to the next character
            }
            // If deleting, remove one character at a time
            else if (isDeleting && charIndex > 0) {
                currentText = texts[index].slice(0, charIndex);
                textDisplay.innerHTML = currentText;
                charIndex--; // Remove one character
            }

            // If text has been completely typed and we're not deleting yet
            if (charIndex === texts[index].length && !isDeleting) {
                isDeleting = true; // Start deleting after a pause
                setTimeout(typeText, 3000); // Pause before deleting
                return;
            }

            // If the text has been completely deleted
            if (charIndex === 0 && isDeleting) {
                isDeleting = false; // Stop deleting
                index = (index + 1) % texts.length; // Move to the next text
            }

            // Call this function again after a delay
            const speed = isDeleting ? 100 : 150; // Speed up when deleting
            setTimeout(typeText, speed); // Recursively call the function with a delay
        }

        // Start typing when the page loads
        typeText();
    
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
        const resumeFileName = 'Anthony_Obot_Resume.pdf';

        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = resumeFileName;
        link.download = resumeFileName;
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Optional: Show a notification
        showNotification('Resume Downloaded Successfully 📄✔');
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

/**
 * Handles the redirection logic between Medium and the Personal Blog.
 * @param {string} blogUrl - The URL of the article on your website.
 * @param {string} mediumUrl - The URL of the article on Medium.
 */
function choosePlatform(blogUrl, mediumUrl) {
    const choice = confirm("How would you like to read this?\n\nClick 'OK' for Medium (Paid Members)\nClick 'Cancel' for our Website (Free)");
    
    if (choice) {
        window.open(mediumUrl, '_blank');
    } else {
        window.open(blogUrl, '_blank');
    }
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