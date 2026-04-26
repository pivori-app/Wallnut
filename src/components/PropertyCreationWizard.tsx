import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdvancedPropertyForm } from './AdvancedPropertyForm';
import { PropertyDocumentsStep } from './PropertyDocumentsStep';
import { PropertySynthesisStep } from './PropertySynthesisStep';

interface PropertyCreationWizardProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function PropertyCreationWizard({ onComplete, onCancel }: PropertyCreationWizardProps) {
  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [documentsData, setDocumentsData] = useState<any>(null);

  const handleDetailsSave = (data: any) => {
    setPropertyData(data);
    setStep(2);
  };

  const handleDocumentsComplete = (documents: any) => {
    setDocumentsData(documents);
    setStep(3);
  };

  const handleSynthesisComplete = () => {
    onComplete({ ...propertyData, documents: documentsData });
  };

  return (
    <div className="w-full">
      {/* Stepper Header */}
      <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-primary text-white' : 'bg-white/50 text-primary/40 text-primary'}`}>1</div>
          <span className={`font-bold hidden sm:inline ${step >= 1 ? 'text-primary' : 'text-primary/40'}`}>Informations Propriété</span>
        </div>
        <div className={`h-px w-8 sm:w-16 ${step >= 2 ? 'bg-primary' : 'bg-black/10'}`} />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-primary text-white' : 'bg-white/50 text-primary/40 text-primary'}`}>2</div>
          <span className={`font-bold hidden sm:inline ${step >= 2 ? 'text-primary' : 'text-primary/40'}`}>Documents & Validation</span>
        </div>
        <div className={`h-px w-8 sm:w-16 ${step >= 3 ? 'bg-primary' : 'bg-black/10'}`} />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-primary text-white' : 'bg-white/50 text-primary/40 text-primary'}`}>3</div>
          <span className={`font-bold hidden sm:inline ${step >= 3 ? 'text-primary' : 'text-primary/40'}`}>Synthèse & Déploiement</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <AdvancedPropertyForm 
              onSave={handleDetailsSave}
              onSaveAndAddAnother={() => {}}
              onCancel={onCancel}
              isWizardStep={true}
            />
          )}
          {step === 2 && (
            <PropertyDocumentsStep 
              propertyData={propertyData}
              onBack={() => setStep(1)}
              onComplete={handleDocumentsComplete}
            />
          )}
          {step === 3 && (
            <PropertySynthesisStep 
              propertyData={propertyData}
              documents={documentsData}
              onBack={() => setStep(2)}
              onComplete={handleSynthesisComplete}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
