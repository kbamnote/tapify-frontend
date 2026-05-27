const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'admin');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'notifications.html');

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('href="settings.html"') && !content.includes('href="notifications.html"')) {
    // Find the settings link and insert the notifications link after it
    // Handle both <a href="settings.html"...>...</a>
    // and active states
    const settingsRegex = /(<a href="settings\.html"[^>]*>.*?<\/a>)/s;
    const match = content.match(settingsRegex);
    if (match) {
      const newLink = `\n            <a href="notifications.html" class="nav-item"><i class="fas fa-bell nav-icon icon-notifications"></i><span>Push Notifications</span></a>`;
      content = content.replace(settingsRegex, match[1] + newLink);
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
    }
  }
}

console.log(`Updated ${updatedCount} files.`);
