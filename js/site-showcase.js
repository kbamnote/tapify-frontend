/**
 * Tapify website showcase — renders builder websites into a grid.
 *
 * Used by:
 *   businesses.html    -> <body data-showcase="network">  ("Our Network")
 *   website-demos.html -> <body data-showcase="demo">     ("Website Demo")
 *
 * Which sites appear is chosen in Admin -> Website Showcase; the list comes
 * from /api/public/sites-showcase.php (published sites only).
 */
(function () {
    'use strict';

    var API  = 'https://app.tapify.co.in/api/public/sites-showcase.php';
    var LIST = document.body.getAttribute('data-showcase') === 'demo' ? 'demo' : 'network';

    var grid       = document.getElementById('siteGrid');
    var countEl    = document.getElementById('siteCount');
    var statTotal  = document.getElementById('statTotal');
    var pillsEl    = document.getElementById('industryPills');
    var searchEl   = document.getElementById('siteSearch');
    var stateEmpty = document.getElementById('stateEmpty');
    var stateError = document.getElementById('stateError');

    var all = [];
    var industry = '';

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function hostOf(url) {
        try { return new URL(url).host.replace(/^www\./, ''); } catch (e) { return url || ''; }
    }
    function titleCase(s) {
        return String(s || '').replace(/[-_]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }
    function initials(name) {
        var p = String(name || 'T').trim().split(/\s+/);
        return ((p[0] || '')[0] + ((p[1] || '')[0] || '')).toUpperCase();
    }

    function cardHtml(s, i) {
        var name  = esc(s.name || 'Website');
        var ind   = s.industry ? esc(titleCase(s.industry)) : 'Business Website';
        var host  = esc(hostOf(s.url));
        var cover = s.image
            ? '<img src="' + esc(s.image) + '" alt="' + name + '" loading="lazy">'
            : '<div class="site-cover-fallback">' + esc(initials(s.name)) + '</div>';
        var logo  = s.logo
            ? '<div class="site-logo"><img src="' + esc(s.logo) + '" alt="" loading="lazy"></div>'
            : '';
        return '' +
            '<article class="site-card" data-i="' + i + '" tabindex="0">' +
                '<div class="site-browser">' +
                    '<div class="site-browser-bar"><span></span><span></span><span></span>' +
                        '<div class="site-browser-url"><i class="fas fa-lock"></i>' + host + '</div></div>' +
                    '<div class="site-cover">' + cover + '<div class="site-cover-hover"><span><i class="fas fa-eye"></i> Live Preview</span></div></div>' +
                '</div>' +
                '<div class="site-card-body">' +
                    logo +
                    '<div class="site-industry">' + ind + '</div>' +
                    '<h3 class="site-name">' + name + '</h3>' +
                    (s.description ? '<p class="site-desc">' + esc(s.description) + '</p>' : '') +
                '</div>' +
                '<div class="site-card-footer">' +
                    '<button type="button" class="btn-site-preview"><i class="fas fa-desktop"></i> Preview</button>' +
                    '<a class="btn-site-visit" href="' + esc(s.url) + '" target="_blank" rel="noopener">Visit Website <i class="fas fa-arrow-right"></i></a>' +
                '</div>' +
            '</article>';
    }

    function filtered() {
        var q = (searchEl && searchEl.value || '').trim().toLowerCase();
        return all.filter(function (s) {
            if (industry && (s.industry || '') !== industry) return false;
            if (!q) return true;
            return [s.name, s.industry, s.description, hostOf(s.url)].join(' ').toLowerCase().indexOf(q) !== -1;
        });
    }

    function render() {
        var list = filtered();
        grid.innerHTML = list.map(function (s) { return cardHtml(s, all.indexOf(s)); }).join('');
        stateEmpty.style.display = list.length ? 'none' : 'block';
        countEl.textContent = list.length + ' Website' + (list.length === 1 ? '' : 's');
    }

    function buildPills() {
        if (!pillsEl) return;
        var seen = {};
        all.forEach(function (s) { if (s.industry) seen[s.industry] = (seen[s.industry] || 0) + 1; });
        var keys = Object.keys(seen).sort();
        if (keys.length < 2) { pillsEl.style.display = 'none'; return; }
        pillsEl.innerHTML = '<button class="cat-pill active" data-ind="">All</button>' +
            keys.map(function (k) { return '<button class="cat-pill" data-ind="' + esc(k) + '">' + esc(titleCase(k)) + '</button>'; }).join('');
        pillsEl.addEventListener('click', function (e) {
            var b = e.target.closest('.cat-pill');
            if (!b) return;
            pillsEl.querySelectorAll('.cat-pill').forEach(function (p) { p.classList.remove('active'); });
            b.classList.add('active');
            industry = b.getAttribute('data-ind');
            render();
        });
    }

    function skeleton(n) {
        var h = '';
        for (var i = 0; i < n; i++) h += '<div class="site-card skeleton"><div class="site-cover sk"></div><div class="site-card-body"><div class="sk-line w40"></div><div class="sk-line w80"></div><div class="sk-line w60"></div></div></div>';
        return h;
    }

    function load() {
        grid.innerHTML = skeleton(6);
        stateEmpty.style.display = 'none';
        stateError.style.display = 'none';
        countEl.textContent = 'Loading…';
        fetch(API + '?list=' + LIST)
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (!json.success) throw new Error(json.message || 'API error');
                all = (json.data && json.data.sites) || [];
                if (statTotal) statTotal.textContent = all.length;
                buildPills();
                render();
            })
            .catch(function (err) {
                console.error(err);
                grid.innerHTML = '';
                stateError.style.display = 'block';
                countEl.textContent = '—';
            });
    }
    window.tfShowcaseReload = load;

    /* ---------- live preview modal (desktop / mobile) ---------- */
    var backdrop = document.getElementById('siteModal');
    var frame    = document.getElementById('siteFrame');
    var urlEl    = document.getElementById('siteModalUrl');
    var openFull = document.getElementById('siteModalOpen');
    var shell    = document.getElementById('siteFrameShell');

    function openModal(s) {
        frame.src = s.url;
        urlEl.textContent = hostOf(s.url);
        openFull.href = s.url;
        setDevice(window.innerWidth < 768 ? 'mobile' : 'desktop');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        backdrop.classList.remove('open');
        frame.src = 'about:blank';
        document.body.style.overflow = '';
    }
    function setDevice(d) {
        shell.setAttribute('data-device', d);
        backdrop.querySelectorAll('[data-device-btn]').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-device-btn') === d);
        });
    }

    grid.addEventListener('click', function (e) {
        if (e.target.closest('.btn-site-visit')) return;   // plain link, new tab
        var card = e.target.closest('.site-card');
        if (!card || card.classList.contains('skeleton')) return;
        openModal(all[+card.getAttribute('data-i')]);
    });
    grid.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        var card = e.target.closest('.site-card');
        if (card && !card.classList.contains('skeleton')) openModal(all[+card.getAttribute('data-i')]);
    });
    document.getElementById('siteModalClose').addEventListener('click', closeModal);
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal(); });
    backdrop.querySelectorAll('[data-device-btn]').forEach(function (b) {
        b.addEventListener('click', function () { setDevice(b.getAttribute('data-device-btn')); });
    });

    var t;
    if (searchEl) searchEl.addEventListener('input', function () { clearTimeout(t); t = setTimeout(render, 200); });

    load();
})();
