/* ==========================================================================
   Mobile World Hawera — main.js
   Vanilla ES2015+, no dependencies, no build step.

   Modules
   1. header()   sticky / blurred header state
   2. drawer()   mobile navigation drawer (focus trap, Esc, scroll lock)
   3. reveal()   IntersectionObserver scroll animations
   4. faq()      accessible accordion
   5. form()      quote form: validation, WhatsApp hand-off, mailto fallback
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

  /* Business contact details live in one place so the WhatsApp hand-off and
     the mailto fallback never drift apart from the markup. */
  var BUSINESS = {
    name: 'Mobile World Hawera',
    whatsapp: '64220863000',
    email: 'mobileworldhawera@gmail.com'
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
     5. Quote form
     No backend on Firebase Spark, so the form has two working paths:
       • WhatsApp  — composes the enquiry into a wa.me message (primary)
       • Email     — mailto: fallback with the enquiry pre-written
     To post to a form service later, add data-endpoint="https://…" to the
     <form> and the submit handler will POST JSON to it instead.
     ====================================================================== */
  function form() {
    var f = $('#quote-form');
    if (!f) return;

    var status = $('#form-status');

    function fieldError(input, message) {
      var holder = document.getElementById(input.id + '-error');
      if (holder) holder.textContent = message || '';
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }

    function validate() {
      var ok = true;
      var firstBad = null;
      $$('[data-required]', f).forEach(function (input) {
        var value = (input.value || '').trim();
        var message = '';
        if (!value) {
          message = 'Please fill in this field.';
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          message = 'Please enter a valid email address.';
        } else if (input.type === 'tel' && value.replace(/[^\d]/g, '').length < 7) {
          message = 'Please enter a contact number we can reach you on.';
        }
        fieldError(input, message);
        if (message) { ok = false; if (!firstBad) firstBad = input; }
      });
      if (firstBad) firstBad.focus();
      return ok;
    }

    function values() {
      var get = function (name) {
        var el = f.elements[name];
        return el && el.value ? el.value.trim() : '';
      };
      return {
        name: get('name'),
        phone: get('phone'),
        email: get('email'),
        device: get('device'),
        issue: get('issue'),
        message: get('message')
      };
    }

    function asText(v) {
      var lines = [
        'Name: ' + v.name,
        'Phone: ' + v.phone
      ];
      if (v.email) lines.push('Email: ' + v.email);
      lines.push('Device: ' + (v.device || 'Not specified'));
      lines.push('Repair issue: ' + (v.issue || 'Not specified'));
      if (v.message) lines.push('', 'Details: ' + v.message);
      return lines.join('\n');
    }

    function say(message) {
      if (!status) return;
      status.hidden = false;
      status.textContent = message;
    }

    // Clear an error as soon as the visitor starts fixing it
    $$('[data-required]', f).forEach(function (input) {
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid')) fieldError(input, '');
      });
    });

    // Primary: hand the enquiry to WhatsApp
    var waBtn = $('#form-whatsapp');
    if (waBtn) {
      waBtn.addEventListener('click', function () {
        if (!validate()) return;
        var v = values();
        var text = 'Hi ' + BUSINESS.name + ', I would like to enquire about a repair.\n\n' + asText(v);
        window.open('https://wa.me/' + BUSINESS.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
        say('Opening WhatsApp with your enquiry. If nothing happens, message us on +64 22 086 3000.');
      });
    }

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      var v = values();
      var endpoint = f.getAttribute('data-endpoint');

      // Path A — a form service has been connected
      if (endpoint) {
        var submit = $('#form-submit');
        if (submit) { submit.disabled = true; }
        say('Sending your request…');
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(v)
        }).then(function (res) {
          if (!res.ok) throw new Error('bad status ' + res.status);
          f.reset();
          say('Thanks ' + (v.name ? v.name.split(' ')[0] : '') + ' — your request has been sent. We will be in touch.');
        }).catch(function () {
          say('That did not send. Please message us on WhatsApp or call +64 3 927 2313.');
        }).finally(function () {
          if (submit) submit.disabled = false;
        });
        return;
      }

      // Path B — no backend: open the visitor's mail client with it written out
      var subject = 'Repair enquiry' + (v.device ? ' — ' + v.device : '');
      window.location.href = 'mailto:' + BUSINESS.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(asText(v));
      say('Opening your email app with the enquiry ready to send. Prefer WhatsApp? Use the button above.');
    });
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
    form();
    spotlight();
    misc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
