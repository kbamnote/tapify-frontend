import re, io, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard68.php', encoding='utf-8').read()
S = json.load(open('D:/Print World/tapify/tapify-frontend/newTemps/_ta_extract.json', encoding='utf-8'))['social_icons']
A = '/images/templates/realestatepro/'

h = re.sub(r'<\?php /\*\*[\s\S]*?\?>\n?', '', h, count=1)
ss = open('D:/Print World/tapify/tapify-backend/templates/_shared-scripts.php', encoding='utf-8').read()
ss = re.sub(r'<\?php[\s\S]*?\?>\n?', '', ss, count=1)
ss = re.sub(r'<\?=\s*json_encode\(\$fullName\)\s*\?>', '"Aarav Mehta"', ss)
ss = re.sub(r'<\?=\s*json_encode\([^)]*\)\s*\?>', '""', ss)
ss = re.sub(r'<\?php[\s\S]*?\?>', '', ss); ss = re.sub(r'<\?=[\s\S]*?\?>', '""', ss)
h = h.replace('<?php include __DIR__ . "/_shared-scripts.php"; ?>', ss, 1)

# social: 5 sample social-tag links
soc = ''.join('<a href="#" target="_blank" class="text-decoration-none social-tag"><div class="social-icon d-flex justify-content-center align-items-center">%s</div></a>' % v
              for v in [S['facebook'], S['instagram'], S['youtube'], S['linkedin'], S['x']])
h = re.sub(r'<\?php foreach \(\$socialLinks[\s\S]*?<\?php endforeach; \?>', lambda m: soc, h, count=1)
# business hours
days = [('Monday', '10:00 AM - 07:00 PM'), ('Tuesday', '10:00 AM - 07:00 PM'), ('Wednesday', '10:00 AM - 07:00 PM'),
        ('Thursday', '10:00 AM - 07:00 PM'), ('Friday', '10:00 AM - 07:00 PM'), ('Saturday', '11:00 AM - 04:00 PM'), ('Sunday', 'Closed')]
bh = ''.join('<div class="col-sm-6"><div class="business-hour-card d-flex gap-2 align-items-center mb-3"><div class="time-icon"><i class="bi bi-clock fs-3"></i></div><div class="d-flex flex-column align-items-start"><span class="fs-14 text-gray lh-1 fw-5">%s</span><span class="fs-16 fw-5">%s</span></div></div></div>' % (d, t) for d, t in days)
h = re.sub(r'<\?php foreach \(\(isset\(\$__bh\)[\s\S]*?<\?php endforeach; \?>', lambda m: bh, h, count=1)
# products
pim = ['rea-008.webp', 'rea-011.webp', 'rea-013.webp', 'rea-014.webp']
prods = ''.join('<div class="px-2"><div class="product-card card"><div class="product-img card-img"><img src="%s%s" class="w-100 h-100 object-fit-cover"></div><div class="product-desc card-body d-flex flex-column align-items-center justify-content-between"><div class="product-title"><h3 class="text-dark text-center">Property %d</h3></div><div class="product-amount"><span>Rs %d0 Lakh</span></div></div></div></div>' % (A, pim[i - 1], i, i) for i in range(1, 5))
h = re.sub(r'<\?php foreach \(\(isset\(\$__pr\)[\s\S]*?<\?php endforeach; \?>', lambda m: prods, h, count=1)
# testimonials
tes = ''.join('<div class="px-2"><div class="testimonial-card p-0"><div class="card-body text-center"><p class="text-gray mb-0">Aarav found us our dream home. Smooth, professional, highly recommended.</p></div><div class="d-flex flex-column align-items-center gap-2"><h5 class="fw-6 mb-0">Client %d</h5></div></div></div>' % i for i in range(1, 4))
h = re.sub(r'<\?php foreach \(\(isset\(\$__te\)[\s\S]*?<\?php endforeach; \?>', lambda m: tes, h, count=1)
# gallery
gim = ['rea-006.webp', 'rea-012.webp', 'rea-013.webp', 'rea-015.webp', 'rea-048.webp']
gal = ''.join('<div class="px-2"><div class="gallery-img-wrapper"><div class="gallery-img" style="background-image:url(\'%s%s\');background-size:cover;background-position:center;height:280px;border-radius:12px;"></div></div></div>' % (A, g) for g in gim)
h = re.sub(r'<\?php foreach \(\(isset\(\$__ga\)[\s\S]*?<\?php endforeach; endforeach; \?>', lambda m: gal, h, count=1)
# banner
h = re.sub(r'<\?php \$cvType[\s\S]*?\?>', lambda m: '<img src="%srea-008.webp" style="width:100%%;height:100%%;object-fit:cover;display:block;">' % A, h)

def rsub(p, v):
    global h; h = re.sub(p, lambda m: v, h)

rsub(r'<\?=\s*htmlspecialchars\(\$fullName\)\s*\?>', 'Aarav Mehta')
rsub(r'<\?=\s*\$profileImg\s*\?>', A + 'rea-001.webp')
rsub(r'<\?=\s*htmlspecialchars\(\$profileImg\)\s*\?>', A + 'rea-001.webp')
rsub(r'<\?=\s*\$qrUrl\s*\?>', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=preview')
rsub(r'<\?=\s*htmlspecialchars\(\$vcard\["email"\] \?\? ""\)\s*\?>', 'aarav@realty.example')
rsub(r'<\?=\s*htmlspecialchars\(\$vcard\["phone"\] \?\? ""\)\s*\?>', '+91 98005 08990')
rsub(r'<\?=\s*htmlspecialchars\(\$vcard\["occupation"\] \?\? ""\)\s*\?>', 'Real Estate Agent')

h = re.sub(r'<\?php if\(!empty\(\$vcard\["description"\]\)\):[\s\S]*?<\?php else: \?>', lambda m: '', h)
for f in ['alternate_email', 'alternate_phone', 'dob', 'location']:
    h = re.sub(r'<\?php if\(!empty\(\$vcard\["' + f + r'"\]\)\): \?>[\s\S]*?<\?php endif; \?>', lambda m: '', h)
h = re.sub(r'<\?php \$__ifr=array_filter[\s\S]*?<\?php endif; \?>', lambda m: '', h)
h = re.sub(r'<\?php \$__insta=\[\];[\s\S]*?<\?php endif; \?>', lambda m: '', h)
h = re.sub(r'<\?php[\s\S]*?\?>', lambda m: '', h); h = re.sub(r'<\?=[\s\S]*?\?>', lambda m: '', h)

open('D:/Print World/tapify/tapify-backend/re_preview.html', 'w', encoding='utf-8').write(h)
demo = h.replace('/images/templates/realestatepro/', 'https://app.tapify.co.in/images/templates/realestatepro/')
open('D:/Print World/tapify/tapify-frontend/newTemps/realEstate/clean-pro.html', 'w', encoding='utf-8').write(demo)
print('re_preview.html + realEstate/clean-pro.html written', len(h) // 1024, 'KB')
