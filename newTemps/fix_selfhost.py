import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard66.php'
h = open(F, encoding='utf-8').read()
orig = len(h)
V = '/images/templates/vendor/'

# 1) self-host jQuery + slick (jQuery from code.jquery.com was failing on live)
repl = {
    'https://code.jquery.com/jquery-3.6.0.min.js': V + 'jquery-3.6.0.min.js',
    'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js': V + 'slick.min.js',
    'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css': V + 'slick.css',
    'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css': V + 'slick-theme.css',
}
for a, b in repl.items():
    assert a in h, 'missing ' + a
    h = h.replace(a, b, 1)
print('1 self-host jquery+slick: ok')

# 2) drop unused flatpickr CDN includes (calendar is now a native date input)
for s in ['<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">',
          '<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>']:
    if s in h:
        h = h.replace(s, '', 1)
print('2 flatpickr cdn removed: ok')

# 3) name size: 38 -> 44 with !important (defeat any stale override)
old = 'style="font-size:38px;font-weight:700;line-height:1.2;"'
new = 'style="font-size:44px!important;font-weight:700!important;line-height:1.2;"'
assert old in h, 'name style not found'
h = h.replace(old, new, 1)
print('3 name 44px !important: ok')

open(F, 'w', encoding='utf-8').write(h)
print('WROTE', orig, '->', len(h))
