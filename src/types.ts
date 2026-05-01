
export type UserRole = 'particulier' | 'professionnel' | 'institution' | 'gestionnaire';

export type ProfessionalSubRole = 
  | 'agent_immobilier' 
  | 'cgp' 
  | 'notaire' 
  | 'courtier' 
  | 'avocat' 
  | 'diagnostiqueur' 
  | 'architecte'
  | 'autre';

// Property Data Schema
export interface PropertyDataSchema {
  id: string; // The property ID
  userId: string; // Links back to UserProfile.id
  type: string;
  address: string;
  city: string;
  estimatedValue: number;
  status: 'draft' | 'documents_pending' | 'analysis' | 'validated' | 'rejected';
  isComplete: boolean;
  createdAt: any;
  referenceNumber?: string;
}

// Document Data Schema
export interface PropertyDocument {
  id: string; // Internal system UUID for the document
  propertyId: string; // Lier les documents à l'ID du Bien
  userId: string; // Et à l'Utilisateur
  documentType: string; // e.g., 'acte_propriete', 'dpe'
  status: 'validating' | 'validated' | 'rejected';
  fileUrl: string;
  uploadedAt: any;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  city?: string;
  photoURL?: string;
  createdAt: any;
  
  // Professional specific fields
  professionalData?: {
    proId?: string; // Wallnut Professional ID
    subRole: ProfessionalSubRole;
    customSubRole?: string;
    companyName: string;
    siret: string;
    professionalCard?: string; // Card T/G or ORIAS
    address: string;
    isValidated: boolean;
  };
  
  // Base fields for easier access/compatibility
  isPro: boolean;
}
