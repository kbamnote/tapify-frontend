"""
Bulletproof template cleaner.
Keeps the ORIGINAL html almost entirely intact (all CSS + all base64 images +
all fonts inline) so the result is byte-identical to the source visually.
Only applies 5 structural fixes:
  1. scroll/overflow fix (SingleFile locks body)
  2. 560px width constraint (mobile card)
  3. replace cover-video block with a themed cover image
  4. remove blog sections
  5. re-init slick carousels (gallery/testimonial 1-up, products 2-up)
"""
import io, sys, re, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = 'D:/Print World/tapify/tapify-frontend/newTemps'

TEMPLATES = [
    ('realEstate',                'Real Estate',            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'),
    ('flowerGarden',              'Flower Garden',          'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80'),
    ('imagesMusician',            'Musician',               'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80'),
    ('imagesPhotographer',        'Photographer',           'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80'),
    ('imagesInteriorDesigner',    'Interior Designer',      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80'),
    ('imagesHandyman',            'Handyman Services',      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80'),
    ('imagestaxiservice',         'Taxi Service',           'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80'),
    ('imagesMarriage',            'Marriage Bureau',        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80'),
    ('imagesPetClinic',           'Pet Clinic',             'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80'),
    ('imagesPetShop',             'Pet Shop',               'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80'),
    ('imagesRetailEcommerce',     'Retailer',               'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80'),
    ('imagesSocialServices',      'Social Services',        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80'),
    ('imagesSchoolTemplates',     'School',                 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80'),
    ('imagesSocialMedia',         'Social Media',           'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'),
    ('imagesDynamicVCard',        'Dynamic vCard',          'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80'),
    ('imagesConsultingServices',  'Business Consultant',    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80'),
    ('imagesCulinaryFoodServices','Food Services',          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'),
    ('imagesFashionBeauty',       'Makeup Artist',          'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80'),
    ('imagesCEOCXO',              'Chief Executive Officer','https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80'),
    ('imagesProgrammer',          'Developer',              'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80'),
    ('imagesSalon',               'Stylish Salon',          'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80'),
]

FIX_CSS = """
<style id="tapify-fixes">
html,body{overflow:visible!important;overflow-y:auto!important;position:relative!important;height:auto!important;}
body>*{max-width:560px!important;margin-left:auto!important;margin-right:auto!important;box-sizing:border-box!important;}
body>.position-fixed,body>.estate-bg-animation{max-width:100%!important;}
.container{max-width:560px!important;}
/* Center any fixed/sticky bottom bar (Add-to-contact / sticky bar) under the card */
.add-to-contact-section,[class*=sticky-bar],[class*=sticky-bottom],.fixed-bottom,
[class*=add-to-contact],[class*=sticky-cta]{left:50%!important;right:auto!important;transform:translateX(-50%)!important;max-width:560px!important;width:100%!important;}
.slick-list{overflow:hidden!important;}
.slick-slider{max-width:100%!important;}
/* Hide blog sections without touching DOM structure */
.blog-section,.blog-card,[class*=blog-slider]{display:none!important;}
.gallery-slider .slick-slide,.gallery-slider .slick-slide.slick-cloned,
.testimonial-slider .slick-slide,.testimonial-slider .slick-slide.slick-cloned{width:520px!important;max-width:520px!important;}
.product-slider .slick-slide,.product-slider .slick-slide.slick-cloned{width:260px!important;max-width:260px!important;}
.gallery-slider .slick-track,.testimonial-slider .slick-track,.product-slider .slick-track{min-width:100%!important;}
/* Force banner/cover height (some templates set banner-img height:auto!important which collapses our cover) */
.banner-section .banner-img,.banner-section [class*=banner-img]{height:315px!important;max-height:315px!important;overflow:hidden!important;}
.banner-section .banner-img>img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;}
/* Neutral placeholder bg so any unloaded content image shows a clean block, not white void */
.profile-section img,.gallery-section img,.gallery-slider img,[class*=service] img,[class*=product] img,
.product-slider img,[class*=testimonial] img,.banner-img img{background:#e8e8e8 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23bbb' stroke-width='1.5'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E") center/40px no-repeat;}
</style>
"""

FIX_JS = """
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
    setTimeout(function(){$(".slick-initialized").slick("resize");},80);
  }
  setTimeout(initSliders,250);
});
</script>
"""

# Per-template extra CSS tweaks (things the user flagged that differ from original)
EXTRAS = {
    'imagesSchoolTemplates': '.bg-img{display:none!important;}',  # footer band not in original
    'imagesPetClinic': '.container{background:#ffffff!important;}',  # white card bg for content sections
    'imagesPetShop': '.container{background:#fffbef!important;}',  # warm-white card bg (matches design)
    'imagesSalon': '.container{background:#ffffff!important;}.main-content{min-height:0!important;}.profile-section{overflow:hidden!important;}.profile-section .position-absolute img{max-width:100%!important;}',  # white bg + remove gap + clip overhanging profile bg image
    'imagesCulinaryFoodServices': '.main-content{min-height:0!important;}',  # remove empty banner gap (dark theme kept as-is)
    'imagesCEOCXO': '.container{background:#ffffff!important;}.main-content{min-height:0!important;}',  # white card + remove gap
}

def process(folder, title, cover):
    base = os.path.join(BASE, folder)
    html_files = [f for f in os.listdir(base) if f.endswith('.html') and 'clean' not in f]
    if not html_files:
        return f'SKIP {folder}: no source HTML'
    h = open(os.path.join(base, html_files[0]), encoding='utf-8', errors='replace').read()

    # Remove SingleFile comment
    h = re.sub(r'<!--\s*Page saved with SingleFile.*?-->', '', h, flags=re.DOTALL)

    # Remove SingleFile's Content-Security-Policy meta — it sets default-src 'none'
    # and img-src 'self' data:, which BLOCKS external cover images AND the CDN
    # fonts/Bootstrap/jQuery/slick we load. Stripping it lets everything load.
    h = re.sub(r'<meta[^>]*http-equiv=["\']?content-security-policy["\']?[^>]*>', '', h, flags=re.I)

    # Strip ONLY animated GIFs and videos (the real bloat — 1-21MB each).
    # Keep ALL photos (jpeg/png/webp) inline regardless of size so content
    # images (profile, services, gallery) never disappear.
    h = re.sub(r'data:image/gif;base64,[A-Za-z0-9+/=]+', '', h)
    h = re.sub(r'data:video/[^;]+;base64,[A-Za-z0-9+/=]+', '', h)
    # Safety cap: strip any single blob over 2MB (only giant animations hit this)
    def drop_huge(m):
        return '' if len(m.group(0)) > 2000000 else m.group(0)
    h = re.sub(r'data:[^;]+;base64,[A-Za-z0-9+/=]+', drop_huge, h)

    # 1. Blogs are hidden via CSS (see FIX_CSS) — NOT removed from HTML,
    #    because greedy removal corrupted the wrapper nesting (sections below
    #    the blog fell outside the white card). CSS hide keeps DOM intact.

    # 2. Remove the embedded cover VIDEO (iframe / youtube player) and replace banner with cover image
    h = re.sub(r'<iframe[^>]*youtube[^>]*>.*?</iframe>', '', h, flags=re.DOTALL|re.I)
    h = re.sub(r'<iframe[^>]*>.*?</iframe>', '', h, flags=re.DOTALL|re.I)
    # Replace empty banner-img (after video removed) with a cover image
    bm = re.search(r'(class="banner-img[^"]*"[^>]*>)([\s\S]{0,400}?)(</div>)', h)
    if bm:
        cover_html = (bm.group(1).rstrip('>') +
                      ' style="position:relative;overflow:hidden;height:315px;">' +
                      f'<img src="{cover}" alt="{title}" style="width:100%;height:100%;object-fit:cover;display:block;">' +
                      '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5));"></div>' +
                      bm.group(3))
        h = h[:bm.start()] + cover_html + h[bm.end():]

    # 3. Inject fix CSS (+ any per-template extras) right before </head>
    extra = EXTRAS.get(folder, '')
    fix = FIX_CSS
    if extra:
        fix = fix.replace('</style>', extra + '</style>')
    if '</head>' in h:
        h = h.replace('</head>', fix + '</head>', 1)
    else:
        h = fix + h

    # 4. Ensure jQuery + slick loaded, then our init JS before </body>
    needs_libs = 'jquery' not in h.lower()
    libs = ''
    if needs_libs:
        libs = ('<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>'
                '<script src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>')
    inject = libs + FIX_JS
    if '</body>' in h:
        h = h.replace('</body>', inject + '</body>', 1)
    else:
        h = h + inject

    out_path = os.path.join(base, 'clean.html')
    open(out_path, 'w', encoding='utf-8').write(h)
    return f'OK  {title:28} {len(h)//1024}KB'

if __name__ == '__main__':
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for folder, title, cover in TEMPLATES:
        if only and only.lower() not in folder.lower():
            continue
        print(process(folder, title, cover))
