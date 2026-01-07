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

// Hero Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.carousel-dot');

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

// Auto-advance carousel
if (slides.length > 0) {
  setInterval(nextSlide, 5000);
  
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
  