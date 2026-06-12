import re, io, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard66.php', encoding='utf-8').read()
EX = json.load(open('D:/Print World/tapify/tapify-frontend/newTemps/_ta_extract.json', encoding='utf-8'))
S = EX['social_icons']; BH = EX['bh_icon']
A = '/images/templates/travelagency/'

h = re.sub(r'<\?php /\*\*[\s\S]*?\?>\n?', '', h, count=1)

# social
soc = ''.join(f'<span class="social-icon d-flex justify-content-center align-items-center"><a href="#">{v}</a></span>'
              for v in [S['facebook'], S['instagram'], S['youtube'], S['linkedin'], S['x'], S['tapkya']])
h = re.sub(r'<\?php foreach \(\$socialLinks[\s\S]*?<\?php endforeach; \?>', lambda m: soc, h, count=1)

# business hours
days = [('Monday', '10:00 AM - 07:00 PM'), ('Tuesday', '10:00 AM - 07:00 PM'), ('Wednesday', '10:00 AM - 07:00 PM'),
        ('Thursday', '10:00 AM - 07:00 PM'), ('Friday', '10:00 AM - 07:00 PM'), ('Saturday', '11:00 AM - 04:00 PM'), ('Sunday', 'Closed')]
bh = ''.join(f'<div class="col-sm-6"><div class="business-hour align-items-center"><div class="time-icons d-flex align-items-center justify-content-center">{BH}</div><div class="justify-content-center align-items-center flex-column d-flex"><span class="text-gray-300">{d}:</span><span>{t}</span></div></div></div>' for d, t in days)
h = re.sub(r'<\?php foreach \(\$businessHours[\s\S]*?<\?php endforeach; \?>', lambda m: bh, h, count=1)

# testimonials (faithful card)
tdata = [('Amazing trip planning! Everything from flights to hotels was seamless. Highly recommend Naina Holidays for a stress-free vacation.', 'Priya Iyer'),
         ('Our Dubai package was perfectly organized. Great support throughout. We will book again!', 'Mona Nair')]
tcards = ''.join(
    f'<div class="px-2"><div class="testimonial-card position-relative"><div class="quto-left"><i class="fas fa-quote-left" style="color:#fff;font-size:20px;"></i></div><div class="card-body text-center"><p class="desc text-gray mb-0">{msg}</p></div><div class="d-flex flex-column align-items-center justify-content-center gap-2 mt-2"><div class="testimonial-profile-img"><img src="{A}tra-001.webp" class="w-100 h-100 object-fit-cover"></div><h3 class="fw-6 mb-0">{nm}</h3></div><div class="quto-right"><i class="fas fa-quote-right" style="color:#fff;font-size:20px;"></i></div></div></div>'
    for msg, nm in tdata)
h = re.sub(r'<\?php foreach \(\(isset\(\$__te\)[\s\S]*?<\?php endforeach; \?>', lambda m: tcards, h, count=1)

# gallery
gal = ''.join(f'<div><div class="gallery-img"><div class="expand-icon pe-none"></div><a href="{A}tra-00{i}.webp" data-lightbox="gallery-images"><img src="{A}tra-00{i}.webp" class="w-100 h-100 object-fit-cover"></a></div></div>' for i in range(1, 6))
h = re.sub(r'<\?php foreach \(\(isset\(\$__ga\)[\s\S]*?<\?php endforeach; endforeach; \?>', lambda m: gal, h, count=1)

# banner
h = re.sub(r'<\?php \$cvType[\s\S]*?\?>', lambda m: f'<img src="{A}tra-010.webp" style="width:100%;height:100%;object-fit:cover;display:block;">', h)

# scalar echoes (use functions to avoid backref issues)
def rsub(pat, val):
    global h
    h = re.sub(pat, lambda m: val, h)

rsub(r'<\?=\s*htmlspecialchars\(\$fullName\)\s*\?>', 'Naina Holidays')
rsub(r'<\?=\s*htmlspecialchars\(\$profileImg\)\s*\?>', A + 'tra-049.webp')
rsub(r'<\?=\s*\$profileImg\s*\?>', A + 'tra-049.webp')
rsub(r'<\?=\s*\$qrUrl\s*\?>', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=preview')
rsub(r'<\?=\s*htmlspecialchars\(\$vcard\["email"\] \?\? ""\)\s*\?>', 'naina@holidays.example')
rsub(r'<\?=\s*htmlspecialchars\(\$vcard\["phone"\] \?\? ""\)\s*\?>', '7276421027')
rsub(r'<\?=\s*htmlspecialchars\(\$vcard\["location"\]\)\s*\?>', 'Sartaj Colony, Nagpur, Maharashtra 440024')

# description fallback -> keep the static text after <?php else: ?>
h = re.sub(r'<\?php if\(!empty\(\$vcard\["description"\]\)\):[\s\S]*?<\?php else: \?>', lambda m: '', h)
# demo: alt-email/alt-phone empty -> drop their guarded boxes
h = re.sub(r'<\?php if\(!empty\(\$vcard\["alternate_email"\]\)\): \?>[\s\S]*?<\?php endif; \?>', lambda m: '', h)
h = re.sub(r'<\?php if\(!empty\(\$vcard\["alternate_phone"\]\)\): \?>[\s\S]*?<\?php endif; \?>', lambda m: '', h)
# embedded(iframes) empty -> drop section
h = re.sub(r'<\?php \$__ifr=array_filter[\s\S]*?<\?php endif; \?>', lambda m: '', h)
# instagram empty -> drop section
h = re.sub(r'<\?php \$__insta=\[\];[\s\S]*?<\?php endif; \?>', lambda m: '', h)
# drop everything else php
h = re.sub(r'<\?php[\s\S]*?\?>', lambda m: '', h)
h = re.sub(r'<\?=[\s\S]*?\?>', lambda m: '', h)

local = h  # local-path version for the running preview server
demo = h.replace('/images/templates/travelagency/', 'https://app.tapify.co.in/images/templates/travelagency/')
open('D:/Print World/tapify/tapify-backend/preview_static.html', 'w', encoding='utf-8').write(local)
open('D:/Print World/tapify/tapify-frontend/newTemps/imagesTravelAgency/clean.html', 'w', encoding='utf-8').write(demo)
print('preview + clean.html written:', len(h) // 1024, 'KB')
