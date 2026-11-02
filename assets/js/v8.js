/* =======================================================================
  Sun Pile Foundation V8 — browser-only FAQ chatbot + hero progress dots.
  This is NOT AI and does not send visitor messages to a server.
  To enable true AI later, connect a secure server endpoint, never a browser API key.
  Change suggested questions and answers in the FAQ object below.
======================================================================= */
(() => {
 'use strict';
 const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
 const base = (() => {
   const script = document.currentScript;
   // Relative pages in nested folders need the correct root for internal links.
   const url = script?.src || document.querySelector('link[href*="assets/css/v8.css"]')?.href;
   return url ? new URL('../../', url).href : './';
 })();
 // Sync the hero progress marks with the original carousel. No duplicate timers.
 const hero = document.querySelector('[data-hero-carousel]');
 const dots = [...document.querySelectorAll('[data-hero-dot]')];
 if (hero && dots.length) {
   const slides = [...hero.querySelectorAll('[data-slide]')];
   const pausedButton = document.querySelector('[data-hero-action="pause"]');
   let previous = -1;
   const sync = () => {
     const active = Math.max(0,slides.findIndex(s=>s.classList.contains('is-active')));
     if(active!==previous){
       previous=active;
       dots.forEach((d,i)=>{
         d.setAttribute('aria-current',String(i===active));
         d.classList.remove('is-paused');
         // restart only when the active image actually changes
         if(i===active){ d.style.animation='none'; d.offsetHeight; d.style.animation=''; }
       });
     }
     const paused = reduced || pausedButton?.getAttribute('aria-pressed')==='true';
     dots.forEach(d=>d.classList.toggle('is-paused',paused));
   };
   dots.forEach((d,i)=>d.addEventListener('click',()=>{
     const current = slides.findIndex(s=>s.classList.contains('is-active'));
     const btn = document.querySelector(i >= current ? '[data-hero-action="next"]' : '[data-hero-action="prev"]');
     // direct target selection by stepping the existing carousel controls
     for(let step=0;step<Math.abs(i-current);step++)btn?.click();
     sync();
   }));
   new MutationObserver(sync).observe(hero,{subtree:true,attributes:true,attributeFilter:['class']});
   pausedButton?.addEventListener('click',sync);
   sync();
 }
 // The assistant is deliberately factual and can always hand off to WhatsApp.
 const replies = [
  {k:['rotary','cast in situ','cast-in-situ','hydraulic'],a:'Rotary cast-in-situ piling forms reinforced concrete piles by drilling and concreting the bore. Method suitability depends on soil conditions and the project design. See the service page for details.',url:'services/bored-cast-in-situ-piles/',label:'View Rotary Piling'},
  {k:['dmc','mud circulation','bored','slurry'],a:'Bored DMC piling uses direct mud circulation during bore formation. We can discuss site access, bore size and soil information for your enquiry.',url:'services/bored-dmc-piles/',label:'View DMC Piling'},
  {k:['under reamed','under-reamed','under reamed pile','bulb'],a:'Under-reamed piles include enlarged bulbs below ground where appropriate to the design and soil conditions. Please share any geotechnical details to discuss feasibility.',url:'services/under-reamed-piles/',label:'View Under-Reamed Piles'},
  {k:['load test','load testing','vertical test','pile test'],a:'Pile load testing helps assess pile response under a specified test load. The test method, setup and reporting depend on project requirements.',url:'services/vertical-load-testing/',label:'View Pile Load Testing'},
  {k:['services','what do you do','types of piling','work available'],a:'Our four listed services are Rotary Cast-in-Situ Piles, Bored DMC Piles, Under-Reamed Piles and Pile Load Testing. Availability is subject to project scope and site feasibility.',url:'services/',label:'See all 4 Services'},
  {k:['location','address','map','where','office','directions'],a:'Sun Pile Foundation: No. 4/270, Pari Salai, Mugappair East, Chennai – 600037, Tamil Nadu. Please confirm the exact map pin before travelling.',url:'contact/',label:'Map and Contact'},
  {k:['photo','video','gallery','image','work pictures','site work'],a:'Our Site Gallery contains 54 user-provided construction photos and 2 on-site videos. They are illustrative site visuals, not verified completed-project claims.',url:'work/',label:'Open Gallery'},
  {k:['price','rate','cost','quote','quotation','estimate','budget'],a:'Pile size, depth, soil conditions, site access, testing requirements and mobilisation affect a quotation. Please share your site location, drawings and service requirement via WhatsApp or the contact form.',url:'contact/',label:'Request a Quote'},
  {k:['phone','call','contact','whatsapp','email','number'],a:'You can call +91 70947 56019 or +91 98413 50613, email sunpilefoundation26@gmail.com, or message us on WhatsApp.',url:'contact/',label:'Contact Details'},
  {k:['chennai','tamil nadu','india','service area','coimbatore','madurai'],a:'The company is based in Chennai and accepts enquiries from Tamil Nadu and other Indian locations depending on project scope and mobilisation.',url:'areas/',label:'Service Areas'},
 ];
 const glyph = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.7 8.7 0 0 1-9 9 9 9 0 0 1-4.7-1.4L3 21l1.8-4.6A9 9 0 1 1 21 11.5Z"/><path d="M8 10h8M8 14h5"/></svg>';
 const openIcon = '<svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 12h12m-6-6 6 6-6 6"/></svg>';
 const launcher = document.createElement('button');launcher.type='button';launcher.className='v8-chat-launch';launcher.setAttribute('aria-expanded','false');launcher.setAttribute('aria-controls','v8-chat-panel');launcher.setAttribute('aria-label','Open Sun Pile website assistant');launcher.innerHTML=glyph+'<span class="v8-chat-label">ASK SUN PILE</span>';
 const panel=document.createElement('section');panel.id='v8-chat-panel';panel.className='v8-chat-panel';panel.hidden=true;panel.setAttribute('aria-label','Sun Pile website assistant');
 panel.innerHTML=`<div class="v8-chat-head"><div class="v8-chat-avatar" aria-hidden="true">SP</div><div><strong>Sun Pile Assistant</strong><small>Instant website FAQ • No sign-in</small></div><button class="v8-chat-close" type="button" aria-label="Close chat">✕</button></div><div class="v8-chat-disclaimer">Automated site guide, not a live person or AI engineer. For pricing or designs, speak to the team.</div><div class="v8-chat-messages" role="log" aria-live="polite" aria-relevant="additions"></div><div class="v8-chat-quick" aria-label="Common questions"></div><form class="v8-chat-form"><label class="sr-only" for="v8-chat-input">Your question</label><input id="v8-chat-input" name="question" placeholder="Ask about piling or quotations…" maxlength="280" autocomplete="off" required/><button type="submit" aria-label="Send question">${openIcon}</button></form><div class="v8-chat-contact"><a href="https://wa.me/917094756019?text=Hello%20Sun%20Pile%20Foundation%2C%20I%20have%20a%20piling%20enquiry." target="_blank" rel="noopener noreferrer">WhatsApp the team ↗</a><a href="${base}contact/">Contact details ↗</a></div>`;
 document.body.append(launcher,panel);
 const messages=panel.querySelector('.v8-chat-messages');
 const input=panel.querySelector('input');
 const quick=panel.querySelector('.v8-chat-quick');
 const addBubble=(txt,who,link)=>{
   const bubble=document.createElement('div');bubble.className='v8-bubble '+who;
   bubble.textContent=txt;
   if(link){const a=document.createElement('a');a.href=base+link.url;a.textContent='\n'+link.label+' ↗';a.style.cssText='display:block;margin-top:8px;font-weight:900;color:#b25b15;text-decoration:underline';bubble.append(a)}
   messages.append(bubble);messages.scrollTop=messages.scrollHeight;
 };
 const response=question=>{
   addBubble(question,'user');
   const q=question.toLowerCase().replace(/[^a-z0-9 +\-]/g,' ');
   const match=replies.find(entry=>entry.k.some(k=>q.includes(k)));
   if(match)addBubble(match.a,'bot',match);
   else addBubble('I can help with our four piling and testing services, project enquiries, photos/videos, location and contact details. For anything site-specific, please contact our team on WhatsApp.','bot',{url:'contact/',label:'Contact the team'});
 };
 const toggle=force=>{
   const show=typeof force==='boolean'?force:panel.hidden;
   panel.hidden=!show;
   launcher.setAttribute('aria-expanded',String(show));
   if(show){if(!messages.childElementCount)addBubble('Vanakkam! Welcome to Sun Pile Foundation. Ask about our four services, site photos, Chennai location, or request a quotation.','bot');input.focus({preventScroll:true})}
   else launcher.focus({preventScroll:true});
 };
 launcher.addEventListener('click',()=>toggle());
 panel.querySelector('.v8-chat-close').addEventListener('click',()=>toggle(false));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)toggle(false)});
 panel.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const question=input.value.trim().slice(0,280);if(question){response(question);input.value='';input.focus()}});
 ['Our 4 services','Request a quote','Site photos & videos','Office location'].forEach(label=>{
  const btn=document.createElement('button');btn.type='button';btn.textContent=label;
  btn.addEventListener('click',()=>response(label));quick.append(btn)
 });
})();
