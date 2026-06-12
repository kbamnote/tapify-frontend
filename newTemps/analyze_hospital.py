import re, io, sys
from collections import Counter
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

V = open('D:/Print World/tapify/tapify-backend/templates/vcard67.php', encoding='utf-8', errors='replace').read()
SF = open('D:/Print World/tapify/tapify-frontend/newTemps/imagesHospital/Doctor ｜ Tapify (6_4_2026 11：19：47 AM).html', encoding='utf-8', errors='replace').read()
DOL = chr(36)  # $

print('===== CURRENT vcard67.php =====')
print('size KB:', len(V) // 1024)
print('-- vcard field bindings --')
for f in ['first_name', 'email', 'phone', 'alternate_phone', 'occupation', 'location', 'dob']:
    print('  %s: %d' % (f, V.count('vcard["' + f)), end='')
print()
print('-- data loops --')
for v in ['services', 'products', 'galleries', 'testimonials', 'businessHours', 'socialLinks', 'insta_feed', 'iframes', 'serviceCategories']:
    print('  %s%s: %d' % (DOL, v, V.count(DOL + v)), end='')
print()
print('-- assets / structure --')
c = Counter(re.findall(r'/images/templates/[a-z0-9_-]+/', V))
print('  asset prefixes:', dict(c.most_common(5)))
print('  imgUrl(:', V.count('imgUrl('), '| cloudinary:', V.count('res.cloudinary'))
for k in ['gallery-slider', 'business-hour', 'social-media', 'social-icon', 'product-slider', 'testimonial-slider', 'our-services', '_shared-scripts', 'figtree']:
    print('  %s: %d' % (k, V.count(k)), end='')
print()

print()
print('===== SINGLEFILE (Doctor/Hospital) =====')
print('size KB:', len(SF) // 1024)
bs = re.search(r'<body[^>]*>', SF, re.I)
body = SF[bs.end():] if bs else SF
print('-- section/slider classes in body --')
secs = Counter(re.findall(r'<div class="([^"]*(?:section|slider)[^"]*)"', body))
for k, v in secs.most_common(30):
    print('  ', v, k[:65])
print('-- @font-face names --')
print('  ', sorted(set(re.findall(r'@font-face\s*\{[^}]*?font-family\s*:\s*[\'\"]?([A-Za-z0-9 _-]+)', SF))))
print('-- social --')
print('  social-media-section:', body.count('social-media-section'), '| social-icon:', body.count('social-icon'))
print('-- business hours --')
print('  business-hour:', body.count('business-hour'))
print('-- gallery --')
print('  gallery-slider:', body.count('gallery-slider'), '| gallery-img:', body.count('gallery-img'))
