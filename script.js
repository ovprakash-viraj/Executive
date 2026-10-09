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


/* Shared article feedback form: renders on individual article and guide chapter pages. */
(() => {
  const pathname = location.pathname;
  const isArticle = !/^\/(?:articles|implementation-guide)\/?$/.test(pathname)
    && (pathname.startsWith('/implementation-guide/chapter-') || !!document.querySelector('main article'));
  if (!isArticle || document.getElementById('reader-reply')) return;
  const main = document.querySelector('main');
  if (!main) return;
  const section = document.createElement('section');
  section.id = 'reader-reply';
  section.className = 'reader-reply-section';
  section.setAttribute('aria-labelledby', 'reader-reply-title');
  section.innerHTML = `
    <div class="reader-reply-box">
      <h2 id="reader-reply-title">Leave a Reply</h2>
      <p class="reader-reply-intro">Your email address will not be published. Required fields are marked <span aria-hidden="true">*</span></p>
      <form id="reader-reply-form">
        <label for="reader-comment">Comment <span aria-hidden="true">*</span></label>
        <textarea id="reader-comment" name="message" rows="7" maxlength="5000" required></textarea>
        <label for="reader-name">Name <span aria-hidden="true">*</span></label>
        <input id="reader-name" name="name" type="text" autocomplete="name" maxlength="100" required>
        <label for="reader-email">Email <span aria-hidden="true">*</span></label>
        <input id="reader-email" name="email" type="email" autocomplete="email" maxlength="254" required>
        <label for="reader-website">Website</label>
        <input id="reader-website" name="website" type="url" autocomplete="url" maxlength="300" placeholder="https://">
        <div class="reader-reply-hidden" aria-hidden="true"><label for="reader-company">Leave this field empty</label><input id="reader-company" name="_honey" type="text" tabindex="-1" autocomplete="off"></div>
        <label class="reader-reply-save" for="reader-save"><input id="reader-save" type="checkbox"> <span>Save my name, email, and website in this browser for the next time I comment.</span></label>
        <p class="reader-reply-note">Comments are sent privately for review and are not displayed publicly.</p>
        <button type="submit" class="reader-reply-button">Post Comment</button>
        <p id="reader-reply-status" class="reader-reply-status" role="status" aria-live="polite"></p>
      </form>
    </div>`;
  const footerResources = main.querySelector('.guide-related-resources');
  if (footerResources) main.insertBefore(section, footerResources);
  else main.appendChild(section);
  const form = section.querySelector('form');
  const save = section.querySelector('#reader-save');
  const status = section.querySelector('#reader-reply-status');
  const button = section.querySelector('button');
  const storageKey = 'ov-reader-reply';
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') {
      ['name','email','website'].forEach(key => {
        if (typeof saved[key] === 'string') form.elements[key].value = saved[key];
      });
      save.checked = true;
    }
  } catch (_) { /* Private browsing can block storage. */ }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (form.elements._honey.value) return;
    status.textContent = 'Sending your comment…';
    button.disabled = true;
    const payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      website: form.elements.website.value.trim(),
      message: form.elements.message.value.trim(),
      _subject: 'Website comment: ' + document.title.slice(0, 110),
      _replyto: form.elements.email.value.trim(),
      article: location.href
    };
    if (!payload.message || !payload.name || !payload.email) {
      status.textContent = 'Please complete all required fields.';
      button.disabled = false;
      return;
    }
    try {
      const response = await fetch('https://formsubmit.co/ajax/ovprakash@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || result.success === false || result.success === 'false') throw new Error('Submission failed');
      try {
        if (save.checked) localStorage.setItem(storageKey, JSON.stringify({
          name: payload.name, email: payload.email, website: payload.website
        }));
        else localStorage.removeItem(storageKey);
      } catch (_) { /* Submission still succeeds without local storage. */ }
      form.elements.message.value = '';
      status.textContent = 'Thank you! Your comment has been submitted for review.';
    } catch (_) {
      status.textContent = 'Unable to submit right now. Please try again later.';
    } finally {
      button.disabled = false;
    }
  });
})();
