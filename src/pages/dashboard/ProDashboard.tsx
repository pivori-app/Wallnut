import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus } from 'lucide-react';
import { PropertyCard, PropertyData } from '../../components/PropertyCard';
import { DocumentVault } from '../../components/DocumentVault';
import { getRequiredDocuments, PropertyType, PROPERTY_TYPES } from '../../constants/property';
import { motion, AnimatePresence } from 'motion/react';

export function ProDashboard() {
  const { profile } = useAuth();
  
  // Simulated properties state
  const [properties, setProperties] = useState<PropertyData[]>([
    {
      id: 'pro-demo-1',
      type: 'Immeuble',
      address: '45 Avenue de la République',
      city: 'Paris',
      estimatedValue: 2400000,
      status: 'analysis',
      isComplete: true,
      createdAt: new Date()
    }
  ]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [newPropType, setNewPropType] = useState<PropertyType>('Immeuble');
  
  // For the demo form
  const requiredDocs = getRequiredDocuments(newPropType, true); // isPro = true
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  const handleFileUpload = (docId: string, file: File) => {
    // Simulate upload process
    setUploadedFiles(prev => ({ ...prev, [docId]: 'validating' }));
    setTimeout(() => {
      setUploadedFiles(prev => ({ ...prev, [docId]: 'validated' }));
    }, 2000);
  };

  const handleFileRemove = (docId: string) => {
    setUploadedFiles(prev => {
      const copy = { ...prev };
      delete copy[docId];
      return copy;
    });
  };

  const isFormComplete = requiredDocs.every(doc => !doc.isMandatory || uploadedFiles[doc.id] === 'validated');

  const handleCreateProperty = () => {
    const newProp: PropertyData = {
      id: Math.random().toString(),
      type: newPropType,
      address: 'Nouveau mandat',
      city: 'Ville',
      estimatedValue: 0,
      status: 'analysis',
      isComplete: true, // Just for demo
      createdAt: new Date()
    };
    setProperties([newProp, ...properties]);
    setShowNewForm(false);
    setUploadedFiles({});
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Espace Professionnel</h1>
          <p className="text-neutral-dark/60">Gérez les dossiers de vos clients en toute simplicité.</p>
        </div>
        {!showNewForm && (
          <button 
            onClick={() => setShowNewForm(true)}
            className="px-6 py-3 rounded-xl bg-primary text-white font-bold flex items-center gap-2 hover:scale-105 transition-all self-start sm:self-center"
          >
            Nouveau Dossier <Plus size={20} />
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {showNewForm ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="glass p-8 rounded-3xl space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">1. Définir le type d'actif</h2>
                <button onClick={() => setShowNewForm(false)} className="text-sm font-bold opacity-60 hover:opacity-100">Annuler</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {PROPERTY_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setNewPropType(type)}
                    className={`p-4 rounded-2xl text-sm font-bold transition-all border ${newPropType === type ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-white/40 border-black/5 hover:border-primary/20 text-primary'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold">2. Dépôt Technique ("Smart Drop")</h2>
                <p className="text-sm text-neutral-dark/60 mt-1">Fournissez les pièces requises pour structurer le financement.</p>
              </div>
              
              <DocumentVault 
                documents={requiredDocs} 
                uploadedFiles={uploadedFiles}
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
              />
            </div>

            <div className="flex justify-end pt-8">
              <button 
                disabled={!isFormComplete}
                onClick={handleCreateProperty}
                className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all ${isFormComplete ? 'bg-secondary text-primary hover:scale-105' : 'bg-black/5 opacity-50 cursor-not-allowed'}`}
              >
                Soumettre le dossier
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {properties.map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
