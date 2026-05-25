import React, { useState } from 'react';
import { ShieldCheck, UploadCloud, FileCheck, BrainCircuit, Activity, Lock, Cloud, Share2, Mail, Clock, AlertTriangle } from 'lucide-react';
import { uploadToSmartVault, createAgrafe } from '../services/smartModule';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export function SmartVault() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [useDriveFallback, setUseDriveFallback] = useState(false); // Simulera l'activation Google Drive by user
  
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [recipient, setRecipient] = useState('');
  const [isAssembling, setIsAssembling] = useState(false);
  const [agrafeLink, setAgrafeLink] = useState('');

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadResult(null);
    }
  };

  const executeUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setErrorMsg('');
    try {
      const data = await uploadToSmartVault(file, useDriveFallback);
      setUploadResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur de classification OCR.");
    } finally {
      setIsUploading(false);
    }
  };

  const generateAgrafe = async () => {
    if (!uploadResult?.documentId || !recipient) return;
    setIsAssembling(true);
    try {
       const res = await createAgrafe([uploadResult.documentId], "dossier_vente", recipient);
       setAgrafeLink(res.secureLink);
    } catch (err: any) {
       setErrorMsg("Impossible de générer l'agrafe chiffrée.");
    } finally {
      setIsAssembling(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary backdrop-blur-md">
            <Lock size={28} className="drop-shadow-lg" />
          </div>
          <div>
             <h2 className="text-2xl font-display font-black text-white tracking-tight flex items-center gap-2">
               Module Intelligent <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-primary/30">Actif</span>
             </h2>
             <p className="text-white/60 font-medium text-sm max-w-lg mt-1">
               Classification automatique OCR, coffre-fort AES-256 avec Fallback GCS / Google Drive, et génération d'Agrafes numériques éphémères.
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ZON D'UPLOAD & OCR */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-6 md:p-8 rounded-[2rem] shadow-xl relative">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <BrainCircuit size={20} className="text-secondary" /> Moteur d'Analyse OCR
          </h3>
          
          <div 
             className={cn(
               "border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all min-h-[220px]",
               file ? "border-green-500/50 bg-green-50 dark:bg-green-500/5" : "border-gray-300 dark:border-white/20 hover:border-primary/50 dark:hover:border-primary/50 cursor-pointer"
             )}
             onDragOver={(e) => e.preventDefault()}
             onDrop={handleFileDrop}
             onClick={() => document.getElementById("file-ocr-input")?.click()}
          >
             <input type="file" id="file-ocr-input" className="hidden" onChange={(e) => {
               if (e.target.files?.[0]) { setFile(e.target.files[0]); setUploadResult(null); }
             }} />
             {!file ? (
               <>
                 <UploadCloud size={48} className="text-slate-400 dark:text-white/40 mb-4" />
                 <p className="font-bold text-slate-800 dark:text-white text-center">Déposez un document sensible</p>
                 <p className="text-sm text-slate-500 dark:text-white/50 text-center mt-2">Passeport, DPE, Avis d'impôt (Max 10Mo)</p>
               </>
             ) : (
               <>
                 <FileCheck size={48} className="text-green-500 mb-4" />
                 <p className="font-bold text-slate-800 dark:text-white">{file.name}</p>
                 <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB • Prêt pour le scan</p>
               </>
             )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
             <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-white/80 cursor-pointer">
               <input type="checkbox" checked={useDriveFallback} onChange={e => setUseDriveFallback(e.target.checked)} className="rounded text-primary focus:ring-primary/50 bg-slate-100 dark:bg-white/10 border-gray-300 dark:border-white/20" />
               Forcer le mode cloud G-Drive
             </label>
             <button
               onClick={executeUpload}
               disabled={!file || isUploading}
               className="px-6 py-3 bg-secondary text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
             >
               {isUploading ? <Activity size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
               Analyser l'Actif
             </button>
          </div>
        </div>

        {/* FEEDBACK & AGRAFE */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-6 md:p-8 rounded-[2rem] shadow-xl relative min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <ShieldCheck size={20} className="text-green-500" /> Validation & Agrafe Sécurisée
          </h3>

          {!uploadResult && !errorMsg && (
             <div className="h-full min-h-[250px] flex flex-col items-center justify-center opacity-40">
               <ShieldCheck size={64} className="mb-4 text-slate-400 dark:text-white/50" />
               <p className="font-medium text-center">Aucun document classifié.</p>
             </div>
          )}

          {errorMsg && (
             <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-medium text-sm flex items-start gap-3">
               <AlertTriangle size={20} className="shrink-0" />
               <p>{errorMsg}</p>
             </div>
          )}

          {uploadResult && (
             <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
               <div className="p-5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-green-500/10">
                    <ShieldCheck size={100} />
                  </div>
                  <div className="relative z-10 space-y-4">
                     <div>
                       <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">OCR Type Info</p>
                       <p className="font-display font-bold text-slate-900 dark:text-white text-xl">{uploadResult.classification}</p>
                     </div>
                     <div className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-green-100">
                        <div className="flex items-center gap-1.5 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-green-500/20">
                          <Clock size={14} /> Expire: {uploadResult.extractedDate || "N/A"}
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-green-500/20">
                          <Cloud size={14} /> {uploadResult.storage}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Générer Agrafe Numérique (Token 7J)</h4>
                  <div className="flex items-center gap-3">
                     <div className="relative flex-1">
                       <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                         type="email" 
                         value={recipient} 
                         onChange={e => setRecipient(e.target.value)} 
                         placeholder="Email du notaire / partenaire" 
                         className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 focus:border-secondary outline-none text-sm text-slate-900 dark:text-white font-medium"
                       />
                     </div>
                     <button
                       onClick={generateAgrafe}
                       disabled={!recipient || isAssembling}
                       className="px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-all text-sm disabled:opacity-50 shrink-0"
                     >
                       {isAssembling ? 'Génération...' : 'Assembler'}
                     </button>
                  </div>
               </div>

               {agrafeLink && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl relative">
                     <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">Lien d'Agrafe Sécurisé</p>
                     <div className="flex items-center gap-2">
                       <input readOnly value={agrafeLink} className="flex-1 bg-white/50 dark:bg-black/20 border border-blue-200 dark:border-blue-500/30 rounded-lg px-3 py-2 text-xs text-slate-600 dark:text-blue-100 font-mono focus:outline-none" />
                       <button onClick={() => navigator.clipboard.writeText(agrafeLink)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                         <Share2 size={16} />
                       </button>
                     </div>
                  </div>
               )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
