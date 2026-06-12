# Second post-pass for vcard66 (Travel Agency): restore source-faithful
# fonts, profile logo, social SVG icons, business-hours design, gallery slides.
import io, re, sys, json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard66.php'
EX = json.load(open('D:/Print World/tapify/tapify-frontend/newTemps/_ta_extract.json', encoding='utf-8'))
h = open(F, encoding='utf-8').read()
orig = len(h)
S = EX['social_icons']            # keys: tapkya(globe), x, facebook, instagram, youtube, linkedin
BH_ICON = EX['bh_icon']
GLOBE, X, FB, IG, YT, LI = S['tapkya'], S['x'], S['facebook'], S['instagram'], S['youtube'], S['linkedin']

# ---------- 1) FONTS: load Poppins + New Rocker (were base64 @font-face, stripped) ----------
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=New+Rocker&display=swap" rel="stylesheet">')
anchor = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">'
assert anchor in h, 'bootstrap anchor missing'
h = h.replace(anchor, anchor + FONTS, 1)
print('fonts: ok')

# ---------- 2) LOGO: profile avatar -> $profileImg (was static tra-049.webp) ----------
before = h
h = h.replace('<img src="/images/templates/travelagency/tra-049.webp" class=object-fit-cover>',
              '<img src="<?= htmlspecialchars($profileImg) ?>" class=object-fit-cover alt="<?= htmlspecialchars($fullName) ?>">', 1)
print('logo:', 'ok' if h != before else 'NOT FOUND')

# ---------- 3) SOCIAL ICONS: dynamic, using the template's own inline SVGs ----------
old_social = ('<div class="d-flex flex-wrap justify-content-center gap-2 gap-sm-3">'
              '<?php foreach ($socialLinks as $s): $ic=$platformIcons[$s["platform"]] ?? "fa-globe"; ?>'
              '<span class="social-icon d-flex justify-content-center align-items-center">'
              '<a href="<?= htmlspecialchars($s["url"]) ?>" target="_blank" rel="noopener">'
              '<i class="fab <?= $ic ?>"></i></a></span>'
              '<?php endforeach; ?></div>')
new_social = ('<div class="d-flex flex-wrap justify-content-center gap-2 gap-sm-3">'
              '<?php foreach ($socialLinks as $s): $__sp=strtolower($s["platform"] ?? ""); ?>'
              '<span class="social-icon d-flex justify-content-center align-items-center">'
              '<a href="<?= htmlspecialchars($s["url"]) ?>" target="_blank" rel="noopener">'
              '<?php if(in_array($__sp,["facebook","facebook-f"])): ?>' + FB +
              '<?php elseif($__sp==="instagram"): ?>' + IG +
              '<?php elseif($__sp==="youtube"): ?>' + YT +
              '<?php elseif(in_array($__sp,["linkedin","linkedin-in"])): ?>' + LI +
              '<?php elseif(in_array($__sp,["x-twitter","twitter","x"])): ?>' + X +
              '<?php else: ?>' + GLOBE +
              '<?php endif; ?></a></span><?php endforeach; ?></div>')
assert old_social in h, 'social block (post-pass1) not found'
h = h.replace(old_social, new_social, 1)
print('social: ok')

# ---------- 4) BUSINESS HOURS: original two-column design (icon + day/time stacked) ----------
m = re.search(r'<\?php if\(!empty\(\$businessHours\)\): \?><div class="business-hour-section[\s\S]*?<\?php endif; \?>', h)
assert m, 'business hours block not found'
new_bh = ('<?php if(!empty($businessHours)): ?>'
          '<div class="business-hour-section pt-50 px-30 position-relative">'
          '<div class="section-heading"><h2 class="right-bg">Business Hours</h2></div>'
          '<div class="business-hour-card row row-gap-20px justify-content-center position-relative">'
          '<?php foreach ($businessHours as $bh): ?>'
          '<div class="col-sm-6"><div class="business-hour align-items-center">'
          '<div class="time-icons d-flex align-items-center justify-content-center">' + BH_ICON + '</div>'
          '<div class="justify-content-center align-items-center flex-column d-flex">'
          '<span class="text-gray-300"><?= htmlspecialchars(ucfirst(strtolower($bh["day_name"] ?? ""))) ?>:</span>'
          '<span><?= !empty($bh["is_open"]) ? htmlspecialchars(trim(($bh["open_time"] ?? "")." - ".($bh["close_time"] ?? ""))) : "Closed" ?></span>'
          '</div></div></div>'
          '<?php endforeach; ?></div></div><?php endif; ?>')
h = h[:m.start()] + new_bh + h[m.end():]
print('business hours: ok')

# ---------- 5) GALLERY: faithful slide markup (img + expand icon + lightbox) for slick ----------
EXPAND = ('<div class="expand-icon pe-none"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" '
          'viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
          '<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline>'
          '<line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg></div>')
old_gal = ('<div class="gallery-slider"><?php foreach ((isset($__ga)?$__ga:($galleries ?? [])) as $g): '
           'foreach (($g["images"] ?? []) as $im): $gi=imgUrl($im["image_url"] ?? ($im["image"] ?? "")); ?>'
           '<div class="px-2"><div class="gallery-img-wrapper"><div class="gallery-img" '
           'style="background-image:url(\'<?= htmlspecialchars($gi) ?>\');background-size:cover;'
           'background-position:center;height:280px;border-radius:12px;"></div></div></div>'
           '<?php endforeach; endforeach; ?></div>')
new_gal = ('<div class="gallery-slider"><?php foreach ((isset($__ga)?$__ga:($galleries ?? [])) as $g): '
           'foreach (($g["images"] ?? []) as $im): $gi=imgUrl($im["image_url"] ?? ($im["image"] ?? "")); ?>'
           '<div><div class="gallery-img">' + EXPAND +
           '<a href="<?= htmlspecialchars($gi) ?>" data-lightbox="gallery-images">'
           '<img src="<?= htmlspecialchars($gi) ?>" alt="gallery" class="w-100 h-100 object-fit-cover" loading="lazy"></a>'
           '</div></div>'
           '<?php endforeach; endforeach; ?></div>')
assert old_gal in h, 'gallery block not found'
h = h.replace(old_gal, new_gal, 1)
print('gallery: ok')

# ---------- 6) small CSS: keep social <svg> sized white (already in source CSS) + drop my old <i> rule's harmlessly ----------
open(F, 'w', encoding='utf-8').write(h)
print('WROTE', F, orig, '->', len(h))
