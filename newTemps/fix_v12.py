# v12: gallery rotation via pure CSS keyframe animation (compositor thread) —
# immune to busy main thread / other scripts / JS errors. JS only sets it up once.
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard66.php'
h = open(F, encoding='utf-8').read()
orig = len(h)

h = h.replace('<!-- tapify-travelagency build v11 -->', '<!-- tapify-travelagency build v12 -->', 1)
assert 'build v12' in h

s = h.find('<script>(function(){function L(m){try{console.log("[tapify-gal]')
e = h.find('</script>', s) + len('</script>')
assert s > 0 and e > s, 'v9 gallery script not found'

NEW = (
'<script>(function(){'
'function setup(){'
'var gs=document.querySelector(".gallery-section .gallery-slider");'
'if(!gs||gs.dataset.tfCss)return;var n=gs.children.length;if(!n)return;gs.dataset.tfCss="1";'
'try{console.log("[tapify-gal] v12 css-anim slides="+n);}catch(e){}'
'var box=gs.parentNode;if(box){box.style.overflow="hidden";}'
'gs.style.setProperty("display","flex","important");gs.style.setProperty("flex-wrap","nowrap","important");'
'gs.style.transition="none";gs.style.willChange="transform";'
'for(var i=0;i<n;i++){var c=gs.children[i];'
'c.style.setProperty("flex","0 0 100%","important");c.style.setProperty("max-width","100%","important");'
'c.style.setProperty("display","block","important");c.style.setProperty("opacity","1","important");'
'c.style.setProperty("visibility","visible","important");'
'var im=c.querySelector("img");if(im){im.removeAttribute("loading");'
'im.style.setProperty("display","block","important");im.style.setProperty("width","100%","important");'
'im.style.setProperty("height","100%","important");im.style.setProperty("object-fit","cover","important");}'
'var a2=c.querySelector("a");if(a2){a2.style.setProperty("display","block","important");a2.style.setProperty("width","100%","important");a2.style.setProperty("height","100%","important");}}'
'if(n<2){gs.style.transform="translateX(0)";return;}'
'var kf="@keyframes tfGalKF{";'
'for(var i=0;i<n;i++){var pa=(i/n*100).toFixed(3),pb=((i+0.82)/n*100).toFixed(3);'
'kf+=pa+"%{transform:translateX(-"+(i*100)+"%)}"+pb+"%{transform:translateX(-"+(i*100)+"%)}";}'
'kf+="100%{transform:translateX(0)}}";'
'var stEl=document.createElement("style");stEl.textContent=kf;document.head.appendChild(stEl);'
'gs.style.setProperty("animation","tfGalKF "+(n*3)+"s infinite","important");'
# decorative dots (best-effort sync; rotation itself does not depend on this)
'try{var host=(box&&box.parentNode)?box.parentNode:box;var dots=document.createElement("div");dots.className="tf-gal-dots";'
'for(var d=0;d<n;d++){var bb=document.createElement("button");if(d===0)bb.className="active";'
'(function(k){bb.onclick=function(){gs.style.animation="none";gs.style.transform="translateX(-"+(k*100)+"%)";for(var z=0;z<dots.children.length;z++)dots.children[z].className=(z===k)?"active":"";};})(d);'
'dots.appendChild(bb);}host.appendChild(dots);'
'var di=0;setInterval(function(){if(gs.style.animation==="none")return;di=(di+1)%n;for(var k=0;k<dots.children.length;k++)dots.children[k].className=(k===di)?"active":"";},3000);}catch(e){}'
'}'
'if(document.readyState!=="loading")setup();else document.addEventListener("DOMContentLoaded",setup);'
'setTimeout(setup,800);setTimeout(setup,2000);'
'})();</script>')

h = h[:s] + NEW + h[e:]
open(F, 'w', encoding='utf-8').write(h)
print('v12 CSS-animation gallery written;', orig, '->', len(h))
