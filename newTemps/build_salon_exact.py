# Pixel-exact Salon -> backend vcard43.php
# 1) extract all base64 images to backend images/templates/salon/
# 2) rewrite base64 refs (src + --sf-img url()) to /images/templates/salon/<file>
# 3) inject PHP header + core dynamic fields + social loop
import io, sys, re, os, hashlib, base64 as b64
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SRC = 'D:/Print World/tapify/tapify-frontend/newTemps/imagesSalon/clean.html'
ASSET_DIR = 'D:/Print World/tapify/tapify-backend/images/templates/salon'
ASSET_URL = '/images/templates/salon'
OUT = 'D:/Print World/tapify/tapify-backend/templates/vcard43.php'
os.makedirs(ASSET_DIR, exist_ok=True)

h = open(SRC, encoding='utf-8', errors='replace').read()

EXT = {'image/webp':'webp','image/png':'png','image/jpeg':'jpg','image/jpg':'jpg','image/gif':'gif','image/svg+xml':'svg'}
seen = {}   # md5 -> filename
idx = [0]
def save_blob(mime, data_b64):
    try:
        if mime == 'image/svg+xml' and not re.match(r'^[A-Za-z0-9+/=]+$', data_b64[:40]):
            # raw (non-base64) svg — keep inline, skip
            return None
        raw = b64.b64decode(data_b64 + '='*(-len(data_b64) % 4))
    except Exception:
        return None
    md5 = hashlib.md5(raw).hexdigest()
    if md5 in seen:
        return seen[md5]
    ext = EXT.get(mime, 'bin')
    fn = f'salon-{idx[0]:03d}.{ext}'
    idx[0] += 1
    open(os.path.join(ASSET_DIR, fn), 'wb').write(raw)
    seen[md5] = ASSET_URL + '/' + fn
    return seen[md5]

# Replace base64 data URIs (quoted, unquoted, in url())
def repl(m):
    mime = m.group('mime'); data = m.group('data')
    url = save_blob(mime, data)
    return url if url else m.group(0)

# pattern matches data:<mime>;base64,<data>
pat = re.compile(r'data:(?P<mime>image/[a-z+]+);base64,(?P<data>[A-Za-z0-9+/=]+)')
h = pat.sub(repl, h)

print('Extracted', idx[0], 'images to', ASSET_DIR)

# ---- strip embedded fonts (CDN Google Fonts + FontAwesome already loaded) ----
h = re.sub(r'@font-face\s*\{[^}]*\}', '', h)
h = re.sub(r'data:(?:font|application)/[^;]+;base64,[A-Za-z0-9+/=]+', '', h)

# ---- split head/body ----
head_styles = '\n'.join(re.findall(r'<style[^>]*>.*?</style>', h, flags=re.DOTALL))
cdn_links = '\n'.join(re.findall(r'<link[^>]+>', h[:h.lower().find('</head>')]))
bs = re.search(r'<body[^>]*>', h, re.I)
body = h[bs.end():]
body = re.sub(r'<script.*?</script>', '', body, flags=re.DOTALL|re.I)

# ---- core dynamic fields ----
body = body.replace('The Luxury Salon', "<?= htmlspecialchars($fullName) ?>")
body = body.replace('Hair Extension Specialist', "<?= htmlspecialchars($vcard['occupation'] ?? '') ?>")
body = re.sub(r'(<div class="[^"]*profile-desc[^"]*"[^>]*>\s*)<p>.*?</p>',
              r"\1<p><?= nl2br(htmlspecialchars($vcard['description'] ?? '')) ?></p>",
              body, count=1, flags=re.DOTALL)

# emails: href can be unquoted (href=mailto:x class=...) — stop at whitespace/quote/>
mails = re.findall(r'mailto:([^\s"\'>]+)', body)
if len(mails) >= 1:
    body = body.replace('mailto:'+mails[0], "mailto:<?= htmlspecialchars($vcard['email'] ?? '') ?>", 1)
    body = re.sub(r'>\s*'+re.escape(mails[0])+r'\s*<', "><?= htmlspecialchars($vcard['email'] ?? '') ?><", body, count=1)
if len(mails) >= 2:
    body = body.replace('mailto:'+mails[1], "mailto:<?= htmlspecialchars($vcard['alternate_email'] ?? '') ?>", 1)
    body = re.sub(r'>\s*'+re.escape(mails[1])+r'\s*<', "><?= htmlspecialchars($vcard['alternate_email'] ?? '') ?><", body, count=1)

# phones: real tel numbers (may contain spaces, e.g. "+91 9800508990")
tels = re.findall(r'tel:(\+?[0-9][0-9 ]{5,}[0-9])', body)
seen_tel = []
for t in tels:
    if t not in seen_tel: seen_tel.append(t)
if len(seen_tel) >= 1:
    body = body.replace('tel:'+seen_tel[0], "tel:<?= htmlspecialchars($vcard['phone'] ?? '') ?>", 1)
    body = re.sub(r'>\s*'+re.escape(seen_tel[0])+r'\s*<', "><?= htmlspecialchars($vcard['phone'] ?? '') ?><", body, count=1)
if len(seen_tel) >= 2:
    body = body.replace('tel:'+seen_tel[1], "tel:<?= htmlspecialchars($vcard['alternate_phone'] ?? '') ?>", 1)
    body = re.sub(r'>\s*'+re.escape(seen_tel[1])+r'\s*<', "><?= htmlspecialchars($vcard['alternate_phone'] ?? '') ?><", body, count=1)

# profile avatar -> $profileImg
body = re.sub(r'(<div class="card-img[^"]*"[^>]*>\s*<img )src="[^"]*"', r'\1src="<?= $profileImg ?>"', body, count=1)
# banner cover -> $coverImg
body = re.sub(r'(<div class="banner-img[^"]*"[^>]*>\s*<img )src="[^"]*"', r'\1src="<?= $coverImg ?>"', body, count=1)

# social-icons -> foreach
soc = ("<?php foreach ($socialLinks as $s): $ic = $platformIcons[$s['platform']] ?? 'fa-globe'; ?>"
       "<a href=\"<?= htmlspecialchars($s['url']) ?>\" target=\"_blank\" rel=\"noopener\">"
       "<i class=\"fab <?= $ic ?> icon fa-2x\"></i></a><?php endforeach; ?>")
body = re.sub(r'(<div class="social-icons[^"]*"[^>]*>).*?(</div>)', r'\1'+soc+r'\2', body, count=1, flags=re.DOTALL)

php_header = """<?php
/**
 * Tapify vCard Template: vcard43 — Stylish Salon (pixel-exact, hosted assets)
 * Standalone template — variables injected by vcard.php router.
 */
$cardUrl = 'https://app.tapify.co.in/'.($vcard['url_alias'] ?? $vcardId);
$waPhone = preg_replace('/\\D/', '', $vcard['phone'] ?? '');
$locationUrl = !empty($vcard['location_url']) ? $vcard['location_url'] : 'https://maps.google.com/?q='.urlencode($vcard['location'] ?? '');
$profileImg = !empty($vcard['profile_image']) ? imgUrl($vcard['profile_image']) : 'https://ui-avatars.com/api/?name='.urlencode($fullName).'&size=200&background=a4866d&color=ffffff';
$coverImg = !empty($vcard['cover_image']) ? imgUrl($vcard['cover_image']) : '/images/templates/salon/cover-default.jpg';
$qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='.urlencode($cardUrl);
$platformIcons = ['linkedin-in'=>'fa-linkedin-in','linkedin'=>'fa-linkedin-in','instagram'=>'fa-instagram','x-twitter'=>'fa-x-twitter','twitter'=>'fa-x-twitter','facebook'=>'fa-facebook-f','facebook-f'=>'fa-facebook-f','whatsapp'=>'fa-whatsapp','youtube'=>'fa-youtube','spotify'=>'fa-spotify','github'=>'fa-github','tiktok'=>'fa-tiktok','pinterest'=>'fa-pinterest-p','behance'=>'fa-behance','dribbble'=>'fa-dribbble','telegram'=>'fa-telegram','globe'=>'fa-globe'];
?>
"""

out = (php_header
       + '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
       + '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
       + '<title><?= htmlspecialchars($fullName) ?></title>\n'
       + '<link rel="icon" href="<?= !empty($vcard[\'favicon_image\']) ? imgUrl($vcard[\'favicon_image\']) : \'/images/tapify-logo-green.png\' ?>">\n'
       + cdn_links + '\n' + head_styles + '\n'
       + '<?php if (!empty($vcard["custom_css"])): ?><style><?= $vcard["custom_css"] ?></style><?php endif; ?>\n'
       + '</head>\n<body>\n' + body.rstrip()
       + '\n<?php if (!empty($vcard["custom_js"])): ?><script><?= $vcard["custom_js"] ?></script><?php endif; ?>\n'
       + '<?php include __DIR__ . "/_shared-scripts.php"; ?>\n</body>\n</html>\n')

open(OUT, 'w', encoding='utf-8').write(out)
print('Wrote', OUT, '|', len(out)//1024, 'KB')
print('emails:', mails[:2], '| phones:', seen_tel[:2])
print('name dynamic:', 'The Luxury Salon' not in out)
print('social loop:', 'foreach ($socialLinks' in out)
print('remaining base64 in file:', len(re.findall(r'base64,[A-Za-z0-9+/=]{100,}', out)))
