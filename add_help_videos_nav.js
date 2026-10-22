/** One-off: add the Help Videos link to every admin sidebar. Idempotent.
 *  Sidebar is duplicated per admin HTML file (no include) — same pattern as
 *  add_webinar_nav.js and add_pg_nav.js. Inserted after Payment Gateway. */
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'admin');
const LINK = '\n            <a href="help-videos.html" class="nav-item">'
  + '<i class="fas fa-circle-play nav-icon" style="color:#8338ec"></i>'
  + '<span>Help Videos</span></a>';
let added = 0, already = 0, miss = [];
for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html'))) {
  const p = path.join(dir, f); const c = fs.readFileSync(p, 'utf8');
  if (c.includes('href="help-videos.html"')) { already++; continue; }
  const re = /(<a href="payment-gateway\.html"[^>]*>.*?<\/a>)/s, m = c.match(re);
  if (!m) { miss.push(f); continue; }
  fs.writeFileSync(p, c.replace(re, m[1] + LINK), 'utf8'); added++;
}
console.log(`Added to ${added}; ${already} already had it.`);
if (miss.length) console.log('No Payment Gateway link in: ' + miss.join(', '));
