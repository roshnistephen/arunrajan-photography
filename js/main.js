// Page Loader - Hide quickly
const loader = document.querySelector('.page-loader');
if (loader) {
  // Hide immediately
  loader.classList.add('hidden');
}

// Also hide on DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    loader.classList.add('hidden');
  }
});

// Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      nav.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  });
  
  // Close menu when clicking a link
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
}

// Contact Form - WhatsApp Integration
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const project = document.getElementById('project').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate form
    if (!name || !email || !message) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Format WhatsApp message
    let whatsappMessage = `*New Inquiry from ${name}*\n\n`;
    whatsappMessage += `📧 *Email:* ${email}\n`;
    if (project) {
      whatsappMessage += `📸 *Project Type:* ${project}\n`;
    }
    whatsappMessage += `\n💭 *Message:*\n${message}`;
    
    // WhatsApp number (from the floating button)
    const whatsappNumber = '919539239595';
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp in new window
    window.open(whatsappURL, '_blank');
    
    // Optional: Reset form after submission
    contactForm.reset();
    
    // Show success message
    alert('Thank you! Your message is being sent to WhatsApp. Please click "Send" in the WhatsApp window to complete.');
  });
}

// Simple fade-in animation on page load (no scroll-based)
// Note: Don't animate gallery-items as it breaks masonry layout
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.featured-item, .service-card');
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    // Stagger animation
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + (index * 100));
  });
});

// Gallery Category Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryCategories = document.querySelectorAll('.gallery-category');

function filterGallery(category) {
  // Remove active class from all buttons
  filterButtons.forEach(btn => btn.classList.remove('active'));
  
  // Add active class to matching button
  const activeBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  
  // Filter gallery categories
  galleryCategories.forEach(cat => {
    if (category === 'all') {
      cat.classList.remove('hidden');
    } else {
      if (cat.getAttribute('data-category') === category) {
        cat.classList.remove('hidden');
      } else {
        cat.classList.add('hidden');
      }
    }
  });
}

if (filterButtons.length > 0) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      filterGallery(category);
      
      // Smooth scroll to gallery container
      const galleryContainer = document.querySelector('.gallery-container');
      if (galleryContainer) {
        galleryContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      // Update URL without reload
      const url = new URL(window.location);
      if (category === 'all') {
        url.searchParams.delete('filter');
      } else {
        url.searchParams.set('filter', category);
      }
      window.history.pushState({}, '', url);
    });
  });
  
  // Check URL for filter parameter on load
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  if (filterParam) {
    filterGallery(filterParam);
  }
}

// Lightbox Functionality
let escapeHandler = null;

function openLightbox(imageSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  if (lightbox && lightboxImg) {
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add escape key handler when lightbox opens
    if (!escapeHandler) {
      escapeHandler = (e) => {
        if (e.key === 'Escape') {
          closeLightbox();
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Remove escape key handler when lightbox closes
    if (escapeHandler) {
      document.removeEventListener('keydown', escapeHandler);
      escapeHandler = null;
    }
  }
}

// Add click and keyboard listeners to all gallery items
const galleryItems = document.querySelectorAll('.gallery-item img');
if (galleryItems.length > 0) {
  galleryItems.forEach(img => {
    // Make images keyboard accessible
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Click to enlarge image');
    
    // Click handler
    img.addEventListener('click', () => {
      openLightbox(img.src);
    });
    
    // Keyboard handler (Enter or Space)
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img.src);
      }
    });
  });
}

// Close lightbox on background click
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}
  