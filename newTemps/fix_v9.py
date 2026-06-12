# v9: state-first, fully-guarded gallery carousel with per-image diagnostics.
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard66.php'
h = open(F, encoding='utf-8').read()
orig = len(h)

h = h.replace('<!-- tapify-travelagency build v8 -->', '<!-- tapify-travelagency build v9 -->', 1)
assert 'build v9' in h

s = h.find('<script>(function(){function setup(){')
e = h.find('</script>', s) + len('</script>')
assert s > 0 and e > s, 'v8 script not found'

NEW = (
'<script>(function(){'
'function L(m){try{console.log("[tapify-gal] "+m);}catch(e){}}'
'function go(k){var st=window.__tfGal;if(!st)return;st.idx=((k%st.n)+st.n)%st.n;'
'try{st.gs.style.transform="translateX(-"+(st.idx*100)+"%)";}catch(e){}'
'if(st.dots){for(var i=0;i<st.dots.children.length;i++){st.dots.children[i].className=(i===st.idx)?"active":"";}}}'
'function rest(){var st=window.__tfGal;if(!st)return;try{clearInterval(st.timer);}catch(e){}'
'st.timer=setInterval(function(){go(window.__tfGal.idx+1);},3000);}'
'function enforce(){var st=window.__tfGal;if(!st)return;var gs=st.gs;'
'try{if(gs.classList.contains("slick-initialized")){try{jQuery(gs).slick("unslick");}catch(e){}'
'gs.classList.remove("slick-initialized","slick-slider","slick-dotted");}}catch(e){}'
'try{gs.style.setProperty("display","flex","important");gs.style.setProperty("flex-wrap","nowrap","important");'
'gs.style.transition="transform .5s ease";if(gs.parentNode)gs.parentNode.style.overflow="hidden";}catch(e){}'
'for(var i=0;i<gs.children.length;i++){var c=gs.children[i];try{'
'c.style.setProperty("flex","0 0 100%","important");c.style.setProperty("max-width","100%","important");'
'c.style.setProperty("display","block","important");c.style.setProperty("opacity","1","important");'
'c.style.setProperty("visibility","visible","important");'
'var im=c.querySelector("img");if(im){im.removeAttribute("loading");'
'im.style.setProperty("display","block","important");im.style.setProperty("opacity","1","important");}}catch(e){}}}'
'function build(){'
'var gs=document.querySelector(".gallery-section .gallery-slider");'
'if(!gs){return false;}var n=gs.children.length;if(!n){return false;}'
'if(gs.dataset.tfCar){enforce();return true;}'
'gs.dataset.tfCar="1";'
'window.__tfGal={idx:0,n:n,gs:gs,dots:null,timer:null};'  # STATE FIRST
'L("init slides="+n);'
'enforce();'
# per-image diagnostics
'for(var i=0;i<n;i++){(function(k){try{var im=gs.children[k].querySelector("img");if(!im)return;'
'im.addEventListener("error",function(){L("IMG "+k+" FAILED -> "+im.currentSrc);});'
'if(im.complete){L("IMG "+k+(im.naturalWidth>0?(" ok "+im.naturalWidth+"x"+im.naturalHeight):" BROKEN")+" -> "+im.currentSrc);}'
'else{im.addEventListener("load",function(){L("IMG "+k+" loaded "+im.naturalWidth+"x"+im.naturalHeight);});}'
'}catch(e){}})(i);}'
# dots (guarded — never blocks the timer)
'try{var host=(gs.parentNode&&gs.parentNode.parentNode)?gs.parentNode.parentNode:gs.parentNode;'
'var dots=document.createElement("div");dots.className="tf-gal-dots";host.appendChild(dots);window.__tfGal.dots=dots;'
'for(var d=0;d<n;d++){(function(k){var b=document.createElement("button");if(k===0)b.className="active";'
'b.onclick=function(){go(k);rest();};dots.appendChild(b);})(d);}}catch(e){L("dots fail "+e.message);}'
# timer + swipe
'window.__tfGal.timer=setInterval(function(){go(window.__tfGal.idx+1);},3000);'
'try{var sx=null;gs.addEventListener("touchstart",function(e){sx=e.touches[0].clientX;},{passive:true});'
'gs.addEventListener("touchend",function(e){if(sx==null)return;var dx=e.changedTouches[0].clientX-sx;'
'if(Math.abs(dx)>40){go(window.__tfGal.idx+(dx<0?1:-1));rest();}sx=null;},{passive:true});}catch(e){}'
'L("ready");return true;}'
'var tries=0;var boot=setInterval(function(){tries++;try{build();}catch(e){L("build fail "+e.message);}if(tries>=20)clearInterval(boot);},500);'
'try{build();}catch(e){L("build0 fail "+e.message);}'
'})();</script>')

h = h[:s] + NEW + h[e:]
open(F, 'w', encoding='utf-8').write(h)
print('v9 carousel written', orig, '->', len(h))
