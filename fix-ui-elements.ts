import fs from 'fs';

const files = [
  'src/pages/RegisterForm.tsx',
  'src/pages/CompleteProfile.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace labels
    content = content.replace(/<label(.*?)className="[^"]*"/g, (match, p1) => {
      // check if it has ml-1 or others, but enforce text-[13px] font-medium text-gray-700
      return `<label${p1}className="text-[13px] font-medium text-gray-700 mb-1 block ml-1"`;
    });

    // Replace inputs
    content = content.replace(/className="w-full[^"]*py-3[^"]*"/g, (match) => {
      let extra = '';
      if (match.includes('pl-10')) extra += ' pl-10';
      if (match.includes('pr-10')) extra += ' pr-10';
      if (match.includes('pr-4')) extra += ' pr-4';
      if (match.includes('appearance-none')) extra += ' appearance-none';
      return `className="input-field${extra}"`;
    });

    // Replace errors
    content = content.replace(/<span className="text-red-500[^"]*"/g, `<span className="text-[12px] text-red-500 mt-1 flex items-center gap-1"`);

    fs.writeFileSync(file, content);
    console.log(`Updated UI elements in ${file}`);
  }
}
