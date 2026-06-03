# Builds tapify-backend/templates/vcard43.php from Salon clean.html
# Preserves exact design CSS; injects dynamic $vcard data + foreach loops.
import io, sys, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SRC = 'D:/Print World/tapify/tapify-frontend/newTemps/imagesSalon/clean.html'
OUT = 'D:/Print World/tapify/tapify-backend/templates/vcard43.php'

h = open(SRC, encoding='utf-8', errors='replace').read()

# --- Split head (with <style>) and body ---
head_styles = '\n'.join(re.findall(r'<style[^>]*>.*?</style>', h, flags=re.DOTALL))
cdn_links = '\n'.join(re.findall(r'<link[^>]+>', h[:h.lower().find('</head>')]))
bs = re.search(r'<body[^>]*>', h, re.I)
body = h[bs.end():]
body = re.sub(r'<script.*?</script>', '', body, flags=re.DOTALL|re.I)
# Strip leftover decorative base64 IMG src on big vector backgrounds? keep them (design)

# ---------- SINGLE-VALUE FIELD REPLACEMENTS ----------
# Profile name
body = body.replace('The Luxury Salon', "<?= htmlspecialchars($fullName) ?>")
# Occupation
body = body.replace('Hair Extension Specialist', "<?= htmlspecialchars($vcard['occupation'] ?? '') ?>")
# Description (welcome paragraph) — replace whole <p> inside profile-desc
body = re.sub(
    r'(<div class="[^"]*profile-desc[^"]*"[^>]*>\s*)<p>.*?</p>',
    r"\1<p><?= nl2br(htmlspecialchars($vcard['description'] ?? '')) ?></p>",
    body, count=1, flags=re.DOTALL)

# Emails (mailto links) -> use $vcard email / alternate_email
emails = re.findall(r'mailto:([^"\'>]+)', body)
if len(emails) >= 1:
    body = body.replace('mailto:'+emails[0], "mailto:<?= htmlspecialchars($vcard['email'] ?? '') ?>")
    body = re.sub(r'>\s*'+re.escape(emails[0])+r'\s*<', r"><?= htmlspecialchars($vcard['email'] ?? '') ?><", body, count=1)
if len(emails) >= 2:
    body = body.replace('mailto:'+emails[1], "mailto:<?= htmlspecialchars($vcard['alternate_email'] ?? '') ?>")
    body = re.sub(r'>\s*'+re.escape(emails[1])+r'\s*<', r"><?= htmlspecialchars($vcard['alternate_email'] ?? '') ?><", body, count=1)

# Phones (tel links)
phones = re.findall(r'tel:([+\d]+)', body)
if len(phones) >= 1:
    body = body.replace('tel:'+phones[0], "tel:<?= htmlspecialchars($vcard['phone'] ?? '') ?>", 1)
if len(phones) >= 2:
    body = body.replace('tel:'+phones[1], "tel:<?= htmlspecialchars($vcard['alternate_phone'] ?? '') ?>", 1)

# Profile avatar image (the card-img img) -> $profileImg
body = re.sub(r'(<div class="card-img[^"]*"[^>]*>\s*<img )src="[^"]*"',
              r"\1src=\"<?= $profileImg ?>\"", body, count=1)
# Banner/cover image -> $coverImg (the banner-img injected one already points to unsplash; make dynamic)
body = re.sub(r'(<div class="banner-img[^"]*"[^>]*>\s*<img )src="[^"]*"',
              r"\1src=\"<?= $coverImg ?>\"", body, count=1)

# ---------- SOCIAL LINKS -> foreach ----------
soc_loop = (
"<?php foreach ($socialLinks as $s): $ic = $platformIcons[$s['platform']] ?? 'fa-globe'; ?>"
"<a href=\"<?= htmlspecialchars($s['url']) ?>\" target=\"_blank\" rel=\"noopener\">"
"<i class=\"fab <?= $ic ?> icon fa-2x\"></i></a>"
"<?php endforeach; ?>")
body = re.sub(r'(<div class="social-icons[^"]*"[^>]*>).*?(</div>)',
              r'\1'+soc_loop+r'\2', body, count=1, flags=re.DOTALL)

# ---------- PHP HEADER ----------
php_header = """<?php
/**
 * Tapify vCard Template: vcard43 — Stylish Salon (premium, from newTemps)
 * Standalone template — variables injected by vcard.php router.
 */
$cardUrl = 'https://tapify-backend-production.up.railway.app/'.($vcard['url_alias'] ?? $vcardId);
$waPhone = preg_replace('/\\D/', '', $vcard['phone'] ?? '');
$locationUrl = !empty($vcard['location_url']) ? $vcard['location_url'] : 'https://maps.google.com/?q='.urlencode($vcard['location'] ?? '');
$profileImg = !empty($vcard['profile_image']) ? imgUrl($vcard['profile_image']) : 'https://ui-avatars.com/api/?name='.urlencode($fullName).'&size=200&background=a4866d&color=ffffff';
$coverImg = !empty($vcard['cover_image']) ? imgUrl($vcard['cover_image']) : 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80';
$qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='.urlencode($cardUrl);
$platformIcons = ['linkedin-in'=>'fa-linkedin-in','linkedin'=>'fa-linkedin-in','instagram'=>'fa-instagram','x-twitter'=>'fa-x-twitter','twitter'=>'fa-x-twitter','facebook'=>'fa-facebook-f','facebook-f'=>'fa-facebook-f','whatsapp'=>'fa-whatsapp','youtube'=>'fa-youtube','spotify'=>'fa-spotify','github'=>'fa-github','tiktok'=>'fa-tiktok','pinterest'=>'fa-pinterest-p','behance'=>'fa-behance','dribbble'=>'fa-dribbble','telegram'=>'fa-telegram','globe'=>'fa-globe'];
?>
"""

out = (php_header
       + '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
       + '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
       + '<title><?= htmlspecialchars($fullName) ?><?= !empty($vcard["occupation"]) ? " | ".htmlspecialchars($vcard["occupation"]) : "" ?></title>\n'
       + '<link rel="icon" href="<?= !empty($vcard[\'favicon_image\']) ? imgUrl($vcard[\'favicon_image\']) : \'/images/tapify-logo-green.png\' ?>">\n'
       + cdn_links + '\n'
       + head_styles + '\n'
       + '<?php if (!empty($vcard["custom_css"])): ?><style><?= $vcard["custom_css"] ?></style><?php endif; ?>\n'
       + '</head>\n<body>\n'
       + body.rstrip()
       + '\n<?php if (!empty($vcard["custom_js"])): ?><script><?= $vcard["custom_js"] ?></script><?php endif; ?>\n'
       + '<?php include __DIR__ . "/_shared-scripts.php"; ?>\n'
       + '</body>\n</html>\n')

open(OUT, 'w', encoding='utf-8').write(out)
print('Wrote', OUT)
print('size', len(out)//1024, 'KB')
print('emails found:', emails[:2])
print('phones found:', phones[:2])
print('name replaced:', 'The Luxury Salon' not in out)
print('social loop inserted:', 'foreach ($socialLinks' in out)
print('profileImg used:', '$profileImg' in out)
