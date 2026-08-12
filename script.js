/**
 * Button Ripple Effect
 * Creates smooth ripple/wave effects when buttons are clicked
 */

document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.btn, .nav-link, .social-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple element
      createRipple(e, this);
    });
  });
});

function createRipple(event, button) {
  const rect = button.getBoundingClientRect();
  const diameter = Math.max(rect.width, rect.height);
  const radius = diameter / 2;
  
  // Calculate position relative to button
  const x = event.clientX - rect.left - radius;
  const y = event.clientY - rect.top - radius;
  
  // Create ripple element
  const ripple = document.createElement('span');
  ripple.className = 'btn-ripple';
  ripple.style.width = ripple.style.height = diameter + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.style.animation = `ripple 0.6s ease-out`;
  
  // Remove old ripples
  const oldRipples = button.querySelectorAll('.btn-ripple');
  oldRipples.forEach(ripple => ripple.remove());
  
  // Add new ripple
  button.appendChild(ripple);
  
  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

/**
 * Smooth scroll behavior for navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Skip if it's just "#"
    if (href === '#') return;
    
    const target = document.querySelector(href);
    
    if (target) {
      e.preventDefault();
      
      // Add scroll animation effect
      const targetPosition = target.getBoundingClientRect().top + window.scrollY;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 1000; // 1 second smooth scroll
      let startTime = null;
      
      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      }
      
      function scroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (progress < 1) {
          requestAnimationFrame(scroll);
        }
      }
      
      requestAnimationFrame(scroll);
    }
  });
});

/**
 * Add scroll wave effect on page scroll
 */
let ticking = false;
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      
      // Wave effect for reveal items
      const items = entry.target.querySelectorAll('.reveal-item');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, index * 100);
      });
      
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});

/**
 * Navbar scroll effect
 */
let lastScrollY = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
  if (!ticking) {
    window.requestAnimationFrame(function() {
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScrollY = scrollY;
      ticking = false;
    });
    ticking = true;
  }
});

/**
 * Mobile nav toggle
 */
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');

navToggle?.addEventListener('click', function() {
  this.classList.toggle('active');
  nav.classList.toggle('open');
});

// Close mobile nav when link is clicked
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function() {
    navToggle.classList.remove('active');
    nav.classList.remove('open');
  });
});

/**
 * Active nav link tracking
 */
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  
  navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollY >= sectionTop - 200) {
        current = link.getAttribute('href');
      }
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });
});

/**
 * Stat counter animation
 */
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(stat => {
  counterObserver.observe(stat);
});
