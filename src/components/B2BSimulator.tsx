import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { b2bSimulatorSchema, B2BSimulatorFormData, defaultB2BValues } from './b2b-simulator/schema';
import { Calculator, CheckCircle2, ChevronRight, Plus, ChevronLeft, RefreshCw, User, Home, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

function InputRow({ label, name, type = "text", options }: { label: string, name: keyof B2BSimulatorFormData, type?: string, options?: string[] }) {
  const { register, formState: { errors } } = useFormContext<B2BSimulatorFormData>();
  const error = errors[name]?.message as string;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-white/10 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0 relative group">
      <div className="sm:w-1/2 flex flex-col justify-center pr-4 mb-2 sm:mb-0">
        <span className="text-[13px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
        {error && <span className="text-[11px] font-bold text-red-500 mt-0.5">{error}</span>}
      </div>
      <div className="sm:w-1/2 relative flex items-center justify-end">
        {options ? (
          <div className="w-full relative">
            <select 
              {...register(name)}
              className="w-full bg-white dark:bg-black/20 text-[14px] font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 transition-colors appearance-none cursor-pointer"
            >
              {options.map((opt: string) => (
                <option key={opt} value={opt} className="text-slate-900 dark:text-slate-900 font-medium">{opt}</option>
              ))}
            </select>
            <ChevronRight className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 pointer-events-none rotate-90" />
          </div>
        ) : (
          <input 
            type={type} 
            step={type === 'number' ? 'any' : undefined}
            {...register(name)}
            className="w-full bg-white dark:bg-black/20 text-[14px] font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 transition-colors placeholder:text-neutral-500 dark:text-neutral-400 dark:placeholder:text-white/30" 
          />
        )}
      </div>
    </div>
  );
}

function ClientStep() {
  const { watch, setValue } = useFormContext<B2BSimulatorFormData>();
  const clientType = watch('clientType');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 pb-8">
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-primary/5 dark:bg-primary/20 backdrop-blur-xl border-b border-primary/10 dark:border-white/10 px-6 py-5">
          <h3 className="text-primary dark:text-white font-display font-bold text-lg sm:text-xl">Informations Client</h3>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center px-6 py-5 border-b border-slate-100 dark:border-white/5">
             <span className="w-1/2 text-sm font-semibold text-slate-700 dark:text-slate-300">Type de client</span>
             <div className="w-1/2 flex items-center gap-3">
               <button type="button" onClick={() => setValue('clientType', 'particulier')} className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all flex-1", clientType === 'particulier' ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-slate-100 text-neutral-600 dark:text-neutral-300 dark:bg-white/10 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10")}>Particulier</button>
               <button type="button" onClick={() => setValue('clientType', 'pro')} className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all flex-1", clientType === 'pro' ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-slate-100 text-neutral-600 dark:text-neutral-300 dark:bg-white/10 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10")}>Professionnel</button>
             </div>
          </div>
          <InputRow label="Nom complet" name="clientName" />
          <InputRow label="Email" name="clientEmail" type="email" />
          <InputRow label="Téléphone" name="clientPhone" type="tel" />
          {clientType === 'pro' && (
            <>
              <InputRow label="Nom de l'entreprise" name="companyName" />
              <InputRow label="Numéro SIRET" name="companySiret" />
            </>
          )}
          <InputRow label={clientType === 'pro' ? "Adresse du siège social" : "Adresse de résidence"} name="clientAddress" />
          <InputRow label="Région ciblée" name="region" />
        </div>
      </div>
    </motion.div>
  );
}

function PropertyStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 pb-8">
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-primary/5 dark:bg-primary/20 backdrop-blur-xl border-b border-primary/10 dark:border-white/10 px-6 py-5">
          <h3 className="text-primary dark:text-white font-display font-bold text-lg sm:text-xl">Caractéristiques du bien</h3>
        </div>
        <div className="flex flex-col">
          <InputRow label="Référence dossier" name="refDossier" />
          <InputRow label="Adresse du bien" name="propertyAddress" />
          <InputRow label="Type de bien" name="typeBien" options={['Appartement', 'Maison', 'Villa', 'Terrain', 'Local', 'Immeuble', 'Autre']} />
          <InputRow label="Ancien ou Neuf" name="ancienOuNeuf" options={['Ancien', 'Neuf', 'VEFA']} />
          <InputRow label="Prix affiché (€)" name="prixAffiche" type="number" />
          <InputRow label="Valeur estimée après travaux (€)" name="valeurApresTravaux" type="number" />
          <InputRow label="Nombre de pièces" name="nbPieces" type="number" />
          <InputRow label="Surface habitable (m²)" name="surfaceHabitable" type="number" />
          <InputRow label="Copropriété" name="copropriete" options={['Oui', 'Non']} />
          <InputRow label="Taxe foncière / an (€)" name="taxeFonciere" type="number" />
          <InputRow label="État général" name="etatGeneral" options={['Excellent', 'Bon', 'Moyen', 'À rénover', 'Dégradé']} />
          <InputRow label="Montant estimé travaux (€)" name="montantTravaux" type="number" />
          <InputRow label="Rendement locatif estimé (%)" name="rendementLocatif" type="number" />
        </div>
      </div>
    </motion.div>
  );
}

function SimulationStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 pb-8">
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="bg-primary/5 dark:bg-primary/20 backdrop-blur-xl border-b border-primary/10 dark:border-white/10 px-6 py-5">
            <h3 className="text-primary dark:text-white font-display font-bold text-lg sm:text-xl">Paramètres Financiers</h3>
          </div>
          <div className="flex flex-col">
            <InputRow label="Prix achat (€)" name="prixAchat" type="number" />
            <InputRow label="Travaux (€)" name="travauxSim" type="number" />
            <InputRow label="Honoraires partenaire % TTC" name="honorairesPct" type="number" />
            <InputRow label="Frais acquisition %" name="fraisAcquisitionPct" type="number" />
            <InputRow label="Frais revente %" name="fraisReventePct" type="number" />
            <InputRow label="Portage / intérêts (€)" name="portageInterets" type="number" />
            <InputRow label="Prix de revente estimé (€)" name="prixReventeEstime" type="number" />
            <InputRow label="Impôt plus-value %" name="impotPlusValuePct" type="number" />
            <InputRow label="Durée de l'opération (mois)" name="dureeMois" type="number" />
          </div>
      </div>
    </motion.div>
  );
}

function SynthesisStep() {
  const { watch } = useFormContext<B2BSimulatorFormData>();
  const data = watch();

  const prixAchat = Number(data.prixAchat) || 0;
  const fraisAcquisition = Math.round((prixAchat * (Number(data.fraisAcquisitionPct) || 0)) / 100);
  const honorairesPartenaire = Math.round((prixAchat * (Number(data.honorairesPct) || 0)) / 100);
  const coutTotalInvesti = prixAchat + (Number(data.travauxSim) || 0) + fraisAcquisition + honorairesPartenaire + (Number(data.portageInterets) || 0);
  
  const prixReventeEstime = Number(data.prixReventeEstime) || 0;
  const fraisRevente = Math.round((prixReventeEstime * (Number(data.fraisReventePct) || 0)) / 100);
  const prixVenteNet = prixReventeEstime - fraisRevente;
  
  const plusValueImposable = Math.max(0, prixVenteNet - coutTotalInvesti);
  const impotPlusValue = Math.round((plusValueImposable * (Number(data.impotPlusValuePct) || 0)) / 100);
  const beneficeNetFinal = plusValueImposable - impotPlusValue;
  
  const rentabiliteNetteInvestissement = coutTotalInvesti > 0 ? (beneficeNetFinal / coutTotalInvesti) : 0;
  const dureeMois = Number(data.dureeMois) || 12;
  const rentabiliteAnnualisee = dureeMois > 0 ? (Math.pow(1 + rentabiliteNetteInvestissement, 12 / dureeMois) - 1) : 0;

  let validation = 'ROUGE - A éviter';
  let validationColor = 'text-red-600 dark:text-red-400';
  let validationBg = 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
  let validationText = 'Opération insuffisamment rentable';
  if (rentabiliteAnnualisee >= 0.20) {
    validation = 'VERT - Idéal';
    validationColor = 'text-green-600 dark:text-green-400';
    validationBg = 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
    validationText = 'Opération très rentable';
  } else if (rentabiliteAnnualisee >= 0.15) {
    validation = 'ORANGE - Risqué';
    validationColor = 'text-orange-600 dark:text-orange-400';
    validationBg = 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20';
    validationText = 'Opération moyennement rentable';
  }

  const formatPct = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 1 }).format(val);
  const formatEur = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 pb-8">
      <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-white/10 gap-4">
           <div>
             <h3 className="text-2xl font-display font-black text-neutral-900 dark:text-white">Synthèse du Projet</h3>
             <p className="text-neutral-600 dark:text-neutral-300 font-medium">Bilan financier prévisionnel</p>
           </div>
           <div className={cn("px-4 py-2 rounded-xl border text-sm font-bold tracking-wide", validationBg, validationColor)}>
              {validation}
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-white/10 rounded-2xl p-6 border border-slate-100 dark:border-white/5">
                 <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider opacity-80">Profil Acquéreur</h4>
                 <div className="space-y-3 font-medium text-[15px]">
                    <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-300">Nom</span> <span className="font-bold text-neutral-900 dark:text-white text-right">{data.clientName}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-300">Type</span> <span className="font-bold text-neutral-900 dark:text-white text-right capitalize">{data.clientType}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-300">Localisation</span> <span className="font-bold text-neutral-900 dark:text-white text-right truncate pl-4">{data.propertyAddress}</span></div>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-slate-900 dark:bg-white/10 rounded-2xl p-6 border border-slate-800 dark:border-white/10 text-white shadow-xl shadow-slate-900/20">
                 <h4 className="text-sm font-bold text-white/70 mb-4 uppercase tracking-wider">Résultats Financiers</h4>
                 <div className="space-y-3 font-medium text-[15px]">
                    <div className="flex justify-between"><span className="text-white/60">Prix vente net</span> <span className="font-bold text-right">{formatEur(prixVenteNet)}</span></div>
                    <div className="flex justify-between"><span className="text-white/60">Coût global investi</span> <span className="font-bold text-right">{formatEur(coutTotalInvesti)}</span></div>
                    <div className="flex justify-between pt-3 border-t border-white/20 mt-3"><span className="text-white">Marge Nette (Bénéfice)</span> <span className="font-bold text-emerald-400 text-lg text-right">{formatEur(beneficeNetFinal)}</span></div>
                 </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/10 rounded-2xl p-6 border border-slate-100 dark:border-white/5 space-y-3">
                    <div className="flex justify-between items-center"><span className="text-sm font-bold text-neutral-600 dark:text-neutral-300">ROI Capital</span> <span className={cn("font-bold text-lg", validationColor)}>{formatPct(rentabiliteNetteInvestissement)}</span></div>
                    <div className="flex justify-between items-center"><span className="text-sm font-bold text-neutral-600 dark:text-neutral-300">Durée (mois)</span> <span className="font-bold text-neutral-900 dark:text-white">{dureeMois}</span></div>
                    <div className="flex justify-between items-center pt-3 border-t"><span className="text-sm font-bold text-neutral-900 dark:text-white">Renta Annualisée</span> <span className={cn("font-black text-xl", validationColor)}>{formatPct(rentabiliteAnnualisee)}</span></div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

export function B2BSimulator() {
  const [currentStep, setCurrentStep] = useState(1);
  const methods = useForm<B2BSimulatorFormData>({
    // @ts-expect-error resolver TS mismatch
    resolver: zodResolver(b2bSimulatorSchema),
    defaultValues: defaultB2BValues,
    mode: 'onTouched',
  });

  const { handleSubmit, reset, trigger } = methods;

  const onNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep(prev => Math.min(4, prev + 1));
    }
  };

  const onSubmit = (data: B2BSimulatorFormData) => {
    alert("Simulation sauvegardée avec succès !");
    console.log("Saved data", data);
  };

  const handleReset = () => {
    if(window.confirm('Voulez-vous vraiment commencer une nouvelle simulation ?')) {
      reset(defaultB2BValues);
      setCurrentStep(1);
    }
  };

  const getFieldsForStep = (step: number): (keyof B2BSimulatorFormData)[] => {
    if (step === 1) return ['clientName', 'clientEmail', 'clientPhone', 'clientAddress'];
    if (step === 2) return ['propertyAddress', 'prixAffiche', 'valeurApresTravaux', 'surfaceHabitable'];
    if (step === 3) return ['prixAchat', 'fraisAcquisitionPct', 'prixReventeEstime'];
    return [];
  };

  return (
    <FormProvider {...methods}>
      {/* @ts-expect-error type mismatch with handleSubmit */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full bg-[#f8fafc] dark:bg-transparent">
        {/* En-tête Nouvelle Simulation */}
        <div className="flex items-center justify-between mb-8 px-2">
            <div>
               <h2 className="text-2xl font-display font-black text-neutral-900 dark:text-white tracking-tight">Simulateur Pro</h2>
               <p className="text-neutral-600 dark:text-neutral-300 text-sm font-medium">Bilan financier B2B & Souscription</p>
            </div>
            <button 
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Nouvelle simulation
            </button>
        </div>

        {/* Frise chronologique (Stepper) */}
        <div className="flex items-center w-full relative mb-10 overflow-x-auto pb-8 pt-4 no-scrollbar">
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-200 dark:bg-white/10 -z-10 -translate-y-1/2 rounded-full"></div>
          
          {[
            { step: 1, label: 'Client', icon: User },
            { step: 2, label: 'Bien', icon: Home },
            { step: 3, label: 'Simulation', icon: Calculator },
            { step: 4, label: 'Synthèse', icon: FileText }
          ].map((item, index) => {
             const isActive = currentStep === item.step;
             const isCompleted = currentStep > item.step;
             const Icon = item.icon;
             return (
               <div key={item.step} className="flex relative items-center flex-1 justify-center group cursor-pointer shrink-0 min-w-[80px]" onClick={() => { if(isCompleted || isActive) setCurrentStep(item.step)}}>
                 <div className="flex flex-col items-center gap-2">
                   <div className={cn(
                     "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md",
                     isActive ? "bg-primary text-white scale-110 shadow-primary/30" : 
                     isCompleted ? "bg-emerald-500 text-white" : 
                     "bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400"
                   )}>
                     {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                   </div>
                   <span className={cn(
                     "text-[10px] sm:text-[11px] font-bold absolute -bottom-6 whitespace-nowrap transition-colors uppercase tracking-widest",
                     isActive ? "text-primary dark:text-white" : 
                     isCompleted ? "text-slate-700 dark:text-white/80" : 
                     "text-neutral-500 dark:text-neutral-400"
                   )}>
                     {item.label}
                   </span>
                 </div>
               </div>
             );
          })}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <ClientStep key="1" />}
            {currentStep === 2 && <PropertyStep key="2" />}
            {currentStep === 3 && <SimulationStep key="3" />}
            {currentStep === 4 && <SynthesisStep key="4" />}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-4 mt-2">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm text-sm",
              currentStep === 1 
                ? "opacity-0 pointer-events-none" 
                : "bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10"
            )}
          >
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] transition-all text-sm"
            >
              Étape suivante <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
             <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:scale-[1.02] transition-all text-sm">
               <CheckCircle2 className="w-4 h-4" /> Terminer le dossier
             </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
