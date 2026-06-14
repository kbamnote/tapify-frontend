import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard70.php', encoding='utf-8').read()


def block(label, startpat, endpat):
    m = re.search(startpat, h)
    if not m:
        print('==' + label + '== NOMATCH'); return
    e = re.search(endpat, h[m.start():])
    seg = h[m.start():m.start() + e.end()]
    print('==' + label + ' len=' + str(len(seg)) + '==')
    print(seg)
    print()


block('SERVICES', r'<\?php foreach \(\(isset\(\$__sv\)', r'<\?php endforeach; \?>')
block('GALLERY', r'<\?php foreach \(\(isset\(\$__ga\)', r'endforeach; endforeach; \?>')
block('PRODUCTS', r'<\?php foreach \(\(isset\(\$__pr\)', r'<\?php endforeach; \?>')
block('TESTI', r'<\?php foreach \(\(isset\(\$__te\)', r'<\?php endforeach; \?>')
block('BH', r'<\?php foreach \(\(isset\(\$__bh\)', r'<\?php endforeach; \?>')
block('COVER', r'<\?php \$cvType', r'\?>\s*<div style="position:absolute;inset:0;border-radius:inherit')
