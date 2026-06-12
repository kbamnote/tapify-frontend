import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard67.php', encoding='utf-8').read()
A = '/images/templates/hospitalpro/'

h = re.sub(r'<\?php /\*\*[\s\S]*?\?>\n?', '', h, count=1)
# inline shared scripts
ss = open('D:/Print World/tapify/tapify-backend/templates/_shared-scripts.php', encoding='utf-8').read()
ss = re.sub(r'<\?php[\s\S]*?\?>\n?', '', ss, count=1)
ss = re.sub(r'<\?=\s*json_encode\(\$fullName\)\s*\?>', '"Dr. Rishi Verma"', ss)
ss = re.sub(r'<\?=\s*json_encode\([^)]*\)\s*\?>', '""', ss)
ss = re.sub(r'<\?php[\s\S]*?\?>', '', ss)
ss = re.sub(r'<\?=[\s\S]*?\?>', '""', ss)
h = h.replace('<?php include __DIR__ . "/_shared-scripts.php"; ?>', ss, 1)

# social
soc = ''.join('<a href="#"><i class="fab %s icon fa-2x"></i></a>' % i for i in ['fa-facebook-f', 'fa-instagram', 'fa-youtube', 'fa-linkedin-in', 'fa-x-twitter'])
h = re.sub(r'<\?php foreach \(\$socialLinks[\s\S]*?<\?php endforeach; \?>', lambda m: soc, h, count=1)
# business hours
days = [('Monday', '10:00 AM - 06:00 PM'), ('Tuesday', '10:00 AM - 06:00 PM'), ('Wednesday', '10:00 AM - 06:00 PM'),
        ('Thursday', '10:00 AM - 06:00 PM'), ('Friday', '10:00 AM - 06:00 PM'), ('Saturday', '10:00 AM - 02:00 PM'), ('Sunday', 'Closed')]
bh = ''.join('<div class="col-sm-6"><div class="business-hour-card d-flex gap-2 align-items-center mb-3"><div class="time-icon"><i class="bi bi-clock fs-3"></i></div><div class="d-flex flex-column align-items-start"><span class="fs-14 text-gray lh-1 fw-5">%s</span><span class="fs-16 fw-5">%s</span></div></div></div>' % (d, t) for d, t in days)
h = re.sub(r'<\?php foreach \(\(isset\(\$__bh\)[\s\S]*?<\?php endforeach; \?>', lambda m: bh, h, count=1)
# products (real photo assets)
pimgs = ['hos-008.webp', 'hos-014.webp', 'hos-036.webp', 'hos-050.webp']
prods = ''.join('<div class="px-2"><div class="product-card card"><div class="product-img card-img"><img src="%s%s" class="w-100 h-100 object-fit-cover"></div><div class="product-desc card-body d-flex flex-column align-items-center justify-content-between"><div class="product-title"><h3 class="text-dark text-center">Service %d</h3></div><div class="product-amount"><span>Rs %d00</span></div></div></div></div>' % (A, pimgs[i - 1], i, i) for i in range(1, 5))
h = re.sub(r'<\?php foreach \(\(isset\(\$__pr\)[\s\S]*?<\?php endforeach; \?>', lambda m: prods, h, count=1)
# testimonials
tes = ''.join('<div class="px-2"><div class="testimonial-card p-0"><div class="card-body text-center"><p class="text-gray mb-0">Excellent care and very professional staff. Highly recommend Dr. Verma.</p></div><div class="d-flex flex-column align-items-center gap-2"><h5 class="fw-6 mb-0">Patient %d</h5></div></div></div>' % i for i in range(1, 4))
h = re.sub(r'<\?php foreach \(\(isset\(\$__te\)[\s\S]*?<\?php endforeach; \?>', lambda m: tes, h, count=1)
# gallery (background-image slides, real photos)
gimgs = ['hos-005.webp', 'hos-011.webp', 'hos-013.webp', 'hos-015.webp', 'hos-016.webp']
gal = ''.join('<div class="px-2"><div class="gallery-img-wrapper"><div class="gallery-img" style="background-image:url(\'%s%s\');background-size:cover;background-position:center;height:280px;border-radius:12px;"></div></div></div>' % (A, g) for g in gimgs)
h = re.sub(r'<\?php foreach \(\(isset\(\$__ga\)[\s\S]*?<\?php endforeach; endforeach; \?>', lambda m: gal, h, count=1)
# banner
h = re.sub(r'<\?php \$cvType[\s\S]*?\?>', lambda m: '<img src="%shos-003.webp" style="width:100%%;height:100%%;object-fit:cover;display:block;">' % A, h)

def rsub(pat, val):
    global h
    h = re.sub(pat, lambda m: val, h)

rsub(r'<\?=\s*htmlspecialchars\(\$fullName\)\s*\?>', 'Dr. Rishi Verma')
rsub(r'<\?=\s*\$profileImg\s*\?>', A + 'hos-001.webp')
rsub(r'<\?=\s*htmlspecialchars\(\$profileImg\)\s*\?>', A + 'hos-001.webp')
rsub(r'<\?=\s*\$qrUrl\s*\?>', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=preview')
rsub(r'<\?=\s*htmlspecialchars\(\$vcard\["email"\] \?\? ""\)\s*\?>', 'rishi@hospital.example')
rsub(r'<\?=\s*htmlspecialchars\(\$vcard\["phone"\] \?\? ""\)\s*\?>', '+91 98005 08990')
rsub(r'<\?=\s*htmlspecialchars\(\$vcard\["occupation"\] \?\? ""\)\s*\?>', 'Neurosurgeon')

h = re.sub(r'<\?php if\(!empty\(\$vcard\["description"\]\)\):[\s\S]*?<\?php else: \?>', lambda m: '', h)
# drop empty-field guarded boxes/sections that lack sample data
h = re.sub(r'<\?php if\(!empty\(\$vcard\["alternate_phone"\]\)\): \?>[\s\S]*?<\?php endif; \?>', lambda m: '', h)
h = re.sub(r'<\?php if\(!empty\(\$vcard\["dob"\]\)\): \?>[\s\S]*?<\?php endif; \?>', lambda m: '', h)
h = re.sub(r'<\?php if\(!empty\(\$vcard\["location"\]\)\): \?>[\s\S]*?<\?php endif; \?>', lambda m: '', h)
h = re.sub(r'<\?php \$__ifr=array_filter[\s\S]*?<\?php endif; \?>', lambda m: '', h)
h = re.sub(r'<\?php \$__insta=\[\];[\s\S]*?<\?php endif; \?>', lambda m: '', h)
h = re.sub(r'<\?php[\s\S]*?\?>', lambda m: '', h)
h = re.sub(r'<\?=[\s\S]*?\?>', lambda m: '', h)

open('D:/Print World/tapify/tapify-backend/hosp_preview.html', 'w', encoding='utf-8').write(h)
# demo for frontend "View Demo": absolute asset URLs
demo = h.replace('/images/templates/hospitalpro/', 'https://app.tapify.co.in/images/templates/hospitalpro/')
open('D:/Print World/tapify/tapify-frontend/newTemps/imagesHospital/clean-pro.html', 'w', encoding='utf-8').write(demo)
print('hosp_preview.html + imagesHospital/clean-pro.html written', len(h) // 1024, 'KB')
