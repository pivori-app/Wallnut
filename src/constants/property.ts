export const PROPERTY_TYPES = [
  'Appartement',
  'Bastide',
  'Bergerie',
  'Bois de chasse',
  'Bureaux',
  'Cave',
  'Cession de bail',
  'Chalet',
  'Chambre',
  'Château',
  'Corps de ferme',
  'Demeure',
  'Demeure Contemporaine',
  'Demeure de Prestige',
  'Domaine agricole',
  'Domaine forestier',
  'Dépendance',
  'Ecurie',
  'Entrepôt / Local industriel',
  'Entreprise',
  'Etang',
  'Exploitation Agricole',
  'Ferme',
  'Fermette',
  'Fonds de commerce',
  'Grange',
  'Grange aménagée',
  'Hameau',
  'Haras',
  'Hotel particulier',
  'Immeuble',
  'Immeuble de rapport',
  'Local commercial',
  "Local d'activité",
  'Loft',
  'Longère',
  'Lotissement',
  'Maison',
  'Maison bourgeoise',
  "Maison d'architecte",
  'Maison de gardien',
  'Maison de maître',
  'Maison de pays',
  'Maison de village',
  'Maison de ville',
  'Manoir',
  'Marina',
  'Mas',
  'Mobil Home',
  'Moulin',
  'Murs',
  'Parking / box',
  'Programme Neuf',
  'Propriété de chasse',
  'Propriété de loisirs',
  "Propriété d'agrément",
  'Propriété Equestre',
  'Péniche',
  'Riad',
  'Terrain',
  'Terrain de loisirs',
  'Territoire de chasse',
  'Villa'
] as const;

export type PropertyType = typeof PROPERTY_TYPES[number] | string; // We can allow string for custom/autocomplete fallback if it doesn't match perfectly, though it's better to keep it union, but I'll make it explicit.

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
}

export function getRequiredDocuments(propertyType: PropertyType, isPro: boolean): RequiredDocument[] {
  // Base documents common to all properties
  let docs: RequiredDocument[] = [];

  if (isPro) {
    docs.push(
      { id: 'mandat_vente', name: 'Mandat de vente', description: 'Mandat exclusif ou simple valide.', isMandatory: true },
      { id: 'fiche_technique', name: 'Fiche technique', description: 'Description détaillée du bien.', isMandatory: true },
    );
  } else {
    docs.push(
      { id: 'piece_identite', name: 'Pièce d\'identité', description: 'CNI ou Passeport en cours de validité.', isMandatory: true },
      { id: 'acte_propriete', name: 'Acte de Propriété', description: 'Copie complète de l\'acte authentique.', isMandatory: true },
      { id: 'taxe_fonciere', name: 'Taxe Foncière', description: 'Dernier avis d\'imposition de la taxe foncière.', isMandatory: true }
    );
  }

  // Type specific documents
  switch (propertyType) {
    case 'Appartement':
      docs.push({ id: 'dpe', name: 'DPE (Diagnostic)', description: 'Diagnostic de performance énergétique.', isMandatory: true });
      if (isPro) docs.push({ id: 'registre_copro', name: 'Registre Copropriété', description: 'Immatriculation au registre national.', isMandatory: true });
      break;
    case 'Immeuble':
    case 'Immeuble de rapport':
      docs.push(
        { id: 'plans', name: 'Plans complets', description: 'Plans de toutes les surfaces.', isMandatory: true },
        { id: 'etat_locatif', name: 'État Locatif', description: 'Détails des baux en cours.', isMandatory: true }
      );
      break;
    case 'Péniche':
      docs.push(
        { id: 'titre_navigation', name: 'Titre de navigation', description: 'Certificat communautaire ou titre de navigation valide.', isMandatory: true },
        { id: 'cot', name: 'COT', description: 'Convention d\'Occupation Temporaire (emplacements).', isMandatory: true }
      );
      break;
    case 'Moulin':
      docs.push(
        { id: 'droit_eau', name: 'Droit d\'eau', description: 'Titre fondé en titre ou autorisation préfectorale.', isMandatory: true }
      );
      break;
    case 'Local commercial':
    case "Local d'activité":
    case 'Entrepôt / Local industriel':
    case 'Bureaux':
      docs.push(
        { id: 'bail_commercial', name: 'Bail commercial', description: 'S\'il y a un locataire en place.', isMandatory: false }
      );
      break;
    case 'Terrain':
    case 'Terrain de loisirs':
    case 'Domaine forestier':
    case 'Bois de chasse':
    case 'Territoire de chasse':
      docs.push(
        { id: 'plan_cadastral', name: 'Plan Cadastral', description: 'Plan de situation géographique.', isMandatory: true },
        { id: 'plu', name: 'Attestation PLU/Zonage', description: 'Information sur les zones constructibles.', isMandatory: true }
      );
      break;
    default: // Maison, Villa, Manoir, Château
      docs.push(
        { id: 'dpe', name: 'DPE (Diagnostic)', description: 'Diagnostic de performance énergétique.', isMandatory: true },
        { id: 'plans', name: 'Plans', description: 'Plans du bien si disponibles.', isMandatory: false }
      );
      break;
  }

  return docs;
}
