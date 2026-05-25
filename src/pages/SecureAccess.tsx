import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Lock, AlertTriangle, FileText, Download } from 'lucide-react';
import { Logo } from '../components/Logo';

export function SecureAccess() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [authComplete, setAuthComplete] = useState(false);
  const [agrafeData, setAgrafeData] = useState<any>(null);
  
  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }
    
    // Validate token against backend
    fetch('/api/agrafes/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setStatus('valid');
        setAgrafeData(data.agrafe);
      } else {
        setStatus('invalid');
      }
    })
    .catch(() => setStatus('invalid'));
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
         <div className="animate-spin text-primary mb-4"><Lock size={32} /></div>
         <p className="text-slate-600 dark:text-white/60 font-bold">Vérification cryptographique en cours...</p>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-red-200 dark:border-red-500/20 p-8 rounded-3xl shadow-2xl text-center">
           <AlertTriangle size={48} className="text-red-500 mx-auto mb-6" />
           <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">Lien Expiré ou Invalide</h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
             Ce lien sécurisé n'est plus valable. Veuillez demander un nouvel accès à l'émetteur du document.
           </p>
           <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition">
             Retour à l'accueil
           </button>
        </div>
      </div>
    );
  }

  if (!authComplete) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-6 left-6"><Logo /></div>
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-2xl">
           <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-200 dark:border-blue-500/20">
             <ShieldCheck size={32} />
           </div>
           <h2 className="text-xl font-black text-slate-800 dark:text-white text-center mb-2">Accès Sécurisé</h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-8">
             Vous êtes sur le point d'accéder à un document confidentiel (Agrafe Numérique). Veuillez confirmer votre identité.
           </p>
           
           <div className="space-y-4">
              <input type="email" placeholder="Votre email professionnel" className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-primary outline-none" />
              <button onClick={() => setAuthComplete(true)} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition">
                M'authentifier (Simulation)
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col p-6">
       <header className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm mb-6">
         <Logo />
         <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-500/20">
           <Lock size={14} /> Chiffré AES-256
         </div>
       </header>

       <div className="w-full max-w-4xl mx-auto flex-1">
         <div className="flex items-center justify-between mb-8">
           <div>
             <h1 className="text-2xl font-black text-slate-800 dark:text-white">Dossier : {agrafeData?.templateType || 'Standard'}</h1>
             <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Partagé par le propriétaire du document. Expire dans 7 jours.</p>
           </div>
           <button className="px-5 py-2.5 bg-secondary text-slate-900 font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm">
             <Download size={16} /> Tout Télécharger
           </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {agrafeData?.documents?.map((doc: any, idx: number) => (
             <div key={idx} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 p-5 rounded-2xl flex items-center justify-between group hover:border-primary dark:hover:border-primary transition-colors">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-black/30 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{doc.name || 'Document classifié'}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">Classification certifiée • 1.2 MB</p>
                  </div>
               </div>
               <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                 <Download size={20} />
               </button>
             </div>
           ))}
         </div>
       </div>
    </div>
  );
}
