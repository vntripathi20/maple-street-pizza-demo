document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-menu');
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('nav-open', open);
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('nav-open')));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  // Print menu handler (buttons with data-print)
  document.querySelectorAll('[data-print="menu"]').forEach(btn => {
    btn.addEventListener('click', () => window.print());
  });

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // Open / closed status (Sun=0 … Sat=6), times in 24h
  const hours = { 0: [11, 22], 1: [11, 22], 2: [11, 22], 3: [11, 22], 4: [11, 22], 5: [11, 23], 6: [11, 23] };
  const fmt = h => (h % 12 || 12) + (h < 12 || h === 24 ? 'am' : 'pm');
  const now = new Date();
  const [open, close] = hours[now.getDay()];
  const h = now.getHours() + now.getMinutes() / 60;
  const isOpen = h >= open && h < close;
  document.querySelectorAll('[data-open-status]').forEach(pill => {
    pill.classList.add(isOpen ? 'open' : 'closed');
    pill.querySelector('[data-open-text]').textContent = isOpen
      ? 'Open now · until ' + fmt(close)
      : (h < open ? 'Closed · opens today at ' + fmt(open) : 'Closed · opens tomorrow at ' + fmt(hours[(now.getDay() + 1) % 7][0]));
  });

  // Highlight today in hours list
  document.querySelectorAll('#hours-list li').forEach(li => {
    if (li.dataset.days.split(',').includes(String(now.getDay()))) li.classList.add('today');
  });

  // Active menu tab on scroll
  const tabs = document.querySelectorAll('.menu-tabs a');
  if (tabs.length && 'IntersectionObserver' in window) {
    const sections = [...tabs].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tabs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  // Demo contact form
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (form && success) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      success.classList.add('show');
      form.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
});
