import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Camera } from 'lucide-react';
import { PropertyCard, PropertyData } from '../../components/PropertyCard';
import { PropertyType } from '../../constants/property';
import { PropertyCreationWizard } from '../../components/PropertyCreationWizard';
import { SmartScannerPro } from '../../components/SmartScannerPro';
import { motion, AnimatePresence } from 'motion/react';

export function ParticulierDashboard() {
  const { profile } = useAuth();
  
  // Simulated properties state
  const [properties, setProperties] = useState<PropertyData[]>([
    {
      id: 'demo-1',
      type: 'Maison',
      address: 'En attente détaillée',
      city: 'Lyon',
      estimatedValue: 450000,
      status: 'documents_pending',
      isComplete: false,
      createdAt: new Date()
    }
  ]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleCreateProperty = (data: any) => {
    const newProp: PropertyData = {
      id: Math.random().toString(),
      type: data.type,
      address: 'Nouvelle adresse',
      city: 'Ville',
      estimatedValue: 0,
      status: 'documents_pending', // Changed to documents_pending as they need to upload now
      isComplete: false, 
      createdAt: new Date()
    };
    setProperties([newProp, ...properties]);
    setShowNewForm(false);
  };

  const handleSaveAndAddAnother = (data: any) => {
    const newProp: PropertyData = {
      id: Math.random().toString(),
      type: data.type,
      address: 'Nouvelle adresse',
      city: 'Ville',
      estimatedValue: 0,
      status: 'documents_pending',
      isComplete: false, 
      createdAt: new Date()
    };
    setProperties([newProp, ...properties]);
    // Keeps form open
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Espace Particulier</h1>
          <p className="text-neutral-dark/60">Gérez vos biens immobiliers et naviguez vers votre liquidité.</p>
        </div>
        {!showNewForm && (
          <div className="flex items-center gap-3 self-start sm:self-center">
            <button 
              onClick={() => setShowScanner(true)}
              className="px-4 py-3 rounded-xl bg-neutral-800 text-white font-bold flex items-center gap-2 hover:bg-neutral-700 transition-all shadow-md"
            >
              <Camera size={18} /> <span className="hidden sm:inline">Scanner Document</span>
            </button>
            <button 
              onClick={() => setShowNewForm(true)}
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold flex items-center gap-2 hover:scale-105 transition-all"
            >
              Nouveau Bien <Plus size={20} />
            </button>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {showNewForm ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl mx-auto"
          >
            <PropertyCreationWizard 
              onComplete={(data) => {
                handleCreateProperty(data);
                setShowNewForm(false);
              }} 
              onCancel={() => setShowNewForm(false)} 
            />
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

      <AnimatePresence>
        {showScanner && (
          <SmartScannerPro
            expectedDocType="Justificatif de domicile (Facture)"
            onComplete={(files) => {
              console.log("Files scanned:", files);
              setShowScanner(false);
            }}
            onCancel={() => setShowScanner(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
