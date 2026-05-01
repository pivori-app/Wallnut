export const PROPERTY_TYPES = [
  'Appartement',
  'Maison',
  'Terrain',
  'Immeuble de rapport',
  'Local commercial',
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
  "Local d'activité",
  'Loft',
  'Longère',
  'Lotissement',
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

export function getRequiredDocuments(propertyType: PropertyType, isPro: boolean, subRole?: string): RequiredDocument[] {
  // Base documents common to all properties
  let docs: RequiredDocument[] = [];

  if (isPro) {
    if (subRole === 'notaire') {
      docs.push(
        { id: 'titre_propriete_complet', name: 'Titre de propriété complet', description: 'Incluant l\'origine de propriété.', isMandatory: true },
        { id: 'etat_civil', name: 'État civil complet', description: 'Livret de famille, contrat de mariage.', isMandatory: true },
        { id: 'pre_etat_date', name: 'Pré-état daté', description: 'Si copropriété.', isMandatory: false }
      );
    } else if (subRole === 'agent_immobilier' || subRole === 'partenaire') {
      docs.push(
        { id: 'mandat_vente', name: 'Mandat de vente', description: 'Mandat exclusif ou simple valide.', isMandatory: true },
        { id: 'fiche_technique', name: 'Fiche technique', description: 'Description détaillée du bien.', isMandatory: true },
      );
    } else if (subRole === 'diagnostiqueur') {
       docs.push(
        { id: 'ordres_mission', name: 'Ordre de mission', description: 'Signé par le propriétaire.', isMandatory: true },
        { id: 'precedents_dpe', name: 'Précédents diagnostics', description: 'Anciens bilans si disponibles.', isMandatory: false },
      );
    } else if (subRole === 'courtier') {
      docs.push(
        { id: 'simulation_financement', name: 'Simulation de financement', description: 'Plan de financement prévisionnel.', isMandatory: true },
        { id: 'compromis_projet', name: 'Projet de compromis', description: 'Pour étude du dossier.', isMandatory: true },
      );
    } else {
      docs.push(
        { id: 'mandat_vente', name: 'Mandat ou Contrat', description: 'Mandat valide ou contrat de mission.', isMandatory: true },
      );
    }
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
      if (subRole !== 'diagnostiqueur') {
        docs.push({ id: 'dpe', name: 'DPE (Diagnostic)', description: 'Diagnostic de performance énergétique.', isMandatory: true });
      }
      if (isPro && subRole !== 'courtier' && subRole !== 'diagnostiqueur') {
        docs.push({ id: 'registre_copro', name: 'Registre Copropriété', description: 'Immatriculation au registre national.', isMandatory: true });
        docs.push({ id: 'pv_ag', name: 'PV d\'AG', description: '3 derniers Procès-verbaux.', isMandatory: true });
      }
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
      if (subRole !== 'diagnostiqueur') {
        docs.push({ id: 'dpe', name: 'DPE (Diagnostic)', description: 'Diagnostic de performance énergétique.', isMandatory: true });
      }
      docs.push({ id: 'plans', name: 'Plans', description: 'Plans du bien si disponibles.', isMandatory: false });
      break;
  }

  return docs;
}
