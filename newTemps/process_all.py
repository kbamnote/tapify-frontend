import io, sys, re, os, hashlib, base64 as b64
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

TEMPLATES = [
    ('flowerGarden',             'Flower Garden',          'https://images.unsplash.com/photo-1490750967868-88df5691cc51?w=800&q=80'),
    ('imagesMusician',           'Musician',               'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80'),
    ('imagesPhotographer',       'Photographer',           'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80'),
    ('imagesInteriorDesigner',   'Interior Designer',      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80'),
    ('imagesHandyman',           'Handyman Services',      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80'),
    ('imagestaxiservice',        'Taxi Service',           'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80'),
    ('imagesMarriage',           'Marriage Bureau',        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80'),
    ('imagesPetClinic',          'Pet Clinic',             'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80'),
    ('imagesPetShop',            'Pet Shop',               'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80'),
    ('imagesRetailEcommerce',    'Retailer',               'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80'),
    ('imagesSocialServices',     'Social Services',        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80'),
    ('imagesSchoolTemplates',    'School',                 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80'),
    ('imagesSocialMedia',        'Social Media',           'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'),
    ('imagesDynamicVCard',       'Dynamic vCard',          'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80'),
    ('imagesConsultingServices', 'Business Consultant',    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80'),
    ('imagesCulinaryFoodServices','Food Services',         'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'),
    ('imagesFashionBeauty',      'Makeup Artist',          'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80'),
    ('imagesCEOCXO',             'Chief Executive Officer','https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80'),
    ('imagesProgrammer',         'Developer',              'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80'),
    ('imagesSalon',              'Stylish Salon',          'https://images.unsplash.com/photo-1560066984-138daaa0ede9?w=800&q=80'),
]

POOL = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=600&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
]
PORTRAITS = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
]

CDN = """<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700&family=Montserrat:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Oswald:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css" rel="stylesheet">"""

FIX_CSS = """<style>
html,body{overflow:visible!important;overflow-y:auto!important;position:relative!important;height:auto!important;}
body>*{max-width:560px!important;margin-left:auto!important;margin-right:auto!important;box-sizing:border-box!important;}
body>.position-fixed{max-width:100%!important;}
.container{max-width:560px!important;padding-left:0!important;padding-right:0!important;}
.slick-list{overflow:hidden!important;}
.slick-slider{max-width:100%!important;}
.gallery-slider .slick-slide,.gallery-slider .slick-slide.slick-cloned,
.testimonial-slider .slick-slide,.testimonial-slider .slick-slide.slick-cloned{width:520px!important;max-width:520px!important;}
.product-slider .slick-slide,.product-slider .slick-slide.slick-cloned{width:260px!important;max-width:260px!important;}
.gallery-slider .slick-track,.testimonial-slider .slick-track,.product-slider .slick-track{min-width:100%!important;}
</style>"""

JS = """<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
<script>
$(function(){
  function initSliders(){
    $(".slick-initialized").each(function(){try{$(this).slick("unslick");}catch(e){}});
    $(".gallery-slider,.testimonial-slider").each(function(){
      try{$(this).slick({dots:true,arrows:true,autoplay:true,autoplaySpeed:3000,adaptiveHeight:false,infinite:true,slidesToShow:1,slidesToScroll:1});}catch(e){}
    });
    $(".product-slider").each(function(){
      try{$(this).slick({dots:true,arrows:true,autoplay:true,autoplaySpeed:3000,adaptiveHeight:false,infinite:true,slidesToShow:2,slidesToScroll:2,rows:0});}catch(e){}
    });
    $('[class*="-slider"]:not(.gallery-slider):not(.testimonial-slider):not(.product-slider)').each(function(){
      try{$(this).slick({dots:true,arrows:true,autoplay:true,autoplaySpeed:3000,adaptiveHeight:false,infinite:true});}catch(e){}
    });
    setTimeout(function(){$(".slick-initialized").slick("resize");},50);
  }
  setTimeout(initSliders,200);
});
</script>"""

def clean_css(s):
    s = re.sub(r'@font-face\s*\{[^}]*\}', '', s)
    s = re.sub(r"url\(\s*['\"]?data:[^)]*\)", 'url()', s)
    s = re.sub(r'base64,[A-Za-z0-9+/=]{200,}', '', s)
    return s

BASE = 'D:/Print World/tapify/tapify-frontend/newTemps'

def process(folder, title, cover):
    base = os.path.join(BASE, folder)
    html_files = [f for f in os.listdir(base) if f.endswith('.html') and 'clean' not in f]
    if not html_files:
        return f'SKIP {folder}: no HTML'
    html_path = os.path.join(base, html_files[0])
    img_dirs = [d for d in os.listdir(base) if os.path.isdir(os.path.join(base, d))]
    if not img_dirs:
        return f'SKIP {folder}: no images folder'
    img_dir = os.path.join(base, img_dirs[0])
    img_sub = img_dirs[0]

    actual = {}
    for f in os.listdir(img_dir):
        fp = os.path.join(img_dir, f)
        if os.path.isfile(fp):
            data = open(fp, 'rb').read()
            actual[hashlib.md5(data).hexdigest()] = (f, img_sub)

    h = open(html_path, encoding='utf-8', errors='replace').read()
    all_css = '\n'.join(clean_css(s) for s in re.findall(r'<style[^>]*>(.*?)</style>', h, flags=re.DOTALL))
    bs = re.search(r'<body[^>]*>', h, re.I)
    he = h.lower().rfind('</html>')
    body = h[bs.end(): he if he > 0 else len(h)]
    body = re.sub(r'<script.*?</script>', '', body, flags=re.DOTALL|re.I)
    body = re.sub(r'<iframe.*?</iframe>', '', body, flags=re.DOTALL|re.I)
    body = re.sub(r'<noscript.*?</noscript>', '', body, flags=re.DOTALL|re.I)
    body = re.sub(r'<link[^>]*>', '', body, flags=re.I)
    body = re.sub(r'<div[^>]*class="[^"]*blog[^"]*"[^>]*>.*?</div>\s*</div>\s*</div>', '', body, flags=re.DOTALL|re.I)
    body = re.sub(r'srcset="[^"]*"', '', body)

    idx = [0]
    def replace_b64(m):
        mime, data = m.group(1), m.group(2)
        if 'svg' in mime:
            return m.group(0)
        try:
            decoded = b64.b64decode(data)
            md5 = hashlib.md5(decoded).hexdigest()
            match = actual.get(md5)
            if match:
                fname, idir = match
                is_webp = decoded[:4] == b'RIFF' and decoded[8:12] == b'WEBP'
                ext = os.path.splitext(fname)[1].lower()
                if is_webp and ext not in ('.webp',):
                    wp = os.path.join(img_dir, os.path.splitext(fname)[0] + '.webp')
                    if not os.path.exists(wp):
                        open(wp, 'wb').write(decoded)
                    fname = os.path.splitext(fname)[0] + '.webp'
                return idir + '/' + fname
            else:
                url = POOL[idx[0] % len(POOL)]
                idx[0] += 1
                return url
        except:
            return POOL[0]

    body = re.sub(r'data:(image/[^;]+);base64,([A-Za-z0-9+/=]+)', replace_b64, body)

    # Replace raw single-quoted SVG srcs
    raw_idx = [0]
    result = []
    pos = 0
    while pos < len(body):
        si = body.find("src='data:image/svg+xml,", pos)
        if si == -1:
            result.append(body[pos:])
            break
        result.append(body[pos:si])
        eq = body.find("'", si + len("src='data:image/svg+xml,"))
        ctx = body[max(0, si - 200):si]
        is_port = 'rounded-circle' in ctx or 'author' in ctx
        pool = PORTRAITS if is_port else POOL
        url = pool[raw_idx[0] % len(pool)]
        raw_idx[0] += 1
        result.append(f'src="{url}"')
        pos = eq + 1 if eq != -1 else len(body)
    body = ''.join(result)
    body = re.sub(r'src="data:image/svg\+xml,[^"]*"', f'src="{POOL[0]}"', body)

    # Fix empty banner (cover video stripped)
    bm = re.search(r'class="banner-img[^"]*"[^>]*>[\s\S]*?<div class=youtube-link[^>]*>[\s\S]*?</div>[\s\S]*?</div>', body)
    if bm:
        body = body[:bm.start()] + f'class="banner-img h-auto" style="position:relative;overflow:hidden;height:315px;"><img src="{cover}" alt="{title}" style="width:100%;height:100%;object-fit:cover;display:block;"><div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5));"></div></div>' + body[bm.end():]

    title_m = re.search(r'<title[^>]*>(.*?)</title>', h, re.I|re.DOTALL)
    page_title = title_m.group(1).strip() if title_m else title + ' | Tapify'

    out = f"""<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{page_title}</title>
{CDN}
<style>{all_css}</style>
{FIX_CSS}
</head><body>
{body}
{JS}
</body></html>"""

    out_path = os.path.join(base, 'clean.html')
    open(out_path, 'w', encoding='utf-8').write(out)
    return f'OK  {title:30} {len(out)//1024}KB  matched={len(actual)} imgs'

print('Processing 20 templates...\n')
for folder, title, cover in TEMPLATES:
    print(process(folder, title, cover))
print('\nAll done.')
