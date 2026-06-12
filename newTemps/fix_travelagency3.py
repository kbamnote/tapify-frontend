# Third post-pass for vcard66 (Travel Agency) — user-requested refinements.
import io, re, sys, json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard66.php'
h = open(F, encoding='utf-8').read()
orig = len(h)
assert '$__sv=$services' not in h, 'unexpected suppress block'


def bspan(s, start):
    depth = 0
    for t in re.finditer(r'<div\b|</div>', s[start:]):
        depth += 1 if t.group(0) == '<div' else -1
        if depth == 0:
            return start + t.end()
    return -1


def wrap_section(html, cls, cond):
    m = re.search(r'<div class="' + cls, html)
    assert m, cls + ' not found'
    end = bspan(html, m.start())
    return html[:m.start()] + '<?php if(' + cond + '): ?>' + html[m.start():end] + '<?php endif; ?>' + html[end:]


VERIFIED = ('<svg viewBox="0 0 22 22" width="26" height="26" aria-label="Verified" style="flex:0 0 auto;vertical-align:middle;">'
            '<path fill="#40b5c5" d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.878 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.273 1.084-.704 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/></svg>')

# ---- A) profile: drop occupation + tagline lines, enlarge name, add verified tick ----
new_pn = ('<div class="profile-name mb-0"><h2 class="text-secondary mb-0 fw-5 d-flex align-items-center '
          'justify-content-center justify-content-sm-start gap-2" style="font-size:30px;line-height:1.2;">'
          '<?= htmlspecialchars($fullName) ?> ' + VERIFIED + '</h2></div>')
old_pn_re = re.compile(r'<div class="profile-name mb-0">\s*<h2[^>]*>\s*<\?= htmlspecialchars\(\$fullName\) \?>[\s\S]*?</h2>\s*'
                       r'<p[^>]*><\?= htmlspecialchars\(\$vcard\["occupation"\] \?\? ""\) \?></p>\s*'
                       r'<p[^>]*>Every Journey Begins[\s\S]*?</p>\s*<p[^>]*></p>\s*</div>')
m = old_pn_re.search(h)
assert m, 'profile-name block not matched (regex)'
h = h[:m.start()] + new_pn + h[m.end():]
print('A profile: ok')

# ---- B) heading font: alias the CSS name "NewRocker" to Google "New Rocker" ----
fonts_link = ('<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=New+Rocker&display=swap" rel="stylesheet">')
assert fonts_link in h
h = h.replace(fonts_link, fonts_link + "<style>.section-heading h2{font-family:'New Rocker','NewRocker',cursive!important;}</style>", 1)
print('B heading font alias: ok')

# ---- C) services heading: restore the left-bg underline decoration ----
before = h
h = h.replace('<div class="section-heading"><h2>Our Services</h2></div>',
              '<div class="section-heading"><h2 class="left-bg">Our Services</h2></div>', 1)
print('C services heading:', 'ok' if h != before else 'NOT FOUND')

# ---- D) contact: guard email/alt-email/phone; wire+guard alt-phone (was static demo) ----
def guard_box(html, inner_unique, cond):
    """Wrap the col-sm-6 contact box that contains inner_unique in a PHP if(cond)."""
    i = html.find(inner_unique)
    assert i >= 0, 'box not found: ' + inner_unique[:40]
    col = html.rfind('<div class=col-sm-6>', 0, i)
    end = bspan(html, col)
    return html[:col] + '<?php if(' + cond + '): ?>' + html[col:end] + '<?php endif; ?>' + html[end:]


# alt phone: replace static demo first, then guard
h = h.replace('<a href=tel:+919800508990>+919800508990</a>',
              '<a href="tel:<?= htmlspecialchars($vcard["alternate_phone"] ?? "") ?>"><?= htmlspecialchars($vcard["alternate_phone"] ?? "") ?></a>', 1)
h = guard_box(h, 'mailto:<?= htmlspecialchars($vcard["email"] ?? "") ?>', '!empty($vcard["email"])')
h = guard_box(h, 'mailto:<?= htmlspecialchars($vcard["alternate_email"] ?? "") ?>', '!empty($vcard["alternate_email"])')
h = guard_box(h, 'tel:<?= htmlspecialchars($vcard["phone"] ?? "") ?>', '!empty($vcard["phone"])')
h = guard_box(h, 'tel:<?= htmlspecialchars($vcard["alternate_phone"] ?? "") ?>', '!empty($vcard["alternate_phone"])')
print('D contact guards: ok')

# ---- E) testimonial: faithful card (proper size: testimonial-card + desc + profile-img) ----
m = re.search(r'<div class="testimonial-slider"><\?php foreach[\s\S]*?<\?php endforeach; \?></div>', h)
assert m, 'testimonial slider not found'
new_tes = ('<div class="testimonial-slider">'
           '<?php foreach ((isset($__te)?$__te:($testimonials ?? [])) as $t): ?>'
           '<div class="px-2"><div class="testimonial-card position-relative">'
           '<div class="quto-left"><i class="fas fa-quote-left" style="color:#fff;font-size:20px;"></i></div>'
           '<div class="card-body text-center">'
           '<p class="desc text-gray mb-0"><?= htmlspecialchars($t["message"] ?? "") ?></p></div>'
           '<div class="d-flex flex-column align-items-center justify-content-center gap-2 mt-2">'
           '<?php if(!empty($t["image"])): ?><div class="testimonial-profile-img">'
           '<img src="<?= htmlspecialchars(imgUrl($t["image"])) ?>" class="w-100 h-100 object-fit-cover" alt=""></div><?php endif; ?>'
           '<h3 class="fw-6 mb-0"><?= htmlspecialchars($t["name"] ?? ($t["author_name"] ?? ($t["author"] ?? ""))) ?></h3>'
           '<?php if(!empty($t["designation"]) || !empty($t["company"])): ?>'
           '<span class="fs-14 text-gray-300"><?= htmlspecialchars(trim(($t["designation"] ?? "")." ".($t["company"] ?? ""))) ?></span>'
           '<?php endif; ?></div>'
           '<div class="quto-right"><i class="fas fa-quote-right" style="color:#fff;font-size:20px;"></i></div>'
           '</div></div>'
           '<?php endforeach; ?></div>')
h = h[:m.start()] + new_tes + h[m.end():]
print('E testimonial card: ok')

# ---- F) Instagram section (backend insta_feed) injected before QR section ----
INSTA = ('<?php $__insta=[]; foreach (($insta_feed ?? []) as $__if) {'
         'if(!empty($__if["embed_url"]) && preg_match("#^https?://#i",$__if["embed_url"])){$__insta[]=$__if["embed_url"];}'
         'elseif(!empty($__if["tag"]) && preg_match("#https?://(?:www\\.)?instagram\\.com/(p|reel|tv)/([A-Za-z0-9_-]+)#",$__if["tag"],$__m)){$__insta[]="https://www.instagram.com/".$__m[1]."/".$__m[2]."/embed/";}'
         '} if(!empty($__insta)): ?>'
         '<div class="instagram-feed-section pt-50 px-30 position-relative">'
         '<div class="section-heading"><h2 class="right-bg">Instagram</h2></div>'
         '<div class="d-flex flex-wrap justify-content-center gap-3 pt-2">'
         '<?php foreach ($__insta as $__src): ?>'
         '<div style="flex:1 1 300px;max-width:340px;border:2px solid #40b5c5;border-radius:0 20px 0 20px;overflow:hidden;background:#fff;">'
         '<iframe src="<?= htmlspecialchars($__src) ?>" width="100%" height="440" frameborder="0" scrolling="no" allowtransparency="true" loading="lazy" style="display:block;"></iframe>'
         '</div><?php endforeach; ?></div></div><?php endif; ?>')
m = re.search(r'<div class="qr-code-section', h)
assert m, 'qr section not found for insta placement'
h = h[:m.start()] + INSTA + h[m.start():]
print('F instagram: ok')

# ---- G) hide empty sections (heading included) server-side ----
h = wrap_section(h, 'product-section', '!empty(isset($__pr)?$__pr:($products ?? []))')
h = wrap_section(h, 'testimonial-section', '!empty(isset($__te)?$__te:($testimonials ?? []))')
# gallery: only when at least one image exists
gal_cond = '(function(){return false;})'  # placeholder not used; PHP below
m = re.search(r'<div class="gallery-section', h)
end = bspan(h, m.start())
gguard_open = ('<?php $__gc=0; foreach((isset($__ga)?$__ga:($galleries ?? [])) as $__g){$__gc+=count($__g["images"] ?? []);} if($__gc>0): ?>')
h = h[:m.start()] + gguard_open + h[m.start():end] + '<?php endif; ?>' + h[end:]
print('G section guards: ok')

open(F, 'w', encoding='utf-8').write(h)
print('WROTE', orig, '->', len(h))
