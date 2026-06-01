/* Shared animations for vcard1–42 demo templates */
(function(){
  // Fade-in on scroll
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); }});
  }, {threshold: 0.1});
  document.querySelectorAll('.fade').forEach(el => { el.style.opacity='0'; el.style.transform='translateY(22px)'; el.style.transition='opacity .6s ease, transform .6s ease'; obs.observe(el); });

  // Cover zoom-pan effect
  const coverImg = document.querySelector('.cover-section img');
  if(coverImg){ coverImg.style.transition='transform 10s ease-out'; coverImg.style.transform='scale(1)'; setTimeout(()=>{ coverImg.style.transform='scale(1.08)'; },100); }

  // Quick-action hover ripple
  document.querySelectorAll('.quick-action').forEach(btn=>{
    btn.addEventListener('mouseenter',function(){ this.style.transform='translateY(-3px) scale(1.05)'; });
    btn.addEventListener('mouseleave',function(){ this.style.transform=''; });
  });

  // Save button pulse
  const saveBtn = document.querySelector('.save-contact-btn');
  if(saveBtn){
    saveBtn.addEventListener('click', function(e){
      e.preventDefault();
      this.textContent = '✓ Saved!';
      this.style.opacity = '.7';
      setTimeout(()=>{ this.innerHTML = '<i class="fas fa-user-plus"></i> Save to Contacts'; this.style.opacity=''; }, 1800);
    });
  }

  // Fade in all sections with a stagger
  document.querySelectorAll('.section, .quick-actions, .profile-section, .vcard-footer').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity .5s ease ${i*0.08}s, transform .5s ease ${i*0.08}s`;
    const sObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.style.opacity='1'; e.target.style.transform='none'; sObs.unobserve(e.target); }});
    }, {threshold: 0.05});
    sObs.observe(el);
  });
})();
