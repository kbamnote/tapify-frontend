# Post-pass for vcard66 (Travel Agency) after build_generic.py.
# Handles the bits the generic builder can't: SVG-based social icons,
# static demo QR, static DOB/location, add-contact link, dead demo links,
# and wires the template's own appointment UI to the existing backend.
import io, re, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
F = 'D:/Print World/tapify/tapify-backend/templates/vcard66.php'
h = open(F, encoding='utf-8').read()
orig_len = len(h)


def balanced_span(s, start):
    """Given index of a '<div' opening tag, return index just past its matching </div>."""
    depth = 0
    for t in re.finditer(r'<div\b|</div>', s[start:]):
        depth += 1 if t.group(0) == '<div' else -1
        if depth == 0:
            return start + t.end()
    return -1


# ---- 1) Social media section -> dynamic $socialLinks (keep span.social-icon markup) ----
SOC_INNER = ('<div class="d-flex flex-wrap justify-content-center gap-2 gap-sm-3">'
             '<?php foreach ($socialLinks as $s): $ic=$platformIcons[$s["platform"]] ?? "fa-globe"; ?>'
             '<span class="social-icon d-flex justify-content-center align-items-center">'
             '<a href="<?= htmlspecialchars($s["url"]) ?>" target="_blank" rel="noopener">'
             '<i class="fab <?= $ic ?>"></i></a></span>'
             '<?php endforeach; ?></div>')
m = re.search(r'<div class="social-media-section[^"]*"[^>]*>', h)
ok = False
if m:
    sec_end = balanced_span(h, m.start())
    mi = re.search(r'<div class="d-flex flex-wrap justify-content-center[^"]*"[^>]*>', h[m.end():sec_end])
    if mi:
        inner_start = m.end() + mi.start()
        inner_end = balanced_span(h, inner_start)
        h = h[:inner_start] + SOC_INNER + h[inner_end:]
        # recompute section end after edit, then wrap section in if-not-empty
        sec_end = balanced_span(h, m.start())
        h = (h[:m.start()] + '<?php if(!empty($socialLinks)): ?>' + h[m.start():sec_end]
             + '<?php endif; ?>' + h[sec_end:])
        ok = True
print('social:', ok)

# ---- 2) Static demo QR svg -> dynamic QR for this card's real URL ----
m = re.search(r'(id=qr-code-thirtysix>\s*)<svg[\s\S]*?</svg>', h)
ok = False
if m:
    h = (h[:m.start(1)] + m.group(1)
         + '<img src="<?= $qrUrl ?>" alt="QR Code" width="130" height="130" loading="lazy">'
         + h[m.end():])
    ok = True
print('qr:', ok)


# ---- 3) DOB + location contact boxes -> $vcard fields (hide box when empty) ----
def dynamic_contact_box(html, static_text, php_value, cond_field):
    """Replace static text inside its col-sm-6 contact box and wrap box in a PHP if."""
    i = html.find(static_text)
    if i < 0:
        return html, False
    col = html.rfind('<div class=col-sm-6>', 0, i)
    if col < 0:
        return html, False
    end = balanced_span(html, col)
    block = html[col:end].replace(static_text, php_value)
    block = ('<?php if(!empty($vcard["' + cond_field + '"])): ?>' + block + '<?php endif; ?>')
    return html[:col] + block + html[end:], True


h, ok = dynamic_contact_box(
    h, '12th June, 1885',
    '<?= htmlspecialchars(date("jS F, Y", strtotime($vcard["dob"]))) ?>', 'dob')
print('dob:', ok)
h, ok = dynamic_contact_box(
    h, 'India, Mumbai',
    '<?= htmlspecialchars($vcard["location"]) ?>', 'location')
print('location:', ok)

# ---- 4) Add-to-contact bar -> shared saveContact() (.vcf download) ----
h, n = re.subn(r'href=https://tapifyworld\.com/add-contact/\d+', 'href="javascript:saveContact()"', h)
print('add-contact:', n)

# ---- 5) Dead demo links: "View More Products" page doesn't exist here -> hide ----
h, n = re.subn(r'(<a [^>]*view-more[^>]*)href=https://tapifyworld\.com[^\s>]*([^>]*>)',
               r'\1href="javascript:void(0)" style="display:none!important"\2', h)
print('view-more hidden:', n)

# ---- 6) Appointment: wire #pickUpDate + #slotData to existing backend APIs ----
APPT_JS = '''<script>
(function(){
  var dateEl=document.getElementById('pickUpDate'),slotWrap=document.getElementById('slotData');
  var btn=document.querySelector('.appointmentAdd');
  if(!dateEl||!slotWrap)return;
  var chosen={date:'',time:'',label:''};
  function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML;}
  function loadSlots(date){
    chosen.date=date;chosen.time='';
    if(btn){btn.classList.add('d-none');}
    slotWrap.innerHTML='<div class="col-12 text-center py-2" style="color:#40b5c5">Loading slots\\u2026</div>';
    fetch('/api/appointments/slots_public.php?vcard_id=<?= $vcardId ?>&date='+encodeURIComponent(date))
      .then(function(r){return r.json();})
      .then(function(res){
        slotWrap.innerHTML='';
        var slots=(res&&res.success&&res.data)?res.data:[];
        if(!slots.length){slotWrap.innerHTML='<div class="col-12 text-center py-2" style="color:#6b7280">No slots available for this date.</div>';return;}
        slots.forEach(function(s){
          var v=(s&&s.value)||s,l=(s&&s.label)||s;
          var c=document.createElement('div');c.className='col-6 col-sm-4 mt-2';
          var b=document.createElement('button');b.type='button';b.className='btn tf-slot w-100';b.textContent=l;
          b.onclick=function(){
            slotWrap.querySelectorAll('.tf-slot').forEach(function(x){x.classList.remove('active');});
            b.classList.add('active');chosen.time=v;chosen.label=l;
            if(btn){btn.classList.remove('d-none');btn.classList.remove('sf-hidden');}
          };
          c.appendChild(b);slotWrap.appendChild(c);
        });
      })
      .catch(function(){slotWrap.innerHTML='<div class="col-12 text-center py-2" style="color:#6b7280">Could not load slots.</div>';});
  }
  function hookFlatpickr(){
    if(dateEl._flatpickr){dateEl._flatpickr.config.onChange.push(function(sel,str){if(str)loadSlots(str);});}
    else if(window.flatpickr){flatpickr(dateEl,{minDate:'today',dateFormat:'Y-m-d',onChange:function(sel,str){if(str)loadSlots(str);}});}
    else{return setTimeout(hookFlatpickr,150);}
  }
  hookFlatpickr();
  dateEl.addEventListener('change',function(){if(dateEl.value)loadSlots(dateEl.value);});

  // Minimal booking dialog (template-styled); posts to the existing endpoint.
  var overlay=null;
  function openBookForm(){
    if(overlay){overlay.remove();}
    overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px';
    overlay.innerHTML='<div style="background:linear-gradient(0deg,#f9fcfc,#c2e2e6);border:2px solid #40b5c5;border-radius:0 30px 0 30px;max-width:380px;width:100%;padding:24px" onclick="event.stopPropagation()">'
      +'<h5 style="color:#144660;font-weight:600;margin-bottom:4px">Make an Appointment</h5>'
      +'<p style="font-size:13px;color:#6b7280;margin-bottom:14px">'+esc(chosen.date)+' \\u00b7 '+esc(chosen.label)+'</p>'
      +'<input id="tfApName" class="form-control" placeholder="Your Name *" style="margin-bottom:10px">'
      +'<input id="tfApPhone" class="form-control" type="tel" placeholder="Phone Number *" style="margin-bottom:10px">'
      +'<input id="tfApEmail" class="form-control" type="email" placeholder="Email (optional)" style="margin-bottom:14px">'
      +'<div style="display:flex;gap:10px;justify-content:flex-end">'
      +'<button type="button" id="tfApCancel" class="btn" style="border:1px solid #40b5c5;color:#40b5c5;border-radius:0 14px 0 14px">Cancel</button>'
      +'<button type="button" id="tfApGo" class="btn" style="background:#40b5c5;color:#fff;border-radius:0 14px 0 14px">Book Now</button>'
      +'</div></div>';
    overlay.addEventListener('click',function(){overlay.remove();overlay=null;});
    document.body.appendChild(overlay);
    document.getElementById('tfApCancel').onclick=function(){overlay.remove();overlay=null;};
    document.getElementById('tfApGo').onclick=function(){
      var name=document.getElementById('tfApName').value.trim();
      var phone=document.getElementById('tfApPhone').value.trim();
      var email=document.getElementById('tfApEmail').value.trim();
      if(!name||!phone){if(typeof showToast==='function')showToast('Name and phone are required','error');return;}
      var go=document.getElementById('tfApGo');go.disabled=true;go.textContent='Booking\\u2026';
      fetch('/appointment-submit.php',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({vcard_id:<?= $vcardId ?>,name:name,phone:phone,email:email,date:chosen.date,time:chosen.time})})
        .then(function(r){return r.json();})
        .then(function(res){
          if(res.success){if(typeof showToast==='function')showToast('\\u2713 Appointment booked! We will confirm shortly.','success');overlay.remove();overlay=null;}
          else{if(typeof showToast==='function')showToast(res.message||'Failed to book','error');go.disabled=false;go.textContent='Book Now';}
        })
        .catch(function(){if(typeof showToast==='function')showToast('Connection error','error');go.disabled=false;go.textContent='Book Now';});
    };
  }
  if(btn){btn.addEventListener('click',openBookForm);}
})();
</script>'''

# ---- 7) Travel-specific CSS (white font icons on animated badges, QR img, slot chips) ----
EXTRA_CSS = ('<style>'
             '.social-media-section .social-icon i{color:#fff!important;font-size:24px;position:relative;z-index:1}'
             '@media (max-width:575px){.social-media-section .social-icon i{font-size:20px}}'
             '.qr-code-section .qr-code .qr-code-img img{border-radius:6px;width:100%;height:100%;object-fit:contain;background:#fff}'
             '.tf-slot{border:1px solid #40b5c5!important;color:#40b5c5!important;border-radius:0 14px 0 14px!important;font-size:14px!important;padding:8px 6px!important;background:#fff!important}'
             '.tf-slot.active{background:#40b5c5!important;color:#fff!important}'
             '.appointment-section .appointmentAdd{display:inline-block}'
             '.appointment-section .appointmentAdd.d-none{display:none}'
             '</style>')

anchor = '<?php if(!empty($vcard["custom_js"])): ?>'
assert anchor in h
h = h.replace(anchor, EXTRA_CSS + APPT_JS + anchor, 1)
print('appointment js + css: True')

open(F, 'w', encoding='utf-8').write(h)
print('WROTE', F, orig_len, '->', len(h), 'bytes | tapifyworld visible refs:',
      len(re.findall(r'tapifyworld\.com', h)))
