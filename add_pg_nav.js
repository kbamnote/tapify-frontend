/** One-off: add the Payment Gateway link to every admin sidebar. Idempotent.
 *  The sidebar is duplicated in all admin HTML files (no include), same as
 *  add_subscriptions_nav.js. Inserted after the Subscriptions link. */
const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'admin');
const LINK='\n            <a href="payment-gateway.html" class="nav-item">'
  +'<i class="fas fa-credit-card nav-icon" style="color:#16a34a"></i>'
  +'<span>Payment Gateway</span></a>';
let added=0,already=0,miss=[];
for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.html'))){
  const p=path.join(dir,f); let c=fs.readFileSync(p,'utf8');
  if(c.includes('href="payment-gateway.html"')){already++;continue;}
  const re=/(<a href="subscriptions\.html"[^>]*>.*?<\/a>)/s, m=c.match(re);
  if(!m){miss.push(f);continue;}
  fs.writeFileSync(p,c.replace(re,m[1]+LINK),'utf8'); added++;
}
console.log(`Added to ${added}; ${already} already had it.`);
if(miss.length) console.log('No Subscriptions link in: '+miss.join(', '));
