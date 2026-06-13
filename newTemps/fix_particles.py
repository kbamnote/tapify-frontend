# Add a self-contained canvas particle animation (the original JS was stripped,
# leaving a frozen-frame PNG). Floating teal dots matching the hospital theme.
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard67.php'
h = open(F, encoding='utf-8').read()
orig = len(h)

assert '<canvas data-generated=true' in h, 'canvas not found'

PARTICLES = (
'<script>(function(){'
'function init(){'
'var c=document.querySelector("canvas[data-generated]");if(!c)return;'
'try{c.style.setProperty("background-image","none","important");}catch(e){}'
'var ctx=c.getContext&&c.getContext("2d");if(!ctx)return;'
'function size(){c.width=c.offsetWidth||window.innerWidth;c.height=c.offsetHeight||window.innerHeight;}'
'size();var rt;window.addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(size,200);});'
'var N=Math.max(28,Math.min(70,Math.round(c.width*c.height/16000)));'
'var P=[];for(var i=0;i<N;i++){P.push({x:Math.random()*c.width,y:Math.random()*c.height,r:1+Math.random()*3.5,'
'vx:(Math.random()-0.5)*0.35,vy:-(0.15+Math.random()*0.55),a:0.12+Math.random()*0.33});}'
'function frame(){ctx.clearRect(0,0,c.width,c.height);'
'for(var i=0;i<P.length;i++){var p=P[i];p.x+=p.vx;p.y+=p.vy;'
'if(p.y<-12){p.y=c.height+12;p.x=Math.random()*c.width;}'
'if(p.x<-12)p.x=c.width+12;if(p.x>c.width+12)p.x=-12;'
'ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.2832);ctx.fillStyle="rgba(62,184,182,"+p.a+")";ctx.fill();}'
'requestAnimationFrame(frame);}'
'requestAnimationFrame(frame);'
'}'
'if(document.readyState!=="loading")init();else document.addEventListener("DOMContentLoaded",init);'
'})();</script>')

anchor = '<?php include __DIR__ . "/_shared-scripts.php"; ?>'
assert anchor in h
h = h.replace(anchor, PARTICLES + anchor, 1)
open(F, 'w', encoding='utf-8').write(h)
print('particle animation added', orig, '->', len(h))
