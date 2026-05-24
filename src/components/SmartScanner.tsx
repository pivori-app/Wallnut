import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Check, Plus, AlertTriangle, Loader2, UploadCloud,
  RefreshCw, Layers, Zap, ZapOff, RotateCcw, Trash2,
  Sun, SunDim, ChevronLeft, ChevronRight, Smartphone,
  QrCode, CheckCircle, Info
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useCamera } from '../hooks/useCamera';
import { useDocumentAI } from '../hooks/useDocumentAI';
import { DocumentItem, ScannedPage, ScanQualityStatus } from '../types';

interface Props {
  document: DocumentItem;
  allDocuments: DocumentItem[];
  currentIndex: number;
  totalCount: number;
  isMobileSession?: boolean;
  onPagesCapture: (pages: ScannedPage[]) => void;
  onComplete: () => void;
  onSkip: () => void;
  onCancel: () => void;
  onSwitchToMobile: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

type AlertType = 'blur' | 'too_dark' | 'too_bright' | 'wrong_document' | 'unknown' | null;

export function SmartScanner({
  document,
  allDocuments,
  currentIndex,
  totalCount,
  isMobileSession,
  onPagesCapture,
  onComplete,
  onSkip,
  onCancel,
  onSwitchToMobile,
  onNavigate,
}: Props) {
  const [pages, setPages] = useState<ScannedPage[]>(document.pages || []);
  const [qualityStatus, setQualityStatus] = useState<ScanQualityStatus>('idle');
  const [alertType, setAlertType] = useState<AlertType>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(true);
  const [filterMode, setFilterMode] = useState<'auto' | 'bw' | 'color' | 'enhanced'>('auto');
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  const { videoRef, canvasRef, state: cameraState, error: cameraError, startCamera, stopCamera, captureFrame, brightness, isStable, hasFlash, toggleFlash, flashOn } = useCamera();
  const { validateCapture } = useDocumentAI();

  // Sync pages from document prop when switching docs
  useEffect(() => {
    setPages(document.pages || []);
    setQualityStatus('idle');
    setAlertType(null);
    setAlertMessage(null);
    setConfidence(null);
    setDetectedType(null);
  }, [document.id]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const brightnessLabel = brightness < 60 ? 'Sombre' : brightness > 200 ? 'Surexposé' : 'Bon';
  const brightnessColor = brightness < 60 ? 'text-orange-400' : brightness > 200 ? 'text-yellow-400' : 'text-green-400';

  const handleCapture = useCallback(async () => {
    if (!isStable && cameraState === 'active') {
      setAlertMessage("Stabilisez votre appareil avant de scanner.");
      return;
    }

    setQualityStatus('checking');
    setAlertType(null);
    setAlertMessage(null);

    let dataUrl: string | null = null;
    if (cameraState === 'active') {
      dataUrl = captureFrame();
    }

    // Use placeholder if camera not available (desktop demo)
    const fallbackDataUrl = `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="550" viewBox="0 0 400 550">
        <rect width="400" height="550" fill="#1e293b"/>
        <rect x="30" y="30" width="340" height="490" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1"/>
        <text x="200" y="240" text-anchor="middle" fill="#64748b" font-size="60">${document.icon}</text>
        <text x="200" y="300" text-anchor="middle" fill="#94a3b8" font-size="16">${document.name}</text>
        <text x="200" y="330" text-anchor="middle" fill="#475569" font-size="12">Page ${pages.length + 1}</text>
      </svg>
    `)}`;

    const imageData = dataUrl || fallbackDataUrl;

    try {
      const result = await validateCapture(imageData, document, brightness);

      if (!result.ok) {
        setQualityStatus('rejected');
        setAlertType(result.reason as AlertType);
        setAlertMessage(result.message);
      } else {
        setQualityStatus('accepted');
        setConfidence(result.confidence);
        setDetectedType(result.detectedType);

        const newPage: ScannedPage = {
          id: crypto.randomUUID(),
          dataUrl: imageData,
          timestamp: Date.now(),
          brightness,
        };

        const updatedPages = [...pages, newPage];
        setPages(updatedPages);
        onPagesCapture(updatedPages);

        setTimeout(() => {
          setQualityStatus('idle');
          setConfidence(null);
        }, 2000);
      }
    } catch {
      setQualityStatus('rejected');
      setAlertMessage("Erreur lors de l'analyse du document.");
    }
  }, [isStable, cameraState, captureFrame, validateCapture, document, brightness, pages, onPagesCapture]);

  const handleDeletePage = (pageId: string) => {
    const updated = pages.filter(p => p.id !== pageId);
    setPages(updated);
    onPagesCapture(updated);
    setSelectedPage(null);
  };

  const handleRetry = () => {
    setQualityStatus('idle');
    setAlertType(null);
    setAlertMessage(null);
  };

  const canNavigatePrev = currentIndex > 0;
  const canNavigateNext = currentIndex < totalCount - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/95 backdrop-blur-sm p-0 md:p-4">
      <div className="relative w-full md:max-w-lg h-full md:h-[90vh] bg-primary md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col border-0 md:border md:border-secondary/20">

        {/* ── HEADER ── */}
        <div className="absolute top-0 inset-x-0 z-20 flex flex-col gap-2 p-4 bg-gradient-to-b from-primary-dark via-primary-dark/90 to-transparent">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 text-white/90 hover:text-white rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors text-xs font-bold border border-white/20 shadow-sm"
            >
              <ChevronLeft size={16} />
              <span>Retour à l'application</span>
            </button>

            <div className="flex gap-1.5">
              {!isMobileSession && (
                <button
                  onClick={onSwitchToMobile}
                  className="p-2 text-white/60 hover:text-white rounded-full bg-white/10 backdrop-blur-md transition-colors border border-white/10"
                  title="Continuer sur mobile"
                >
                  <Smartphone size={16} />
                </button>
              )}
              {hasFlash && (
                <button
                  onClick={toggleFlash}
                  className={cn("p-2 rounded-full backdrop-blur-md transition-colors border border-white/10", flashOn ? "bg-secondary text-white border-secondary" : "bg-white/10 text-white/60 hover:text-white")}
                >
                  {flashOn ? <Zap size={16} /> : <ZapOff size={16} />}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between w-full mt-2">
            <div className="flex flex-col">
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold flex items-center gap-2 max-w-[250px]">
                <span className="text-xl shrink-0">{document.icon}</span>
                <span className="truncate">{document.name}</span>
              </div>
              <span className="text-secondary text-[10px] font-bold mt-1 px-1 uppercase tracking-wider">
                Document {currentIndex + 1}/{totalCount}
              </span>
            </div>
          </div>
        </div>

        {/* ── CAMERA VIEWFINDER ── */}
        <div className="relative flex-1 bg-primary-dark flex items-center justify-center overflow-hidden">

          {/* Video feed */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera not available overlay */}
          {(cameraState === 'idle' || cameraState === 'requesting') && (
            <div className="absolute inset-0 bg-primary-dark flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">{document.icon}</div>
                <Loader2 className="animate-spin text-secondary mx-auto mb-3" size={28} />
                <p className="text-white/60 text-sm font-medium">Initialisation de la caméra…</p>
              </div>
            </div>
          )}

          {cameraState === 'error' && (
            <div className="absolute inset-0 bg-primary-dark flex items-center justify-center p-6">
              <div className="text-center max-w-xs">
                <div className="text-5xl mb-4">{document.icon}</div>
                <AlertTriangle className="text-secondary mx-auto mb-3" size={28} />
                <p className="text-white text-sm font-bold mb-2">Caméra non accessible</p>
                <p className="text-white/50 text-xs mb-6">{cameraError}</p>
                <button
                  onClick={handleCapture}
                  className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-bold shadow-lg shadow-secondary/20 hover:scale-105 transition-all w-full"
                >
                  Scanner (Mode Démo)
                </button>
              </div>
            </div>
          )}

          {/* VIEWFINDER FRAME */}
          {(cameraState === 'active' || cameraState === 'error') && (
            <div
              className="absolute inset-8 pointer-events-none transition-all duration-500"
              style={{
                borderColor:
                  qualityStatus === 'checking' ? '#C79A2E' :
                  qualityStatus === 'accepted' ? '#10B981' :
                  qualityStatus === 'rejected' ? '#EF4444' :
                  isStable ? '#10B981' : 'rgba(255,255,255,0.3)',
              }}
            >
              {/* Corner brackets */}
              {['tl','tr','bl','br'].map(pos => (
                <div
                  key={pos}
                  className={cn(
                    "absolute w-7 h-7 border-white/80 transition-colors duration-300",
                    pos === 'tl' && "-top-0.5 -left-0.5 border-t-[3px] border-l-[3px] rounded-tl-lg",
                    pos === 'tr' && "-top-0.5 -right-0.5 border-t-[3px] border-r-[3px] rounded-tr-lg",
                    pos === 'bl' && "-bottom-0.5 -left-0.5 border-b-[3px] border-l-[3px] rounded-bl-lg",
                    pos === 'br' && "-bottom-0.5 -right-0.5 border-b-[3px] border-r-[3px] rounded-br-lg",
                  )}
                  style={{
                    borderColor:
                      qualityStatus === 'accepted' ? '#22c55e' :
                      qualityStatus === 'rejected' ? '#ef4444' :
                      isStable ? '#22c55e' : 'rgba(255,255,255,0.6)',
                  }}
                />
              ))}

              {/* Scanning line animation */}
              {qualityStatus === 'checking' && (
                <motion.div
                  className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent shadow-[0_0_10px_rgba(199,154,46,0.8)]"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </div>
          )}

          {/* STABILITY INDICATOR */}
          {qualityStatus === 'idle' && cameraState === 'active' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence>
                {!isStable ? (
                  <motion.div
                    key="unstable"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center mb-2 bg-black/30 backdrop-blur-sm">
                      <div className="w-3 h-3 bg-white/60 rounded-full animate-ping" />
                    </div>
                    <span className="text-white/80 text-xs font-bold uppercase tracking-wider bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      Stabilisez l'appareil (Analyse ML)
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="stable"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    {pages.length === 0 && (
                      <span className="text-green-300/90 text-xs font-bold uppercase tracking-wider bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-green-500/30">
                        ✓ Prêt à scanner
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* CHECKING STATE */}
          {qualityStatus === 'checking' && (
            <div className="absolute inset-0 bg-primary-dark/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <Loader2 className="animate-spin text-secondary" size={44} />
                <span className="text-white text-xs font-bold uppercase tracking-widest bg-secondary/20 px-5 py-2 rounded-full border border-secondary/40 shadow-[0_0_20px_rgba(199,154,46,0.3)]">
                  Analyse IA en cours…
                </span>
              </motion.div>
            </div>
          )}

          {/* ACCEPTED STATE */}
          {qualityStatus === 'accepted' && (
            <div className="absolute inset-0 bg-green-950/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center">
                  <Check size={36} className="text-green-400" />
                </div>
                {confidence !== null && (
                  <div className="text-center">
                    <span className="text-green-300 text-xs font-bold bg-green-900/60 px-3 py-1 rounded-full border border-green-500/30">
                      ✓ {detectedType} — {confidence}% confiance
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* BRIGHTNESS & QUALITY INDICATORS */}
          <div className="absolute top-28 right-4 flex flex-col gap-2">
            <div className="bg-primary-dark/80 backdrop-blur-md rounded-xl px-3 py-2 text-center border border-white/10 shadow-lg">
              <Sun size={16} className={cn("mx-auto mb-1", brightnessColor)} />
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", brightnessColor)}>{brightnessLabel}</span>
            </div>
            <div className={cn("bg-primary-dark/80 backdrop-blur-md rounded-xl px-3 py-2 text-center border shadow-lg", isStable ? "border-green-500/50" : "border-white/10")}>
              <div className={cn("w-2 h-2 rounded-full mx-auto mb-1", isStable ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" : "bg-white/30 animate-pulse")} />
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", isStable ? "text-green-400" : "text-white/50")}>
                {isStable ? 'Stable' : 'Bouge'}
              </span>
            </div>
          </div>

          {/* TIP BANNER */}
          {showTip && pages.length === 0 && qualityStatus === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 inset-x-4"
            >
              <div className="bg-primary/95 backdrop-blur-xl rounded-2xl p-4 border border-secondary/30 flex items-start gap-4 shadow-2xl">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Info size={16} className="text-secondary" />
                </div>
                <p className="text-white/80 text-xs flex-1 leading-relaxed mt-0.5">
                  Placez votre <span className="text-white font-bold">{document.name}</span> dans le cadre. L'IA vérifiera automatiquement le document.
                </p>
                <button onClick={() => setShowTip(false)} className="text-white/40 hover:text-white p-1">
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── REJECTION OVERLAY ── */}
        <AnimatePresence>
          {qualityStatus === 'rejected' && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute inset-x-4 bottom-36 z-30"
            >
              <div className="relative overflow-hidden bg-primary-dark/95 backdrop-blur-3xl border border-red-500/40 rounded-3xl p-5 shadow-[0_20px_50px_rgba(239,68,68,0.3)]">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-red-500/20 blur-3xl rounded-full pointer-events-none" />

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="flex-1 mt-0.5">
                    <h4 className="text-white font-black text-sm mb-1 uppercase tracking-wide">
                      {alertType === 'wrong_document' ? 'Document incorrect' :
                       alertType === 'blur' ? 'Image floue' :
                       alertType === 'too_dark' ? 'Trop sombre' :
                       alertType === 'too_bright' ? 'Surexposé' :
                       'Erreur de scan'}
                    </h4>
                    <p className="text-white/60 text-xs leading-relaxed">{alertMessage}</p>
                  </div>
                </div>

                <button
                  onClick={handleRetry}
                  className="w-full mt-6 py-3.5 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                >
                  <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                  Reprendre la photo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FOOTER CONTROLS ── */}
        <div className="relative z-20 bg-primary-dark border-t border-white/10 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">

          {/* Page thumbnails */}
          {pages.length > 0 && (
            <div className="flex items-center gap-2.5 px-4 pt-3 pb-2 overflow-x-auto scrollbar-none">
              {pages.map((page, i) => (
                <motion.div
                  key={page.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "relative w-16 h-24 rounded-2xl border-2 shrink-0 overflow-hidden cursor-pointer transition-all",
                    selectedPage === i ? "border-secondary ring-4 ring-secondary/30 scale-105" : "border-white/20 opacity-80 hover:opacity-100"
                  )}
                  onClick={() => setSelectedPage(selectedPage === i ? null : i)}
                >
                  <img
                    src={page.dataUrl}
                    alt={`Page ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-2xl">
                    {document.icon}
                  </div>
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded font-bold">{i + 1}</div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeletePage(page.id); }}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500/80 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <X size={9} />
                  </button>
                </motion.div>
              ))}

              {/* Add page indicator */}
              <div className="w-16 h-24 rounded-2xl border-2 border-dashed border-white/20 shrink-0 flex flex-col items-center justify-center gap-1.5 bg-white/5">
                <Plus size={20} className="text-white/40" />
                <span className="text-white/40 text-[10px] font-bold">Ajouter</span>
              </div>
            </div>
          )}

          {/* Main buttons */}
          <div className="flex items-center justify-between px-4 py-4 gap-3">

            {/* Finalize button */}
            <button
              onClick={onComplete}
              disabled={pages.length === 0}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all",
                pages.length > 0
                  ? "bg-white text-black hover:scale-105 shadow-lg"
                  : "bg-white/8 text-white/25 cursor-not-allowed"
              )}
            >
              <CheckCircle size={18} />
              <span>Valider ({pages.length})</span>
            </button>

            {/* Capture button */}
            <button
              onClick={handleCapture}
              disabled={qualityStatus === 'checking'}
              className="relative group"
            >
              <div className={cn(
                "w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all bg-primary-dark shadow-[0_0_30px_rgba(199,154,46,0.1)]",
                isStable && cameraState !== 'error' ? "border-secondary shadow-[0_0_30px_rgba(199,154,46,0.2)]" : "border-white/30",
                qualityStatus === 'checking' && "opacity-50"
              )}>
                <div className={cn(
                  "w-16 h-16 rounded-full transition-all duration-150 flex items-center justify-center",
                  isStable || cameraState === 'error' ? "bg-white group-active:scale-90" : "bg-white/20"
                )}>
                  {qualityStatus === 'accepted' ? (
                    <Check className="text-green-500" size={26} />
                  ) : qualityStatus === 'checking' ? (
                    <Loader2 className="text-secondary animate-spin" size={26} />
                  ) : pages.length > 0 ? (
                    <Plus className={cn(isStable || cameraState === 'error' ? "text-primary-dark" : "text-white/40")} size={30} />
                  ) : null}
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-white/50">
                {pages.length > 0 ? 'Ajouter page' : 'Scanner'}
              </div>
            </button>

            {/* Skip / navigate */}
            <div className="flex flex-col gap-1.5">
              {!document.required && (
                <button
                  onClick={onSkip}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                >
                  Passer →
                </button>
              )}
              <div className="flex gap-1.5">
                <button
                  onClick={() => onNavigate('prev')}
                  disabled={!canNavigatePrev}
                  className={cn("p-2 rounded-xl text-xs transition-colors", canNavigatePrev ? "bg-white/8 text-white/60 hover:bg-white/15" : "bg-white/4 text-white/15 cursor-not-allowed")}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => onNavigate('next')}
                  disabled={!canNavigateNext}
                  className={cn("p-2 rounded-xl text-xs transition-colors", canNavigateNext ? "bg-white/8 text-white/60 hover:bg-white/15" : "bg-white/4 text-white/15 cursor-not-allowed")}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter mode */}
          <div className="flex gap-2 px-4 pb-4">
            {(['auto', 'bw', 'color', 'enhanced'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all border",
                  filterMode === mode
                    ? "bg-white/15 text-white border-white/30"
                    : "bg-white/4 text-white/30 border-white/10 hover:bg-white/8"
                )}
              >
                {mode === 'auto' ? 'Auto' : mode === 'bw' ? 'N&B' : mode === 'color' ? 'Couleur' : 'Amélioré'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
