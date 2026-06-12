import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard67.php', encoding='utf-8').read()
# work on body only (after the head </style>...</head>)
bi = h.find('</head>')
body = h[bi:]


def clean(s):
    s = re.sub(r'<svg[\s\S]*?</svg>', '<SVG/>', s)
    s = re.sub(r'<\?php \$cvType[\s\S]*?\?>', '{COVER_PHP}', s)
    return re.sub(r'\s+', ' ', s)


def grab(label, pat, n=900):
    m = re.search(pat, body)
    if not m:
        print('=====', label, '===== NOT FOUND')
        return
    print('=====', label, '=====')
    print(clean(body[m.start():m.start() + n])[:n])
    print()


grab('PROFILE/NAME', r'<div class="[^"]*profile-section', 1100)
grab('SOCIAL', r'<div class="[^"]*social-icons[^"]*"', 700)
grab('BUSINESS HOURS', r'<div class="[^"]*business-hour-section', 1200)
grab('CONTACT', r'<div class="[^"]*contact-section', 1400)
grab('APPOINTMENT', r'<div class="[^"]*appointment-section', 1100)
grab('GALLERY', r'<div class="[^"]*gallery-section', 600)
grab('BANNER', r'<div class="banner-section', 400)
