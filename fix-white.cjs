const fs = require('fs');

const file = 'src/pages/dashboard/ProDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/dark:text-white/g, 'dark:!text-white');
content = content.replace(/dark:!text-white\//g, 'dark:!text-white/'); // fix alpha channels

fs.writeFileSync(file, content);
console.log("forced white in dark mode");
