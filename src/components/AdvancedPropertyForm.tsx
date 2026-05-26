import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PropertySearchSelect } from './PropertySearchSelect';
import { AddressSearchInput } from './AddressSearchInput';
import { PropertyType } from '../constants/property';
import { cn } from '../lib/utils';
import { calculateRealTimeEstimation, TestEstimationEngine } from '../lib/estimationEngine';
import { useAuth } from '../contexts/AuthContext';
import { 
  Save, Plus, ChevronDown, MapPin, Home, Trees, Building, 
  Train, GraduationCap, ShoppingCart, Waves, Sun, 
  Accessibility, Flame, Phone, CheckSquare, Droplets, Zap, Users, Dumbbell, Calculator, Activity, Hash
} from 'lucide-react';

interface AdvancedPropertyFormProps {
  onSave: (data: any) => void;
  onSaveAndAddAnother: (data: any) => void;
  onCancel: () => void;
  isWizardStep?: boolean;
}

const AccordionSection = ({ title, icon: Icon, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-white/10 rounded-[1.5rem] bg-gray-50/50 dark:bg-white/10 overflow-hidden transition-all shadow-sm hover:shadow-md">
      <button 
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className="w-full flex items-center justify-between p-4 sm:p-6 bg-white dark:bg-white/10 hover:bg-gray-50 dark:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3 sm:gap-4">
           <div className="p-1.5 sm:p-2 bg-primary/5 rounded-xl text-neutral-900 dark:text-white">
             <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
           </div>
           <span className="font-bold text-app-base sm:text-app-md text-neutral-900 dark:text-white">{title}</span>
        </div>
        <ChevronDown className={cn("w-5 h-5 sm:w-6 sm:h-6 text-neutral-600 dark:text-neutral-300 dark:text-white transition-transform", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-gray-200 dark:border-white/10 space-y-8 bg-gray-50 dark:bg-white/10">
               {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
};

export const AdvancedPropertyForm: React.FC<AdvancedPropertyFormProps> = ({ onSave, onSaveAndAddAnother, onCancel, isWizardStep }) => {
  const { profile } = useAuth();
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [type, setType] = useState<PropertyType>('Appartement');
  const [addressData, setAddressData] = useState<any>(null);
  const [surface, setSurface] = useState<string>('');
  const [landSurface, setLandSurface] = useState<string>('');
  const [rooms, setRooms] = useState<string>('3');
  const [bedrooms, setBedrooms] = useState<string>('2');
  const [floor, setFloor] = useState<string>('');
  const [totalFloors, setTotalFloors] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('Sans viager');

  
  const [features, setFeatures] = useState<string[]>([]);
  const [condition, setCondition] = useState<string>('Bon état');
  const [dpe, setDpe] = useState<string>('C');

  const [iaAnalysisStatus, setIaAnalysisStatus] = useState<string | null>(null);

  // Intelligence artificielle simulée pour auto-remplir selon la géolocalisation
  useEffect(() => {
    if (addressData?.zipCode) {
      setIaAnalysisStatus("Analyse IA/DVF en cours...");
      
      // Simulate small network delay for AI feel
      const timeout = setTimeout(() => {
        setFeatures(prev => {
          const newFeatures = new Set(prev);
          
          const zipPrefix = (addressData.zipCode || '').substring(0, 2);
          const zipNum = parseInt(addressData.zipCode || '0', 10);
          
          // Simuler une classification du quartier
          const isDenseCity = ['75', '69', '13', '33', '31', '44', '59', '67', '34'].includes(zipPrefix) && zipNum % 1000 <= 100;
          const isLittoral = ['06', '14', '17', '22', '29', '34', '56', '83', '85'].includes(zipPrefix);
          const isCampagne = !isDenseCity && !isLittoral && zipNum % 1000 > 200;

          // Auto-déduction Environnement
          if (isDenseCity) newFeatures.add('Ville');
          else if (isLittoral) { newFeatures.add('Plage/Littoral'); newFeatures.add('Commune littorale'); }
          else if (isCampagne) newFeatures.add('Campagne');
          else newFeatures.add('Ville'); // Ville de taille moyenne par défaut

          // Auto-déduction Commodités (En ville: tout. A la campagne: juste un peu)
          if (isDenseCity || !isCampagne) {
            newFeatures.add('Proche transports');
            newFeatures.add('Écoles à proximité');
            newFeatures.add('Proche commerces');
            newFeatures.add('Associations');
            newFeatures.add('Clubs sportifs');
          } else {
            newFeatures.add('Associations'); // Généralement au moins une mairie/asso
            newFeatures.add('Nature');
          }
          
          // Exigences utilisateur spécifiques: déduire "piscine" si on est proche mer ou sud par exemple
          if (isLittoral || zipPrefix === '13' || zipPrefix === '83' || zipPrefix === '06') {
            // Suggesting instead of forcing, but let's just add it for demo
          }

          setIaAnalysisStatus(`Environnement pré-rempli grâce aux bases DVF pour ${addressData.city || 'cette zone'}.`);
          setTimeout(() => setIaAnalysisStatus(null), 5000);

          return Array.from(newFeatures);
        });
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [addressData?.zipCode]);

  const DPE_GRADES = [
    { label: 'A', color: 'bg-[#008000] text-white' },
    { label: 'B', color: 'bg-[#339900] text-white' },
    { label: 'C', color: 'bg-[#99CC00] text-neutral-dark' },
    { label: 'D', color: 'bg-[#FFFF00] text-neutral-dark' },
    { label: 'E', color: 'bg-[#FFCC00] text-neutral-dark' },
    { label: 'F', color: 'bg-[#FF9900] text-white' },
    { label: 'G', color: 'bg-[#FF0000] text-white' },
  ];

  const handleToggleFeature = (val: string) => {
    if (features.includes(val)) {
      setFeatures(features.filter(item => item !== val));
    } else {
      setFeatures([...features, val]);
    }
  };

  const getFormData = () => ({
    type, address: addressData, surface, landSurface, rooms, bedrooms, floor, totalFloors,
    transactionType, features, condition, dpe, referenceNumber,
    estimatedValue: liveEstimation?.finalPrice || 0
  });

  const handleSaveAndAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    onSaveAndAddAnother(getFormData());
    
    // Reset form briefly
    setAddressData(null);
    setSurface('');
    setLandSurface('');
    setRooms('3');
    setBedrooms('2');
    setFloor('');
    setTotalFloors('');
    setFeatures([]);
    setCondition('Bon état');
    setDpe('C');
  };

  const CheckboxGroup = ({ options, title }: { options: any[], title?: string }) => (
    <div className="space-y-3">
      {title && <span className="text-app-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 dark:text-white/40 flex items-center gap-2">{title}</span>}
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const val = opt.label || opt;
          const isSelected = features.includes(val);
          const Icon = opt.icon;
          return (
            <button
              key={val}
              onClick={(e) => { e.preventDefault(); handleToggleFeature(val); }}
              className={cn(
                "px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-app-xs sm:text-app-sm font-bold transition-all border flex items-center gap-2",
                isSelected 
                  ? "bg-primary text-white border-primary shadow-md scale-105" 
                  : "bg-white dark:bg-white/10 border-gray-200 dark:border-white/10 text-neutral-900 dark:text-white hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-white/10"
              )}
            >
              {Icon && <Icon size={14} className={cn("sm:w-4 sm:h-4", isSelected ? "text-white" : "text-neutral-600 dark:text-neutral-300 dark:text-white")} />}
              {val}
            </button>
          )
        })}
      </div>
    </div>
  );

  const liveEstimation = useMemo(() => {
    if (!surface || !addressData) return null;
    const s = parseFloat(surface);
    if (isNaN(s)) return null;

    return calculateRealTimeEstimation({
      surface: s,
      zipCode: addressData.zipCode || '',
      condition: condition,
      features: features,
      dpe: dpe,
      propertyType: type,
      floor: floor,
      totalFloors: totalFloors
    });
  }, [surface, addressData, condition, features, dpe, type, floor, totalFloors]);

  return (
    <div className="glass p-5 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-200 dark:border-white/10 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 sm:px-2 gap-4">
        <div>
          <h2 className="text-app-xl sm:text-app-2xl font-display font-bold text-neutral-900 dark:text-white">Créer une Fiche Bien</h2>
          <p className="text-app-sm sm:text-app-base text-neutral-dark/60 mt-1 sm:mt-2">Détaillez les caractéristiques expertes pour une valorisation précise.</p>
        </div>
        <button onClick={onCancel} className="w-full sm:w-auto text-app-sm font-bold text-neutral-600 dark:text-neutral-300 dark:text-white hover:text-neutral-900 dark:text-white transition-colors bg-white dark:bg-white/10 px-4 py-2 rounded-xl">Ignorer</button>
      </div>

      <div className="space-y-4">
        <AccordionSection title="Informations Générales" icon={Home} defaultOpen={true}>
          <div className="space-y-8">
            {profile?.isPro && (
              <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/20 space-y-4">
                <div className="flex items-center gap-2 text-secondary">
                  <Hash size={20} />
                  <span className="font-bold uppercase text-app-xs tracking-wider">Référence Dossier Professionnel</span>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Ex: MANDAT-2024-XP"
                    className="w-full bg-white border border-secondary/20 rounded-xl px-4 py-3 outline-none focus:border-secondary transition-all font-bold text-neutral-900 dark:text-white"
                  />
                  <p className="text-[10px] text-neutral-dark/60 mt-2 italic">Cette référence sera utilisée pour identifier la provenance (Fiche de dénonciation).</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-app-sm font-bold text-neutral-900 dark:text-white">Type de bien</label>
                <PropertySearchSelect value={type} onChange={setType} />
              </div>

              <div className="space-y-3">
                <label className="block text-app-sm font-bold text-neutral-900 dark:text-white">Adresse du bien</label>
                <AddressSearchInput onAddressSelect={setAddressData} />
                <AnimatePresence>
                  {iaAnalysisStatus && (
                    <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       exit={{ opacity: 0, height: 0 }}
                       className="p-3 bg-gray-200 border border-secondary/20 rounded-xl flex items-center gap-2 text-secondary text-app-sm font-bold mt-2"
                    >
                      <Activity size={16} className="shrink-0" /> {iaAnalysisStatus}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-app-sm font-bold text-neutral-900 dark:text-white">Surface Habitable (m²)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={surface} 
                      onChange={(e) => setSurface(e.target.value)}
                      placeholder="Ex: 85"
                      className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold opacity-40">m²</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-app-sm font-bold text-neutral-900 dark:text-white">Surface Terrain (m²)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        value={landSurface} 
                        onChange={(e) => setLandSurface(e.target.value)}
                        placeholder="Ex: 500"
                        className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold opacity-40">m²</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                   <div className="flex-1 space-y-3">
                     <label className="block text-app-sm font-bold text-neutral-900 dark:text-white">Pièces</label>
                     <select 
                       value={rooms} 
                       onChange={(e) => setRooms(e.target.value)}
                       className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-neutral-900 dark:text-white appearance-none cursor-pointer"
                     >
                       {[1, 2, 3, 4, 5, 6, 7, '8+'].map(num => <option key={num} value={num}>{num} {num === '8+' ? '' : 'pièces'}</option>)}
                     </select>
                   </div>
                   <div className="flex-1 space-y-3">
                     <label className="block text-app-sm font-bold text-neutral-900 dark:text-white">Chambres</label>
                     <select 
                       value={bedrooms} 
                       onChange={(e) => setBedrooms(e.target.value)}
                       className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-neutral-900 dark:text-white appearance-none cursor-pointer"
                     >
                       {[0, 1, 2, 3, 4, 5, 6, 7, '8+'].map(num => <option key={num} value={num}>{num} {num === '8+' ? '' : 'chambres'}</option>)}
                     </select>
                   </div>
                </div>

                {type === 'Appartement' && (
                  <div className="flex gap-4">
                     <div className="flex-1 space-y-3">
                       <label className="block text-app-sm font-bold text-neutral-900 dark:text-white">Étage (0 = RDC)</label>
                       <input 
                         type="number"
                         min="0"
                         value={floor} 
                         onChange={(e) => setFloor(e.target.value)}
                         placeholder="Ex: 3"
                         className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                       />
                     </div>
                     <div className="flex-1 space-y-3">
                       <label className="block text-app-sm font-bold text-neutral-900 dark:text-white">Nbr d'étages total</label>
                       <input 
                         type="number"
                         min="1"
                         value={totalFloors} 
                         onChange={(e) => setTotalFloors(e.target.value)}
                         placeholder="Ex: 5"
                         className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                       />
                     </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-app-sm font-bold text-neutral-900 dark:text-white">Type de transaction</label>
                  <div className="flex gap-2">
                    {['Sans viager', 'Avec viager'].map(t => (
                      <button
                        key={t}
                        onClick={(e) => { e.preventDefault(); setTransactionType(t); }}
                        className={cn(
                          "flex-1 py-3 rounded-xl font-bold transition-all border",
                          transactionType === t ? "bg-primary text-white border-primary shadow-md" : "bg-white dark:bg-white/10 text-neutral-900 dark:text-white border-gray-200 dark:border-white/10 hover:border-primary/30"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title="Environnement & Localisation" icon={MapPin}>
          <CheckboxGroup title="Environnement" options={[
            { label: 'Ville', icon: Building },
            { label: 'Campagne', icon: Trees },
            { label: 'Plage/Littoral', icon: Waves },
            { label: 'Montagne', icon: MapPin },
          ]} />
          
          <CheckboxGroup title="Commodités" options={[
            { label: 'Proche transports', icon: Train },
            { label: 'Écoles à proximité', icon: GraduationCap },
            { label: 'Proche commerces', icon: ShoppingCart },
            { label: 'Associations', icon: Users },
            { label: 'Clubs sportifs', icon: Dumbbell },
          ]} />

          <CheckboxGroup title="Atouts" options={[
            { label: 'Vue mer', icon: Waves },
            { label: 'Commune littorale', icon: MapPin },
          ]} />
        </AccordionSection>

        <AccordionSection title="Terrain & Extérieurs" icon={Trees}>
          <CheckboxGroup title="Espaces Extérieurs" options={[
            'Jardin', 'Terrasse', 'Balcon', 'Véranda', 'Rooftop', 'Rez-de-jardin'
          ]} />
          <CheckboxGroup title="Aménagements & Annexes" options={[
            'Piscine', 'Garage / Parking', 'Dépendance', 'Puits'
          ]} />
        </AccordionSection>

        <AccordionSection title="Confort & Intérieur" icon={CheckSquare}>
          <CheckboxGroup title="Accessibilité & Commun" options={[
            { label: 'Ascenseur', icon: Accessibility },
            { label: 'Accès PMR', icon: Accessibility },
            { label: 'Interphone', icon: Phone },
            { label: 'Plain-pied', icon: Home },
          ]} />

          <CheckboxGroup title="Confort & Connectivité" options={[
            'Placard / Dressing', 'Grenier / Cave', 'Parquet', 'Wi-Fi (Fibre, ADSL...)', 'Parking privé'
          ]} />

          <CheckboxGroup title="Sanitaires & Bien-être" options={[
            { label: 'Salle d\'eau (Douche)', icon: Droplets }, 
            { label: 'Salle de bain (Baignoire)', icon: Droplets },
            { label: 'Sauna', icon: Droplets },
            { label: 'Hammam', icon: Droplets },
            { label: 'Spa', icon: Droplets },
            { label: 'Salle de massage', icon: Droplets }
          ]} />
        </AccordionSection>

        <AccordionSection title="Énergie & État" icon={Zap}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-app-sm font-bold text-neutral-900 dark:text-white">État général du bien</label>
              <select 
                 value={condition} 
                 onChange={(e) => setCondition(e.target.value)}
                 className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-neutral-900 dark:text-white appearance-none cursor-pointer"
               >
                 {['Très bon état', 'Bon état', 'Rénové', 'À rafraîchir', 'Travaux à prévoir', 'À rénover'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
               </select>
               
               <div className="pt-2">
                 <CheckboxGroup title="Énergie Verte" options={[
                  { label: 'Chauffage au bois', icon: Flame },
                  { label: 'Panneaux solaires photovoltaïques', icon: Sun },
                 ]} />
               </div>
            </div>

            <div className="space-y-4">
              <label className="block text-app-sm font-bold text-neutral-900 dark:text-white">Diagnostic de Performance Énergétique (DPE)</label>
              <div className="flex flex-wrap sm:flex-nowrap gap-1 bg-gray-50/50 dark:bg-white/10 p-1.5 sm:p-2 rounded-2xl border border-gray-200 dark:border-white/10">
                {DPE_GRADES.map(grade => (
                  <button
                    key={grade.label}
                    onClick={(e) => { e.preventDefault(); setDpe(grade.label); }}
                    className={cn(
                      "flex-1 min-w-[35px] sm:min-w-0 py-2 sm:py-3 text-[10px] sm:text-app-xs font-extrabold transition-all rounded-lg relative overflow-hidden",
                      dpe === grade.label ? "scale-105 z-10 shadow-md border-transparent" : "border-transparent opacity-50 hover:opacity-100",
                      grade.color,
                      dpe === grade.label && "opacity-100"
                    )}
                  >
                    {grade.label}
                    {dpe === grade.label && (
                      <motion.div layoutId="dpe-selection" className="absolute inset-0 bg-gray-50 dark:bg-white/10 mix-blend-overlay" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </AccordionSection>
      </div>

      {liveEstimation && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20 flex flex-col items-stretch justify-between gap-6 overflow-hidden relative"
        >
          <div className="flex flex-col md:flex-row justify-between gap-6 z-10 w-full mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-app-md text-neutral-900 dark:text-white/40 flex items-center gap-2 mb-2">
                <Calculator size={20} /> Estimation Intelligente (IA & Data)
              </h3>
              <p className="text-app-sm opacity-70 mb-4 max-w-lg">
                Le prix est calculé en temps réel en analysant les ventes récentes du secteur et en appliquant nos coefficients de valorisation exclusifs sur vos critères.
              </p>
              
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-white/10 rounded-xl border border-gray-200 dark:border-white/10 w-fit">
                 <Activity className="text-neutral-900 dark:text-white" size={16} />
                 <span className="text-app-xs font-bold opacity-60 uppercase tracking-wider">Indice de Fiabilité</span>
                 <div className="w-24 h-2 bg-black/10 rounded-full overflow-hidden ml-2">
                    <div className={cn("h-full", liveEstimation.confidenceIndex > 80 ? "bg-green-500" : "bg-orange-500")} style={{ width: `${liveEstimation.confidenceIndex}%` }} />
                 </div>
                 <span className="text-app-sm font-bold text-neutral-900 dark:text-white ml-1">{liveEstimation.confidenceIndex}%</span>
              </div>
            </div>
            
            <div className="text-center md:text-right flex flex-col justify-end">
              <div className="text-app-sm font-bold opacity-60 mb-1">Estimation affinée à</div>
              <div className="text-app-3xl font-display font-bold text-neutral-900 dark:text-white">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(liveEstimation.finalPrice)}
              </div>
              <div className="text-app-xs font-bold text-primary/50 mt-1">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(liveEstimation.lowBound)} — {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(liveEstimation.highBound)}
              </div>
            </div>
          </div>
          
          <div className="w-full pt-4 mt-2 border-t border-primary/10 flex flex-wrap gap-2 text-app-xs font-bold">
            <span className="opacity-60 px-2 py-1">Facteurs appliqués :</span>
            {Object.entries(liveEstimation.multipliersApplied).map(([name, val]: [string, any]) => (
              <span key={name} className={cn("px-2 py-1 rounded-md", (val as number) > 0 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}>
                {name} ({(val as number) > 0 ? '+' : ''}{Math.round((val as number) * 100)}%)
              </span>
            ))}
            {Object.keys(liveEstimation.multipliersApplied).length === 0 && (
               <span className="px-2 py-1 opacity-40 italic">Aucun filtre de sur/sous-cote actif</span>
            )}
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-white/10">
        {!isWizardStep && (
          <button 
            onClick={handleSaveAndAdd}
            className="px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-white dark:bg-white/10 text-neutral-900 dark:text-white border border-gray-200 dark:border-white/10 hover:border-primary/20 hover:bg-gray-50 dark:hover:bg-white/10 shadow-sm hover:shadow-md"
          >
            Valider et ajouter un autre <Plus size={20} />
          </button>
        )}
        <button 
          onClick={(e) => { e.preventDefault(); onSave(getFormData()); }}
          className="px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          {isWizardStep ? 'Suivant : Documents' : 'Enregistrer le bien'} {!isWizardStep && <Save size={20} />}
        </button>
      </div>
    </div>
  );
};

