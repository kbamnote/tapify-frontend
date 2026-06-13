import re, io, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard69.php', encoding='utf-8').read()
S = json.load(open('D:/Print World/tapify/tapify-frontend/newTemps/_ta_extract.json', encoding='utf-8'))['social_icons']
A = '/images/templates/flowergardenpro/'
h = re.sub(r'<\?php /\*\*[\s\S]*?\?>\n?', '', h, count=1)
ss = open('D:/Print World/tapify/tapify-backend/templates/_shared-scripts.php', encoding='utf-8').read()
ss = re.sub(r'<\?php[\s\S]*?\?>\n?', '', ss, count=1)
ss = re.sub(r'<\?=\s*json_encode\(\$fullName\)\s*\?>', '"Bloom & Petal"', ss)
ss = re.sub(r'<\?=\s*json_encode\([^)]*\)\s*\?>', '""', ss)
ss = re.sub(r'<\?php[\s\S]*?\?>', '', ss); ss = re.sub(r'<\?=[\s\S]*?\?>', '""', ss)
h = h.replace('<?php include __DIR__ . "/_shared-scripts.php"; ?>', ss, 1)

# social loop -> 5 social-box links
soc = ''.join('<a href="#" class="text-decoration-none d-flex justify-content-center align-items-center social-box">%s</a>' % v
              for v in [S['facebook'], S['instagram'], S['youtube'], S['linkedin'], S['x']])
h = re.sub(r'<\?php foreach \(\$socialLinks[\s\S]*?<\?php endforeach; \?>', lambda m: soc, h, count=1)
# service grid -> 4 services
svc = ''.join('<div class="col-sm-6"><div class="service-box bg-white w-100 mx-auto h-100 d-flex flex-column"><div class="service-img h-100 w-100 mb-10px"><a href="javascript:void(0)" class="pe-none"><img src="%sflo-00%d.webp" class="h-100 w-100 object-fit-cover"></a></div><div class="service-content flex-grow-1"><h6 class="card-title fw-bold text-black text-center">Floral Service %d</h6><p class="mb-0 text-gray description-text text-center">Beautiful seasonal arrangements crafted with care.</p></div></div></div>' % (A, i + 5, i) for i in range(1, 5))
h = re.sub(r'<\?php foreach \(\$services[\s\S]*?<\?php endforeach; \?>', lambda m: svc, h, count=1)
# testimonials -> 3
tes = ''.join('<div class="px-2"><div class="testimonial-box position-relative"><div class="quote-img top-img"><i class="fas fa-quote-left" style="color:#2a9f2e;font-size:24px;"></i></div><div><p class="text-gray fw-medium lh-base mb-3 text-center testiimonial-desc">"Absolutely beautiful arrangements, delivered fresh and on time!"</p><div class="d-flex justify-content-center align-items-center gap-3"><h6 class="fw-bold text-black mb-0">Customer %d</h6></div></div></div></div>' % i for i in range(1, 4))
h = re.sub(r'<\?php foreach \(\$testimonials[\s\S]*?<\?php endforeach; \?>', lambda m: tes, h, count=1)
# products
prods = ''.join('<div class="px-2"><div class="product-card card"><div class="product-img card-img"><img src="%sflo-01%d.webp" class="w-100 h-100 object-fit-cover"></div><div class="product-desc card-body d-flex flex-column align-items-center justify-content-between"><div class="product-title"><h3 class="text-dark text-center">Bouquet %d</h3></div><div class="product-amount"><span>Rs %d00</span></div></div></div></div>' % (A, i, i, i) for i in range(1, 5))
h = re.sub(r'<\?php foreach \(\(isset\(\$__pr\)[\s\S]*?<\?php endforeach; \?>', lambda m: prods, h, count=1)
# business hours
days = [('Monday', '9 AM - 8 PM'), ('Tuesday', '9 AM - 8 PM'), ('Wednesday', '9 AM - 8 PM'), ('Thursday', '9 AM - 8 PM'), ('Friday', '9 AM - 8 PM'), ('Saturday', '10 AM - 6 PM'), ('Sunday', 'Closed')]
bh = ''.join('<div class="col-sm-6"><div class="business-hour d-flex gap-2 align-items-center mb-3"><div class="time-icon"><i class="bi bi-clock fs-3"></i></div><div class="d-flex flex-column align-items-start"><span class="fs-14 text-gray lh-1 fw-5">%s</span><span class="fs-16 fw-5">%s</span></div></div></div>' % (d, t) for d, t in days)
h = re.sub(r'<\?php foreach \(\(isset\(\$__bh\)[\s\S]*?<\?php endforeach; \?>', lambda m: bh, h, count=1)
# gallery
gim = ['flo-006.webp', 'flo-007.webp', 'flo-008.webp', 'flo-011.webp', 'flo-013.webp']
gal = ''.join('<div class="px-2"><div class="gallery-img-wrapper"><div class="gallery-img" style="background-image:url(\'%s%s\');background-size:cover;background-position:center;height:280px;border-radius:12px;"></div></div></div>' % (A, g) for g in gim)
h = re.sub(r'<\?php foreach \(\(isset\(\$__ga\)[\s\S]*?<\?php endforeach; endforeach; \?>', lambda m: gal, h, count=1)
h = re.sub(r'<\?php \$cvType[\s\S]*?\?>', lambda m: '<img src="%sflo-006.webp" style="width:100%%;height:100%%;object-fit:cover;display:block;">' % A, h)

def rsub(p, v):
    global h; h = re.sub(p, lambda m: v, h)

rsub(r'<\?=\s*htmlspecialchars\(\$fullName\)\s*\?>', 'Bloom & Petal')
rsub(r'<\?=\s*\$profileImg\s*\?>', A + 'flo-001.webp')
rsub(r'<\?=\s*htmlspecialchars\(\$profileImg\)\s*\?>', A + 'flo-001.webp')
rsub(r'<\?=\s*\$qrUrl\s*\?>', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=preview')
rsub(r'<\?=\s*htmlspecialchars\(\$vcard\["occupation"\] \?\? ""\)\s*\?>', 'Florist & Garden Designer')
rsub(r'<\?=\s*\$vcardId\s*\?>', '69')
h = re.sub(r'<\?php if\(!empty\(\$vcard\["description"\]\)\):[\s\S]*?<\?php else: \?>', lambda m: '', h)
h = re.sub(r'<\?php \$__ifr=array_filter[\s\S]*?<\?php endif; \?>', lambda m: '', h)
h = re.sub(r'<\?php \$__insta=\[\];[\s\S]*?<\?php endif; \?>', lambda m: '', h)
h = re.sub(r'<\?php[\s\S]*?\?>', lambda m: '', h); h = re.sub(r'<\?=[\s\S]*?\?>', lambda m: '', h)
open('D:/Print World/tapify/tapify-backend/fg_preview.html', 'w', encoding='utf-8').write(h)
demo = h.replace('/images/templates/flowergardenpro/', 'https://app.tapify.co.in/images/templates/flowergardenpro/')
open('D:/Print World/tapify/tapify-frontend/newTemps/flowerGarden/clean-pro.html', 'w', encoding='utf-8').write(demo)
print('fg_preview.html + flowerGarden/clean-pro.html', len(h) // 1024, 'KB')
