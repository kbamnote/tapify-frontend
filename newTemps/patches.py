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
