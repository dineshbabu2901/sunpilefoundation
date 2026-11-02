/* =====================================================================
  SUN PILE FOUNDATION · V6 MOTION & PHOTO CAROUSELS
  No third-party packages, analytics or build tool.
  Edit the homepage carousel IMAGES in index.html.
  Optional autoplay interval: adjust CAROUSEL_DELAY below (milliseconds).
  Users who request reduced motion never receive automatic slides/scrolling.
===================================================================== */
(() => {
  'use strict';
  const CAROUSEL_DELAY = 6200; // EASY EDIT: time between photos, in milliseconds
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Simple reading progress on every page. Uses one requestAnimationFrame per scroll.
  const progress = document.querySelector('[data-progress]');
  if (progress) {
    let pending = false;
    const update = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--read-progress', `${available > 0 ? Math.min(100, Math.max(0, window.scrollY / available * 100)) : 0}%`);
      pending = false;
    };
    window.addEventListener('scroll', () => {
      if (!pending) { pending = true; requestAnimationFrame(update); }
    }, {passive: true});
    window.addEventListener('resize', update);
    update();
  }

  // Four-photo homepage slideshow. Buttons work even when autoplay is disabled.
  const carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    const slides = [...carousel.querySelectorAll('[data-slide]')];
    const controls = document.querySelector('.hero-controls');
    const count = document.querySelector('[data-hero-count]');
    const prev = controls?.querySelector('[data-hero-action="prev"]');
    const next = controls?.querySelector('[data-hero-action="next"]');
    const pause = controls?.querySelector('[data-hero-action="pause"]');
    const stage = carousel.closest('.hero-media');
    let index = 0;
    let playing = !reducedMotion;
    let interval = null;
    const draw = (newIndex) => {
      index = (newIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      if (count) count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    };
    const stop = () => { if (interval !== null) clearInterval(interval); interval = null; };
    const start = () => {
      stop();
      if (playing && !document.hidden && !stage.matches(':hover') && !stage.matches(':focus-within')) {
        interval = setInterval(() => draw(index + 1), CAROUSEL_DELAY);
      }
    };
    const setPauseLabel = () => {
      if (!pause) return;
      pause.textContent = playing ? 'Ⅱ' : '▶';
      pause.setAttribute('aria-label', playing ? 'Pause automatic slideshow' : 'Resume automatic slideshow');
      pause.setAttribute('aria-pressed', String(!playing));
    };
    prev?.addEventListener('click', () => { draw(index - 1); start(); });
    next?.addEventListener('click', () => { draw(index + 1); start(); });
    pause?.addEventListener('click', () => { playing = !playing; setPauseLabel(); start(); });
    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', start);
    stage.addEventListener('focusin', stop);
    stage.addEventListener('focusout', () => requestAnimationFrame(start));
    document.addEventListener('visibilitychange', start);
    draw(0);setPauseLabel();start();
  }

  // Horizontal photo rail: always scrollable by touch, keyboard or arrow buttons.
  const rail = document.querySelector('[data-field-rail]');
  if (rail) {
    document.querySelectorAll('[data-field-action]').forEach(button => {
      button.addEventListener('click', () => {
        const first = rail.querySelector('.field-shot');
        const distance = (first?.getBoundingClientRect().width || 350) + 18;
        const direction = button.dataset.fieldAction === 'next' ? 1 : -1;
        rail.scrollBy({left:direction * distance, behavior:reducedMotion ? 'instant' : 'smooth'});
      });
    });
  }

  // Gentle on-scroll reveal. Content remains visible if JS or observer unavailable.
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const elements = [...document.querySelectorAll('[data-reveal]')].filter(element =>
      element.getBoundingClientRect().top > window.innerHeight * 0.92
    );
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('motion-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:'0px 0px 55px 0px'});
    elements.forEach(element => {element.classList.add('motion-pending');observer.observe(element);});
  }
})();
