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

  // 1. ACTUALISATION TEMPORELLE (Market Trend)
  // Règle: Baisse de 2% sur les 6 derniers mois
  const MarketTrendIndex = -0.02;

  // 1. LOGIQUE DE LOCALISATION & DATA MINING
  const zipPrefix = (zipCode || '').substring(0, 2);
  let baseAreaPrice = 2500; 
  
  if (['75', '92'].includes(zipPrefix)) baseAreaPrice = 9500;
  else if (['69', '13', '33'].includes(zipPrefix)) baseAreaPrice = 4500;
  else if (['06', '83'].includes(zipPrefix)) baseAreaPrice = 5500; 
  
  const adjustedBaseAreaPrice = baseAreaPrice * (1 + MarketTrendIndex);
  const basePrice = surface * adjustedBaseAreaPrice;

  // 2. ALGORITHME DE PONDÉRATION PAR FILTRES (SCORE DE VALORISATION)
  const multipliersApplied: Record<string, number> = {};
  let totalPlusValues = 0;
  let totalMoinsValues = 0;

  const trackMultiplier = (name: string, value: number) => {
    if (value > 0) totalPlusValues += value;
    else totalMoinsValues += value;
    multipliersApplied[name] = value;
  };

  // --- ÉTAT DU BIEN ---
  if (condition.includes('Très bon') || condition.includes('Rénové')) trackMultiplier('État Rénové', 0.10);
  else if (condition.includes('rafraîchir')) trackMultiplier('À rafraîchir', -0.10);
  else if (condition.includes('Travaux') || condition.includes('rénover')) trackMultiplier('Travaux importants', -0.25);

  // --- DPE ---
  if (dpe === 'A' || dpe === 'B') trackMultiplier('DPE Vert (A/B)', 0.05);
  else if (dpe === 'F') trackMultiplier('DPE F', -0.05);
  else if (dpe === 'G') trackMultiplier('Passoire thermique (G)', -0.15);

  // --- PLUS-VALUES (Majorations) ---
  if (features.includes('Vue mer')) trackMultiplier('Vue mer', 0.20);
  if (features.includes('Rooftop') || features.includes('Terrasse')) trackMultiplier('Rooftop / Terrasse', 0.12);
  
  if (features.includes('Piscine')) {
    const isLuxuryAppart = propertyType.toLowerCase().includes('appartement') && (features.includes('Rooftop') || features.includes('Dernier étage'));
    const poolBonus = isLuxuryAppart ? 0.04 : 0.08;
    trackMultiplier(isLuxuryAppart ? 'Piscine (Ajustée Copro)' : 'Piscine', poolBonus);
  }
  
  if (features.includes('Proche transports')) trackMultiplier('Proximité Transports', 0.05);
  if (features.includes('Écoles à proximité')) trackMultiplier('Scolarité', 0.03);

  // --- MOINS-VALUES (Décotes) ---
  if (features.includes('Rez-de-jardin') && propertyType.toLowerCase().includes('appartement')) {
    trackMultiplier('Rez-de-chaussée', -0.10);
  }

  // LISSAGE DES PLUS-VALUES (Plafond de verre à +35%)
  if (totalPlusValues > 0.35) {
    const diff = totalPlusValues - 0.35;
    totalPlusValues = 0.35;
    multipliersApplied['PLAFOND DE VERRE (Anti-stacking)'] = -diff;
  }

  const finalMultiplier = (1 + totalPlusValues + totalMoinsValues);
  const finalPrice = Math.round(basePrice * finalMultiplier);
  const lowBound = Math.round(finalPrice * 0.95);
  const highBound = Math.round(finalPrice * 1.05);

  const confidenceIndex = zipPrefix ? 92 : 65; 

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
  console.log("=== DÉMARRAGE DU TEST: MOTEUR D'ESTIMATION IMMOBILIÈRE (INSTITUTIONNEL) ===");
  
  const testA = calculateRealTimeEstimation({
    surface: 80, zipCode: '06000', condition: 'Bon état', features: [], dpe: 'C', propertyType: 'Appartement'
  });
  console.log("TEST A (Base):", testA);

  const testC = calculateRealTimeEstimation({
    surface: 80, zipCode: '75000', condition: 'Très bon état', 
    features: ['Vue mer', 'Rooftop', 'Piscine', 'Proche transports', 'Écoles à proximité'], 
    dpe: 'A', propertyType: 'Appartement'
  });
  console.log("TEST C (Plafond 35%):", testC);
  
  console.log("=== FIN DU TEST ===");
}

// Test function expose on window for easy access in dev mode
if (typeof window !== 'undefined') {
  (window as any).runEstimationTests = TestEstimationEngine;
}
