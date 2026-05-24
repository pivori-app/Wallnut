const fs = require('fs');

const file = 'src/pages/dashboard/ProDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/text-app-sm/g, 'text-sm');
content = content.replace(/text-app-xs/g, 'text-xs');

fs.writeFileSync(file, content);

console.log("more fixes applied");
