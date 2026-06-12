# Comprehensive post-pass for vcard67 (Hospital Pro): applies every vcard66 fix.
import io, re, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard67.php'
B = json.load(open('D:/Print World/tapify/tapify-frontend/newTemps/_v66_blocks.json', encoding='utf-8'))
h = open(F, encoding='utf-8').read()
orig = len(h)


def rep(old, new, label, required=True):
    global h
    if old in h:
        h = h.replace(old, new, 1); print('  ok:', label)
    elif required:
        raise AssertionError('NOT FOUND: ' + label)
    else:
        print('  skip:', label)


# ---- version marker ----
h = h.replace('<!DOCTYPE html>', '<!DOCTYPE html><!-- tapify-hospitalpro build v1 -->', 1)

# ---- A) cover dark overlay removal ----
rep('<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5));"></div>', '', 'cover overlay')

# ---- B) orphan iframe ----
rep('<div class=excompt-container style=display:none></div>"></iframe', '<div class=excompt-container style=display:none></div>', 'orphan iframe')

# ---- C) Figtree font (CSS uses "figtree"; Google "Figtree" matches case-insensitively) ----
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap" rel="stylesheet">')
rep('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">' + FONTS, 'figtree font link')

# ---- D) native date input (was flatpickr text) ----
rep('<input class="date appointment-input flatpickr-input" placeholder="Pick a Date" id=pickUpDate name=date type=text readonly value>',
    '<input class="date appointment-input" placeholder="Pick a Date" id="pickUpDate" name="date" type="date" min="<?= date(\'Y-m-d\') ?>" style="cursor:pointer;">',
    'native date input')

# ---- E) slick block (jQuery+slick+flatpickr+tfInit) -> vanilla slider + css-anim gallery + appointment JS ----
s = h.find('<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>')
e = h.find('tfInit();</script>'); e = h.find('</script>', e) + len('</script>')
assert s > 0 and e > s, 'slick block not found'
h = h[:s] + B['slider'] + B['gallery'] + h[e:]
print('  ok: slick block -> vanilla slider + css-anim gallery')

# ---- F) profile name: skip animateNames + teal badge + drop static lines ----
new_pn = ('<div class="profile-desc-margin profile-name" data-tf-animated="1">'
          '<h2 class="text-black mb-1 fw-bold fs-28 d-flex align-items-center justify-content-center justify-content-sm-start gap-2">'
          '<?= htmlspecialchars($fullName) ?> ' + B['badge'] + '</h2>'
          '<p class="fw-5 position-relative company-name mb-0"><?= htmlspecialchars($vcard["occupation"] ?? "") ?></p></div>')
pn_re = re.compile(r'<div class="profile-desc-margin profile-name">\s*<h2[^>]*>\s*<\?= htmlspecialchars\(\$fullName\) \?>[\s\S]*?</h2>\s*'
                   r'<p class="fw-5 position-relative company-name mb-0">[\s\S]*?</p>\s*'
                   r'<p[^>]*>Neurosurgeon</p>\s*<p[^>]*></p>\s*</div>')
m = pn_re.search(h)
assert m, 'profile-name regex not matched'
h = h[:m.start()] + new_pn + h[m.end():]
print('  ok: profile name + badge')

# ---- G) appointment JS (native date -> slots -> booking dialog) ----
# insert before shared-scripts include
rep('<?php include __DIR__ . "/_shared-scripts.php"; ?>', B['appt'] + '<?php include __DIR__ . "/_shared-scripts.php"; ?>', 'appointment JS')

open(F, 'w', encoding='utf-8').write(h)
print('STAGE1 done', orig, '->', len(h))
