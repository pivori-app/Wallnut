import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, CheckCircle, AlertCircle, File, Info, X } from 'lucide-react';
import { RequiredDocument } from '../constants/property';
import { cn } from '../lib/utils';

export interface DocumentVaultProps {
  documents: RequiredDocument[];
  uploadedFiles: Record<string, string>; // docId -> status ('validating', 'validated')
  onFileUpload: (docId: string, file: File) => void;
  onFileRemove: (docId: string) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ documents, uploadedFiles, onFileUpload, onFileRemove }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <DocumentSlot 
          key={doc.id}
          document={doc}
          status={uploadedFiles[doc.id]}
          onUpload={(file) => onFileUpload(doc.id, file)}
          onRemove={() => onFileRemove(doc.id)}
        />
      ))}
    </div>
  );
};

export interface DocumentSlotProps {
  document: RequiredDocument;
  status?: string; // undefined means missing
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export const DocumentSlot: React.FC<DocumentSlotProps> = ({ document, status, onUpload, onRemove }) => {
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
          "relative h-[200px] glass rounded-3xl p-6 border-2 transition-all duration-300 transform-style-3d cursor-pointer flex flex-col justify-between overflow-hidden",
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
              <h3 className="font-bold text-primary text-sm flex items-center gap-2">
                {document.name}
              </h3>
              <p className={cn("text-xs font-bold mt-1", config.color)}>{config.label}</p>
            </div>
          </div>
          
          {/* Tooltip implementation */}
          <div className="relative group/tooltip">
            <Info size={16} className="text-primary/40 cursor-help" />
            <div className="absolute right-0 bottom-full mb-2 w-48 p-3 rounded-xl bg-primary text-white text-xs opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl z-[60]">
              {document.description}
              <div className="absolute top-full right-1 w-2 h-2 bg-primary rotate-45 -mt-1"></div>
            </div>
          </div>
        </div>

        <div className="z-10 relative mt-4">
          {!status ? (
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-current/20 bg-white/20">
              <UploadCloud className="w-6 h-6 opacity-40 mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Glisser-déposer</p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/60">
              <span className="text-xs font-medium truncate">Document envoyé</span>
              {status === 'validating' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemove(); }}
                  className="p-1 hover:bg-black/10 rounded-full transition-colors"
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
