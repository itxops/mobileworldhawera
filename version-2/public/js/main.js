/* ==========================================================================
   Mobile World Hawera — VERSION 2
   Plain ES5-flavoured JavaScript. No framework, no bundler, no dependencies —
   the file is served exactly as written.

   Modules: header · drawer · reveal · services · faq · marquees · rail · misc
   Every one bails out quietly if its markup is not on the page, so the same
   file serves the home page and the legal pages.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  var reduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ---------------------------------------------------------------- header
     Adds .is-stuck once the page has scrolled past the hero's first slice. */
  function header() {
    var el = $('.header');
    if (!el) return;
    var ticking = false;

    function update() {
      el.classList.toggle('is-stuck', window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------- drawer
     Opens the mobile panel, traps Tab inside it, and restores focus on close. */
  function drawer() {
    var panel = $('.drawer');
    var scrim = $('.scrim');
    var openBtn = $('.burger');
    var closeBtn = $('.drawer-close');
    if (!panel || !scrim || !openBtn) return;

    var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
    var lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      panel.classList.add('is-open');
      scrim.classList.add('is-open');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      // focus() is a no-op while the panel is still visibility:hidden, and a
      // rAF can still run before the style recalc — so force the recalc first.
      void panel.offsetWidth;
      var first = $(FOCUSABLE, panel);
      if (first) first.focus();
    }

    function close() {
      panel.classList.remove('is-open');
      scrim.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    scrim.addEventListener('click', close);

    // any link inside the drawer is a jump into the page, so close behind it
    $$('a', panel).forEach(function (a) { a.addEventListener('click', close); });

    document.addEventListener('keydown', function (e) {
      if (!panel.classList.contains('is-open')) return;

      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;

      var items = $$(FOCUSABLE, panel).filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------------------------------------------------------------- reveal
     Fades sections in as they arrive. Children of [data-reveal-group] are
     staggered by their index. */
  function reveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    // With reduced motion or no IntersectionObserver, show everything at once.
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    $$('[data-reveal-group]').forEach(function (group) {
      var step = parseInt(group.getAttribute('data-reveal-group'), 10) || 70;
      $$('[data-reveal]', group).forEach(function (el, i) {
        el.style.setProperty('--reveal-delay', Math.min(i * step, 420) + 'ms');
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    items.forEach(function (el) { io.observe(el); });

    // Safety net: anything already above the fold on load (or after a jump to
    // an anchor) should never be left sitting at opacity 0.
    function sweep() {
      $$('[data-reveal]:not(.is-in)').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.96 && r.bottom > 0) el.classList.add('is-in');
      });
    }
    window.addEventListener('load', sweep);
    window.addEventListener('scroll', sweep, { passive: true, once: false });
    setTimeout(sweep, 350);
  }

  /* -------------------------------------------------------------- services
     Hovering or focusing a service row cross-fades the sticky stage. Below
     960px the stage is display:none and each row shows its own thumbnail, so
     this becomes a no-op that costs nothing. */
  function services() {
    var rows = $$('.svc-row');
    var shots = $$('.svc-shot');
    if (!rows.length || !shots.length) return;

    function activate(i) {
      rows.forEach(function (r, n) { r.classList.toggle('is-active', n === i); });
      shots.forEach(function (s, n) { s.classList.toggle('is-active', n === i); });
    }

    rows.forEach(function (row, i) {
      row.addEventListener('mouseenter', function () { activate(i); });
      row.addEventListener('focus', function () { activate(i); });
    });

    activate(0);
  }

  /* ------------------------------------------------------------------- faq
     One open at a time. The panel animates via grid-template-rows, so there
     is no height to measure. */
  function faq() {
    var buttons = $$('.faq-q');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var isOpen = item.classList.contains('is-open');

        buttons.forEach(function (other) {
          var oi = other.closest('.faq-item');
          oi.classList.remove('is-open');
          other.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* -------------------------------------------------------------- marquees
     Pauses each row while it is off-screen, so a phone is not animating
     something nobody can see. */
  function marquees() {
    var rows = $$('.marquee');
    if (!rows.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var track = entry.target.querySelector('.marquee-track');
        if (!track) return;
        track.style.animationPlayState = entry.isIntersecting ? '' : 'paused';
      });
    }, { rootMargin: '200px 0px' });

    rows.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ rail
     Drops the "scroll for more" hint once the visitor has worked that out. */
  function rail() {
    var el = $('.rail');
    var hint = $('.rail-hint');
    if (!el || !hint) return;

    el.addEventListener('scroll', function () {
      if (el.scrollLeft > 24) {
        hint.style.opacity = '0';
        hint.style.transition = 'opacity .3s';
      }
    }, { passive: true, once: true });
  }

  /* ------------------------------------------------------------------ misc */
  function misc() {
    // copyright year
    $$('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    // Keep the footer clear of the sticky action bar by measuring it, rather
    // than hard-coding a height that drifts when the font or safe-area changes.
    var bar = $('.mobile-bar');
    function measure() {
      var h = bar && getComputedStyle(bar).display !== 'none' ? bar.offsetHeight : 0;
      document.documentElement.style.setProperty('--mobile-bar-h', h + 'px');
    }
    if (bar) {
      measure();
      window.addEventListener('resize', measure, { passive: true });
    }
  }

  /* ------------------------------------------------------------------ init */
  function init() {
    header();
    drawer();
    reveal();
    services();
    faq();
    marquees();
    rail();
    misc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
