const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav nav');
if (menu && nav) {
  nav.id = nav.id || 'site-navigation';
  menu.setAttribute('aria-controls', nav.id);
  const closeMenu = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open menu');
  };
  closeMenu();
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  const desktop = window.matchMedia('(min-width: 1101px)');
  desktop.addEventListener('change', closeMenu);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      menu.focus();
    }
  });
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
