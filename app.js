const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu a');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealEls.forEach((el) => revealObserver.observe(el));

// Smooth scroll con curva de desaceleración
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + window.scrollY - 80;
    const distance = end - start;
    const duration = 1200;
    let startTime = null;

    // Curva ease-in-out-cubic: arranca suave, acelera y frena suave
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = Math.min((timestamp - startTime) / duration, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(elapsed));
      if (elapsed < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
});


const parallaxLayers = document.querySelectorAll('.parallax-bg');

function updateParallax() {
  parallaxLayers.forEach((layer) => {
    const section = layer.parentElement;
    const rect = section.getBoundingClientRect();
    const windowH = window.innerHeight;
    // Solo calcular cuando la sección es visible
    if (rect.bottom < 0 || rect.top > windowH) return;
    const progress = (windowH - rect.top) / (windowH + rect.height);
    const offset = (progress - 0.5) * 80;
    layer.style.transform = `translateY(${offset}px)`;
  });
}

window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();
