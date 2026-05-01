import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'synthesis' | 'calendar' | 'messages'>('overview');

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
    { id: 'calendar', label: 'Calendrier', icon: CalendarIcon },
    { id: 'messages', label: 'Messages / Share', icon: Mail },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white/60 border border-black/5 hover:bg-white transition-all shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">{property.type} à {property.city}</h1>
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
                : "text-primary/60 hover:bg-white/40 hover:text-primary"
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
              <div className="glass p-8 rounded-[2.5rem] border border-black/5">
                <h3 className="text-xl font-bold mb-6">Détails de la propriété</h3>
                <div className="grid sm:grid-cols-2 gap-8">
                  <DetailItem label="Surface habitable" value={`${propertyFullData.surface} m²`} icon={Maximize2} />
                  <DetailItem label="Nombre de pièces" value={`${propertyFullData.rooms} pièces`} icon={Building2} />
                  <DetailItem label="État" value={propertyFullData.condition} icon={Activity} />
                  <DetailItem label="DPE" value={propertyFullData.dpe} icon={Settings} />
                  <div className="sm:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-40 block mb-3">Équipements</span>
                    <div className="flex flex-wrap gap-2">
                      {propertyFullData.features.map(f => (
                        <span key={f} className="px-3 py-1.5 bg-primary/5 text-primary rounded-lg text-sm font-bold border border-primary/10">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass p-8 rounded-[2.5rem] border border-black/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Simulation Wallnut (Affinée)</h3>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider">Calcul Intégré</div>
                </div>
                <div className="space-y-4">
                  {(() => {
                    // Mapping mock/existing properties to AssetData for calculation
                    const assetToUnderwrite = {
                      id: propertyFullData.id,
                      clientId: "me",
                      clientName: "Me",
                      clientType: "PP" as const,
                      clientStatus: "Particulier",
                      city: propertyFullData.city,
                      propertyType: propertyFullData.type,
                      referenceValue: propertyFullData.estimatedValue || 300000,
                      surface: propertyFullData.surface || 100,
                      offerTarget: 'Premium' as const, 
                      existingDebt: 50000, 
                      agencyFees: 10000,
                      actFees: 5000,
                      marketLiquidityDelay: 45,
                      legalQualityScore: 80,
                      assetQuality: 4,
                      exitReadability: 4,
                      sellerProfile: 4,
                      complexity: 2,
                      benchmarkPrice: (propertyFullData.estimatedValue || 300000) / (propertyFullData.surface || 100),
                      distanceLargeCity: 10,
                      accessTimeLargeCity: 20,
                      population: 150000
                    };
                    const underwritingResult = require('../lib/underwritingEngine').calculateAssetUnderwriting(assetToUnderwrite);
                    const formatEur = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
                    return (
                      <>
                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold opacity-70">Valeur de référence retenue</span>
                            <span className="font-bold">{formatEur(underwritingResult.referenceValue)}</span>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold opacity-70">Base de financement ({underwritingResult.offerTarget})</span>
                            <span className="font-bold text-primary">{formatEur(underwritingResult.baseIntervention)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold opacity-70">Net Immédiat au Client</span>
                            <span className="font-bold text-success text-lg">{formatEur(underwritingResult.netClientImmediat)}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 border border-black/5 rounded-2xl flex flex-col justify-center items-center text-center">
                             <div className="text-[10px] font-bold uppercase opacity-50">Dettes à apurer</div>
                             <div className="font-bold text-danger">{formatEur(underwritingResult.existingDebt)}</div>
                           </div>
                           <div className="p-4 border border-black/5 rounded-2xl flex flex-col justify-center items-center text-center">
                             <div className="text-[10px] font-bold uppercase opacity-50">Frais Notaire & Agence</div>
                             <div className="font-bold">{formatEur(underwritingResult.actFees + underwritingResult.agencyFees)}</div>
                           </div>
                        </div>
                        <div className="text-xs opacity-50 text-center font-medium mt-2">
                          *Simulation basée sur l'offre {underwritingResult.offerTarget} (jusqu'à 80% de LTV). Soumis à validation du comité.
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-8 rounded-[2.5rem] border border-primary/20 bg-primary/5">
                <h3 className="text-xl font-bold text-primary mb-4">Statut Administratif</h3>
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

              <div className="glass p-8 rounded-[2.5rem] border border-black/5">
                <h3 className="text-xl font-bold mb-4">Export rapide</h3>
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

        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="glass p-8 rounded-[2.5rem] border border-black/5"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-bold">Calendrier des évènements</h3>
                <p className="text-sm opacity-60">Gérez vos rendez-vous notaire, visites et expertises.</p>
              </div>
              <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2">
                <Plus size={20} /> Placer un RDV
              </button>
            </div>
            
            <div className="grid md:grid-cols-7 gap-4">
              <div className="md:col-span-5 aspect-video md:aspect-auto md:h-[500px] bg-white/40 border border-black/5 rounded-3xl p-6 flex items-center justify-center">
                <div className="text-center opacity-40">
                  <CalendarIcon size={48} className="mx-auto mb-4" />
                  <p className="font-bold">Vue Calendrier Interactive (Mock)</p>
                  <p className="text-sm">Intégration Google Calendar API en cours</p>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <h4 className="font-bold border-b border-black/5 pb-2">Prochains évènements</h4>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                  <div className="text-xs font-bold text-primary opacity-60 uppercase mb-1">Demain - 14:30</div>
                  <div className="font-bold">Visite Expert Technique</div>
                  <div className="text-xs opacity-70">Expertise structure et DPE</div>
                </div>
                <div className="p-4 bg-white/60 border border-black/5 rounded-2xl">
                  <div className="text-xs font-bold opacity-60 uppercase mb-1">Le 03/05 - 10:00</div>
                  <div className="font-bold">Signature Mandat Notaire</div>
                  <div className="text-xs opacity-70">RDV Physique Lyon 6</div>
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
            <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-black/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Conversations</h3>
                <button className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
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

            <div className="glass p-8 rounded-[2.5rem] border border-primary/20 bg-primary/5 self-start">
              <h3 className="text-xl font-bold mb-4">Smart Share Status</h3>
              <p className="text-sm opacity-70 mb-6">Suivez qui a consulté votre Bundle d'Agrafe (ID: #BNDL-89XJ)</p>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-sm">
                    <span className="font-bold opacity-60">Notaire</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-[10px] font-bold">CONSULTÉ</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
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
      <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <span className="text-xs font-bold opacity-40 uppercase tracking-wider block">{label}</span>
        <span className="font-bold text-lg">{value}</span>
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
    <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-black/5">
      <span className="text-sm font-bold opacity-70">{label}</span>
      <div className={cn("px-2 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-tight", styles[status])}>
        {icons[status]}
        {status === 'valid' ? 'Vérifié' : status === 'pending' ? 'En cours' : 'Manquant'}
      </div>
    </div>
  );
}

function ExportButton({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-white/60 border border-black/5 rounded-2xl hover:bg-white hover:border-primary/30 transition-all group">
      <div className="flex items-center gap-3">
        <Download size={18} className="opacity-40 group-hover:text-primary transition-colors" />
        <span className="text-sm font-bold opacity-70">{label}</span>
      </div>
      <ExternalLink size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function MessageItem({ name, lastMsg, time, unread }: any) {
  return (
    <div className={cn(
      "p-5 rounded-2xl border transition-all cursor-pointer relative",
      unread ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-white/40 border-black/5 opacity-80 hover:opacity-100"
    )}>
      {unread && <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-primary">{name}</h4>
        <span className="text-[10px] font-bold opacity-40 uppercase">{time}</span>
      </div>
      <p className="text-sm opacity-70 line-clamp-1">{lastMsg}</p>
    </div>
  );
}
