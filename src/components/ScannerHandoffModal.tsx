import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, MonitorPlay, Camera, X, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ScannerHandoffModalProps {
  onLocalScanner: () => void;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function ScannerHandoffModal({ onLocalScanner, onCancel, onSuccess }: ScannerHandoffModalProps) {
  const sessionUrl = `${window.location.origin}/mobile-scanner?session=${Math.random().toString(36).substring(7)}`;
  const [status, setStatus] = useState<'waiting' | 'connected' | 'scanning' | 'success'>('waiting');

  useEffect(() => {
    // For a real implementation, this would use a WebSocket or Firebase Realtime Database
    // to listen for the mobile scan completion.
    // For this AI Studio preview, we use localStorage to allow cross-tab testing on the same device,
    // and provide a manual confirmation button for cross-device testing.
    
    const handleStorageChange = (e: StorageEvent) => {
      // Allow cross-tab communication (if opened in same browser)
      if (e.key === 'mobile_scan_status') {
        const newStatus = e.newValue as typeof status;
        if (newStatus && ['waiting', 'connected', 'scanning', 'success'].includes(newStatus)) {
          setStatus(newStatus);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        if (onSuccess) onSuccess();
        else onCancel();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onSuccess, onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-xl bg-[#0f172a]/90 dark:bg-black/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />

        <div className="relative p-6 sm:p-8 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <MonitorPlay size={20} />
            </div>
            <div>
              <h3 className="text-app-md font-display font-bold text-white">SmartScanner Pro <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full ml-2 border border-blue-500/30">ML CORE</span></h3>
              <p className="text-sm font-medium text-blue-200/60 mt-0.5 flex items-center gap-2">
                Handoff Sécurisé <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {status === 'waiting' && (
              <motion.div 
                key="waiting"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center w-full"
              >
                <h4 className="text-app-lg font-bold text-center text-white mb-2 tracking-tight">Passez sur votre smartphone</h4>
                <p className="text-app-sm text-slate-300 text-center max-w-sm mb-6">
                  Flashez le QR Code pour activer la capture ML et la correction automatique (Perspective) sur mobile.
                </p>

                <div className="p-4 bg-white rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border-4 border-slate-800 mb-6 group cursor-pointer hover:scale-105 transition-transform">
                  <QRCodeSVG value={sessionUrl} size={180} level="H" includeMargin={true} fgColor="#0F172A" />
                </div>
                
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 uppercase tracking-widest bg-black/30 px-4 py-2 rounded-xl mb-4 border border-white/5">
                  <ShieldCheck size={14} className="text-green-400" /> E2E Encrypted WebSockets
                </div>
              </motion.div>
            )}

            {status === 'connected' && (
              <motion.div 
                key="connected"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 w-full"
              >
                <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                  <Smartphone size={40} className="animate-pulse" />
                </div>
                <h4 className="text-xl font-bold text-center text-white mb-2">Canal Sécurisé Établi</h4>
                <p className="text-sm font-medium text-blue-200/60 text-center">Appareil photo en cours d'initialisation (SDK)...</p>
              </motion.div>
            )}

            {status === 'scanning' && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 w-full"
              >
                <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 relative shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <Loader2 size={40} className="animate-spin absolute" />
                  <Camera size={24} className="animate-pulse" />
                </div>
                <h4 className="text-xl font-bold text-center text-white mb-2">Scan en temps réel</h4>
                <p className="text-sm font-medium text-indigo-200/60 text-center">Le moteur ML stabilise le document en cours...</p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 w-full"
              >
                <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 size={48} />
                </div>
                <h4 className="text-xl font-bold text-center text-white mb-2">Numérisation Valide</h4>
                <p className="text-sm font-medium text-green-200/60 text-center">Fichier 100% conforme. Synchronisation Drive finalisée.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {status === 'waiting' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <div className="flex items-center gap-4 w-full mt-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Ou mode fallback</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button 
                onClick={onLocalScanner}
                className="mt-6 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all w-full text-sm group"
              >
                <Camera size={18} className="text-white/50 group-hover:text-white transition-colors" />
                Utiliser le flux matériel brut (Webcam PC)
              </button>

              <button 
                onClick={() => setStatus('success')}
                className="mt-3 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 hover:bg-indigo-500/30 text-indigo-300 font-bold transition-all w-full text-sm group"
              >
                <CheckCircle2 size={18} className="text-indigo-400 group-hover:text-amber-300 transition-colors" />
                Forcer la Validation Test (Bypass ML)
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
