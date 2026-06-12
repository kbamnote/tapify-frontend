# Build a static preview of the UPDATED vcard66.php with sample data so the
# fixed sections (fonts, logo, social, business hours, gallery) can be eyeballed.
import io, re, sys, json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard66.php', encoding='utf-8').read()
EX = json.load(open('D:/Print World/tapify/tapify-frontend/newTemps/_ta_extract.json', encoding='utf-8'))
S = EX['social_icons']; BH = EX['bh_icon']
A = '/images/templates/travelagency/'

# strip the php header block
h = re.sub(r'<\?php /\*\*[\s\S]*?\?>\n?', '', h, count=1)

# ---- social foreach -> 4 sample platforms (exercise the SVG branches) ----
social_inner = ''.join(
    f'<span class="social-icon d-flex justify-content-center align-items-center"><a href="#" target="_blank">{svg}</a></span>'
    for svg in [S['facebook'], S['instagram'], S['youtube'], S['linkedin'], S['x'], S['tapkya']])
h = re.sub(r'<\?php foreach \(\$socialLinks[\s\S]*?<\?php endforeach; \?>', social_inner, h, count=1)

# ---- business hours foreach -> 7 sample days ----
days = [('Monday', '10:00 AM - 07:00 PM'), ('Tuesday', '10:00 AM - 07:00 PM'),
        ('Wednesday', '10:00 AM - 07:00 PM'), ('Thursday', '10:00 AM - 07:00 PM'),
        ('Friday', '10:00 AM - 07:00 PM'), ('Saturday', '11:00 AM - 04:00 PM'), ('Sunday', 'Closed')]
bh_inner = ''.join(
    f'<div class="col-sm-6"><div class="business-hour align-items-center">'
    f'<div class="time-icons d-flex align-items-center justify-content-center">{BH}</div>'
    f'<div class="justify-content-center align-items-center flex-column d-flex">'
    f'<span class="text-gray-300">{d}:</span><span>{t}</span></div></div></div>'
    for d, t in days)
h = re.sub(r'<\?php foreach \(\$businessHours[\s\S]*?<\?php endforeach; \?>', bh_inner, h, count=1)

# ---- gallery foreach -> 5 sample images ----
gimgs = ['Beach-fun.jpg', 'Flight.jpg', 'hotel.jpg', 'Tour-Package.jpg', 'Vietnamese.jpg']
gal_inner = ''.join(
    f'<div><div class="gallery-img"><div class="expand-icon pe-none"></div>'
    f'<a href="{A}{re.sub(r"[^A-Za-z0-9.-]","-",g)}" data-lightbox="gallery-images">'
    f'<img src="{A}tra-00{i}.webp" alt="gallery" class="w-100 h-100 object-fit-cover" loading="lazy"></a></div></div>'
    for i, g in enumerate(gimgs))
h = re.sub(r'<\?php foreach \(\(isset\(\$__ga\)[\s\S]*?<\?php endforeach; endforeach; \?>', gal_inner, h, count=1)

# ---- banner php -> static cover ----
h = re.sub(r'<\?php \$cvType[\s\S]*?\?>',
           f'<img src="{A}tra-010.webp" style="width:100%;height:100%;object-fit:cover;display:block;">', h)

# ---- scalar php echoes ----
rep = {
    r'<\?=\s*htmlspecialchars\(\$fullName\)\s*\?>': 'Naina Holidays',
    r'<\?=\s*htmlspecialchars\(\$vcard\["occupation"\] \?\? ""\)\s*\?>': 'Tours &amp; Travel',
    r'<\?=\s*htmlspecialchars\(\$profileImg\)\s*\?>': A + 'tra-049.webp',
    r'<\?=\s*\$qrUrl\s*\?>': 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=preview',
}
for k, v in rep.items():
    h = re.sub(k, v, h)
# description block
h = re.sub(r'<\?php if\(!empty\(\$vcard\["description"\]\)\):[\s\S]*?<\?php else: \?>', '', h)
h = re.sub(r'<\?php endif; \?>', '', h)
# remaining php -> drop
h = re.sub(r'<\?php[\s\S]*?\?>', '', h)
h = re.sub(r'<\?=[\s\S]*?\?>', '', h)
# keep local absolute paths so the local preview server (root = tapify-backend) serves assets
open('D:/Print World/tapify/tapify-backend/preview_static.html', 'w', encoding='utf-8').write(h)
print('preview written', len(h) // 1024, 'KB')
