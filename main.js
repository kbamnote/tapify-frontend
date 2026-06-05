/* ==========================================
   TAPIFY - Main JavaScript
   ========================================== */

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNavbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

window.addEventListener('scroll', function() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== FLOATING VIDEO WIDGET =====
function closeVideoWidget() {
    const widget = document.getElementById('videoWidget');
    if (widget) {
        widget.style.transform = 'translateX(-300px)';
        widget.style.opacity = '0';
        setTimeout(() => {
            widget.style.display = 'none';
        }, 400);
    }
}

// ===== TESTIMONIALS SLIDER =====
function slideTestimonials(direction) {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;

    const cardWidth = 265; // card width + gap
    const scrollAmount = direction * cardWidth * 2;

    track.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// ===== COOKIE CONSENT BANNER =====
function showCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const cookieAccepted = localStorage.getItem('tapify_cookie_consent');

    if (!cookieAccepted && banner) {
        setTimeout(() => {
            banner.classList.add('show');
        }, 2000);
    }
}

function acceptCookies() {
    const banner = document.getElementById('cookieBanner');
    localStorage.setItem('tapify_cookie_consent', 'accepted');
    if (banner) {
        banner.classList.remove('show');
    }
}

function declineCookies() {
    const banner = document.getElementById('cookieBanner');
    localStorage.setItem('tapify_cookie_consent', 'declined');
    if (banner) {
        banner.classList.remove('show');
    }
}

// ===== LEAD CAPTURE MODAL =====
const LEAD_API = 'https://app.tapify.co.in/api/public/lead.php';

function openLeadModal(source) {
    const backdrop = document.getElementById('leadModalBackdrop');
    if (!backdrop) return;
    document.getElementById('leadSource').value = source || 'website';
    // Reset to form state
    document.getElementById('leadFormState').style.display  = '';
    document.getElementById('leadSuccessState').style.display = 'none';
    clearLeadAlert();
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('leadName')?.focus(), 300);
}

function closeLeadModal() {
    const backdrop = document.getElementById('leadModalBackdrop');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
}

function showLeadAlert(msg, type) {
    const el = document.getElementById('leadAlert');
    if (!el) return;
    el.textContent = msg;
    el.className   = 'alert-lead show ' + type;
}
function clearLeadAlert() {
    const el = document.getElementById('leadAlert');
    if (el) { el.className = 'alert-lead'; el.textContent = ''; }
}

function initLeadModal() {
    const backdrop = document.getElementById('leadModalBackdrop');
    const closeBtn = document.getElementById('leadModalClose');
    const form     = document.getElementById('leadForm');
    if (!backdrop) return;

    // Close triggers
    closeBtn?.addEventListener('click', closeLeadModal);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closeLeadModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLeadModal(); });

    // Form submit
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearLeadAlert();

        const name   = document.getElementById('leadName').value.trim();
        const phone  = document.getElementById('leadPhone').value.trim();
        const email  = document.getElementById('leadEmail').value.trim();
        const city   = document.getElementById('leadCity').value.trim();
        const source = document.getElementById('leadSource').value;

        // Client-side validation
        if (!name)  { showLeadAlert('Please enter your name.', 'error'); document.getElementById('leadName').focus();  return; }
        if (!phone) { showLeadAlert('Please enter your phone number.', 'error'); document.getElementById('leadPhone').focus(); return; }
        if (phone.replace(/\D/g, '').length < 7) { showLeadAlert('Please enter a valid phone number.', 'error'); return; }

        const btn = document.getElementById('leadSubmitBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending…</span>';

        try {
            const res  = await fetch(LEAD_API, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name, phone, email, city, source })
            });
            const json = await res.json();

            if (json.success) {
                // Show success state
                document.getElementById('leadFormState').style.display   = 'none';
                document.getElementById('leadSuccessState').style.display = '';
            } else {
                showLeadAlert(json.message || 'Something went wrong. Please try again.', 'error');
            }
        } catch (err) {
            showLeadAlert('Network error. Please check your connection and try again.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send My Request</span>';
        }
    });
}

// ===== ANIMATED NUMBER COUNTERS =====
function animateCounter(el) {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || 0);
    const duration = 1800;
    const step     = 16;
    const steps    = duration / step;
    let   current  = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
            el.classList.add('counted');
        }
        // Format: >1000 → show as K
        let display = current;
        if (target >= 1000 && suffix === 'K+') {
            display = (current / 1000).toFixed(1).replace('.0', '');
        } else {
            display = decimals ? current.toFixed(decimals) : Math.floor(current);
        }
        el.textContent = display + suffix;
    }, step);
}

function initCounters() {
    const counterEls = document.querySelectorAll('.num-value[data-count]');
    if (!counterEls.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = '1';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterEls.forEach(el => obs.observe(el));
}

// ===== STICKY CTA BUTTON =====
function initStickyCta() {
    const cta = document.getElementById('stickyCta');
    if (!cta) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            cta.classList.add('visible');
        } else {
            cta.classList.remove('visible');
        }
    }, { passive: true });
}

// ===== LIVE ACTIVITY TOASTS =====
const liveActivities = [
    { name: 'Priya S.',    msg: 'just created a card in Mumbai 🚀',   color: '#e91e63' },
    { name: 'Rahul K.',    msg: 'shared their profile in Delhi 📲',     color: '#2196f3' },
    { name: 'Ananya M.',   msg: 'viewed 47 profiles today 👀',          color: '#9c27b0' },
    { name: 'Vikram N.',   msg: 'joined Tapify from Bangalore ⚡',       color: '#ff5722' },
    { name: 'Sneha J.',    msg: 'got 120 profile views this week 🎉',    color: '#4caf50' },
    { name: 'Rohan D.',    msg: 'created a Web Store in Pune 🛍️',       color: '#ff9800' },
    { name: 'Kavita R.',   msg: 'activated their NFC card in Chennai 💳', color: '#00bcd4' },
    { name: 'Amit S.',     msg: 'just joined from Hyderabad 🙌',         color: '#8bc34a' },
    { name: 'Neha K.',     msg: 'reached 500 card scans this month 🔥',  color: '#f44336' },
    { name: 'Sanjay G.',   msg: 'upgraded to premium plan ⭐',           color: '#ffc107' },
];

function showLiveToast() {
    const toast    = document.getElementById('liveToast');
    const avatar   = document.getElementById('liveToastAvatar');
    const nameEl   = document.getElementById('liveToastName');
    const msgEl    = document.getElementById('liveToastMsg');
    if (!toast) return;

    const activity = liveActivities[Math.floor(Math.random() * liveActivities.length)];
    avatar.textContent       = activity.name.slice(0, 2).toUpperCase();
    avatar.style.background  = activity.color;
    nameEl.textContent       = activity.name;
    msgEl.textContent        = activity.msg;

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
}

function initLiveToasts() {
    if (!document.getElementById('liveToast')) return;
    // First one after 5 s, then every 12 s
    setTimeout(() => {
        showLiveToast();
        setInterval(showLiveToast, 12000);
    }, 5000);
}

// ===== 3D SOCIAL BURST =====
let sbBurstOpen = false;
let sbAutoTimer  = null;

function triggerBurst() {
    const card  = document.getElementById('sbCard');
    const icons = document.querySelectorAll('.sbi');
    const rings = document.getElementById('sbRings');
    const hint  = document.getElementById('sbTapHint');
    const cardHint = document.getElementById('sbHint');
    const sparks = document.getElementById('sbSparks');
    if (!card) return;

    if (sbBurstOpen) {
        // ── RETRACT ──
        sbBurstOpen = false;
        icons.forEach((el, i) => {
            el.classList.remove('burst', 'floating');
            el.style.setProperty('--d', (i * 0.04) + 's');
            el.classList.add('retract');
        });
        if (cardHint) cardHint.textContent = 'Tap to share ›';
        if (hint) hint.innerHTML = '<i class="fas fa-hand-pointer"></i> Tap the card';
        setTimeout(() => {
            icons.forEach(el => el.classList.remove('retract'));
        }, 800);
    } else {
        // ── BURST ──
        sbBurstOpen = true;
        clearTimeout(sbAutoTimer);

        // Card tap animation
        card.classList.remove('tapped');
        void card.offsetWidth; // reflow
        card.classList.add('tapped');

        // NFC rings
        rings.classList.remove('fire');
        void rings.offsetWidth;
        rings.classList.add('fire');
        setTimeout(() => rings.classList.remove('fire'), 1000);

        // Sparks burst
        launchSparks(sparks);

        // Burst icons with stagger
        icons.forEach((el, i) => {
            el.classList.remove('retract', 'floating');
            const delay = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || i * 0.06;
            el.style.setProperty('--d', delay + 's');
            void el.offsetWidth;
            el.classList.add('burst');
        });

        // Switch to floating idle after burst completes
        setTimeout(() => {
            icons.forEach((el, i) => {
                el.classList.remove('burst');
                el.style.setProperty('--d', (i * 0.1) + 's');
                el.classList.add('floating');
            });
        }, 1200);

        if (cardHint) cardHint.textContent = 'Tap to close ›';
        if (hint) hint.innerHTML = '<i class="fas fa-times-circle"></i> Tap to close';

        // Auto retract after 6s
        sbAutoTimer = setTimeout(() => {
            if (sbBurstOpen) triggerBurst();
        }, 6000);
    }
}

function launchSparks(container) {
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#c9933a','#dba84f','#f6eee6','#25d366','#1877f2','#fd1d1d'];
    const count  = 18;
    for (let i = 0; i < count; i++) {
        const el  = document.createElement('div');
        const ang = (i / count) * Math.PI * 2;
        const r   = 60 + Math.random() * 80;
        const sx  = Math.cos(ang) * r;
        const sy  = Math.sin(ang) * r;
        const dur = 0.5 + Math.random() * 0.5;
        const del = Math.random() * 0.2;
        el.className = 'sb-spark';
        el.style.cssText = `
            background: ${colors[i % colors.length]};
            width: ${4 + Math.random() * 5}px;
            height: ${4 + Math.random() * 5}px;
            --sx: ${sx}px; --sy: ${sy}px;
            --sd: ${dur}s;  --ss: ${del}s;
        `;
        container.appendChild(el);
        setTimeout(() => el.remove(), (dur + del + 0.1) * 1000);
    }
}

function initSocialBurst() {
    const stage = document.getElementById('sbStage');
    if (!stage) return;

    // Auto-trigger demo after 3s if user hasn't interacted
    sbAutoTimer = setTimeout(() => {
        if (!sbBurstOpen) triggerBurst();
    }, 3000);
}

// ===== INTERACTIVE 3-D NFC SECTION =====
function initNfcInteractive() {
    initNfcBgCanvas();

    const card        = document.getElementById('nfcI3dCard');
    const cardScene   = document.getElementById('nfcCardScene');
    const shine       = document.getElementById('nfcShine');
    const cardShadow  = document.getElementById('nfcCardShadow');
    const tapBtn      = document.getElementById('nfcTapBtn');
    const signalHub   = document.getElementById('nfcSignalHub');
    const phone       = document.getElementById('nfcI3dPhone');
    const phoneShadow = document.querySelector('.nfc-i3d-phone-shadow');
    const beamCvs     = document.getElementById('nfcBeamCvs');
    const msVal       = document.getElementById('nfcMsVal');
    const cardStatus  = document.getElementById('nfcCardStatus');
    const phoneStatus = document.getElementById('nfcPhoneStatus');
    const isFill      = document.getElementById('nfcIsFill');
    const steps       = document.querySelectorAll('.nfc-i3d-step');
    if (!card) return;

    /* ── Card mouse-tilt interaction ── */
    cardScene.addEventListener('mouseenter', () => {
        card.classList.add('tilting');
        card.style.transition = 'transform 0.08s ease-out, box-shadow 0.3s ease';
    });

    cardScene.addEventListener('mousemove', (e) => {
        const r  = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2); // -1..1
        const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2); // -1..1
        card.style.transform = `rotateX(${-dy * 22}deg) rotateY(${dx * 22}deg) translateZ(12px)`;
        // Holographic shimmer follows cursor
        const sx = ((dx + 1) / 2) * 100;
        const sy = ((dy + 1) / 2) * 100;
        shine.style.background = `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.22) 0%, rgba(201,147,58,0.07) 42%, transparent 62%)`;
        // Shadow parallax
        cardShadow.style.transform = `translateX(${dx * 12}px)`;
        // Subtle glow intensifies
        card.style.boxShadow = `0 30px 60px rgba(0,0,0,0.65), 0 0 ${40 + Math.abs(dx)*20}px rgba(0,229,255,${0.18 + Math.abs(dx)*0.12}), inset 0 1px 0 rgba(255,255,255,0.07)`;
    });

    cardScene.addEventListener('mouseleave', () => {
        card.classList.remove('tilting');
        card.style.transition = 'transform 0.55s ease, box-shadow 0.55s ease';
        card.style.transform  = '';
        card.style.boxShadow  = '';
        shine.style.background = 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18) 0%, rgba(201,147,58,0.06) 45%, transparent 65%)';
        cardShadow.style.transform = '';
        setTimeout(() => {
            if (!card.classList.contains('tilting'))
                card.style.transition = '';
        }, 560);
    });

    cardScene.addEventListener('click', () => triggerTap());
    if (tapBtn) tapBtn.addEventListener('click', () => triggerTap());

    /* ── Particle beam canvas ── */
    let bCtx, bW, bH, particles = [], beamActive = false, rafId;

    if (beamCvs) {
        bCtx = beamCvs.getContext('2d');
        const resize = () => {
            const s = document.getElementById('nfcI3dStage');
            if (!s) return;
            const r = s.getBoundingClientRect();
            beamCvs.width = bW = r.width;
            beamCvs.height = bH = r.height;
        };
        resize();
        window.addEventListener('resize', resize);
    }

    function spawnParticles() {
        if (!beamCvs) return;
        const stage  = document.getElementById('nfcI3dStage').getBoundingClientRect();
        const cR     = card.getBoundingClientRect();
        const pR     = phone.getBoundingClientRect();
        const sx = cR.left + cR.width  / 2 - stage.left;
        const sy = cR.top  + cR.height / 2 - stage.top;
        const ex = pR.left + pR.width  / 2 - stage.left;
        const ey = pR.top  + pR.height / 2 - stage.top;

        for (let wave = 0; wave < 4; wave++) {
            setTimeout(() => {
                for (let i = 0; i < 28; i++) {
                    setTimeout(() => {
                        const gold = Math.random() < 0.28;
                        particles.push({
                            sx, sy, ex, ey,
                            t: Math.random() * 0.15,
                            speed: 0.007 + Math.random() * 0.007,
                            size: Math.random() * 3.5 + 1.5,
                            color: gold ? '#dba84f' : '#00e5ff',
                            cpx: (sx + ex) / 2 + (Math.random() - 0.5) * 90,
                            cpy: Math.min(sy, ey) - 55 - Math.random() * 65,
                        });
                    }, i * 35);
                }
            }, wave * 380);
        }
    }

    function drawBeam() {
        if (!bCtx) return;
        bCtx.clearRect(0, 0, bW, bH);
        const dead = [];
        particles.forEach((p, i) => {
            p.t += p.speed;
            if (p.t >= 1) { dead.push(i); return; }
            const mt = 1 - p.t;
            const x  = mt*mt*p.sx + 2*mt*p.t*p.cpx + p.t*p.t*p.ex;
            const y  = mt*mt*p.sy + 2*mt*p.t*p.cpy + p.t*p.t*p.ey;
            const a  = p.t < 0.15 ? p.t / 0.15 : p.t > 0.8 ? (1 - p.t) / 0.2 : 1;
            bCtx.globalAlpha = a * 0.92;
            bCtx.fillStyle   = p.color;
            bCtx.shadowBlur  = 14;
            bCtx.shadowColor = p.color;
            bCtx.beginPath();
            bCtx.arc(x, y, p.size, 0, Math.PI * 2);
            bCtx.fill();
        });
        bCtx.shadowBlur = 0; bCtx.globalAlpha = 1;
        for (let i = dead.length - 1; i >= 0; i--) particles.splice(dead[i], 1);
        if (particles.length > 0 || beamActive) rafId = requestAnimationFrame(drawBeam);
        else bCtx.clearRect(0, 0, bW, bH);
    }

    /* ── Sequence state machine ── */
    let running = false, autoTimer;

    function setStep(n) {
        steps.forEach((s, i) => {
            s.classList.remove('active','done');
            if (i < n) s.classList.add('done');
            if (i === n) s.classList.add('active');
        });
    }

    function showScreen(id) {
        ['nfcIsIdle','nfcIsScan','nfcIsProfile'].forEach(x => document.getElementById(x)?.classList.remove('active'));
        document.getElementById(id)?.classList.add('active');
    }

    function resetState() {
        running = false; beamActive = false; particles = [];
        if (bCtx) bCtx.clearRect(0, 0, bW, bH);
        setStep(0);
        showScreen('nfcIsIdle');
        if (msVal)       msVal.textContent = '—';
        if (isFill)      isFill.style.width = '0';
        if (cardStatus)  cardStatus.innerHTML = '<span class="ndv2-dot green"></span> Ready to transmit';
        if (phoneStatus) phoneStatus.innerHTML = '<span class="ndv2-dot grey"></span> Standing by';
        signalHub?.classList.remove('active');
        phone?.classList.remove('receiving');
        if (phoneShadow) phoneShadow.style.background = 'radial-gradient(ellipse, rgba(0,229,255,0.22) 0%, transparent 70%)';
        document.querySelectorAll('.nfc-is-link, .nfc-is-save').forEach(el => el.classList.remove('show'));
    }

    function triggerTap() {
        if (running) return;
        running = true;
        clearTimeout(autoTimer);

        // Step 1 – Detected
        setStep(1);
        signalHub?.classList.add('active');
        if (phoneStatus) phoneStatus.innerHTML = '<span class="ndv2-dot cyan"></span> NFC signal detected';
        showScreen('nfcIsScan');
        if (isFill) setTimeout(() => { isFill.style.width = '100%'; }, 60);

        // Count ms
        let ms = 0;
        const tick = setInterval(() => {
            ms += 10;
            if (msVal) msVal.textContent = ms;
            if (ms >= 287) clearInterval(tick);
        }, 17);

        // Particles
        beamActive = true;
        spawnParticles();
        drawBeam();

        // Phone glow
        setTimeout(() => {
            phone?.classList.add('receiving');
            if (phoneShadow) phoneShadow.style.background = 'radial-gradient(ellipse, rgba(0,229,255,0.55) 0%, transparent 70%)';
        }, 600);

        // Step 2 – Sending
        setTimeout(() => {
            setStep(2);
            if (cardStatus) cardStatus.innerHTML = '<span class="ndv2-dot cyan"></span> Transmitting…';
        }, 1400);

        // Step 3 – Complete
        setTimeout(() => {
            setStep(3);
            beamActive = false;
            showScreen('nfcIsProfile');
            if (phoneStatus) phoneStatus.innerHTML = '<span class="ndv2-dot green"></span> Profile received!';
            if (cardStatus)  cardStatus.innerHTML  = '<span class="ndv2-dot green"></span> Transfer complete';
            document.querySelectorAll('.nfc-is-link').forEach((el, i) => {
                setTimeout(() => el.classList.add('show'), i * 130);
            });
            setTimeout(() => document.querySelector('.nfc-is-save')?.classList.add('show'), 620);
        }, 2900);

        // Auto-reset & replay
        autoTimer = setTimeout(() => {
            resetState();
            autoTimer = setTimeout(triggerTap, 2800);
        }, 8000);
    }

    // Kick off after 1.2s
    autoTimer = setTimeout(triggerTap, 1200);
}

// ===== LEGACY (kept for reference, no longer called) =====
function initThreeJsCard() {
    const canvas = document.getElementById('nfcCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const W = 260, H = 170;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    // Card geometry (credit-card ratio 85.6mm x 53.98mm ≈ 1.58:1)
    const cardGeo = new THREE.BoxGeometry(2.4, 1.52, 0.06, 1, 1, 1);

    // Front face texture via canvas
    function makeCardTexture(front) {
        const tc = document.createElement('canvas');
        tc.width = 512; tc.height = 320;
        const ctx = tc.getContext('2d');

        if (front) {
            // Background gradient
            const grad = ctx.createLinearGradient(0, 0, 512, 320);
            grad.addColorStop(0,   '#0d2829');
            grad.addColorStop(0.5, '#153e3f');
            grad.addColorStop(1,   '#1e5557');
            ctx.fillStyle = grad;
            ctx.roundRect(0, 0, 512, 320, 24);
            ctx.fill();

            // Gold accent line
            ctx.fillStyle = '#c9933a';
            ctx.fillRect(0, 260, 512, 4);

            // NFC icon
            ctx.strokeStyle = 'rgba(201,147,58,0.7)';
            ctx.lineWidth = 6;
            for (let r = 30; r <= 80; r += 22) {
                ctx.beginPath();
                ctx.arc(430, 80, r, -Math.PI * 0.7, Math.PI * 0.7);
                ctx.stroke();
            }

            // TAPIFY wordmark
            ctx.fillStyle = '#f6eee6';
            ctx.font = 'bold 48px Outfit, sans-serif';
            ctx.fillText('TAPIFY', 36, 80);

            // Subtitle
            ctx.fillStyle = 'rgba(246,238,230,0.55)';
            ctx.font = '22px Outfit, sans-serif';
            ctx.fillText('NFC Smart Business Card', 36, 118);

            // Chip
            ctx.fillStyle = '#c9933a';
            ctx.beginPath();
            ctx.roundRect(36, 160, 64, 48, 6);
            ctx.fill();
            ctx.strokeStyle = '#dba84f';
            ctx.lineWidth = 1.5;
            ['V','H'].forEach((dir, i) => {
                ctx.beginPath();
                if (dir === 'V') { ctx.moveTo(68, 164); ctx.lineTo(68, 204); }
                else             { ctx.moveTo(40, 184); ctx.lineTo(96, 184); }
                ctx.stroke();
            });

            // Name placeholder
            ctx.fillStyle = 'rgba(246,238,230,0.8)';
            ctx.font = 'bold 28px Outfit, sans-serif';
            ctx.fillText('Your Name Here', 36, 244);

        } else {
            // Back side
            const grad = ctx.createLinearGradient(0, 0, 0, 320);
            grad.addColorStop(0, '#0a1e1e');
            grad.addColorStop(1, '#0d2829');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 512, 320);

            // Magnetic strip
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 40, 512, 60);

            // Logo
            ctx.fillStyle = '#c9933a';
            ctx.font = 'bold 36px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('TAPIFY', 256, 200);
            ctx.fillStyle = 'rgba(246,238,230,0.3)';
            ctx.font = '18px Outfit, sans-serif';
            ctx.fillText('tapify.in', 256, 230);
            ctx.textAlign = 'left';
        }

        return new THREE.CanvasTexture(tc);
    }

    const frontTex = makeCardTexture(true);
    const backTex  = makeCardTexture(false);
    const sideTex  = (() => {
        const tc = document.createElement('canvas');
        tc.width = 64; tc.height = 64;
        const ctx = tc.getContext('2d');
        ctx.fillStyle = '#1e5557';
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(tc);
    })();

    const materials = [
        new THREE.MeshStandardMaterial({ map: sideTex }),   // right
        new THREE.MeshStandardMaterial({ map: sideTex }),   // left
        new THREE.MeshStandardMaterial({ map: sideTex }),   // top
        new THREE.MeshStandardMaterial({ map: sideTex }),   // bottom
        new THREE.MeshStandardMaterial({ map: frontTex }),  // front
        new THREE.MeshStandardMaterial({ map: backTex }),   // back
    ];

    const card = new THREE.Mesh(cardGeo, materials);
    scene.add(card);

    // Lights
    scene.add(Object.assign(new THREE.AmbientLight(0xffffff, 0.6)));
    const dir1 = new THREE.DirectionalLight(0xffeedd, 1.2);
    dir1.position.set(3, 3, 5);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0xc9933a, 0.5);
    dir2.position.set(-3, -2, 3);
    scene.add(dir2);

    // Gold particle dust
    const partGeo = new THREE.BufferGeometry();
    const partCount = 60;
    const positions = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 5;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({ color: 0xc9933a, size: 0.04, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(partGeo, partMat));

    let t = 0;
    function animate() {
        requestAnimationFrame(animate);
        t += 0.01;
        card.rotation.y = Math.sin(t * 0.5) * 0.4 + t * 0.3;
        card.rotation.x = Math.sin(t * 0.3) * 0.1;
        card.position.y = Math.sin(t * 0.7) * 0.08;
        renderer.render(scene, camera);
    }
    animate();
}

// ===== NFC DEMO V2 — FUTURISTIC SEQUENCE =====
function initNfcTapDemo() {
    // Animated grid background canvas
    initNfcBgCanvas();

    const steps    = document.querySelectorAll('.ndv2-step');
    const stateIdle    = document.getElementById('ndvsIdle');
    const stateScan    = document.getElementById('ndvsScan');
    const stateProfile = document.getElementById('ndvsProfile');
    const loadFill     = document.getElementById('ndvsLoadFill');
    const speedEl      = document.getElementById('ndvSpeed');
    const cardStatus   = document.getElementById('ndvCardStatus');
    const phoneStatus  = document.getElementById('ndvPhoneStatus');
    if (!stateIdle) return;

    function setStep(n) {
        steps.forEach((s, i) => {
            s.classList.remove('active','done');
            if (i < n)  s.classList.add('done');
            if (i === n) s.classList.add('active');
        });
    }

    function showScreen(name) {
        [stateIdle, stateScan, stateProfile].forEach(s => s.classList.remove('active'));
        if (name === 'idle')    stateIdle.classList.add('active');
        if (name === 'scan')    stateScan.classList.add('active');
        if (name === 'profile') stateProfile.classList.add('active');
    }

    function runSequence() {
        // STEP 0: Idle reset
        setStep(0);
        showScreen('idle');
        if (loadFill)  loadFill.style.width = '0';
        if (speedEl)   speedEl.textContent  = '0';
        if (cardStatus) cardStatus.innerHTML = '<span class="ndv2-dot green"></span> Ready to transmit';
        if (phoneStatus) phoneStatus.innerHTML = '<span class="ndv2-dot grey"></span> Standing by';
        document.querySelectorAll('.ndvs-link, .ndvs-save-btn').forEach(el => el.classList.remove('show'));

        setTimeout(() => {
            // STEP 1: Detected
            setStep(1);
            if (phoneStatus) phoneStatus.innerHTML = '<span class="ndv2-dot cyan"></span> NFC signal detected';
            showScreen('scan');
            if (loadFill) { setTimeout(() => { loadFill.style.width = '100%'; }, 50); }

            // Animate speed counter
            let ms = 0;
            const spd = setInterval(() => {
                ms += 12;
                if (speedEl) speedEl.textContent = ms;
                if (ms >= 287) clearInterval(spd);
            }, 20);
        }, 1500);

        setTimeout(() => {
            // STEP 2: Transmitting
            setStep(2);
            if (cardStatus) cardStatus.innerHTML = '<span class="ndv2-dot cyan"></span> Transmitting…';
        }, 2800);

        setTimeout(() => {
            // STEP 3: Complete — show profile
            setStep(3);
            showScreen('profile');
            if (phoneStatus) phoneStatus.innerHTML = '<span class="ndv2-dot green"></span> Profile received!';
            if (cardStatus)  cardStatus.innerHTML  = '<span class="ndv2-dot green"></span> Transfer complete';

            // Stagger link cards appearing
            document.querySelectorAll('.ndvs-link').forEach((el, i) => {
                setTimeout(() => el.classList.add('show'), i * 100);
            });
            setTimeout(() => {
                document.querySelector('.ndvs-save-btn')?.classList.add('show');
            }, 500);
        }, 3800);

        // Restart loop
        setTimeout(runSequence, 7000);
    }

    // Start after 1s
    setTimeout(runSequence, 1000);
}

// Animated dot-grid canvas background for NFC section
function initNfcBgCanvas() {
    const canvas = document.getElementById('nfcBgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const dots = [];
    const COUNT = 80;
    for (let i = 0; i < COUNT; i++) {
        dots.push({
            x: Math.random(), y: Math.random(),
            vx: (Math.random() - 0.5) * 0.0003,
            vy: (Math.random() - 0.5) * 0.0003,
            r: Math.random() * 1.5 + 0.5,
        });
    }

    function draw() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        dots.forEach(d => {
            d.x += d.vx; d.y += d.vy;
            if (d.x < 0) d.x = 1; if (d.x > 1) d.x = 0;
            if (d.y < 0) d.y = 1; if (d.y > 1) d.y = 0;

            // Connect nearby dots
            dots.forEach(d2 => {
                const dx = (d.x - d2.x) * W, dy = (d.y - d2.y) * H;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    ctx.strokeStyle = `rgba(0,229,255,${0.15 * (1 - dist/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(d.x*W, d.y*H);
                    ctx.lineTo(d2.x*W, d2.y*H);
                    ctx.stroke();
                }
            });

            ctx.fillStyle = 'rgba(0,229,255,0.5)';
            ctx.beginPath();
            ctx.arc(d.x*W, d.y*H, d.r, 0, Math.PI*2);
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }
    draw();
}

// ===== TESTIMONIAL CONTINUOUS MARQUEE =====
function initTestimonialCarousel() {
    const track = document.getElementById('tpfMarqueeTrack');
    if (!track) return;

    const items = [
        { img: 'AK PROPERTIES testimonial.jpeg',                                name: 'AK Properties' },
        { img: 'DEEPAK ELECTRIC JHOOMAR PALACE testimonial.jpeg',               name: 'Deepak Electric Jhoomar Palace' },
        { img: 'DENTAL DELIGHT SUPERSPECIALITY DENTAL CLINIC testimonial.jpeg', name: 'Dental Delight Superspeciality Dental Clinic' },
        { img: "DR. ADITI' DENTISTA testimonial.jpeg",                          name: "Dr. Aditi's Dentista" },
        { img: 'DR. EV (PRASHANT UKEY) testimonial.jpeg',                       name: 'Dr. EV (Prashant Ukey)' },
        { img: 'ELECTRO POWER testimonial.jpeg',                                name: 'Electro Power' },
        { img: 'GIRMULE DENTAL CLINIC testimonial.jpeg',                        name: 'Girmule Dental Clinic' },
        { img: 'MAULI DENTAL CLINIC & IMPLANT CENTRE testimonial.jpeg',         name: 'Mauli Dental Clinic & Implant Centre' },
        { img: 'PANACHE-MAHAL testimonial.jpeg',                                name: 'Panache-Mahal' },
        { img: 'PRAKASH OPTICALS testimonial.jpeg',                             name: 'Prakash Opticals' },
        { img: 'SAMRAT INFRASTRUCTURE testimonial.jpeg',                        name: 'Samrat Infrastructure' },
        { img: 'SP CONSTRUCTIONS & INTERIORS testimonial.jpeg',                 name: 'SP Constructions & Interiors' },
        { img: 'TRUE SMILE DENTAL CLINIC testimonial.jpeg',                     name: 'True Smile Dental Clinic' },
    ];

    function makeSlide(item) {
        const slide = document.createElement('div');
        slide.className = 'tpf-slide';
        const img = document.createElement('img');
        img.src     = 'images/' + item.img;
        img.alt     = item.name;
        img.loading = 'lazy';
        const nameEl = document.createElement('div');
        nameEl.className = 'tpf-card-name';
        nameEl.innerHTML = '<i class="fas fa-star"></i>';
        nameEl.appendChild(document.createTextNode(item.name));
        const card = document.createElement('div');
        card.className = 'tpf-card';
        card.appendChild(img);
        card.appendChild(nameEl);
        slide.appendChild(card);
        return slide;
    }

    // Build original set + duplicate set for seamless loop (translateX -50%)
    [...items, ...items].forEach(item => track.appendChild(makeSlide(item)));
}

// ===== DEMO CARD GENERATOR =====
let qrInstance = null;

function initDemoGenerator() {
    const fields = ['demoName','demoTitle','demoCompany','demoPhone','demoEmail'];
    if (!document.getElementById('demoName')) return;

    // Init QR
    if (typeof QRCode !== 'undefined') {
        const qrEl = document.getElementById('demoQR');
        if (qrEl) {
            qrInstance = new QRCode(qrEl, {
                text: 'https://tapify.co.in',
                width: 110, height: 110,
                colorDark: '#153e3f',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        }
    }

    function updateCard() {
        const name    = document.getElementById('demoName').value.trim()    || 'Your Name';
        const title   = document.getElementById('demoTitle').value.trim()   || 'Your Title';
        const company = document.getElementById('demoCompany').value.trim() || 'Company';
        const phone   = document.getElementById('demoPhone').value.trim()   || '+91 00000 00000';
        const email   = document.getElementById('demoEmail').value.trim()   || 'your@email.com';

        // Initials
        const words    = name.split(' ').filter(Boolean);
        const initials = words.length >= 2
            ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
            : name.slice(0, 2).toUpperCase() || 'TP';

        document.getElementById('dcpAvatar').textContent = initials;
        document.getElementById('dcpName').textContent   = name;
        document.getElementById('dcpTitle').textContent  = title + (company ? ' · ' + company : '');
        document.getElementById('dcpPhone').innerHTML    = `<i class="fas fa-phone"></i> ${phone}`;
        document.getElementById('dcpEmail').innerHTML    = `<i class="fas fa-envelope"></i> ${email}`;

        // Update QR
        if (qrInstance) {
            try { qrInstance.clear(); qrInstance.makeCode('https://tapify.co.in'); } catch(e) {}
        }
    }

    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateCard);
    });

    updateCard();
}

// ===== COST CALCULATOR =====
function initCalculator() {
    const cardsSlider = document.getElementById('calcCards');
    const priceSlider = document.getElementById('calcPrice');
    const yearsSlider = document.getElementById('calcYears');
    if (!cardsSlider) return;

    const TAPIFY_COST = 999;

    function update() {
        const cards  = parseInt(cardsSlider.value);
        const price  = parseInt(priceSlider.value);
        const years  = parseInt(yearsSlider.value);

        document.getElementById('calcCardsVal').textContent = cards.toLocaleString();
        document.getElementById('calcPriceVal').textContent = '₹' + price;
        document.getElementById('calcYearsVal').textContent = years + ' yr' + (years > 1 ? 's' : '');

        const paperTotal = cards * price * years;
        const savings    = Math.max(0, paperTotal - TAPIFY_COST);

        const paperEl = document.getElementById('paperCost');
        const savEl   = document.getElementById('calcSavings');
        const subEl   = document.querySelector('.calc-col.paper .calc-col-sub');

        if (paperEl) paperEl.textContent = '₹' + paperTotal.toLocaleString();
        if (subEl)   subEl.textContent   = 'over ' + years + ' year' + (years > 1 ? 's' : '');
        if (savEl) {
            savEl.textContent = '₹' + savings.toLocaleString();
            // Trigger re-animation
            savEl.style.animation = 'none';
            savEl.offsetHeight;
            savEl.style.animation = 'savingsPop 0.35s cubic-bezier(0.34,1.56,0.64,1)';
        }
    }

    [cardsSlider, priceSlider, yearsSlider].forEach(s => s.addEventListener('input', update));
    update();
}

// ===== INITIALIZE ON DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    // Show cookie banner
    showCookieBanner();

    // Lead modal
    initLeadModal();

    // New interactive features
    initCounters();
    initStickyCta();
    initLiveToasts();
    initSocialBurst();
    initNfcInteractive();
    initDemoGenerator();
    initCalculator();
    initTestimonialCarousel();

    // Add fade-in animation to elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe feature cards, step cards, etc.
    document.querySelectorAll('.feature-card, .step-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
});

// ===== KEYBOARD NAVIGATION FOR TESTIMONIALS =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        slideTestimonials(-1);
    } else if (e.key === 'ArrowRight') {
        slideTestimonials(1);
    }
});

// ===== FAQ ACCORDION ENHANCEMENT =====
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', function() {
        // Smooth animation handled by Bootstrap, just adding visual feedback
        this.blur();
    });
});

// ===== PREVENT FORM SUBMIT ON DEMO LINKS =====
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
    });
});

console.log('%c🚀 Tapify - The Future of Business Networking', 'color: #8338ec; font-size: 16px; font-weight: bold;');
console.log('%cWebsite loaded successfully!', 'color: #28a745; font-size: 12px;');
