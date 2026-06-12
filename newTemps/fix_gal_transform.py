import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard66.php'
h = open(F, encoding='utf-8').read()

start = h.find('<style>.gallery-section .gallery-main-box{position:relative;}')
anchor = '<?php if(!empty($vcard["custom_js"])): ?>'
end = h.find(anchor)
assert start > 0 and end > start, 'gallery block not located'

GAL = ('<style>'
       '.gallery-section .gallery-main-box{position:relative;overflow:hidden;}'
       '.gallery-section .gallery-slider{display:flex!important;transition:transform .5s ease;will-change:transform;margin:0;}'
       '.gallery-section .gallery-slider>div{flex:0 0 100%!important;max-width:100%!important;box-sizing:border-box;padding:0 6px;}'
       '.tf-gal-dots{display:flex;justify-content:center;gap:8px;margin-top:16px;flex-wrap:wrap;}'
       '.tf-gal-dots button{width:10px;height:10px;border-radius:50%;border:none;background:#121212;opacity:.5;padding:0;cursor:pointer;transition:all .3s;}'
       '.tf-gal-dots button.active{background:#144660;opacity:1;width:30px;border-radius:10px;}'
       '</style>'
       '<script>(function(){function init(){'
       'var gs=document.querySelector(".gallery-section .gallery-slider");'
       'if(!gs||gs.dataset.tfCar)return;var n=gs.children.length;if(!n)return;gs.dataset.tfCar="1";'
       'var box=gs.parentNode;var dots=document.createElement("div");dots.className="tf-gal-dots";'
       'box.parentNode.insertBefore(dots,box.nextSibling);var idx=0;'
       'for(var i=0;i<n;i++){(function(k){var b=document.createElement("button");if(k===0)b.className="active";'
       'b.onclick=function(){go(k);rest();};dots.appendChild(b);})(i);}'
       'function go(k){idx=(k+n)%n;gs.style.transform="translateX(-"+(idx*100)+"%)";sync();}'
       'function sync(){for(var i=0;i<dots.children.length;i++)dots.children[i].className=(i===idx)?"active":"";}'
       'var t=setInterval(function(){go(idx+1);},3000);'
       'function rest(){clearInterval(t);t=setInterval(function(){go(idx+1);},3000);}'
       'var sx=null;gs.addEventListener("touchstart",function(e){sx=e.touches[0].clientX;},{passive:true});'
       'gs.addEventListener("touchend",function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;'
       'if(Math.abs(dx)>40){go(idx+(dx<0?1:-1));rest();}sx=null;},{passive:true});'
       'window.addEventListener("resize",function(){go(idx);});'
       '}if(document.readyState!=="loading")setTimeout(init,300);'
       'else document.addEventListener("DOMContentLoaded",function(){setTimeout(init,300);});})();</script>')

h = h[:start] + GAL + h[end:]
open(F, 'w', encoding='utf-8').write(h)
print('gallery carousel -> transform-based; new size', len(h))
