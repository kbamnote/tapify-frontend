# v10: remove jQuery + slick entirely; product/testimonial sliders become
# dependency-free vanilla carousels (same proven approach as the gallery).
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard66.php'
h = open(F, encoding='utf-8').read()
orig = len(h)

h = h.replace('<!-- tapify-travelagency build v9 -->', '<!-- tapify-travelagency build v10 -->', 1)
assert 'build v10' in h

# locate the slick block (jQuery+slick scripts/css + tfInit) and replace it whole
s = h.find('<script src="/images/templates/vendor/jquery-3.6.0.min.js"></script>')
e = h.find('tfInit();</script>')
e = h.find('</script>', e) + len('</script>')
assert s > 0 and e > s, 'slick block not found'

VANILLA = (
'<script>(function(){'
'function L(m){try{console.log("[tapify-slider] "+m);}catch(e){}}'
'function mk(sel,perD,perM,iv){'
'document.querySelectorAll(sel).forEach(function(track){'
'try{'
'if(track.dataset.tfc)return;track.dataset.tfc="1";'
'var slides=Array.prototype.slice.call(track.children);var n=slides.length;if(!n)return;'
'var vp=track.parentNode;if(vp)vp.style.overflow="hidden";'
'track.style.display="flex";track.style.flexWrap="nowrap";track.style.transition="transform .5s ease";track.style.willChange="transform";'
'function per(){return (window.innerWidth<=576)?perM:perD;}'
'function layout(){var p=per();slides.forEach(function(sl){sl.style.flex="0 0 "+(100/p)+"%";sl.style.maxWidth=(100/p)+"%";sl.style.boxSizing="border-box";sl.style.display="block";sl.style.opacity="1";var im=sl.querySelector("img");if(im)im.removeAttribute("loading");});}'
'layout();var idx=0;'
'var dots=document.createElement("div");dots.className="tf-gal-dots";'
'if(vp&&vp.parentNode)vp.parentNode.insertBefore(dots,vp.nextSibling);'
'function pages(){return Math.max(1,n-per()+1);}'
'function buildDots(){dots.innerHTML="";var pg=pages();for(var i=0;i<pg;i++){(function(k){var b=document.createElement("button");if(k===idx)b.className="active";b.onclick=function(){go(k);rest();};dots.appendChild(b);})(i);}}'
'function sync(){for(var i=0;i<dots.children.length;i++)dots.children[i].className=(i===idx)?"active":"";}'
'function go(k){var pg=pages();idx=k;if(idx>pg-1)idx=0;if(idx<0)idx=pg-1;track.style.transform="translateX(-"+(idx*(100/per()))+"%)";sync();}'
'buildDots();'
'var timer=setInterval(function(){go(idx+1);},iv);'
'function rest(){clearInterval(timer);timer=setInterval(function(){go(idx+1);},iv);}'
'var sx=null;track.addEventListener("touchstart",function(ev){sx=ev.touches[0].clientX;},{passive:true});'
'track.addEventListener("touchend",function(ev){if(sx==null)return;var dx=ev.changedTouches[0].clientX-sx;if(Math.abs(dx)>40){go(idx+(dx<0?1:-1));rest();}sx=null;},{passive:true});'
'var rt;window.addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(function(){layout();buildDots();go(0);},200);});'
'L(sel+" ready slides="+n);'
'}catch(e){L(sel+" fail "+e.message);}'
'});}'
'function init(){mk(".product-slider",2,1,2800);mk(".testimonial-slider",1,1,4000);}'
'if(document.readyState!=="loading")init();else document.addEventListener("DOMContentLoaded",init);'
'})();</script>')

h = h[:s] + VANILLA + h[e:]
open(F, 'w', encoding='utf-8').write(h)
print('v10: jQuery+slick removed; product/testimonial vanilla. size', orig, '->', len(h))
print('jquery script tags left:', h.count('vendor/jquery'))
print('slick script tags left:', h.count('vendor/slick.min.js'))
