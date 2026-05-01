export interface AssetData {
  id: string;
  clientId: string;
  clientName: string;
  clientType: 'PP' | 'PM'; // Particulier ou Personne Morale
  clientStatus: string; // Forme porteur
  city: string;
  propertyType: string;
  referenceValue: number; // Valeur réf. (€) B14
  surface: number; // Surface B15
  offerTarget: 'Premium' | 'Équilibre' | 'Prudente'; // Offre visée B24

  // Dettes et frais
  existingDebt: number; // B27
  agencyFees: number; // B28
  actFees: number; // B29

  // Notes qualitatives
  marketLiquidityDelay: number; // B43 (jours)
  legalQualityScore: number; // I30 (0-100)
  assetQuality: number; // 1-5 (B18)
  exitReadability: number; // 1-5 (B19)
  sellerProfile: number; // 1-5 (B20)
  complexity: number; // 1-5 (B21)
  
  // Benchmark
  benchmarkPrice: number; // B42
  
  // Localisation
  distanceLargeCity: number; // B49 (km)
  accessTimeLargeCity: number; // B50 (min)
  population: number; // B51
}

export function calculateAssetUnderwriting(asset: AssetData) {
  // LTV cible
  let ltvTarget = 0.6;
  if (asset.offerTarget === 'Premium') ltvTarget = 0.8;
  else if (asset.offerTarget === 'Équilibre') ltvTarget = 0.7;

  // Montages
  const baseIntervention = asset.referenceValue * ltvTarget; // F71
  const prepayeTotal = baseIntervention * 0.13 * 2; // F72
  let prepayeAcquis = baseIntervention * 0.13; // F73
  if (asset.offerTarget === 'Premium') prepayeAcquis = baseIntervention * 0.195;

  const fraisActeFinal = asset.offerTarget === 'Premium' ? 0 : asset.actFees;
  const netClientAvantPrepaye = baseIntervention - asset.existingDebt - asset.agencyFees - fraisActeFinal; // F74
  const netClientImmediat = netClientAvantPrepaye - prepayeTotal; // F75

  const implicitPrice = asset.surface > 0 ? asset.referenceValue / asset.surface : 0; // F77
  const priceDiffVsBenchmark = asset.benchmarkPrice > 0 ? (implicitPrice / asset.benchmarkPrice) - 1 : 0; // F78

  // Liquidité Marché 1-5
  let liquidityNote1To5 = 1;
  const d = asset.marketLiquidityDelay;
  if (d <= 45) liquidityNote1To5 = 5;
  else if (d <= 90) liquidityNote1To5 = 4;
  else if (d <= 150) liquidityNote1To5 = 3;
  else if (d <= 240) liquidityNote1To5 = 2;

  // Indice liquidité
  let delayScore = 20;
  if (d <= 45) delayScore = 100;
  else if (d <= 90) delayScore = 80;
  else if (d <= 150) delayScore = 60;
  else if (d <= 240) delayScore = 40;
  const liquidityIndex = Math.round((liquidityNote1To5 * 20) * 0.6 + delayScore * 0.4); // F79

  // Attractivité Localisation
  let popScore = 1;
  if (asset.population >= 100000) popScore = 5;
  else if (asset.population >= 30000) popScore = 4;
  else if (asset.population >= 10000) popScore = 3;
  else if (asset.population >= 3000) popScore = 2;

  let distScore = 1;
  if (asset.distanceLargeCity <= 20) distScore = 5;
  else if (asset.distanceLargeCity <= 35) distScore = 4;
  else if (asset.distanceLargeCity <= 50) distScore = 3;
  else if (asset.distanceLargeCity <= 70) distScore = 2;

  let timeScore = 1;
  if (asset.accessTimeLargeCity <= 15) timeScore = 5;
  else if (asset.accessTimeLargeCity <= 30) timeScore = 4;
  else if (asset.accessTimeLargeCity <= 45) timeScore = 3;
  else if (asset.accessTimeLargeCity <= 60) timeScore = 2;

  let distKmScore = 1;
  if (asset.distanceLargeCity <= 10) distKmScore = 5;
  else if (asset.distanceLargeCity <= 25) distKmScore = 4;
  else if (asset.distanceLargeCity <= 40) distKmScore = 3;
  else if (asset.distanceLargeCity <= 60) distKmScore = 2;

  const residentialAttractiveness = Math.round(popScore * 0.6 + distScore * 0.4);
  const demoDynamic = Math.round((liquidityNote1To5 * 5) * 0.5 + popScore * 0.5); // Using 1-5 for delay
  let delayScore1To5 = 1;
  if (d <= 45) delayScore1To5 = 5; else if (d <= 90) delayScore1To5 = 4; else if (d <= 150) delayScore1To5 = 3; else if (d <= 240) delayScore1To5 = 2;
  const realDemoDynamic = Math.round(delayScore1To5 * 0.5 + popScore * 0.5); // Use correct delay delayScore1To5
  const jobBasin = Math.round(distScore * 0.5 + popScore * 0.5);
  const proximityLargeCity = Math.round(distKmScore * 0.4 + timeScore * 0.6);
  
  const attractivenessIndex = Math.round(((residentialAttractiveness + realDemoDynamic + jobBasin + proximityLargeCity) / 4) * 20); // F81

  // Scores Pondérés
  const legalQualityNote = Math.round(asset.legalQualityScore / 20); // /5
  const completnessScore = 100; // Assume 100 for now.
  const marketSources = 5; 
  
  let priceScore = 1;
  if (priceDiffVsBenchmark <= -0.20) priceScore = 5;
  else if (priceDiffVsBenchmark <= -0.10) priceScore = 4;
  else if (priceDiffVsBenchmark <= 0) priceScore = 3;
  else if (priceDiffVsBenchmark <= 0.10) priceScore = 2;

  const liquidityMarketScore5 = Math.round(liquidityIndex / 20);
  const attractivenessScore5 = Math.round(attractivenessIndex / 20);

  // F98 - Validation Fonds
  const fundScore = Math.round(
    completnessScore * 0.10 +
    (marketSources / 5 * 100) * 0.10 +
    (priceScore / 5 * 100) * 0.20 +
    (liquidityMarketScore5 / 5 * 100) * 0.15 +
    (attractivenessScore5 / 5 * 100) * 0.10 +
    (legalQualityNote / 5 * 100) * 0.15 +
    (asset.assetQuality / 5 * 100) * 0.10 +
    (asset.exitReadability / 5 * 100) * 0.05 +
    (asset.sellerProfile / 5 * 100) * 0.05
  );

  let recoGo = "No-Go";
  if (fundScore >= 75) recoGo = "Go";
  else if (fundScore >= 55) recoGo = "À revoir";

  let expertOpinion = "Rejet / hors thèse";
  if (fundScore >= 80) expertOpinion = "Investissable prioritaire";
  else if (fundScore >= 68) expertOpinion = "Investissable sélectif";
  else if (fundScore >= 55) expertOpinion = "À revoir en IC";

  let dossierLight = "Gris";
  if (fundScore < 55 || legalQualityNote <= 2) dossierLight = "Rouge";
  else if (fundScore >= 75 && completnessScore >= 75 && liquidityMarketScore5 >= 3 && legalQualityNote >= 3) dossierLight = "Vert";
  else dossierLight = "Orange";

  const securityMargin = 1 - (baseIntervention / asset.referenceValue);

  return {
    ...asset,
    baseIntervention,
    netClientImmediat,
    existingDebt: asset.existingDebt,
    pepayeTotal: prepayeTotal,
    implicitPrice,
    priceDiffVsBenchmark,
    liquidityIndex,
    attractivenessIndex,
    fundScore,
    reco: recoGo,
    expertOpinion,
    dossierLight,
    securityMargin,
    legalQualityScore: asset.legalQualityScore,
    legalLight: asset.legalQualityScore >= 80 ? "Vert" : asset.legalQualityScore >= 50 ? "Orange" : "Rouge",
  };
}

export function synthesizePortfolio(assets: any[]) {
  const seizedAssetsCount = assets.filter(a => a.referenceValue > 0).length;
  // Grouper by clientId
  const clientMap = new Map();
  assets.forEach(a => {
    if (!clientMap.has(a.clientId)) {
      clientMap.set(a.clientId, []);
    }
    clientMap.get(a.clientId).push(a);
  });
  
  const activeClientsCount = clientMap.size;
  const multiAssetClientsCount = Array.from(clientMap.values()).filter(list => list.length > 1).length;

  const totalValue = assets.reduce((sum, a) => sum + a.referenceValue, 0);
  const totalBaseIntervention = assets.reduce((sum, a) => sum + a.baseIntervention, 0);
  const totalDebt = assets.reduce((sum, a) => sum + a.existingDebt, 0);
  const totalNetClient = assets.reduce((sum, a) => sum + a.netClientImmediat, 0);

  const avgLiquidity = assets.reduce((sum, a) => sum + a.liquidityIndex, 0) / (assets.length || 1);
  const avgAttractiveness = assets.reduce((sum, a) => sum + a.attractivenessIndex, 0) / (assets.length || 1);

  const nbGo = assets.filter(a => a.reco === "Go").length;
  const nbARevoir = assets.filter(a => a.reco === "À revoir").length;
  const nbNoGo = assets.filter(a => a.reco === "No-Go").length;

  const avgFundScore = assets.reduce((sum, a) => sum + a.fundScore, 0) / (assets.length || 1);

  const nbFeuVert = assets.filter(a => a.dossierLight === "Vert").length;
  const nbFeuOrange = assets.filter(a => a.dossierLight === "Orange").length;
  const nbFeuRouge = assets.filter(a => a.dossierLight === "Rouge").length;

  const avgSecurityMargin = assets.reduce((sum, a) => sum + a.securityMargin, 0) / (assets.length || 1);

  return {
    seizedAssetsCount,
    activeClientsCount,
    multiAssetClientsCount,
    totalValue,
    totalBaseIntervention,
    totalDebt,
    totalNetClient,
    avgLiquidity,
    avgAttractiveness,
    nbGo,
    nbARevoir,
    nbNoGo,
    avgFundScore,
    nbFeuVert,
    nbFeuOrange,
    nbFeuRouge,
    avgSecurityMargin
  };
}
