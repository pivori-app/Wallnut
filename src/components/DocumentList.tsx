import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Clock, ChevronRight, SkipForward, AlertTriangle, Camera, Lock, ChevronLeft } from 'lucide-react';
import { DocumentItem, ClientType } from '../types';
import { cn } from '../utils/cn';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  documents: DocumentItem[];
  clientType: ClientType;
  currentIndex: number;
  onSelectDocument: (index: number) => void;
  onSkip: (index: number) => void;
}

const statusConfig = {
  pending: { bg: 'bg-white/10', border: 'border-white/10', label: 'En attente', icon: Clock, color: 'text-white/40' },
  scanning: { bg: 'bg-secondary/10', border: 'border-secondary/30', label: 'En cours', icon: Camera, color: 'text-secondary' },
  completed: { bg: 'bg-green-500/10', border: 'border-green-500/30', label: 'Complété', icon: Check, color: 'text-green-400' },
  skipped: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Ignoré', icon: SkipForward, color: 'text-amber-400' },
  error: { bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Erreur', icon: AlertTriangle, color: 'text-red-400' },
};

export function DocumentList({ documents, clientType, currentIndex, onSelectDocument, onSkip }: Props) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const completed = documents.filter(d => d.status === 'completed').length;
  const total = documents.length;
  const required = documents.filter(d => d.required).length;
  const completedRequired = documents.filter(d => d.required && d.status === 'completed').length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  // Group by category
  const categories = [...new Set(documents.map(d => d.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-dark">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary-dark/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-start justify-between mb-3 gap-2">
            <div>
              <button 
                onClick={() => navigate(profile?.isPro ? '/dashboard/pro' : '/dashboard/particulier')}
                className="mb-3 flex items-center gap-1.5 px-3 py-1.5 text-white/50 hover:text-white rounded-full bg-white/10 hover:bg-white/10 transition-colors text-xs font-bold border border-white/10"
              >
                <ChevronLeft size={16} /> Retour à l'application
              </button>
              <h2 className="text-white font-bold text-lg">
                {clientType === 'particulier' ? '👤 Dossier Particulier' : '🏢 Dossier Professionnel'}
              </h2>
              <p className="text-white/60 text-sm">
                {completed}/{total} documents · {completedRequired}/{required} obligatoires
              </p>
            </div>
            <div className="text-right mt-10">
              <span className="text-2xl font-black text-white">{Math.round(progress)}%</span>
              <p className="text-white/40 text-xs">complété</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-secondary rounded-full shadow-[0_0_10px_rgba(199,154,46,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Document groups */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-32">
        {categories.map(category => {
          const catDocs = documents.filter(d => d.category === category);
          return (
            <div key={category}>
              <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="flex-1 h-px bg-white/10" />
                {category}
                <span className="flex-1 h-px bg-white/10" />
              </h3>
              <div className="space-y-3">
                {catDocs.map((doc) => {
                  const docIndex = documents.indexOf(doc);
                  const isCurrent = docIndex === currentIndex;
                  const config = statusConfig[doc.status];
                  const StatusIcon = config.icon;

                  return (
                    <motion.div
                      key={doc.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "relative rounded-2xl border p-4 transition-all cursor-pointer backdrop-blur-xl",
                        config.bg, config.border,
                        isCurrent && "ring-2 ring-secondary/50 shadow-[0_0_30px_rgba(199,154,46,0.15)] bg-secondary/5 border-secondary/30"
                      )}
                      onClick={() => doc.status !== 'completed' && onSelectDocument(docIndex)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 relative",
                          doc.status === 'completed' ? 'bg-green-500/20 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]' :
                          isCurrent ? 'bg-secondary/20 border border-secondary/40 shadow-[0_0_15px_rgba(199,154,46,0.2)]' :
                          'bg-white/10 border border-white/10 opacity-70'
                        )}>
                          {doc.icon}
                          {doc.status === 'completed' && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <Check size={11} className="text-white" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className={cn(
                              "font-bold text-sm truncate",
                              doc.status === 'completed' ? 'text-green-300' :
                              isCurrent ? 'text-secondary' :
                              'text-white'
                            )}>
                              {doc.name}
                            </h4>
                            {doc.required && (
                              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-red-400 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded-full">
                                Obligatoire
                              </span>
                            )}
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-300 text-xs truncate">{doc.description}</p>

                          {/* Status bar */}
                          <div className="flex items-center gap-2 mt-2">
                            <StatusIcon size={12} className={config.color} />
                            <span className={cn("text-xs font-medium", config.color)}>
                              {doc.status === 'completed' ? `${doc.pages.length} page(s) scannée(s)` : config.label}
                            </span>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="shrink-0 flex flex-col items-center gap-2">
                          {doc.status === 'completed' ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); onSelectDocument(docIndex); }}
                              className="p-2 rounded-xl bg-green-900/30 text-green-400 hover:bg-green-800/30 transition-colors"
                            >
                              <Camera size={16} />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); onSelectDocument(docIndex); }}
                                className={cn(
                                  "p-2 rounded-xl transition-colors",
                                  isCurrent
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                )}
                              >
                                <Camera size={16} />
                              </button>
                              {!doc.required && doc.status === 'pending' && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onSkip(docIndex); }}
                                  className="p-1.5 rounded-lg bg-amber-900/20 text-amber-500/60 hover:text-amber-400 hover:bg-amber-900/30 transition-colors"
                                  title="Passer ce document"
                                >
                                  <SkipForward size={13} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Current indicator */}
                      {isCurrent && (
                        <motion.div
                          layoutId="current-indicator"
                          className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-full"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
