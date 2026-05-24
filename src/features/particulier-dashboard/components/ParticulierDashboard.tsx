import React, { useState, useCallback } from 'react';
import { Camera, Plus, AlertCircle, RefreshCw, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { PropertyData } from '../types/property';
import { useProperties } from '../hooks/useProperties';
import { PropertyCard } from './PropertyCard';
import { PropertyCreationWizard } from '../../../components/PropertyCreationWizard';
import { SmartScannerPro } from '../../../components/SmartScannerPro';
import { ScannerHandoffModal } from '../../../components/ScannerHandoffModal';
import { PropertyDetailsView } from '../../../components/PropertyDetailsView';
import { isMobile } from 'react-device-detect';

export function ParticulierDashboard() {
  const { properties, isLoading, error, refetch, createProperty, isCreating } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [modals, setModals] = useState({
    wizard: false,
    scanner: false,
    handoff: false,
  });

  const openModal = useCallback((key: keyof typeof modals) => setModals(prev => ({ ...prev, [key]: true })), []);
  const closeModal = useCallback((key: keyof typeof modals) => setModals(prev => ({ ...prev, [key]: false })), []);

  const handleCreate = useCallback(async (data: Partial<PropertyData>) => {
    try {
      await createProperty(data);
      closeModal('wizard');
    } catch (err) {
      // Gestion centralisée des erreurs via toast ou alerte institutionnelle
      console.error('❌ Échec création bien:', err);
    }
  }, [createProperty, closeModal]);

  const handleStartScanner = useCallback(() => {
    if (isMobile) openModal('scanner');
    else openModal('handoff');
  }, [openModal]);

  // Vue détaillée externalisée
  if (selectedProperty) {
    return <PropertyDetailsView property={selectedProperty as any} onBack={() => setSelectedProperty(null)} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Espace Particulier</h1>
          <p className="text-sm text-gray-500 mt-1">Tableau de bord institutionnel - Indicateurs de décision</p>
        </div>
        {!modals.wizard && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartScanner}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-2 transition-colors"
            >
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Smart Scanner</span>
            </button>
            <button
              onClick={() => openModal('wizard')}
              disabled={isCreating}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              Nouveau Bien
            </button>
          </div>
        )}
      </header>

      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => <div key={i} className="h-96 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <h3 className="text-lg font-semibold text-red-800">Échec du chargement</h3>
          <p className="text-sm text-red-600 mt-1">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <RefreshCw className="h-4 w-4" /> Réessayer
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {properties.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
                <Building2 className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Aucun bien enregistré</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">Commencez par ajouter votre premier bien immobilier.</p>
                <button
                  onClick={() => openModal('wizard')}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  <Plus className="h-4 w-4" /> Ajouter un bien
                </button>
              </div>
            ) : (
              properties.map(prop => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onClick={() => setSelectedProperty(prop)}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {modals.wizard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal('wizard')}
          >
            <div className="w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <PropertyCreationWizard
                onComplete={handleCreate as any}
                onCancel={() => closeModal('wizard')}
              />
            </div>
          </motion.div>
        )}
        {modals.scanner && (
           <SmartScannerPro
             expectedDocType="Justificatif de domicile (Facture)"
             onComplete={() => closeModal('scanner')}
             onCancel={() => closeModal('scanner')}
           />
        )}
        {modals.handoff && (
          <ScannerHandoffModal
            onLocalScanner={() => { closeModal('handoff'); openModal('scanner'); }}
            onCancel={() => closeModal('handoff')}
            onSuccess={() => closeModal('handoff')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
