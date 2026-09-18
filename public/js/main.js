/* ==========================================================================
   Mobile World Hawera — main.js
   Vanilla ES2015+, no dependencies, no build step.

   Modules
   1. header()   sticky / blurred header state
   2. drawer()   mobile navigation drawer (focus trap, Esc, scroll lock)
   3. reveal()   IntersectionObserver scroll animations
   4. faq()       accessible accordion
   5. marquees()  pause the sliding rows while they are off screen
   6. spotlight() cursor-following highlight on cards
   7. misc()      footer year, external link hygiene
   ========================================================================== */
(function () {
  'use strict';

  /* ---- shared helpers -------------------------------------------------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };
  var prefersReducedMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /* ======================================================================
     1. Header — add .is-stuck once the page has scrolled
     ====================================================================== */
  function header() {
    var el = $('.site-header');
    if (!el) return;
    // The header is always opaque; .is-stuck only adds the drop shadow once
    // the page has moved off the top.
    var ticking = false;
    var apply = function () {
      el.classList.toggle('is-stuck', window.scrollY > 12);
      ticking = false;
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ======================================================================
     2. Mobile drawer
     ====================================================================== */
  function drawer() {
    var panel = $('#nav-drawer');
    var openers = $$('[data-drawer-open]');
    var closers = $$('[data-drawer-close]');
    if (!panel || !openers.length) return;

    var lastFocused = null;
    var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function setExpanded(state) {
      openers.forEach(function (b) { b.setAttribute('aria-expanded', String(state)); });
    }

    function open() {
      lastFocused = document.activeElement;
      panel.classList.add('is-open');
      panel.removeAttribute('inert');
      document.body.classList.add('nav-open');
      setExpanded(true);
      // focus() is a no-op while the panel is still visibility:hidden, and the
      // class change above has not been recalculated yet. Force a style flush
      // first; the drawer's visibility transition has no delay when opening.
      void panel.offsetWidth;
      var first = $(FOCUSABLE, panel);
      if (first) first.focus();
      document.addEventListener('keydown', onKeydown);
    }

    function close() {
      panel.classList.remove('is-open');
      panel.setAttribute('inert', '');
      document.body.classList.remove('nav-open');
      setExpanded(false);
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function onKeydown(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      // Keep tabbing inside the open drawer
      var items = $$(FOCUSABLE, panel).filter(function (n) {
        return n.offsetWidth > 0 || n.offsetHeight > 0;
      });
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    openers.forEach(function (b) {
      b.addEventListener('click', function () {
        panel.classList.contains('is-open') ? close() : open();
      });
    });
    closers.forEach(function (b) { b.addEventListener('click', close); });

    // Any in-drawer navigation should shut the drawer
    $$('a', panel).forEach(function (a) { a.addEventListener('click', close); });

    // If the viewport grows into the desktop layout, reset state
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 960 && panel.classList.contains('is-open')) close();
    });

    panel.setAttribute('inert', '');
    setExpanded(false);
  }

  /* ======================================================================
     3. Scroll reveal
     ====================================================================== */
  function reveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    // No IntersectionObserver, or the user asked for less motion: show everything.
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) {
      // Stagger children of a shared container for a cascade effect
      var stagger = el.getAttribute('data-reveal-delay');
      if (stagger) el.style.setProperty('--reveal-delay', stagger + 'ms');
      io.observe(el);
    });

    // Auto-stagger any group marked up as a reveal group
    $$('[data-reveal-group]').forEach(function (group) {
      var step = parseInt(group.getAttribute('data-reveal-group'), 10) || 70;
      $$('[data-reveal]', group).forEach(function (child, i) {
        if (!child.getAttribute('data-reveal-delay')) {
          child.style.setProperty('--reveal-delay', Math.min(i * step, 480) + 'ms');
        }
      });
    });

    // Safety net: a fast flick-scroll can carry an element through the viewport
    // between two IntersectionObserver samples, which would leave it invisible
    // for good. Sweep anything the page has already scrolled past. The listener
    // removes itself once everything has been revealed.
    var sweeping = false;
    function sweep() {
      sweeping = false;
      var pending = $$('[data-reveal]').filter(function (el) {
        return !el.classList.contains('is-visible');
      });
      pending.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
      if (!pending.length) window.removeEventListener('scroll', onScroll);
    }
    function onScroll() {
      if (!sweeping) { sweeping = true; window.requestAnimationFrame(sweep); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ======================================================================
     4. FAQ accordion
     ====================================================================== */
  function faq() {
    var buttons = $$('.faq-q');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        // The answer collapses via CSS (grid-template-rows + visibility), so
        // there is no hidden attribute to juggle here.
        item.classList.toggle('is-open', !isOpen);
      });
    });
  }

  /* ======================================================================
     5. Marquees
     The brand and review rows loop forever. Left running while scrolled past,
     they keep a compositing layer animating for nothing — which on a phone is
     wasted battery. Pause them whenever they are off screen.
     ====================================================================== */
  function marquees() {
    var tracks = $$('.marquee-track');
    if (!tracks.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var track = entry.target.querySelector('.marquee-track');
        if (!track) return;
        track.style.animationPlayState = entry.isIntersecting ? '' : 'paused';
      });
    }, { rootMargin: '200px 0px' });

    $$('.marquee').forEach(function (el) { io.observe(el); });
  }

  /* ======================================================================
     6. Card spotlight
     Feeds the cursor position into --mx/--my so the CSS radial highlight can
     follow it. Pointer-only, rAF-throttled, and skipped entirely on touch
     devices and when reduced motion is requested.
     ====================================================================== */
  function spotlight() {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var cards = $$('.gcard');
    if (!cards.length) return;

    var queued = false;
    var pending = [];

    function flush() {
      queued = false;
      for (var i = 0; i < pending.length; i++) {
        var p = pending[i];
        p.el.style.setProperty('--mx', p.x + 'px');
        p.el.style.setProperty('--my', p.y + 'px');
      }
      pending.length = 0;
    }

    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        pending.push({ el: card, x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) });
        if (!queued) { queued = true; window.requestAnimationFrame(flush); }
      });
    });
  }

  /* ======================================================================
     7. Odds and ends
     ====================================================================== */
  function misc() {
    $$('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    // Anything opening in a new tab gets the safe rel pairing
    $$('a[target="_blank"]').forEach(function (a) {
      var rel = a.getAttribute('rel') || '';
      if (rel.indexOf('noopener') === -1) a.setAttribute('rel', (rel + ' noopener noreferrer').trim());
    });
  }

  /* ---- boot ------------------------------------------------------------ */
  function init() {
    header();
    drawer();
    reveal();
    faq();
    marquees();
    spotlight();
    misc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
