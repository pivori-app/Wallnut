const fs = require('fs');

const file = 'src/pages/dashboard/ProDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace large text sizes
content = content.replace(/text-app-2xl sm:text-app-3xl/g, 'text-2xl sm:text-3xl');
content = content.replace(/text-app-2xl/g, 'text-2xl');
content = content.replace(/text-app-xl/g, 'text-xl');
content = content.replace(/text-app-lg/g, 'text-lg');
content = content.replace(/text-app-md/g, 'text-base');
content = content.replace(/text-app-base/g, 'text-base');
content = content.replace(/lg:text-app-xl/g, 'lg:text-xl');

// Replace invisible dark text issues
content = content.replace(/text-primary dark:text-white\/90/g, 'text-slate-900 dark:text-white');
content = content.replace(/text-primary dark:text-white/g, 'text-slate-900 dark:text-white');
content = content.replace(/text-primary\/60 dark:text-white\/60/g, 'text-slate-500 dark:text-white/60');
content = content.replace(/text-primary\/50 dark:text-white\/40/g, 'text-slate-400 dark:text-white/40');
content = content.replace(/text-primary\/50 dark:text-white\/50/g, 'text-slate-400 dark:text-white/50');
content = content.replace(/text-primary\/40 dark:text-white\/40/g, 'text-slate-400 dark:text-white/40');
content = content.replace(/text-primary\/80 dark:text-white\/80/g, 'text-slate-700 dark:text-white/80');

// Fix theme switcher button sizes
content = content.replace(/p-2 rounded-lg transition-all/g, 'p-1.5 rounded-lg transition-all');
content = content.replace(/<Sun size=\{18\} \/>/g, '<Sun size={14} />');
content = content.replace(/<Moon size=\{18\} \/>/g, '<Moon size={14} />');
content = content.replace(/<Laptop size=\{18\} \/>/g, '<Laptop size={14} />');
content = content.replace(/p-1 rounded-xl/g, 'p-0.5 rounded-xl');

fs.writeFileSync(file, content);

// Also fix Dossiers.tsx crash
const dossierFile = 'src/pages/Dossiers.tsx';
let dossierContent = fs.readFileSync(dossierFile, 'utf8');
dossierContent = dossierContent.replace(/\{typeof dossier\.address === 'string' \? dossier\.address : \(dossier\.address\?\.fullAddress \|\| dossier\.city \|\| 'Adresse non renseignée'\)\}/g, "{typeof dossier.address === 'string' ? dossier.address : (dossier.address?.fullAddress || (typeof dossier.city === 'string' ? dossier.city : 'Adresse non renseignée') || 'Adresse non renseignée')}");
dossierContent = dossierContent.replace(/\{dossier\.city\} • \{dossier\.type\}/g, "{typeof dossier.city === 'string' ? dossier.city : 'Ville non renseignée'} • {dossier.type}");
fs.writeFileSync(dossierFile, dossierContent);

// Fix KanbanCard crash
const kanbanFile = 'src/components/kanban/PropertyCardKanban.tsx';
let kanbanContent = fs.readFileSync(kanbanFile, 'utf8');
kanbanContent = kanbanContent.replace(/\{property\.city\}/g, "{typeof property.city === 'string' ? property.city : 'Ville inconnue'}");
fs.writeFileSync(kanbanFile, kanbanContent);

console.log("fixes applied");
