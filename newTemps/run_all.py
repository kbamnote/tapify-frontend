# Driver: build all tempsNewAdded/* into vcard72+ via build_new.py
import io,sys,os,re,subprocess,collections
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')
BASE='D:/Print World/tapify/tapify-frontend/newTemps'
ASSET_ROOT='D:/Print World/tapify/tapify-backend/images/templates'
SRC='tempsNewAdded'
folders=sorted(d for d in os.listdir(f'{BASE}/{SRC}') if os.path.isdir(f'{BASE}/{SRC}/{d}'))

def slugify(n):
    return re.sub(r'[^a-z0-9]','',n.lower())

def free_slug(base):
    s=base
    while os.path.isdir(f'{ASSET_ROOT}/{s}'):
        s+='x'
    return s

def detect_color(folder):
    f=[x for x in os.listdir(f'{BASE}/{SRC}/{folder}') if x.endswith('.html')]
    if not f: return '2563eb'
    txt=open(f'{BASE}/{SRC}/{folder}/{f[0]}',encoding='utf-8',errors='replace').read(400000)
    hexes=[h.lower() for h in re.findall(r'#([0-9a-fA-F]{6})',txt)]
    hexes=[h for h in hexes if h not in ('ffffff','000000','fefefe','111111','fafafa','f8f9fa')]
    if not hexes: return '2563eb'
    return collections.Counter(hexes).most_common(1)[0][0]

rows=[]
vid=72
for folder in folders:
    slug=free_slug(slugify(folder))
    color=detect_color(folder)
    r=subprocess.run([sys.executable,f'{BASE}/build_new.py',f'{SRC}/{folder}',slug,f'vcard{vid}',color,'Poppins','0'],
                     capture_output=True,text=True,encoding='utf-8')
    out=r.stdout+r.stderr
    flags={k:('True' in [ln.split(k)[1][:6] for ln in out.splitlines() if ln.startswith(k)] or ['?'])[0] if any(ln.startswith(k) for ln in out.splitlines()) else '?' for k in ['name dynamic','banner','social','svc','bh']}
    def g(key):
        for ln in out.splitlines():
            if ln.startswith(key): return ln[len(key):].strip()
        return '?'
    wrote=[ln for ln in out.splitlines() if ln.startswith('WROTE')]
    rows.append((f'vcard{vid}',folder,slug,color,g('name dynamic'),g('social'),g('banner'),g('svc'),g('bh'),(wrote[0] if wrote else 'FAILED: '+out.strip()[-200:])))
    vid+=1

print(f'{"ID":9} {"FOLDER":26} {"SLUG":22} {"COL":7} {"name":6} {"soc":6} {"banner":10} {"svc":6} {"bh":6} WROTE')
for r in rows:
    print(f'{r[0]:9} {r[1][:26]:26} {r[2]:22} {r[3]:7} {r[4][:6]:6} {r[5][:6]:6} {r[6][:10]:10} {r[7][:6]:6} {r[8][:6]:6} {r[9][:40]}')
print(f'\nTotal: {len(rows)} templates built (vcard72..vcard{vid-1})')
