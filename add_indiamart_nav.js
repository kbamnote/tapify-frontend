/** One-off: add the IndiaMART Leads link to every customer-dashboard sidebar.
 *  The sidebar is duplicated in each HTML file (there is no include), so the
 *  link has to be inserted file by file — same approach as add_pg_nav.js.
 *  Idempotent: a page that already has it is left alone.
 *
 *  Inserted after Lead Extractor, which is the nearest thing to it in the nav.
 *  Pages without that link are reported rather than guessed at, so nothing is
 *  dropped into an unexpected spot. */
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'dashboard');
const LINK = '\n            <a href="indiamart" class="nav-item">'
  + '<i class="fas fa-store nav-icon" style="color:#2d3092"></i>'
  + '<span>IndiaMART Leads</span></a>';

let added = 0, already = 0, miss = [];
for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html'))) {
  const p = path.join(dir, f);
  const c = fs.readFileSync(p, 'utf8');
  if (c.includes('href="indiamart"')) { already++; continue; }
  // Match the Lead Extractor anchor however its classes are ordered, and
  // whether or not it carries the `active` class on its own page.
  const re = /(<a href="lead-extractor"[^>]*>[\s\S]*?<\/a>)/, m = c.match(re);
  if (!m) { miss.push(f); continue; }
  fs.writeFileSync(p, c.replace(re, m[1] + LINK), 'utf8');
  added++;
}
console.log(`Added to ${added}; ${already} already had it.`);
if (miss.length) console.log('No Lead Extractor link in: ' + miss.join(', '));
