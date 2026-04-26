import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, FileText, CheckCircle2, ChevronLeft, UploadCloud, AlertCircle, Plus } from 'lucide-react';
import { SmartScannerPro } from './SmartScannerPro';
import { cn } from '../lib/utils';

export function PropertyDocumentsStep({ propertyData, onBack, onComplete }: any) {
  const [activeScanner, setActiveScanner] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Record<string, any[]>>({});
  const [customDocs, setCustomDocs] = useState<{ id: string, label: string, expectedType: string }[]>([]);
  const [newDocLabel, setNewDocLabel] = useState('');
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  const REQUIRED_DOCS = [
    { id: 'id_card', label: 'Pièce d\'identité du déclarant', expectedType: 'Identité (CNI/Passeport)' },
    { id: 'tax_notice', label: 'Dernier avis de taxe foncière', expectedType: 'Avis d’impôt' },
    { id: 'property_deed', label: 'Titre de propriété (Optionnel)', expectedType: 'Titre de propriété' },
    { id: 'dpe_cert', label: 'Certificat DPE', expectedType: 'Diagnostic Immobilier' }
  ];

  const ALL_DOCS = [...REQUIRED_DOCS, ...customDocs];

  const handleAddCustomDoc = () => {
    if (newDocLabel.trim()) {
      setCustomDocs(prev => [...prev, {
        id: `custom_${Date.now()}`,
        label: newDocLabel.trim(),
        expectedType: 'Autre document'
      }]);
      setNewDocLabel('');
      setIsAddingDoc(false);
    }
  };

  const handleScanComplete = (files: File[], docIdOverride?: string) => {
    const docId = docIdOverride || activeScanner;
    if (docId) {
      setDocuments(prev => ({
        ...prev,
        [docId]: files
      }));
    }
    setActiveScanner(null);
  };

  const handleFinish = () => {
    onComplete(documents);
  };

  return (
    <div className="glass p-6 md:p-10 rounded-[2.5rem] border border-black/5 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-display font-bold text-primary">Checklist Documentaire</h2>
          <p className="text-neutral-dark/60 mt-2">
            Complétez la conformité du bien avec une numérisation "Zéro Défaut". 
            Notre IA analyse automatiquement la qualité des pièces jointes.
          </p>
        </div>
      </div>

      <div className="grid gap-4 mt-6">
        {ALL_DOCS.map((doc) => {
          const isUploaded = documents[doc.id] && documents[doc.id].length > 0;
          return (
            <div key={doc.id} className={cn(
              "flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all",
              isUploaded ? "bg-green-50/50 border-green-200" : "bg-white/40 border-black/10 hover:border-primary/20"
            )}>
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  isUploaded ? "bg-green-100 text-green-600" : "bg-primary/5 text-primary/60"
                )}>
                  {isUploaded ? <CheckCircle2 size={24} /> : <FileText size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-primary">{doc.label}</h4>
                  <p className="text-xs text-primary/50 mt-1">Requis pour l'audit de conformité</p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                {isUploaded ? (
                  <div className="px-4 py-2 bg-white/60 border border-green-200 rounded-xl text-green-700 text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} /> Validé 
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => setActiveScanner(doc.id)}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-neutral-800 hover:bg-neutral-900 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md group"
                    >
                      <Camera size={16} className="group-hover:scale-110 transition-transform" />
                      Scanner
                    </button>
                    <div className="relative flex-1 sm:flex-none">
                      <input 
                        type="file" 
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                           if (e.target.files && e.target.files.length > 0) {
                             handleScanComplete(Array.from(e.target.files), doc.id);
                           }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <button 
                        className="w-full px-4 py-2.5 bg-white border border-black/10 hover:bg-neutral-50 text-primary text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all pointer-events-none"
                      >
                        <UploadCloud size={16} />
                        Importer
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Dynamic Checklist Addition */}
        {isAddingDoc ? (
          <div className="flex items-center gap-3 p-5 rounded-2xl bg-white/40 border border-primary/20">
            <input 
              type="text" 
              value={newDocLabel}
              onChange={(e) => setNewDocLabel(e.target.value)}
              placeholder="Nom du document (ex: Plan Cadastral)"
              className="flex-1 px-4 py-2 rounded-xl border border-black/10 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomDoc()}
            />
            <button onClick={handleAddCustomDoc} className="px-4 py-2 bg-primary text-white rounded-xl font-bold">Valider</button>
            <button onClick={() => setIsAddingDoc(false)} className="px-4 py-2 bg-black/5 text-primary rounded-xl font-bold">Annuler</button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingDoc(true)}
            className="flex items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-primary/20 text-primary hover:bg-primary/5 transition-colors font-bold"
          >
            <Plus size={20} /> Ajouter un document optionnel
          </button>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-4">
        <AlertCircle className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900/80 leading-relaxed">
           <strong>Conseil de capture :</strong> Assurez-vous d'être dans un environnement bien éclairé. Notre système validera instantanément la lisibilité pour éviter les rejets institutionnels.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 mt-8 border-t border-black/5">
        <button 
          onClick={onBack}
          className="px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-white/60 text-primary border border-black/5 hover:border-black/10"
        >
          <ChevronLeft size={20} /> Retour aux détails
        </button>
        <button 
          onClick={handleFinish}
          className="px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Générer la Synthèse & Déploiement
        </button>
      </div>

      <AnimatePresence>
        {activeScanner && (
          <SmartScannerPro
            expectedDocType={ALL_DOCS.find(d => d.id === activeScanner)?.expectedType as any}
            onComplete={handleScanComplete}
            onCancel={() => setActiveScanner(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
