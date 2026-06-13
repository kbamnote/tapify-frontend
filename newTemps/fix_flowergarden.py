import io, re, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard69.php'
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


h = h.replace('<!DOCTYPE html>', '<!DOCTYPE html><!-- tapify-flowergardenpro build v1 -->', 1)
# cover overlay
rep('<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5));"></div>', '', 'cover overlay')
# fonts: Montserrat + Carattere
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Carattere&display=swap" rel="stylesheet">')
rep('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">' + FONTS, 'fonts')
# native date (match by id; attribute order varies)
resub(r'<input[^>]*id=pickUpDate[^>]*>',
      '<input type="date" name="date" class="date appoint-input appointment-input form-control p-0 fw-5 fs-14 lh-sm text-black bg-transparent border-0 rounded-0" placeholder="Pick a Date" id="pickUpDate" min="<?= date(\'Y-m-d\') ?>" style="cursor:pointer;">', 'native date')
# slick block -> vanilla slider + css-anim gallery
s = h.find('<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>')
e = h.find('tfInit();</script>'); e = h.find('</script>', e) + len('</script>')
assert s > 0 and e > s, 'slick block'
h = h[:s] + B['slider'] + B['gallery'] + h[e:]
print('  ok: slick -> vanilla')
# appointment JS
rep('<?php include __DIR__ . "/_shared-scripts.php"; ?>', B['appt'] + '<?php include __DIR__ . "/_shared-scripts.php"; ?>', 'appt JS')

# SOCIAL wiring: social-section inner .d-flex -> $socialLinks loop (social-box + SVG)
m = re.search(r'<div class="social-section[^"]*">\s*<div class="d-flex gap-16[^"]*">', h)
assert m, 'social section'
inner_start = m.end()
end = bspan(h, m.start())  # whole social-section end
# find the inner d-flex end
flex_open = h.rfind('<div class="d-flex gap-16', 0, inner_start)
flex_end = bspan(h, flex_open)
soc_loop = ('<?php foreach ($socialLinks as $s): $__sp=strtolower($s["platform"] ?? ""); ?>'
            '<a href="<?= htmlspecialchars($s["url"]) ?>" target="_blank" rel="noopener" class="text-decoration-none d-flex justify-content-center align-items-center social-box">'
            '<?php if(in_array($__sp,["facebook","facebook-f"])): ?>' + FB +
            '<?php elseif($__sp==="instagram"): ?>' + IG +
            '<?php elseif($__sp==="youtube"): ?>' + YT +
            '<?php elseif(in_array($__sp,["linkedin","linkedin-in"])): ?>' + LI +
            '<?php elseif(in_array($__sp,["x-twitter","twitter","x"])): ?>' + X +
            '<?php else: ?>' + GLOBE + '<?php endif; ?></a><?php endforeach; ?>')
h = h[:inner_start] + soc_loop + h[flex_end - len('</div>'):]  # replace inner content, keep closing </div>
# wrap social-section in if(!empty($socialLinks))
m2 = re.search(r'<div class="social-section[^"]*">', h)
end2 = bspan(h, m2.start())
h = h[:m2.start()] + '<?php if(!empty($socialLinks)): ?>' + h[m2.start():end2] + '<?php endif; ?>' + h[end2:]
print('  ok: social wired')

# SERVICE grid wiring: replace .services-grid-view inner with $services loop
m = re.search(r'<div class="row services-grid-view[^"]*">', h)
assert m, 'services grid'
end = bspan(h, m.start())
svc_loop = (h[m.start():m.end()] +
            '<?php foreach ($services as $sv): $svimg=!empty($sv["image"])?imgUrl($sv["image"]):"/images/templates/flowergardenpro/flo-046.webp"; ?>'
            '<div class="col-sm-6"><div class="service-box bg-white w-100 mx-auto h-100 d-flex flex-column">'
            '<div class="service-img h-100 w-100 mb-10px"><a href="javascript:void(0)" class="pe-none"><img src="<?= htmlspecialchars($svimg) ?>" alt="" class="h-100 w-100 object-fit-cover"></a></div>'
            '<div class="service-content flex-grow-1"><h6 class="card-title fw-bold text-black text-center"><?= htmlspecialchars($sv["name"] ?? "") ?></h6>'
            '<?php if(!empty($sv["description"])): ?><p class="mb-0 text-gray description-text text-center"><?= htmlspecialchars($sv["description"]) ?></p><?php endif; ?>'
            '</div></div></div><?php endforeach; ?></div>')
h = h[:m.start()] + svc_loop + h[end:]
# wrap whole service-section in if(!empty($services))
m2 = re.search(r'<div class="service-section[^"]*">', h)
end2 = bspan(h, m2.start())
h = h[:m2.start()] + '<?php if(!empty($services)): ?>' + h[m2.start():end2] + '<?php endif; ?>' + h[end2:]
print('  ok: service wired')

# TESTIMONIAL wiring: replace testimonial-slider content with $testimonials loop
m = re.search(r'<div class="testimonial-slider[^"]*">', h)
assert m, 'testimonial slider'
end = bspan(h, m.start())
tes_loop = ('<div class="testimonial-slider">'
            '<?php foreach ($testimonials as $t): ?>'
            '<div class="px-2"><div class="testimonial-box position-relative">'
            '<div class="quote-img top-img"><i class="fas fa-quote-left" style="color:#2a9f2e;font-size:24px;"></i></div>'
            '<div><p class="text-gray fw-medium lh-base mb-3 text-center testiimonial-desc">"<?= htmlspecialchars($t["message"] ?? "") ?>"</p>'
            '<div class="d-flex justify-content-center align-items-center gap-3">'
            '<?php if(!empty($t["image"])): ?><div class="testimonial-box-img d-flex justify-content-center align-items-center" style="width:55px;height:55px;border-radius:50%;overflow:hidden;"><img src="<?= htmlspecialchars(imgUrl($t["image"])) ?>" class="h-100 w-100 object-fit-cover"></div><?php endif; ?>'
            '<h6 class="fw-bold text-black mb-0"><?= htmlspecialchars($t["name"] ?? ($t["author_name"] ?? "")) ?></h6>'
            '</div></div></div></div>'
            '<?php endforeach; ?></div>')
h = h[:m.start()] + tes_loop + h[end:]
m2 = re.search(r'<div class="testimonial-section[^"]*">', h)
end2 = bspan(h, m2.start())
h = h[:m2.start()] + '<?php if(!empty($testimonials)): ?>' + h[m2.start():end2] + '<?php endif; ?>' + h[end2:]
print('  ok: testimonial wired')

# NAME + badge + animateNames skip
resub(r'<\?= htmlspecialchars\(\$fullName\) \?>\s*<i class="verification-icon bi-patch-check-fill"></i>',
      '<?= htmlspecialchars($fullName) ?> ' + B['badge'], 'name badge')
# add data-tf-animated to the <p> holding the name
resub(r'(<p class="[^"]*")(>\s*<\?= htmlspecialchars\(\$fullName\) \?>)',
      r'\1 data-tf-animated="1"\2', 'animateNames skip', flags=0)

# section guards: product, gallery
m = re.search(r'<div class="[^"]*product-section[^"]*"', h)
end = bspan(h, m.start())
h = h[:m.start()] + '<?php if(!empty(isset($__pr)?$__pr:($products ?? []))): ?>' + h[m.start():end] + '<?php endif; ?>' + h[end:]
print('  ok: guard product')
m = re.search(r'<div class="[^"]*gallery-section[^"]*"', h)
end = bspan(h, m.start())
h = h[:m.start()] + '<?php $__gc=0; foreach((isset($__ga)?$__ga:($galleries ?? [])) as $__g){$__gc+=count($__g["images"] ?? []);} if($__gc>0): ?>' + h[m.start():end] + '<?php endif; ?>' + h[end:]
print('  ok: guard gallery')

open(F, 'w', encoding='utf-8').write(h)
print('WROTE', orig, '->', len(h))
