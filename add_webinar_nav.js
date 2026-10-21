/** One-off: add the Webinar link to every admin sidebar. Idempotent.
 *  Sidebar is duplicated per admin HTML file (no include) — same pattern as
 *  add_subscriptions_nav.js and add_pg_nav.js. Inserted after Payment Gateway. */
const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'admin');
const LINK='\n            <a href="webinar.html" class="nav-item">'
  +'<i class="fas fa-chalkboard-user nav-icon" style="color:#e11d48"></i>'
  +'<span>Webinar</span></a>';
let added=0,already=0,miss=[];
for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.html'))){
  const p=path.join(dir,f); const c=fs.readFileSync(p,'utf8');
  if(c.includes('href="webinar.html"')){already++;continue;}
  const re=/(<a href="payment-gateway\.html"[^>]*>.*?<\/a>)/s, m=c.match(re);
  if(!m){miss.push(f);continue;}
  fs.writeFileSync(p,c.replace(re,m[1]+LINK),'utf8'); added++;
}
console.log(`Added to ${added}; ${already} already had it.`);
if(miss.length) console.log('No Payment Gateway link in: '+miss.join(', '));
