/* =============================================
   Wedding Favours 4 You — Main JS
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // --- Hamburger Menu ---
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('is-open');
      navLinks.classList.toggle('nav-open');
      document.body.style.overflow = navLinks.classList.contains('nav-open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        navLinks.classList.remove('nav-open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Active Nav Link ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Header Shrink on Scroll ---
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Scroll Animation (IntersectionObserver) ---
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  if (animatedEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    animatedEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all
    animatedEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // --- Gallery Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        galleryCards.forEach(function (card) {
          const cardCategory = card.getAttribute('data-category');
          if (category === 'all' || cardCategory === category) {
            card.classList.remove('gallery-hidden');
          } else {
            card.classList.add('gallery-hidden');
          }
        });
      });
    });
  }

  // --- Contact Form (Netlify + SPA-style) ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
        contactForm.style.display = 'none';
        const success = document.getElementById('formSuccess');
        if (success) success.style.display = 'block';
      } catch (err) {
        alert('Something went wrong. Please try again or contact us directly via WhatsApp.');
      }
    });
  }

  // --- Reviews Rendering ---
  const reviewsContainer = document.getElementById('reviewsGrid');
  if (reviewsContainer && typeof reviewsData !== 'undefined') {
    reviewsData.forEach(function (review) {
      const card = document.createElement('div');
      card.className = 'review-card animate-on-scroll';
      card.innerHTML =
        '<p class="review-quote">' + escapeHtml(review.text) + '</p>';
      reviewsContainer.appendChild(card);
    });

    // Re-observe newly created cards
    const newCards = reviewsContainer.querySelectorAll('.animate-on-scroll');
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      newCards.forEach(function (el) { obs.observe(el); });
    } else {
      newCards.forEach(function (el) { el.classList.add('visible'); });
    }
  }

});

// --- Form Reset (called from inline onclick) ---
function resetForm() {
  const success = document.getElementById('formSuccess');
  const form    = document.getElementById('contactForm');
  if (success) success.style.display = 'none';
  if (form)    { form.style.display = 'block'; form.reset(); }
}

// --- HTML escape helper ---
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
