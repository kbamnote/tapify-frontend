import io, re, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard66.php'
h = open(F, encoding='utf-8').read()
orig = len(h)

# 1) name font size 44 -> 24 (user request)
old = 'style="font-size:44px!important;font-weight:700!important;line-height:1.2;"'
new = 'style="font-size:24px!important;font-weight:700!important;line-height:1.2;"'
assert old in h, 'name style not found'
h = h.replace(old, new, 1)
print('1 name 24px: ok')

# 2) version marker (visible in page source -> proves which file is live)
marker = '<!-- tapify-travelagency build v7 -->'
assert marker not in h
h = h.replace('<!DOCTYPE html>', '<!DOCTYPE html>' + marker, 1)
print('2 version marker: ok')

# 3) carousel: log version + guard against any slick takeover + force slide visibility
old_init = ('var gs=document.querySelector(".gallery-section .gallery-slider");'
            'if(!gs||gs.dataset.tfCar)return;var n=gs.children.length;if(!n)return;gs.dataset.tfCar="1";')
new_init = ('var gs=document.querySelector(".gallery-section .gallery-slider");'
            'if(!gs||gs.dataset.tfCar)return;'
            'if(gs.classList.contains("slick-initialized")){try{jQuery(gs).slick("unslick");}catch(e){}}'
            'var n=gs.children.length;if(!n)return;gs.dataset.tfCar="1";'
            'console.log("[tapify] travel gallery carousel v7, slides:",n);'
            'for(var z=0;z<n;z++){gs.children[z].style.display="block";gs.children[z].style.opacity="1";'
            'var im=gs.children[z].querySelector("img");if(im){im.removeAttribute("loading");}}')
assert old_init in h, 'carousel init not found'
h = h.replace(old_init, new_init, 1)
print('3 carousel hardened + versioned: ok')

open(F, 'w', encoding='utf-8').write(h)
print('WROTE', orig, '->', len(h))
