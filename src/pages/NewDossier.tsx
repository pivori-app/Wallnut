import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Euro, 
  FileUp, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Upload, 
  Loader2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, cn } from '../lib/utils';
import { analyzeRealEstateDocument } from '../services/geminiService';

export function NewDossier() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  
  const initialData = location.state || { propertyValue: 300000, fundingNeed: 150000, offerId: 'equilibre' };

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    propertyValue: initialData.propertyValue,
    fundingNeed: initialData.fundingNeed,
    offerType: initialData.offerId,
    address: '',
    surface: '',
    documents: [] as { file: File, type: string, analysis?: any, status: 'pending' | 'analyzing' | 'done' | 'error' }[]
  });

  const handleCreateDossier = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const dossierId = `WN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const { error } = await supabase.from('dossiers').insert([{
        id: dossierId,
        client_id: user.id,
        pro_id: profile?.isPro ? user.id : null,
        is_pro_created: profile?.isPro || false,
        status: 'submitted',
        offer_type: form.offerType,
        property_value: form.propertyValue,
        funding_needed: form.fundingNeed,
        address: form.address,
        surface: Number(form.surface),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);
      
      if (error) throw error;

      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création du dossier.");
    } finally {
      setLoading(false);
    }
  };


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newDocs: { file: File, type: string, status: 'analyzing' }[] = Array.from(files).map((file: File) => ({
      file,
      type: 'pending',
      status: 'analyzing'
    }));

    setForm(prev => ({ ...prev, documents: [...prev.documents, ...newDocs] }));

    // Analyze each file with Gemini
    for (const doc of newDocs) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(doc.file);
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const analysisStr = await analyzeRealEstateDocument(base64, doc.file.type);
          
          try {
            const analysis = JSON.parse(analysisStr.replace(/```json|```/g, ''));
            setForm(prev => ({
              ...prev,
              documents: prev.documents.map(d => 
                d.file === doc.file ? { ...d, status: 'done', type: analysis.typeDocument, analysis } : d
              )
            }));
          } catch (e) {
             setForm(prev => ({
              ...prev,
              documents: prev.documents.map(d => 
                d.file === doc.file ? { ...d, status: 'done', type: 'Détecté autom.' } : d
              )
            }));
          }
        };
      } catch (err) {
        setForm(prev => ({
          ...prev,
          documents: prev.documents.map(d => 
            d.file === doc.file ? { ...d, status: 'error' } : d
          )
        }));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-bold">Nouveau Dossier de Portage</h1>
        <div className="flex justify-center items-center gap-4">
          {[1, 2, 3].map(i => (
            <React.Fragment key={i}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                step >= i ? "bg-primary text-white" : "bg-black/5 dark:bg-white/5 opacity-40"
              )}>
                {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
              </div>
              {i < 3 && <div className={cn("w-12 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden")}>
                <div className={cn("h-full bg-primary transition-all duration-500", step > i ? "w-full" : "w-0")}></div>
              </div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="glass p-8 lg:p-12 rounded-3xl min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold opacity-60 uppercase tracking-wider">Valeur & Besoin</label>
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Valeur du bien</span>
                      <span className="font-bold">{formatCurrency(form.propertyValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Besoin</span>
                      <span className="font-bold text-primary">{formatCurrency(form.fundingNeed)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold opacity-60 uppercase tracking-wider">Offre Sélectionnée</label>
                  <div className="p-4 rounded-2xl bg-secondary/10 border-2 border-secondary text-primary">
                    <p className="text-xs font-bold uppercase mb-1">{form.offerType}</p>
                    <p className="text-sm">Portage à {form.offerType === 'premium' ? '80%' : form.offerType === 'equilibre' ? '70%' : '60%'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold opacity-60 uppercase tracking-wider">Informations du Bien</label>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Adresse complète</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 opacity-40" />
                      <input 
                        type="text" 
                        value={form.address}
                        onChange={e => setForm({...form, address: e.target.value})}
                        placeholder="Ex: 24 Rue de Rivoli, Paris"
                        className="w-full pl-12 pr-4 py-4 bg-black/5 dark:bg-white/5 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Surface (m²)</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-4 w-5 h-5 opacity-40" />
                      <input 
                        type="number" 
                        value={form.surface}
                        onChange={e => setForm({...form, surface: e.target.value})}
                        placeholder="Ex: 85"
                        className="w-full pl-12 pr-4 py-4 bg-black/5 dark:bg-white/5 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 transition-all">
                <button 
                  disabled={!form.address || !form.surface}
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-2xl bg-primary text-white font-display font-bold hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                >
                  Suivant : Documents <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                 <h3 className="text-2xl font-display font-bold">Analyse Documentaire IA</h3>
                 <p className="text-neutral-dark/60">Uploadez vos pièces. Notre IA les vérifie instantanément (OCR V4.1).</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <label className="group relative border-2 border-dashed border-black/10 dark:border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                  <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold">Déposer vos fichiers</p>
                    <p className="text-xs opacity-40 mt-1">PDF, PNG, JPG jusqu'à 10MB</p>
                  </div>
                </label>

                <div className="space-y-4">
                   <h4 className="text-sm font-bold opacity-60 uppercase">Documents détectés</h4>
                   <div className="space-y-3">
                     {form.documents.length === 0 && (
                       <div className="p-10 rounded-2xl bg-black/5 dark:bg-white/5 text-center italic text-sm opacity-40">
                         Aucun document pour le moment.
                       </div>
                     )}
                     {form.documents.map((doc, idx) => (
                       <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-black/5 shadow-sm">
                         <div className="p-2 bg-primary/10 rounded-lg">
                           <FileUp className="w-5 h-5 text-primary" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold truncate">{doc.file.name}</p>
                           <p className="text-[10px] text-primary/60 font-bold uppercase">{doc.type}</p>
                         </div>
                         {doc.status === 'analyzing' ? (
                           <Loader2 className="w-5 h-5 animate-spin text-primary" />
                         ) : doc.status === 'done' ? (
                           <CheckCircle2 className="w-5 h-5 text-success" />
                         ) : (
                           <AlertCircle className="w-5 h-5 text-danger" />
                         )}
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              <div className="flex gap-4 pt-10">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-2xl bg-black/5 dark:bg-white/5 font-display font-bold hover:bg-black/10 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" /> Précédent
                </button>
                <button 
                  disabled={form.documents.length === 0}
                  onClick={() => setStep(3)}
                  className="flex-[2] py-4 rounded-2xl bg-primary text-white font-display font-bold hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  Finaliser le dossier <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 text-center"
            >
              <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-12 h-12" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-3xl font-display font-bold">Prêt pour soumission</h3>
                <p className="text-neutral-dark/60 max-w-lg mx-auto">
                  Votre dossier est complet. En cliquant sur soumettre, un juriste Wallnut 
                  analysera votre demande sous 24h ouvrées.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-primary/5 text-left space-y-4">
                <h4 className="font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Récapitulatif</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                     <p className="opacity-60 text-[10px] uppercase font-bold">Bien</p>
                     <p className="font-medium truncate">{form.address}</p>
                   </div>
                   <div>
                     <p className="opacity-60 text-[10px] uppercase font-bold">Ratio Portage</p>
                     <p className="font-medium">{form.offerType === 'premium' ? '80%' : form.offerType === 'equilibre' ? '70%' : '60%'}</p>
                   </div>
                   <div>
                     <p className="opacity-60 text-[10px] uppercase font-bold">Besoin Net</p>
                     <p className="font-medium">{formatCurrency(form.fundingNeed)}</p>
                   </div>
                   <div>
                     <p className="opacity-60 text-[10px] uppercase font-bold">Documents</p>
                     <p className="font-medium">{form.documents.length} pièces jointes</p>
                   </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 rounded-2xl bg-black/5 dark:bg-white/5 font-display font-bold hover:bg-black/10 transition-all"
                >
                  Modifier
                </button>
                <button 
                  onClick={handleCreateDossier}
                  disabled={loading}
                  className="flex-[2] py-4 rounded-2xl bg-primary text-white font-display font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Soumettre le dossier"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
