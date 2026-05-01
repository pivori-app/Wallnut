import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Share2, HardDrive, FileCheck, MapPin, Calculator, Send, CheckCircle2, ChevronLeft, Loader2, FileText, Download, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { calculateRealTimeEstimation } from '../lib/estimationEngine';
import { exportToInstitutionalPDF } from '../lib/pdfExporter';

export function PropertySynthesisStep({ propertyData, documents, onComplete, onBack }: any) {
  const [isEstimating, setIsEstimating] = useState(true);
  const [estimation, setEstimation] = useState<any>(null);
  const [bundleId, setBundleId] = useState<string>('');
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTarget, setShareTarget] = useState<'notaire' | 'agent' | null>(null);
  const [isSendingShare, setIsSendingShare] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // 1. ENGINE D'ESTIMATION PONDÉRÉE (DATA SCIENCE)
  useEffect(() => {
    const runEstimation = async () => {
      // Simulate API call to DVF / Yanport / Castorus
      await new Promise(r => setTimeout(r, 2000));

      const surface = parseFloat(propertyData?.surface || '0');
      
      const res = calculateRealTimeEstimation({
        surface,
        zipCode: propertyData?.addressData?.zipCode || '',
        condition: propertyData?.condition || 'Bon état',
        features: propertyData?.features || [],
        dpe: propertyData?.dpe || 'C',
        propertyType: propertyData?.type || 'Appartement'
      });

      if (res) {
        setEstimation(res);
      }

      // Generate a unique Bundle ID (Système d'Agrafe)
      setBundleId(`BNDL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
      setIsEstimating(false);
    };

    runEstimation();
  }, [propertyData]);

  const handleExportPDF = async () => {
    if (!estimation) return;
    setIsGeneratingPDF(true);
    await exportToInstitutionalPDF('synthesis-content', {
      bundleId,
      propertyType: propertyData?.type || 'Bien',
      city: propertyData?.city || 'Inconnue',
      finalPrice: formatEuro(estimation.finalPrice),
      confidence: estimation.confidenceIndex
    });
    setIsGeneratingPDF(false);
  };

  // Calculate Completeness Score
  const uploadedDocsCount = Object.keys(documents).filter(k => documents[k]?.length > 0).length;
  const totalDocsCount = Math.max(4, Object.keys(documents).length);
  const completenessScore = Math.round((uploadedDocsCount / totalDocsCount) * 100);

  // 2. DÉPLOIEMENT DRIVE
  const handleDeployToDrive = async () => {
    setIsDeploying(true);
    // Simulate Drive API Integration
    await new Promise(r => setTimeout(r, 2500));
    setIsDeploying(false);
    setDeploySuccess(true);
  };

  // 3. LOGIQUE 'AGRAPHE' ET SMART SHARE
  const handleSmartShare = async () => {
    if (!shareTarget) return;
    setIsSendingShare(true);
    // Simulate Gmail API Smart Share
    await new Promise(r => setTimeout(r, 2000));
    setIsSendingShare(false);
    setShareSuccess(true);
    setTimeout(() => {
      setShareSuccess(false);
      setShowShareModal(false);
    }, 2000);
  };

  const formatEuro = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8">
      {/* Dashboard Synthèse */}
      <div id="synthesis-content" className="glass p-8 md:p-10 rounded-[2.5rem] border border-black/5 relative overflow-hidden">
        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h2 className="text-3xl font-display font-bold text-primary mb-2">Synthèse du Dossier</h2>
            <div className="flex items-center gap-2 text-neutral-dark/60">
              <MapPin size={16} />
              <span>{propertyData?.address || "Adresse non spécifiée"}</span>
            </div>
            <div className="inline-flex mt-4 items-center gap-2 px-3 py-1 bg-black/5 rounded-lg text-sm font-bold opacity-70">
              ID Agrafe : {bundleId || 'Génération...'}
            </div>
          </div>

          <div className="flex items-center gap-4 text-center">
             <div className="p-4 bg-white/60 rounded-2xl border border-black/5 shadow-sm">
                <div className="text-sm font-bold opacity-60 mb-1">Documents</div>
                <div className="text-2xl font-bold text-primary">{uploadedDocsCount}/{totalDocsCount}</div>
             </div>
             <div className="p-4 bg-white/60 rounded-2xl border border-primary/20 shadow-sm relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/10">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${completenessScore}%` }} />
                </div>
                <div className="text-sm font-bold opacity-60 mb-1">Complétude</div>
                <div className="text-2xl font-bold text-primary">{completenessScore}%</div>
             </div>
          </div>
        </div>

        {/* Estimation Section */}
        <div className="mt-10 pt-10 border-t border-black/5">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="text-primary" />
            <h3 className="font-bold text-xl text-primary">Estimation Pondérée (Data Science)</h3>
          </div>

          {isEstimating ? (
            <div className="p-10 flex flex-col items-center justify-center text-primary/60">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="font-medium animate-pulse">Analyse DVF & Yanport en cours...</p>
            </div>
          ) : estimation ? (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/40 rounded-2xl border border-black/5 flex flex-col items-center justify-center text-center">
                  <div className="text-sm font-bold opacity-60 mb-2">Fourchette Basse</div>
                  <div className="text-2xl font-bold text-primary/80">{formatEuro(estimation.lowBound)}</div>
                </div>
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 flex flex-col items-center justify-center text-center relative shadow-lg transform md:-translate-y-4">
                  <div className="absolute -top-3 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">VALEUR AFFINÉE</div>
                  <div className="text-sm font-bold text-primary/60 mb-2 mt-2">Prix Estimé</div>
                  <div className="text-4xl font-display font-bold text-primary">{formatEuro(estimation.finalPrice)}</div>
                  <div className="text-sm font-medium mt-2 opacity-70">~{formatEuro(estimation.pricePerSqm)}/m²</div>
                </div>
                <div className="p-6 bg-white/40 rounded-2xl border border-black/5 flex flex-col items-center justify-center text-center">
                  <div className="text-sm font-bold opacity-60 mb-2">Fourchette Haute</div>
                  <div className="text-2xl font-bold text-primary/80">{formatEuro(estimation.highBound)}</div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 p-3 bg-white/60 rounded-xl border border-black/5 w-fit">
                   <Activity className="text-primary" size={16} />
                   <span className="text-xs font-bold opacity-60 uppercase tracking-wider">Fiabilité de l'estimation</span>
                   <div className="w-32 h-2 bg-black/10 rounded-full overflow-hidden ml-2">
                      <div className={cn("h-full", estimation.confidenceIndex > 80 ? "bg-green-500" : "bg-orange-500")} style={{ width: `${estimation.confidenceIndex}%` }} />
                   </div>
                   <span className="text-sm font-bold text-primary ml-1">{estimation.confidenceIndex}%</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 text-sm mt-2">
                  <span className="opacity-60 mr-2">Ajustements calculés :</span>
                  {Object.entries(estimation.multipliersApplied).map(([name, val]: [string, any]) => (
                    <span key={name} className={cn("font-bold px-2 py-0.5 rounded-md text-xs", 
                      (val as number) > 0 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {name} {(val as number) > 0 ? '+' : ''}{Math.round((val as number) * 100)}%
                    </span>
                  ))}
                  {Object.keys(estimation.multipliersApplied).length === 0 && (
                     <span className="opacity-40 italic text-xs">Aucun ajustement</span>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Actions (Drive & Share) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Déploiement Drive */}
        <div className="glass p-8 rounded-3xl border border-black/5 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl mb-4 shadow-inner">
            <HardDrive size={32} />
          </div>
          <h3 className="font-bold text-lg mb-2">Synchronisation Drive</h3>
          <p className="text-sm opacity-70 mb-6 max-w-sm">
            Générer l'arborescence (Civil, Technique, Juridique, Fiscal) et uploader le Bundle.
          </p>
          <button 
            onClick={handleDeployToDrive}
            disabled={isDeploying || deploySuccess}
            className={cn(
              "px-6 py-3 w-full max-w-xs rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md",
              deploySuccess ? "bg-green-500 text-white" : "bg-white border border-black/10 hover:border-blue-500 hover:text-blue-600"
            )}
          >
            {isDeploying ? <><Loader2 className="animate-spin" size={18} /> Déploiement...</> :
             deploySuccess ? <><CheckCircle2 size={18} /> Déployé avec succès</> :
             <><HardDrive size={18} /> Déployer le dossier</>}
          </button>
        </div>

        {/* Smart Share */}
        <div className="glass p-8 rounded-3xl border border-black/5 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 flex items-center justify-center rounded-2xl mb-4 shadow-inner">
            <Share2 size={32} />
          </div>
          <h3 className="font-bold text-lg mb-2">Partage Intelligent (Agrafe)</h3>
          <p className="text-sm opacity-70 mb-6 max-w-sm">
            Générer un envoi mail ciblé avec des pièces jointes adaptées au destinataire.
          </p>
          <button 
            onClick={() => setShowShareModal(true)}
            className="px-6 py-3 w-full max-w-xs rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md bg-primary text-white hover:-translate-y-1 hover:shadow-lg"
          >
            <Send size={18} /> Composer l'envoi
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-black/5">
        <button 
          onClick={onBack}
          className="px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-white/60 text-primary border border-black/5 hover:border-black/10"
        >
          <ChevronLeft size={20} /> Retour aux documents
        </button>
        <button 
          onClick={onComplete}
          className="px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-black text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Valider et Quitter <CheckCircle2 size={20} />
        </button>
      </div>

      {/* Smart Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative">
            <div className="absolute top-4 right-4">
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 flex items-center justify-center bg-black/5 rounded-full hover:bg-black/10 transition-colors">&times;</button>
            </div>
            
            <h3 className="text-2xl font-display font-bold mb-2">Composition Smart Share</h3>
            <p className="text-sm opacity-60 mb-6">Sélectionnez le destinataire pour adapter automatiquement le contenu du bundle (ID: {bundleId}).</p>

            <div className="space-y-4 mb-8">
              <button 
                onClick={() => setShareTarget('notaire')}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 flex items-start gap-4 transition-all text-left",
                  shareTarget === 'notaire' ? "border-primary bg-primary/5" : "border-black/5 hover:border-primary/30"
                )}
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 mt-1">
                  <FileCheck className="text-primary" size={20} />
                </div>
                <div>
                  <div className="font-bold">Notaire (Bundle Légal complet)</div>
                  <div className="text-xs opacity-70 mt-1">Inclut : Juridique, Technique, Fiscal, Titre de propriété, CNI.</div>
                </div>
              </button>

              <button 
                onClick={() => setShareTarget('agent')}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 flex items-start gap-4 transition-all text-left",
                  shareTarget === 'agent' ? "border-primary bg-primary/5" : "border-black/5 hover:border-primary/30"
                )}
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 mt-1">
                  <Share2 className="text-primary" size={20} />
                </div>
                <div>
                  <div className="font-bold">Agent Immobilier (Bundle Commercial)</div>
                  <div className="text-xs opacity-70 mt-1">Inclut : DPE, Photos, Descriptif, Taxe Foncière (masquée partialement).</div>
                </div>
              </button>
            </div>

            <button
              onClick={handleSmartShare}
              disabled={!shareTarget || isSendingShare || shareSuccess}
              className={cn(
                "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
                shareSuccess ? "bg-green-500 text-white" :
                !shareTarget ? "bg-neutral-200 text-neutral-400" :
                "bg-primary text-white hover:scale-105 shadow-xl"
              )}
            >
              {isSendingShare ? <Loader2 className="animate-spin" /> : 
               shareSuccess ? <><CheckCircle2 /> Bundle envoyé</> :
               <><Send size={18} /> Envoyer via Gmail</>}
            </button>
            
            <div className="mt-4 text-center">
               <button 
                 onClick={handleExportPDF}
                 disabled={isGeneratingPDF}
                 className="text-sm font-bold text-primary flex items-center justify-center gap-2 mx-auto hover:underline opacity-80"
               >
                  {isGeneratingPDF ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  Exporter PDF Institutionnel (Synthèse)
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
