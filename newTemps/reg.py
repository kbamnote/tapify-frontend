# Register vcard72..97 in _theme-registry.php and vcard-edit.js
import io,sys,os,re,collections
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')
BASE='D:/Print World/tapify'
SRCROOT=f'{BASE}/tapify-frontend/newTemps/tempsNewAdded'

# id -> (folder, display name, category)
M=[
 (72,'Business Beacon','Business Beacon','Business'),
 (73,'Clean Canvas','Clean Canvas','Business'),
 (74,'Corporate Classic','Corporate Classic','Corporate'),
 (75,'Corporate Connect','Corporate Connect','Corporate'),
 (76,'Corporate Identity','Corporate Identity','Corporate'),
 (77,'Dynamic (Kids Toy Store)','Kids Toy Store','Retail'),
 (78,'Event Management','Event Management','Events'),
 (79,'Executive Profile','Executive Profile','Business'),
 (80,'Fashion Beauty','Fashion & Beauty','Beauty'),
 (81,'Gym','Gym & Fitness','Fitness'),
 (82,'Lawyer','Lawyer','Legal'),
 (83,'Marriage','Marriage Bureau','Wedding'),
 (84,'Modern Edge','Modern Edge','Business'),
 (85,'Musician','Musician','Music'),
 (86,'Pet Clinic','Pet Clinic','Medical'),
 (87,'Pet Shop','Pet Shop','Retail'),
 (88,'Photographer','Photographer','Creative'),
 (89,'Portfolio','Portfolio','Creative'),
 (90,'Pro Network','Pro Network','Business'),
 (91,'Professional','Professional','Business'),
 (92,'Programmer','Programmer','Tech'),
 (93,'Salon','Salon','Beauty'),
 (94,'School Template','School','Education'),
 (95,'Simple Contact','Simple Contact','Business'),
 (96,'Social Media','Social Media','Social'),
 (97,'Social Services','Social Services','Nonprofit'),
]
def color(folder):
    fs=[x for x in os.listdir(f'{SRCROOT}/{folder}') if x.endswith('.html')]
    if not fs: return '2563eb'
    t=open(f'{SRCROOT}/{folder}/{fs[0]}',encoding='utf-8',errors='replace').read(400000)
    hx=[h.lower() for h in re.findall(r'#([0-9a-fA-F]{6})',t) if h.lower() not in ('ffffff','000000','fefefe','111111','fafafa','f8f9fa')]
    return collections.Counter(hx).most_common(1)[0][0] if hx else '2563eb'
def demo(folder):
    fs=[x for x in os.listdir(f'{SRCROOT}/{folder}') if x.endswith('.html')]
    return f'../newTemps/tempsNewAdded/{folder}/{fs[0]}' if fs else ''

reg_lines=[]; fe_lines=[]
for vid,folder,name,cat in M:
    c=color(folder)
    reg_lines.append(f"    'vcard{vid}' => ['name' => '{name}', 'layout' => 'standalone', 'primary' => '#{c}', 'secondary' => '#{c}', 'bg' => '#ffffff', 'surface' => '#ffffff', 'font' => 'poppins'],")
    d=demo(folder).replace("'","\\'")
    fe_lines.append(f"    {{ id: 'vcard{vid}', name: '{name}', category: '{cat}', isNew: true, image: 'https://tapifyworld.com/assets/img/templates/vcard-v{vid}.png', demoUrl: '{d}' }},")

# ---- insert into registry ----
RP=f'{BASE}/tapify-backend/templates/_theme-registry.php'
s=open(RP,encoding='utf-8').read()
if "'vcard72'" not in s:
    s=re.sub(r"(\n\s*'vcard71' =>[^\n]*\n)", r"\1"+"\n".join(reg_lines)+"\n", s, count=1)
    open(RP,'w',encoding='utf-8').write(s); print('registry: inserted',len(reg_lines))
else: print('registry: vcard72 already present, skipped')

# ---- insert into frontend ----
FP=f'{BASE}/tapify-frontend/vcard-edit.js'
s=open(FP,encoding='utf-8').read()
if "'vcard72'" not in s:
    s=re.sub(r"(\n\s*\{ id: 'vcard71',[^\n]*\n)", r"\1"+"\n".join(fe_lines)+"\n", s, count=1)
    open(FP,'w',encoding='utf-8').write(s); print('frontend: inserted',len(fe_lines))
else: print('frontend: vcard72 already present, skipped')
print('done')
