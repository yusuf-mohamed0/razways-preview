/* Prototype enhancement only. Production transactions belong to native Odoo. */
document.querySelectorAll('.rw-site').forEach(root => {
  root.classList.add('rw-js');
  const menu = root.querySelector('.rw-menu'), nav = root.querySelector('.rw-nav');
  function closeMenu() { menu.setAttribute('aria-expanded','false'); nav.classList.remove('rw-open'); menu.textContent='Menu'; }
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('rw-open', open); menu.textContent = open ? 'Close menu' : 'Menu';
  });
  nav?.addEventListener('keydown', e => { if(e.key==='Escape'){closeMenu();menu.focus();} });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  const dialog = root.querySelector('dialog');
  root.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
    dialog.querySelector('img').src = button.dataset.photo; dialog.querySelector('img').alt = button.dataset.caption;
    dialog.querySelector('[data-caption]').textContent = button.dataset.caption; dialog.showModal();
  }));
  dialog?.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  root.querySelectorAll('[data-demo-form]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault(); const feedback = form.querySelector('.rw-feedback'); feedback.hidden=false;
    feedback.textContent='Preview complete. Your information has not been sent or saved. The live Odoo form will send this request to the RazWays team.'; feedback.focus();
  }));
  const booking = root.querySelector('[data-booking]'); if (!booking) return;
  let step=1;
  const stages=[...booking.querySelectorAll('.rw-stage')], progress=[...root.querySelectorAll('.rw-book-steps li')], qty=booking.querySelector('[name=quantity]');
  function update(){
    const n=Number(qty.value); root.querySelectorAll('[data-quantity]').forEach(el=>el.textContent=`${n} ${n===1?'guest':'guests'}`);
    root.querySelectorAll('[data-total]').forEach(el=>el.textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n*2500));
    booking.querySelectorAll('[data-guest]').forEach(el=>{el.hidden=Number(el.dataset.guest)>n;el.disabled=el.hidden;});
  }
  function show(n){step=n;stages.forEach((el,i)=>el.hidden=i!==n-1);progress.forEach((el,i)=>{if(i===n-1)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});stages[n-1].querySelector('h2').focus({preventScroll:true});booking.scrollIntoView({block:'start',behavior:'instant'});update();}
  qty.addEventListener('change',update);
  booking.querySelectorAll('[data-next]').forEach(button=>button.addEventListener('click',()=>{const invalid=[...stages[step-1].querySelectorAll('input,select,textarea')].find(el=>!el.disabled&&!el.checkValidity());if(invalid){invalid.reportValidity();return;}show(Math.min(step+1,5));}));
  booking.querySelectorAll('[data-back]').forEach(button=>button.addEventListener('click',()=>show(Math.max(step-1,1))));
  root.querySelectorAll('[data-payment-state]').forEach(button=>button.addEventListener('click',()=>{
    const states={success:['Payment confirmed — preview','The live confirmation will show the booking reference, participant names, receipt and next steps after Odoo verifies payment. No reservation or payment was created in this preview.'],pending:['Payment is still processing','On the live site, keep the order reference and check its status before paying again. A pending payment is not a confirmed booking. This is an example state.'],failed:['Payment was not completed','On the live site, return to the same order to try another available payment method, or contact RazWays with the order reference. This is an example state.']};
    const [title,text]=states[button.dataset.paymentState];root.querySelector('[data-result-title]').textContent=title;root.querySelector('[data-result-text]').textContent=text;show(5);
  }));
  root.querySelector('[data-sold-out]')?.addEventListener('click',()=>{const notice=root.querySelector('[data-capacity-notice]');notice.hidden=!notice.hidden;booking.querySelector('[data-start-booking]').disabled=!notice.hidden;});
  root.querySelector('[data-reset-booking]')?.addEventListener('click',()=>{root.querySelector('[data-capacity-notice]').hidden=true;booking.querySelector('[data-start-booking]').disabled=false;show(1);});
  update();
});
