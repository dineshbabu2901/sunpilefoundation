/* ==============================================================
   SUN PILE FOUNDATION · Site interactions
   No framework, no trackers, no external JavaScript packages.
   Functions: responsive nav, optional social links, gallery, enquiry.
   ============================================================= */
(function () {
  'use strict';
  const conf = window.SUNPILE || {};
  const nav = document.querySelector('#primary-links');
  const menu = document.querySelector('[data-menu-toggle]');
  if (nav && menu) {
    menu.addEventListener('click', () => {
      const opened = nav.classList.toggle('is-open');
      menu.setAttribute('aria-expanded', String(opened));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Only reveal authentic company accounts when URLs have been set.
  document.querySelectorAll('[data-social]').forEach(link => {
    const network = link.dataset.social;
    const url = conf.social && conf.social[network];
    if (url && /^https:\/\//i.test(url)) { link.href = url; link.hidden = false; }
    else { link.hidden = true; }
  });

  // Real project-enquiry message: opens WhatsApp/email on the visitor's device.
  // GitHub Pages does not store any form submissions in a database.
  const enquiry = document.querySelector('#project-enquiry');
  if (enquiry) {
    const buildMessage = () => {
      const form = new FormData(enquiry);
      return [
        'Hello Sun Pile Foundation, I would like a project quotation.',
        'Name: ' + (form.get('name') || ''),
        'Phone: ' + (form.get('phone') || ''),
        'Site location: ' + (form.get('location') || ''),
        'Service: ' + (form.get('service') || ''),
        'Requirements: ' + (form.get('message') || '')
      ].join('\n');
    };
    enquiry.addEventListener('submit', e => {
      e.preventDefault();
      if (!enquiry.reportValidity()) return;
      window.open('https://wa.me/' + encodeURIComponent(conf.whatsapp || '917094756019') + '?text=' + encodeURIComponent(buildMessage()), '_blank', 'noopener,noreferrer');
      const status = document.querySelector('#form-status');
      if (status) status.textContent = 'Your WhatsApp message is ready. Please press Send in WhatsApp to finish your enquiry.';
    });
    const emailButton = document.querySelector('[data-email-enquiry]');
    if (emailButton) emailButton.addEventListener('click', () => {
      if (!enquiry.reportValidity()) return;
      const sub = encodeURIComponent('Foundation work enquiry — Sun Pile Foundation');
      window.location.href = 'mailto:' + (conf.email || 'sunpilefoundation26@gmail.com') + '?subject=' + sub + '&body=' + encodeURIComponent(buildMessage());
    });
  }

  // Filter supplied, on-site photographs by visible category.
  const filters = Array.from(document.querySelectorAll('[data-gallery-filter]'));
  const galleryItems = Array.from(document.querySelectorAll('[data-gallery-card]'));
  const galleryCount = document.querySelector('#gallery-count');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.galleryFilter;
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let visible = 0;
    galleryItems.forEach(card => {
      const show = category === 'all' || card.dataset.category === category;
      card.hidden = !show;
      if (show) visible++;
    });
    if (galleryCount) galleryCount.textContent = 'Showing ' + visible + ' site photographs';
  }));

  // Accessible native <dialog> gallery lightbox (arrows also work on keyboard).
  const dialog = document.querySelector('#photo-lightbox');
  if (dialog && galleryItems.length) {
    const img = dialog.querySelector('img');
    const label = dialog.querySelector('[data-lightbox-label]');
    let active = 0;
    const displayed = () => galleryItems.filter(el => !el.hidden);
    const show = idx => {
      const list = displayed(); if (!list.length) return;
      active = (idx + list.length) % list.length;
      const card = list[active]; img.src = card.dataset.full; img.alt = card.dataset.caption;
      label.textContent = card.dataset.caption + ' · ' + (active + 1) + ' / ' + list.length;
    };
    galleryItems.forEach(card => card.addEventListener('click', () => {
      show(displayed().indexOf(card));
      if (!dialog.open) dialog.showModal();
    }));
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-prev]').addEventListener('click', () => show(active - 1));
    dialog.querySelector('[data-next]').addEventListener('click', () => show(active + 1));
    dialog.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') show(active - 1);
      if (e.key === 'ArrowRight') show(active + 1);
    });
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  }
})();
