# Fourth post-pass for vcard66 (Travel Agency): visible teal verified badge,
# bigger/bold name, Embedded (iframes API) section, and a self-contained
# vanilla gallery carousel (no slick/CDN dependency).
import io, re, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard66.php'
h = open(F, encoding='utf-8').read()
orig = len(h)

# ---------- A + B) name: bigger + bold, foolproof teal verified badge ----------
BADGE = ('<span class="tf-verified" aria-label="Verified" style="display:inline-flex;align-items:center;'
         'justify-content:center;width:30px;height:30px;flex:0 0 auto;">'
         '<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
         '<circle cx="12" cy="12" r="11" fill="#40b5c5"></circle>'
         '<path d="M7.2 12.4l3 3 6.6-6.8" fill="none" stroke="#ffffff" stroke-width="2.4" '
         'stroke-linecap="round" stroke-linejoin="round"></path></svg></span>')
new_h2 = ('<h2 class="text-secondary mb-0 d-flex align-items-center justify-content-center '
          'justify-content-sm-start gap-2" style="font-size:38px;font-weight:700;line-height:1.2;">'
          '<?= htmlspecialchars($fullName) ?> ' + BADGE + '</h2>')
m = re.search(r'<h2 class="text-secondary mb-0[^>]*>\s*<\?= htmlspecialchars\(\$fullName\) \?>[\s\S]*?</h2>', h)
assert m, 'name h2 not found'
h = h[:m.start()] + new_h2 + h[m.end():]
print('A/B name+badge: ok')

# ---------- C) Embedded section (iframes API) before the Instagram block ----------
EMBED = ('<?php $__ifr=array_filter($iframes ?? [], function($fr){return !empty($fr["url"]) && preg_match("#^https?://#i",$fr["url"]);});'
         ' if(!empty($__ifr)): ?>'
         '<div class="embedded-section pt-50 px-30 position-relative">'
         '<div class="section-heading"><h2 class="left-bg">Embedded</h2></div>'
         '<div class="pt-2"><?php foreach ($__ifr as $fr): ?>'
         '<div style="border:2px solid #40b5c5;border-radius:0 20px 0 20px;overflow:hidden;background:#fff;margin-bottom:16px;">'
         '<iframe src="<?= htmlspecialchars(embeddableMapUrl($fr["url"])) ?>" width="100%" height="360" frameborder="0" '
         'loading="lazy" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="display:block;"></iframe>'
         '</div><?php endforeach; ?></div></div><?php endif; ?>')
anchor = '<?php $__insta=[];'
assert anchor in h, 'instagram anchor missing'
h = h.replace(anchor, EMBED + anchor, 1)
print('C embedded/iframes: ok')

# ---------- D) gallery carousel: remove from slick + isolate from jQuery hider ----------
gl_init = 'ini(".gallery-slider",{slidesToShow:1,arrows:false,dots:true,infinite:true,autoplay:true,autoplaySpeed:2500});'
assert gl_init in h
h = h.replace(gl_init, '', 1)
h = h.replace('$(".product-slider,.gallery-slider,.testimonial-slider")', '$(".product-slider,.testimonial-slider")', 1)

# self-contained CSS + JS for the gallery carousel (no external deps)
GAL = ('<style>'
       '.gallery-section .gallery-main-box{position:relative;}'
       '.gallery-section .gallery-slider{display:flex!important;overflow-x:auto;scroll-snap-type:x mandatory;'
       'scroll-behavior:smooth;scrollbar-width:none;-ms-overflow-style:none;margin:0;}'
       '.gallery-section .gallery-slider::-webkit-scrollbar{display:none;}'
       '.gallery-section .gallery-slider>div{flex:0 0 100%!important;max-width:100%!important;scroll-snap-align:center;'
       'box-sizing:border-box;padding:0 6px;}'
       '.tf-gal-dots{display:flex;justify-content:center;gap:8px;margin-top:16px;flex-wrap:wrap;}'
       '.tf-gal-dots button{width:10px;height:10px;border-radius:50%;border:none;background:#121212;opacity:.5;'
       'padding:0;cursor:pointer;transition:all .3s;}'
       '.tf-gal-dots button.active{background:#144660;opacity:1;width:30px;border-radius:10px;}'
       '</style>'
       '<script>(function(){function init(){'
       'var gs=document.querySelector(".gallery-section .gallery-slider");'
       'if(!gs||gs.dataset.tfCar)return;var slides=gs.children;if(!slides.length)return;gs.dataset.tfCar="1";'
       'var dots=document.createElement("div");dots.className="tf-gal-dots";'
       'gs.parentNode.appendChild(dots);var idx=0,n=slides.length;'
       'for(var i=0;i<n;i++){(function(k){var b=document.createElement("button");if(k===0)b.className="active";'
       'b.onclick=function(){go(k,true);};dots.appendChild(b);})(i);}'
       'function go(k,user){idx=(k+n)%n;gs.scrollTo({left:gs.clientWidth*idx,behavior:"smooth"});sync();if(user)rest();}'
       'function sync(){var bs=dots.children;for(var i=0;i<bs.length;i++)bs[i].className=(i===idx)?"active":"";}'
       'var t=setInterval(function(){go(idx+1);},3000);'
       'function rest(){clearInterval(t);t=setInterval(function(){go(idx+1);},3000);}'
       'var sx=0;gs.addEventListener("touchstart",function(e){sx=e.touches[0].clientX;},{passive:true});'
       'gs.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-sx;'
       'if(Math.abs(dx)>40){go(idx+(dx<0?1:-1),true);}},{passive:true});'
       'var st;gs.addEventListener("scroll",function(){clearTimeout(st);st=setTimeout(function(){'
       'var k=Math.round(gs.scrollLeft/gs.clientWidth);if(k!==idx){idx=k;sync();}},120);},{passive:true});'
       '}if(document.readyState!=="loading")setTimeout(init,300);else document.addEventListener("DOMContentLoaded",function(){setTimeout(init,300);});'
       '})();</script>')
anchor2 = '<?php if(!empty($vcard["custom_js"])): ?>'
assert anchor2 in h
h = h.replace(anchor2, GAL + anchor2, 1)
print('D gallery vanilla carousel: ok')

open(F, 'w', encoding='utf-8').write(h)
print('WROTE', orig, '->', len(h))
