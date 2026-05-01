import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Users, Share2, Filter, Bell, CheckCircle2, FileText, ChevronRight, Search, Download } from 'lucide-react';
import { PropertyData } from '../../components/PropertyCard';
import { DocumentVault } from '../../components/DocumentVault';
import { getRequiredDocuments, PropertyType, PROPERTY_TYPES } from '../../constants/property';
import { motion, AnimatePresence } from 'motion/react';
import { PropertyCreationWizard } from '../../components/PropertyCreationWizard';
import { cn } from '../../lib/utils';
import { exportToDenonciationPDF } from '../../lib/pdfExporter';
import { BoardKanban } from '../../components/kanban/BoardKanban';
import { DropResult } from '@hello-pangea/dnd';
import { triggerWebhook } from '../../services/webhook';

export function ProDashboard() {
  const { profile } = useAuth();
  
  // Simulated properties state
  const [properties, setProperties] = useState<PropertyData[]>([
    {
      id: 'pro-demo-1',
      type: 'Immeuble',
      address: '45 Avenue de la République',
      city: 'Paris',
      estimatedValue: 2400000,
      status: 'analysis',
      isComplete: true,
      createdAt: new Date(),
      referenceNumber: 'REF-2024-001',
      pipelineStage: 'leads',
      completeness: 85
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('tous');
  const [showNewForm, setShowNewForm] = useState(false);
  const [showAssociatesModal, setShowAssociatesModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState<PropertyData | null>(null);
  const [showNotaireConfirmation, setShowNotaireConfirmation] = useState<PropertyData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'tous', label: 'Tous', icon: Filter },
    { id: 'signatures', label: 'Signatures', icon: FileText },
    { id: 'notaire', label: 'Notaire', icon: CheckCircle2 },
    { id: 'alerte', label: 'Alerte', icon: Bell },
  ];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      setProperties(prevProps => prevProps.map(prop => {
        if (prop.id === draggableId) {
          return { ...prop, pipelineStage: destination.droppableId };
        }
        return prop;
      }));

      // Automations
      if (destination.droppableId === 'collecte') {
        setToastMessage("Rappel automatique envoyé au client pour la collecte documentaire.");
        setTimeout(() => setToastMessage(null), 3000);
        
        // Trigger N8N Webhook for "collecte"
        const movedProp = properties.find(p => p.id === draggableId);
        triggerWebhook('property_moved_to_collecte', { propertyId: draggableId, property: movedProp });
        
      } else if (destination.droppableId === 'notaire') {
        const movedProp = properties.find(p => p.id === draggableId);
        if (movedProp) setShowNotaireConfirmation(movedProp);
      } else {
        // Generic Webhook trigger for other stages
        const movedProp = properties.find(p => p.id === draggableId);
        triggerWebhook('property_stage_changed', { 
          propertyId: draggableId, 
          newStage: destination.droppableId,
          property: movedProp
        });
      }
    }
  };

  const handleCreateProperty = (data: any) => {
    const newProp: PropertyData = {
      id: Math.random().toString(),
      type: data.type as PropertyType,
      address: data.address?.address || 'Adresse à préciser',
      city: data.address?.city || 'Ville inconnue',
      estimatedValue: data.estimatedValue || 300000,
      status: 'analysis',
      isComplete: false,
      createdAt: new Date(),
      referenceNumber: `REF-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      pipelineStage: 'leads',
      completeness: 20,
      surface: data.surface,
      rooms: data.rooms,
      condition: data.condition,
      dpe: data.dpe,
      addressData: data.address,
      features: data.features
    };
    setProperties([newProp, ...properties]);
    setShowNewForm(false);
  };

  const handleDownloadDenonciation = async (prop: PropertyData) => {
    await exportToDenonciationPDF('fiche-denonciation', {
      ref: prop.referenceNumber || 'N/A',
      company: profile?.professionalData?.companyName || 'Cabinet',
      proId: profile?.professionalData?.proId || 'WP-000',
      city: prop.city
    });
  };

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         prop.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (prop.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (activeFilter === 'tous') return true;
    if (activeFilter === 'alerte') return !prop.isComplete;
    if (activeFilter === 'signatures') return prop.status === 'validated';
    if (activeFilter === 'notaire') return prop.status === 'documents_pending';
    return true;
  });

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-black/5 lg:border-none">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary">Tableau de bord Pro</h1>
            <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-md border border-secondary/20 whitespace-nowrap">
              ID: {profile?.professionalData?.proId || 'WP-98234-LX'}
            </span>
          </div>
          <p className="text-sm sm:text-base text-neutral-dark/60 font-medium">Gérez vos mandats et collaborations institutionnelles.</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setShowAssociatesModal(true)}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-3 rounded-xl bg-white border border-black/5 text-primary font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm text-sm sm:text-base"
          >
            <Users size={18} /> <span className="hidden xs:inline">Associés</span>
          </button>
          {!showNewForm && (
            <button 
              onClick={() => setShowNewForm(true)}
              className="flex-1 sm:flex-none px-5 sm:px-6 py-3 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20 text-sm sm:text-base"
            >
              <Plus size={20} /> <span className="hidden xs:inline">Nouveau Dossier</span>
              <span className="xs:hidden">Dossier</span>
            </button>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showNewForm ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">Nouveau Dossier de Portage</h2>
              <button onClick={() => setShowNewForm(false)} className="text-sm font-bold text-primary hover:underline">Annuler</button>
            </div>
            <PropertyCreationWizard 
              onComplete={handleCreateProperty}
              onCancel={() => setShowNewForm(false)}
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Filters & Search - Optimized for Responsive */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div className="flex items-center p-1 bg-black/5 rounded-2xl w-full xl:w-fit overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1 min-w-max">
                  {filters.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                        activeFilter === f.id 
                          ? "bg-white text-primary shadow-sm" 
                          : f.id === 'alerte' && properties.some(p => !p.isComplete)
                            ? "text-warning hover:bg-white/50"
                            : "text-primary/60 hover:text-primary hover:bg-white/50"
                      )}
                    >
                      <f.icon size={16} />
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full xl:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Rechercher par adresse, ville ou réf..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-black/5 rounded-2xl focus:border-primary transition-all outline-none text-sm font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="-mx-4 sm:mx-0">
              {filteredProperties.length > 0 ? (
                <BoardKanban 
                  properties={filteredProperties} 
                  onDragEnd={handleDragEnd} 
                  onOpenAgrafe={(prop) => setShowTransferModal(prop)} 
                />
              ) : (
                <div className="py-20 bg-white/40 border-2 border-dashed border-black/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center text-primary/20">
                    <Search size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Aucun dossier trouvé</h3>
                    <p className="text-sm opacity-60">Ajustez vos filtres ou effectuez une nouvelle recherche.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-secondary text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20"
          >
            <CheckCircle2 size={20} />
            <span className="font-bold text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notaire Confirmation Modal */}
      <AnimatePresence>
        {showNotaireConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowNotaireConfirmation(null)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass p-8 rounded-[2.5rem] shadow-2xl space-y-6"
            >
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-4">
                <FileText size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary leading-tight">Envoyer au notaire ?</h3>
              <p className="text-sm text-neutral-dark/70">
                Vous avez déplacé le dossier <span className="font-bold text-primary">{showNotaireConfirmation.referenceNumber}</span> dans "Chez le Notaire".
                Souhaitez-vous générer et envoyer automatiquement le "Bundle Agrafé" au notaire partenaire dès maintenant ?
              </p>
              
              <div className="flex items-center gap-3 pt-4">
                <button 
                  onClick={() => setShowNotaireConfirmation(null)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold bg-white/50 text-primary border border-black/5 hover:bg-white transition-colors"
                >
                  Plus tard
                </button>
                <button 
                  onClick={() => {
                    setShowNotaireConfirmation(null);
                    triggerWebhook('send_bundle_to_notary', { property: showNotaireConfirmation });
                    setToastMessage("Le Bundle Agrafé a été envoyé au notaire avec succès.");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-bold bg-secondary text-white shadow-lg hover:bg-secondary/90 transition-colors"
                >
                  Oui, envoyer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer & Denonciation Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowTransferModal(null)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass p-5 sm:p-8 md:p-12 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl space-y-6 sm:space-y-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1 sm:space-y-2">
                  <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-secondary/10 text-secondary text-[10px] sm:text-xs font-bold rounded-full border border-secondary/20">
                     SÉCURISÉ - PROTOCOLE V4.1
                  </div>
                  <h2 className="text-xl sm:text-3xl font-display font-bold text-primary leading-tight">Outil d'Agrafe & Dénonciation</h2>
                  <p className="text-xs sm:text-sm text-neutral-dark/60 font-medium">Dossier: <span className="text-primary">{showTransferModal.referenceNumber}</span></p>
                </div>
                <button onClick={() => setShowTransferModal(null)} className="text-primary/40 hover:text-primary transition-colors p-2 bg-black/5 rounded-full mt-2">
                  <Plus className="rotate-45 w-6 h-6" />
                </button>
              </div>

              {/* DocumentVault Integration */}
              <div className="py-6 border-y border-black/5">
                <DocumentVault 
                  documents={getRequiredDocuments(showTransferModal.type as PropertyType, true, profile?.professionalData?.subRole)}
                  uploadedFiles={{}}
                  onFileUpload={(docId, file) => console.log('File uploaded', docId, file.name)}
                  onFileRemove={(docId) => console.log('File removed', docId)}
                  onDriveSync={(docId, fileUrl, fileName) => {
                    setToastMessage(`Fichier ${fileName} synchronisé depuis Google Drive pour le document ${docId}`);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Secure Link */}
                <div className="p-6 bg-white/40 rounded-3xl border border-black/5 space-y-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                    <Share2 size={20} />
                  </div>
                  <h3 className="font-bold text-lg">Lien de partage sécurisé</h3>
                  <p className="text-xs text-neutral-dark/60">Ce lien permet à un tiers de consulter les pièces sans accès à votre compte.</p>
                  <div className="flex items-center gap-2 p-3 bg-white/60 rounded-xl border border-black/5">
                    <input 
                      readOnly 
                      value={`https://wallnut.io/share/${showTransferModal.id}?token=wpro_${profile?.professionalData?.proId?.split('-')[1]}`} 
                      className="bg-transparent text-[10px] flex-1 outline-none font-mono"
                    />
                    <button className="text-secondary hover:scale-110 transition-transform">
                      <FileText size={16} />
                    </button>
                  </div>
                </div>

                {/* Expiration Card */}
                <div className="p-6 bg-primary text-white rounded-3xl space-y-4 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl" />
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-secondary">
                    <Bell size={20} />
                  </div>
                  <h3 className="font-bold text-lg">Validité Dénonciation</h3>
                  <p className="text-xs text-white/60 italic leading-relaxed">
                    Protection de provenance active. Valable 30 JOURS à compter de ce jour : <span className="text-secondary font-bold">{(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('fr-FR')}</span>.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-secondary" />
                    </div>
                    <span className="text-[10px] font-bold">30 J Restants</span>
                  </div>
                </div>
              </div>

              {/* Fiche de Dénonciation Preview */}
              <div id="fiche-denonciation" className="p-8 bg-white rounded-3xl border border-black/5 space-y-6 text-sm">
                <div className="flex justify-between items-center border-b pb-4">
                  <div className="font-display font-black text-xl tracking-tighter">WALLNUT<span className="text-secondary">.</span></div>
                  <div className="text-right">
                    <p className="font-bold">FICHE DE DÉNONCIATION</p>
                    <p className="text-[10px] opacity-40">N° {Math.floor(Math.random() * 1000000)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 py-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Émetteur (Pro)</p>
                    <p className="font-bold text-primary">{profile?.professionalData?.companyName || 'Cabinet Immobilier'}</p>
                    <p className="text-[11px] opacity-60">ID: {profile?.professionalData?.proId}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Date d'émission</p>
                    <p className="font-bold">{new Date().toLocaleDateString('fr-FR')}</p>
                    <p className="text-[11px] text-danger font-bold uppercase">Expire le: {(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-bold mb-2">Objet du Dossier :</p>
                  <p className="text-slate-600">
                    Il est dénoncé par la présente l'introduction du client identifié par le dossier de portage 
                    <span className="font-bold text-primary"> {showTransferModal.referenceNumber}</span> situé à {showTransferModal.city}.
                  </p>
                </div>

                <div className="text-[9px] leading-relaxed opacity-40 italic">
                  En vertu de nos accords de partenariat, cette dénonciation fige la provenance du dossier pour une durée de 30 jours calendaires. 
                  Toute manifestation directe du client par un autre canal durant cette période sera rattachée à cet ID Professionnel.
                </div>
              </div>

              <div className="flex items-center gap-4 justify-center">
                <button 
                  onClick={() => handleDownloadDenonciation(showTransferModal)}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg active:scale-95"
                >
                  <Download size={20} /> Télécharger la fiche (PDF)
                </button>
                <button className="px-8 py-4 bg-secondary text-primary rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg active:scale-95">
                  <Share2 size={20} /> Partager le lien
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Associates Modal Placeholder */}
      <AnimatePresence>
        {showAssociatesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAssociatesModal(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass p-10 rounded-[2.5rem] shadow-2xl space-y-8"
            >
              <div>
                <h2 className="text-2xl font-display font-bold">Gestion des Associés</h2>
                <p className="text-neutral-dark/60">Ajoutez des collaborateurs pour travailler sur vos dossiers.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">MA</div>
                    <div>
                      <p className="font-bold">Marc Antoine (Admin)</p>
                      <p className="text-xs opacity-60">Responsable Cabinet</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-secondary">PROPRIÉTAIRE</span>
                </div>
                <button className="w-full p-4 border-2 border-dashed border-black/10 rounded-2xl flex items-center justify-center gap-2 text-primary/60 hover:border-primary/20 hover:text-primary transition-all group">
                   <Plus size={20} className="group-hover:scale-110 transition-transform" />
                   <span className="font-bold">Ajouter un associé</span>
                </button>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => setShowAssociatesModal(false)}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

