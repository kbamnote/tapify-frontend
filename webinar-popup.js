/**
 * Webinar invitation popup for the public Tapify site.
 *
 * Shows once, shortly after the visitor starts scrolling, on the marketing
 * pages only. Self-contained on purpose — it injects its own CSS and markup
 * and depends on nothing else, so it drops onto pages that share no
 * stylesheet and comes off again by deleting one <script> line per page.
 *
 * ── THE THREE THINGS THAT MAKE A POPUP TOLERABLE ─────────────────────────
 *
 * 1. IT EXPIRES BY ITSELF. `EVENT_ENDS` is checked before anything renders.
 *    The single worst outcome here is not an annoying popup — it is a popup
 *    still inviting people to a webinar that happened last month, which says
 *    more about the company than the webinar ever could. Nobody remembers to
 *    take these down, so it takes itself down.
 *
 * 2. IT TAKES NO FOR AN ANSWER. Dismissing hides it for DISMISS_DAYS;
 *    clicking through hides it for good. Both survive page changes, so it
 *    cannot reappear on the next click.
 *
 * 3. IT IS NOT ON EVERY PAGE. Never on the registration page itself (they are
 *    already there), and never on a customer's own vCard — that page belongs
 *    to the customer, not to Tapify's marketing.
 *
 * Deliberately NOT an exit-intent popup: those fire on a mouse leaving the
 * viewport, which on a laptop trackpad happens constantly by accident and on
 * a phone never happens at all.
 */
(function () {
    'use strict';

    /* ── the session ─────────────────────────────────────────────────── */
    var CFG = {
        dateLong: 'Sunday, 15 November',
        time: '11:30 AM IST',
        via: 'Google Meet',
        href: '/webinar-registration',
        // Local time. After this the popup never renders again, anywhere.
        // Set to the END of the session, not the start.
        eventEnds: new Date('2026-11-15T13:30:00+05:30'),
    };

    var SCROLL_TRIGGER = 350;   // px — "scrolls slightly", not half the page
    var SHOW_DELAY_MS = 450;    // let the scroll settle so it does not jump out
    var DISMISS_DAYS = 7;
    var KEY = 'tf_webinar_popup_v1';

    /* ── should it run at all? ───────────────────────────────────────── */

    // Over and done with. Nothing below this line will ever execute again.
    if (new Date() > CFG.eventEnds) return;

    var path = (location.pathname || '').toLowerCase().replace(/\/+$/, '');
    // The registration page, and anything that is somebody else's page rather
    // than ours. A card belongs to the customer who bought it.
    var BLOCKED = ['/webinar-registration', '/vcard', '/login', '/delete-account'];
    for (var i = 0; i < BLOCKED.length; i++) {
        if (path === BLOCKED[i] || path.indexOf(BLOCKED[i] + '.html') === 0) return;
    }

    // Private windows throw on localStorage rather than returning null, and a
    // popup is not worth a thrown exception on someone's homepage.
    function remembered() {
        try {
            var v = localStorage.getItem(KEY);
            if (!v) return null;
            return JSON.parse(v);
        } catch (e) { return null; }
    }
    function remember(state) {
        try { localStorage.setItem(KEY, JSON.stringify({ s: state, at: Date.now() })); }
        catch (e) { /* nothing to do, and nothing worth breaking for */ }
    }

    var seen = remembered();
    if (seen) {
        if (seen.s === 'registered') return;                 // gone for good
        if (seen.s === 'dismissed'
            && Date.now() - seen.at < DISMISS_DAYS * 864e5) return;
    }

    /* ── markup + styles, injected ───────────────────────────────────── */
    var CSS = ''
      + '.tfwb-ov{position:fixed;inset:0;z-index:99990;display:flex;align-items:center;'
      + 'justify-content:center;padding:18px;background:rgba(10,36,37,.62);'
      + 'opacity:0;transition:opacity .25s ease}'
      + '.tfwb-ov.on{opacity:1}'
      + '.tfwb{position:relative;width:100%;max-width:430px;background:#fff;border-radius:18px;'
      + 'overflow:hidden;box-shadow:0 26px 70px rgba(0,0,0,.34);transform:translateY(14px) scale(.98);'
      + 'transition:transform .28s cubic-bezier(.2,.8,.3,1);'
      + 'font-family:Poppins,system-ui,-apple-system,sans-serif;color:#153e3f}'
      + '.tfwb-ov.on .tfwb{transform:none}'
      + '.tfwb-top{background:linear-gradient(150deg,#153e3f,#1d5253 62%,#27696a);color:#fff;padding:24px 24px 20px}'
      + '.tfwb-pill{display:inline-block;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);'
      + 'padding:5px 12px;border-radius:999px;font-size:.66rem;font-weight:800;letter-spacing:.5px;margin-bottom:12px}'
      + '.tfwb-top h3{margin:0 0 8px;font-size:1.32rem;line-height:1.28;font-weight:800;letter-spacing:-.4px}'
      + '.tfwb-top h3 span{color:#ffd79a}'
      + '.tfwb-top p{margin:0;font-size:.85rem;color:#cfe0e0;line-height:1.55}'
      + '.tfwb-body{padding:18px 24px 22px}'
      + '.tfwb-when{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:16px}'
      + '.tfwb-when span{background:#f6eee6;border:1px solid #e9ddcc;border-radius:9px;'
      + 'padding:7px 11px;font-size:.76rem;font-weight:700;color:#153e3f}'
      + '.tfwb-cta{display:block;width:100%;padding:14px;border-radius:11px;background:#d19a66;'
      + 'color:#2b1c0c;font-weight:800;font-size:.97rem;text-align:center;text-decoration:none;'
      + 'border:0;cursor:pointer;font-family:inherit}'
      + '.tfwb-cta:hover{background:#c78e58;color:#2b1c0c}'
      + '.tfwb-no{display:block;width:100%;margin-top:9px;background:none;border:0;cursor:pointer;'
      + 'font-family:inherit;font-size:.78rem;color:#7c8d8d;padding:7px}'
      + '.tfwb-no:hover{color:#153e3f;text-decoration:underline}'
      + '.tfwb-x{position:absolute;top:11px;right:12px;width:30px;height:30px;border-radius:50%;'
      + 'border:0;cursor:pointer;background:rgba(255,255,255,.17);color:#fff;font-size:1.05rem;'
      + 'line-height:1;font-family:inherit}'
      + '.tfwb-x:hover{background:rgba(255,255,255,.3)}'
      + '@media(max-width:420px){.tfwb-top h3{font-size:1.16rem}.tfwb-top,.tfwb-body{padding-left:18px;padding-right:18px}}'
      + '@media(prefers-reduced-motion:reduce){.tfwb-ov,.tfwb{transition:none}}';

    var overlay, lastFocus;

    function build() {
        var style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        overlay = document.createElement('div');
        overlay.className = 'tfwb-ov';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'tfwbTitle');
        overlay.innerHTML =
            '<div class="tfwb">'
          +   '<button class="tfwb-x" type="button" aria-label="Close">&times;</button>'
          +   '<div class="tfwb-top">'
          +     '<span class="tfwb-pill">FREE LIVE SESSION</span>'
          +     '<h3 id="tfwbTitle">How to actually grow your business <span>using Tapify</span></h3>'
          +     '<p>Get found on Google, collect reviews on purpose, and stop losing the enquiry '
          +       'that arrives after you have shut. Ninety minutes, live, free.</p>'
          +   '</div>'
          +   '<div class="tfwb-body">'
          +     '<div class="tfwb-when">'
          +       '<span>&#128197; ' + CFG.dateLong + '</span>'
          +       '<span>&#128336; ' + CFG.time + '</span>'
          +       '<span>&#127909; ' + CFG.via + '</span>'
          +     '</div>'
          +     '<a class="tfwb-cta" href="' + CFG.href + '">Save my free seat</a>'
          +     '<button class="tfwb-no" type="button">No thanks, maybe later</button>'
          +   '</div>'
          + '</div>';
        document.body.appendChild(overlay);

        overlay.querySelector('.tfwb-cta').addEventListener('click', function () {
            remember('registered');          // they are on their way; do not ask again
        });
        overlay.querySelector('.tfwb-x').addEventListener('click', close);
        overlay.querySelector('.tfwb-no').addEventListener('click', close);
        // Only the backdrop itself, never a click that started inside the card.
        overlay.addEventListener('mousedown', function (e) {
            if (e.target === overlay) close();
        });
        document.addEventListener('keydown', onKey);

        lastFocus = document.activeElement;
        requestAnimationFrame(function () {
            overlay.classList.add('on');
            var cta = overlay.querySelector('.tfwb-cta');
            if (cta) cta.focus();
        });
    }

    function onKey(e) {
        if (e.key === 'Escape') close();
    }

    function close() {
        if (!overlay) return;
        remember('dismissed');
        document.removeEventListener('keydown', onKey);
        overlay.classList.remove('on');
        var dead = overlay;
        overlay = null;
        setTimeout(function () {
            if (dead && dead.parentNode) dead.parentNode.removeChild(dead);
            // Put focus back where the visitor left it rather than at the top
            // of the document, which is where a screen reader would otherwise
            // dump them.
            try { if (lastFocus && lastFocus.focus) lastFocus.focus(); } catch (e) {}
        }, 280);
    }

    /* ── the trigger ─────────────────────────────────────────────────── */
    var fired = false;
    function onScroll() {
        if (fired) return;
        var y = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (y < SCROLL_TRIGGER) return;
        fired = true;
        window.removeEventListener('scroll', onScroll);
        setTimeout(function () {
            // They may have navigated or opened something in the meantime.
            if (document.hidden) return;
            build();
        }, SHOW_DELAY_MS);
    }

    function start() {
        // Someone landing on a deep link part-way down the page has already
        // "scrolled" as far as this is concerned, so check once up front.
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
