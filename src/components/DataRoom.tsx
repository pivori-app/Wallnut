import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, CheckCircle2, Circle, AlertCircle, Plus, Search, Filter, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { PropertyData } from './PropertyCard';

interface DataRoomProps {
  properties: PropertyData[];
  onClose: () => void;
}

export function DataRoom({ properties, onClose }: DataRoomProps) {
  const [activeTab, setActiveTab] = useState<'particulier' | 'pro'>('pro');
  const [selectedPropId, setSelectedPropId] = useState<string>('');

  const documentsPro = [
    { title: 'Mandat Exclusif Hilios', required: true, status: 'missing', category: 'Légal' },
    { title: 'Avis de Valeur', required: true, status: 'uploaded', category: 'Expertise' },
    { title: 'Pièces d\'identité acquéreur / vendeur', required: true, status: 'missing', category: 'Identité' },
    { title: 'Kbis (si société)', required: false, status: 'na', category: 'Légal' },
  ];

  const documentsParticulier = [
    { title: 'Titre de Propriété (Complet)', required: true, status: 'uploaded', category: 'Juridique' },
    { title: 'Dernière Taxe Foncière', required: true, status: 'missing', category: 'Fiscal' },
    { title: 'Diagnostics Techniques (DPE, Amiante, etc.)', required: true, status: 'uploaded', category: 'Technique' },
    { title: '3 derniers Procès Verbaux d\'AG', required: false, status: 'missing', category: 'Copropriété' },
    { title: 'Règlement de copropriété', required: false, status: 'missing', category: 'Copropriété' },
    { title: 'Carnet d\'entretien', required: false, status: 'missing', category: 'Copropriété' },
    { title: 'Relevé de charges', required: false, status: 'missing', category: 'Copropriété' },
  ];

  const property = properties.find(p => p.id === selectedPropId);
  
  const currentDocs = activeTab === 'pro' ? documentsPro : documentsParticulier;

  return (
    <div className="text-left animate-in fade-in zoom-in duration-300 w-full min-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Data Room Notaire</h2>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Checklist documentaire sécurisée et structurée</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-white/10 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setActiveTab('pro')} 
            className={cn(
              "px-4 py-2 font-bold text-sm rounded-lg transition-all", 
              activeTab === 'pro' ? "bg-white dark:bg-white/10 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-600 dark:text-neutral-300 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            Documents Pro
          </button>
          <button 
            onClick={() => setActiveTab('particulier')} 
            className={cn(
              "px-4 py-2 font-bold text-sm rounded-lg transition-all", 
              activeTab === 'particulier' ? "bg-white dark:bg-white/10 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-600 dark:text-neutral-300 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            Documents Client
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Dossier sélectionné</label>
        <select 
          className="w-full bg-white dark:bg-black/20 text-sm font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 transition-colors appearance-none cursor-pointer"
          value={selectedPropId}
          onChange={(e) => setSelectedPropId(e.target.value)}
        >
          <option value="" disabled>-- Sélectionner un dossier --</option>
          {properties.map(p => (
            <option key={p.id} value={p.id}>{p.clientName} - {p.referenceNumber} ({p.city})</option>
          ))}
        </select>
      </div>

      {!property ? (
        <div className="py-10 text-center text-neutral-600 dark:text-neutral-300 dark:text-white/50 border border-dashed border-gray-300 dark:border-white/20 rounded-2xl">
          Sélectionnez un dossier pour consulter sa checklist.
        </div>
      ) : (
        <div className="space-y-4">
          {currentDocs.map((doc, idx) => (
            <div key={idx} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-white/10 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all shadow-sm">
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-1">
                  {doc.status === 'uploaded' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : doc.status === 'na' ? (
                    <Circle className="w-6 h-6 text-gray-300 dark:text-white/20" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-2">
                    {doc.title}
                    {doc.required && <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Requis</span>}
                  </h4>
                  <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300 dark:text-white/50 flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded-md text-gray-600 dark:text-gray-300">{doc.category}</span>
                    {doc.status === 'missing' && <span className="text-amber-500">Document manquant</span>}
                    {doc.status === 'uploaded' && <span className="text-emerald-500">Intégré</span>}
                    {doc.status === 'na' && <span className="text-neutral-500 dark:text-neutral-400">Non applicable</span>}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center gap-2 self-end sm:self-auto opacity-0 group-hover:opacity-100 transition-opacity">
                {doc.status !== 'uploaded' && (
                  <button className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-lg border border-purple-200 dark:border-purple-500/20 transition-colors flex items-center gap-1.5 focus:outline-none">
                     <Plus size={14} /> Ajouter
                  </button>
                )}
                {doc.status === 'uploaded' && (
                  <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white/80 text-xs font-bold rounded-lg transition-colors focus:outline-none">
                     Consulter
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-white/10 flex justify-between items-center">
            <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300 dark:text-white/50">
              Progression: <span className="font-bold text-neutral-900 dark:text-white">
                {currentDocs.filter(d => d.status === 'uploaded').length} / {currentDocs.filter(d => d.required).length} requis
              </span>
            </div>
            <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-bold rounded-xl shadow-lg transition-all focus:outline-none flex items-center gap-2 text-sm">
              <BookOpen size={16} /> Envoyer au notaire
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
