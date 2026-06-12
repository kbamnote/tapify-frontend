import io, re, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard67.php'
h = open(F, encoding='utf-8').read()
orig = len(h)


def bspan(s, start):
    depth = 0
    for t in re.finditer(r'<div\b|</div>', s[start:]):
        depth += 1 if t.group(0) == '<div' else -1
        if depth == 0:
            return start + t.end()
    return -1


def rep(old, new, label):
    global h
    assert old in h, 'NOT FOUND: ' + label
    h = h.replace(old, new, 1); print('  ok:', label)


# ---- 1) wire static contact fields (regex; markup has embedded newlines) ----
def resub(pat, new, label):
    global h
    h2, n = re.subn(pat, lambda m: new, h, count=1)
    assert n == 1, 'NOT FOUND (regex): ' + label
    h = h2; print('  ok:', label)

resub(r'<a href=tel:<\?= htmlspecialchars\(\$vcard\["phone"\] \?\? ""\) \?> class=text-black dir=ltr>\+91\s*9800508990</a>',
      '<a href="tel:<?= htmlspecialchars($vcard["phone"] ?? "") ?>" class=text-black dir=ltr><?= htmlspecialchars($vcard["phone"] ?? "") ?></a>', 'phone text')
resub(r'<a href=tel:\+919800508990 class=text-black dir=ltr>\+91\s*9800508990</a>',
      '<a href="tel:<?= htmlspecialchars($vcard["alternate_phone"] ?? "") ?>" class=text-black dir=ltr><?= htmlspecialchars($vcard["alternate_phone"] ?? "") ?></a>', 'alt phone')
resub(r'<p class="mb-0 text-black">\s*12th June, 1885\s*</p>',
      '<p class="mb-0 text-black"><?= htmlspecialchars(date("jS F, Y", strtotime($vcard["dob"]))) ?></p>', 'dob')
resub(r'<p class="text-black mb-0">\s*New Delhi, India\s*</p>',
      '<p class="text-black mb-0"><?= htmlspecialchars($vcard["location"]) ?></p>', 'location')


# ---- 2) guard each contact box (hide when empty) ----
def guard_box(uniq, cond, label):
    global h
    i = h.find(uniq)
    assert i >= 0, 'box uniq not found: ' + label
    col = h.rfind('<div class=col-sm-6>', 0, i)
    assert col >= 0, 'col not found: ' + label
    end = bspan(h, col)
    h = h[:col] + '<?php if(' + cond + '): ?>' + h[col:end] + '<?php endif; ?>' + h[end:]
    print('  ok: guard', label)


guard_box('mailto:<?= htmlspecialchars($vcard["email"] ?? "") ?>', '!empty($vcard["email"])', 'email')
guard_box('"tel:<?= htmlspecialchars($vcard["phone"] ?? "") ?>"', '!empty($vcard["phone"])', 'phone')
guard_box('"tel:<?= htmlspecialchars($vcard["alternate_phone"] ?? "") ?>"', '!empty($vcard["alternate_phone"])', 'alt phone')
guard_box('date("jS F, Y", strtotime($vcard["dob"]))', '!empty($vcard["dob"])', 'dob')
guard_box('htmlspecialchars($vcard["location"]) ?></p>', '!empty($vcard["location"])', 'location')

# ---- 3) profile description -> $vcard description (keep static as fallback) ----
m = re.search(r'<div class="text-center profile-desc pt-40">\s*<div>\s*<p>A <strong>Neurosurgeon</strong>[\s\S]*?</p>\s*</div>', h)
assert m, 'profile desc not found'
inner = m.group(0)
fixed = re.sub(r'<p>A <strong>Neurosurgeon</strong>[\s\S]*?</p>',
               '<?php if(!empty($vcard["description"])): ?><?= $vcard["description"] ?><?php else: ?><p>A <strong>Neurosurgeon</strong> is a highly specialized medical doctor who diagnoses and performs surgical treatment of disorders affecting the brain, spinal cord, and peripheral nerves.</p><?php endif; ?>', inner)
h = h.replace(inner, fixed, 1)
print('  ok: profile description mapped')

# ---- 4) section empty-guards (product / gallery / testimonial) ----
def wrap(cls, cond, label):
    global h
    m = re.search(r'<div class="[^"]*' + cls + r'[^"]*"', h)
    assert m, 'section not found: ' + label
    end = bspan(h, m.start())
    h = h[:m.start()] + '<?php if(' + cond + '): ?>' + h[m.start():end] + '<?php endif; ?>' + h[end:]
    print('  ok: guard section', label)


wrap('product-section', '!empty(isset($__pr)?$__pr:($products ?? []))', 'product')
wrap('testimonial-section', '!empty(isset($__te)?$__te:($testimonials ?? []))', 'testimonial')
# gallery: only if at least one image
m = re.search(r'<div class="[^"]*gallery-section[^"]*"', h)
end = bspan(h, m.start())
gg = '<?php $__gc=0; foreach((isset($__ga)?$__ga:($galleries ?? [])) as $__g){$__gc+=count($__g["images"] ?? []);} if($__gc>0): ?>'
h = h[:m.start()] + gg + h[m.start():end] + '<?php endif; ?>' + h[end:]
print('  ok: guard section gallery')

# ---- 5) Embedded (iframes) + Instagram sections before QR ----
EMBED = ('<?php $__ifr=array_filter($iframes ?? [], function($fr){return !empty($fr["url"]) && preg_match("#^https?://#i",$fr["url"]);});'
         ' if(!empty($__ifr)): ?>'
         '<div class="embedded-section section-bg pt-50 px-30 position-relative">'
         '<div class="section-heading position-relative text-center pb-40"><h2 class="text-center fw-bold">Embedded</h2></div>'
         '<div class="pt-2"><?php foreach ($__ifr as $fr): ?>'
         '<div style="border:1px solid #c9ecec;border-radius:15px;overflow:hidden;background:#fff;margin-bottom:16px;">'
         '<iframe src="<?= htmlspecialchars(embeddableMapUrl($fr["url"])) ?>" width="100%" height="360" frameborder="0" loading="lazy" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="display:block;"></iframe>'
         '</div><?php endforeach; ?></div></div><?php endif; ?>')
INSTA = ('<?php $__insta=[]; foreach (($insta_feed ?? []) as $__if) {'
         'if(!empty($__if["embed_url"]) && preg_match("#^https?://#i",$__if["embed_url"])){$__insta[]=$__if["embed_url"];}'
         'elseif(!empty($__if["tag"]) && preg_match("#https?://(?:www\\.)?instagram\\.com/(p|reel|tv)/([A-Za-z0-9_-]+)#",$__if["tag"],$__m)){$__insta[]="https://www.instagram.com/".$__m[1]."/".$__m[2]."/embed/";}'
         '} if(!empty($__insta)): ?>'
         '<div class="instagram-feed-section section-bg pt-50 px-30 position-relative">'
         '<div class="section-heading position-relative text-center pb-40"><h2 class="text-center fw-bold">Instagram</h2></div>'
         '<div class="d-flex flex-wrap justify-content-center gap-3 pt-2"><?php foreach ($__insta as $__src): ?>'
         '<div style="flex:1 1 300px;max-width:340px;border:1px solid #c9ecec;border-radius:15px;overflow:hidden;background:#fff;">'
         '<iframe src="<?= htmlspecialchars($__src) ?>" width="100%" height="440" frameborder="0" scrolling="no" allowtransparency="true" loading="lazy" style="display:block;"></iframe>'
         '</div><?php endforeach; ?></div></div><?php endif; ?>')
m = re.search(r'<div class="[^"]*qr-code-section', h)
assert m, 'qr section not found'
h = h[:m.start()] + EMBED + INSTA + h[m.start():]
print('  ok: embedded + instagram')

open(F, 'w', encoding='utf-8').write(h)
print('STAGE2 done', orig, '->', len(h))
