import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, FileText, Plus, Check, X, Smartphone, AlertTriangle, Loader2, UploadCloud, RefreshCw, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

// Types and Mocks
type DocType = 'Identité (CNI/Passeport)' | 'Justificatif de domicile (Facture)' | 'Avis d’impôt' | 'Kbis';

interface ScannedPage {
  id: string;
  url: string; // Blob URL in real life
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
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. STABILISATEUR (Gyroscope Logic Simulation)
  useEffect(() => {
    let stabilityTimer: NodeJS.Timeout;
    
    // In a real device, we would use DeviceMotionEvent
    // For web preview, we simulate movement and stabilization
    const handleSimulatedMotion = () => {
      setIsStable(false);
      clearTimeout(stabilityTimer);
      stabilityTimer = setTimeout(() => {
        setIsStable(true);
      }, 1000); // 1 second of stability required
    };

    // Simulate phone movement randomly for demo
    const interval = setInterval(handleSimulatedMotion, 3500);
    handleSimulatedMotion(); // Initial calculation

    // Real implementation pseudo-code:
    /*
    const handleMotion = (event: DeviceMotionEvent) => {
      const { x, y, z } = event.acceleration || { x: 0, y: 0, z: 0 };
      const movement = Math.abs(x || 0) + Math.abs(y || 0) + Math.abs(z || 0);
      if (movement < 0.5) setIsStable(true);
      else setIsStable(false);
    };
    window.addEventListener('devicemotion', handleMotion);
    */

    return () => {
      clearInterval(interval);
      clearTimeout(stabilityTimer);
    };
  }, []);

  // 2. IA PIPELINE 1 & PIPELINE 2 (Qualité et Pertinence)
  const captureAndValidate = async () => {
    if (!isStable) return;
    setIsCapturing(true);

    // Simulate capturing a frame from videoRef
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

      // Simulation de rejet ou d'acceptation de l'IA
      const randomOutcome = Math.random();
      
      if (randomOutcome < 0.3) {
        // Simulation d'une erreur d'éclairage ou de flou
        throw new Error(Math.random() > 0.5 ? "blur_detected" : "too_dark");
      } else if (randomOutcome > 0.8) {
        // Simulation Mauvais document (ex: impôt au lieu de facture)
        throw new Error("wrong_document_type");
      }

      // Success
      const newPage = { id: Math.random().toString(), url: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80&w=200&h=300' };
      setPages(prev => [...prev, newPage]);
      setValidationStatus('accepted');
      setTimeout(() => setValidationStatus('idle'), 1500);

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
    onComplete([]); // Should be the generated PDF files
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg h-[85vh] bg-[#111] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10">
        
        {/* Header */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <button onClick={onCancel} className="p-2 text-white/70 hover:text-white rounded-full bg-black/40 backdrop-blur-md transition-colors">
            <X size={20} />
          </button>
          <div className="px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/90 text-sm font-medium flex items-center gap-2">
            <ScanAlertIcon /> {expectedDocType}
          </div>
          <div className="w-9" /> {/* Spacer for balance */}
        </div>

        {/* Viewfinder & Edge Detection Overlay */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {/* Simulated Camera Feed */}
          <div className="absolute inset-0 bg-neutral-900 animate-pulse opacity-50" />
          
          <div className="absolute inset-8 border-2 border-dashed border-white/40 rounded-xl pointer-events-none transition-all duration-300" 
               style={{ 
                 borderColor: validationStatus === 'checking' ? 'rgba(59, 130, 246, 0.6)' : 
                              isStable ? 'rgba(34, 197, 94, 0.8)' : 'rgba(255, 255, 255, 0.4)'
               }}
          >
            {/* Corner Indicators */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white/80 rounded-tl-lg" style={{ borderColor: isStable ? '#22c55e' : '#ffffff80' }}/>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white/80 rounded-tr-lg" style={{ borderColor: isStable ? '#22c55e' : '#ffffff80' }}/>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white/80 rounded-bl-lg" style={{ borderColor: isStable ? '#22c55e' : '#ffffff80' }}/>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white/80 rounded-br-lg" style={{ borderColor: isStable ? '#22c55e' : '#ffffff80' }}/>
          </div>

          {/* Stabilizer Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {!isStable && validationStatus === 'idle' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                 <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center mb-2">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-ping" />
                 </div>
                 <span className="text-white/70 text-xs font-bold uppercase tracking-wider bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">Stabilisez l'appareil</span>
              </motion.div>
            )}
            {validationStatus === 'checking' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                 <Loader2 className="animate-spin text-blue-400 mb-2" size={32} />
                 <span className="text-blue-200 text-xs font-bold uppercase tracking-wider bg-blue-900/40 px-3 py-1 rounded-full backdrop-blur-sm border border-blue-500/30">Analyse IA en cours...</span>
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
                  
                  <h4 className="text-white font-display font-bold text-lg mb-2 tracking-tight">Erreur de Document</h4>
                  
                  <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
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

        {/* Footer Controls */}
        <div className="relative z-20 bg-black/90 pb-8 pt-4 px-6 border-t border-white/10 shrink-0">
          
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
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-white/50">
                {pages.length > 0 ? "Ajouter page" : "Scanner"}
              </div>
            </button>

            {/* Empty space for flex balance or extra tool */}
            <div className="w-32 flex justify-end">
              <button disabled className="p-3 bg-white/5 text-white/30 rounded-full">
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
