# Build script for CorporateConnect (vcard5) standalone template
# Converts core-connect.html → tapify-backend/templates/vcard5.php
import io, sys, re, os, shutil, hashlib, base64 as b64
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SLUG = 'corporateconnect'
VID = 'vcard5'
PRIMARY = '0f172a'
FONT = 'inter'

SRC_HTML = r'D:/Print World/tapify/tapify-frontend/newTemps/imagesCorporateConnect/core-connect.html'
CLASSIC_DIR = r'D:/Print World/tapify/tapify-frontend/newTemps/imagesCorporateClassic/imagesCorporateClassic'
ASSET_DIR = f'D:/Print World/tapify/tapify-backend/images/templates/{SLUG}'
ASSET_URL = f'/images/templates/{SLUG}'
OUT = f'D:/Print World/tapify/tapify-backend/templates/{VID}.php'

os.makedirs(ASSET_DIR, exist_ok=True)

# ---- Read HTML ----
h = open(SRC_HTML, encoding='utf-8', errors='replace').read()
h = re.sub(r'<!--\s*Page saved with SingleFile.*?-->', '', h, flags=re.DOTALL)
h = re.sub(r'<meta[^>]*Content-Security-Policy[^>]*>', '', h, flags=re.I)

# ---- Copy template UI assets from CorporateClassic ----
ASSET_MAP = {
    # CorporateConnect filename -> CorporateClassic filename
    'alter-email.png': 'alter-image.png',
    'vcard5-alter-phone.png': 'alter-phone.png',
    'aboutcall.png': 'vcard8-phone.png',
    'aboutemail.png': 'vcard8-email.png',
    'aboutlocation.png': 'vcard8-location.png',
    'aboutcake.png': 'vcard8-birthday.png',  # closest icon
    'sticky.png': 'sticky.png',
    '2daeaa8b5f19f0bc209d976c02bd6acb51b00b0a.gif': 'loading.gif',
    # Flags
    'arabic.svg': 'arabic.svg',
    'china.png': 'china.png',
    'english.png': 'english.png',
    'france.png': 'france.png',
    'german.png': 'german.png',
    'india.png': 'india.png',
    'italian.png': 'italian.png',
    'portuguese.png': 'portuguese.png',
    'russian.jpeg': 'russian.jpeg',
    'spain.png': 'spain.png',
    'turkish.png': 'turkish.png',
    'Vietnamese.jpg': 'Vietnamese.jpg',
    'flags.png': 'flags.png',
}

print("Copying template assets...")
for connect_name, classic_name in ASSET_MAP.items():
    src = os.path.join(CLASSIC_DIR, classic_name)
    dst_name = connect_name  # keep original name for URL replacement
    dst = os.path.join(ASSET_DIR, dst_name)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"  Copied {classic_name} -> {dst_name}")
    else:
        print(f"  MISSING: {classic_name}")

# Also copy close.png, next.png, prev.png (for sliders)
for f in ['close.png', 'next.png', 'prev.png', 'loading.gif']:
    src = os.path.join(CLASSIC_DIR, f)
    dst = os.path.join(ASSET_DIR, f)
    if os.path.exists(src) and not os.path.exists(dst):
        shutil.copy2(src, dst)
        print(f"  Copied {f}")

# ---- Handle base64 images (only 1 in this HTML) ----
EXT = {'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/gif': 'gif', 'image/svg+xml': 'svg'}
seen = {}; idx = [50]  # start at 50 to avoid collision with asset_map files

def save_b64(mime, data):
    try:
        raw = b64.b64decode(data + '=' * (-len(data) % 4))
    except:
        return None
    m = hashlib.md5(raw).hexdigest()
    if m in seen:
        return seen[m]
    ext = EXT.get(mime, 'bin')
    fn = f'{SLUG[:3]}-{idx[0]:03d}.{ext}'; idx[0] += 1
    open(os.path.join(ASSET_DIR, fn), 'wb').write(raw)
    seen[m] = ASSET_URL + '/' + fn
    return seen[m]

h = re.sub(r'data:(image/[a-z+]+);base64,([A-Za-z0-9+/=]+)',
           lambda m: save_b64(m.group(1), m.group(2)) or m.group(0), h)
print(f"Base64 images saved: {idx[0] - 50}")

# ---- Replace local UI asset refs with hosted paths ----
for connect_name in ASSET_MAP.keys():
    h = h.replace(f'src="{connect_name}"', f'src="{ASSET_URL}/{connect_name}"')
    h = h.replace(f"src='{connect_name}'", f"src='{ASSET_URL}/{connect_name}'")
    h = h.replace(f'url("{connect_name}")', f'url("{ASSET_URL}/{connect_name}")')
    h = h.replace(f"url('{connect_name}')", f"url('{ASSET_URL}/{connect_name}')")

# Also replace the gif ref
h = h.replace('src="2daeaa8b5f19f0bc209d976c02bd6acb51b00b0a.gif"', f'src="{ASSET_URL}/loading.gif"')

# ---- User-specific images -> use as sample cover / fallback ----
# These are hardcoded user content images - we'll replace them with PHP variables
# Cover image candidates (Frame-* files used in the main banner area)
COVER = ASSET_URL + '/cor-003.png'  # fallback placeholder

# ---- Strip fonts, redundant icon CSS ----
h = re.sub(r'@font-face\s*\{[^}]*\}', '', h)
h = re.sub(r'data:(?:font|application)/[^;]+;base64,[A-Za-z0-9+/=]+', '', h)
h = re.sub(r'\.bi-[a-z0-9-]+::?before\{content:"[^"]*"\}', '', h)
h = re.sub(r'\.fa-[a-z0-9-]+::?before\{content:"[^"]*"\}', '', h)

# ---- Extract head styles and Google Fonts ----
head_styles = '\n'.join(re.findall(r'<style[^>]*>.*?</style>', h, flags=re.DOTALL))
gfonts = '\n'.join(l for l in re.findall(r'<link[^>]+>', h[:h.lower().find('</head>')]) if 'fonts.google' in l or 'gstatic' in l)

# ---- Extract body ----
bs = re.search(r'<body[^>]*>', h, re.I)
body = h[bs.end():h.lower().rfind('</body>') if '</body>' in h.lower() else h.lower().rfind('</html>')]
body = re.sub(r'<script.*?</script>', '', body, flags=re.DOTALL | re.I)
body = re.sub(r'<iframe[\s\S]*?</iframe>', '', body, flags=re.I)
body = re.sub(r'<iframe[^>]*/?>',  '', body, flags=re.I)
body = re.sub(r'<blockquote[^>]*instagram[\s\S]*?</blockquote>', '', body, flags=re.I)
body = re.sub(r'<link[^>]*>', '', body, flags=re.I)
# Remove plasmo/extension artifacts
body = re.sub(r'<plasmo-csui[^>]*>.*?</plasmo-csui>', '', body, flags=re.DOTALL | re.I)

# Wire inquiry form
body = re.sub(r'<form[^>]*id=["\']?enquiryForm["\']?[^>]*>',
              '<form id="enquiryForm" onsubmit="submitInquiry(event)" enctype="multipart/form-data"><input type="hidden" name="vcard_id" value="<?= $vcardId ?>">',
              body, count=1, flags=re.I)

# ---- balanced_replace helper ----
def balanced_replace(s, open_re, new, max_span=40000):
    m = re.search(open_re, s)
    if not m:
        return s, False
    depth = 0
    for t in re.finditer(r'<div\b|</div>', s[m.start():]):
        depth += 1 if t.group(0) == '<div' else -1
        if depth == 0:
            end = m.start() + t.end()
            if end - m.start() > max_span:
                return s, False
            return s[:m.start()] + new + s[end:], True
    return s, False

# ---- Profile name ----
nm = re.search(r'<(h[1-5]|p|span)[^>]*>\s*([^<]{2,60}?)\s*<i class=["\']?verification', body)
name_ok = False
if nm:
    name = nm.group(2)
    after = body[nm.end():nm.end() + 400]
    pm = re.search(r'(<p[^>]*>)\s*([^<]{2,70})\s*(</p>)', after)
    body = body.replace(name, '<?= htmlspecialchars($fullName) ?>')
    name_ok = True
    if pm and pm.group(0) in body:
        body = body.replace(pm.group(0), pm.group(1) + '<?= htmlspecialchars($vcard["occupation"] ?? "") ?>' + pm.group(3), 1)
print('name dynamic:', name_ok)

# ---- Emails / Phones ----
mails = re.findall(r'mailto:([^\s"\'>]+)', body)
for i, key in enumerate(['email', 'alternate_email']):
    if i < len(mails):
        body = body.replace('mailto:' + mails[i], f'mailto:<?= htmlspecialchars($vcard["{key}"] ?? "") ?>', 1)
        body = re.sub(r'>\s*' + re.escape(mails[i]) + r'\s*<', f'><?= htmlspecialchars($vcard["{key}"] ?? "") ?><', body, count=1)

tels = list(dict.fromkeys(re.findall(r'tel:(\+?[0-9][0-9 ]{5,}[0-9])', body)))
for i, key in enumerate(['phone', 'alternate_phone']):
    if i < len(tels):
        body = body.replace('tel:' + tels[i], f'tel:<?= htmlspecialchars($vcard["{key}"] ?? "") ?>', 1)
        body = re.sub(r'>\s*' + re.escape(tels[i]) + r'\s*<', f'><?= htmlspecialchars($vcard["{key}"] ?? "") ?><', body, count=1)

# ---- Avatar ----
body = re.sub(r'(<div class="[^"]*card-img[^"]*"[^>]*>\s*<img )src=("?)[^"\'> ]*\2', r'\1src="<?= $profileImg ?>"', body, count=1)

# ---- Banner/Cover ----
COVER_PHP = ('<?php $cvType=$vcard["cover_type"]??"image";$cvVal=$vcard["cover_image"]??"";'
             '$isVid=($cvType==="video")||preg_match("#youtube\\.com|youtu\\.be|instagram\\.com|\\.mp4#i",$cvVal);'
             'if($isVid&&!empty($cvVal)){'
             'if(preg_match("#(?:youtube\\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\\.be/)([^\\"&?/\\s]{11})#i",$cvVal,$mm)){$yt=$mm[1];'
             'echo "<iframe style=\\"width:100%;height:100%;display:block;border:none;\\" src=\\"https://www.youtube.com/embed/".$yt."?autoplay=1&mute=1&loop=1&playlist=".$yt."&controls=0&showinfo=0&rel=0&playsinline=1\\" allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\\" allowfullscreen></iframe>";}'
             'elseif(stripos($cvVal,"instagram.com")!==false){echo "<iframe style=\\"width:100%;height:100%;display:block;border:none;\\" src=\\"".htmlspecialchars(rtrim($cvVal,"/")."/embed")."\\" allowtransparency=\\"true\\"></iframe>";}'
             'else{echo "<video src=\\"".htmlspecialchars(imgUrl($cvVal))."\\" autoplay loop muted playsinline style=\\"width:100%;height:100%;object-fit:cover;display:block;\\"></video>";}'
             '}else{echo "<img src=\\"".htmlspecialchars($coverImg)."\\" alt=\\"".htmlspecialchars($fullName)."\\" style=\\"width:100%;height:100%;object-fit:cover;display:block;\\">";} ?>')
BANNER = '<div class="banner-img" style="position:relative;overflow:hidden;height:315px;">' + COVER_PHP + '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5));"></div></div>'
SECTION = '<div class="banner-section position-relative w-100">' + BANNER + '</div>'
body, ok = balanced_replace(body, r'<div class=["\']?[^>"\']*banner-section[^>"\']*["\']?[^>]*>', SECTION, max_span=12000)
how = 'section'
if not ok:
    body, ok = balanced_replace(body, r'<div class=["\']?[^>"\']*banner-img[^>"\']*["\']?[^>]*>', BANNER, max_span=8000); how = 'img-div'
if not ok:
    body, n = re.subn(r'<img [^>]*class=["\'][^"\']*banner-img[^"\']*["\'][^>]*>', lambda m: BANNER, body, count=1); ok = bool(n); how = 'img-tag'
if not ok:
    # Look for head-img class (used in vcard5 template) — large div, increase span
    body, ok = balanced_replace(body, r'<div class=["\']?[^>"\']*head-img[^>"\']*["\']?[^>]*>', BANNER, max_span=35000); how = 'head-img'
if not ok:
    body = SECTION + body; ok = True; how = 'injected'
print('banner', ok, how)

# ---- Social links ----
soc = ('<?php foreach ($socialLinks as $s): $ic=$platformIcons[$s["platform"]] ?? "fa-globe"; ?>'
       '<a href="<?= htmlspecialchars($s["url"]) ?>" target="_blank" rel="noopener"><i class="fab <?= $ic ?> icon fa-2x"></i></a>'
       '<?php endforeach; ?>')
body = re.sub(r'(<div class="[^"]*social-icons[^"]*"[^>]*>).*?(</div>)', r'\1' + soc + r'\2', body, count=1, flags=re.DOTALL)

# ---- Sliders ----
PROD = '<div class="product-slider"><?php foreach ((isset($__pr)?$__pr:($products ?? [])) as $p): $pi=!empty($p["image"])?imgUrl($p["image"]):"' + COVER + '"; ?><div class="px-2"><div class="product-card card"><div class="product-img card-img"><img src="<?= htmlspecialchars($pi) ?>" class="w-100 h-100 object-fit-cover" loading="lazy"></div><div class="product-desc card-body d-flex flex-column align-items-center justify-content-between"><div class="product-title"><h3 class="text-dark text-center"><?= htmlspecialchars($p["name"] ?? "") ?></h3></div><?php if(isset($p["price"]) && $p["price"]!==""):  ?><div class="product-amount"><span>₹ <?= htmlspecialchars($p["price"]) ?></span></div><?php endif; ?></div></div></div><?php endforeach; ?></div>'
GAL = '<div class="gallery-slider"><?php foreach ((isset($__ga)?$__ga:($galleries ?? [])) as $g): foreach (($g["images"] ?? []) as $im): $gi=imgUrl($im["image_url"] ?? ($im["image"] ?? "")); ?><div class="px-2"><div class="gallery-img-wrapper"><div class="gallery-img" style="background-image:url(\'<?= htmlspecialchars($gi) ?>\');background-size:cover;background-position:center;height:280px;border-radius:12px;"></div></div></div><?php endforeach; endforeach; ?></div>'
TES = '<div class="testimonial-slider"><?php foreach ((isset($__te)?$__te:($testimonials ?? [])) as $t): ?><div class="px-2"><div class="testimonial-card p-0"><div class="card-body text-center position-relative"><div class="text-center"><p class="text-gray mb-0">"<?= htmlspecialchars($t["message"] ?? "") ?>"</p></div></div><div class="d-flex flex-column align-items-center justify-content-center gap-2 profile-desc"><?php if(!empty($t["image"])): ?><div class="card-img" style="width:60px;height:60px;border-radius:50%;overflow:hidden;"><img src="<?= htmlspecialchars(imgUrl($t["image"])) ?>" class="w-100 h-100 object-fit-cover"></div><?php endif; ?><h5 class="fw-6 mb-0"><?= htmlspecialchars($t["author_name"] ?? ($t["author"] ?? "")) ?></h5></div></div></div><?php endforeach; ?></div>'
for opn, new, lbl in [(r'<div class="[^"]*(?:product-slider|main-product)[^"]*"[^>]*>', PROD, 'prod'),
                      (r'<div class="[^"]*(?:gallery-slider|main-gallery)[^"]*"[^>]*>', GAL, 'gal'),
                      (r'<div class="[^"]*(?:testimonial-slider|main-testimonial)[^"]*"[^>]*>', TES, 'tes')]:
    body, ok = balanced_replace(body, opn, new, max_span=80000); print(lbl, ok)

# ---- Services + Business Hours ----
SVC = ('<div class="our-services-section pt-50 position-relative"><div class="section-heading"><h2>Our Services</h2></div>'
       '<div class="services"><div class="px-30"><div class="row"><?php foreach ((isset($__sv)?$__sv:($services ?? [])) as $sv): $svimg=!empty($sv["image"])?imgUrl($sv["image"]):"' + COVER + '"; ?>'
       '<div class="col-sm-6 mb-sm-0 mb-40 p-3"><div class="card-wrapper h-100"><a href="javascript:void(0)" class="text-decoration-none"><div class="service-card card h-100"><div class="card-img mx-auto"><img src="<?= htmlspecialchars($svimg) ?>" alt="<?= htmlspecialchars($sv[\'name\'] ?? \'\') ?>" class="w-100 h-100 object-fit-cover" loading="lazy"></div><div class="card-body text-center"><h3 class="card-title text-primary"><?= htmlspecialchars($sv["name"] ?? "") ?></h3><?php if(!empty($sv["description"])): ?><p class="mb-0 text-gray"><?= htmlspecialchars($sv["description"]) ?></p><?php endif; ?></div></div></a></div></div>'
       '<?php endforeach; ?></div></div></div></div>')
BH = ('<div class="business-hour-section pt-50 px-30 position-relative"><div class="section-heading"><h2>Business Hours</h2></div>'
      '<div class="px-30"><div class="row justify-content-center"><?php foreach ((isset($__bh)?$__bh:($businessHours ?? [])) as $bh): ?>'
      '<div class="col-sm-6"><div class="business-hour-card d-flex gap-2 align-items-center mb-3"><div class="time-icon"><i class="bi bi-clock fs-3"></i></div><div class="d-flex flex-column align-items-start"><span class="fs-14 text-gray lh-1 fw-5"><?= htmlspecialchars(ucfirst(strtolower($bh["day_name"] ?? ""))) ?></span><span class="fs-16 fw-5"><?= !empty($bh["is_open"]) ? htmlspecialchars(trim(($bh["open_time"] ?? "")." - ".($bh["close_time"] ?? ""))) : "Closed" ?></span></div></div></div>'
      '<?php endforeach; ?></div></div></div>')
SVC = '<?php if(!empty($services)): ?>' + SVC + '<?php endif; ?>'
BH = '<?php if(!empty($businessHours)): ?>' + BH + '<?php endif; ?>'
body, ok = balanced_replace(body, r'<div class=["\']?[^>"\']*(?:our-)?services-section[^>"\']*["\']?[^>]*>', SVC); print('svc', ok)
if not ok:
    body, ok = balanced_replace(body, r'<div class=["\']?[^>"\']*main-our-service[^>"\']*["\']?[^>]*>', SVC, max_span=80000); print('svc2', ok)
body, ok = balanced_replace(body, r'<div class=["\']?[^>"\']*business-hour(?!-card)[^>"\']*["\']?[^>]*>', BH); print('bh', ok)
if not ok:
    body, ok = balanced_replace(body, r'<div class=["\']?[^>"\']*main-business[^>"\']*["\']?[^>]*>', BH, max_span=80000); print('bh2', ok)

# ---- suppress + slick scripts ----
slick = ('<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>'
         '<script src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>'
         '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css">'
         '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css">'
         '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">'
         '<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>'
         '<script>function tfInit(){if(typeof jQuery==="undefined"||!jQuery.fn||!jQuery.fn.slick){return setTimeout(tfInit,120);}jQuery(function($){'
         '$(".product-slider,.gallery-slider,.testimonial-slider").each(function(){'
         'if($(this).children().length===0){$(this).closest("[class*=section]").hide();$(this).hide();}});'
         'function ini(s,o){var $s=$(s);if(!$s.length||$s.hasClass("slick-initialized"))return;$s.slick(o);}'
         'ini(".product-slider",{slidesToShow:2,arrows:false,dots:true,infinite:true,autoplay:true,autoplaySpeed:2500,responsive:[{breakpoint:576,settings:{slidesToShow:1}}]});'
         'ini(".gallery-slider",{slidesToShow:2,arrows:false,dots:true,infinite:true,autoplay:true,autoplaySpeed:2500,responsive:[{breakpoint:576,settings:{slidesToShow:1}}]});'
         'ini(".testimonial-slider",{slidesToShow:1,arrows:false,dots:true,infinite:true,autoplay:true,autoplaySpeed:4000});'
         'if(window.flatpickr){flatpickr("#pickUpDate",{minDate:"today",dateFormat:"Y-m-d"});flatpickr(".flatpickr-input",{minDate:"today",dateFormat:"Y-m-d"});}'
         '});}tfInit();</script>')

CDN = ('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">'
       '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">'
       '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">')

PAGEBG = ''
mbg = re.search(r'body\s*\{[^}]*?background(?:-color)?\s*:\s*(#[0-9a-fA-F]{6,8}|rgba?\([\d.,\s%]+\))[^}]*?!important', head_styles, re.I)
if mbg:
    c = mbg.group(1).strip()
    m8 = re.match(r'#([0-9a-fA-F]{6})[0-9a-fA-F]{2}$', c)
    if m8: c = '#' + m8.group(1)
    mr = re.match(r'rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,[^)]+)?\)', c)
    if mr: c = f'rgb({mr.group(1)},{mr.group(2)},{mr.group(3)})'
    PAGEBG = f'html,body{{background-color:{c}!important;}}'

FIX = ('<style>html,body{overflow-y:auto!important;height:auto!important;min-height:100%!important;position:relative!important;}'
       + PAGEBG +
       '.container{max-width:540px!important;margin-left:auto!important;margin-right:auto!important;}'
       '.add-to-contact-btn,.add-to-contact-section,[class*=add-to-contact]{left:50%!important;right:auto!important;transform:translateX(-50%)!important;max-width:540px!important;width:100%!important;}'
       '.blog-section,.blog-card,[class*=blog-]{display:none!important;}'
       '.product-slider,.gallery-slider,.testimonial-slider{overflow:hidden;}'
       '.product-slider .slick-slide,.gallery-slider .slick-slide{padding:0 8px;box-sizing:border-box;}'
       '</style>')

php_header = f'''<?php
/** Tapify vCard Template: {VID} — auto-generated from imagesCorporateConnect (hosted assets). */
$cardUrl='https://tapify-backend-production.up.railway.app/'.($vcard['url_alias'] ?? $vcardId);
$waPhone=preg_replace('/\\D/','',$vcard['phone'] ?? '');
$locationUrl=!empty($vcard['location_url'])?$vcard['location_url']:'https://maps.google.com/?q='.urlencode($vcard['location'] ?? '');
$profileImg=!empty($vcard['profile_image'])?imgUrl($vcard['profile_image']):'https://ui-avatars.com/api/?name='.urlencode($fullName).'&size=200&background={PRIMARY}&color=ffffff';
$coverImg=!empty($vcard['cover_image'])?imgUrl($vcard['cover_image']):'{COVER}';
$qrUrl='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='.urlencode($cardUrl);
$platformIcons=['linkedin-in'=>'fa-linkedin-in','linkedin'=>'fa-linkedin-in','instagram'=>'fa-instagram','x-twitter'=>'fa-x-twitter','twitter'=>'fa-x-twitter','facebook'=>'fa-facebook-f','facebook-f'=>'fa-facebook-f','whatsapp'=>'fa-whatsapp','youtube'=>'fa-youtube','spotify'=>'fa-spotify','github'=>'fa-github','tiktok'=>'fa-tiktok','pinterest'=>'fa-pinterest-p','behance'=>'fa-behance','dribbble'=>'fa-dribbble','telegram'=>'fa-telegram','globe'=>'fa-globe'];
?>
'''

out = (php_header
       + '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
       '<title><?= htmlspecialchars($fullName) ?></title>'
       '<link rel="icon" href="<?= !empty($vcard[\'favicon_image\'])?imgUrl($vcard[\'favicon_image\']):\'/images/tapify-logo-green.png\' ?>">'
       + CDN + gfonts
       + '<style>' + head_styles.replace('<style>', '').replace('</style>', '') + '</style>'
       + FIX
       + '<?php if(!empty($vcard["custom_css"])): ?><style><?= $vcard["custom_css"] ?></style><?php endif; ?>'
       '</head><body>'
       + body
       + slick
       + '<?php if(!empty($vcard["custom_js"])): ?><script><?= $vcard["custom_js"] ?></script><?php endif; ?>'
       '<?php include __DIR__ . "/_shared-scripts.php"; ?></body></html>')

open(OUT, 'w', encoding='utf-8').write(out)
print(f'WROTE {VID} {len(out)//1024} KB | base64 left: {len(re.findall(r"base64,[A-Za-z0-9+/=]{80,}", out))}')
