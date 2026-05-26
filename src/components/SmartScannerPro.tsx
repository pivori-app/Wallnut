import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, FileText, Plus, Check, X, Smartphone, AlertTriangle, Loader2, UploadCloud, RefreshCw, Layers, Zap, ZapOff, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCamera } from '../hooks/useCamera';

// Types and Mocks
type DocType = 'Identité (CNI/Passeport)' | 'Justificatif de domicile (Facture)' | 'Avis d’impôt' | 'Kbis';

interface AiAnalysisResult {
  docType: string;
  readability: string;
  names: string[];
  address: string;
  amount?: string;
  isMatchingProfile: boolean;
}

interface ScannedPage {
  id: string;
  url: string; // Blob URL in real life
  aiData?: AiAnalysisResult;
}

interface SmartScannerProProps {
  expectedDocType: DocType;
  onComplete: (files: File[]) => void; // Final PDF(s)
  onCancel: () => void;
}

export function SmartScannerPro({ expectedDocType, onComplete, onCancel }: SmartScannerProProps) {
  const [isStable, setIsStable] = useState(false);
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'checking' | 'rejected' | 'accepted'>('idle');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [scanReview, setScanReview] = useState<{url: string, aiData: AiAnalysisResult} | null>(null);
  
  // Nouveaux états de simulation Pro SDK
  const [guidanceMsg, setGuidanceMsg] = useState("Recherche de document...");
  const [perspectiveStyle, setPerspectiveStyle] = useState({ transform: 'perspective(500px) rotateX(15deg) rotateY(-10deg) scale(0.9)' });
  const [autoCaptureProgress, setAutoCaptureProgress] = useState(0);

  const { videoRef, canvasRef, state: cameraState, startCamera, stopCamera, captureFrame, hasFlash, flashOn, toggleFlash } = useCamera();

  // Start/Stop camera on mount/unmount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // 1. STABILISATEUR PRO (Scanbot/ML Simulation)
  useEffect(() => {
    let step = 0;
    const steps = [
      { msg: "Recherche de document...", transform: 'perspective(500px) rotateX(15deg) rotateY(-10deg) scale(0.9)', stable: false },
      { msg: "Détection des contours...", transform: 'perspective(500px) rotateX(8deg) rotateY(5deg) scale(0.95)', stable: false },
      { msg: "Correction de perspective...", transform: 'perspective(500px) rotateX(2deg) rotateY(-2deg) scale(0.98)', stable: false },
      { msg: "Analyse luminosité (ISO)...", transform: 'perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)', stable: false },
      { msg: "Prêt (Maintenez fermement)", transform: 'perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)', stable: true }
    ];

    setIsStable(false);
    setAutoCaptureProgress(0);
    
    // Si on a déjà scanné une page, on raccourcit le cycle
    if (pages.length > 0) {
      step = 3;
    }

    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setGuidanceMsg(steps[step].msg);
        setPerspectiveStyle({ transform: steps[step].transform });
        setIsStable(steps[step].stable);
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [pages.length]);

  // Auto-capture visuelle
  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    if (isStable && validationStatus === 'idle' && !isCapturing) {
      progressTimer = setInterval(() => {
        setAutoCaptureProgress(prev => {
          if (prev >= 100) {
             clearInterval(progressTimer);
             captureAndValidate();
             return 100;
          }
          return prev + 4;
        });
      }, 50);
    } else {
      setAutoCaptureProgress(0);
    }
    return () => clearInterval(progressTimer);
  }, [isStable, validationStatus, isCapturing]);

  // 2. IA PIPELINE 1 & PIPELINE 2 (Qualité et Pertinence)
  const captureAndValidate = async () => {
    if (!isStable) return;
    setIsCapturing(true);

    // Simulate capturing a frame from videoRef
    let imageFrame = null;
    if (cameraState === 'active') {
      imageFrame = captureFrame(); // Getting real frame
    }
    await new Promise(r => setTimeout(r, 500)); 

    setIsCapturing(false);
    setValidationStatus('checking');

    try {
      // ---------------------------------------------------------
      // PIPELINE 1 : QUALITÉ (Blur & Éclairage) - PSEUDO CODE
      // ---------------------------------------------------------
      /*
      const imageFrame = captureFrame(videoRef.current);
      const isBlurry = await detectBlur(imageFrame);
      if (isBlurry) throw new Error("blur_detected");
      
      const lighting = await detectLighting(imageFrame);
      if (lighting < MIN_LUX) throw new Error("too_dark");
      */

      // Simulate network / AI processing time
      await new Promise(r => setTimeout(r, 1500));

      // ---------------------------------------------------------
      // PIPELINE 2 : VALIDATION MÉTIER (Gemini Vision) - PSEUDO CODE
      // ---------------------------------------------------------
      /*
      const aiResponse = await geminiVisionAPI.analyze({
        image: imageFrame,
        prompt: `Identifie le type de ce document parmi la liste: [CNI, Facture EDF, Avis d'impôt, Kbis]. Retourne aussi un score de confiance.`
      });
      
      const detectedType = aiResponse.detectedType;
      const confidence = aiResponse.confidence; // e.g., 95
      */

      /* 
      // Simulation de rejet ou d'acceptation de l'IA (Désactivée pour une utilisation fluide)
      const randomOutcome = Math.random();
      
      if (randomOutcome < 0.3) {
        // Simulation d'une erreur d'éclairage ou de flou
        throw new Error(Math.random() > 0.5 ? "blur_detected" : "too_dark");
      } else if (randomOutcome > 0.8) {
        // Simulation Mauvais document (ex: impôt au lieu de facture)
        throw new Error("wrong_document_type");
      }
      */

      // Mock AI Data extraction
      let amount = undefined;
      if (expectedDocType.includes('impôt')) amount = '4 320,00 €';
      else if (expectedDocType.includes('Facture')) amount = '124,50 €';

      const extractedAiData: AiAnalysisResult = {
        docType: expectedDocType,
        readability: 'Excellente (100% net, 0% flou)',
        names: ['JEAN DUPONT', 'MARIE DUPONT'],
        address: '12 RUE DE LA PAIX, 75000 PARIS',
        amount: amount,
        isMatchingProfile: true
      };

      setScanReview({
        url: imageFrame || 'https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80&w=200&h=300',
        aiData: extractedAiData
      });
      setValidationStatus('accepted');

    } catch (error: any) {
      setValidationStatus('rejected');
      if (error.message === 'blur_detected') {
        setAlertMessage("Photo floue, veuillez stabiliser et reprendre.");
      } else if (error.message === 'too_dark') {
         setAlertMessage("Éclairage insuffisant. Activez le flash ou déplacez-vous.");
      } else if (error.message === 'wrong_document_type') {
         setAlertMessage(`Ce document semble être un mauvais type. Veuillez fournir : ${expectedDocType}.`);
      } else {
         setAlertMessage("Une erreur est survenue lors de l'analyse.");
      }
    }
  };

  const confirmScanReview = () => {
    if (!scanReview) return;
    setPages(prev => [...prev, { id: Math.random().toString(), url: scanReview.url, aiData: scanReview.aiData }]);
    setScanReview(null);
    setValidationStatus('idle');
  };

  const cancelScanReview = () => {
    setScanReview(null);
    setValidationStatus('idle');
  };

  const handleFinalize = async () => {
    if (pages.length === 0) return;
    
    // ---------------------------------------------------------
    // TRAITEMENT POST-CAPTURE & EXPORT INSTITUTIONNEL
    // ---------------------------------------------------------
    /*
      // 1. Perspective Warp & Filtres (Noir & Blanc, Contrast)
      const enhancedPages = await processImages(pages);

      // 2. Compilation PDF Optimisée
      const finalPdfBlob = await createPDF(enhancedPages);

      // 3. Synchro Google Drive ("Agrafé" folder)
      await driveService.upload({
        file: finalPdfBlob,
        folder: "Dossier Client / Agrafé",
        metadata: { type: expectedDocType }
      });
    */
    
    // Simulated Export
    onComplete(pages as any);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black md:bg-black/80 md:backdrop-blur-xl p-0 md:p-4">
      <div className="relative w-full h-[100dvh] md:max-w-[450px] md:h-[85vh] bg-black md:bg-[#111] md:rounded-3xl overflow-hidden md:shadow-2xl flex flex-col md:border border-white/10">
        
        {/* Header */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <button onClick={onCancel} className="p-2 text-white/70 hover:text-white rounded-full bg-black/40 backdrop-blur-xl transition-colors">
            <X size={20} />
          </button>
          <div className="px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-white/90 text-app-sm font-medium flex items-center gap-2 shadow-lg shadow-black/20">
            <ScanAlertIcon /> {expectedDocType}
          </div>
          <div className="flex gap-2">
            {hasFlash && (
               <button onClick={toggleFlash} className={cn("p-2 rounded-full backdrop-blur-xl transition-colors", flashOn ? "bg-white text-black" : "bg-black/40 text-white/70 hover:text-white")}>
                 {flashOn ? <Zap size={20} /> : <ZapOff size={20} />}
               </button>
            )}
            <div className="w-2" />
          </div>
        </div>

        {/* Viewfinder & Edge Detection Overlay */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {/* Real Camera Feed */}
          <video 
            ref={videoRef} 
            className="absolute inset-0 w-full h-full object-cover" 
            playsInline 
            muted 
            autoPlay 
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {cameraState === 'requesting' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
              <div className="text-center">
                <Loader2 className="animate-spin text-white mb-2 mx-auto" size={32} />
                <p className="text-white/60 text-sm">Initialisation de la caméra...</p>
              </div>
            </div>
          )}

          {cameraState === 'error' && (
             <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10 p-6 text-center">
               <div>
                  <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                  <h3 className="text-white font-bold mb-2">Impossible d'accéder à la caméra</h3>
                  <p className="text-white/50 text-sm max-w-sm mx-auto mb-6">
                    Pour scanner avec votre mobile, vous devez ouvrir l'application dans un nouvel onglet (Safari/Chrome) et autoriser l'accès à la caméra.
                  </p>
                  <button onClick={startCamera} className="px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition text-sm">
                    Réessayer
                  </button>
               </div>
             </div>
          )}
          
          <div className="absolute inset-8 border-2 border-dashed border-white/40 rounded-xl pointer-events-none transition-all duration-500 ease-out flex items-center justify-center p-2" 
               style={{ 
                 ...perspectiveStyle,
                 borderColor: validationStatus === 'checking' ? 'rgba(59, 130, 246, 0.6)' : 
                              isStable ? 'rgba(34, 197, 94, 0.8)' : 'rgba(255, 255, 255, 0.4)'
               }}
          >
            {/* Auto Capture Progress overlay inside the bounding box */}
            {isStable && autoCaptureProgress > 0 && autoCaptureProgress < 100 && validationStatus === 'idle' && (
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full border-4 border-white/20 flex items-center justify-center">
                 {/* Simulate radial progress using conic-gradient if possible or just text */}
                 <span className="text-white text-xs font-bold">{Math.round((100 - autoCaptureProgress)/20)}s</span>
                 {/* Circular ring fill approximation */}
                 <div className="absolute inset-[-4px] rounded-full border-4 border-green-500 transition-all duration-75" style={{ clipPath: `polygon(50% 50%, 50% 0%, ${autoCaptureProgress}% 0%, ${autoCaptureProgress}% 100%, 0% 100%, 0% 0%, 50% 0%)`, opacity: 0.8 }} />
              </div>
            )}

            {/* Corner Indicators */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white/80 rounded-tl-xl transition-colors duration-300" style={{ borderColor: isStable ? '#22c55e' : '#ffffff80' }}/>
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white/80 rounded-tr-xl transition-colors duration-300" style={{ borderColor: isStable ? '#22c55e' : '#ffffff80' }}/>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white/80 rounded-bl-xl transition-colors duration-300" style={{ borderColor: isStable ? '#22c55e' : '#ffffff80' }}/>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white/80 rounded-br-xl transition-colors duration-300" style={{ borderColor: isStable ? '#22c55e' : '#ffffff80' }}/>
          </div>

          {/* Stabilizer Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {!isStable && validationStatus === 'idle' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center mb-3">
                    <div className="w-12 h-12 rounded-full border-2 border-white/50 border-t-blue-400 animate-spin" />
                 </div>
                 <span className="text-white/90 text-sm font-bold tracking-wide bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-xl shadow-lg shadow-black/50 border border-white/10">{guidanceMsg}</span>
              </motion.div>
            )}
            {isStable && validationStatus === 'idle' && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-3">
                    <Check className="text-green-500" size={32} />
                 </div>
                 <span className="text-green-400 text-sm font-bold tracking-wide bg-green-950/80 px-4 py-1.5 rounded-full backdrop-blur-xl shadow-lg border border-green-500/30">Capture automatique prête</span>
              </motion.div>
            )}
            {validationStatus === 'checking' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                 <Loader2 className="animate-spin text-blue-400 mb-3" size={40} />
                 <span className="text-blue-200 text-sm font-bold tracking-wide bg-blue-900/60 px-4 py-1.5 rounded-full backdrop-blur-xl border border-blue-500/30">Analyse du document...</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* AI Rejection Alert Overlay (Glassmorphism) */}
        <AnimatePresence>
          {validationStatus === 'rejected' && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute inset-x-6 bottom-32 z-30"
            >
              <div className="relative overflow-hidden bg-[#1A0A0A]/40 backdrop-blur-3xl border border-red-500/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(239,68,68,0.2)]">
                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/10 blur-3xl rounded-full" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center text-red-400 mb-4 border border-red-500/30 shadow-inner">
                    <AlertTriangle size={28} />
                  </div>
                  
                  <h4 className="text-white font-display font-bold text-app-md mb-2 tracking-tight">Erreur de Document</h4>
                  
                  <p className="text-white/70 text-app-sm leading-relaxed mb-6 max-w-sm">
                    {alertMessage}
                  </p>
                  
                  <button 
                    onClick={() => { setValidationStatus('idle'); setAlertMessage(null); }}
                    className="w-full py-3.5 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2 group"
                  >
                    <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    Reprendre la photo
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Scan Review Overlay */}
        <AnimatePresence>
          {validationStatus === 'accepted' && scanReview && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4"
            >
              <div className="w-full max-w-sm bg-[#0F172A] border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                <div className="h-32 overflow-hidden relative border-b border-blue-500/20">
                  <img src={scanReview.url} alt="Scan preview" className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent via-[#0F172A]/80" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                       <FileText className="text-blue-400" size={20} />
                     </div>
                     <div>
                       <h3 className="text-white font-bold text-lg leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Audit IA Expert</h3>
                       <p className="text-blue-300/60 text-xs font-medium uppercase tracking-widest">Contrôle de conformité</p>
                     </div>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col gap-3 overflow-y-auto custom-scrollbar max-h-[60vh]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5 text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Nature Reconnue</span>
                    <span className="text-white font-semibold text-right max-w-[60%] truncate">{scanReview.aiData.docType}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/5 text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Intégrité & Netteté</span>
                    <span className="text-green-400 font-semibold">{scanReview.aiData.readability}</span>
                  </div>
                  {scanReview.aiData.amount && (
                    <div className="flex items-center justify-between pb-2 border-b border-white/5 text-sm">
                      <span className="text-neutral-500 dark:text-neutral-400">Montant Certifié</span>
                      <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">{scanReview.aiData.amount}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5 pb-3 border-b border-white/5 text-sm mt-1">
                    <span className="text-neutral-500 dark:text-neutral-400 mb-1">Entité / Titulaires et Adresse Postale</span>
                    <span className="text-white font-medium bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">{scanReview.aiData.names.join(' • ')}</span>
                    <span className="text-white/60 text-xs bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">{scanReview.aiData.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-2.5 rounded-xl border border-green-500/20 shadow-inner mt-1">
                    <ShieldCheck size={16} className="shrink-0 mt-0.5" /> 
                    <span className="leading-tight">Cohérence d'identité validée : Les données correspondent exactement au profil du dossier encours.</span>
                  </div>

                  <div className="flex gap-3 mt-4">
                     <button onClick={cancelScanReview} className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors border border-white/10">Rejeter</button>
                     <button onClick={confirmScanReview} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-500/50">Certifier & Joindre</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Controls */}
        <div className="relative z-20 bg-black/90 pb-8 pt-4 px-6 border-t border-white/10 shrink-0">
          
          <div className="flex items-center gap-2 text-white/60 mb-2 justify-center">
            <UploadCloud size={14} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Drive Client • Classification activée</span>
          </div>

          {/* Thumbnails of scanned pages */}
          <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 custom-scrollbar">
            {pages.map((p, i) => (
              <div key={p.id} className="relative w-16 h-20 rounded-lg bg-neutral-800 border border-white/20 shrink-0 overflow-hidden shadow-lg">
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 rounded font-bold">{i+1}</div>
                <img src={p.url} className="w-full h-full object-cover opacity-80" alt={`Page ${i+1}`} />
                <button 
                  onClick={() => setPages(pages.filter(page => page.id !== p.id))}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            {/* Finalize Button */}
            <button 
              onClick={handleFinalize}
              disabled={pages.length === 0}
              className={cn(
                "px-5 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all",
                pages.length > 0 ? "bg-white text-black hover:scale-105" : "bg-white/10 text-white/30 cursor-not-allowed"
              )}
            >
              <UploadCloud size={20} />
              <span>Terminer ({pages.length})</span>
            </button>

            {/* Capture Button */}
            <button 
              onClick={captureAndValidate}
              disabled={!isStable || validationStatus === 'checking'}
              className="relative group"
            >
              <div className={cn(
                "w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all bg-black",
                isStable ? "border-white" : "border-white/30",
                validationStatus === 'checking' && "opacity-50"
              )}>
                <div className={cn(
                  "w-16 h-16 rounded-full transition-all flex items-center justify-center",
                  isStable ? "bg-white group-active:scale-90" : "bg-white/20"
                )}>
                  {validationStatus === 'accepted' ? (
                    <Check className="text-green-500" size={24} />
                  ) : pages.length > 0 ? (
                    <Plus className={isStable ? "text-black" : "text-white/50"} size={28} />
                  ) : null}
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-app-xs font-medium text-white/50">
                {pages.length > 0 ? "Ajouter page" : "Scanner"}
              </div>
            </button>

            {/* Empty space for flex balance or extra tool */}
            <div className="w-32 flex justify-end">
              <button disabled className="p-3 bg-white/10 text-white/30 rounded-full">
                <Layers size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanAlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
