import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SRC = 'D:/Print World/tapify/tapify-frontend/newTemps/imagesTravelAgency/Travel Agency ｜ Tapify (6_11_2026 2：07：54 PM).html'
h = open(SRC, encoding='utf-8', errors='replace').read()
bs = re.search(r'<body[^>]*>', h, re.I)
body = h[bs.end():]


def clean(s):
    s = re.sub(r'<svg[\s\S]*?</svg>', '<SVG/>', s)
    s = re.sub(r'data:image/[a-z+]+;base64,[A-Za-z0-9+/=]+', 'B64', s)
    s = re.sub(r'\s+', ' ', s)
    return s


def bspan(s, start):
    depth = 0
    for t in re.finditer(r'<div\b|</div>', s[start:]):
        depth += 1 if t.group(0) == '<div' else -1
        if depth == 0:
            return start + t.end()
    return -1


# 1) SOCIAL: one full <span class="social-icon"> with its inner svg kept (to see icon source)
print('===== SOCIAL ICON (first item, svg kept) =====')
m = re.search(r'<span class="social-icon[^"]*">[\s\S]*?</span>', body)
print(re.sub(r'\s+', ' ', m.group(0))[:900] if m else 'NONE')
print()
# how many + their hrefs
print('social hrefs:', re.findall(r'<span class="social-icon[\s\S]*?href=([^\s>]+)', body)[:8])
print()

# 2) BUSINESS HOURS full section
print('===== BUSINESS-HOUR SECTION =====')
m = re.search(r'<div class="business-hour-section', body)
print(clean(body[m.start():bspan(body, m.start())])[:1800] if m else 'NONE')
print()

# 3) INSTAGRAM section?
print('===== INSTAGRAM present? =====')
for kw in ['instagram', 'insta-', 'insta_', 'Instagram']:
    print(kw, body.count(kw))
mi = re.search(r'<div class="[^"]*insta[^"]*"', body)
if mi:
    print(clean(body[mi.start():bspan(body, mi.start())])[:1200])
print()

# 4) GALLERY section wrapper (to see slider classes / structure)
print('===== GALLERY SECTION (head) =====')
m = re.search(r'<div class="gallery-section', body)
print(clean(body[m.start():m.start()+700])[:700] if m else 'NONE')
