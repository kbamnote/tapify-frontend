import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard67.php', encoding='utf-8').read()
for label, pat in [('social', r'foreach \(\$socialLinks'), ('bh', r'foreach \(\(isset\(\$__bh\)'),
                   ('product', r'foreach \(\(isset\(\$__pr\)'), ('testimonial', r'foreach \(\(isset\(\$__te\)'),
                   ('gallery', r'foreach \(\(isset\(\$__ga\)')]:
    m = re.search(pat, h)
    print(label, '->', m.start() if m else 'NOT FOUND')
m = re.search(r'\.gallery-slider \.gallery-img\{[^}]*\}', h)
print('gallery-img css:', re.sub(r'\s+', ' ', m.group(0))[:200] if m else 'none')
print('figtree in css (case-insens):', bool(re.search(r'font-family\s*:\s*[\'"]?figtree', h, re.I)))
m = re.search(r'\bbody\s*\{[^}]*font-family[^;}]*', h)
print('body font decl:', re.sub(r'\s+', ' ', m.group(0))[:90] if m else 'none')
print('div balance:', len(re.findall(r'<div\b', h)) == len(re.findall(r'</div>', h)))
print('php tag balance:', len(re.findall(r'<\?php|<\?=', h)) == len(re.findall(r'\?>', h)))
