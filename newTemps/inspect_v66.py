import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard66.php', encoding='utf-8').read()


def bspan(s, start):
    depth = 0
    for t in re.finditer(r'<div\b|</div>', s[start:]):
        depth += 1 if t.group(0) == '<div' else -1
        if depth == 0:
            return start + t.end()
    return -1


def c(s):
    s = re.sub(r'<svg[\s\S]*?</svg>', '<SVG/>', s)
    return re.sub(r'\s+', ' ', s)


# 1) profile block (name/occupation/tagline)
i = h.find('profile-name')
print('===== PROFILE BLOCK =====')
print(c(h[i-60:i+650]))
print()

# 2) section-heading font-family + right-bg/left-bg CSS
print('===== section-heading h2 font-family in CSS =====')
for m in re.finditer(r'\.section-heading h2\s*\{[^}]*\}', h):
    print(c(m.group(0))[:300])
for m in re.finditer(r'\.(?:right|left)-bg(?:[ .:][^\{]*)?\{[^}]*\}', h):
    print(c(m.group(0))[:260])
print()

# 3) contact section (6 boxes)
print('===== CONTACT SECTION =====')
m = re.search(r'<div class="contact-section', h)
print(c(h[m.start():bspan(h, m.start())])[:2600])
print()

# 4) testimonial section markup + the testimonial-card css height
print('===== TESTIMONIAL SECTION (body) =====')
m = re.search(r'<div class="testimonial-section', h)
if m:
    print(c(h[m.start():m.start()+900])[:900])
print('--- testimonial css (card/section sizing) ---')
for m in re.finditer(r'\.testimonial-(?:section|card|slider)[^\{]*\{[^}]*\}', h):
    seg = c(m.group(0))
    if any(k in seg for k in ['height', 'min-height', 'max-width', 'width', 'padding']):
        print(seg[:240])

# 5) which sections currently have NO empty-guard (heading shows even if empty)
print()
print('===== SECTION GUARDS =====')
for name, sec in [('product', 'product-section'), ('gallery', 'gallery-section'),
                  ('testimonial', 'testimonial-section'), ('blog', 'blog-section'),
                  ('services', 'our-services-section')]:
    m = re.search(r'<div class="' + sec, h)
    if not m:
        print(f'{name}: NOT FOUND'); continue
    pre = h[max(0, m.start()-80):m.start()]
    guarded = 'if(!empty' in pre
    print(f'{name:12} guarded_just_before={guarded}  pre="...{c(pre)[-60:]}"')
