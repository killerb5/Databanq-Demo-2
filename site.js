document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const closeLinks = document.querySelectorAll('[data-close-menu]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const statValues = document.querySelectorAll('.stat-value[data-count]');

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 12);
  };

  const setActiveNav = () => {
    if (!navLinks.length) return;
    const scrollPoint = window.scrollY + 140;
    let activeId = '';

    document.querySelectorAll('section[id]').forEach((section) => {
      if (scrollPoint >= section.offsetTop) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', !!targetId && targetId === activeId);
    });
  };

  const animateValue = (node) => {
    const end = Number(node.dataset.count || '0');
    if (!end) return;
    const suffix = node.textContent.replace(/[0-9]/g, '');
    const duration = 900;
    const startTime = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.round(end * progress);
      node.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  onScroll();
  setActiveNav();
  window.addEventListener('scroll', () => {
    onScroll();
    setActiveNav();
  }, { passive: true });

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
    });

    closeLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.matches('.stat-value[data-count]')) {
          animateValue(entry.target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .stat-value[data-count]').forEach((node) => observer.observe(node));
});
