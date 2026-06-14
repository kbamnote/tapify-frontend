import re, io, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard70.php'
A = '/images/templates/foodculinarypro/'
S = json.load(open('D:/Print World/tapify/tapify-frontend/newTemps/_ta_extract.json', encoding='utf-8'))['social_icons']
h = open(F, encoding='utf-8').read()

# strip leading PHP doc/header block
h = re.sub(r'<\?php /\*\*[\s\S]*?\?>\n?', '', h, count=1)

# shared scripts include -> stripped JS
ss = open('D:/Print World/tapify/tapify-backend/templates/_shared-scripts.php', encoding='utf-8').read()
ss = re.sub(r'<\?php[\s\S]*?\?>\n?', '', ss, count=1)
ss = re.sub(r'<\?=\s*json_encode\(\$fullName\)\s*\?>', '"Saffron Spice Kitchen"', ss)
ss = re.sub(r'<\?=\s*json_encode\([^)]*\)\s*\?>', '""', ss)
ss = re.sub(r'<\?php[\s\S]*?\?>', '', ss)
ss = re.sub(r'<\?=[\s\S]*?\?>', '""', ss)
h = h.replace('<?php include __DIR__ . "/_shared-scripts.php"; ?>', ss, 1)

# SOCIAL loop -> 5 icons
soc = ''.join('<div class="social-icon d-flex justify-content-center align-items-center"><a href="#" target="_blank">%s</a></div>' % v
              for v in [S['facebook'], S['instagram'], S['youtube'], S['linkedin'], S['x']])
h = re.sub(r'<\?php foreach \(\$socialLinks[\s\S]*?<\?php endforeach; \?>', lambda m: soc, h, count=1)

# SERVICES -> 4
svc = ''.join('<div class="col-sm-6 mb-sm-0 mb-40 p-3"><div class="card-wrapper h-100"><a href="javascript:void(0)" class="text-decoration-none"><div class="service-card card h-100"><div class="card-img mx-auto"><img src="%sfoo-00%d.webp" class="w-100 h-100 object-fit-cover" loading="lazy"></div><div class="card-body text-center"><h3 class="card-title text-primary">Signature Dish %d</h3><p class="mb-0 text-gray">Chef-crafted with the freshest seasonal ingredients.</p></div></div></a></div></div>' % (A, i + 4, i) for i in range(1, 5))
h = re.sub(r'<\?php foreach \(\(isset\(\$__sv\)[\s\S]*?<\?php endforeach; \?>', lambda m: svc, h, count=1)

# GALLERY -> 5
gim = ['foo-009.webp', 'foo-010.webp', 'foo-011.webp', 'foo-012.webp', 'foo-013.webp']
gal = ''.join('<div class="px-2"><div class="gallery-img-wrapper"><div class="gallery-img" style="background-image:url(\'%s%s\');background-size:cover;background-position:center;height:280px;border-radius:12px;"></div></div></div>' % (A, g) for g in gim)
h = re.sub(r'<\?php foreach \(\(isset\(\$__ga\)[\s\S]*?endforeach; endforeach; \?>', lambda m: gal, h, count=1)

# PRODUCTS -> 4
prods = ''.join('<div class="px-2"><div class="product-card card"><div class="product-img card-img"><img src="%sfoo-01%d.webp" class="w-100 h-100 object-fit-cover" loading="lazy"></div><div class="product-desc card-body d-flex flex-column align-items-center justify-content-between"><div class="product-title"><h3 class="text-dark text-center">Menu Item %d</h3></div><div class="product-amount"><span>&#8377; %d99</span></div></div></div></div>' % (A, i + 3, i, i) for i in range(1, 5))
h = re.sub(r'<\?php foreach \(\(isset\(\$__pr\)[\s\S]*?<\?php endforeach; \?>', lambda m: prods, h, count=1)

# TESTIMONIALS -> 3
tes = ''.join('<div class="px-2"><div class="testimonial-card p-0"><div class="card-body text-center position-relative"><div class="text-center"><p class="text-gray mb-0">&#8220;Absolutely delicious food and warm service. A must-visit!&#8221;</p></div></div><div class="d-flex flex-column align-items-center justify-content-center gap-2 profile-desc"><h5 class="fw-6 mb-0">Happy Diner %d</h5></div></div></div>' % i for i in range(1, 4))
h = re.sub(r'<\?php foreach \(\(isset\(\$__te\)[\s\S]*?<\?php endforeach; \?>', lambda m: tes, h, count=1)

# BUSINESS HOURS -> 7
days = [('Monday', '11 AM - 11 PM'), ('Tuesday', '11 AM - 11 PM'), ('Wednesday', '11 AM - 11 PM'), ('Thursday', '11 AM - 11 PM'), ('Friday', '11 AM - 12 AM'), ('Saturday', '11 AM - 12 AM'), ('Sunday', 'Closed')]
bh = ''.join('<div class="col-sm-6"><div class="business-hour-card d-flex gap-2 align-items-center mb-3"><div class="time-icon"><i class="bi bi-clock fs-3"></i></div><div class="d-flex flex-column align-items-start"><span class="fs-14 text-gray lh-1 fw-5">%s</span><span class="fs-16 fw-5">%s</span></div></div></div>' % (d, t) for d, t in days)
h = re.sub(r'<\?php foreach \(\(isset\(\$__bh\)[\s\S]*?<\?php endforeach; \?>', lambda m: bh, h, count=1)

# COVER cvType block -> img
h = re.sub(r'<\?php \$cvType[\s\S]*?\?>', lambda m: '<img src="%sfoo-002.webp" alt="cover" style="width:100%%;height:100%%;object-fit:cover;display:block;">' % A, h, count=1)

# scalar tokens
def rsub(p, v):
    global h; h = re.sub(p, lambda m: v, h)

rsub(r'<\?=\s*htmlspecialchars\(\$fullName\)\s*\?>', 'Saffron Spice Kitchen')
rsub(r'<\?=\s*\$profileImg\s*\?>', A + 'foo-001.webp')
rsub(r'<\?=\s*htmlspecialchars\(\$profileImg\)\s*\?>', A + 'foo-001.webp')
rsub(r'<\?=\s*\$qrUrl\s*\?>', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=preview')
rsub(r'<\?=\s*htmlspecialchars\(\$vcard\["occupation"\] \?\? ""\)\s*\?>', 'Fine Dining & Catering')
rsub(r'<\?=\s*\$vcardId\s*\?>', '70')
h = re.sub(r'<\?php if\(!empty\(\$vcard\["description"\]\)\):[\s\S]*?<\?php else: \?>', lambda m: '<p class="mb-0 text-gray">Authentic flavors, crafted fresh daily. From sizzling starters to signature mains, every plate tells a story of passion and taste.</p>', h)

# strip any remaining PHP
h = re.sub(r'<\?php[\s\S]*?\?>', lambda m: '', h)
h = re.sub(r'<\?=[\s\S]*?\?>', lambda m: '', h)

open('D:/Print World/tapify/tapify-backend/fc_preview.html', 'w', encoding='utf-8').write(h)
demo = h.replace(A, 'https://app.tapify.co.in' + A)
open('D:/Print World/tapify/tapify-frontend/newTemps/imagesCulinaryFoodServices/clean-pro.html', 'w', encoding='utf-8').write(demo)
print('fc_preview.html + imagesCulinaryFoodServices/clean-pro.html', len(h) // 1024, 'KB')
print('residual <?php:', h.count('<?php'), '| <?=:', h.count('<?='))
