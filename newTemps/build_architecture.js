// Node port of build_generic.py — adapted to current machine paths.
// Generates backend/templates/<VID>.php from newTemps/<FOLDER>, hosting base64 assets.
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const BASE = 'C:/Users/Printworld/Downloads/Tapify/Tapify/TAPIFY-FRESH-UPLOAD/TAPIFY-FRESH-UPLOAD';
const FOLDER = 'imagesArchitecture', SLUG = 'architecture', VID = 'vcard71', PRIMARY = '#716659';
const SRC_DIR = `${BASE}/frontend/newTemps/${FOLDER}`;
const ASSET_DIR = `${BASE}/backend/images/templates/${SLUG}`;
const ASSET_URL = `/images/templates/${SLUG}`;
const OUT = `${BASE}/backend/templates/${VID}.php`;
fs.mkdirSync(ASSET_DIR, { recursive: true });

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let htmls = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html') && !f.toLowerCase().includes('clean'));
let h = fs.readFileSync(path.join(SRC_DIR, htmls[0]), 'utf8');
h = h.replace(/<!--\s*Page saved with SingleFile[\s\S]*?-->/g, '');
h = h.replace(/<meta[^>]*Content-Security-Policy[^>]*>/gi, '');

// ---- host base64 images (incl svg/gif) ----
const EXT = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/gif': 'gif', 'image/svg+xml': 'svg' };
const seen = {}; let idx = 0;
function save(mime, data) {
  if (mime === 'image/svg+xml' && !/^[A-Za-z0-9+/=]+$/.test(data.slice(0, 40))) return null;
  let raw;
  try { raw = Buffer.from(data, 'base64'); } catch (e) { return null; }
  if (!raw || raw.length === 0) return null;
  const m = crypto.createHash('md5').update(raw).digest('hex');
  if (seen[m]) return seen[m];
  const ext = EXT[mime] || 'bin';
  const fn = `${SLUG.slice(0, 3)}-${String(idx).padStart(3, '0')}.${ext}`; idx++;
  fs.writeFileSync(path.join(ASSET_DIR, fn), raw); seen[m] = ASSET_URL + '/' + fn;
  return seen[m];
}
h = h.replace(/data:(image\/[a-z+]+);base64,([A-Za-z0-9+/=]+)/g, (full, mime, data) => save(mime, data) || full);
let COVER = ASSET_URL + `/${SLUG.slice(0, 3)}-003.webp`;
const ifn = fs.readdirSync(ASSET_DIR).filter(f => /\.(webp|jpg|png)$/.test(f)).sort();
if (ifn.length) COVER = ASSET_URL + '/' + ifn[Math.floor(ifn.length / 2)];
console.log('images:', idx);

// ---- strip fonts; redundant icon css ----
h = h.replace(/@font-face\s*\{[^}]*\}/g, '');
h = h.replace(/data:(?:font|application)\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '');
h = h.replace(/\.bi-[a-z0-9-]+::?before\{content:"[^"]*"\}/g, '');
h = h.replace(/\.fa-[a-z0-9-]+::?before\{content:"[^"]*"\}/g, '');

const head_styles = (h.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []).join('\n');
const headEnd = h.toLowerCase().indexOf('</head>');
const headPart = headEnd >= 0 ? h.slice(0, headEnd) : h;
const gfonts = (headPart.match(/<link[^>]+>/g) || []).filter(l => l.includes('fonts.google') || l.includes('gstatic')).join('\n');
const bs = h.match(/<body[^>]*>/i);
const lc = h.toLowerCase();
const endBody = lc.includes('</body>') ? lc.lastIndexOf('</body>') : lc.lastIndexOf('</html>');
let body = h.slice(bs.index + bs[0].length, endBody);
body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
body = body.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
body = body.replace(/<iframe[^>]*\/?>/gi, '');
body = body.replace(/<blockquote[^>]*instagram[\s\S]*?<\/blockquote>/gi, '');
body = body.replace(/<link[^>]*>/gi, '');
body = body.replace(/<form[^>]*id=["']?enquiryForm["']?[^>]*>/i,
  '<form id="enquiryForm" onsubmit="submitInquiry(event)" enctype="multipart/form-data"><input type="hidden" name="vcard_id" value="<?= $vcardId ?>">');

function balanced_replace(s, openRe, nw, maxSpan = 300000) {
  const m = s.match(openRe); if (!m) return [s, false];
  const start = m.index; let depth = 0;
  const re = /<div\b|<\/div>/g; re.lastIndex = start; let t;
  while ((t = re.exec(s)) !== null) {
    depth += (t[0] === '</div>') ? -1 : 1;
    if (depth === 0) {
      const end = t.index + t[0].length;
      if (end - start > maxSpan) return [s, false];
      return [s.slice(0, start) + nw + s.slice(end), true];
    }
  }
  return [s, false];
}

// ---- profile name via verification-icon ----
let name_ok = false;
const nm = body.match(/<(h[1-5]|p|span)[^>]*>\s*([^<]{2,60}?)\s*<i class=["']?verification/);
if (nm) {
  const name = nm[2];
  const after = body.slice(nm.index + nm[0].length, nm.index + nm[0].length + 400);
  const pm = after.match(/(<p[^>]*>)\s*([^<]{2,70})\s*(<\/p>)/);
  const occ_html = pm ? pm[0] : null;
  body = body.split(name).join('<?= htmlspecialchars($fullName) ?>');
  name_ok = true;
  if (occ_html && body.includes(occ_html))
    body = body.replace(occ_html, () => pm[1] + '<?= htmlspecialchars($vcard["occupation"] ?? "") ?>' + pm[3]);
}
console.log('name dynamic:', name_ok);

// ---- emails / phones ----
const mails = [...body.matchAll(/mailto:([^\s"'>]+)/g)].map(x => x[1]);
['email', 'alternate_email'].forEach((key, i) => {
  if (i < mails.length) {
    body = body.replace('mailto:' + mails[i], () => `mailto:<?= htmlspecialchars($vcard["${key}"] ?? "") ?>`);
    body = body.replace(new RegExp('>\\s*' + escapeRe(mails[i]) + '\\s*<'), () => `><?= htmlspecialchars($vcard["${key}"] ?? "") ?><`);
  }
});
const tels = [...new Set([...body.matchAll(/tel:(\+?[0-9][0-9 ]{5,}[0-9])/g)].map(x => x[1]))];
['phone', 'alternate_phone'].forEach((key, i) => {
  if (i < tels.length) {
    body = body.replace('tel:' + tels[i], () => `tel:<?= htmlspecialchars($vcard["${key}"] ?? "") ?>`);
    body = body.replace(new RegExp('>\\s*' + escapeRe(tels[i]) + '\\s*<'), () => `><?= htmlspecialchars($vcard["${key}"] ?? "") ?><`);
  }
});

// ---- avatar ----
body = body.replace(/(<div class="[^"]*card-img[^"]*"[^>]*>\s*<img )src=("?)[^"'> ]*\2/, (m, a) => a + 'src="<?= $profileImg ?>"');

// ---- banner / cover ----
const coverPhp = String.raw`<?php $cvType=$vcard["cover_type"]??"image";$cvVal=$vcard["cover_image"]??"";$isVid=($cvType==="video")||preg_match("#youtube\.com|youtu\.be|instagram\.com|\.mp4#i",$cvVal);if($isVid&&!empty($cvVal)){if(preg_match("#(?:youtube\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^\"&?/\s]{11})#i",$cvVal,$mm)){$yt=$mm[1];echo "<iframe style=\"width:100%;height:100%;display:block;border:none;\" src=\"https://www.youtube.com/embed/".$yt."?autoplay=1&mute=1&loop=1&playlist=".$yt."&controls=0&showinfo=0&rel=0&playsinline=1\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" allowfullscreen></iframe>";}elseif(stripos($cvVal,"instagram.com")!==false){echo "<iframe style=\"width:100%;height:100%;display:block;border:none;\" src=\"".htmlspecialchars(rtrim($cvVal,"/")."/embed")."\" allowtransparency=\"true\"></iframe>";}else{echo "<video src=\"".htmlspecialchars(imgUrl($cvVal))."\" autoplay loop muted playsinline style=\"width:100%;height:100%;object-fit:cover;display:block;\"></video>";}}else{echo "<img src=\"".htmlspecialchars($coverImg)."\" alt=\"".htmlspecialchars($fullName)."\" style=\"width:100%;height:100%;object-fit:cover;display:block;\">";} ?>`;
const bannerImgDiv = '<div class="banner-img" style="position:relative;overflow:hidden;height:315px;">' + coverPhp + '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5));"></div></div>';
const SECTION = '<div class="banner-section position-relative w-100">' + bannerImgDiv + '</div>';
let ok, how = 'section';
[body, ok] = balanced_replace(body, /<div class=["']?[^>"']*banner-section[^>"']*["']?[^>]*>/, SECTION, 12000);
if (!ok) { [body, ok] = balanced_replace(body, /<div class=["']?[^>"']*banner-img[^>"']*["']?[^>]*>/, bannerImgDiv, 8000); how = 'img-div'; }
if (!ok) { let n = 0; body = body.replace(/<img [^>]*class=["'][^"']*banner-img[^"']*["'][^>]*>/, () => { n++; return bannerImgDiv; }); ok = n > 0; how = 'img-tag'; }
if (!ok) { body = SECTION + body; ok = true; how = 'injected'; }
console.log('banner', ok, how);

// ---- social ----
const soc = `<?php foreach ($socialLinks as $s): $ic=$platformIcons[$s["platform"]] ?? "fa-globe"; ?><a href="<?= htmlspecialchars($s["url"]) ?>" target="_blank" rel="noopener"><i class="fab <?= $ic ?> icon fa-2x"></i></a><?php endforeach; ?>`;
body = body.replace(/(<div class="[^"]*social-icons[^"]*"[^>]*>)[\s\S]*?(<\/div>)/, (m, a, b) => a + soc + b);

// ---- sliders ----
const PROD = `<div class="product-slider"><?php foreach ((isset($__pr)?$__pr:($products ?? [])) as $p): $pi=!empty($p["image"])?imgUrl($p["image"]):"${COVER}"; ?><div class="px-2"><div class="product-card card"><div class="product-img card-img"><img src="<?= htmlspecialchars($pi) ?>" class="w-100 h-100 object-fit-cover" loading="lazy"></div><div class="product-desc card-body d-flex flex-column align-items-center justify-content-between"><div class="product-title"><h3 class="text-dark text-center"><?= htmlspecialchars($p["name"] ?? "") ?></h3></div><?php if(isset($p["price"]) && $p["price"]!==""): ?><div class="product-amount"><span>₹ <?= htmlspecialchars($p["price"]) ?></span></div><?php endif; ?></div></div></div><?php endforeach; ?></div>`;
const GAL = `<div class="gallery-slider"><?php foreach ((isset($__ga)?$__ga:($galleries ?? [])) as $g): foreach (($g["images"] ?? []) as $im): $gi=imgUrl($im["image_url"] ?? ($im["image"] ?? "")); ?><div class="px-2"><div class="gallery-img-wrapper"><div class="gallery-img" style="background-image:url('<?= htmlspecialchars($gi) ?>');background-size:cover;background-position:center;height:280px;border-radius:12px;"></div></div></div><?php endforeach; endforeach; ?></div>`;
const TES = `<div class="testimonial-slider"><?php foreach ((isset($__te)?$__te:($testimonials ?? [])) as $t): ?><div class="px-2"><div class="testimonial-card p-0"><div class="card-body text-center position-relative"><div class="text-center"><p class="text-gray mb-0">“<?= htmlspecialchars($t["message"] ?? "") ?>”</p></div></div><div class="d-flex flex-column align-items-center justify-content-center gap-2 profile-desc"><?php if(!empty($t["image"])): ?><div class="card-img" style="width:60px;height:60px;border-radius:50%;overflow:hidden;"><img src="<?= htmlspecialchars(imgUrl($t["image"])) ?>" class="w-100 h-100 object-fit-cover"></div><?php endif; ?><h5 class="fw-6 mb-0"><?= htmlspecialchars($t["author_name"] ?? ($t["author"] ?? "")) ?></h5></div></div></div><?php endforeach; ?></div>`;
for (const [opn, nw, lbl] of [[/<div class="[^"]*product-slider[^"]*"[^>]*>/, PROD, 'prod'], [/<div class="[^"]*gallery-slider[^"]*"[^>]*>/, GAL, 'gal'], [/<div class="[^"]*testimonial-slider[^"]*"[^>]*>/, TES, 'tes']]) {
  [body, ok] = balanced_replace(body, opn, nw); console.log(lbl, ok);
}

// ---- services + business-hours ----
let SVC = '<div class="our-services-section pt-50 position-relative"><div class="section-heading"><h2>Our Services</h2></div><div class="services"><div class="px-30"><div class="row"><?php foreach ((isset($__sv)?$__sv:($services ?? [])) as $sv): $svimg=!empty($sv["image"])?imgUrl($sv["image"]):"' + COVER + '"; ?><div class="col-sm-6 mb-sm-0 mb-40 p-3"><div class="card-wrapper h-100"><a href="javascript:void(0)" class="text-decoration-none"><div class="service-card card h-100"><div class="card-img mx-auto"><img src="<?= htmlspecialchars($svimg) ?>" alt="<?= htmlspecialchars($sv["name"] ?? "") ?>" class="w-100 h-100 object-fit-cover" loading="lazy"></div><div class="card-body text-center"><h3 class="card-title text-primary"><?= htmlspecialchars($sv["name"] ?? "") ?></h3><?php if(!empty($sv["description"])): ?><p class="mb-0 text-gray"><?= htmlspecialchars($sv["description"]) ?></p><?php endif; ?></div></div></a></div></div><?php endforeach; ?></div></div></div></div>';
SVC = SVC.replace('"\' + COVER + \'"', `"${COVER}"`);
let BH = `<div class="business-hour-section pt-50 px-30 position-relative"><div class="section-heading"><h2>Business Hours</h2></div><div class="px-30"><div class="row justify-content-center"><?php foreach ((isset($__bh)?$__bh:($businessHours ?? [])) as $bh): ?><div class="col-sm-6"><div class="business-hour-card d-flex gap-2 align-items-center mb-3"><div class="time-icon"><i class="bi bi-clock fs-3"></i></div><div class="d-flex flex-column align-items-start"><span class="fs-14 text-gray lh-1 fw-5"><?= htmlspecialchars(ucfirst(strtolower($bh["day_name"] ?? ""))) ?></span><span class="fs-16 fw-5"><?= !empty($bh["is_open"]) ? htmlspecialchars(trim(($bh["open_time"] ?? "")." - ".($bh["close_time"] ?? ""))) : "Closed" ?></span></div></div></div><?php endforeach; ?></div></div></div>`;
SVC = '<?php if(!empty($services)): ?>' + SVC + '<?php endif; ?>';
BH = '<?php if(!empty($businessHours)): ?>' + BH + '<?php endif; ?>';
[body, ok] = balanced_replace(body, /<div class=["']?[^>"']*(?:our-)?services-section[^>"']*["']?[^>]*>/, SVC); console.log('svc', ok);
[body, ok] = balanced_replace(body, /<div class=["']?[^>"']*business-hour(?!-card)[^>"']*["']?[^>]*>/, BH); console.log('bh', ok);

// ---- suppress + features ----
const supp = '<?php $__sv=$services;$__pr=$products;$__ga=$galleries;$__te=$testimonials;$__bh=$businessHours;$services=[];$products=[];$galleries=[];$testimonials=[];$businessHours=[]; ?>';
const slick = '<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script><script src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"><script src="https://cdn.jsdelivr.net/npm/flatpickr"></script><script>function tfInit(){if(typeof jQuery==="undefined"||!jQuery.fn||!jQuery.fn.slick){return setTimeout(tfInit,120);}jQuery(function($){$(".product-slider,.gallery-slider,.testimonial-slider").each(function(){if($(this).children().length===0){$(this).closest("[class*=section]").hide();$(this).hide();}});function ini(s,o){var $s=$(s);if(!$s.length||$s.hasClass("slick-initialized"))return;$s.slick(o);}ini(".product-slider",{slidesToShow:2,arrows:false,dots:true,infinite:true,autoplay:true,autoplaySpeed:2500,responsive:[{breakpoint:576,settings:{slidesToShow:1}}]});ini(".gallery-slider",{slidesToShow:2,arrows:false,dots:true,infinite:true,autoplay:true,autoplaySpeed:2500,responsive:[{breakpoint:576,settings:{slidesToShow:1}}]});ini(".testimonial-slider",{slidesToShow:1,arrows:false,dots:true,infinite:true,autoplay:true,autoplaySpeed:4000});if(window.flatpickr){flatpickr("#pickUpDate",{minDate:"today",dateFormat:"Y-m-d"});flatpickr(".flatpickr-input",{minDate:"today",dateFormat:"Y-m-d"});}});}tfInit();</script>';
const CDN = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">';

let PAGEBG = '';
const mbg = head_styles.match(/body\s*\{[^}]*?background(?:-color)?\s*:\s*(#[0-9a-fA-F]{6,8}|rgba?\([\d.,\s%]+\))[^}]*?!important/i);
if (mbg) {
  let c = mbg[1].trim();
  const m8 = c.match(/^#([0-9a-fA-F]{6})[0-9a-fA-F]{2}$/);
  if (m8) c = '#' + m8[1];
  const mr = c.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,[^)]+)?\)/);
  if (mr) c = `rgb(${mr[1]},${mr[2]},${mr[3]})`;
  PAGEBG = `html,body{background-color:${c}!important;}`;
}
const FIX = `<style>html,body{overflow-y:auto!important;height:auto!important;min-height:100%!important;position:relative!important;}${PAGEBG}.container{max-width:540px!important;margin-left:auto!important;margin-right:auto!important;}.add-to-contact-btn,.add-to-contact-section,[class*=add-to-contact]{left:50%!important;right:auto!important;transform:translateX(-50%)!important;max-width:540px!important;width:100%!important;}.blog-section,.blog-card,[class*=blog-]{display:none!important;}.product-slider,.gallery-slider,.testimonial-slider{overflow:hidden;}.product-slider .slick-slide,.gallery-slider .slick-slide{padding:0 8px;box-sizing:border-box;}</style>`;

const PCOL = PRIMARY.replace(/^#/, '');
const php_header = `<?php
/** Tapify vCard Template: ${VID} — auto-generated from ${FOLDER} (hosted assets). */
$cardUrl='https://app.tapify.co.in/'.($vcard['url_alias'] ?? $vcardId);
$waPhone=preg_replace('/\\D/','',$vcard['phone'] ?? '');
$locationUrl=!empty($vcard['location_url'])?$vcard['location_url']:'https://maps.google.com/?q='.urlencode($vcard['location'] ?? '');
$profileImg=!empty($vcard['profile_image'])?imgUrl($vcard['profile_image']):'https://ui-avatars.com/api/?name='.urlencode($fullName).'&size=200&background=${PCOL}&color=ffffff';
$coverImg=!empty($vcard['cover_image'])?imgUrl($vcard['cover_image']):'${COVER}';
$qrUrl='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='.urlencode($cardUrl);
$platformIcons=['linkedin-in'=>'fa-linkedin-in','linkedin'=>'fa-linkedin-in','instagram'=>'fa-instagram','x-twitter'=>'fa-x-twitter','twitter'=>'fa-x-twitter','facebook'=>'fa-facebook-f','facebook-f'=>'fa-facebook-f','whatsapp'=>'fa-whatsapp','youtube'=>'fa-youtube','spotify'=>'fa-spotify','github'=>'fa-github','tiktok'=>'fa-tiktok','pinterest'=>'fa-pinterest-p','behance'=>'fa-behance','dribbble'=>'fa-dribbble','telegram'=>'fa-telegram','globe'=>'fa-globe'];
?>
`;

const headHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title><?= htmlspecialchars($fullName) ?></title><link rel="icon" href="<?= !empty($vcard['favicon_image'])?imgUrl($vcard['favicon_image']):'/images/tapify-logo-green.png' ?>">`;
const out = php_header + headHtml + CDN + gfonts + '<style>' + head_styles.replaceAll('<style>', '').replaceAll('</style>', '') + '</style>' + FIX +
  '<?php if(!empty($vcard["custom_css"])): ?><style><?= $vcard["custom_css"] ?></style><?php endif; ?></head><body>' + body + slick +
  '<?php if(!empty($vcard["custom_js"])): ?><script><?= $vcard["custom_js"] ?></script><?php endif; ?><?php include __DIR__ . "/_shared-scripts.php"; ?></body></html>';
fs.writeFileSync(OUT, out);
console.log('WROTE', VID, Math.floor(out.length / 1024), 'KB | base64 left:', (out.match(/base64,[A-Za-z0-9+/=]{80,}/g) || []).length);
