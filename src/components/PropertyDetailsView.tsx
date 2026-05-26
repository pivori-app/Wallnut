import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateAssetUnderwriting, AssetData } from '../lib/underwritingEngine';
import { 
  ChevronLeft, FileText, Calendar as CalendarIcon, 
  Mail, Settings, CheckCircle2, AlertCircle, 
  Download, ExternalLink, MapPin, Building2, 
  Maximize2, Activity, HardDrive, Share2, Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PropertySynthesisStep } from './PropertySynthesisStep';
import { PropertyDocumentsStep } from './PropertyDocumentsStep';

interface PropertyDetailsViewProps {
  property: any;
  onBack: () => void;
}

export function PropertyDetailsView({ property, onBack }: PropertyDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'synthesis' | 'calendar' | 'messages' | 'expertise'>('overview');

  // Mocked details for the Lyon house
  const propertyFullData = {
    ...property,
    surface: property.surface || 120,
    rooms: property.rooms || 5,
    condition: property.condition || 'Bon état',
    dpe: property.dpe || 'B',
    addressData: property.addressData || { zipCode: '69000' },
    features: property.features || ['Jardin', 'Garage / Parking', 'Proche commerces', 'Wi-Fi (Fibre, ADSL...)'],
  };

  // Mocked documents
  const initialDocuments = {
    'id_card': [{ name: 'CNI_PROPRIO.pdf', status: 'verified' }],
    'property_title': [{ name: 'TITRE_NOTAIRE_LYON.pdf', status: 'verified' }],
    'dpe_cert': [], // Missing to show how it looks
  };

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: Activity },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'synthesis', label: 'Synthèse & Prix', icon: Building2 },
    { id: 'expertise', label: 'Contre-Expertise', icon: CheckCircle2 },
    { id: 'calendar', label: 'Calendrier', icon: CalendarIcon },
    { id: 'messages', label: 'Messages / Share', icon: Mail },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 hover:bg-white dark:bg-white/10 transition-all shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-app-2xl font-display font-bold text-neutral-900 dark:text-white">{property.type || property.propertyType || "Propriété"} à {property.city}</h1>
          <p className="text-neutral-dark/60">ID Dossier: #PRP-{property.id.substring(0, 8)}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-black/5 rounded-2xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
              activeTab === tab.id 
                ? "bg-primary text-white shadow-lg" 
                : "text-neutral-600 dark:text-neutral-300 hover:bg-white/40 hover:text-neutral-900 dark:text-white"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="glass p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10">
                <h3 className="text-app-lg font-bold mb-6">Détails de la propriété</h3>
                <div className="grid sm:grid-cols-2 gap-8">
                  <DetailItem label="Surface habitable" value={`${propertyFullData.surface} m²`} icon={Maximize2} />
                  <DetailItem label="Nombre de pièces" value={`${propertyFullData.rooms} pièces`} icon={Building2} />
                  <DetailItem label="État" value={propertyFullData.condition} icon={Activity} />
                  <DetailItem label="DPE" value={propertyFullData.dpe} icon={Settings} />
                  <div className="sm:col-span-2">
                    <span className="text-app-xs font-bold uppercase tracking-wider opacity-40 block mb-3">Équipements</span>
                    <div className="flex flex-wrap gap-2">
                      {propertyFullData.features.map(f => (
                        <span key={f} className="px-3 py-1.5 bg-primary/5 dark:bg-white/10 text-neutral-900 dark:text-white rounded-lg text-app-sm font-bold border border-gray-200 dark:border-white/10">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-app-lg font-bold">Simulation Wallnut (Affinée)</h3>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-app-xs font-bold uppercase tracking-wider">Calcul Intégré</div>
                </div>
                <div className="space-y-4">
                  {(() => {
                    // Si property est déjà sous-crit (ex: depuis le dashboard institutionnel), on l'utilise directement
                    const isAlreadyUnderwritten = propertyFullData.hasOwnProperty('fundScore') && propertyFullData.hasOwnProperty('baseIntervention');
                    
                    let underwritingResult;
                    
                    if (isAlreadyUnderwritten) {
                      underwritingResult = propertyFullData;
                    } else {
                      // Sinon on génère une simulation par défaut pour la vue
                      const assetToUnderwrite = {
                        id: propertyFullData.id,
                        clientId: propertyFullData.clientId || "me",
                        clientName: propertyFullData.clientName || "Me",
                        clientType: "PP" as const,
                        clientStatus: "Particulier",
                        city: propertyFullData.city || propertyFullData.address?.city || 'Inconnue',
                        propertyType: propertyFullData.type || 'Appartement',
                        referenceValue: Number(propertyFullData.estimatedValue) || 300000,
                        surface: Number(propertyFullData.surface) || 100,
                        offerTarget: propertyFullData.offerTarget || 'Premium' as const, 
                        existingDebt: propertyFullData.existingDebt || 50000, 
                        agencyFees: propertyFullData.agencyFees || 10000,
                        actFees: propertyFullData.actFees || 5000,
                        marketLiquidityDelay: propertyFullData.marketLiquidityDelay || 45,
                        legalQualityScore: propertyFullData.legalQualityScore || 80,
                        assetQuality: propertyFullData.assetQuality || 4,
                        exitReadability: propertyFullData.exitReadability || 4,
                        sellerProfile: propertyFullData.sellerProfile || 4,
                        complexity: propertyFullData.complexity || 2,
                        benchmarkPrice: propertyFullData.benchmarkPrice || ((Number(propertyFullData.estimatedValue) || 300000) / (Number(propertyFullData.surface) || 100)),
                        distanceLargeCity: propertyFullData.distanceLargeCity || 10,
                        accessTimeLargeCity: propertyFullData.accessTimeLargeCity || 20,
                        population: propertyFullData.population || 150000
                      };
                      underwritingResult = calculateAssetUnderwriting(assetToUnderwrite as any);
                    }
                    
                    const formatEur = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
                    return (
                      <>
                        <div className="p-4 bg-primary/5 dark:bg-white/10 rounded-2xl border border-gray-200 dark:border-white/10">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-app-sm font-bold opacity-70">Valeur de référence retenue</span>
                            <span className="font-bold">{formatEur(underwritingResult.referenceValue)}</span>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-app-sm font-bold opacity-70">Base de financement ({underwritingResult.offerTarget})</span>
                            <span className="font-bold text-neutral-900 dark:text-white">{formatEur(underwritingResult.baseIntervention)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-app-sm font-bold opacity-70">Net Immédiat au Client</span>
                            <span className="font-bold text-success text-app-md">{formatEur(underwritingResult.netClientImmediat)}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col justify-center items-center text-center">
                             <div className="text-[10px] font-bold uppercase opacity-50">Dettes à apurer</div>
                             <div className="font-bold text-danger">{formatEur(underwritingResult.existingDebt)}</div>
                           </div>
                           <div className="p-4 border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col justify-center items-center text-center">
                             <div className="text-[10px] font-bold uppercase opacity-50">Frais Notaire & Agence</div>
                             <div className="font-bold">{formatEur(underwritingResult.actFees + underwritingResult.agencyFees)}</div>
                           </div>
                        </div>
                        <div className="text-app-xs opacity-50 text-center font-medium mt-2">
                          *Simulation basée sur l'offre {underwritingResult.offerTarget} (jusqu'à 80% de LTV). Soumis à validation du comité.
                        </div>
                        
                        {underwritingResult.expertInsights && underwritingResult.expertInsights.length > 0 && (
                          <div className="mt-6 p-5 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl relative">
                             <div className="absolute -top-3 -right-2 px-3 py-1 bg-[#101010] text-[#f2f2f2] text-[10px] uppercase tracking-widest font-black shadow-xl shadow-black/20" style={{ transform: 'perspective(500px) rotateY(-15deg)' }}>
                               Contre-Expert Senior (20+ ans)
                             </div>
                             <h4 className="font-bold text-app-sm mb-3 text-neutral-900 dark:text-white">Avis Institutionnel (Comité d'Investissement)</h4>
                             <ul className="space-y-3">
                               {underwritingResult.expertInsights.map((insight, idx) => (
                                 <li key={idx} className="text-app-sm font-medium leading-relaxed text-black/80 dark:text-white/80 border-b border-gray-200 dark:border-white/10 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                                   {insight}
                                 </li>
                               ))}
                             </ul>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-8 rounded-[2.5rem] border border-primary/20 bg-primary/5 dark:bg-white/10">
                <h3 className="text-app-lg font-bold text-neutral-900 dark:text-white mb-4">Statut Administratif</h3>
                <div className="space-y-4">
                   <StatusItem label="Identité" status="valid" />
                   <StatusItem label="Titre de propriété" status="valid" />
                   <StatusItem label="Diagnostics" status="pending" />
                   <StatusItem label="Taxes" status="missing" />
                </div>
                <button 
                  onClick={() => setActiveTab('documents')}
                  className="w-full mt-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-transform"
                >
                  Compléter le dossier
                </button>
              </div>

              <div className="glass p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10">
                <h3 className="text-app-lg font-bold mb-4">Export rapide</h3>
                <div className="space-y-3">
                  <ExportButton label="Fiche technique (PDF)" />
                  <ExportButton label="Tableau DVF lié" />
                  <ExportButton label="Archive documents (.zip)" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'documents' && (
          <motion.div
            key="documents"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <PropertyDocumentsStep 
              onComplete={(docs) => console.log('Docs updated', docs)} 
            />
          </motion.div>
        )}

        {activeTab === 'synthesis' && (
          <motion.div
            key="synthesis"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <PropertySynthesisStep 
              propertyData={propertyFullData}
              documents={initialDocuments}
              onComplete={() => {}}
              onBack={() => setActiveTab('overview')}
            />
          </motion.div>
        )}

        {activeTab === 'expertise' && (
          <motion.div
            key="expertise"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            <div className="glass p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10 dark:border-white/5 space-y-8">
              <div>
                <h3 className="text-app-xl font-display font-bold">Rapport du Contre-Expert (Comité)</h3>
                <p className="opacity-60 font-medium">Intervention indépendante sur la valorisation et le risque.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-app-sm font-bold uppercase tracking-wider opacity-50">Valeur Vénale Experte (EUR)</label>
                  <input type="number" defaultValue="310000" className="w-full bg-white dark:bg-black/20 p-4 rounded-xl border border-black/10 dark:border-white/10 font-display text-xl" />
                </div>
                <div className="space-y-4">
                  <label className="text-app-sm font-bold uppercase tracking-wider opacity-50">Décote de Liquidité (%)</label>
                  <input type="number" defaultValue="15" className="w-full bg-white dark:bg-black/20 p-4 rounded-xl border border-black/10 dark:border-white/10 font-display text-xl text-danger" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-app-sm font-bold uppercase tracking-wider opacity-50">Notes & Points de vigilance</label>
                <textarea rows={4} className="w-full bg-white dark:bg-black/20 p-4 rounded-xl border border-black/10 dark:border-white/10 font-medium resize-none" defaultValue="Le sous-sol présente des traces d'humidité. La toiture devra être refaite sous 5 ans. Fort potentiel locatif."></textarea>
              </div>

              <div className="pt-4 flex gap-4 border-t border-gray-200 dark:border-white/10 dark:border-white/5">
                <button className="px-8 py-4 bg-success text-white font-bold rounded-xl shadow-lg hover:bg-success/90 transition-all flex items-center gap-2">
                  <CheckCircle2 size={20} /> Valider l'Expertise
                </button>
                <button className="px-8 py-4 bg-danger text-white font-bold rounded-xl shadow-lg hover:bg-danger/90 transition-all flex items-center gap-2">
                  <AlertCircle size={20} /> Rejeter / Suspendre
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="glass p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="text-app-xl font-bold">Calendrier des évènements</h3>
                <p className="text-app-sm opacity-60">Gérez vos rendez-vous notaire, visites et expertises.</p>
              </div>
              <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2">
                <Plus size={20} /> Placer un RDV
              </button>
            </div>
            
            <div className="grid md:grid-cols-7 gap-4">
              <div className="md:col-span-5 aspect-video md:aspect-auto md:h-[500px] bg-white/40 border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex items-center justify-center">
                <div className="text-center opacity-40">
                  <CalendarIcon size={48} className="mx-auto mb-4" />
                  <p className="font-bold">Vue Calendrier Interactive (Mock)</p>
                  <p className="text-app-sm">Intégration Google Calendar API en cours</p>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <h4 className="font-bold border-b border-gray-200 dark:border-white/10 pb-2">Prochains évènements</h4>
                <div className="p-4 bg-primary/5 dark:bg-white/10 border border-primary/20 rounded-2xl">
                  <div className="text-app-xs font-bold text-neutral-900 dark:text-white opacity-60 uppercase mb-1">Demain - 14:30</div>
                  <div className="font-bold">Visite Expert Technique</div>
                  <div className="text-app-xs opacity-70">Expertise structure et DPE</div>
                </div>
                <div className="p-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl">
                  <div className="text-app-xs font-bold opacity-60 uppercase mb-1">Le 03/05 - 10:00</div>
                  <div className="font-bold">Signature Mandat Notaire</div>
                  <div className="text-app-xs opacity-70">RDV Physique Lyon 6</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-app-xl font-bold">Conversations</h3>
                <button className="text-app-sm font-bold text-neutral-900 dark:text-white hover:underline flex items-center gap-2">
                  <Share2 size={16} /> Nouveau fil de discussion
                </button>
              </div>
              <div className="space-y-6">
                 <MessageItem 
                   name="Notaire Legrand" 
                   lastMsg="Bien reçu le titre de propriété. Je prépare le projet." 
                   time="Il y a 2h" 
                   unread={true} 
                 />
                 <MessageItem 
                   name="Agent Immobilier" 
                   lastMsg="Pouvez-vous uploader le dernier relevé de taxe foncière ?" 
                   time="Hier" 
                 />
              </div>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-primary/20 bg-primary/5 dark:bg-white/10 self-start">
              <h3 className="text-app-lg font-bold mb-4">Smart Share Status</h3>
              <p className="text-app-sm opacity-70 mb-6">Suivez qui a consulté votre Bundle d'Agrafe (ID: #BNDL-89XJ)</p>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-app-sm">
                    <span className="font-bold opacity-60">Notaire</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-[10px] font-bold">CONSULTÉ</span>
                 </div>
                 <div className="flex items-center justify-between text-app-sm">
                    <span className="font-bold opacity-60">Agent</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md text-[10px] font-bold">LIAISON ACTIVE</span>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-primary/5 dark:bg-white/10 rounded-xl flex items-center justify-center text-neutral-900 dark:text-white shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <span className="text-app-xs font-bold opacity-40 uppercase tracking-wider block">{label}</span>
        <span className="font-bold text-app-md">{value}</span>
      </div>
    </div>
  );
}

function StatusItem({ label, status }: { label: string, status: 'valid' | 'pending' | 'missing' }) {
  const styles = {
    valid: 'text-green-600 bg-green-100',
    pending: 'text-orange-600 bg-orange-100',
    missing: 'text-red-600 bg-red-100'
  };
  const icons = {
    valid: <CheckCircle2 size={16} />,
    pending: <Activity size={16} />,
    missing: <AlertCircle size={16} />
  };
  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-white/10 rounded-xl border border-gray-200 dark:border-white/10">
      <span className="text-app-sm font-bold opacity-70">{label}</span>
      <div className={cn("px-2 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-tight", styles[status])}>
        {icons[status]}
        {status === 'valid' ? 'Vérifié' : status === 'pending' ? 'En cours' : 'Manquant'}
      </div>
    </div>
  );
}

function ExportButton({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-white dark:bg-white/10 hover:border-primary/30 transition-all group">
      <div className="flex items-center gap-3">
        <Download size={18} className="opacity-40 group-hover:text-neutral-900 dark:text-white transition-colors" />
        <span className="text-app-sm font-bold opacity-70">{label}</span>
      </div>
      <ExternalLink size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function MessageItem({ name, lastMsg, time, unread }: any) {
  return (
    <div className={cn(
      "p-5 rounded-2xl border transition-all cursor-pointer relative",
      unread ? "bg-primary/5 dark:bg-white/10 border-primary/20 shadow-sm" : "bg-white/40 border-gray-200 dark:border-white/10 opacity-80 hover:opacity-100"
    )}>
      {unread && <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-neutral-900 dark:text-white">{name}</h4>
        <span className="text-[10px] font-bold opacity-40 uppercase">{time}</span>
      </div>
      <p className="text-app-sm opacity-70 line-clamp-1">{lastMsg}</p>
    </div>
  );
}
