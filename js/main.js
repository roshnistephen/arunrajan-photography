/* ========================================
   ARUNRAJAN PHOTOGRAPHY - MAIN SCRIPT
   Optimized for Performance
   ======================================== */

// Utility function to select elements safely
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* ========================================
   PAGE LOADER
   ======================================== */
const hideLoader = () => {
  const loader = $('.page-loader');
  if (loader) loader.classList.add('hidden');
};

// Hide immediately and as backup on DOMContentLoaded
hideLoader();
document.addEventListener('DOMContentLoaded', hideLoader);

/* ========================================
   MOBILE MENU TOGGLE
   ======================================== */
const menuToggle = $('.menu-toggle');
const nav = $('.nav');

if (menuToggle && nav) {
  const closeMenu = () => {
    nav.classList.remove('active');
    menuToggle.classList.remove('active');
  };
  
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });
  
  // Close menu when clicking a nav link
  $$('.nav a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ========================================
   CONTACT FORM - WHATSAPP INTEGRATION
   ======================================== */
const contactForm = $('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const project = $('#project')?.value.trim() || '';
    const message = $('#message').value.trim();
    
    if (!name || !email || !message) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Format WhatsApp message
    let whatsappMessage = `*New Inquiry from ${name}*\n\n`;
    whatsappMessage += `📧 *Email:* ${email}\n`;
    if (project) whatsappMessage += `📸 *Project Type:* ${project}\n`;
    whatsappMessage += `\n💭 *Message:*\n${message}`;
    
    // Open WhatsApp
    const whatsappURL = `https://wa.me/919539239595?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappURL, '_blank');
    
    contactForm.reset();
    alert('Thank you! Your message is being sent to WhatsApp. Please click "Send" in the WhatsApp window to complete.');
  });
}

/* ========================================
   GALLERY CATEGORY FILTERING
   ======================================== */
const filterButtons = $$('.filter-btn');
const galleryCategories = $$('.gallery-category');

const filterGallery = (category) => {
  // Update active button
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === category);
  });
  
  // Filter gallery categories
  galleryCategories.forEach(cat => {
    const shouldShow = category === 'all' || cat.getAttribute('data-category') === category;
    cat.classList.toggle('hidden', !shouldShow);
  });
  
  // Update URL without reload
  const url = new URL(window.location);
  if (category === 'all') {
    url.searchParams.delete('filter');
  } else {
    url.searchParams.set('filter', category);
  }
  window.history.pushState({}, '', url);
  
  // Smooth scroll to gallery container
  const galleryContainer = $('.gallery-container');
  if (galleryContainer) {
    galleryContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

if (filterButtons.length > 0) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterGallery(button.getAttribute('data-category'));
    });
  });
  
  // Check URL for filter parameter on load
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  if (filterParam) filterGallery(filterParam);
}

/* ========================================
   LIGHTBOX FUNCTIONALITY
   ======================================== */
let escapeHandler = null;

const openLightbox = (imageSrc) => {
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightbox-img');
  
  if (lightbox && lightboxImg) {
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (!escapeHandler) {
      escapeHandler = (e) => {
        if (e.key === 'Escape') closeLightbox();
      };
      document.addEventListener('keydown', escapeHandler);
    }
  }
};

const closeLightbox = () => {
  const lightbox = $('#lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    if (escapeHandler) {
      document.removeEventListener('keydown', escapeHandler);
      escapeHandler = null;
    }
  }
};

// Add click and keyboard listeners to all gallery items
$$('.gallery-item img').forEach(img => {
  img.setAttribute('tabindex', '0');
  img.setAttribute('role', 'button');
  img.setAttribute('aria-label', 'Click to enlarge image');
  
  img.addEventListener('click', () => openLightbox(img.src));
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(img.src);
    }
  });
});

// Close lightbox on background click
const lightbox = $('#lightbox');
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

/* ========================================
   VIDEO CAROUSEL WITH LAZY LOADING
   ======================================== */

// Constants
const CARDS_PER_VIEW_DESKTOP = 2;
const CARDS_PER_VIEW_TABLET = 1.5; // Shows 1 full card + 0.5 preview
const CARDS_PER_VIEW_MOBILE = 1;
const CAROUSEL_GAP = 25;
const DRAG_SENSITIVITY = 2;
const SWIPE_THRESHOLD = 50;
const INITIAL_VISIBLE_VIDEOS = 2;

const initVideoCarousel = () => {
  const carousel = $('.video-carousel');
  const carouselTrack = $('.video-carousel-track');
  const prevBtn = $('.carousel-btn-prev');
  const nextBtn = $('.carousel-btn-next');
  const viewMoreBtn = $('#viewMoreVideos');
  
  if (!carousel || !carouselTrack) return;
  
  let currentIndex = 0;
  let isDown = false;
  let startX, scrollLeft;
  
  const getCardsPerView = () => {
    const width = window.innerWidth;
    if (width <= 640) return CARDS_PER_VIEW_MOBILE;
    if (width <= 1024) return CARDS_PER_VIEW_TABLET;
    return CARDS_PER_VIEW_DESKTOP;
  };
  
  const getVisibleCards = () => $$('.video-card:not(.video-hidden)');
  
  const updateCarousel = () => {
    const cards = getVisibleCards();
    if (cards.length === 0) return;
    
    const cardsPerView = getCardsPerView();
    const cardWidth = cards[0]?.offsetWidth || 0;
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
    
    const offset = currentIndex * (cardWidth + CAROUSEL_GAP);
    carouselTrack.style.transform = `translateX(-${offset}px)`;
    
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
  };
  
  // Navigation buttons
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
  
  // Mouse drag
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
    const walk = (x - startX) * DRAG_SENSITIVITY;
    const cards = getVisibleCards();
    
    if (walk < -SWIPE_THRESHOLD && currentIndex < cards.length - getCardsPerView()) {
      currentIndex++;
      updateCarousel();
      startX = x;
    } else if (walk > SWIPE_THRESHOLD && currentIndex > 0) {
      currentIndex--;
      updateCarousel();
      startX = x;
    }
  });
  
  // Touch events
  let touchStartX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  carousel.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const cards = getVisibleCards();
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    
    if (touchStartX - touchEndX > SWIPE_THRESHOLD && currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    } else if (touchEndX - touchStartX > SWIPE_THRESHOLD && currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });
  
  // View More Button
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
      const allCards = $$('.video-card');
      const hiddenCards = $$('.video-card.video-hidden');
      const isExpanded = hiddenCards.length === 0;
      
      if (isExpanded) {
        allCards.forEach((card, index) => {
          if (index >= INITIAL_VISIBLE_VIDEOS) card.classList.add('video-hidden');
        });
        viewMoreBtn.querySelector('.view-more-text').textContent = 'View More Videos';
        viewMoreBtn.classList.remove('expanded');
      } else {
        hiddenCards.forEach(card => card.classList.remove('video-hidden'));
        viewMoreBtn.querySelector('.view-more-text').textContent = 'View Less';
        viewMoreBtn.classList.add('expanded');
      }
      
      currentIndex = 0;
      updateCarousel();
    });
  }
  
  // Lazy Load Videos
  $$('.video-container[data-video-id]').forEach(container => {
    const placeholder = container.querySelector('.video-placeholder');
    if (placeholder) {
      placeholder.addEventListener('click', function() {
        const videoId = container.getAttribute('data-video-id');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.title = 'YouTube video player';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none';
        
        container.innerHTML = '';
        container.appendChild(iframe);
      });
    }
  });
  
  window.addEventListener('resize', updateCarousel);
  updateCarousel();
};

// Initialize video carousel when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVideoCarousel);
} else {
  initVideoCarousel();
}

/* ========================================
   FADE-IN ANIMATIONS
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = $$('.featured-item, .service-card');
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + (index * 100));
  });
});
  