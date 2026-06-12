import io, re, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard66.php'
h = open(F, encoding='utf-8').read()
orig = len(h)

# 1) date field -> native HTML5 date picker (no CDN, opens everywhere)
old_in = '<input class="date appoint-input form-control appointment-input flatpickr-input" placeholder="Pick a Date" id=pickUpDate name=date type=text readonly value>'
new_in = '<input class="date appoint-input form-control appointment-input" placeholder="Pick a Date" id="pickUpDate" name="date" type="date" min="<?= date(\'Y-m-d\') ?>" style="cursor:pointer;">'
assert old_in in h, 'pickUpDate input not found'
h = h.replace(old_in, new_in, 1)
print('1 native date input: ok')

# 2) remove the slick-block flatpickr inits (would otherwise hijack the field if CDN loaded)
slick_fp = 'if(window.flatpickr){flatpickr("#pickUpDate",{minDate:"today",dateFormat:"Y-m-d"});flatpickr(".flatpickr-input",{minDate:"today",dateFormat:"Y-m-d"});}'
assert slick_fp in h, 'slick flatpickr init not found'
h = h.replace(slick_fp, '', 1)
print('2 slick flatpickr init removed: ok')

# 3) drop the hookFlatpickr block in the appointment JS (native handles it; the change listener stays)
m = re.search(r'function hookFlatpickr\(\)\{[\s\S]*?\}\s*hookFlatpickr\(\);', h)
assert m, 'hookFlatpickr block not found'
h = h[:m.start()] + h[m.end():]
print('3 hookFlatpickr removed: ok')

open(F, 'w', encoding='utf-8').write(h)
print('WROTE', orig, '->', len(h))
