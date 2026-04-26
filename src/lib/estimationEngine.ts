// Moteur de calcul d'estimation dynamique
// ROLE : LEAD DATA SCIENTIST & ARCHITECTE FULL-STACK

export interface EstimationResult {
  basePrice: number;
  finalPrice: number;
  lowBound: number;
  highBound: number;
  pricePerSqm: number;
  confidenceIndex: number;
  multipliersApplied: Record<string, number>;
}

export function calculateRealTimeEstimation(
  params: {
    surface: number;
    zipCode: string;
    condition: string;
    features: string[];
    dpe: string;
    propertyType: string;
  }
): EstimationResult | null {
  const { surface, zipCode, condition, features, dpe, propertyType } = params;
  
  if (!surface || surface <= 0) return null;

  // 1. LOGIQUE DE LOCALISATION & DATA MINING (Simulation de l'API DVF/Yanport)
  // En production, un appel API récupérerait le prix médian au m² sur un rayon de 500m à 2km.
  const zipPrefix = (zipCode || '').substring(0, 2);
  let baseAreaPrice = 2500; // Province par défaut
  
  if (['75', '92'].includes(zipPrefix)) baseAreaPrice = 9500;
  else if (['69', '13', '33'].includes(zipPrefix)) baseAreaPrice = 4500;
  else if (['06', '83'].includes(zipPrefix)) baseAreaPrice = 5500; // Côte d'Azur
  
  // Ajustement tension immobilière (Castorus/Yanport mock)
  const tensionMultiplier = 1.02; // Légère tension à la hausse globale par défaut
  const basePrice = surface * baseAreaPrice * tensionMultiplier;

  // 2. ALGORITHME DE PONDÉRATION PAR FILTRES (SCORE DE VALORISATION)
  let totalMultiplier = 1.0;
  const multipliersApplied: Record<string, number> = {};

  const applyMultiplier = (name: string, value: number) => {
    totalMultiplier *= (1 + value);
    multipliersApplied[name] = value;
  };

  // --- ÉTAT DU BIEN ---
  if (condition.includes('Très bon') || condition.includes('Rénové')) applyMultiplier('État Rénové', 0.10);
  else if (condition.includes('rafraîchir')) applyMultiplier('À rafraîchir', -0.10);
  else if (condition.includes('Travaux') || condition.includes('rénover')) applyMultiplier('Travaux importants', -0.25);

  // --- DPE (Performances Énergétiques) ---
  if (dpe === 'A' || dpe === 'B') applyMultiplier('DPE Vert (A/B)', 0.05);
  else if (dpe === 'F') applyMultiplier('DPE F', -0.05);
  else if (dpe === 'G') applyMultiplier('Passoire thermique (G)', -0.12);

  // --- CARACTÉRISTIQUES INTRINSÈQUES ET PLUS-VALUES ---
  if (features.includes('Vue mer')) applyMultiplier('Vue mer', 0.20);
  if (features.includes('Rooftop') || features.includes('Terrasse')) applyMultiplier('Rooftop / Terrasse', 0.12);
  if (features.includes('Piscine')) applyMultiplier('Piscine', 0.08); // +8%
  
  // Commodités
  let commoditesBonus = 0;
  if (features.includes('Proche transports')) commoditesBonus += 0.03;
  if (features.includes('Écoles à proximité')) commoditesBonus += 0.02;
  if (features.includes('Proche commerces')) commoditesBonus += 0.02;
  if (commoditesBonus > 0) applyMultiplier('Commodités', Math.min(commoditesBonus, 0.08));

  // --- MOINS-VALUES (Décotes supplémentaires) ---
  if (features.includes('Rez-de-jardin') && propertyType.toLowerCase().includes('appartement')) {
    applyMultiplier('Rez-de-chaussée', -0.10);
  }

  // Calcul Final
  const finalPrice = Math.round(basePrice * totalMultiplier);
  const lowBound = Math.round(finalPrice * 0.93); // -7% pour la fourchette basse
  const highBound = Math.round(finalPrice * 1.07); // +7% pour la fourchette haute

  // Indice de fiabilité (Mock: basé sur la présence du code postal et des données DVF simulées)
  // En production, il serait basé sur le volume de data (ex: count(ventes_500m) > 10)
  const confidenceIndex = zipPrefix ? 88 : 65; 

  return {
    basePrice: Math.round(basePrice),
    finalPrice,
    lowBound,
    highBound,
    pricePerSqm: Math.round(finalPrice / surface),
    confidenceIndex,
    multipliersApplied
  };
}

// 3. COMPOSANT DE TEST & VALIDATION (DEBUG MODE)
export function TestEstimationEngine() {
  console.log("=== DÉMARRAGE DU TEST: MOTEUR D'ESTIMATION IMMOBILIÈRE ===");
  
  // Test A: Appartement standard Bon État
  const testA = calculateRealTimeEstimation({
    surface: 80,
    zipCode: '06000', // Nice
    condition: 'Bon état',
    features: ['Proche transports'],
    dpe: 'C',
    propertyType: 'Appartement'
  });
  console.log("TEST A: Appartement 80m², Nice, Bon État, Proche transports (DPE C)");
  console.log("Résultat:", testA);

  // Test B: Même appartement mais "Vue mer", "Dernier étage/Rooftop", "Très bon état"
  const testB = calculateRealTimeEstimation({
    surface: 80,
    zipCode: '06000',
    condition: 'Très bon état',
    features: ['Vue mer', 'Rooftop', 'Proche transports', 'Proche commerces'],
    dpe: 'B',
    propertyType: 'Appartement'
  });
  console.log("\nTEST B: Appartement 80m², Nice, Rénové, Vue mer, Rooftop, Commodités (DPE B)");
  console.log("Résultat:", testB);

  console.log(`\nDifférence de valorisation entre Test B et Test A : +${Math.round(((testB?.finalPrice || 0) / (testA?.finalPrice || 1) - 1) * 100)}%`);
  console.log("=== FIN DU TEST ===");
}

// Test function expose on window for easy access in dev mode
if (typeof window !== 'undefined') {
  (window as any).runEstimationTests = TestEstimationEngine;
}
