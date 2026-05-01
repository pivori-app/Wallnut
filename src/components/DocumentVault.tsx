import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, CheckCircle, AlertCircle, File, Info, X, Cloud } from 'lucide-react';
import { RequiredDocument } from '../constants/property';
import { cn } from '../lib/utils';

export interface DocumentVaultProps {
  documents: RequiredDocument[];
  uploadedFiles: Record<string, string>; // docId -> status ('validating', 'validated')
  onFileUpload: (docId: string, file: File) => void;
  onFileRemove: (docId: string) => void;
  onDriveSync?: (docId: string, fileUrl: string, fileName: string) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ documents, uploadedFiles, onFileUpload, onFileRemove, onDriveSync }) => {
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);
  const [activeDocForDrive, setActiveDocForDrive] = useState<string | null>(null);

  const handleOpenDrivePicker = (docId: string) => {
    setActiveDocForDrive(docId);
    setIsDrivePickerOpen(true);
  };

  const handleSimulateDriveSelect = (fileName: string) => {
    if (activeDocForDrive && onDriveSync) {
      onDriveSync(activeDocForDrive, `https://drive.google.com/file/d/mockId/view`, fileName);
    }
    setIsDrivePickerOpen(false);
    setActiveDocForDrive(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
           <h3 className="text-xl font-bold font-display text-primary">Pièces Jointes</h3>
           <p className="text-sm text-neutral-dark/60">Gérez les documents requis pour cette procédure.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <DocumentSlot 
            key={doc.id}
            document={doc}
            status={uploadedFiles[doc.id]}
            onUpload={(file) => onFileUpload(doc.id, file)}
            onRemove={() => onFileRemove(doc.id)}
            onOpenDrive={() => handleOpenDrivePicker(doc.id)}
          />
        ))}
      </div>

      {/* Google Drive Mocked Picker Modal */}
      <AnimatePresence>
        {isDrivePickerOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrivePickerOpen(false)} className="absolute inset-0 bg-primary/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
               <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white w-full">
                  <div className="flex items-center gap-3">
                    <Cloud className="text-[#4285F4] w-8 h-8" />
                    <div>
                      <h2 className="text-xl font-bold text-primary">Google Drive</h2>
                      <p className="text-xs font-medium text-neutral-dark/60">Sélectionnez un fichier pour l'import</p>
                    </div>
                  </div>
                  <button onClick={() => setIsDrivePickerOpen(false)} className="p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
               </div>
               <div className="p-6 overflow-y-auto w-full flex-1 space-y-2 bg-slate-50">
                  {['Titre_de_propriete.pdf', 'CNI_M_Dupont.pdf', 'DPE_14Avenue.pdf', 'Mandat_Exclusif_Signé.pdf'].map((fileName, idx) => (
                    <div key={idx} onClick={() => handleSimulateDriveSelect(fileName)} className="p-4 bg-white border border-black/5 rounded-xl flex items-center gap-4 cursor-pointer hover:border-[#4285F4]/30 hover:bg-[#4285F4]/5 transition-colors group">
                       <File className="text-neutral-dark/40 group-hover:text-[#4285F4]" size={20} />
                       <span className="font-medium text-primary text-sm flex-1">{fileName}</span>
                       <span className="text-xs text-neutral-dark/40 group-hover:text-[#4285F4]/70">Sélectionner</span>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export interface DocumentSlotProps {
  document: RequiredDocument;
  status?: string; // undefined means missing
  onUpload: (file: File) => void;
  onRemove: () => void;
  onOpenDrive: () => void;
}

export const DocumentSlot: React.FC<DocumentSlotProps> = ({ document, status, onUpload, onRemove, onOpenDrive }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  // @ts-ignore
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop as any,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  const getStatusConfig = () => {
    if (status === 'validated') {
      return {
        icon: CheckCircle,
        color: 'text-success',
        bg: 'bg-success/10 text-success border-success/20',
        label: 'Validé'
      };
    }
    if (status === 'validating') {
      return {
        icon: AlertCircle,
        color: 'text-warning',
        bg: 'bg-warning/10 text-warning border-warning/20',
        label: 'En analyse'
      };
    }
    return {
      icon: File,
      color: document.isMandatory ? 'text-[#ff4444]' : 'text-neutral-dark/40',
      bg: document.isMandatory ? 'bg-[#ff4444]/5 text-[#ff4444] border-[#ff4444]/20 border-dashed' : 'bg-black/5 text-neutral-dark/60 border-black/10 border-dashed',
      label: document.isMandatory ? 'Manquant (Requis)' : 'Facultatif'
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="relative group perspective-1000">
      <div 
        {...getRootProps()} 
        className={cn(
          "relative h-[220px] glass rounded-3xl p-6 border-2 transition-all duration-300 transform-style-3d cursor-pointer flex flex-col justify-between overflow-hidden",
          config.bg,
          isDragActive ? "scale-[1.02] border-secondary bg-secondary/5" : "hover:border-primary/20",
          status === 'validated' && "cursor-default border-solid"
        )}
      >
        <input {...getInputProps()} disabled={status === 'validated' || status === 'validating'} />
        
        {/* Drag Overlay (Intense Blur) */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 backdrop-blur-md bg-white/40 flex flex-col items-center justify-center border-4 border-secondary border-dashed rounded-3xl"
            >
              <UploadCloud className="w-12 h-12 text-secondary mb-2 animate-bounce" />
              <p className="font-bold text-primary">Déposer ici</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-start z-10 relative">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/50 shadow-sm", config.color)}>
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-primary text-sm flex items-center gap-2 line-clamp-1 break-all" title={document.name}>
                {document.name}
              </h3>
              <p className={cn("text-xs font-bold mt-1", config.color)}>{config.label}</p>
            </div>
          </div>
          
          {/* Tooltip implementation */}
          <div className="relative flex shrink-0 group/tooltip z-[60]">
            <Info size={16} className="text-primary/40 hover:text-primary cursor-help pointer-events-auto" onClick={(e) => e.stopPropagation()} />
            <div className="absolute right-0 top-full mt-2 w-48 p-3 rounded-xl bg-primary text-white text-xs opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl">
              {document.description}
              <div className="absolute bottom-full right-1 w-2 h-2 bg-primary rotate-45 -mb-1"></div>
            </div>
          </div>
        </div>

        <div className="z-10 relative mt-4">
          {!status ? (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-center justify-center py-3 rounded-xl border border-dashed border-current/20 bg-white/20">
                <UploadCloud className="w-5 h-5 opacity-40 mb-1" />
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Depuis l'ordinateur</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onOpenDrive(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-all text-xs font-bold hover:bg-[#4285F4]/5 pointer-events-auto"
              >
                <Cloud className="w-4 h-4 text-[#4285F4]" /> <span className="opacity-80">Google Drive</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/60">
              <span className="text-xs font-medium truncate">Document validé</span>
              {status === 'validating' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemove(); }}
                  className="p-1 hover:bg-black/10 rounded-full transition-colors pointer-events-auto"
                >
                  <X size={14} className="opacity-60" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
