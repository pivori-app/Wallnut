import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Monitor, Check, RefreshCw, Clock, Wifi } from 'lucide-react';
import QRCode from 'qrcode';

interface Props {
  sessionId: string;
  documentName: string;
  documentIcon: string;
  onClose: () => void;
  onDocumentReceived?: (pages: any[]) => void;
}

export function QRHandoff({ sessionId, documentName, documentIcon, onClose, onDocumentReceived }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [status, setStatus] = useState<'waiting' | 'connected' | 'completed' | 'expired'>('waiting');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const token = useRef(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

  const handoffUrl = `${window.location.origin}${window.location.pathname}?session=${sessionId}&doc=${encodeURIComponent(documentName)}&token=${token.current}&mobile=1`;

  useEffect(() => {
    // Generate QR code
    QRCode.toDataURL(handoffUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#f8fafc',
      },
      errorCorrectionLevel: 'M',
    }).then(url => setQrDataUrl(url)).catch(console.error);

    // Countdown timer
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setStatus('expired');
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate mobile connection polling
    // In production: use WebSocket or Server-Sent Events
    let pollCount = 0;
    pollRef.current = setInterval(() => {
      pollCount++;
      // Simulate connection after ~8 seconds
      if (pollCount === 4 && status === 'waiting') {
        setStatus('connected');
      }
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [handoffUrl, status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleRefresh = () => {
    setTimeLeft(600);
    setStatus('waiting');
    token.current = Math.random().toString(36).substring(2, 15);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-slate-950 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Smartphone size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Continuer sur mobile</h3>
              <p className="text-slate-500 text-xs">Transférez vers votre smartphone</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Document being scanned */}
          <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 mb-5 border border-white/5">
            <span className="text-2xl">{documentIcon}</span>
            <div>
              <p className="text-white/90 text-sm font-semibold">{documentName}</p>
              <p className="text-slate-500 text-xs">Document à scanner sur mobile</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center">
            {status === 'expired' ? (
              <div className="w-64 h-64 bg-slate-900/40 dark:bg-white/5 backdrop-blur-xl rounded-2xl flex shadow-lg border border-white/20 flex-col items-center justify-center gap-3 border border-white/5">
                <Clock size={32} className="text-slate-600" />
                <p className="text-slate-500 text-sm font-medium">QR expiré</p>
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-white text-sm font-medium hover:bg-blue-500 transition-colors"
                >
                  <RefreshCw size={14} />
                  Nouveau QR
                </button>
              </div>
            ) : qrDataUrl ? (
              <div className="relative">
                <div className="p-3 bg-white rounded-2xl shadow-lg">
                  <img src={qrDataUrl} alt="QR Code" className="w-52 h-52" />
                </div>
                {/* Status overlay */}
                <AnimatePresence>
                  {status === 'connected' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-green-950/90 rounded-2xl"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center mx-auto mb-2">
                          <Check size={28} className="text-green-400" />
                        </div>
                        <p className="text-green-300 font-bold">Mobile connecté!</p>
                        <p className="text-green-500 text-xs mt-1">Scannez depuis votre téléphone</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="w-52 h-52 bg-slate-900/40 dark:bg-white/5 backdrop-blur-xl rounded-2xl flex shadow-lg border border-white/20 items-center justify-center border border-white/5">
                <div className="w-8 h-8 border-2 border-blue-500/50 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}

            {/* Timer */}
            <div className={`flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full ${status === 'expired' ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5 border border-white/10'}`}>
              <Clock size={12} className={status === 'expired' ? 'text-red-400' : 'text-slate-400'} />
              <span className={`text-xs font-mono font-bold ${status === 'expired' ? 'text-red-400' : 'text-slate-400'}`}>
                {status === 'expired' ? 'Expiré' : formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-5 space-y-2">
            {[
              { icon: '1️⃣', text: 'Ouvrez l\'appareil photo de votre smartphone' },
              { icon: '2️⃣', text: 'Scannez ce QR code pour ouvrir DocScan' },
              { icon: '3️⃣', text: 'Scannez vos documents depuis le mobile' },
              { icon: '4️⃣', text: 'Les scans apparaissent ici automatiquement' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-base shrink-0">{step.icon}</span>
                <p className="text-slate-400 text-xs leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>

          {/* Connection status */}
          <div className={`mt-4 flex items-center gap-2 p-3 rounded-xl border ${
            status === 'connected' ? 'bg-green-900/20 border-green-500/20' :
            status === 'expired' ? 'bg-red-900/20 border-red-500/20' :
            'bg-blue-900/10 border-blue-500/10'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              status === 'connected' ? 'bg-green-400 animate-pulse' :
              status === 'expired' ? 'bg-red-400' :
              'bg-blue-400 animate-pulse'
            }`} />
            <Wifi size={12} className={
              status === 'connected' ? 'text-green-400' :
              status === 'expired' ? 'text-red-400' :
              'text-blue-400'
            } />
            <span className={`text-xs font-medium ${
              status === 'connected' ? 'text-green-300' :
              status === 'expired' ? 'text-red-300' :
              'text-blue-300'
            }`}>
              {status === 'waiting' ? 'En attente de connexion mobile…' :
               status === 'connected' ? 'Mobile connecté — scan en cours' :
               status === 'expired' ? 'Session expirée' : ''}
            </span>
          </div>

          {/* Back to desktop */}
          <button
            onClick={onClose}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl transition-colors text-sm border border-white/10"
          >
            <Monitor size={15} />
            Continuer sur ordinateur
          </button>
        </div>
      </motion.div>
    </div>
  );
}
