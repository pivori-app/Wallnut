export type PropertyType = 'Maison' | 'Appartement' | 'Terrain' | 'Commercial' | 'Autre' | 'Immeuble' | 'Immeuble de rapport' | 'Local commercial' | 'Local d\'activité' | 'Bureaux' | 'Entrepôt / Local industriel' | 'Murs' | 'Fonds de commerce' | 'Entreprise' | 'Terrain de loisirs' | 'Domaine forestier' | 'Bois de chasse' | 'Territoire de chasse' | 'Etang' | 'Villa' | 'Manoir' | 'Château' | 'Moulin' | 'Péniche' | string;
export type PropertyStatus = 'draft' | 'documents_pending' | 'analysis' | 'validated' | 'rejected' | 'under_review';

export interface AddressData {
  fullAddress: string;
  city: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
}

export interface PropertyData {
  id: string;
  type: PropertyType;
  address: any; // Allow AddressData or string for compatibility
  city: string;
  estimatedValue: number;
  status: PropertyStatus;
  isComplete: boolean;
  createdAt: any;
  surface?: number | string;
  rooms?: number | string;
  condition?: string;
  dpe?: string;
  features?: any;
  referenceNumber?: string;
  pipelineStage?: string;
  completeness?: number;
  addressData?: any;
  clientName?: string;
  clientPhone?: string;
  lastContacted?: any;
}
