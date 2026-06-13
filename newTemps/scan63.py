import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard63.php', encoding='utf-8').read()


def show(label, pat, n=240, strip_svg=True):
    m = re.search(pat, h)
    if not m:
        print(label, '-> NOT FOUND'); return
    seg = h[m.start():m.start() + n]
    if strip_svg:
        seg = re.sub(r'<svg[\s\S]*?</svg>', '<SVG/>', seg)
    print(label, '->', re.sub(r'\s+', ' ', seg)[:n])


print('SIZE KB', len(h) // 1024)
print('--- generic build artifacts present? ---')
print('  cover dark overlay:', 'linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5))' in h)
print('  orphan </iframe<:', h.count('</iframe<'))
print('  jquery cdn:', 'code.jquery.com' in h, '| slick cdn:', 'jsdelivr.net/npm/slick' in h)
print('  tfInit slick:', 'tfInit' in h)
print('  pickUpDate:', h.count('pickUpDate'), '| slotData:', h.count('slotData'))
print('  flatpickr cdn:', 'cdn.jsdelivr.net/npm/flatpickr' in h)
print('  figtree refs:', h.count('figtree'), '| Figtree:', h.count('Figtree'))
print()
print('--- head font links ---')
for m in re.finditer(r'<link[^>]*(?:font|css2)[^>]*>', h[:h.find('</head>')]):
    print('  ', m.group(0)[:130])
print()
show('NAME H2', r'<h[12][^>]*>\s*<\?= htmlspecialchars\(\$fullName\)')
show('BANNER', r'banner-img', 120, False)
show('GALLERY', r'class="gallery-slider"', 200)
show('SOCIAL', r'social-icons|social-icon|social-media', 200)
show('BUSINESS HOURS', r'business-hour', 220)
show('CONTACT first box', r'contact-(?:box|info|section)', 200)
print()
print('--- data loops (dynamic wiring) ---')
for v in ['services', 'products', 'galleries', 'testimonials', 'businessHours', 'socialLinks', 'insta_feed', 'iframes']:
    print('  $%s loop: %d' % (v, h.count('$' + v)))
