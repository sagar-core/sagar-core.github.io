// ==========================================================================
// Mobile Menu Navigation
// ==========================================================================
const menu = document.getElementById('menu');
const burger = document.getElementById('burger');

if (burger && menu) {
  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    burger.textContent = isOpen ? '✕' : '☰';
  });

  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.textContent = '☰';
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.textContent = '☰';
    }
  });
}

// ==========================================================================
// Dynamic Footer Year & Scroll Progress Bar
// ==========================================================================
const yrEl = document.getElementById('yr');
if (yrEl) {
  yrEl.textContent = new Date().getFullYear();
}

const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (progressBar && docHeight > 0) {
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  }
}, { passive: true });



// ==========================================================================
// Skill Tabs Switching (Bento Cards)
// ==========================================================================
const tabs = document.querySelectorAll('.tabs button');
const panels = document.querySelectorAll('.panel');

function showPanel(tabId) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabId;
    tab.classList.toggle('on', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  panels.forEach((panel) => {
    const isTarget = panel.id === tabId;
    panel.classList.toggle('on', isTarget);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    showPanel(tab.dataset.tab);
  });
});

// ==========================================================================
// Animated Count-Up Numbers
// ==========================================================================
function countUp(el) {
  const end = parseFloat(el.dataset.count);
  const dec = +el.dataset.dec || 0;
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out cubic formula
    const current = end * (1 - Math.pow(1 - progress, 3));
    el.textContent = current.toFixed(dec);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = end.toFixed(dec);
    }
  }

  requestAnimationFrame(tick);
}

// ==========================================================================
// Scroll Reveal Observer
// ==========================================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');

    // Trigger count-up numbers when visible
    entry.target.querySelectorAll('[data-count]').forEach((counter) => {
      countUp(counter);
    });

    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

// ==========================================================================
// Active Section Nav Spy
// ==========================================================================
const navLinks = [...document.querySelectorAll('#menu a')];
const sections = document.querySelectorAll('main section[id]');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const activeId = '#' + entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('on', link.getAttribute('href') === activeId);
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach((section) => {
  spyObserver.observe(section);
});

// ==========================================================================
// Copy Email to Clipboard with Visual Feedback
// ==========================================================================
const toast = document.getElementById('toast');
const copyButtons = document.querySelectorAll('[data-copy]');

copyButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const textToCopy = btn.dataset.copy;
    const textSpan = btn.querySelector('.btn-text');
    const originalText = textSpan ? textSpan.textContent : btn.textContent;

    try {
      await navigator.clipboard.writeText(textToCopy);

      if (textSpan) {
        textSpan.textContent = '✓ Email Copied!';
      }

      if (toast) {
        toast.textContent = 'Copied to clipboard: ' + textToCopy;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      }

      setTimeout(() => {
        if (textSpan) textSpan.textContent = originalText;
      }, 2500);
    } catch (err) {
      console.warn('Clipboard write failed, fallbacking:', err);
      // Fallback
      const tempInput = document.createElement('input');
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);

      if (toast) {
        toast.textContent = 'Copied to clipboard!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      }
    }
  });
});
