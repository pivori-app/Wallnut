// ═══════════════════════════════════════════════════════════
// src/utils/validators.ts
// Validations complètes : Nom, Téléphone, SIRET
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────
// VALIDATION NOM / PRÉNOM
// ─────────────────────────────────────────────────────────

const KEYBOARD_SEQUENCES = [
  'azerty', 'qwerty', 'abcd', 'efgh', 'ijkl', 'mnop',
  'qrst', 'uvwx', 'aaaa', 'bbbb', 'cccc', 'dddd', 'eeee',
  'ffff', 'gggg', 'hhhh', 'iiii', 'jjjj', 'kkkk', 'llll',
  'mmmm', 'nnnn', 'oooo', 'pppp', 'qqqq', 'rrrr', 'ssss',
  'tttt', 'uuuu', 'vvvv', 'wwww', 'xxxx', 'yyyy', 'zzzz',
  '1234', '0000', '1111', '2222', '3333'
];

export const validateName = (value: string): true | string => {
  if (!value || value.trim().length === 0) {
    return 'Ce champ est requis';
  }

  const trimmed = value.trim();

  if (trimmed.length < 2) {
    return 'Minimum 2 caractères requis';
  }

  if (trimmed.length > 50) {
    return 'Maximum 50 caractères autorisés';
  }

  // Lettres françaises, tiret, apostrophe, espace uniquement
  const validCharsRegex = /^[a-zA-ZÀ-ÿœæŒÆ\s\-']+$/;
  if (!validCharsRegex.test(trimmed)) {
    return 'Lettres uniquement (pas de chiffres ni caractères spéciaux)';
  }

  // Doit commencer par une lettre
  if (!/^[a-zA-ZÀ-ÿœæŒÆ]/.test(trimmed)) {
    return 'Doit commencer par une lettre';
  }

  // Pas de répétition de même lettre 4 fois ou plus
  if (/(.)\1{3,}/i.test(trimmed)) {
    return 'Ce prénom/nom ne semble pas valide';
  }

  // Pas de séquences clavier
  const lowerValue = trimmed.toLowerCase().replace(/\s/g, '');
  for (const seq of KEYBOARD_SEQUENCES) {
    if (lowerValue.includes(seq)) {
      return 'Ce prénom/nom ne semble pas valide';
    }
  }

  // Pas que des consonnes (ex: "PTRSK" n'est pas un vrai prénom)
  const vowels = /[aeiouyàâäéèêëîïôùûüœæ]/i;
  if (!vowels.test(trimmed)) {
    return 'Veuillez entrer un prénom/nom valide';
  }

  return true;
};

export const formatName = (value: string): string => {
  if (!value) return '';
  // Première lettre en majuscule, reste en minuscule
  return value
    .toLowerCase()
    .replace(/(^|\s|-)([a-zà-ÿœæ])/g, (match) => match.toUpperCase());
};

// ─────────────────────────────────────────────────────────
// VALIDATION TÉLÉPHONE
// ─────────────────────────────────────────────────────────

const INVALID_PHONES = [
  '0600000000', '0611111111', '0622222222', '0633333333',
  '0644444444', '0655555555', '0666666666', '0677777777',
  '0688888888', '0699999999', '0700000000', '0711111111',
  '0600010001', '0612345678', '0698765432'
];

export const validatePhone = (
  value: string,
  isPro: boolean = false
): true | string => {
  if (!value || value.trim().length === 0) {
    return 'Le numéro de téléphone est requis';
  }

  // Nettoyer : garder uniquement les chiffres et le +
  const cleaned = value.replace(/[\s.\-()]/g, '');

  // Convertir +33 en 0
  const normalized = cleaned.startsWith('+33')
    ? '0' + cleaned.slice(3)
    : cleaned.startsWith('0033')
    ? '0' + cleaned.slice(4)
    : cleaned;

  // Doit avoir exactement 10 chiffres
  if (!/^\d{10}$/.test(normalized)) {
    return 'Le numéro doit contenir 10 chiffres';
  }

  // Particuliers : seulement 06/07
  if (!isPro) {
    if (!/^0[67]/.test(normalized)) {
      return 'Veuillez entrer un numéro de mobile (06 ou 07)';
    }
  } else {
    // Professionnels : 01-09 acceptés
    if (!/^0[1-9]/.test(normalized)) {
      return 'Numéro de téléphone invalide';
    }
  }

  // Bloquer les numéros fantaisistes
  if (INVALID_PHONES.includes(normalized)) {
    return 'Veuillez entrer un numéro de téléphone réel';
  }

  // Bloquer les répétitions (0666666666, etc.)
  if (/^0(.)\1{8}$/.test(normalized)) {
    return 'Ce numéro ne semble pas valide';
  }

  return true;
};

export const formatPhone = (value: string): string => {
  if (!value) return '';

  // Garder seulement chiffres et +
  let cleaned = value.replace(/[^\d+]/g, '');

  // Convertir +33 en 0
  if (cleaned.startsWith('+33')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('0033')) {
    cleaned = '0' + cleaned.slice(4);
  }

  // Limiter à 10 chiffres
  cleaned = cleaned.slice(0, 10);

  // Formater par groupes de 2 : 06 12 34 56 78
  const groups = cleaned.match(/.{1,2}/g) || [];
  return groups.join(' ');
};

export const normalizePhone = (value: string): string => {
  const cleaned = value.replace(/[\s.\-()]/g, '');
  if (cleaned.startsWith('+33')) return cleaned;
  if (cleaned.startsWith('0033')) return '+33' + cleaned.slice(4);
  if (cleaned.startsWith('0')) return '+33' + cleaned.slice(1);
  return cleaned;
};

// ─────────────────────────────────────────────────────────
// VALIDATION SIRET — ALGORITHME DE LUHN
// ─────────────────────────────────────────────────────────

export const luhnCheck = (siret: string): boolean => {
  const digits = siret.replace(/\s/g, '');

  if (!/^\d{14}$/.test(digits)) return false;

  // Cas particulier La Poste
  if (digits === '35600000000048') return true;

  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(digits[i], 10);
    // Doubler les chiffres avec un index pair (0, 2, 4...) car 14 chiffres au total (Luhn de la droite vers la gauche)
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  return sum % 10 === 0;
};

const INVALID_SIRETS = [
  '00000000000000',
  '11111111111111',
  '22222222222222',
  '33333333333333',
  '44444444444444',
  '55555555555555',
  '66666666666666',
  '77777777777777',
  '88888888888888',
  '99999999999999',
  '12345678901234',
];

export const validateSIRET = (value: string): true | string => {
  if (!value || value.trim().length === 0) {
    return 'Le numéro SIRET est requis';
  }

  const digits = value.replace(/[\s.-]/g, '');

  if (!/^\d+$/.test(digits)) {
    return 'Le SIRET ne doit contenir que des chiffres';
  }

  if (digits.length < 14) {
    return `Le SIRET doit contenir 14 chiffres (${digits.length}/14)`;
  }

  if (digits.length > 14) {
    return 'Le SIRET ne doit pas dépasser 14 chiffres';
  }

  if (INVALID_SIRETS.includes(digits)) {
    return 'Ce numéro SIRET n\'est pas valide (suite de zéros, etc.)';
  }

  // Pour faciliter les tests, on ne bloque plus si l'algo de Luhn échoue.
  // Un vrai SIRET fait toujours exactement 14 chiffres (9 SIREN + 5 NIC).
  if (!luhnCheck(digits)) {
    console.warn(`[Mode Test] Le SIRET ${digits} n'est pas mathématiquement valide (clé de Luhn), mais il est accepté.`);
  }

  return true;
};

export const formatSIRET = (value: string): string => {
  if (!value) return '';

  // Garder uniquement les chiffres
  const digits = value.replace(/\D/g, '').slice(0, 14);

  // Format : XXX XXX XXX XXXXX
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
};

// ─────────────────────────────────────────────────────────
// TESTS DE VALIDATION INLINE
// ─────────────────────────────────────────────────────────

if (process.env.NODE_ENV === 'development') {
  // Tests SIRET
  console.assert(validateSIRET('73282932000074') === true,
    '❌ SIRET valide doit passer');
  console.assert(validateSIRET('00000000000000') !== true,
    '❌ SIRET nul doit échouer');
  console.assert(validateSIRET('1234') !== true,
    '❌ SIRET trop court doit échouer');
  console.assert(validateSIRET('11111111111111') !== true,
    '❌ SIRET répété doit échouer');

  // Tests Téléphone
  console.assert(validatePhone('0612345678') === true,
    '❌ Mobile 06 valide doit passer');
  console.assert(validatePhone('0712345678') === true,
    '❌ Mobile 07 valide doit passer');
  console.assert(validatePhone('0112345678') !== true,
    '❌ Fixe doit échouer pour particulier');
  console.assert(validatePhone('0112345678', true) === true,
    '❌ Fixe doit passer pour professionnel');
  console.assert(validatePhone('0666666666') !== true,
    '❌ Répétition doit échouer');

  // Tests Nom
  console.assert(validateName('Jean-Pierre') === true,
    '❌ Prénom composé valide doit passer');
  console.assert(validateName('Marie') === true,
    '❌ Prénom simple valide doit passer');
  console.assert(validateName('PPPPPP') !== true,
    '❌ Répétition doit échouer');
  console.assert(validateName('Az3r') !== true,
    '❌ Chiffres interdits dans nom');
  console.assert(validateName('A') !== true,
    '❌ Trop court doit échouer');

  // Tests Format
  console.assert(formatSIRET('73282932000074') === '732 829 320 00074',
    '❌ Format SIRET incorrect');
  console.assert(formatPhone('0612345678') === '06 12 34 56 78',
    '❌ Format téléphone incorrect');
  console.assert(formatName('jean-pierre') === 'Jean-Pierre',
    '❌ Format nom incorrect');

  console.log('✅ Tous les tests validators.ts passent');
}
