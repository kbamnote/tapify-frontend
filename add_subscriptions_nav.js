/**
 * One-off: add the Subscriptions link to every admin page's sidebar.
 *
 * The sidebar is duplicated in all 27 admin HTML files rather than included
 * from one place, so a new nav item has to be written into each of them. This
 * mirrors add_sidebar.js, which did the same job for Push Notifications.
 *
 *   node add_subscriptions_nav.js
 *
 * Idempotent: a file that already has the link is skipped, so re-running does
 * nothing. Inserted after the Users link, because Subscriptions is the other
 * half of the same question — who the customer is, and what they are paying.
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'admin');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const LINK = '\n            <a href="subscriptions.html" class="nav-item">'
           + '<i class="fas fa-gem nav-icon" style="color:#8338ec"></i>'
           + '<span>Subscriptions</span></a>';

let added = 0, already = 0, noAnchor = [];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('href="subscriptions.html"')) { already++; continue; }

  // Match the Users link whatever classes it carries (it is `active` on
  // users.html and plain everywhere else).
  const usersLink = /(<a href="users\.html"[^>]*>.*?<\/a>)/s;
  const m = content.match(usersLink);
  if (!m) { noAnchor.push(file); continue; }

  content = content.replace(usersLink, m[1] + LINK);
  fs.writeFileSync(filePath, content, 'utf8');
  added++;
}

console.log(`Added to ${added} file(s); ${already} already had it.`);
if (noAnchor.length) {
  console.log('No Users link found in (add by hand if these need it): ' + noAnchor.join(', '));
}
