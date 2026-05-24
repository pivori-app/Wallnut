import { z } from 'zod';
import type { PropertyType, PropertyStatus, AddressData, PropertyData } from '../types/property';

export const AddressSchema: z.ZodType<AddressData> = z.object({
  fullAddress: z.string().min(1, 'Adresse requise'),
  city: z.string().min(1, 'Ville requise'),
  postalCode: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const PropertySchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum({
    Maison: 'Maison',
    Appartement: 'Appartement',
    Terrain: 'Terrain',
    Commercial: 'Commercial',
    Autre: 'Autre',
  } as const satisfies Record<PropertyType, PropertyType>),
  address: AddressSchema,
  city: z.string(),
  estimatedValue: z.number().positive('La valeur doit être strictement positive'),
  status: z.enum(['documents_pending', 'validated', 'rejected', 'under_review'] as const satisfies PropertyStatus[]),
  isComplete: z.boolean(),
  createdAt: z.string().datetime('Date invalide'),
  surface: z.number().positive('La surface doit être strictement positive'),
  rooms: z.number().int().positive().optional(),
  condition: z.string().optional(),
  dpe: z.string().optional(),
  features: z.record(z.string(), z.unknown()).optional(),
});
