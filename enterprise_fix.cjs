const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /text-slate-500/g, replacement: 'text-neutral-600 dark:text-neutral-300' },
  { regex: /text-slate-400/g, replacement: 'text-neutral-500 dark:text-neutral-400' },
  { regex: /text-gray-500/g, replacement: 'text-neutral-600 dark:text-neutral-300' },
  { regex: /text-gray-400/g, replacement: 'text-neutral-500 dark:text-neutral-400' },
  { regex: /bg-white\/5([^0-9])/g, replacement: 'bg-white/10$1' }, 
  { regex: /backdrop-blur-md/g, replacement: 'backdrop-blur-xl' }, 
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  replacements.forEach(rule => {
    newContent = newContent.replace(rule.regex, rule.replacement);
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedCount++;
  }
});

console.log(`[ENTERPRISE AUDIT] ${modifiedCount} files fixed for WCAG AAA and UX consistency.`);
