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

/* ========================================
   VIDEO CAROUSEL WITH LAZY LOADING
   ======================================== */

// Video Carousel Functionality
const carousel = document.querySelector('.video-carousel');
const carouselTrack = document.querySelector('.video-carousel-track');
const prevBtn = document.querySelector('.carousel-btn-prev');
const nextBtn = document.querySelector('.carousel-btn-next');
const viewMoreBtn = document.getElementById('viewMoreVideos');

if (carousel && carouselTrack) {
  let currentIndex = 0;
  let isDown = false;
  let startX;
  let scrollLeft;
  
  // Get all video cards (including hidden ones)
  const getAllCards = () => document.querySelectorAll('.video-card');
  const getVisibleCards = () => document.querySelectorAll('.video-card:not(.video-hidden)');
  
  // Calculate how many cards to show at once based on screen size
  const getCardsPerView = () => {
    const width = window.innerWidth;
    if (width <= 640) return 1;
    if (width <= 1024) return 1.5;
    return 2;
  };
  
  // Update carousel position
  const updateCarousel = () => {
    const cards = getVisibleCards();
    const cardsPerView = getCardsPerView();
    const cardWidth = cards[0]?.offsetWidth || 0;
    const gap = 25;
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    
    currentIndex = Math.min(currentIndex, maxIndex);
    currentIndex = Math.max(0, currentIndex);
    
    const offset = currentIndex * (cardWidth + gap);
    carouselTrack.style.transform = `translateX(-${offset}px)`;
    
    // Update button states
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
  };
  
  // Navigation button handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateCarousel();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const cards = getVisibleCards();
      const cardsPerView = getCardsPerView();
      const maxIndex = Math.max(0, cards.length - cardsPerView);
      currentIndex = Math.min(maxIndex, currentIndex + 1);
      updateCarousel();
    });
  }
  
  // Touch/Mouse drag functionality
  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.add('grabbing');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = currentIndex;
  });
  
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('grabbing');
  });
  
  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('grabbing');
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    const cards = getVisibleCards();
    const cardWidth = cards[0]?.offsetWidth || 0;
    const gap = 25;
    
    if (walk < -50 && currentIndex < cards.length - getCardsPerView()) {
      currentIndex++;
      updateCarousel();
      startX = x;
    } else if (walk > 50 && currentIndex > 0) {
      currentIndex--;
      updateCarousel();
      startX = x;
    }
  });
  
  // Touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  const handleSwipe = () => {
    const cards = getVisibleCards();
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    
    if (touchStartX - touchEndX > 50 && currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    } else if (touchEndX - touchStartX > 50 && currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  };
  
  // Window resize handler
  window.addEventListener('resize', updateCarousel);
  
  // Initial update
  updateCarousel();
}

// View More Videos Button
if (viewMoreBtn) {
  viewMoreBtn.addEventListener('click', () => {
    const hiddenCards = document.querySelectorAll('.video-card.video-hidden');
    const isExpanded = hiddenCards.length === 0;
    
    if (isExpanded) {
      // Collapse - hide videos beyond first 2
      const allCards = getAllCards();
      allCards.forEach((card, index) => {
        if (index >= 2) {
          card.classList.add('video-hidden');
        }
      });
      viewMoreBtn.querySelector('.view-more-text').textContent = 'View More Videos';
      viewMoreBtn.classList.remove('expanded');
    } else {
      // Expand - show all videos
      hiddenCards.forEach(card => {
        card.classList.remove('video-hidden');
      });
      viewMoreBtn.querySelector('.view-more-text').textContent = 'View Less';
      viewMoreBtn.classList.add('expanded');
    }
    
    // Reset carousel position and update
    currentIndex = 0;
    updateCarousel();
  });
}

// Lazy Load Videos - Load iframe only when play button is clicked
const videoContainers = document.querySelectorAll('.video-container[data-video-id]');
videoContainers.forEach(container => {
  const placeholder = container.querySelector('.video-placeholder');
  if (placeholder) {
    placeholder.addEventListener('click', function() {
      const videoId = container.getAttribute('data-video-id');
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
      iframe.setAttribute('title', 'YouTube video player');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      
      // Replace placeholder with iframe
      container.innerHTML = '';
      container.appendChild(iframe);
    });
  }
});
  