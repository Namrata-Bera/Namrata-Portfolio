(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('namrata-theme'); } catch { /* Storage can be unavailable for local files. */ }
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  const updateThemeButton = () => {
    const light = root.dataset.theme === 'light';
    themeButton.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    themeButton.querySelector('.theme-icon').textContent = light ? '☾' : '☼';
    document.querySelector('meta[name="theme-color"]').content = light ? '#f7f8f4' : '#101514';
  };
  updateThemeButton();
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('namrata-theme', root.dataset.theme); } catch { /* Theme still applies for this visit. */ }
    updateThemeButton();
  });

  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navLinks.classList.toggle('open', open);
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }));

  const projects = [...document.querySelectorAll('.project-card')];
  document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projects.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
  }));

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-visible'));

  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.querySelectorAll('a[href^="#"]').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    }), { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  const backToTop = document.querySelector('.back-to-top');
  const onScroll = () => backToTop.classList.toggle('visible', window.scrollY > 500);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  document.querySelector('#year').textContent = new Date().getFullYear();

  document.querySelector('#contact-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.querySelector('#form-status');
    if (!form.reportValidity()) { status.textContent = 'Please check the highlighted fields and try again.'; return; }
    const data = new FormData(form);
    const subject = encodeURIComponent(data.get('subject').trim());
    const body = encodeURIComponent(`Name: ${data.get('name').trim()}\nEmail: ${data.get('email').trim()}\n\n${data.get('message').trim()}`);
    status.textContent = 'Opening your email app…';
    window.location.href = `mailto:Namrata.kiary@gmail.com?subject=${subject}&body=${body}`;
  });
})();
