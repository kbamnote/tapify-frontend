# Wire the avatar <img> to $profileImg for templates that missed it.
# Conservative: only inside containers with an avatar-specific class (never card-img/product/gallery).
import io,re
TPL='D:/Print World/tapify/tapify-backend/templates'
AV=r'(?:profile-img|profile-pic|profile-image|profile-photo|profile-bg-img|profile-bg|hero-img|user-image|user-img|avatar)'
fixed=[]; skipped=[]; nofind=[]
for vid in range(72,98):
    p=f'{TPL}/vcard{vid}.php'
    s=io.open(p,encoding='utf-8',errors='replace').read()
    if s.count('$profileImg')>=2:
        skipped.append(vid); continue
    # locate an avatar container, then the first <img ...> within 500 chars; swap its src
    m=re.search(r'<[a-z]+[^>]*class="[^"]*'+AV+r'[^"]*"[^>]*>',s,re.I)
    done=False
    if m:
        seg=s[m.end():m.end()+600]
        im=re.search(r'<img\s+[^>]*?src=("|\')?[^"\'>\s]+\1?',seg,re.I)
        if im:
            newimg=re.sub(r'src=("|\')?[^"\'>\s]+\1?','src="<?= $profileImg ?>"',im.group(0),count=1)
            s=s[:m.end()]+seg.replace(im.group(0),newimg,1)+s[m.end()+600:]
            io.open(p,'w',encoding='utf-8',newline='').write(s)
            fixed.append(vid); done=True
    if not done: nofind.append(vid)
print('FIXED avatar->$profileImg:',fixed)
print('already-wired (skipped):',skipped)
print('no avatar container found:',nofind)
