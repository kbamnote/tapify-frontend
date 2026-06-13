import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard69.php', encoding='utf-8').read()
bi = h.find('</head>'); body = h[bi:]


def bspan(s, start):
    d = 0
    for t in re.finditer(r'<div\b|</div>', s[start:]):
        d += 1 if t.group(0) == '<div' else -1
        if d == 0:
            return start + t.end()
    return -1


def c(s):
    s = re.sub(r'<svg[\s\S]*?</svg>', '<SVG/>', s)
    return re.sub(r'\s+', ' ', s)


def grab(label, pat, n=1100):
    m = re.search(pat, body)
    print('=====', label, '=====')
    print(c(body[m.start():m.start() + n])[:n] if m else 'NOT FOUND')
    print()


grab('SOCIAL', r'<div class="[^"]*social-section[^"]*"', 1100)
grab('SERVICE', r'<div class="[^"]*service-section[^"]*"', 1100)
grab('TESTIMONIAL', r'<div class="[^"]*testimonial-section[^"]*"', 900)
grab('NAME area', r'<\?= htmlspecialchars\(\$fullName\)', 500)
# is $services dynamic anywhere?
print('$services in body:', body.count('$services'), '| $testimonials:', body.count('$testimonials'), '| $socialLinks:', body.count('$socialLinks'))
