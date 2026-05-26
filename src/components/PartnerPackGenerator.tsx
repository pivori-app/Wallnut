import React, { useState } from 'react';
import { PropertyData } from './PropertyCard';
import { Download, CheckCircle2, ChevronRight, Calculator, Upload, FileText, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export function PartnerPackGenerator({ properties, onClose }: { properties: PropertyData[], onClose: () => void }) {
  const [selectedPropId, setSelectedPropId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'generate' | 'upload' | 'documentation'>('generate');
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, date: string}[]>([]);

  const property = properties.find(p => p.id === selectedPropId);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setUploadedFiles(prev => [...prev, { name: newFile.name, date: new Date().toLocaleDateString('fr-FR') }]);
    }
  };

  return (
    <div className="text-left animate-in fade-in zoom-in duration-300 w-full min-w-full">
      <div className="flex border-b border-gray-200 dark:border-white/10 mb-6 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('generate')} 
          className={`flex-1 py-3 px-4 font-medium text-center border-b-2 transition-colors whitespace-nowrap ${activeTab === 'generate' ? 'border-secondary text-secondary' : 'border-transparent text-neutral-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Générer (Accord, Pack)
        </button>
        <button 
          onClick={() => setActiveTab('upload')} 
          className={`flex-1 py-3 px-4 font-medium text-center border-b-2 transition-colors whitespace-nowrap ${activeTab === 'upload' ? 'border-secondary text-secondary' : 'border-transparent text-neutral-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Intégrer PJ
        </button>
        <button 
          onClick={() => setActiveTab('documentation')} 
          className={`flex-1 py-3 px-4 font-medium text-center border-b-2 transition-colors whitespace-nowrap ${activeTab === 'documentation' ? 'border-secondary text-secondary' : 'border-transparent text-neutral-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Documentation Modèles
        </button>
      </div>

      {activeTab === 'generate' && (
        <>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 1 ? 'bg-secondary text-white' : 'bg-gray-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 dark:text-white/50'}`}>1</div>
            <div className="h-0.5 bg-gray-200 dark:bg-white/10 w-24 rounded-full">
              <div className={`h-full bg-secondary rounded-full transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 2 ? 'bg-secondary text-white' : 'bg-gray-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 dark:text-white/50'}`}>2</div>
            <div className="h-0.5 bg-gray-200 dark:bg-white/10 w-24 rounded-full">
              <div className={`h-full bg-secondary rounded-full transition-all ${step >= 3 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 3 ? 'bg-secondary text-white' : 'bg-gray-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 dark:text-white/50'}`}>3</div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sélectionner un dossier</h3>
              <p className="text-neutral-600 dark:text-neutral-300 dark:text-white/50 text-sm">Sélectionnez le dossier client pour lequel générer le Pack Partenaire d'accord de principe.</p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                {properties.map(p => (
                  <label 
                    key={p.id} 
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedPropId === p.id ? 'border-secondary bg-secondary/10' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/10 shadow-sm dark:shadow-none'}`}
                  >
                    <div className="flex items-center gap-4">
                      <input type="radio" name="property" className="w-5 h-5 accent-secondary" checked={selectedPropId === p.id} onChange={() => setSelectedPropId(p.id)} />
                      <div>
                        <h4 className="text-gray-900 dark:text-white font-medium">{p.clientName || 'Client Inconnu'}</h4>
                        <p className="text-neutral-600 dark:text-neutral-300 dark:text-white/40 text-[10px] uppercase tracking-wider">{p.referenceNumber} • {p.city}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-secondary font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p.estimatedValue)}</div>
                      <div className="text-neutral-600 dark:text-neutral-300 dark:text-white/40 text-xs text-right mt-1">{p.type}</div>
                    </div>
                  </label>
                ))}
                {properties.length === 0 && <div className="text-neutral-600 dark:text-neutral-300 dark:text-white/50 text-center py-4">Aucun dossier disponible.</div>}
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  disabled={!selectedPropId} 
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-sm bg-secondary text-primary font-bold rounded-xl disabled:opacity-50 flex items-center gap-2 hover:scale-105 transition-all shadow-md"
                >
                  Suivant <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && property && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Vérification des données</h3>
              
              <div className="grid grid-cols-2 gap-4 bg-white dark:bg-white/10 p-4 rounded-xl border border-gray-200 dark:border-white/10 text-sm shadow-sm dark:shadow-none">
                <div className="space-y-3">
                  <div>
                    <div className="text-neutral-500 dark:text-neutral-400 text-[10px] uppercase font-bold tracking-wider">Vendeur</div>
                    <div className="text-gray-900 dark:text-white font-medium">{property.clientName}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 dark:text-neutral-400 text-[10px] uppercase font-bold tracking-wider">Adresse complète</div>
                    <div className="text-gray-900 dark:text-white font-medium">{typeof property.address === 'string' ? property.address : property.address?.fullAddress || property.city}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-neutral-500 dark:text-neutral-400 text-[10px] uppercase font-bold tracking-wider">Ref Dossier</div>
                    <div className="text-gray-900 dark:text-white font-medium">{property.referenceNumber}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 dark:text-neutral-400 text-[10px] uppercase font-bold tracking-wider">Statut Document</div>
                    <div className="text-gray-900 dark:text-white font-medium text-secondary">Accord de principe</div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/10 border border-secondary/30 p-4 rounded-xl">
                 <h4 className="text-secondary font-bold text-sm mb-2">Comprend les annexes Wallnut</h4>
                 <ul className="text-gray-600 dark:text-white/70 text-xs space-y-1 list-disc list-inside">
                   <li>Principes économiques exclusifs Wallnut</li>
                   <li>Annexe chiffrée complète</li>
                   <li>Note vendeur</li>
                 </ul>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button onClick={() => setStep(1)} className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 dark:text-white/50 font-bold hover:text-gray-900 dark:hover:text-white transition-all">Retour</button>
                <button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="px-4 py-2 text-sm bg-primary text-white font-bold rounded-xl disabled:opacity-50 flex items-center gap-2 hover:bg-primary/90 transition-all"
                >
                  {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Calculator size={16} />}
                  {isGenerating ? 'Génération en cours...' : 'Générer le Pack Partenaire'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-secondary/20 text-secondary flex items-center justify-center rounded-full mx-auto border border-secondary/30">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Document(s) généré(s) avec succès</h3>
                <p className="text-neutral-600 dark:text-neutral-300 dark:text-white/50 text-sm">Le "Pack Accord de Principe" est intégré au dossier.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 px-8">
                <button onClick={() => { setActiveTab('upload'); setStep(1); }} className="px-4 py-2 border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/10 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm">
                  <Upload size={16} /> Ajouter Pièces Jointes
                </button>
                <button className="px-4 py-2 bg-secondary text-primary font-bold rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm">
                  <Download size={16} /> Télécharger
                </button>
              </div>
              <button onClick={onClose} className="mt-8 text-neutral-600 dark:text-neutral-300 dark:text-white/40 text-sm hover:text-gray-900 dark:hover:text-white transition-colors underline underline-offset-4">Fermer sans télécharger</button>
            </div>
          )}
        </>
      )}

      {activeTab === 'upload' && (
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Pièces Jointes et Documents</h3>
            <p className="text-neutral-600 dark:text-neutral-300 dark:text-white/50 text-sm">Intégrez la documentation transmise (pièces d'identité, actes de propriété, baux en cours...).</p>
          </div>

          <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="w-16 h-16 bg-white dark:bg-primary/20 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/10 mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-secondary" />
            </div>
            <div className="font-bold text-gray-900 dark:text-white">Cliquez pour intégrer la PJ transmise</div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 dark:text-white/40 mt-2">Formats supportés: PDF, JPG, PNG (Max 15 MB)</p>
            <input type="file" className="hidden" id="fileUpload" onChange={handleFileUpload} />
            <button className="mt-4 px-4 py-2 text-sm bg-secondary text-primary font-bold rounded-xl" onClick={() => document.getElementById('fileUpload')?.click()}>Sélectionner fichier</button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Documents récemment intégrés au back office</h4>
              <div className="space-y-2">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-white/10 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{f.name}</div>
                        <div className="text-[10px] text-neutral-600 dark:text-neutral-300 dark:text-white/40 uppercase">Intégré le {f.date}</div>
                      </div>
                    </div>
                    <CheckCircle2 className="text-secondary w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors font-medium">Terminer</button>
          </div>
        </div>
      )}

      {activeTab === 'documentation' && (
        <div className="space-y-6">
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Guides & Documentations</h3>
            <p className="text-neutral-600 dark:text-neutral-300 dark:text-white/50 text-sm">Retrouvez l'ensemble des PDF de présentation et la documentation institutionnelle Wallnut.</p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Présentation Agents", desc: "Guide pour les agents immobiliers (PDF)", link: "/presentation-agents.html", date: "v2.1" },
              { title: "Présentation CGP", desc: "Guide pour les Conseillers en Gestion de Patrimoine", link: "/presentation-cgp.html", date: "v1.0" },
              { title: "Présentation Courtiers", desc: "Documentation pour les courtiers associés", link: "/presentation-courtiers.html", date: "v1.2" },
              { title: "Présentation Notaires", desc: "Processus et conformité Notaire", link: "/presentation-notaires.html", date: "v3.0" },
              { title: "Modèle de Mandat Exclusif", desc: "Format validé juridiquement (Notaires)", link: "#", date: "04/2026" },
              { title: "Convention Honoraires ", desc: "Barème Hilios", link: "#", date: "01/2026" },
            ].map((doc, idx) => (
              <a 
                key={idx} 
                href={doc.link}
                target={doc.link !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex flex-col p-5 bg-white dark:bg-white/10 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-secondary/50 dark:hover:border-secondary/50 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 text-secondary group-hover:bg-secondary/10 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400 group-hover:text-secondary p-1 transition-colors">
                    <Download size={18} />
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-[15px] mb-2 leading-tight">{doc.title}</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-5 leading-relaxed">{doc.desc}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-bold tracking-wider uppercase">
                  <span>Version</span>
                  <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md">{doc.date}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
