import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Upload, FolderOpen, Check, Loader2, ChevronDown, ChevronUp,
  Download, Paperclip, Layers, FileText, Star, ExternalLink,
  AlertTriangle, Cloud
} from 'lucide-react';
import { DocumentItem, StapleMode, ClientType } from '../types';
import { generatePDF, generateMergedPDF, downloadPDF } from '../utils/pdfGenerator';
import { cn } from '../utils/cn';

interface Props {
  documents: DocumentItem[];
  clientType: ClientType;
  clientName: string;
  onClose: () => void;
}

type ExportStatus = 'idle' | 'generating' | 'uploading' | 'success' | 'error';

export function DriveExport({ documents, clientType, clientName, onClose }: Props) {
  const [stapleMode, setStapleMode] = useState<StapleMode>('auto');
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [folderUrl, setFolderUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const completedDocs = documents.filter(d => d.status === 'completed' && d.pages.length > 0);
  const skippedDocs = documents.filter(d => d.status === 'skipped');
  const pendingDocs = documents.filter(d => d.status === 'pending' || d.status === 'error');

  const handleGoogleAuth = async () => {
    setStatus('generating');
    setProgressLabel('Connexion à Google Drive…');
    setProgress(10);

    // Simulate OAuth flow
    await new Promise(r => setTimeout(r, 1500));
    setIsAuthenticated(true);
    setStatus('idle');
    setProgress(0);
    setProgressLabel('');
  };

  const handleExport = async () => {
    if (completedDocs.length === 0) return;

    setStatus('generating');
    setError(null);
    setProgress(5);

    try {
      const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');

      // Simulate PDF generation
      for (let i = 0; i < completedDocs.length; i++) {
        const doc = completedDocs[i];
        setProgressLabel(`Génération PDF: ${doc.name}…`);
        setProgress(Math.round(5 + ((i + 1) / completedDocs.length) * 40));
        await new Promise(r => setTimeout(r, 400));
      }

      // Generate merged PDF if stapling
      if (stapleMode !== 'none') {
        setProgressLabel('Création du dossier agrafé…');
        setProgress(50);
        await new Promise(r => setTimeout(r, 600));
      }

      setStatus('uploading');
      setProgressLabel('Envoi vers Google Drive…');
      setProgress(60);

      // Simulate folder structure creation
      const folderSteps = [
        `📁 ${clientName} - ${date}`,
        '  📁 Identité',
        '  📁 Domicile',
        '  📁 Fiscal',
        '  📁 Bancaire',
      ];

      for (let i = 0; i < folderSteps.length; i++) {
        setProgressLabel(`Création: ${folderSteps[i]}…`);
        setProgress(60 + Math.round(((i + 1) / folderSteps.length) * 25));
        await new Promise(r => setTimeout(r, 300));
      }

      // Upload files
      for (let i = 0; i < completedDocs.length; i++) {
        const doc = completedDocs[i];
        setProgressLabel(`Upload: ${doc.name}…`);
        setProgress(85 + Math.round(((i + 1) / completedDocs.length) * 12));
        await new Promise(r => setTimeout(r, 350));
      }

      setProgress(100);
      setProgressLabel('Terminé!');
      setFolderUrl(`https://drive.google.com/drive/folders/demo_${Date.now()}`);
      setStatus('success');

    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Erreur lors de l\'export');
    }
  };

  const handleLocalDownload = async () => {
    setStatus('generating');
    setProgress(10);
    setProgressLabel('Préparation du téléchargement…');

    try {
      if (stapleMode !== 'none' && completedDocs.length > 1) {
        setProgressLabel('Génération du PDF fusionné…');
        setProgress(50);
        const mergedBlob = await generateMergedPDF(completedDocs, stapleMode === 'auto');
        setProgress(90);
        const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
        downloadPDF(mergedBlob, `Dossier-${clientName}-${date}.pdf`);
      } else {
        for (let i = 0; i < completedDocs.length; i++) {
          const doc = completedDocs[i];
          setProgressLabel(`Export: ${doc.name}…`);
          setProgress(Math.round(10 + ((i + 1) / completedDocs.length) * 80));
          const blob = await generatePDF(doc);
          downloadPDF(blob, `${doc.name}.pdf`);
          await new Promise(r => setTimeout(r, 200));
        }
      }
      setProgress(100);
      setProgressLabel('Téléchargement démarré!');
      setTimeout(() => { setStatus('idle'); setProgress(0); }, 2000);
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Erreur de génération PDF');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedDocs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-xl p-0 md:p-4">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        className="relative w-full md:max-w-xl max-h-[92vh] bg-slate-950 md:rounded-3xl rounded-t-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center">
              <Cloud size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Export du dossier</h3>
              <p className="text-slate-500 text-xs">{completedDocs.length} document(s) prêt(s)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-900/20 border border-green-500/20 rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-green-400">{completedDocs.length}</div>
              <div className="text-green-600 text-xs font-medium mt-0.5">Complétés</div>
            </div>
            <div className="bg-amber-900/20 border border-amber-500/20 rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-amber-400">{skippedDocs.length}</div>
              <div className="text-amber-600 text-xs font-medium mt-0.5">Passés</div>
            </div>
            <div className="bg-slate-900/40 dark:bg-white/5 backdrop-blur-md border border-slate-700/50 dark:border-white/20 rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-slate-400">{pendingDocs.length}</div>
              <div className="text-slate-600 text-xs font-medium mt-0.5">En attente</div>
            </div>
          </div>

          {/* Staple mode */}
          <div>
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <Paperclip size={12} />
              Mode d'agrafage
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {([
                { mode: 'auto', label: 'Auto', icon: '🤖', desc: 'PDF unique trié' },
                { mode: 'manual', label: 'Manuel', icon: '✍️', desc: 'Je choisis l\'ordre' },
                { mode: 'none', label: 'Séparé', icon: '📄', desc: 'Un PDF par doc' },
              ] as const).map(({ mode, label, icon, desc }) => (
                <button
                  key={mode}
                  onClick={() => setStapleMode(mode)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all text-center",
                    stapleMode === mode
                      ? "bg-blue-900/30 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                      : "bg-white/4 border-white/8 hover:bg-white/8"
                  )}
                >
                  <span className="text-xl">{icon}</span>
                  <span className={cn("font-bold text-xs", stapleMode === mode ? "text-blue-300" : "text-white/70")}>{label}</span>
                  <span className="text-slate-600 text-[10px]">{desc}</span>
                  {stapleMode === mode && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Drive folder structure preview */}
          <div>
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <FolderOpen size={12} />
              Structure Drive
            </h4>
            <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4 font-mono text-xs space-y-1.5">
              <div className="text-blue-400 font-bold flex items-center gap-2">
                <FolderOpen size={14} />
                {`DocScan Pro - ${clientName || 'Client'} - ${new Date().toLocaleDateString('fr-FR')}`}
              </div>
              {stapleMode !== 'none' && (
                <div className="ml-4 text-amber-400 flex items-center gap-1.5">
                  <Paperclip size={11} />
                  📎 Dossier complet agrafe.pdf
                </div>
              )}
              {[...new Set(completedDocs.map(d => d.category))].map(cat => (
                <div key={cat}>
                  <div className="ml-4 text-slate-400 flex items-center gap-1.5">
                    <FolderOpen size={11} />
                    {cat}/
                  </div>
                  {completedDocs.filter(d => d.category === cat).map(doc => (
                    <div key={doc.id} className="ml-8 text-slate-500 flex items-center gap-1.5">
                      <FileText size={10} />
                      {doc.icon} {doc.name}.pdf
                      <span className="text-slate-700">({doc.pages.length}p)</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Document list with expand */}
          <div>
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Documents inclus</h4>
            <div className="space-y-2">
              {completedDocs.map(doc => (
                <div key={doc.id} className="bg-green-900/10 border border-green-500/15 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggleExpand(doc.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-green-900/20 transition-colors"
                  >
                    <span className="text-xl">{doc.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="text-white/90 text-sm font-medium">{doc.name}</p>
                      <p className="text-green-500 text-xs">{doc.pages.length} page(s)</p>
                    </div>
                    <Check size={14} className="text-green-400 shrink-0" />
                    {expandedDocs.has(doc.id) ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                  </button>
                  <AnimatePresence>
                    {expandedDocs.has(doc.id) && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-green-500/10"
                      >
                        <div className="flex gap-2 p-3 overflow-x-auto">
                          {doc.pages.map((page, i) => (
                            <div key={page.id} className="relative w-14 h-20 rounded-xl overflow-hidden bg-slate-900/40 dark:bg-white/5 backdrop-blur-md border border-slate-700/50 dark:border-white/20 shrink-0">
                              <div className="absolute inset-0 flex items-center justify-center text-2xl">{doc.icon}</div>
                              <div className="absolute bottom-0.5 left-0 right-0 text-center text-[9px] text-white/50">{i + 1}</div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {pendingDocs.length > 0 && (
                <div className="bg-slate-900/30 border border-slate-700/30 rounded-2xl p-3">
                  <p className="text-slate-600 text-xs font-medium mb-2 flex items-center gap-1.5">
                    <AlertTriangle size={11} />
                    Documents non scannés ({pendingDocs.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {pendingDocs.map(doc => (
                      <span key={doc.id} className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                        {doc.icon} {doc.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <AnimatePresence>
            {(status === 'generating' || status === 'uploading') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-slate-500 text-xs text-center">{progressLabel}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-900/20 border border-green-500/30 rounded-2xl p-4 text-center"
              >
                <Check size={28} className="text-green-400 mx-auto mb-2" />
                <p className="text-green-300 font-bold mb-1">Dossier envoyé avec succès!</p>
                <p className="text-green-600 text-xs mb-3">Organisé et agrafé dans votre Google Drive</p>
                {folderUrl && (
                  <a
                    href={folderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink size={14} />
                    Ouvrir dans Drive
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {status === 'error' && error && (
            <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-3 flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="p-5 border-t border-white/5 shrink-0 space-y-3">
          {/* Google Drive */}
          {!isAuthenticated ? (
            <button
              onClick={handleGoogleAuth}
              disabled={completedDocs.length === 0 || status !== 'idle'}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all",
                completedDocs.length > 0 && status === 'idle'
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:scale-[1.02]"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              )}
            >
              {status === 'generating' ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6.28 3h11.44L22 11 12 21 2 11l4.28-8z" fill="#4285F4" opacity="0.8"/>
                  <path d="M2 11l10 10 10-10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                </svg>
              )}
              Connecter Google Drive
            </button>
          ) : (
            <button
              onClick={handleExport}
              disabled={completedDocs.length === 0 || status !== 'idle'}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all",
                completedDocs.length > 0 && status === 'idle'
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:scale-[1.02]"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              )}
            >
              {status === 'uploading' || status === 'generating' ? (
                <><Loader2 size={20} className="animate-spin" />Envoi en cours… {progress}%</>
              ) : (
                <><Upload size={20} />Envoyer sur Google Drive</>
              )}
            </button>
          )}

          {/* Local download */}
          <button
            onClick={handleLocalDownload}
            disabled={completedDocs.length === 0 || (status !== 'idle' && status !== 'error')}
            className={cn(
              "w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all border",
              completedDocs.length > 0
                ? "bg-white/5 hover:bg-white/10 text-white/70 border-white/10 hover:border-white/20"
                : "bg-white/3 text-white/20 cursor-not-allowed border-white/5"
            )}
          >
            <Download size={16} />
            Télécharger en local
          </button>
        </div>
      </motion.div>
    </div>
  );
}
