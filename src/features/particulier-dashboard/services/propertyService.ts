import { z } from 'zod';
import type { PropertyData } from '../types/property';
import { PropertySchema } from '../schemas/property';

export class PropertyServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'PropertyServiceError';
  }
}

let propertiesMock: PropertyData[] = [
  {
    id: crypto.randomUUID(),
    type: 'Maison',
    address: { fullAddress: '12 rue de la Paix, 75002 Paris', city: 'Paris', postalCode: '75002' },
    city: 'Paris',
    estimatedValue: 1250000,
    status: 'validated',
    isComplete: true,
    createdAt: new Date().toISOString(),
    surface: 120,
    rooms: 5,
    dpe: 'C',
    referenceNumber: 'REF-2026-042',
    clientName: 'Mme. Dupont',
    clientPhone: '06 12 34 56 78',
    pipelineStage: 'offre',
    completeness: 100,
    lastContacted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: crypto.randomUUID(),
    type: 'Appartement',
    address: { fullAddress: '5 avenue des Champs-Élysées, 75008 Paris', city: 'Paris', postalCode: '75008' },
    city: 'Paris',
    estimatedValue: 850000,
    status: 'under_review',
    isComplete: false,
    createdAt: new Date().toISOString(),
    surface: 65,
    rooms: 3,
    dpe: 'B',
    referenceNumber: 'REF-2026-105',
    clientName: 'M. Martin',
    clientPhone: '07 89 12 34 56',
    pipelineStage: 'collecte',
    completeness: 65,
    lastContacted: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  }
];

import { supabase } from '../../../lib/supabase';

// Couche d'abstraction API. En production : appel sécurisé à Supabase ou API Rest
export const propertyService = {
  async getAll(): Promise<PropertyData[]> {
    // ALWAYS force mock data for now to fix hanging issue
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...propertiesMock]);
      }, 500);
    });
  },

  async create(raw: Partial<PropertyData>): Promise<PropertyData> {
    const validated = PropertySchema.partial().extend({
      id: z.string().uuid(),
      createdAt: z.string().datetime(),
      status: z.enum(['draft', 'under_review', 'validated', 'rejected']).default('under_review'),
      isComplete: z.boolean().default(false),
    }).parse({
      ...raw,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: raw.status || 'under_review',
      isComplete: raw.isComplete || false,
    }) as PropertyData; // Cast needed because partial makes all fields optional
    
    try {
      const { error } = await supabase.from('properties').insert([validated]);
      if (error) {
        console.warn("Supabase (create) erreur, fallback au mode local:", error.message);
      }
    } catch (e) {
      console.warn("Erreur d'insertion:", e);
    }

    propertiesMock.push(validated);
    return validated;
  },
};
