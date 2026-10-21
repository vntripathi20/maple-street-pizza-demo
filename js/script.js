document.addEventListener('DOMContentLoaded', function () {
  // Print menu handler (elements with data-print)
  document.querySelectorAll('[data-print="menu"]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); window.print(); });
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
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // Open / closed status (Sun=0 ... Sat=6), 24h times
  const hours = { 0: [11, 22], 1: [11, 22], 2: [11, 22], 3: [11, 22], 4: [11, 22], 5: [11, 23], 6: [11, 23] };
  const fmt = h => (h % 12 || 12) + (h < 12 ? 'am' : 'pm');
  const now = new Date();
  const day = now.getDay();
  const [open, close] = hours[day];
  const h = now.getHours() + now.getMinutes() / 60;
  const isOpen = h >= open && h < close;
  const text = isOpen
    ? 'Open now until ' + fmt(close)
    : (h < open ? 'Closed. Opens today at ' + fmt(open) : 'Closed. Opens tomorrow at ' + fmt(hours[(day + 1) % 7][0]));
  document.querySelectorAll('[data-status]').forEach(el => {
    el.classList.toggle('is-open', isOpen);
    const t = el.querySelector('[data-status-text]');
    if (t) t.textContent = text;
  });

  // Highlight today in the hours table
  document.querySelectorAll('#hours-table tr').forEach(tr => {
    if (tr.dataset.days.split(',').includes(String(day))) tr.classList.add('today');
  });

  // Menu index follows scroll position
  const links = document.querySelectorAll('.menu-index a');
  if (links.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
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
    });
  }
});
