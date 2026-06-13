import io, re, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard68.php'
B = json.load(open('D:/Print World/tapify/tapify-frontend/newTemps/_v66_blocks.json', encoding='utf-8'))
S = json.load(open('D:/Print World/tapify/tapify-frontend/newTemps/_ta_extract.json', encoding='utf-8'))['social_icons']
h = open(F, encoding='utf-8').read()
orig = len(h)
GLOBE, X, FB, IG, YT, LI = S['tapkya'], S['x'], S['facebook'], S['instagram'], S['youtube'], S['linkedin']


def bspan(s, start):
    d = 0
    for t in re.finditer(r'<div\b|</div>', s[start:]):
        d += 1 if t.group(0) == '<div' else -1
        if d == 0:
            return start + t.end()
    return -1


def rep(old, new, label):
    global h
    assert old in h, 'NOT FOUND: ' + label
    h = h.replace(old, new, 1); print('  ok:', label)


def resub(pat, new, label, flags=0):
    global h
    h2, n = re.subn(pat, lambda m: new, h, count=1, flags=flags)
    assert n == 1, 'NOT FOUND(re): ' + label
    h = h2; print('  ok:', label)


h = h.replace('<!DOCTYPE html>', '<!DOCTYPE html><!-- tapify-realestatepro build v1 -->', 1)
# A) cover overlay
rep('<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5));"></div>', '', 'cover overlay')
# B) orphan iframe (dangling "></iframe before the script block)
resub(r'"></iframe(?=<script)', '', 'orphan iframe')
# C) fonts: Poppins + Outfit
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">')
rep('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">' + FONTS, 'fonts Poppins+Outfit')
# D) native date (regex; class set varies)
resub(r'<input class="[^"]*flatpickr-input[^"]*" placeholder="Pick a Date" id=pickUpDate name=date type=text readonly value>',
      '<input class="date appoint-input form-control appointment-input text-start" placeholder="Pick a Date" id="pickUpDate" name="date" type="date" min="<?= date(\'Y-m-d\') ?>" style="cursor:pointer;">', 'native date')
# E) slick block -> vanilla slider + css-anim gallery
s = h.find('<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>')
e = h.find('tfInit();</script>'); e = h.find('</script>', e) + len('</script>')
assert s > 0 and e > s, 'slick block'
h = h[:s] + B['slider'] + B['gallery'] + h[e:]
print('  ok: slick -> vanilla slider+gallery')
# F) appointment JS
rep('<?php include __DIR__ . "/_shared-scripts.php"; ?>', B['appt'] + '<?php include __DIR__ . "/_shared-scripts.php"; ?>', 'appointment JS')

# G) profile name: add data-tf-animated to nearest container + badge + drop empty p
name_re = re.compile(r'<h2 class="text-dark fs-24 fw-5 mb-0">\s*<\?= htmlspecialchars\(\$fullName\) \?>\s*<i class="verification-icon[^"]*"></i>\s*</h2>\s*'
                     r'<p class="fs-16 text-primary text-decoration-underline mb-1 fw-5"><\?= htmlspecialchars\(\$vcard\["occupation"\] \?\? ""\) \?></p>\s*'
                     r'<p class="fs-14 text-gray-300 mb-0 fw-5"></p>\s*<p class="fs-14 text-gray-300 mb-0 fw-5"></p>')
m = name_re.search(h)
assert m, 'name block'
new_name = ('<h2 class="text-dark fw-5 mb-0 d-flex align-items-center justify-content-center justify-content-sm-start gap-2" style="font-size:30px;">'
            '<?= htmlspecialchars($fullName) ?> ' + B['badge'] + '</h2>'
            '<p class="fs-16 text-primary text-decoration-underline mb-1 fw-5"><?= htmlspecialchars($vcard["occupation"] ?? "") ?></p>')
h = h[:m.start()] + new_name + h[m.end():]
print('  ok: name + badge')
# add data-tf-animated to the enclosing profile card body that contains the name (skip animateNames)
# (find the .card-body or wrapper just before the new h2)
ci = h.find('<h2 class="text-dark fw-5 mb-0 d-flex')
prevdiv = h.rfind('<div', 0, ci)
if 'data-tf-animated' not in h[prevdiv:ci]:
    h = h[:prevdiv] + h[prevdiv:].replace('<div', '<div data-tf-animated="1"', 1)
    print('  ok: animateNames skip on name wrapper')

# H) SOCIAL wiring -> dynamic loop with SVGs (preserve .social-tag > .social-icon)
m = re.search(r'<div class="social-media-section social-media[^"]*">', h)
assert m, 'social section'
end = bspan(h, m.start())
new_social = (h[m.start():m.end()] +
              '<?php foreach ($socialLinks as $s): $__sp=strtolower($s["platform"] ?? ""); ?>'
              '<a href="<?= htmlspecialchars($s["url"]) ?>" target="_blank" rel="noopener" class="text-decoration-none social-tag">'
              '<div class="social-icon d-flex justify-content-center align-items-center">'
              '<?php if(in_array($__sp,["facebook","facebook-f"])): ?>' + FB +
              '<?php elseif($__sp==="instagram"): ?>' + IG +
              '<?php elseif($__sp==="youtube"): ?>' + YT +
              '<?php elseif(in_array($__sp,["linkedin","linkedin-in"])): ?>' + LI +
              '<?php elseif(in_array($__sp,["x-twitter","twitter","x"])): ?>' + X +
              '<?php else: ?>' + GLOBE +
              '<?php endif; ?></div></a><?php endforeach; ?></div>')
h = h[:m.start()] + ('<?php if(!empty($socialLinks)): ?>' + new_social + '<?php endif; ?>') + h[end:]
print('  ok: social wired')

# I) contact: fix static alt-phone/dob/location, guard all 6
rep('<a href=tel:+919800508990 class="text-white fs-14 mb-0">+919800508990</a>',
    '<a href="tel:<?= htmlspecialchars($vcard["alternate_phone"] ?? "") ?>" class="text-white fs-14 mb-0"><?= htmlspecialchars($vcard["alternate_phone"] ?? "") ?></a>', 'alt phone')
resub(r'<p class="text-white fs-14 mb-0">\s*12th June, 1990</p>',
      '<p class="text-white fs-14 mb-0"><?= htmlspecialchars(date("jS F, Y", strtotime($vcard["dob"]))) ?></p>', 'dob')
resub(r'<p class="text-white fs-14 mb-0">\s*India, Pune</p>',
      '<p class="text-white fs-14 mb-0"><?= htmlspecialchars($vcard["location"]) ?></p>', 'location')


def guard(uniq, cond, label):
    global h
    i = h.find(uniq); assert i >= 0, 'guard uniq: ' + label
    col = h.rfind('<div class="col-12 col-sm-6">', 0, i); assert col >= 0, 'guard col: ' + label
    end = bspan(h, col)
    h = h[:col] + '<?php if(' + cond + '): ?>' + h[col:end] + '<?php endif; ?>' + h[end:]
    print('  ok: guard', label)


guard('mailto:<?= htmlspecialchars($vcard["email"] ?? "") ?>', '!empty($vcard["email"])', 'email')
guard('mailto:<?= htmlspecialchars($vcard["alternate_email"] ?? "") ?>', '!empty($vcard["alternate_email"])', 'alt email')
guard('tel:<?= htmlspecialchars($vcard["phone"] ?? "") ?>', '!empty($vcard["phone"])', 'phone')
guard('"tel:<?= htmlspecialchars($vcard["alternate_phone"] ?? "") ?>"', '!empty($vcard["alternate_phone"])', 'alt phone box')
guard('date("jS F, Y", strtotime($vcard["dob"]))', '!empty($vcard["dob"])', 'dob box')
guard('htmlspecialchars($vcard["location"]) ?></p>', '!empty($vcard["location"])', 'location box')

# J) profile description -> $vcard description
m = re.search(r'<div class="[^"]*profile-desc[^"]*">\s*<p>[\s\S]*?</p>\s*</div>', h)
assert m, 'profile desc'
inner = m.group(0)
fixed = re.sub(r'<p>[\s\S]*?</p>',
               '<?php if(!empty($vcard["description"])): ?><?= $vcard["description"] ?><?php else: ?><p>Real estate professional helping clients buy, sell, and invest in property.</p><?php endif; ?>', inner, count=1)
h = h.replace(inner, fixed, 1)
print('  ok: description')

# K) section guards
for cls, cond, lab in [('product-section', '!empty(isset($__pr)?$__pr:($products ?? []))', 'product'),
                       ('testimonial-section', '!empty(isset($__te)?$__te:($testimonials ?? []))', 'testimonial')]:
    m = re.search(r'<div class="[^"]*' + cls + r'[^"]*"', h)
    end = bspan(h, m.start())
    h = h[:m.start()] + '<?php if(' + cond + '): ?>' + h[m.start():end] + '<?php endif; ?>' + h[end:]
    print('  ok: guard', lab)
m = re.search(r'<div class="[^"]*gallery-section[^"]*"', h)
end = bspan(h, m.start())
h = h[:m.start()] + '<?php $__gc=0; foreach((isset($__ga)?$__ga:($galleries ?? [])) as $__g){$__gc+=count($__g["images"] ?? []);} if($__gc>0): ?>' + h[m.start():end] + '<?php endif; ?>' + h[end:]
print('  ok: guard gallery')

# L) Embedded + Instagram before QR
EMBED = ('<?php $__ifr=array_filter($iframes ?? [], function($fr){return !empty($fr["url"]) && preg_match("#^https?://#i",$fr["url"]);});'
         ' if(!empty($__ifr)): ?><div class="embedded-section pt-50 px-30 position-relative">'
         '<div class="section-heading"><h2>Embedded</h2></div><div class="pt-2"><?php foreach ($__ifr as $fr): ?>'
         '<div style="border:1px solid #a98345;border-radius:15px;overflow:hidden;background:#fff;margin-bottom:16px;">'
         '<iframe src="<?= htmlspecialchars(embeddableMapUrl($fr["url"])) ?>" width="100%" height="360" frameborder="0" loading="lazy" allowfullscreen style="display:block;"></iframe>'
         '</div><?php endforeach; ?></div></div><?php endif; ?>')
INSTA = ('<?php $__insta=[]; foreach (($insta_feed ?? []) as $__if) {'
         'if(!empty($__if["embed_url"]) && preg_match("#^https?://#i",$__if["embed_url"])){$__insta[]=$__if["embed_url"];}'
         'elseif(!empty($__if["tag"]) && preg_match("#https?://(?:www\\.)?instagram\\.com/(p|reel|tv)/([A-Za-z0-9_-]+)#",$__if["tag"],$__m)){$__insta[]="https://www.instagram.com/".$__m[1]."/".$__m[2]."/embed/";}'
         '} if(!empty($__insta)): ?><div class="instagram-feed-section pt-50 px-30 position-relative">'
         '<div class="section-heading"><h2>Instagram</h2></div><div class="d-flex flex-wrap justify-content-center gap-3 pt-2"><?php foreach ($__insta as $__src): ?>'
         '<div style="flex:1 1 300px;max-width:340px;border:1px solid #a98345;border-radius:15px;overflow:hidden;background:#fff;">'
         '<iframe src="<?= htmlspecialchars($__src) ?>" width="100%" height="440" frameborder="0" scrolling="no" allowtransparency="true" loading="lazy" style="display:block;"></iframe>'
         '</div><?php endforeach; ?></div></div><?php endif; ?>')
m = re.search(r'<div class="[^"]*qr-code-section', h)
assert m, 'qr section'
h = h[:m.start()] + EMBED + INSTA + h[m.start():]
print('  ok: embedded + instagram')

open(F, 'w', encoding='utf-8').write(h)
print('WROTE', orig, '->', len(h))
