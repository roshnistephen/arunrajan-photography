// Cinematic Scroll Effects
window.addEventListener("scroll", () => {
  // Fade in elements on scroll
  const elements = document.querySelectorAll('.featured-item, .service-card, .gallery-item');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.8;
    
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
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });
});
  