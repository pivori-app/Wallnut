import fs from 'fs';
import path from 'path';

function walk(dir: string) {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      const content = fs.readFileSync(file, 'utf8');
      if (
        content.match(/(?<!\w)text-xs(?!\w)/) ||
        content.match(/(?<!\w)text-sm(?!\w)/) ||
        content.match(/(?<!\w)text-base(?!\w)/) ||
        content.match(/(?<!\w)text-lg(?!\w)/) ||
        content.match(/(?<!\w)text-xl(?!\w)/) ||
        content.match(/(?<!\w)text-2xl(?!\w)/) ||
        content.match(/(?<!\w)text-3xl(?!\w)/) ||
        content.match(/(?<!\w)text-4xl(?!\w)/)
      ) {
        results.push(file);
      }
    }
  });
  return results;
}

const unupdatedFiles = walk('src');

const replacements: [RegExp, string][] = [
  [/(?<!\w)text-xs(?!\w)/g, 'text-app-xs'],
  [/(?<!\w)text-sm(?!\w)/g, 'text-app-sm'],
  [/(?<!\w)text-base(?!\w)/g, 'text-app-base'],
  [/(?<!\w)text-lg(?!\w)/g, 'text-app-md'],
  [/(?<!\w)text-xl(?!\w)/g, 'text-app-lg'],
  [/(?<!\w)text-2xl(?!\w)/g, 'text-app-xl'],
  [/(?<!\w)text-3xl(?!\w)/g, 'text-app-2xl'],
  [/(?<!\w)text-4xl(?!\w)/g, 'text-app-3xl'],
];

for (const file of unupdatedFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [regex, replacement] of replacements) {
      content = content.replace(regex, replacement);
    }
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
