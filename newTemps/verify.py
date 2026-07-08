# Structural verification sweep for vcard72..97
import io,re,os
TPL='D:/Print World/tapify/tapify-backend/templates'
demo_phones=['9800508990','1666666667','8059236063']
rows=[]; problems=[]
for vid in range(72,98):
    p=f'{TPL}/vcard{vid}.php'
    s=io.open(p,encoding='utf-8',errors='replace').read()
    name = s.count('htmlspecialchars($fullName)')>=1
    occ  = '$vcard["occupation"]' in s
    soc  = s.count('foreach ($socialLinks')>=1
    wa   = "'whatsapp'=>'fa-whatsapp'" in s
    cov  = 'cover_type' in s
    prof = s.count('$profileImg')>=2   # defined + used
    b64  = len(re.findall(r'base64,[A-Za-z0-9+/=]{80,}',s))
    slug = (re.search(r'/images/templates/([a-z0-9]+)/',s) or [None,'?'])[1]
    assets = s.count(f'/images/templates/{slug}/') if slug!='?' else 0
    php_bal = s.count('<?')-s.count('?>')   # should be 0
    demo = [d for d in demo_phones if re.search(r'>\s*\+?[\s0-9]*'+d,s)]
    ok = name and soc and wa and cov and b64==0 and php_bal==0
    rows.append((vid,name,occ,soc,wa,cov,prof,b64,assets,php_bal,demo,ok))
    if not ok or not prof or demo:
        flags=[]
        if not name:flags.append('NAME')
        if not soc:flags.append('SOCIAL')
        if not wa:flags.append('WHATSAPP')
        if not cov:flags.append('COVER')
        if not prof:flags.append('profImg?')
        if b64:flags.append(f'base64={b64}')
        if php_bal:flags.append(f'PHPBAL={php_bal}')
        if demo:flags.append(f'demo#={demo}')
        problems.append((vid,flags))

print(f'{"ID":8}{"name":5}{"occ":5}{"soc":5}{"wa":4}{"cov":5}{"prof":6}{"b64":5}{"asset":6}{"bal":5}  demo')
for r in rows:
    m=lambda b:'Y' if b else '.'
    print(f'vcard{r[0]:<3}{m(r[1]):5}{m(r[2]):5}{m(r[3]):5}{m(r[4]):4}{m(r[5]):5}{m(r[6]):6}{r[7]:<5}{r[8]:<6}{r[9]:<5}  {r[10] or ""}')
print()
if problems:
    print("=== NEEDS ATTENTION ===")
    for vid,fl in problems: print(f'  vcard{vid}: {", ".join(fl)}')
else:
    print("ALL 26 PASS core checks.")
print(f'\nCore PASS: {sum(1 for r in rows if r[11])}/26  (name+social+whatsapp+cover+no-base64+php-balanced)')
