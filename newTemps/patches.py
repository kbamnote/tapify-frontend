# Repeatable post-regen fixes (run AFTER regen.py). Re-applies the per-template
# hand-fixes the generic builder can't infer.
import io,re
TPL='D:/Print World/tapify/tapify-backend/templates'
def rd(v): return io.open(f'{TPL}/vcard{v}.php',encoding='utf-8',errors='replace').read()
def wr(v,s): io.open(f'{TPL}/vcard{v}.php','w',encoding='utf-8',newline='').write(s)

# 1) Avatar -> $profileImg (conservative, avatar-specific classes only) for ALL
AV=r'(?:profile-img|profile-pic|profile-image|profile-photo|profile-bg-img|profile-bg|hero-img|user-image|user-img|avatar)'
av=[]
for v in range(72,98):
    s=rd(v)
    if s.count('$profileImg')>=2: continue
    m=re.search(r'<[a-z]+[^>]*class="[^"]*'+AV+r'[^"]*"[^>]*>',s,re.I)
    if m:
        seg=s[m.end():m.end()+600]
        im=re.search(r'<img\s+[^>]*?src=("|\')?[^"\'>\s]+\1?',seg,re.I)
        if im:
            seg2=seg.replace(im.group(0),re.sub(r'src=("|\')?[^"\'>\s]+\1?','src="<?= $profileImg ?>"',im.group(0),count=1),1)
            wr(v,s[:m.end()]+seg2+s[m.end()+600:]); av.append(v)
print('avatar wired:',av)

# 2) vcard79 (Executive Profile): name + occupation not inferrable (generic classes)
s=rd(79); c=0
if 'Tricky Stewart' in s: s=s.replace('Tricky Stewart','<?= htmlspecialchars($fullName) ?>'); c+=1
old='>A Full Stack Developer</span>'
if old in s: s=s.replace(old,'><?= htmlspecialchars($vcard["occupation"] ?? "") ?></span>'); c+=1
wr(79,s); print('vcard79 name/occ patches:',c)

# 3) vcard94 (School): export has no social block -> inject one before contact-section
s=rd(94)
anchor='<div class="contact-section pt-50 pb-50 position-relative">'
block=('<?php if(!empty($socialLinks)): ?><div class="social-media-section text-center py-4">'
 '<div class="d-flex justify-content-center flex-wrap gap-3"><?php foreach ($socialLinks as $s): '
 '$ic=$platformIcons[strtolower($s["platform"] ?? "")] ?? "fa-globe"; ?>'
 '<a href="<?= htmlspecialchars($s["url"]) ?>" target="_blank" rel="noopener" class="social-icon">'
 '<i class="fab <?= $ic ?> icon fa-2x"></i></a><?php endforeach; ?></div></div><?php endif; ?>')
if anchor in s and 'foreach ($socialLinks' not in s:
    wr(94,s.replace(anchor,block+anchor,1)); print('vcard94 social injected')
else:
    print('vcard94 social:', 'already present' if 'foreach ($socialLinks' in s else 'anchor missing')

# 4) About binding for templates whose bio sits in a profile-desc container the
#    generic builder missed (skip testimonial-author profile-desc blocks).
DESC_IF='<?php if(!empty($vcard["description"])): ?><?= nl2br(htmlspecialchars($vcard["description"])) ?><?php else: ?>'
for v in [80,83,86,94,96,97]:
    s=rd(v)
    if s.count('$vcard["description"]')>=1: continue
    done=False
    for m in re.finditer(r'<div[^>]*class="[^"]*(?:profile-desc|(?<![-\w])desc(?![-\w]))[^"]*"[^>]*>', s, re.I):
        depth=0; end=None
        for t in re.finditer(r'<div\b|</div>', s[m.start():]):
            depth+=1 if t.group(0)=='<div' else -1
            if depth==0: end=m.start()+t.end(); break
        if end is None or end-m.end()>8000: continue
        inner=s[m.end():end]
        if '$t[' in inner: continue                       # testimonial author block
        pm=re.search(r'(<p[^>]*>)((?:(?!</p>).){40,1200}?)(</p>)', inner, re.S)  # allow nested inline tags
        if pm:
            newp=pm.group(1)+DESC_IF+pm.group(2)+'<?php endif; ?>'+pm.group(3)
            s=s[:m.end()]+inner.replace(pm.group(0),newp,1)+s[end:]
            wr(v,s); done=True; break
    if not done:
        # fallback: first substantial <p> after the occupation binding, not inside a section
        om=s.find('$vcard["occupation"]')
        if om!=-1:
            region=s[om:om+3500]
            BAD=('contact','qr','pwa','service','gallery','product','testimonial',
                 'business-hour','appointment','blog','install','footer','map-','slick')
            for pm in re.finditer(r'(<p[^>]*>)((?:(?!</p>).){40,1200}?)(</p>)', region, re.S):
                pre=region[max(0,pm.start()-220):pm.start()].lower()
                if any(k in pre for k in BAD): continue
                newp=pm.group(1)+DESC_IF+pm.group(2)+'<?php endif; ?>'+pm.group(3)
                s=s[:om]+region.replace(pm.group(0),newp,1)+s[om+3500:]
                wr(v,s); done=True; break
    print(f'vcard{v} about:', 'bound' if done else 'NOT FOUND')
