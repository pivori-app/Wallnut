import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SmartScannerPro } from '../components/SmartScannerPro';
import { motion } from 'motion/react';
import { Camera, ShieldCheck, FileCheck, CheckCircle2, Cloud } from 'lucide-react';

export function MobileScannerPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const docName = searchParams.get('doc');
  const token = searchParams.get('token');

  const [mode, setMode] = useState<'welcome' | 'scanning' | 'success'>('welcome');

  useEffect(() => {
    // Ideally validate token / session via API
  }, [sessionId, token]);

  if (!sessionId || !docName) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck size={48} className="text-red-500 mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Lien invalide ou expiré</h1>
        <p className="text-slate-400 text-sm">Veuillez générer un nouveau QR Code depuis votre ordinateur.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 font-sans">
      {mode === 'welcome' && (
        <div className="flex flex-col min-h-[100dvh] p-6">
          <div className="flex-1 flex flex-col items-center justify-center relative mt-12">
            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
            <div className="w-24 h-24 rounded-3xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-8 relative shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <Camera size={40} className="text-blue-400" />
              <div className="absolute -bottom-2 -right-2 bg-[#0F172A] p-2 rounded-full border border-blue-500/20">
                <ShieldCheck size={16} className="text-green-400" />
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-white mb-2 text-center tracking-tight">SmartScanner Pro</h1>
            
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 w-full mt-6 flex items-center justify-center gap-3">
              <FileCheck size={20} className="text-blue-400" />
              <span className="text-white font-medium">{docName}</span>
            </div>

            <p className="text-blue-200/60 text-sm text-center mt-6 max-w-[280px] leading-relaxed">
              La passerelle WebSocket sécurisée est prête. Le moteur ML "Scanbot SDK" stabilisera l'image avant l'envoi.
            </p>
          </div>

          <button
            onClick={() => {
              setMode('scanning');
              localStorage.setItem('mobile_scan_status', 'scanning');
            }}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(59,130,246,0.3)] border border-blue-500/50 mb-8"
          >
            <Camera size={22} />
            Démarrer le moteur de Scan
          </button>
        </div>
      )}

      {mode === 'scanning' && (
        <SmartScannerPro
          expectedDocType={docName ? docName as any : "Document" as any}
          onComplete={() => {
            setMode('success');
            // Mock API call to send file back to session via WebSocket/Firebase
            // For now, we use localStorage for cross-tab communications
            localStorage.setItem('mobile_scan_status', 'success');
            setTimeout(() => {
                localStorage.removeItem('mobile_scan_status');
            }, 1000);
          }}
          onCancel={() => setMode('welcome')}
        />
      )}

      {mode === 'success' && (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center mb-6"
          >
            <CheckCircle2 size={48} className="text-green-400" />
          </motion.div>

          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Scan transféré !</h2>
          <p className="text-slate-400 text-sm mb-8 max-w-[280px]">
            Le document a été envoyé avec succès à votre ordinateur.
          </p>

          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium bg-blue-900/20 px-4 py-2 rounded-full border border-blue-500/20">
            <Cloud size={16} />
            Synchronisation cloud terminée
          </div>
        </div>
      )}
    </div>
  );
}
