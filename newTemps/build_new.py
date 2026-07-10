# Generic Tapify template builder: newTemps/<folder> -> tapify-backend/templates/<vcardId>.php
# Usage: python build_generic.py <folder> <slug> <vcardId> <primary> <font> <dark0|1>
import io,sys,re,os,hashlib,base64 as b64
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')

FOLDER,SLUG,VID,PRIMARY,FONT,DARK = sys.argv[1:7]
# Per-template CSS tweaks from review feedback (keyed by slug).
EXTRA_CSS={
 'socialservices': '.contact-box{background:transparent!important;border:none!important;box-shadow:none!important;}',
 'retail': '.contact-box{background:transparent!important;border:none!important;box-shadow:none!important;}',
}
SRC_DIR=f'D:/Print World/tapify/tapify-frontend/newTemps/{FOLDER}'
ASSET_DIR=f'D:/Print World/tapify/tapify-backend/images/templates/{SLUG}'
ASSET_URL=f'/images/templates/{SLUG}'
OUT=f'D:/Print World/tapify/tapify-backend/templates/{VID}.php'
os.makedirs(ASSET_DIR,exist_ok=True)
_allh=[f for f in os.listdir(SRC_DIR) if f.endswith('.html')]
htmls=[f for f in _allh if 'tapify' in f.lower()] or [f for f in _allh if f.lower() not in ('clean.html','clean-pro.html','real-estate-clean.html')] or _allh
h=open(os.path.join(SRC_DIR,htmls[0]),encoding='utf-8',errors='replace').read()
h=re.sub(r'<!--\s*Page saved with SingleFile.*?-->','',h,flags=re.DOTALL)
h=re.sub(r'<meta[^>]*Content-Security-Policy[^>]*>','',h,flags=re.I)

# ---- host base64 images (incl svg/gif) ----
EXT={'image/webp':'webp','image/png':'png','image/jpeg':'jpg','image/jpg':'jpg','image/gif':'gif','image/svg+xml':'svg'}
seen={};idx=[0]
def save(mime,data):
    try:
        if mime=='image/svg+xml' and not re.match(r'^[A-Za-z0-9+/=]+$',data[:40]): return None
        raw=b64.b64decode(data+'='*(-len(data)%4))
    except: return None
    m=hashlib.md5(raw).hexdigest()
    if m in seen: return seen[m]
    ext=EXT.get(mime,'bin');fn=f'{SLUG[:3]}-{idx[0]:03d}.{ext}';idx[0]+=1
    open(os.path.join(ASSET_DIR,fn),'wb').write(raw);seen[m]=ASSET_URL+'/'+fn
    return seen[m]
h=re.sub(r'data:(image/[a-z+]+);base64,([A-Za-z0-9+/=]+)',lambda m:save(m.group(1),m.group(2)) or m.group(0),h)
# Tapify's transparent SVG-placeholder src contains raw <svg>/<rect> markup which the HTML
# parser treats as real elements (breaks the <img> tag, dumps its attributes as text).
# Swap it for a <-free 1x1 transparent GIF so the CSS-var background-image shows cleanly.
h=re.sub(r'data:image/svg\+xml,<svg\b[\s\S]*?</svg>','data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',h)
COVER=ASSET_URL+f'/{SLUG[:3]}-003.webp'
ifn=sorted([f for f in os.listdir(ASSET_DIR) if f.endswith(('.webp','.jpg','.png'))])
if ifn: COVER=ASSET_URL+'/'+ifn[len(ifn)//2]
print('images:',idx[0])

# ---- strip fonts; redundant icon css ----
h=re.sub(r'@font-face\s*\{[^}]*\}','',h)
h=re.sub(r'data:(?:font|application)/[^;]+;base64,[A-Za-z0-9+/=]+','',h)
h=re.sub(r'\.bi-[a-z0-9-]+::?before\{content:"[^"]*"\}','',h)
h=re.sub(r'\.fa-[a-z0-9-]+::?before\{content:"[^"]*"\}','',h)

head_styles='\n'.join(re.findall(r'<style[^>]*>.*?</style>',h,flags=re.DOTALL))
gfonts='\n'.join(l for l in re.findall(r'<link[^>]+>',h[:h.lower().find('</head>')]) if 'fonts.google' in l or 'gstatic' in l)
bs=re.search(r'<body[^>]*>',h,re.I)
body=h[bs.end():h.lower().rfind('</body>') if '</body>' in h.lower() else h.lower().rfind('</html>')]
body=re.sub(r'<script.*?</script>','',body,flags=re.DOTALL|re.I)
# strip ALL leftover iframes (youtube, stripe srcdoc, blockquote embeds) + their stray artifacts
body=re.sub(r'<iframe[\s\S]*?</iframe>','',body,flags=re.I)
body=re.sub(r'<iframe[^>]*/?>','',body,flags=re.I)
# orphaned / malformed iframe remnants that survive the strips above (e.g. `</iframe<script>`
# swallows the next script tag; Google-Forms PING detection spans)
body=re.sub(r'</iframe\s*>?','',body,flags=re.I)
body=re.sub(r'<span[^>]*PING_IFRAME[^>]*>.*?</span>','',body,flags=re.I|re.S)
# unwrap declarative shadow DOM (<template shadowrootmode=...>) into light-DOM divs so the
# page's CSS variables (e.g. logo/background-image:var(--sf-img-N)) actually reach the content
body=re.sub(r'<template[^>]*shadowrootmode[^>]*>','<div style="display:contents">',body,flags=re.I)
body=body.replace('</template>','</div>')
# repair malformed closing tags like `</div<script>` (missing >) that swallow the next element
body=re.sub(r'</([a-zA-Z][\w-]*)(?=<)', r'</\1>', body)
body=re.sub(r'<blockquote[^>]*instagram[\s\S]*?</blockquote>','',body,flags=re.I)
body=re.sub(r'<link[^>]*>','',body,flags=re.I)
# wire the template's own inquiry form to the backend (was a stripped-JS stub)
body=re.sub(r'<form[^>]*id=["\']?enquiryForm["\']?[^>]*>',
            '<form id="enquiryForm" onsubmit="tfSubmitInquiry(event)" enctype="multipart/form-data"><input type="hidden" name="vcard_id" value="<?= $vcardId ?>">'
            '<label class="w-100 mb-2" style="display:block;text-align:left"><span style="font-size:13px;opacity:.85">Attachment (optional)</span>'
            '<input type="file" name="attachment" class="form-control" accept="image/*,.pdf" style="margin-top:4px"></label>',
            body, count=1, flags=re.I)

def balanced_replace(s, open_re, new, max_span=40000):
    """Replace <div ...> matched by open_re ... matching </div> with new. count=1.
    Aborts if the matched span exceeds max_span (guards against malformed/unbalanced HTML)."""
    m=re.search(open_re,s)
    if not m: return s,False
    depth=0
    for t in re.finditer(r'<div\b|</div>',s[m.start():]):
        depth+=1 if t.group(0)=='<div' else -1
        if depth==0:
            end=m.start()+t.end()
            if end-m.start()>max_span: return s,False
            return s[:m.start()]+new+s[end:],True
    return s,False

# ---- profile name via verification-icon (targeted at the matched heading) ----
nm=re.search(r'<(h[1-5]|p|span)[^>]*>\s*([^<]{2,60}?)\s*<i class=["\']?verification',body)
name_ok=False
if nm:
    name=nm.group(2)
    anchor=body[nm.start():nm.end()]               # '<hN ...>Name '  (unique)
    after=body[nm.end():nm.end()+400]
    pm=re.search(r'(<p[^>]*>)\s*([^<]{2,70})\s*(</p>)',after)
    occ_html=pm.group(0) if pm else None
    # replace EVERY mention of the business name (profile + headings + footer) with the dynamic name
    body=body.replace(name,'<?= htmlspecialchars($fullName) ?>')
    name_ok=True
    if occ_html and occ_html in body:
        body=body.replace(occ_html, pm.group(1)+'<?= htmlspecialchars($vcard["occupation"] ?? "") ?>'+pm.group(3), 1)
if not name_ok:
    # fallback: a heading whose class marks it as the profile/business name
    nm2=re.search(r'<(h[1-6]|p|span|div)[^>]*class=["\'][^"\']*(?:profile-name|profile_name|card-name|hero-name|user-name|business-name|\bname\b)[^"\']*["\'][^>]*>\s*([A-Za-z][^<]{1,58}?)\s*</',body)
    if nm2:
        name=nm2.group(2).strip()
        if name and name.lower() not in ('name','your name','full name'):
            body=body.replace(name,'<?= htmlspecialchars($fullName) ?>')
            name_ok=True
            pos=body.find('<?= htmlspecialchars($fullName) ?>')
            after=body[pos+34:pos+34+400]
            pm=re.search(r'(<(?:p|span|h[3-6])[^>]*>)\s*([A-Za-z][^<]{2,50}?)\s*(</(?:p|span|h[3-6])>)',after)
            if pm and pm.group(0) in body:
                body=body.replace(pm.group(0), pm.group(1)+'<?= htmlspecialchars($vcard["occupation"] ?? "") ?>'+pm.group(3), 1)
print('name dynamic:', name_ok)

# ---- about / description (bind the profile bio to $vcard["description"]) ----
DESC_IF='<?php if(!empty($vcard["description"])): ?><?= nl2br(htmlspecialchars(trim(html_entity_decode(strip_tags($vcard["description"]),ENT_QUOTES)))) ?><?php else: ?>'
DCLS=r'(?:profile-description|profile-desc|profile-bio|profile-about|about-me|about-text|about-desc|bio-text|user-bio|profile-summary)'
desc_ok=False
# primary: a clean desc element (no nested same-tag)
dm=re.search(r'<(p|div|span)([^>]*class="[^"]*'+DCLS+r'[^"]*"[^>]*)>(.*?)</\1>',body,re.I|re.S)
if dm and len(dm.group(3))<900 and ('<'+dm.group(1).lower()) not in dm.group(3).lower():
    new='<'+dm.group(1)+dm.group(2)+'>'+DESC_IF+dm.group(3)+'<?php endif; ?></'+dm.group(1)+'>'
    body=body.replace(dm.group(0),new,1); desc_ok=True
if not desc_ok:
    # fallback: a <p> holding the bio text within the profile-desc region (containers w/ nesting)
    dm2=re.search(r'class="[^"]*'+DCLS+r'[^"]*"',body,re.I)
    if dm2:
        win=body[dm2.end():dm2.end()+1200]
        pm=re.search(r'(<p[^>]*>)(\s*[^<]{30,700}?)(</p>)',win)
        if pm:
            new=pm.group(1)+DESC_IF+pm.group(2)+'<?php endif; ?>'+pm.group(3)
            body=body[:dm2.end()]+win.replace(pm.group(0),new,1)+body[dm2.end()+1200:]
            desc_ok=True
print('desc',desc_ok)

# ---- emails / phones ----
mails=re.findall(r'mailto:([^\s"\'>]+)',body)
for i,key in enumerate(['email','alternate_email']):
    if i<len(mails):
        body=body.replace('mailto:'+mails[i],f'mailto:<?= htmlspecialchars($vcard["{key}"] ?? "") ?>',1)
        body=re.sub(r'>\s*'+re.escape(mails[i])+r'\s*<',f'><?= htmlspecialchars($vcard["{key}"] ?? "") ?><',body,count=1)
tels=list(dict.fromkeys(re.findall(r'tel:(\+?[0-9][0-9 ]{5,}[0-9])',body)))
for i,key in enumerate(['phone','alternate_phone']):
    if i<len(tels):
        body=body.replace('tel:'+tels[i],f'tel:<?= htmlspecialchars($vcard["{key}"] ?? "") ?>',1)
        body=re.sub(r'>\s*'+re.escape(tels[i])+r'\s*<',f'><?= htmlspecialchars($vcard["{key}"] ?? "") ?><',body,count=1)
# primary phone: also replace its VISIBLE text wherever it appears with any spacing/dashes
if tels:
    d=re.sub(r'\D','',tels[0])
    if len(d)>=7:
        sep=r'[\s\- ]*'.join(map(re.escape,d))
        body=re.sub(r'>\s*\+?\s*'+sep+r'\s*<','><?= htmlspecialchars($vcard["phone"] ?? "") ?><',body)
# ANY leftover demo emails/phones (duplicate slots) -> alternate bindings; JS hides empty rows
for a0 in mails:
    body=body.replace('mailto:'+a0,'mailto:<?= htmlspecialchars($vcard["alternate_email"] ?? "") ?>')
    body=re.sub(r'>\s*'+re.escape(a0)+r'\s*<','><?= htmlspecialchars($vcard["alternate_email"] ?? "") ?><',body)
for t0 in tels:
    body=body.replace('tel:'+t0,'tel:<?= htmlspecialchars($vcard["alternate_phone"] ?? "") ?>')
    body=re.sub(r'>\s*'+re.escape(t0)+r'\s*<','><?= htmlspecialchars($vcard["alternate_phone"] ?? "") ?><',body)
# DOB demo text -> dynamic dob (row hidden by JS when empty)
body,ndob=re.subn(r'>\s*\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?,?\s+\d{4}\s*<','><?= !empty($vcard["dob"]) ? htmlspecialchars(date("jS F, Y", strtotime($vcard["dob"]))) : "" ?><',body)
print('dob',ndob)
# maps links -> dynamic location URL
body=re.sub(r'href=(["\']?)https?://[^"\'>\s]*(?:google\.[a-z.]+/maps|maps\.app\.goo\.gl|goo\.gl/maps)[^"\'>\s]*\1','href="<?= htmlspecialchars($locationUrl) ?>"',body)

# ---- avatar ----
body=re.sub(r'(<div class="[^"]*card-img[^"]*"[^>]*>\s*<img )src=("?)[^"\'> ]*\2',r'\1src="<?= $profileImg ?>"',body,count=1)
# ---- banner / cover (image OR youtube/instagram/video) — replace whole banner-img div ----
COVER_PHP=('<?php $cvType=$vcard["cover_type"]??"image";$cvVal=$vcard["cover_image"]??"";'
'$isVid=($cvType==="video")||preg_match("#youtube\\.com|youtu\\.be|instagram\\.com|\\.mp4#i",$cvVal);'
'if($isVid&&!empty($cvVal)){'
'if(preg_match("#(?:youtube\\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\\.be/)([^\\"&?/\\s]{11})#i",$cvVal,$mm)){$yt=$mm[1];'
'echo "<iframe style=\\"width:100%;height:100%;display:block;border:none;\\" src=\\"https://www.youtube.com/embed/".$yt."?autoplay=1&mute=1&loop=1&playlist=".$yt."&controls=0&showinfo=0&rel=0&playsinline=1\\" allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\\" allowfullscreen></iframe>";}'
'elseif(stripos($cvVal,"instagram.com")!==false){echo "<iframe style=\\"width:100%;height:100%;display:block;border:none;\\" src=\\"".htmlspecialchars(rtrim($cvVal,"/")."/embed")."\\" allowtransparency=\\"true\\"></iframe>";}'
'else{echo "<video src=\\"".htmlspecialchars(imgUrl($cvVal))."\\" autoplay loop muted playsinline style=\\"width:100%;height:100%;object-fit:cover;display:block;\\"></video>";}'
'}else{echo "<img src=\\"".htmlspecialchars($coverImg)."\\" alt=\\"".htmlspecialchars($fullName)."\\" style=\\"width:100%;height:100%;object-fit:cover;display:block;\\">";} ?>')
BANNER=('<div class="banner-img" style="position:relative;overflow:hidden;height:315px;">'+COVER_PHP+
'<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5));"></div></div>')
SECTION='<div class="banner-section position-relative w-100">'+BANNER+'</div>'
# Layered so EVERY template gets a cover, regardless of original markup:
# 1) whole banner-section (school: banner-section>youtube-link)
body,ok=balanced_replace(body,r'<div class=["\']?[^>"\']*banner-section[^>"\']*["\']?[^>]*>',SECTION,max_span=12000)
how='section'
if not ok:  # 2) banner-img div (realEstate/CEOCXO: banner-img>youtube-link or img)
    body,ok=balanced_replace(body,r'<div class=["\']?[^>"\']*banner-img[^>"\']*["\']?[^>]*>',BANNER,max_span=8000);how='img-div'
if not ok:  # 3) banner-img as a class on the <img> itself (programmer)
    body,n=re.subn(r'<img [^>]*class=["\'][^"\']*banner-img[^"\']*["\'][^>]*>',lambda m:BANNER,body,count=1);ok=bool(n);how='img-tag'
if not ok:  # 4) template has no banner at all (flowerGarden) — inject one at the top
    body=SECTION+body;ok=True;how='injected'
print('banner',ok,how)

# ---- social ----
soc=('<?php foreach ($socialLinks as $s): $__sp=strtolower($s["platform"] ?? ""); $__svg=$socialSvgs[$__sp] ?? $socialSvgs["globe"]; ?>'
'<a href="<?= htmlspecialchars($s["url"]) ?>" target="_blank" rel="noopener" class="social-icon"><?= $__svg ?></a>'
'<?php endforeach; ?>')
def social_inner_replace(s, loop):
    """Replace the INNER html of the first social container (any known class,
    on div/section/ul/nav/aside) with the dynamic loop, keeping the container's
    own open/close tags + styling."""
    m=re.search(r'<(div|section|ul|nav|aside)[^>]*class="[^"]*(?:social-icons|social-icon|social-media|social-links|social-section|socials|social-media-icon|social-media-section|social-list)[^"]*"[^>]*>',s,re.I)
    if not m: return s,False
    tag=m.group(1).lower()
    depth=0
    for t in re.finditer(r'<'+tag+r'\b|</'+tag+r'>', s[m.start():], re.I):
        depth+=1 if t.group(0).lower().startswith('<'+tag) else -1
        if depth==0:
            inner_end=m.start()+t.start()
            return s[:m.end()]+loop+s[inner_end:],True
    return s,False
body,soc_ok=social_inner_replace(body,soc)
print('social',soc_ok)

# ---- sliders (balanced inner replace) ----
PROD='<div class="product-slider"><?php foreach ((isset($__pr)?$__pr:($products ?? [])) as $p): $pi=!empty($p["image"])?imgUrl($p["image"]):"'+COVER+'"; ?><div class="px-2"><div class="product-card card"><div class="product-img card-img"><img src="<?= htmlspecialchars($pi) ?>" class="w-100 h-100 object-fit-cover" loading="lazy"></div><div class="product-desc card-body d-flex flex-column align-items-center justify-content-between"><div class="product-title"><h3 class="text-dark text-center"><?= htmlspecialchars($p["name"] ?? "") ?></h3></div><?php if(isset($p["price"]) && $p["price"]!==""): ?><div class="product-amount"><span>₹ <?= htmlspecialchars($p["price"]) ?></span></div><?php endif; ?></div></div></div><?php endforeach; ?></div>'
GAL='<div class="gallery-slider"><?php foreach ((isset($__ga)?$__ga:($galleries ?? [])) as $g): foreach (($g["images"] ?? []) as $im): $gi=imgUrl($im["image_url"] ?? ($im["image"] ?? "")); ?><div class="px-2"><div class="gallery-img-wrapper"><div class="gallery-img" style="background-image:url(\'<?= htmlspecialchars($gi) ?>\');background-size:cover;background-position:center;height:280px;border-radius:12px;"></div></div></div><?php endforeach; endforeach; ?></div>'
TES='<div class="testimonial-slider"><?php foreach ((isset($__te)?$__te:($testimonials ?? [])) as $t): ?><div class="px-2"><div class="testimonial-card p-0"><div class="card-body text-center position-relative"><div class="text-center"><p class="text-gray mb-0">“<?= htmlspecialchars($t["message"] ?? "") ?>”</p></div></div><div class="d-flex flex-column align-items-center justify-content-center gap-2 profile-desc"><?php if(!empty($t["image"])): ?><div class="card-img" style="width:60px;height:60px;border-radius:50%;overflow:hidden;"><img src="<?= htmlspecialchars(imgUrl($t["image"])) ?>" class="w-100 h-100 object-fit-cover"></div><?php endif; ?><h5 class="fw-6 mb-0"><?= htmlspecialchars($t["author_name"] ?? ($t["author"] ?? "")) ?></h5></div></div></div><?php endforeach; ?></div>'
for opn,new,lbl in [(r'<div class="[^"]*product-slider[^"]*"[^>]*>',PROD,'prod'),
                    (r'<div class="[^"]*gallery-slider[^"]*"[^>]*>',GAL,'gal'),
                    (r'<div class="[^"]*testimonial-slider[^"]*"[^>]*>',TES,'tes')]:
    body,ok=balanced_replace(body,opn,new);print(lbl,ok)

# ---- services + business-hours: replace whole section (keep template classes) ----
SVC=('<div class="our-services-section pt-50 position-relative"><div class="section-heading"><h2>Our Services</h2></div>'
'<div class="services"><div class="px-30"><div class="row"><?php foreach ((isset($__sv)?$__sv:($services ?? [])) as $sv): $svimg=!empty($sv["image"])?imgUrl($sv["image"]):"'+COVER+'"; ?>'
'<div class="col-sm-6 mb-sm-0 mb-40 p-3"><div class="card-wrapper h-100"><a href="javascript:void(0)" class="text-decoration-none"><div class="service-card card h-100"><div class="card-img mx-auto"><img src="<?= htmlspecialchars($svimg) ?>" alt="<?= htmlspecialchars($sv["name"] ?? "") ?>" class="w-100 h-100 object-fit-cover" loading="lazy"></div><div class="card-body text-center"><h3 class="card-title text-primary"><?= htmlspecialchars($sv["name"] ?? "") ?></h3><?php if(!empty($sv["description"])): ?><p class="mb-0 text-gray"><?= htmlspecialchars($sv["description"]) ?></p><?php endif; ?></div></div></a></div></div>'
'<?php endforeach; ?></div></div></div></div>')
BH=('<div class="business-hour-section pt-50 px-30 position-relative"><div class="section-heading"><h2>Business Hours</h2></div>'
'<div class="px-30"><div class="row justify-content-center"><?php foreach ((isset($__bh)?$__bh:($businessHours ?? [])) as $bh): ?>'
'<div class="col-sm-6"><div class="business-hour-card d-flex gap-2 align-items-center mb-3"><div class="time-icon"><i class="bi bi-clock fs-3"></i></div><div class="d-flex flex-column align-items-start"><span class="fs-14 text-gray lh-1 fw-5"><?= htmlspecialchars(ucfirst(strtolower($bh["day_name"] ?? ""))) ?></span><span class="fs-16 fw-5"><?= !empty($bh["is_open"]) ? htmlspecialchars(trim(($bh["open_time"] ?? "")." - ".($bh["close_time"] ?? ""))) : "Closed" ?></span></div></div></div>'
'<?php endforeach; ?></div></div></div>')
SVC='<?php if(!empty($services)): ?>'+SVC+'<?php endif; ?>'
BH='<?php if(!empty($businessHours)): ?>'+BH+'<?php endif; ?>'
body,ok=balanced_replace(body,r'<div class=["\']?[^>"\']*(?:our-)?services?-(?:section|area)[^>"\']*["\']?[^>]*>',SVC);print('svc',ok)
if not ok:
    # section-based: <section class="services-section"> (photographer/portfolio)
    m=re.search(r'<section[^>]*class="[^"]*(?:our-)?services?-(?:section|area)[^"]*"[^>]*>',body,re.I)
    if m:
        depth=0
        for t in re.finditer(r'<section\b|</section>',body[m.start():],re.I):
            depth+=1 if t.group(0).lower().startswith('<section') else -1
            if depth==0:
                end=m.start()+t.end()
                if end-m.start()<40000: body=body[:m.start()]+SVC+body[end:]; ok=True
                break
    print('svc-section',ok)
if not ok:
    # structure-based fallback: templates that place `service-card`s directly in a .row
    # with no services-section wrapper. Replace that row's inner with a dynamic card loop.
    ITEM=('<div class="col-sm-6 col-6 mb-4 px-2"><div class="card service-card h-100">'
    '<div class="service-img card-img" style="overflow:hidden;border-radius:12px 12px 0 0"><img src="<?= htmlspecialchars($svimg) ?>" alt="<?= htmlspecialchars($sv["name"] ?? "") ?>" class="w-100 object-fit-cover" style="height:170px" loading="lazy"></div>'
    '<div class="card-body text-center p-3"><h3 class="card-title fs-6 fw-6"><?= htmlspecialchars($sv["name"] ?? "") ?></h3>'
    '<?php if(!empty($sv["description"])): ?><p class="card-text small mb-0 text-gray"><?= htmlspecialchars($sv["description"]) ?></p><?php endif; ?></div></div></div>')
    SLOOP=('<?php if(!empty($services)): ?><?php foreach ((isset($__sv)?$__sv:($services ?? [])) as $sv): $svimg=!empty($sv["image"])?imgUrl($sv["image"]):"'+COVER+'"; ?>'+ITEM+'<?php endforeach; ?><?php endif; ?>')
    fc=re.search(r'class="[^"]*\bservice-card\b',body)
    if fc:
        rows=list(re.finditer(r'<div[^>]*class="[^"]*\brow\b[^"]*"[^>]*>',body[:fc.start()],re.I))
        if rows:
            rm=rows[-1]; depth=0
            for t in re.finditer(r'<div\b|</div>',body[rm.start():]):
                depth+=1 if t.group(0)=='<div' else -1
                if depth==0:
                    inner_end=rm.start()+t.start()
                    if inner_end-rm.end()<40000:
                        body=body[:rm.end()]+SLOOP+body[inner_end:]; ok=True
                    break
    print('svc-fallback',ok)
body,ok=balanced_replace(body,r'<div class=["\']?[^>"\']*business-hour(?!-card)[^>"\']*["\']?[^>]*>',BH);print('bh',ok)

# ---- suppress + features ----
supp='<?php $__sv=$services;$__pr=$products;$__ga=$galleries;$__te=$testimonials;$__bh=$businessHours;$services=[];$products=[];$galleries=[];$testimonials=[];$businessHours=[]; ?>'
slick=('<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>'
'<script src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>'
'<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css">'
'<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css">'
'<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">'
'<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>'
'<script>function tfInit(){if(typeof jQuery==="undefined"||!jQuery.fn||!jQuery.fn.slick){return setTimeout(tfInit,120);}jQuery(function($){'
# hide empty data sections (heading + content) when there are no records
'$(".product-slider,.gallery-slider,.testimonial-slider,.blog-slider").each(function(){'
'if($(this).children().length===0){var s=$(this).closest("[class*=section]");if(s.length&&!/main|wrapper|content|page|body/i.test(s.attr("class")||"")&&s.find("[class*=section]").length===0){s.hide();}$(this).hide();}});'
# hide instagram-feed sections that have no items wired
'$("[class*=instagram],[class*=insta-feed],[class*=insta-section],[class*=insta-feed-section]").each(function(){if($(this).find("img,iframe,.slick-slide,.insta-item,a[href*=instagram]").length===0){var s=$(this).closest("[class*=section]");if(s.length&&!/main|wrapper|content|page|body/i.test(s.attr("class")||"")&&s.find("[class*=section]").length===0){s.hide();}$(this).hide();}});'
# hide empty BEM data blocks (e.g. .vcard-one__gallery / __products / __testimonial): the
# wrapper stays even when its slider is empty, so hide the wrapper when its slider has no items
'$("[class*=__gallery],[class*=__product],[class*=__testimonial]").each(function(){var sl=$(this).find(".gallery-slider,.product-slider,.testimonial-slider").first();if(sl.length&&sl.children().length===0){$(this).hide();}});'
# hide contact rows whose bound value is empty (alternate email/phone, dob, ...)
'$("a").each(function(){var h=$(this).attr("href")||"";var tx=$(this).text().replace(/\\s+/g,"");if((h==="mailto:"||h==="tel:")&&tx===""){$(this).closest(".contact-box,.contact-item,li,.col-sm-6,.col-md-6,.col-6,.col-12,.col").hide();}});'
'$("[class*=contact-box],[class*=contact-item]").each(function(){if($(this).text().replace(/\\s+/g,"")===""){$(this).hide();}});'
# inquiry submit with optional file attachment (multipart)
'window.tfSubmitInquiry=async function(ev){ev.preventDefault();var f=ev.target;var b=f.querySelector("button[type=submit]");var fd=new FormData(f);if(b)b.disabled=true;try{var r=await fetch("/inquiry-submit.php",{method:"POST",body:fd});var j=await r.json();if(j.success){if(window.showToast)showToast("Message sent!","success");f.reset();}else{if(window.showToast)showToast(j.message||"Failed","error");}}catch(e){if(window.showToast)showToast("Connection error","error");}finally{if(b)b.disabled=false;}};'
'function ini(s,o){var $s=$(s);if(!$s.length||$s.hasClass("slick-initialized"))return;$s.slick(o);}'
'ini(".product-slider",{slidesToShow:2,arrows:false,dots:true,infinite:true,autoplay:true,autoplaySpeed:2500,responsive:[{breakpoint:576,settings:{slidesToShow:1}}]});'
'ini(".gallery-slider",{slidesToShow:2,arrows:false,dots:true,infinite:true,autoplay:true,autoplaySpeed:2500,responsive:[{breakpoint:576,settings:{slidesToShow:1}}]});'
'ini(".testimonial-slider",{slidesToShow:1,arrows:false,dots:true,infinite:true,autoplay:true,autoplaySpeed:4000});'
# make the template's own appointment date field selectable
'if(window.flatpickr){flatpickr("#pickUpDate",{minDate:"today",dateFormat:"Y-m-d"});flatpickr(".flatpickr-input",{minDate:"today",dateFormat:"Y-m-d"});}'
'});}tfInit();</script>')

CDN=('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">'
'<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">'
'<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">')
# Make the template's themed page background clearly visible (some use a low-alpha
# body color that washes out to near-white). Extract it and apply opaque on html+body.
PAGEBG=''
mbg=re.search(r'body\s*\{[^}]*?background(?:-color)?\s*:\s*(#[0-9a-fA-F]{6,8}|rgba?\([\d.,\s%]+\))[^}]*?!important',head_styles,re.I)
if mbg:
    c=mbg.group(1).strip()
    # The themed page background (the colored area around/behind the white card) must
    # stay visible. Strip alpha so a low-opacity color doesn't wash out to white.
    m8=re.match(r'#([0-9a-fA-F]{6})[0-9a-fA-F]{2}$',c)
    if m8: c='#'+m8.group(1)
    mr=re.match(r'rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,[^)]+)?\)',c)
    if mr: c=f'rgb({mr.group(1)},{mr.group(2)},{mr.group(3)})'
    PAGEBG=f'html,body{{background-color:{c}!important;}}'
FIX=('<style>html,body{overflow-y:auto!important;height:auto!important;min-height:100%!important;position:relative!important;}'
+PAGEBG+
# Keep the card constrained on desktop WITHOUT overriding the template's own
# inner layout (so absolutely-positioned vectors/backgrounds stay aligned).
'.container{max-width:540px!important;margin-left:auto!important;margin-right:auto!important;}'
# "Add to Contact" bar is position:fixed;left:0;width:100% in the source -> center it within the card
'.add-to-contact-btn,.add-to-contact-section,[class*=add-to-contact]{left:50%!important;right:auto!important;transform:translateX(-50%)!important;max-width:540px!important;width:100%!important;}'
'.blog-section,.blog-card,[class*=blog-],[class*=__blog],[class*=blog-section]{display:none!important;}'
'.product-slider,.gallery-slider,.testimonial-slider{overflow:hidden;}'
'.product-slider .slick-slide,.gallery-slider .slick-slide{padding:0 8px;box-sizing:border-box;}'
# install-app / newsletter popups off
'.pwa-support,.news-modal,#newsLatter-content{display:none!important}'
# social icons always visible in the accent color
'.social-icon i,.social-icon svg,.social-icon .icon{color:#'+PRIMARY.lstrip('#')+'!important;fill:#'+PRIMARY.lstrip('#')+'!important;opacity:1!important}'
# injected section headings centered + accent colored
'.our-services-section .section-heading,.business-hour-section .section-heading{text-align:center!important}'
'.our-services-section .section-heading h2,.business-hour-section .section-heading h2,.qr-code-section .section-heading h2{color:#'+PRIMARY.lstrip('#')+'!important}'
# self-contained business-hour card styling (works on light + dark templates)
'.business-hour-section .business-hour-card{background:rgba(127,127,127,.14)!important;border:1px solid rgba(127,127,127,.3)!important;border-radius:10px!important;padding:10px!important;margin-bottom:10px!important}'
'.business-hour-section .business-hour-card span,.business-hour-section .business-hour-card .time-icon{color:#'+PRIMARY.lstrip('#')+'!important}'
# QR section text always visible
'.qr-code-section p,.qr-code-section span,.qr-code-section h4,.qr-code-section h5{color:#'+PRIMARY.lstrip('#')+'!important}'
+EXTRA_CSS.get(SLUG,'')+'</style>')

PCOL=PRIMARY.lstrip('#')
php_header=f'''<?php
/** Tapify vCard Template: {VID} — auto-generated from {FOLDER} (hosted assets). */
$cardUrl='https://app.tapify.co.in/'.($vcard['url_alias'] ?? $vcardId);
$waPhone=preg_replace('/\\D/','',$vcard['phone'] ?? '');
$locationUrl=!empty($vcard['location_url'])?$vcard['location_url']:'https://maps.google.com/?q='.urlencode($vcard['location'] ?? '');
$profileImg=!empty($vcard['profile_image'])?imgUrl($vcard['profile_image']):'https://ui-avatars.com/api/?name='.urlencode($fullName).'&size=200&background={PCOL}&color=ffffff';
$coverImg=!empty($vcard['cover_image'])?imgUrl($vcard['cover_image']):'{COVER}';
$qrUrl='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='.urlencode($cardUrl);
$platformIcons=['linkedin-in'=>'fa-linkedin-in','linkedin'=>'fa-linkedin-in','instagram'=>'fa-instagram','x-twitter'=>'fa-x-twitter','twitter'=>'fa-x-twitter','facebook'=>'fa-facebook-f','facebook-f'=>'fa-facebook-f','whatsapp'=>'fa-whatsapp','youtube'=>'fa-youtube','spotify'=>'fa-spotify','github'=>'fa-github','tiktok'=>'fa-tiktok','pinterest'=>'fa-pinterest-p','behance'=>'fa-behance','dribbble'=>'fa-dribbble','telegram'=>'fa-telegram','globe'=>'fa-globe'];
$socialSvgs=['facebook'=>'<svg viewBox="0 0 320 512" fill="currentColor" width="22" height="22" style="display:inline-block;vertical-align:middle"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>','facebook-f'=>'<svg viewBox="0 0 320 512" fill="currentColor" width="22" height="22" style="display:inline-block;vertical-align:middle"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>','instagram'=>'<svg viewBox="0 0 448 512" fill="currentColor" width="22" height="22" style="display:inline-block;vertical-align:middle"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>','whatsapp'=>'<svg viewBox="0 0 448 512" fill="currentColor" width="22" height="22" style="display:inline-block;vertical-align:middle"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.2-157zM223.9 438.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.5-186.6 184.5zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>','linkedin'=>'<svg viewBox="0 0 448 512" fill="currentColor" width="22" height="22" style="display:inline-block;vertical-align:middle"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>','linkedin-in'=>'<svg viewBox="0 0 448 512" fill="currentColor" width="22" height="22" style="display:inline-block;vertical-align:middle"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>','youtube'=>'<svg viewBox="0 0 576 512" fill="currentColor" width="22" height="22" style="display:inline-block;vertical-align:middle"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>','x-twitter'=>'<svg viewBox="0 0 512 512" fill="currentColor" width="22" height="22" style="display:inline-block;vertical-align:middle"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>','twitter'=>'<svg viewBox="0 0 512 512" fill="currentColor" width="22" height="22" style="display:inline-block;vertical-align:middle"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>','globe'=>'<svg viewBox="0 0 512 512" fill="currentColor" width="22" height="22" style="display:inline-block;vertical-align:middle"><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6 78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7 10.5-23.6 22.2-40.7 33.5-51.5C260.5 3.2 269.8 0 288 0s27.5 3.2 44.3 13.8c11.3 10.8 23 27.9 33.5 51.5 11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4 165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 363.5 0 342.1 0 320s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6-10.5 23.6-22.2 40.7-33.5 51.5C267.5 508.8 258.2 512 240 512l-16 0c-18.2 0-27.5-3.2-44.3-13.8-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6 25.5-34.2 45.3-87.7 55.3-151.6H493.4z"/></svg>'];
?>
'''

out=(php_header+'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
'<title><?= htmlspecialchars($fullName) ?></title>'
'<link rel="icon" href="<?= !empty($vcard[\'favicon_image\'])?imgUrl($vcard[\'favicon_image\']):\'/images/tapify-logo-green.png\' ?>">'
+CDN+gfonts+'<style>'+head_styles.replace('<style>','').replace('</style>','')+'</style>'+FIX+
'<?php if(!empty($vcard["custom_css"])): ?><style><?= $vcard["custom_css"] ?></style><?php endif; ?>'
'</head><body>'+body+slick+
'<?php if(!empty($vcard["custom_js"])): ?><script><?= $vcard["custom_js"] ?></script><?php endif; ?>'
'<?php include __DIR__ . "/_shared-scripts.php"; ?></body></html>')
# final pass: repair malformed closing tags at the body/script boundary (</div<script -> </div><script)
out=re.sub(r'</([a-zA-Z][\w-]*)(?=<[a-zA-Z/])', r'</\1>', out)
open(OUT,'w',encoding='utf-8').write(out)
print('WROTE',VID,len(out)//1024,'KB | base64 left:',len(re.findall(r'base64,[A-Za-z0-9+/=]{80,}',out)))
