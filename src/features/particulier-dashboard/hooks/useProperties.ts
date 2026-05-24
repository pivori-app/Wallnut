import { useState, useEffect, useCallback } from 'react';
import type { PropertyData } from '../types/property';
import { propertyService, PropertyServiceError } from '../services/propertyService';

export interface UsePropertiesReturn {
  properties: PropertyData[];
  isLoading: boolean;
  error: PropertyServiceError | null;
  refetch: () => Promise<void>;
  createProperty: (data: Partial<PropertyData>) => Promise<void>;
  updateProperty: (id: string, updates: Partial<PropertyData>) => void;
  isCreating: boolean;
}

export function useProperties(): UsePropertiesReturn {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PropertyServiceError | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (err) {
      if (err instanceof PropertyServiceError) {
        setError(err);
        // Fallback démo sécurisé (à supprimer en production)
        console.warn('🔌 API non connectée. Mode démo activé.');
        setProperties([]);
      } else {
        setError(new PropertyServiceError('Erreur réseau inattendue', 'NETWORK_ERROR'));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const createProperty = useCallback(async (data: Partial<PropertyData>) => {
    try {
      setIsCreating(true);
      const newProp = await propertyService.create(data);
      setProperties(prev => [newProp, ...prev]);
    } catch (err) {
      const e = err instanceof PropertyServiceError ? err : new PropertyServiceError('Échec de la création', 'CREATE_FAILED');
      setError(e);
      throw e;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateProperty = useCallback((id: string, updates: Partial<PropertyData>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  return { properties, isLoading, error, refetch: fetchProperties, createProperty, updateProperty, isCreating };
}
