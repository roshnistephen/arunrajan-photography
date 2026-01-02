// Cinematic Scroll Effects
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  
  // Parallax effect on hero
  const hero = document.querySelector('.hero::before');
  if (hero) {
    document.documentElement.style.setProperty('--scroll', scrolled * 0.5 + 'px');
  }
  
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
  