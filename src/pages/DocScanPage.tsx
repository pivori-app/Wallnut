import React, { useState } from 'react';
import { ClientTypeSelector } from '../components/ClientTypeSelector';
import { DocumentList } from '../components/DocumentList';
import { SmartScanner } from '../components/SmartScanner';
import { DriveExport } from '../components/DriveExport';
import { QRHandoff } from '../components/QRHandoff';
import { buildDocumentList } from '../data/mockDocuments';
import { DocumentItem, ClientType } from '../types';
import { Bot, RefreshCw } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export function DocScanPage() {
  const [clientType, setClientType] = useState<ClientType | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [showQRHandoff, setShowQRHandoff] = useState(false);

  const handleSelectType = (type: ClientType) => {
    setClientType(type);
    setDocuments(buildDocumentList(type));
    setCurrentIndex(0);
  };

  const handleScanComplete = (pages: any[]) => {
    if (currentIndex === null) return;
    
    setDocuments(prev => {
      const next = [...prev];
      next[currentIndex] = {
        ...next[currentIndex],
        status: 'completed',
        pages
      };
      return next;
    });

    if (currentIndex < documents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(null);
      setShowExport(true);
    }
  };

  const handleSkip = (index: number) => {
    setDocuments(prev => {
      const next = [...prev];
      next[index] = { ...next[index], status: 'skipped' };
      return next;
    });

    if (index < documents.length - 1) {
      setCurrentIndex(index + 1);
    } else {
      setCurrentIndex(null);
      setShowExport(true);
    }
  };

  // If no type selected, show selector
  if (!clientType) {
    return <ClientTypeSelector onSelect={handleSelectType} />;
  }

  const currentDoc = currentIndex !== null ? documents[currentIndex] : null;

  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        
        {/* Left Column: Document List */}
        <div className="w-full lg:w-[450px] shrink-0 h-full overflow-y-auto border-r border-slate-800/50 bg-slate-950">
          <DocumentList
            documents={documents}
            clientType={clientType}
            currentIndex={currentIndex ?? -1}
            onSelectDocument={(index) => setCurrentIndex(index)}
            onSkip={handleSkip}
          />
        </div>

        {/* Right Column: Scanner Area */}
        <div className="flex-1 relative h-full bg-slate-950 flex flex-col">
          {currentIndex !== null && currentDoc ? (
            <div className="flex-1 relative">
              <SmartScanner
                document={currentDoc}
                allDocuments={documents}
                currentIndex={currentIndex}
                totalCount={documents.length}
                onPagesCapture={(pages) => {
                  setDocuments(prev => {
                    const next = [...prev];
                    next[currentIndex] = { ...next[currentIndex], pages };
                    return next;
                  });
                }}
                onComplete={() => {
                  setDocuments(prev => {
                    const next = [...prev];
                    next[currentIndex] = { ...next[currentIndex], status: 'completed' };
                    return next;
                  });
                  if (currentIndex < documents.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                  } else {
                    setCurrentIndex(null);
                    setShowExport(true);
                  }
                }}
                onSkip={() => handleSkip(currentIndex)}
                onCancel={() => setCurrentIndex(null)}
                onSwitchToMobile={() => setShowQRHandoff(true)}
                onNavigate={(dir) => {
                  if (dir === 'prev' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
                  if (dir === 'next' && currentIndex < documents.length - 1) setCurrentIndex(currentIndex + 1);
                }}
              />
              
              {/* Floating mobile handoff button */}
              <button
                onClick={() => setShowQRHandoff(true)}
                className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl text-white font-medium hover:bg-slate-800 transition-colors shadow-lg"
              >
                <Bot size={18} className="text-blue-400" />
                Scanner avec le téléphone
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-primary-dark via-primary to-primary-dark">
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 rounded-3xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(199,154,46,0.2)]">
                  <span className="text-4xl text-secondary">🤖</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-3">Sélectionnez un document</h2>
                <p className="text-white/60 text-sm mb-8 leading-relaxed">
                  Cliquez sur un document dans la liste pour commencer la numérisation intelligente.
                </p>
                
                <button
                  onClick={() => setShowExport(true)}
                  disabled={documents.filter(d => d.status === 'completed').length === 0}
                  className="w-full py-4 rounded-xl bg-secondary text-white font-bold hover:bg-secondary/90 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(199,154,46,0.3)]"
                >
                  Finaliser et Exporter le dossier
                </button>
                
                <button
                  onClick={() => setClientType(null)}
                  className="mt-6 flex items-center justify-center gap-2 text-white/40 text-sm hover:text-white transition-colors w-full"
                >
                  <RefreshCw size={14} />
                  Changer de profil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showExport && (
          <DriveExport
            documents={documents}
            clientType={clientType}
            clientName="Jean Dupont"
            onClose={() => setShowExport(false)}
          />
        )}

        {showQRHandoff && currentDoc && (
          <QRHandoff
            sessionId={`session_${Date.now()}`}
            documentName={currentDoc.name}
            documentIcon={currentDoc.icon as string}
            onClose={() => setShowQRHandoff(false)}
            onDocumentReceived={(pages) => {
              handleScanComplete(pages);
              setShowQRHandoff(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
