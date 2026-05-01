const fs = require('fs');

const files = [
  'public/presentation-agents.html',
  'public/presentation-cgp.html',
  'public/presentation-notaires.html',
  'public/presentation-courtiers.html'
];

const backButtonHtml = `
<a href="/" class="back-button" style="position: fixed; top: 20px; left: 20px; background: #0F2A3F; color: #D4AF37; text-decoration: none; padding: 10px 15px; border-radius: 50px; font-weight: bold; font-family: 'Inter', sans-serif; font-size: 0.9rem; z-index: 1000; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: 0.2s;">
  <i class="fas fa-arrow-left"></i> Retour au site
</a>
<style>
 .back-button:hover { transform: scale(1.02); background: white; color: #0F2A3F; border: 1px solid #D4AF37; }
 @media print { .back-button { display: none !important; } }
</style>
`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('id="backBtn"')) {
      content = content.replace('<body>', '<body>\n' + backButtonHtml.replace('class="back-button"', 'id="backBtn" class="back-button"'));
      fs.writeFileSync(file, content);
  }
}
console.log('Done injecting back button');
