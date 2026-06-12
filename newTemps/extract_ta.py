import re, io, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SRC = 'D:/Print World/tapify/tapify-frontend/newTemps/imagesTravelAgency/Travel Agency ｜ Tapify (6_11_2026 2：07：54 PM).html'
h = open(SRC, encoding='utf-8', errors='replace').read()
bs = re.search(r'<body[^>]*>', h, re.I)
body = h[bs.end():]


def bspan(s, start):
    depth = 0
    for t in re.finditer(r'<div\b|</div>', s[start:]):
        depth += 1 if t.group(0) == '<div' else -1
        if depth == 0:
            return start + t.end()
    return -1


out = {}

# --- Social: map href-domain -> inner svg ---
m = re.search(r'<div class="social-media-section[^"]*">', body)
sec = body[m.start():bspan(body, m.start())]
icons = {}
for a in re.finditer(r'<a href=([^\s>]+)[^>]*>\s*(<svg[\s\S]*?</svg>)\s*</a>', sec):
    href, svg = a.group(1), a.group(2)
    dom = re.sub(r'^https?://(www\.)?', '', href).split('/')[0].split('.')[0].lower()
    icons[dom] = svg
out['social_icons'] = icons
print('social platforms captured:', list(icons.keys()))

# --- Business hour: the time-icons svg + the card template ---
m = re.search(r'<div class="business-hour-card[^"]*"[^>]*>', body)
bh = body[m.start():bspan(body, m.start())]
svgm = re.search(r'<div class="time-icons[^"]*">\s*(<svg[\s\S]*?</svg>)', bh)
out['bh_icon'] = svgm.group(1) if svgm else ''
print('bh icon captured:', bool(svgm))

# --- Instagram section ---
mi = re.search(r'<div class="[^"]*(?:instagram|insta-)[^"]*"', body)
if mi:
    # climb to nearest enclosing section div
    seg = body[mi.start():bspan(body, mi.start())]
    out['insta_raw'] = re.sub(r'data:image/[a-z+]+;base64,[A-Za-z0-9+/=]+', 'B64', seg)[:2500]
    print('instagram block captured, len', len(seg))
else:
    out['insta_raw'] = ''
    print('no instagram block')

# context around the word instagram (section name)
for mm in re.finditer(r'instagram', body):
    print('  ...', re.sub(r'\s+', ' ', body[mm.start()-80:mm.start()+40]))
    break

json.dump(out, open('D:/Print World/tapify/tapify-frontend/newTemps/_ta_extract.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('saved _ta_extract.json')
