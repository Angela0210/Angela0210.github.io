/* ═══════════════════════════════════════════════════════
   script.js — Angela Janevska Portfolio
═══════════════════════════════════════════════════════ */

'use strict';

/* ── Navbar scroll effect ── */
(function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ── Active nav link on scroll ── */
(function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ── Scroll fade-up animations ── */
(function initFadeUp() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();


/* ── Typing animation (hero role) ── */
(function initTyping() {
  const el = document.getElementById('typedRole');
  if (!el) return;

  const roles = [
    'Backend Developer',
    'Python Developer',
    '.NET Developer',
    'API Builder',
  ];

  let roleIndex = 0;
  let charIndex  = 0;
  let deleting   = false;
  let paused     = false;

  const TYPING_SPEED  = 65;   // ms per char
  const DELETE_SPEED  = 35;
  const PAUSE_END     = 1800; // pause when word complete
  const PAUSE_START   = 300;  // pause before next word

  function tick() {
    if (paused) return;

    const current = roles[roleIndex];

    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        paused = true;
        setTimeout(() => {
          paused   = false;
          deleting = true;
          tick();
        }, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPING_SPEED);

    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        deleting   = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        paused     = true;
        setTimeout(() => {
          paused = false;
          tick();
        }, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Small initial delay so page feels settled before typing starts
  setTimeout(tick, 600);
})();


/* ── Smooth close navbar on mobile link click ── */
(function initMobileNav() {
  const toggler    = document.querySelector('.navbar-toggler');
  const collapseEl = document.getElementById('navMenu');
  if (!collapseEl) return;

  const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });

  document.querySelectorAll('#navMenu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        bsCollapse.hide();
      }
    });
  });
})();


/* ── Contact form ── */
(function initContactForm() {
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simple client-side validation
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate a send (replace this block with your actual backend/Formspree/EmailJS call)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled    = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      showFeedback('Message sent! I\'ll get back to you within 24 hours. ✓', 'success');
      form.reset();
      btn.disabled    = false;
      btn.innerHTML   = 'Send Message <i class="bi bi-send ms-1"></i>';
    }, 1200);
  });

  function showFeedback(msg, type) {
    feedback.textContent  = msg;
    feedback.className    = `form-feedback ${type}`;
    setTimeout(() => {
      feedback.textContent = '';
      feedback.className   = 'form-feedback';
    }, 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();


/* ── Subtle parallax on hero avatar ── */
(function initParallax() {
  const avatar = document.querySelector('.avatar-wrapper');
  if (!avatar || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          const shift = scrolled * 0.08;
          avatar.style.transform = `translateY(${shift}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ── Keyboard accessibility: skip to main on Tab ── */
(function initSkipLink() {
  // Only add if not already in HTML
  if (document.getElementById('skip-link')) return;
  const skip = document.createElement('a');
  skip.id        = 'skip-link';
  skip.href      = '#hero';
  skip.textContent = 'Skip to content';
  skip.style.cssText = [
    'position:fixed',
    'top:-100px',
    'left:1rem',
    'z-index:9999',
    'background:var(--accent)',
    'color:#fff',
    'padding:0.5rem 1rem',
    'border-radius:8px',
    'font-weight:700',
    'transition:top 0.2s',
    'text-decoration:none',
  ].join(';');

  skip.addEventListener('focus', () => { skip.style.top = '1rem'; });
  skip.addEventListener('blur',  () => { skip.style.top = '-100px'; });

  document.body.prepend(skip);
})();
