// Page Loader
window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 500);
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

// Hero Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.carousel-dot');

// Randomize slide order on page load
if (slides.length > 0) {
  // Store original order
  const slideArray = Array.from(slides);
  
  // Fisher-Yates shuffle for true randomization
  for (let i = slideArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slideArray[i], slideArray[j]] = [slideArray[j], slideArray[i]];
  }
  
  // Reattach slides in random order
  const carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    slideArray.forEach(slide => carousel.appendChild(slide));
  }
  
  // Update dots to match new order
  dots.forEach((dot, index) => {
    dot.setAttribute('data-slide', index);
  });
}

function showSlide(n) {
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  currentSlide = (n + slides.length) % slides.length;
  
  if (slides[currentSlide]) {
    slides[currentSlide].classList.add('active');
  }
  if (dots[currentSlide]) {
    dots[currentSlide].classList.add('active');
  }
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

// Auto-advance carousel every 4 seconds
if (slides.length > 0) {
  setInterval(nextSlide, 4000);
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });
}

// Scroll animations - Optimized with Intersection Observer
if ('IntersectionObserver' in window) {
  // Use Intersection Observer for better performance
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);
  
  // Initial state for scroll animations
  document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.featured-item, .service-card, .gallery-item');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  });
} else {
  // Fallback for browsers without Intersection Observer
  window.addEventListener("scroll", () => {
    const elements = document.querySelectorAll('.featured-item, .service-card, .gallery-item');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85;
      
      if (inView) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  });
  
  // Initial state for scroll animations
  document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.featured-item, .service-card, .gallery-item');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
  });
}

// Gallery Category Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryCategories = document.querySelectorAll('.gallery-category');

if (filterButtons.length > 0) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get the selected category
      const category = button.getAttribute('data-category');
      
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
      
      // Smooth scroll to gallery container
      const galleryContainer = document.querySelector('.gallery-container');
      if (galleryContainer) {
        galleryContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Lightbox Functionality
function openLightbox(imageSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  if (lightbox && lightboxImg) {
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Add click listeners to all gallery items
const galleryItems = document.querySelectorAll('.gallery-item img');
if (galleryItems.length > 0) {
  galleryItems.forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src);
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
  
  // Close lightbox on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}
  