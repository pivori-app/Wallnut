import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Send, Inbox, FileText, Users, Building, 
  Briefcase, Scale, Paperclip, Search, Plus, 
  MoreVertical, Star, RefreshCw, CheckCircle2,
  Trash2, X, ChevronDown, Landmark, Link,
  UserPlus, UploadCloud, FileSpreadsheet, Smartphone, Check
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

type TabType = 'inbox' | 'sent' | 'drafts' | 'directory';
type ContactRole = 'Notaire' | 'Agent Immobilier' | 'Avocat' | 'Banque' | 'Famille' | 'Collaborateur';

interface Contact {
  id: string;
  name: string;
  role: ContactRole;
  email: string;
  phone?: string;
  company?: string;
  dossierId?: string;
}

interface Message {
  id: string;
  subject: string;
  sender: string;
  date: string;
  snippet: string;
  isRead: boolean;
  isStarred: boolean;
}

const TEMPLATES = [
  { id: 'notaire_pieces', label: 'Envoi pièces Notaire', role: 'Notaire', content: 'Maître,\n\nVeuillez trouver ci-joint les dernières pièces demandées pour le dossier de vente.\n\nCordialement,' },
  { id: 'banque_pret', label: 'Demande avancement prêt', role: 'Banque', content: 'Bonjour,\n\nJe me permets de vous relancer concernant notre demande de financement en cours.\n\nBien à vous,' },
  { id: 'agent_visite', label: 'Compte-rendu visite', role: 'Agent Immobilier', content: 'Bonjour,\n\nSuite à notre visite de ce jour, voici nos remarques...\n\nCordialement,' },
  { id: 'avocat_conseil', label: 'Demande de consultation', role: 'Avocat', content: 'Maître,\n\nJe souhaiterais obtenir vos conseils concernant une clause spécifique de ce contrat...\n\nMerci par avance,' },
];

const DIRECTORY: Contact[] = [
  { id: '1', name: 'Maître Dupont', role: 'Notaire', email: 'dupont@notaires.fr', company: 'Office Notarial Lyon 2', dossierId: 'dossier-1' },
  { id: '2', name: 'Sophie Martin', role: 'Agent Immobilier', email: 's.martin@immo-luxe.fr', company: 'Immo Luxe', dossierId: 'dossier-1' },
  { id: '3', name: 'Marc Durand', role: 'Banque', email: 'mdurand@ma-banque.com', company: 'BNP Paribas' },
  { id: '4', name: 'Jeanne Legrand', role: 'Famille', email: 'jeanne.legrand@email.com' },
];

export function Messages() {
  const [activeTab, setActiveTab] = useState<TabType>('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'connected'>('idle');

  const handleGmailSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => setSyncStatus('connected'), 2000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary flex items-center gap-3">
            Espace Messagerie
          </h1>
          <p className="text-neutral-dark/60 mt-2 text-lg">Communiquez de manière ciblée avec vos partenaires immobiliers.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGmailSync}
            className={cn(
              "px-5 py-3 rounded-xl font-bold flex items-center gap-3 transition-all border",
              syncStatus === 'connected' 
                ? "bg-success/10 text-success border-success/20 cursor-default" 
                : "bg-white/60 text-primary hover:bg-white border-black/10 shadow-sm"
            )}
            disabled={syncStatus !== 'idle'}
          >
            {syncStatus === 'connected' ? (
              <><CheckCircle2 size={20} /> Connecté à Gmail</>
            ) : syncStatus === 'syncing' ? (
              <><RefreshCw size={20} className="animate-spin" /> Synchronisation...</>
            ) : (
              <>
                <Mail size={20} /> Lier mon compte Mail
              </>
            )}
          </button>
          
          <button 
            onClick={() => setIsComposing(true)}
            className="px-6 py-3 rounded-xl bg-primary text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Nouveau Message <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Main Mail App UI */}
      <div className="flex-1 glass rounded-[2rem] border border-black/5 overflow-hidden flex flex-col md:flex-row min-h-0">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r border-black/5 flex flex-col bg-white/40 shrink-0">
          <div className="p-6 space-y-2 flex-1 overflow-y-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-primary/60 mb-4 block">Boîte aux lettres</span>
            <SidebarBtn icon={Inbox} label="Boîte de réception" count={3} active={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} />
            <SidebarBtn icon={Send} label="Messages envoyés" active={activeTab === 'sent'} onClick={() => setActiveTab('sent')} />
            <SidebarBtn icon={FileText} label="Brouillons" count={1} active={activeTab === 'drafts'} onClick={() => setActiveTab('drafts')} />
            
            <div className="h-px bg-black/5 my-6"></div>
            
            <span className="text-xs font-bold uppercase tracking-wider text-primary/60 mb-4 block">Annuaire & Groupes</span>
            <SidebarBtn icon={Users} label="Tous les contacts" active={activeTab === 'directory'} onClick={() => setActiveTab('directory')} />
            
            <div className="mt-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-primary/40 pl-4 block mb-2">Groupes auto</span>
              <GroupBadge icon={Scale} label="Notaires" count={1} />
              <GroupBadge icon={Building} label="Agents Immobiliers" count={1} />
              <GroupBadge icon={Landmark} label="Pôle Bancaire" count={1} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/20">
          {activeTab === 'directory' ? (
            <DirectoryView contacts={DIRECTORY} onAddContact={() => setIsAddingContact(true)} />
          ) : (
            <MailListView type={activeTab} />
          )}
        </div>
      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {isComposing && <ComposeModal onClose={() => setIsComposing(false)} directory={DIRECTORY} />}
        {isAddingContact && <AddContactModal onClose={() => setIsAddingContact(false)} />}
      </AnimatePresence>
    </div>
  );
}

function SidebarBtn({ icon: Icon, label, count, active, onClick }: { icon: any, label: string, count?: number, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold transition-all text-sm group",
        active ? "bg-primary text-white shadow-md" : "text-primary/70 hover:bg-white/80"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={active ? "text-white" : "text-primary/50 group-hover:text-primary"} />
        {label}
      </div>
      {count !== undefined && (
        <span className={cn("px-2 py-0.5 rounded-md text-[10px]", active ? "bg-white/20 text-white" : "bg-primary/10 text-primary")}>
          {count}
        </span>
      )}
    </button>
  );
}

function GroupBadge({ icon: Icon, label, count }: { icon: any, label: string, count: number }) {
  return (
    <button className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all text-primary/70 hover:bg-white/60">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-primary/40" />
        <span className="font-medium text-xs">{label}</span>
      </div>
      <span className="text-[10px] text-primary/40">{count}</span>
    </button>
  );
}

function DirectoryView({ contacts, onAddContact }: { contacts: Contact[], onAddContact: () => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white/40">
        <h2 className="text-xl font-bold text-primary">Annuaire des Partenaires</h2>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
            <input type="text" placeholder="Rechercher un contact..." className="pl-10 pr-4 py-2 bg-white rounded-xl border border-black/5 text-sm outline-none focus:border-primary/40 transition-all w-64" />
          </div>
          <button 
            onClick={onAddContact}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold flex items-center gap-2 hover:bg-primary-light transition-all shadow-md group"
          >
            <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map(c => (
            <div key={c.id} className="p-4 bg-white/60 rounded-2xl border border-black/5 hover:border-primary/20 transition-all flex flex-col gap-3">
               <div className="flex items-start justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold">
                     {c.name.charAt(0)}
                   </div>
                   <div>
                     <h3 className="font-bold text-primary text-sm">{c.name}</h3>
                     <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60">{c.role}</span>
                   </div>
                 </div>
                 <button className="p-2 hover:bg-white rounded-full text-primary/40 hover:text-primary transition-colors"><MoreVertical size={16} /></button>
               </div>
               {c.company && <p className="text-sm font-medium flex items-center gap-2"><Building size={14} className="text-primary/40"/> {c.company}</p>}
               <a href={`mailto:${c.email}`} className="text-sm font-medium flex items-center gap-2 hover:text-primary transition-colors"><Mail size={14} className="text-primary/40"/> {c.email}</a>
               {c.dossierId && (
                 <div className="mt-2 pt-2 border-t border-black/5 flex items-center gap-2 text-xs font-bold text-secondary">
                   <Link size={12} /> Rattaché au dossier en cours
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MailListView({ type }: { type: string }) {
  const messages: Message[] = [
    { id: '1', subject: 'Projet compromis de vente', sender: 'Maître Dupont (Notaire)', date: '10:30', snippet: 'Veuillez trouver ci-joint le projet de compromis pour relecture...', isRead: false, isStarred: true },
    { id: '2', subject: 'Relance : Pièce d\'identité', sender: 'Agence Immo Luxe', date: 'Hier', snippet: 'Bonjour, il nous manque la copie recto/verso de votre pièce...', isRead: true, isStarred: false },
    { id: '3', subject: 'Validation financement de principe', sender: 'Banque BNP Paribas', date: 'Lun. 12', snippet: 'Suite à l\'étude de votre dossier, nous vous confirmons...', isRead: true, isStarred: false },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-black/5 flex items-center justify-between bg-white/40">
        <div className="flex gap-2">
          <button className="p-2 bg-white rounded-lg border border-black/5 hover:bg-black/5 transition-colors"><RefreshCw size={16} className="text-primary/60" /></button>
          <button className="p-2 bg-white rounded-lg border border-black/5 hover:bg-black/5 transition-colors"><Trash2 size={16} className="text-primary/60" /></button>
        </div>
        <div className="text-sm font-bold text-primary/60">
          1-3 sur 3
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={m.id} className={cn("px-6 py-4 border-b border-black/5 flex items-center gap-4 cursor-pointer transition-colors group", m.isRead ? "bg-transparent hover:bg-white/40" : "bg-white/60 hover:bg-white")}>
            <button className="text-primary/20 hover:text-yellow-400">
               <Star size={18} fill={m.isStarred ? "currentColor" : "none"} className={m.isStarred ? "text-yellow-400 group-hover:text-yellow-500" : ""} />
            </button>
            <div className={cn("w-48 truncate text-sm", m.isRead ? "font-medium text-primary/80" : "font-bold text-primary")}>
              {m.sender}
            </div>
            <div className="flex-1 truncate text-sm">
              <span className={cn("mr-2", m.isRead ? "text-primary/90 font-medium" : "text-primary font-bold")}>{m.subject}</span>
              <span className="text-neutral-dark/60 font-medium">- {m.snippet}</span>
            </div>
            <div className="text-xs font-bold text-primary/60 w-16 text-right">
              {m.date}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-primary/40 space-y-4">
            <Inbox size={48} />
            <p className="font-bold">Aucun message</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ComposeModal({ onClose, directory }: { onClose: () => void, directory: Contact[] }) {
  const [template, setTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleApplyTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tmplId = e.target.value;
    setTemplate(tmplId);
    const tmpl = TEMPLATES.find(t => t.id === tmplId);
    if (tmpl) {
       setBody(tmpl.content);
       setSubject(`[Dossier: A définir] ${tmpl.label}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 bg-primary text-white flex items-center justify-between shrink-0">
          <h2 className="font-bold text-lg">Nouveau message</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-neutral-50/50">
          
          {/* Outils Supérieurs (Templates & Groupes) */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-primary/60 block mb-1">Templates Experts</label>
              <select 
                value={template} 
                onChange={handleApplyTemplate}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-sm font-bold text-primary outline-none focus:border-primary/40 appearance-none"
              >
                <option value="">Sélectionner un modèle...</option>
                {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.role} - {t.label}</option>)}
              </select>
            </div>
            <div className="flex-1">
               <label className="text-xs font-bold uppercase tracking-wider text-primary/60 block mb-1">Rattacher à un dossier</label>
               <select className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-sm font-bold text-primary outline-none focus:border-primary/40 appearance-none">
                 <option value="">Aucun dossier</option>
                 <option value="1">12 Rue des Lilas, Lyon (Vente)</option>
               </select>
            </div>
          </div>

          <div className="space-y-4 bg-white p-1 rounded-2xl border border-black/5">
            <div className="flex border-b border-black/5 px-2">
              <span className="py-3 px-2 text-sm font-bold text-primary/60 w-16">À :</span>
              <input type="text" placeholder="Email ou groupe (ex: Notaires)..." className="flex-1 py-3 text-sm outline-none font-medium text-primary" />
              <button className="py-3 px-2 text-xs font-bold text-primary/60 hover:text-primary">Cc/Cci</button>
            </div>
            <div className="flex border-b border-black/5 px-2">
              <span className="py-3 px-2 text-sm font-bold text-primary/60 w-16">Objet :</span>
              <input value={subject} onChange={e => setSubject(e.target.value)} type="text" className="flex-1 py-3 text-sm outline-none font-medium text-primary" />
            </div>
            <div className="px-4 py-4 min-h-[200px]">
              <textarea 
                value={body}
                onChange={e => setBody(e.target.value)}
                className="w-full h-full min-h-[200px] outline-none resize-none font-medium text-primary text-sm leading-relaxed" 
                placeholder="Votre message..."
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-black/5 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button className="p-3 text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors flex items-center gap-2 group relative">
               <div className="absolute bottom-full left-0 mb-2 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 Agrafeuse numérique (Pièces Vault)
               </div>
               <Paperclip size={20} className="transform -rotate-45" />
               <span className="text-sm font-bold opacity-0 w-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 transition-all whitespace-nowrap">Lier une pièce</span>
            </button>
            <button className="p-3 text-primary/60 hover:bg-black/5 rounded-xl transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 text-primary hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
              <Trash2 size={20} />
            </button>
            <button onClick={onClose} className="px-6 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
              Envoyer <Send size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function AddContactModal({ onClose }: { onClose: () => void }) {
  const [importMode, setImportMode] = useState<'manual' | 'gmail' | 'file'>('manual');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-6 border-b border-black/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-display font-bold text-2xl text-primary">Nouveau contact</h2>
            <p className="text-sm text-neutral-dark/60 mt-1">Ajoutez un partenaire ou importez depuis vos sources.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-neutral-50/30">
          
          <div className="flex bg-white rounded-xl p-1 border border-black/5 shadow-sm">
            <button 
              onClick={() => setImportMode('manual')}
              className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex justify-center items-center gap-2", importMode === 'manual' ? "bg-primary/10 text-primary" : "text-primary/60 hover:text-primary")}
            >
              <UserPlus size={16} /> Manuel
            </button>
            <button 
              onClick={() => setImportMode('gmail')}
              className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex justify-center items-center gap-2", importMode === 'gmail' ? "bg-primary/10 text-primary" : "text-primary/60 hover:text-primary")}
            >
              <Mail size={16} /> Import Gmail
            </button>
            <button 
              onClick={() => setImportMode('file')}
              className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex justify-center items-center gap-2", importMode === 'file' ? "bg-primary/10 text-primary" : "text-primary/60 hover:text-primary")}
            >
              <FileSpreadsheet size={16} /> VCF / Excel
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={importMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {importMode === 'manual' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-primary">Nom complet</label>
                       <input type="text" placeholder="Ex: Jean Dupont" className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-primary">Rôle métier</label>
                       <select className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm appearance-none">
                         <option>Notaire</option>
                         <option>Agent Immobilier</option>
                         <option>Avocat</option>
                         <option>Banque</option>
                         <option>Famille</option>
                         <option>Collaborateur</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-primary">Email</label>
                       <input type="email" placeholder="mail@exemple.com" className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-primary">Téléphone</label>
                       <div className="relative">
                         <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
                         <input type="tel" placeholder="+33 6..." className="w-full bg-white border border-black/5 rounded-xl pl-9 pr-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                       </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-xs font-bold text-primary">Société / Étude / Agence (optionnel)</label>
                       <div className="relative">
                         <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
                         <input type="text" placeholder="Office Notarial..." className="w-full bg-white border border-black/5 rounded-xl pl-9 pr-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                       </div>
                    </div>
                  </div>
                </>
              )}

              {importMode === 'gmail' && (
                <div className="flex flex-col items-center justify-center p-8 bg-white border border-black/5 rounded-2xl text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-2">
                    <Mail size={32} />
                  </div>
                  <h3 className="font-bold text-primary">Connecter Google Contacts</h3>
                  <p className="text-sm text-neutral-dark/60 max-w-sm">
                    Recherchez directement parmi vos contacts Gmail et importez-les dans l'annuaire d'un simple clic.
                  </p>
                  <button className="px-6 py-3 bg-[#4285F4] text-white font-bold rounded-xl shadow hover:shadow-lg transition-all flex items-center gap-2 mt-2">
                    <svg className="w-5 h-5 bg-white rounded-full p-1 border border-black/10 text-black fill-current" viewBox="0 0 24 24">
                       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Connexion Google
                  </button>
                </div>
              )}

              {importMode === 'file' && (
                <div className="flex flex-col items-center justify-center p-8 bg-white border border-dashed border-primary/20 rounded-2xl text-center hover:bg-neutral-50 hover:border-primary/40 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 bg-primary/5 group-hover:bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 transition-colors">
                    <UploadCloud size={32} />
                  </div>
                  <h3 className="font-bold text-primary mb-1 group-hover:text-primary-light transition-colors">Glissez-déposez votre fichier ici</h3>
                  <p className="text-sm text-neutral-dark/60 mb-6">Supporte .vcf, .csv, ou .xlsx (Excel)</p>
                  <button className="px-5 py-2.5 bg-primary/10 text-primary font-bold rounded-xl flex items-center gap-2 pointer-events-none">
                    Parcourir les fichiers
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>

        <div className="px-6 py-4 border-t border-black/5 bg-white flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-3 bg-neutral-100 text-neutral-600 font-bold rounded-xl hover:bg-neutral-200 transition-all">
            Annuler
          </button>
          <button onClick={onClose} className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <Check size={18} /> Enregistrer
          </button>
        </div>
      </motion.div>
    </div>
  )
}
