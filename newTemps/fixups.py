# One-shot fixups for reported Pro-template issues (new 72-97 + legacy-Pro list).
import io,re
TPL='D:/Print World/tapify/tapify-backend/templates'
def rd(v): return io.open(f'{TPL}/vcard{v}.php',encoding='utf-8',errors='replace').read()
def wr(v,s): io.open(f'{TPL}/vcard{v}.php','w',encoding='utf-8',newline='').write(s)

# accent color per template from the registry
reg=io.open(f'{TPL}/_theme-registry.php',encoding='utf-8').read()
def accent(v):
    m=re.search(r"'vcard0?%d' => \['name'[^\]]*'primary' => '(#[0-9a-fA-F]{6})'"%v,reg)
    return m.group(1) if m else '#2563eb'

# ---- A. fix the hide-empty JS: never hide main/wrapper sections (caused vcard88 blank page) ----
oldA='$(".product-slider,.gallery-slider,.testimonial-slider,.blog-slider").each(function(){if($(this).children().length===0){$(this).closest("[class*=section]").hide();$(this).hide();}});'
newA='$(".product-slider,.gallery-slider,.testimonial-slider,.blog-slider").each(function(){if($(this).children().length===0){var s=$(this).closest("[class*=section]");if(s.length&&!/main|wrapper|content|page|body/i.test(s.attr("class")||"")&&s.find("[class*=section]").length===0){s.hide();}$(this).hide();}});'
oldB='$("[class*=instagram],[class*=insta-feed],[class*=insta-section],[class*=insta-feed-section]").each(function(){if($(this).find("img,iframe,.slick-slide,.insta-item,a[href*=instagram]").length===0){$(this).closest("[class*=section]").hide();$(this).hide();}});'
newB='$("[class*=instagram],[class*=insta-feed],[class*=insta-section],[class*=insta-feed-section]").each(function(){if($(this).find("img,iframe,.slick-slide,.insta-item,a[href*=instagram]").length===0){var s=$(this).closest("[class*=section]");if(s.length&&!/main|wrapper|content|page|body/i.test(s.attr("class")||"")&&s.find("[class*=section]").length===0){s.hide();}$(this).hide();}});'
fa=fb=0
for v in range(72,98):
    s=rd(v); c=s
    if oldA in c: c=c.replace(oldA,newA); fa+=1
    if oldB in c: c=c.replace(oldB,newB); fb+=1
    if c!=s: wr(v,c)
print('A hide-js fixed:',fa,fb)

# ---- B. vcard90: remove the duplicate injected banner at top of body ----
s=rd(90)
m=re.search(r'<div class="banner-section position-relative w-100"><div class="banner-img" style="position:relative;overflow:hidden;height:315px;">',s)
if m:
    depth=0; end=None
    for t in re.finditer(r'<div\b|</div>',s[m.start():]):
        depth+=1 if t.group(0)=='<div' else -1
        if depth==0: end=m.start()+t.end(); break
    if end:
        s=s[:m.start()]+s[end:]; wr(90,s); print('B vcard90 injected banner removed')
else: print('B vcard90 banner: not found/already removed')

# ---- C. vcard69: hide "Made by" footer credit ----
s=rd(69)
mm=re.search(r'<(a|p|div|span)[^>]*>[^<]{0,30}[Mm]ade\s*[Bb]y[^<]{0,40}<',s)
if mm:
    tag=mm.group(0)
    s=s.replace(tag, tag[:tag.rfind('>')]+' style="display:none!important">' if 'style=' not in tag else tag, 1) if False else s
# safer: CSS hide via text-bearing class; fallback appended CSS below handles it
made=re.search(r'class="([^"]*)"[^>]*>[^<]{0,30}[Mm]ade\s*[Bb]y',s)
print('C vcard69 made-by class:',made.group(1) if made else 'none-found (css fallback)')

# ---- D. per-template CSS appends (before </body>) ----
CSS={
 46:'.service-card .card-img,.service-card [class*=img]{overflow:hidden!important}.service-card .card-img img{object-fit:cover!important;width:100%!important;height:100%!important}',
 51:'.social-icon i,.social-icon svg,a[class*=social] i,a[class*=social] svg{color:ACC!important;fill:ACC!important;opacity:1!important}',
 52:'.contact-section a,.contact-section p,.contact-section span{font-size:15px!important;line-height:1.5!important}',
 58:'[class*=profile-desc] p,[class*=description]{color:ACC!important}.contact-section{background:rgba(127,127,127,.08)!important}',
 66:'.profile-name+p,.profile-name+span,[class*=occupation],[class*=designation],.profile-name~p{color:ACC!important;opacity:1!important}',
 67:'.service-card .card-title,.our-services-section h3,.our-services-section .card-title{color:ACC!important}',
 68:'.profile-name{text-align:center!important;margin-top:0!important}.service-card .card-body{padding-bottom:8px!important}.service-card .card-title{margin-bottom:4px!important}',
 69:'[class*=made-by],[class*=madeby],[class*=credit],a[href*=tapkiya]{display:none!important}',
 71:'.social-icon i,.social-icon svg,a[class*=social] i,a[class*=social] svg{color:ACC!important;fill:ACC!important;opacity:1!important}',
 77:'.contact-box a,.contact-box p,.contact-box span,.contact-desc a,.contact-desc p{color:ACC!important}.our-services-section .row,.business-hour-section .row{justify-content:center!important}',
 78:'.our-services-section{background:transparent!important}.business-hour-section input,.business-hour-section .flatpickr-input{display:none!important}',
 80:'.service-card .card-body{padding-bottom:6px!important}.our-services-section input,.services input{display:none!important}.service-card img{display:block!important;object-fit:cover!important;min-height:150px}',
 82:'.gallery-section .section-heading h2,[class*=gallery] .section-heading h2{color:ACC!important}',
 83:'.business-hour-card{display:flex!important;align-items:center!important;gap:10px!important}',
 86:'[class*=profile-name],[class*=profile-name] h2{color:ACC!important}[class*=desc] p{opacity:1!important}',
 89:'[class*=product-section],[class*=gallery-section],[class*=testimonial-section],.product-slider,.gallery-slider,.testimonial-slider{display:none!important}.service-card img{max-height:170px!important;object-fit:cover!important}.service-card h3,.service-card .card-title{font-size:16px!important}',
 90:'.service-card .card-title,.service-card h3,.service-card h4{color:ACC!important}',
 93:'[class*=profile-desc] p,[class*=description]{color:ACC!important}',
 94:'.profile-section h2,.profile-section .profile-name{text-shadow:0 1px 8px rgba(0,0,0,.65)}.profile-section p{text-shadow:0 1px 6px rgba(0,0,0,.55)}',
 96:'.qr-code-img,[class*=qr] img{background:#fff!important;padding:8px!important;min-width:170px!important;min-height:170px!important;border-radius:8px!important}',
 97:'[class*=profile-name],.contact-box a,.contact-box p,.contact-box span{color:ACC!important}.contact-section{background:rgba(127,127,127,.10)!important;border-radius:12px}',
}
# every pro template: flatpickr calendar only when open
ALL_IDS=[46,47,51,52,58,62,66,67,68,69,70,71]+list(range(72,98))
GLOBALCSS='.flatpickr-calendar:not(.open){display:none!important}'
napp=0
for v in ALL_IDS:
    s=rd(v)
    add=(CSS.get(v,'')+GLOBALCSS).replace('ACC',accent(v))
    marker='/*tf-fixups*/'
    if marker in s: continue
    blk='<style>'+marker+add+'</style>'
    if '</body>' in s: s=s.replace('</body>',blk+'</body>',1)
    else: s=s+blk
    wr(v,s); napp+=1
print('D css appended:',napp)

# ---- E. legacy-Pro: inquiry attachment (form swap + input + JS) ----
LBL='<label class="w-100 mb-2" style="display:block;text-align:left"><span style="font-size:13px;opacity:.85">Attachment (optional)</span><input type="file" name="attachment" class="form-control" accept="image/*,.pdf" style="margin-top:4px"></label>'
JS='<script>window.tfSubmitInquiry=async function(ev){ev.preventDefault();var f=ev.target;var b=f.querySelector("button[type=submit]");var fd=new FormData(f);if(b)b.disabled=true;try{var r=await fetch("/inquiry-submit.php",{method:"POST",body:fd});var j=await r.json();if(j.success){if(window.showToast)showToast("Message sent!","success");f.reset();}else{if(window.showToast)showToast(j.message||"Failed","error");}}catch(e){if(window.showToast)showToast("Connection error","error");}finally{if(b)b.disabled=false;}};</script>'
done=[]
for v in [46,47,51,52,58,62,66,67,68,69,70,71]:
    s=rd(v)
    if 'enquiryForm' not in s or 'name="attachment"' in s: continue
    s2=s.replace('submitInquiry(event)','tfSubmitInquiry(event)',1)
    fm=re.search(r'<form[^>]*enquiryForm[^>]*>',s2)
    if fm:
        tag=fm.group(0)
        if 'enctype' not in tag:
            s2=s2.replace(tag,tag[:-1]+' enctype="multipart/form-data">',1)
            fm=re.search(r'<form[^>]*enquiryForm[^>]*>',s2); tag=fm.group(0)
        hid=re.search(re.escape(tag)+r'(<input[^>]*vcard_id[^>]*>)?',s2)
        ins=hid.end()
        s2=s2[:ins]+LBL+s2[ins:]
        if '</body>' in s2: s2=s2.replace('</body>',JS+'</body>',1)
        else: s2+=JS
        wr(v,s2); done.append(v)
print('E legacy inquiry attachment:',done)

# ---- F. avatar/logo wiring 2nd pass (77,80,83,90,97): img inside logo/profile/avatar container ----
wired=[]
for v in [77,80,83,90,97]:
    s=rd(v)
    if s.count('$profileImg')>=2: continue
    m=re.search(r'<(div|span)[^>]*class="[^"]*(?:logo|profile|avatar)[^"]*"[^>]*>\s*<img\s+[^>]*?src=("|\')?[^"\'>\s]+\2?',s,re.I)
    if m:
        seg=m.group(0)
        s=s.replace(seg,re.sub(r'src=("|\')?[^"\'>\s]+\1?','src="<?= $profileImg ?>"',seg,count=1),1)
        wr(v,s); wired.append(v)
print('F avatar wired:',wired)
