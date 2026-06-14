import io, re, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard70.php'
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


h = h.replace('<!DOCTYPE html>', '<!DOCTYPE html><!-- tapify-foodculinarypro build v1 -->', 1)

# 1) cover dark overlay
rep('<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5));"></div>', '', 'cover overlay')

# 2) fonts: Poppins + Abhaya Libre (+ Times New Roman is system serif)
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Abhaya+Libre:wght@400;500;600;700;800&display=swap" rel="stylesheet">')
rep('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">' + FONTS, 'fonts')
# map AbhayaLibre family name (no space, from singlefile) -> Google "Abhaya Libre"
h = h.replace('font-family:AbhayaLibre', "font-family:'Abhaya Libre',serif")
print('  ok: AbhayaLibre family mapped', h.count("'Abhaya Libre'"))

# 3) native date input
resub(r'<input[^>]*id=pickUpDate[^>]*>',
      '<input type="date" name="date" class="date appoint-input form-control appointment-input text-start fw-5 fs-14 lh-sm bg-transparent" placeholder="Pick a Date" id="pickUpDate" min="<?= date(\'Y-m-d\') ?>" style="cursor:pointer;">', 'native date')

# 4) remove orphan iframe tag before jquery
rep('"></iframe<script src="https://code.jquery.com', '<script src="https://code.jquery.com', 'orphan iframe')

# 5) slick block -> vanilla slider + css-anim gallery
s = h.find('<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>')
e = h.find('tfInit();'); e = h.find('</script>', e) + len('</script>')
assert s > 0 and e > s, 'slick block'
h = h[:s] + B['slider'] + B['gallery'] + h[e:]
print('  ok: slick -> vanilla')

# 6) appointment JS
rep('<?php include __DIR__ . "/_shared-scripts.php"; ?>', B['appt'] + '<?php include __DIR__ . "/_shared-scripts.php"; ?>', 'appt JS')

# 7) SOCIAL wiring: replace the 6 static social-icon divs with a dynamic loop
m = re.search(r'<div class="social-media[^"]*">', h)
assert m, 'social-media wrapper'
wrap_start = m.start()
wrap_end = bspan(h, wrap_start)
first_icon = h.find('<div class="social-icon', m.end())
assert 0 < first_icon < wrap_end, 'first social-icon'
soc_loop = ('<?php foreach ($socialLinks as $s): $__sp=strtolower($s["platform"] ?? ""); ?>'
            '<div class="social-icon d-flex justify-content-center align-items-center">'
            '<a href="<?= htmlspecialchars($s["url"]) ?>" target="_blank" rel="noopener">'
            '<?php if(in_array($__sp,["facebook","facebook-f"])): ?>' + FB +
            '<?php elseif($__sp==="instagram"): ?>' + IG +
            '<?php elseif($__sp==="youtube"): ?>' + YT +
            '<?php elseif(in_array($__sp,["linkedin","linkedin-in"])): ?>' + LI +
            '<?php elseif(in_array($__sp,["x-twitter","twitter","x"])): ?>' + X +
            '<?php else: ?>' + GLOBE + '<?php endif; ?></a></div><?php endforeach; ?>')
# keep everything before first icon (wrapper + vector div), drop icons up to wrapper close, keep closing </div>
h = h[:first_icon] + soc_loop + h[wrap_end - len('</div>'):]
# guard whole social-media wrapper
m2 = re.search(r'<div class="social-media[^"]*">', h)
end2 = bspan(h, m2.start())
h = h[:m2.start()] + '<?php if(!empty($socialLinks)): ?>' + h[m2.start():end2] + '<?php endif; ?>' + h[end2:]
print('  ok: social wired')

# 8) animateNames skip on name h2
resub(r'<h2 class="text-white fs-24 mb-0">',
      '<h2 class="text-white fs-24 mb-0" data-tf-animated="1">', 'animateNames skip')

open(F, 'w', encoding='utf-8').write(h)
print('WROTE', orig, '->', len(h))
