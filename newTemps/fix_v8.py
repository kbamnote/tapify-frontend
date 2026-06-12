# v8: bulletproof gallery — inline slide styles (immune to CSS interference),
# self-healing carousel loop (ejects slick, re-asserts layout for 10s),
# correct data-lightbox URLs for the shared lightbox.
import io, re, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard66.php'
h = open(F, encoding='utf-8').read()
orig = len(h)

# ---- 1) slides: inline styles + real lightbox URL ----
old_slide = ('<div><div class="gallery-img"><div class="expand-icon pe-none">')
new_slide = ('<div style="flex:0 0 100%;max-width:100%;box-sizing:border-box;padding:0 6px;">'
             '<div class="gallery-img"><div class="expand-icon pe-none">')
assert old_slide in h, 'gallery slide open not found'
h = h.replace(old_slide, new_slide, 1)

old_a = '<a href="<?= htmlspecialchars($gi) ?>" data-lightbox="gallery-images">'
new_a = '<a href="javascript:void(0)" data-lightbox="<?= htmlspecialchars($gi) ?>">'
assert old_a in h, 'gallery anchor not found'
h = h.replace(old_a, new_a, 1)
print('1 slides inline + lightbox url: ok')

# ---- 2) marker v7 -> v8 ----
h = h.replace('<!-- tapify-travelagency build v7 -->', '<!-- tapify-travelagency build v8 -->', 1)
assert 'build v8' in h
print('2 marker v8: ok')

# ---- 3) replace the whole carousel script with the self-healing v8 ----
mstart = h.find('<script>(function(){function init(){')
assert mstart > 0, 'carousel script start not found'
mend = h.find('</script>', mstart) + len('</script>')
NEW = ('<script>(function(){'
       'function setup(){'
       'var gs=document.querySelector(".gallery-section .gallery-slider");'
       'if(!gs)return false;'
       'var n=gs.children.length;if(!n)return false;'
       'if(!gs.dataset.tfCar){'
       'gs.dataset.tfCar="1";'
       'console.log("[tapify] travel gallery carousel v8, slides:",n);'
       'var box=gs.parentNode;var dots=document.createElement("div");dots.className="tf-gal-dots";'
       'box.parentNode.insertBefore(dots,box.nextSibling);'
       'window.__tfGal={idx:0,n:n,gs:gs,dots:dots};'
       'for(var i=0;i<n;i++){(function(k){var b=document.createElement("button");if(k===0)b.className="active";'
       'b.onclick=function(){go(k);rest();};dots.appendChild(b);})(i);}'
       'window.__tfGalTimer=setInterval(function(){go(window.__tfGal.idx+1);},3000);'
       'var sx=null;gs.addEventListener("touchstart",function(e){sx=e.touches[0].clientX;},{passive:true});'
       'gs.addEventListener("touchend",function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;'
       'if(Math.abs(dx)>40){go(window.__tfGal.idx+(dx<0?1:-1));rest();}sx=null;},{passive:true});'
       '}'
       'enforce();return true;'
       '}'
       'function go(k){var st=window.__tfGal;st.idx=(k+st.n)%st.n;'
       'st.gs.style.transform="translateX(-"+(st.idx*100)+"%)";'
       'for(var i=0;i<st.dots.children.length;i++)st.dots.children[i].className=(i===st.idx)?"active":"";}'
       'function rest(){clearInterval(window.__tfGalTimer);'
       'window.__tfGalTimer=setInterval(function(){go(window.__tfGal.idx+1);},3000);}'
       'function enforce(){var st=window.__tfGal;if(!st)return;var gs=st.gs;'
       'if(gs.classList.contains("slick-initialized")){try{jQuery(gs).slick("unslick");}catch(e){}gs.classList.remove("slick-initialized","slick-slider","slick-dotted");}'
       'gs.style.setProperty("display","flex","important");'
       'gs.style.setProperty("flex-wrap","nowrap","important");'
       'gs.style.transition="transform .5s ease";'
       'var p=gs.parentNode;if(p)p.style.overflow="hidden";'
       'for(var i=0;i<gs.children.length;i++){var c=gs.children[i];'
       'c.style.setProperty("flex","0 0 100%","important");'
       'c.style.setProperty("max-width","100%","important");'
       'c.style.setProperty("display","block","important");'
       'c.style.setProperty("opacity","1","important");'
       'c.style.setProperty("visibility","visible","important");'
       'var im=c.querySelector("img");if(im){im.removeAttribute("loading");'
       'im.style.setProperty("display","block","important");im.style.setProperty("opacity","1","important");}}'
       '}'
       'var tries=0;var boot=setInterval(function(){tries++;'
       'var ok=setup();if(tries>20)clearInterval(boot);},500);'
       'setup();'
       '})();</script>')
h = h[:mstart] + NEW + h[mend:]
print('3 self-healing carousel v8: ok')

open(F, 'w', encoding='utf-8').write(h)
print('WROTE', orig, '->', len(h))
