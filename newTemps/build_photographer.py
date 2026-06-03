import io,sys,re,os,hashlib,base64 as b64
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')
SRC_DIR='D:/Print World/tapify/tapify-frontend/newTemps/imagesPhotographer'
ASSET_DIR='D:/Print World/tapify/tapify-backend/images/templates/photographer'
ASSET_URL='/images/templates/photographer'
OUT='D:/Print World/tapify/tapify-backend/templates/vcard44.php'
os.makedirs(ASSET_DIR,exist_ok=True)
src=[f for f in os.listdir(SRC_DIR) if f.endswith('.html') and 'clean' not in f.lower()][0]
h=open(os.path.join(SRC_DIR,src),encoding='utf-8',errors='replace').read()
h=re.sub(r'<!--\s*Page saved with SingleFile.*?-->','',h,flags=re.DOTALL)

# extract base64 images -> host
EXT={'image/webp':'webp','image/png':'png','image/jpeg':'jpg','image/jpg':'jpg','image/gif':'gif'}
seen={}; idx=[0]
def repl(m):
    mime,data=m.group(1),m.group(2)
    try: raw=b64.b64decode(data+'='*(-len(data)%4))
    except: return m.group(0)
    md5=hashlib.md5(raw).hexdigest()
    if md5 in seen: return seen[md5]
    ext=EXT.get(mime,'bin'); fn=f'p-{idx[0]:03d}.{ext}'; idx[0]+=1
    open(os.path.join(ASSET_DIR,fn),'wb').write(raw); seen[md5]=ASSET_URL+'/'+fn
    return seen[md5]
h=re.sub(r'data:(image/[a-z+]+);base64,([A-Za-z0-9+/=]+)',repl,h)
print('images hosted:',idx[0])
# strip oversized gif/video + fonts
h=re.sub(r'data:image/gif;base64,[A-Za-z0-9+/=]+','',h)
h=re.sub(r'@font-face\s*\{[^}]*\}','',h)
h=re.sub(r'data:(?:font|application)/[^;]+;base64,[A-Za-z0-9+/=]+','',h)

head_styles='\n'.join(re.findall(r'<style[^>]*>.*?</style>',h,flags=re.DOTALL))
bs=re.search(r'<body[^>]*>',h,re.I); body=h[bs.end():h.lower().rfind('</html>')]
body=re.sub(r'<script.*?</script>','',body,flags=re.DOTALL|re.I)
body=re.sub(r'<iframe[^>]*youtube[\s\S]*?</iframe>','',body,flags=re.I)
body=re.sub(r'<link[^>]*>','',body,flags=re.I)

# --- dynamic single fields ---
body=body.replace('Ansel Adams','<?= htmlspecialchars($fullName) ?>')
# occupation: photo-title <p>
body=re.sub(r'(photo-title[^>]*>)\s*[^<]*',r'\1<?= htmlspecialchars($vcard["occupation"] ?? "") ?>',body,count=1)
# description: first profile-desc p with long text
body=re.sub(r'(profile-desc[^>]*>[\s\S]*?<p[^>]*>)\s*[^<]{20,}',r'\1<?= nl2br(htmlspecialchars($vcard["description"] ?? "")) ?>',body,count=1)
# emails/phones
mails=re.findall(r'mailto:([^\s"\'>]+)',body)
if mails:
    body=body.replace('mailto:'+mails[0],'mailto:<?= htmlspecialchars($vcard["email"] ?? "") ?>',1)
    body=re.sub(r'>\s*'+re.escape(mails[0])+r'\s*<','><?= htmlspecialchars($vcard["email"] ?? "") ?><',body,count=1)
tels=list(dict.fromkeys(re.findall(r'tel:(\+?[0-9][0-9 ]{5,}[0-9])',body)))
if tels:
    body=body.replace('tel:'+tels[0],'tel:<?= htmlspecialchars($vcard["phone"] ?? "") ?>',1)
    body=re.sub(r'>\s*'+re.escape(tels[0])+r'\s*<','><?= htmlspecialchars($vcard["phone"] ?? "") ?><',body,count=1)
# avatar (profile card-img img) + cover banner
body=re.sub(r'(<div class="card-img[^"]*"[^>]*>\s*<img )src="[^"]*"',r'\1src="<?= $profileImg ?>"',body,count=1)

# --- social foreach (social-icons) ---
soc=('<?php foreach ($socialLinks as $s): $ic=$platformIcons[$s["platform"]] ?? "fa-globe"; ?>'
'<a href="<?= htmlspecialchars($s["url"]) ?>" target="_blank" rel="noopener"><i class="fab <?= $ic ?> fa-lg"></i></a>'
'<?php endforeach; ?>')
body=re.sub(r'(<div class="social-icons[^"]*"[^>]*>).*?(</div>)',r'\1'+soc+r'\2',body,count=1,flags=re.DOTALL)

# --- gallery foreach (image_url) — replace gallery slider content ---
def match_div(s,start):
    depth=0
    for m in re.finditer(r'<div\b|</div>',s[start:]):
        if m.group(0)=='</div>': depth-=1;
        else: depth+=1
        if depth==0: return start+m.end()
    return -1
# rebuild gallery section if present
mg=re.search(r'<div class="gallery-section[^"]*">',body)
if mg:
    # bound by next section
    nxt=re.search(r'<div class="[a-z-]+-section[^"]*">',body[mg.end():])
    end=mg.end()+nxt.start() if nxt else len(body)
    head=re.search(r'(<h2>\s*[^<]+</h2>)',body[mg.start():end])
    galblock=('<div class="gallery-section pt-50 position-relative"><div class="section-heading"><h2>Gallery</h2></div>'
    '<div class="px-20"><div class="gallery-slider">'
    '<?php foreach (($galleries ?? []) as $g): foreach (($g["images"] ?? []) as $im): $gi=imgUrl($im["image_url"] ?? ($im["image"] ?? "")); ?>'
    '<div class="px-2"><div class="gallery-img" style="background-image:url(\'<?= htmlspecialchars($gi) ?>\');background-size:cover;background-position:center;height:280px;border-radius:12px;"></div></div>'
    '<?php endforeach; endforeach; ?></div></div></div>')
    body=body[:mg.start()]+galblock+body[end:]

php_header='''<?php
$cardUrl='https://tapify-backend-production.up.railway.app/'.($vcard['url_alias'] ?? $vcardId);
$waPhone=preg_replace('/\\D/','',$vcard['phone'] ?? '');
$profileImg=!empty($vcard['profile_image'])?imgUrl($vcard['profile_image']):'https://ui-avatars.com/api/?name='.urlencode($fullName).'&size=200&background=222&color=fff';
$coverImg=!empty($vcard['cover_image'])?imgUrl($vcard['cover_image']):'/images/templates/photographer/p-000.jpg';
$qrUrl='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='.urlencode($cardUrl);
$platformIcons=['linkedin-in'=>'fa-linkedin-in','linkedin'=>'fa-linkedin-in','instagram'=>'fa-instagram','x-twitter'=>'fa-x-twitter','twitter'=>'fa-x-twitter','facebook'=>'fa-facebook-f','facebook-f'=>'fa-facebook-f','whatsapp'=>'fa-whatsapp','youtube'=>'fa-youtube','spotify'=>'fa-spotify','github'=>'fa-github','tiktok'=>'fa-tiktok','pinterest'=>'fa-pinterest-p','behance'=>'fa-behance','dribbble'=>'fa-dribbble','telegram'=>'fa-telegram','globe'=>'fa-globe'];
?>
'''
CDN=('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">'
'<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">'
'<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Oswald:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">')
FIXCSS=('<style>html,body{overflow-y:auto!important;height:auto!important;position:relative!important;}'
'body>*{max-width:560px!important;margin-left:auto!important;margin-right:auto!important;box-sizing:border-box!important;}'
'.container{max-width:560px!important;}'
'.add-to-contact-section,[class*=add-to-contact]{left:50%!important;right:auto!important;transform:translateX(-50%)!important;max-width:560px!important;width:100%!important;}'
'.blog-section,.blog-card{display:none!important;}</style>')
# suppress _features galleries dup (we render gallery ourselves), keep _features for appointment/inquiry/products/testimonials(none)
supp='<?php $galleries=[]; ?>'
body=re.sub(r'(<?php include __DIR__ . "/_features.php"; ?>)','',body)  # remove any (none expected)
out=(php_header+'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
'<title><?= htmlspecialchars($fullName) ?></title>'
'<link rel="icon" href="<?= !empty($vcard[\'favicon_image\'])?imgUrl($vcard[\'favicon_image\']):\'/images/tapify-logo-green.png\' ?>">'
+CDN+'<style>'+head_styles.replace('<style>','').replace('</style>','')+'</style>'+FIXCSS+
'<?php if(!empty($vcard["custom_css"])): ?><style><?= $vcard["custom_css"] ?></style><?php endif; ?>'
'</head><body>'+body+
supp+'<?php include __DIR__ . "/_features.php"; ?>'
'<?php if(!empty($vcard["custom_js"])): ?><script><?= $vcard["custom_js"] ?></script><?php endif; ?>'
'<?php include __DIR__ . "/_shared-scripts.php"; ?></body></html>')
open(OUT,'w',encoding='utf-8').write(out)
print('wrote vcard44.php',len(out)//1024,'KB | name dynamic:', 'Ansel' not in out, '| social loop:', 'foreach ($socialLinks' in out, '| gallery image_url:', 'image_url' in out)
