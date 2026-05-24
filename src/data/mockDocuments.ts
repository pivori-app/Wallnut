import { DocumentItem } from '../types';

const makeDoc = (
  id: string,
  name: string,
  description: string,
  icon: string,
  required: boolean,
  category: string,
  clientType: 'all' | 'particulier' | 'professionnel',
  validationKeywords: string[]
): Omit<DocumentItem, 'pages' | 'status'> => ({
  id,
  name,
  description,
  icon,
  required,
  category,
  clientType,
  validationKeywords,
});

export const PARTICULIER_DOCUMENTS: Omit<DocumentItem, 'pages' | 'status'>[] = [
  makeDoc(
    'cni',
    "Carte Nationale d'Identité",
    "Recto et verso de votre CNI ou passeport en cours de validité",
    '🪪',
    true,
    'Identité',
    'particulier',
    ['carte', 'identité', 'cni', 'passeport', 'nationalité', 'identity', 'passport']
  ),
  makeDoc(
    'domicile',
    'Justificatif de domicile',
    "Facture EDF, eau, gaz ou téléphone de moins de 3 mois",
    '🏠',
    true,
    'Domicile',
    'particulier',
    ['facture', 'domicile', 'edf', 'electricité', 'gaz', 'eau', 'téléphone', 'loyer', 'quittance']
  ),
  makeDoc(
    'impot',
    "Avis d'imposition",
    "Dernier avis d'imposition sur le revenu",
    '📋',
    true,
    'Fiscal',
    'particulier',
    ['impôt', 'imposition', 'fiscal', 'revenu', 'dgfip', 'taxes', 'avis']
  ),
  makeDoc(
    'rib',
    'RIB / IBAN',
    "Relevé d'identité bancaire",
    '🏦',
    true,
    'Bancaire',
    'particulier',
    ['rib', 'iban', 'bancaire', 'compte', 'banque', 'bic', 'relevé']
  ),
  makeDoc(
    'revenus',
    'Justificatif de revenus',
    "3 derniers bulletins de salaire ou bilan comptable",
    '💰',
    true,
    'Revenus',
    'particulier',
    ['salaire', 'bulletin', 'paie', 'revenu', 'fiche', 'employeur', 'travail']
  ),
  makeDoc(
    'contrat_travail',
    'Contrat de travail',
    "CDI, CDD ou promesse d'embauche",
    '📝',
    false,
    'Emploi',
    'particulier',
    ['contrat', 'travail', 'emploi', 'cdi', 'cdd', 'embauche', 'employeur']
  ),
  makeDoc(
    'carte_vitale',
    'Carte Vitale',
    "Attestation de sécurité sociale",
    '💳',
    false,
    'Santé',
    'particulier',
    ['vitale', 'sécurité', 'sociale', 'cpam', 'assurance maladie', 'ameli']
  ),
  makeDoc(
    'permis',
    'Permis de conduire',
    "Recto et verso du permis de conduire",
    '🚗',
    false,
    'Identité',
    'particulier',
    ['permis', 'conduire', 'driving', 'license', 'véhicule']
  ),
  makeDoc(
    'attestation_caf',
    'Attestation CAF',
    "Attestation de droits ou de ressources CAF",
    '👨‍👩‍👧',
    false,
    'Social',
    'particulier',
    ['caf', 'allocations', 'familiales', 'prestations', 'rsa', 'apl']
  ),
];

export const PROFESSIONNEL_DOCUMENTS: Omit<DocumentItem, 'pages' | 'status'>[] = [
  makeDoc(
    'kbis',
    'Extrait Kbis',
    "Extrait Kbis de moins de 3 mois (original)",
    '🏢',
    true,
    'Juridique',
    'professionnel',
    ['kbis', 'extrait', 'registre', 'commerce', 'sociétés', 'rcs', 'greffe']
  ),
  makeDoc(
    'statuts',
    'Statuts de la société',
    "Statuts constitutifs ou mis à jour et signés",
    '📜',
    true,
    'Juridique',
    'professionnel',
    ['statuts', 'société', 'statut', 'constitution', 'sas', 'sarl', 'associés']
  ),
  makeDoc(
    'dirigeant_cni',
    'CNI du dirigeant',
    "Carte d'identité du représentant légal",
    '🪪',
    true,
    'Identité Dirigeant',
    'professionnel',
    ['identité', 'dirigeant', 'cni', 'passeport', 'représentant', 'gérant', 'président']
  ),
  makeDoc(
    'rib_pro',
    'RIB Professionnel',
    "Relevé d'identité bancaire de la société",
    '🏦',
    true,
    'Bancaire',
    'professionnel',
    ['rib', 'iban', 'bancaire', 'compte', 'professionnel', 'société', 'entreprise']
  ),
  makeDoc(
    'bilan',
    'Bilans comptables',
    "2 derniers exercices comptables (N-1 et N-2)",
    '📊',
    true,
    'Comptabilité',
    'professionnel',
    ['bilan', 'comptable', 'exercice', 'résultat', 'liasse', 'fiscale', 'chiffre affaires']
  ),
  makeDoc(
    'liasse_fiscale',
    'Liasse fiscale',
    "Déclarations fiscales des 2 derniers exercices",
    '📋',
    true,
    'Fiscal',
    'professionnel',
    ['liasse', 'fiscale', 'déclaration', 'impôt', 'dgfip', 'cerfa', '2065', '2031']
  ),
  makeDoc(
    'domicile_pro',
    'Justificatif de siège social',
    "Bail commercial, attestation d'hébergement ou titre de propriété",
    '🏢',
    true,
    'Domicile',
    'professionnel',
    ['bail', 'commercial', 'siège', 'social', 'hébergement', 'domiciliation', 'local']
  ),
  makeDoc(
    'insurance',
    'Assurance professionnelle',
    "Attestation d'assurance RC Pro en cours de validité",
    '🛡️',
    false,
    'Assurance',
    'professionnel',
    ['assurance', 'rc', 'pro', 'responsabilité', 'civile', 'attestation', 'garantie']
  ),
  makeDoc(
    'pouvoir',
    'Pouvoir / Délégation',
    "Délégation de pouvoir si le signataire n'est pas le dirigeant",
    '✍️',
    false,
    'Juridique',
    'professionnel',
    ['pouvoir', 'délégation', 'mandat', 'signataire', 'habilitation', 'représentation']
  ),
  makeDoc(
    'certif_vigilance',
    'Certificat de vigilance URSSAF',
    "Certificat de régularité sociale de moins de 6 mois",
    '✅',
    false,
    'Social',
    'professionnel',
    ['urssaf', 'vigilance', 'cotisations', 'sociales', 'régularité', 'attestation']
  ),
  makeDoc(
    'immatriculation',
    "Avis de situation SIRENE",
    "Avis de situation au répertoire SIRENE (INSEE)",
    '🔢',
    false,
    'Juridique',
    'professionnel',
    ['sirene', 'insee', 'siren', 'siret', 'immatriculation', 'numéro']
  ),
];

export function buildDocumentList(clientType: 'particulier' | 'professionnel'): DocumentItem[] {
  const source = clientType === 'particulier' ? PARTICULIER_DOCUMENTS : PROFESSIONNEL_DOCUMENTS;
  return source.map(doc => ({
    ...doc,
    pages: [],
    status: 'pending' as const,
  }));
}
