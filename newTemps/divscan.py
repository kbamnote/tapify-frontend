import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
h = open('D:/Print World/tapify/tapify-backend/templates/vcard69.php', encoding='utf-8').read()
# strip <script> and <style> and svg to avoid noise
clean = re.sub(r'<script[\s\S]*?</script>', '', h)
clean = re.sub(r'<style[\s\S]*?</style>', '', clean)
clean = re.sub(r'<svg[\s\S]*?</svg>', '', clean)
stack = []
for m in re.finditer(r'<div\b[^>]*>|</div>', clean):
    t = m.group(0)
    if t.startswith('</'):
        if stack:
            stack.pop()
        else:
            print('STRAY </div> at', m.start(), '->', re.sub(r'\s+', ' ', clean[m.start()-80:m.start()+10]))
    else:
        stack.append(m.start())
print('unclosed <div> count:', len(stack))
for pos in stack[-3:]:
    print('UNCLOSED <div> near:', re.sub(r'\s+', ' ', clean[pos-60:pos+90]))
