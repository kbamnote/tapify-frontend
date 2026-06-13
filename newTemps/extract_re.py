import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard63.php', encoding='utf-8').read()
bi = h.find('</head>'); body = h[bi:]
DOL = chr(36)


def clean(s):
    s = re.sub(r'<svg[\s\S]*?</svg>', '<SVG/>', s)
    s = re.sub(r'<\?php \$cvType[\s\S]*?\?>', '{COVER}', s)
    return re.sub(r'\s+', ' ', s)


def grab(label, pat, n=900):
    m = re.search(pat, body)
    print('=====', label, '=====')
    print(clean(body[m.start():m.start() + n])[:n] if m else 'NOT FOUND')
    print()


print('canvas (particles):', body.count('<canvas'))
print('cover overlay:', 'rgba(0,0,0,0.5)' in h)
print('orphan iframe:', h.count('</iframe<'))
grab('PROFILE/NAME', r'<div class="[^"]*profile-section', 1300)
grab('SOCIAL (full)', r'<div class="[^"]*social-media-section[^"]*"', 1600)
grab('CONTACT', r'<div class="[^"]*contact-section', 1600)
grab('BUSINESS HOURS', r'<div class="[^"]*business-hour-section', 700)
grab('APPOINTMENT', r'id=pickUpDate', 400)
grab('GALLERY', r'<div class="[^"]*gallery-section', 500)
# name h2 exact
m = re.search(r'<h2 class="text-dark fs-24[^>]*>[\s\S]*?</h2>\s*<p[^>]*>[\s\S]*?</p>\s*<p[^>]*>[\s\S]*?</p>\s*<p[^>]*>[\s\S]*?</p>', body)
print('===== NAME BLOCK (raw) =====')
print(repr(body[m.start():m.end()]) if m else 'NOT FOUND')
