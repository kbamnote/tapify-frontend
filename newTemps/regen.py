# Regenerate vcard72..97 in place, reusing each file's existing slug + source folder.
import io,sys,os,re,subprocess,collections
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')
BASE='D:/Print World/tapify'
TPL=f'{BASE}/tapify-backend/templates'
SRCROOT=f'{BASE}/tapify-frontend/newTemps'

def detect_color(folder):
    p=f'{SRCROOT}/{folder}'
    fs=[x for x in os.listdir(p) if x.endswith('.html')]
    if not fs: return '2563eb'
    t=open(f'{p}/{fs[0]}',encoding='utf-8',errors='replace').read(400000)
    hx=[h.lower() for h in re.findall(r'#([0-9a-fA-F]{6})',t) if h.lower() not in ('ffffff','000000','fefefe','111111','fafafa','f8f9fa')]
    return collections.Counter(hx).most_common(1)[0][0] if hx else '2563eb'

rows=[]
for vid in range(72,98):
    fp=f'{TPL}/vcard{vid}.php'
    head=open(fp,encoding='utf-8',errors='replace').read(4000)
    mf=re.search(r'auto-generated from (.+?) \(hosted',head)
    ms=re.search(r'/images/templates/([a-z0-9]+)/',open(fp,encoding='utf-8',errors='replace').read(200000))
    if not mf or not ms:
        rows.append((vid,'??','??','MISSING META')); continue
    folder=mf.group(1); slug=ms.group(1); color=detect_color(folder)
    r=subprocess.run([sys.executable,f'{SRCROOT}/build_new.py',folder,slug,f'vcard{vid}',color,'Poppins','0'],
                     capture_output=True,text=True,encoding='utf-8')
    out=(r.stdout+r.stderr)
    def g(k):
        for ln in out.splitlines():
            if ln.startswith(k): return ln[len(k):].strip()
        return '?'
    rows.append((vid,folder.split('/')[-1][:22],slug,f"name={g('name dynamic:')} soc={g('social')} ban={g('banner')} | {[l for l in out.splitlines() if l.startswith('WROTE')] or out.strip()[-80:]}"))

for r in rows:
    print(f"vcard{r[0]} {r[1]:22} {r[2]:20} {r[3]}")
