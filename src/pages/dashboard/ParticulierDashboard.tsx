import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Camera, Building2, MapPin, ChevronRight, Activity, TrendingUp, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PropertyData } from '../../components/PropertyCard';
import { PropertyType } from '../../constants/property';
import { PropertyCreationWizard } from '../../components/PropertyCreationWizard';
import { SmartScannerPro } from '../../components/SmartScannerPro';
import { ScannerHandoffModal } from '../../components/ScannerHandoffModal';
import { PropertyDetailsView } from '../../components/PropertyDetailsView';
import { motion, AnimatePresence } from 'motion/react';
import { calculateAssetUnderwriting, AssetData } from '../../lib/underwritingEngine';
import { cn } from '../../lib/utils';
import { useProperties } from '../../features/particulier-dashboard/hooks/useProperties';

export function ParticulierDashboard() {
  const { profile } = useAuth();
  
  const { properties, isLoading, createProperty } = useProperties();

  const [showNewForm, setShowNewForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showScannerHandoff, setShowScannerHandoff] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);

  const handleStartScanner = () => {
    if (isMobile) {
      setShowScanner(true);
    } else {
      setShowScannerHandoff(true);
    }
  };

  const handleCreateProperty = async (data: any) => {
    try {
      await createProperty({
        type: data.type as PropertyType,
        address: data.address?.fullAddress || typeof data.address === 'string' ? data.address : 'Adresse à préciser',
        city: data.address?.city || 'Ville inconnue',
        estimatedValue: data.estimatedValue || 300000,
        status: 'documents_pending',
        isComplete: false,
        surface: data.surface,
        rooms: data.rooms,
        condition: data.condition,
        dpe: data.dpe,
        addressData: data.address,
        features: data.features
      });
      setShowNewForm(false);
    } catch (e) {
      console.error("Failed to create property", e);
    }
  };

  if (selectedProperty) {
    return (
      <PropertyDetailsView 
        property={selectedProperty} 
        onBack={() => setSelectedProperty(null)} 
      />
    );
  }

  return (
    <div className="relative min-h-[80vh] w-full max-w-7xl mx-auto space-y-8 rounded-[2.5rem] bg-gray-50/50 dark:bg-[#050505] p-4 sm:p-8 overflow-hidden">
      {/* 3D Background Elements Glassmorphism */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none" />

      <header className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-200 dark:border-white/10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:!text-white tracking-tight">Espace Particulier</h1>
          <p className="text-slate-500 dark:!text-white/60 font-medium mt-2">Pilotez la liquidité de votre patrimoine immobilier instantanément.</p>
        </div>
        {!showNewForm && (
          <div className="flex items-center gap-3 self-start sm:self-center">
            <button 
              onClick={handleStartScanner}
              className="px-6 py-3 rounded-2xl bg-white dark:bg-white/5 text-slate-900 dark:!text-white font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm border border-gray-200 dark:border-white/10"
            >
              <Camera size={18} /> <span className="hidden sm:inline">Smart Scanner</span>
            </button>
            <button 
              onClick={() => setShowNewForm(true)}
              className="px-6 py-3 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]"
            >
              <Plus size={18} /> <span className="hidden sm:inline">Nouveau Dossier</span>
            </button>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {showNewForm ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="relative z-10 w-full max-w-4xl mx-auto bg-white/80 dark:bg-white/5 backdrop-blur-3xl border border-white/20 p-8 rounded-[2rem] shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:!text-white">Nouveau Bien</h2>
              <button onClick={() => setShowNewForm(false)} className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-slate-900 dark:!text-white rounded-xl transition-colors font-medium">Annuler</button>
            </div>
            <PropertyCreationWizard 
              onComplete={handleCreateProperty} 
              onCancel={() => setShowNewForm(false)} 
            />
          </motion.div>
        ) : isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="relative z-10 flex flex-col items-center justify-center p-20 bg-white/50 dark:bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-xl"
          >
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
            <span className="text-slate-500 dark:!text-white/60 font-bold text-lg">Synchronisation de vos actifs institutionnels...</span>
          </motion.div>
        ) : properties.length === 0 ? (
          <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             className="relative z-10 bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-16 flex flex-col items-center text-center border border-white/20 shadow-xl"
          >
            <div className="w-24 h-24 bg-primary/10 dark:bg-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
              <Building2 size={48} className="text-primary dark:text-white/50" />
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:!text-white mb-4">Aucun actif détecté</h2>
            <p className="text-slate-500 dark:!text-white/60 max-w-md mx-auto mb-10 text-lg leading-relaxed">
              Ajoutez votre premier bien immobilier pour déclencher notre moteur de structuration institutionnel et analyser sa liquidité.
            </p>
            <button 
              onClick={() => setShowNewForm(true)}
              className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:scale-105 transition-transform flex items-center gap-3 text-lg"
            >
              <Plus size={24} /> Créer mon premier dossier
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-8"
          >
            {properties.map(prop => (
              <DashboardPropertyBasiqueCard 
                key={prop.id} 
                property={prop} 
                onClick={() => setSelectedProperty(prop)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScannerHandoff && (
          <ScannerHandoffModal 
            onLocalScanner={() => {
              setShowScannerHandoff(false);
              setShowScanner(true);
            }}
            onCancel={() => setShowScannerHandoff(false)}
            onSuccess={() => {
              setShowScannerHandoff(false);
              console.log("Documents received from mobile applet!");
            }}
          />
        )}
        {showScanner && (
          <SmartScannerPro
            expectedDocType="Justificatif de domicile (Facture)"
            onComplete={(files) => {
              console.log("Files scanned:", files);
              setShowScanner(false);
            }}
            onCancel={() => setShowScanner(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DashboardPropertyBasiqueCard({ property, onClick }: { property: PropertyData, onClick: () => void }) {
  const asset: AssetData = {
    id: property.id,
    clientId: 'me',
    clientName: 'Moi',
    clientType: 'PP',
    clientStatus: 'Particulier',
    city: property.city,
    propertyType: property.type,
    referenceValue: property.estimatedValue || 300000,
    surface: (property.surface as number) || 100,
    offerTarget: property.estimatedValue > 500000 ? 'Premium' : 'Équilibre',
    existingDebt: property.estimatedValue * 0.1,
    agencyFees: property.estimatedValue * 0.05,
    actFees: property.estimatedValue * 0.02,
    marketLiquidityDelay: property.estimatedValue > 600000 ? 120 : 45,
    legalQualityScore: property.isComplete ? 95 : 45,
    assetQuality: 4,
    exitReadability: 4,
    sellerProfile: 4,
    complexity: 2,
    benchmarkPrice: (property.estimatedValue || 300000) / ((property.surface as number) || 100),
    distanceLargeCity: 10,
    accessTimeLargeCity: 20,
    population: 150000
  };

  const results = calculateAssetUnderwriting(asset);
  const formatEur = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  let mainReserve = "-";
  if (results.legalQualityScore < 50) mainReserve = "Pièces juridiques incomplètes";
  else if (results.liquidityIndex < 60) mainReserve = "Liquidité marché faible";
  else if (results.fundScore < 60) mainReserve = "Score global trop bas";

  let exitStrategy = "Vente classique 6 mois";
  if (results.offerTarget === 'Premium') exitStrategy = "Ventes institutionnelles ciblées";

  const getLightColors = (light: string) => {
    switch (light) {
      case 'Vert': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'Orange': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'Rouge': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      default: return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/10 dark:text-white/60 dark:border-white/10';
    }
  };

  const dossierColors = getLightColors(results.dossierLight);
  const legalColors = getLightColors(results.legalLight);

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.01, rotateX: 2, rotateY: -2 }}
      style={{ perspective: 1000 }}
      onClick={onClick}
      className={cn(
        "bg-white/80 dark:bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border transition-all cursor-pointer group flex flex-col h-full shadow-xl hover:shadow-2xl",
        results.dossierLight === 'Vert' ? 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-500/20 dark:hover:border-emerald-500/40 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]' : 
        results.dossierLight === 'Orange' ? 'border-amber-200 hover:border-amber-400 dark:border-amber-500/20 dark:hover:border-amber-500/40 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)]' : 
        'border-red-200 hover:border-red-400 dark:border-red-500/20 dark:hover:border-red-500/40 hover:shadow-[0_20px_40px_-15px_rgba(239,68,68,0.3)]'
      )}
    >
      <div className="flex justify-between items-start mb-8 border-b border-gray-200 dark:border-white/10 pb-6 gap-4">
        <div>
          <h3 className="font-bold text-2xl text-slate-900 dark:!text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
               <Building2 size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            {property.type}
          </h3>
          <p className="text-slate-500 dark:!text-white/60 flex items-center gap-2 mt-3 font-medium">
            <MapPin size={16} /> {typeof property.address === 'string' ? property.address : (property.address as any)?.fullAddress || 'Adresse non spécifiée'}, {property.city}
          </p>
        </div>
        <div className={cn("px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold border", dossierColors)}>
          <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", results.dossierLight === 'Vert' ? 'bg-emerald-500' : results.dossierLight === 'Orange' ? 'bg-amber-500' : 'bg-red-500')} />
          Opération {results.dossierLight}
        </div>
      </div>

      <div className="flex-1 grid sm:grid-cols-2 gap-x-10 gap-y-8 mb-8">
        <div className="space-y-5">
          <div className="flex justify-between items-center bg-gray-50/50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
            <span className="text-sm font-medium text-slate-500 dark:!text-white/60">Score Global</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 dark:!text-white">{results.fundScore}/100</span>
              <Activity size={18} className={results.fundScore >= 70 ? 'text-emerald-500' : 'text-amber-500'} />
            </div>
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-slate-500 dark:!text-white/60">Avis Expert</span>
            <span className="font-bold text-sm text-right text-slate-900 dark:!text-white">{results.expertOpinion}</span>
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-slate-500 dark:!text-white/60">Décision Rapide</span>
            <span className={cn("px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider",
               results.reco === 'Go' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 
               results.reco === 'À revoir' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
            )}>
              {results.reco}
            </span>
          </div>
          {mainReserve !== "-" && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl mt-4">
              <div className="text-[11px] font-bold uppercase text-red-600 dark:text-red-400 opacity-80 mb-2 flex items-center gap-1.5">
                <ShieldAlert size={14} /> Réserve Principale
              </div>
              <div className="text-sm font-medium text-red-900 dark:text-red-200 leading-tight">{mainReserve}</div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-slate-500 dark:!text-white/60">Valeur de référence</span>
            <span className="font-bold text-slate-900 dark:!text-white text-lg">{formatEur(results.referenceValue)}</span>
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-slate-500 dark:!text-white/60">LTV Cible</span>
            <span className="font-bold text-slate-900 dark:!text-white text-lg">{(results.baseIntervention / results.referenceValue * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-slate-500 dark:!text-white/60">Marge de Sécurité</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{(results.securityMargin * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between items-center px-2 pt-2 border-t border-gray-100 dark:border-white/10">
            <span className="text-sm font-medium text-slate-500 dark:!text-white/60">Sortie Réaliste</span>
            <span className="font-bold text-sm text-right text-blue-600 dark:text-blue-400">{exitStrategy}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
         <div className="p-5 bg-blue-50/50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600/70 dark:text-blue-400/80 mb-2">Base d'Intervention</span>
            <span className="text-2xl font-black text-blue-700 dark:text-blue-400">{formatEur(results.baseIntervention)}</span>
         </div>
         <div className="p-5 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/80 mb-2">Net Client Immédiat</span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{formatEur(results.netClientImmediat)}</span>
         </div>
      </div>

      <div className="mt-auto px-5 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-between border border-gray-200 dark:border-white/10 transition-colors group-hover:bg-blue-50/50 dark:group-hover:bg-blue-500/5 group-hover:border-blue-200 dark:group-hover:border-blue-500/20">
        <div className="flex items-center gap-3">
          <div className={cn("px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wider", legalColors)}>
             Feu {results.legalLight}
          </div>
          <span className="text-sm font-medium text-slate-500 dark:!text-white/60">Sécurité relative</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
             <span className="block text-[10px] font-bold text-slate-400 dark:!text-white/40 uppercase tracking-wider">Score Pièces</span>
             <span className="text-sm font-bold text-slate-900 dark:!text-white">{results.legalQualityScore}/100</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-blue-600 dark:text-white/70 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-gray-200 dark:border-white/10 group-hover:border-transparent group-hover:scale-110">
            <ChevronRight size={20} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

