import { useMemo } from 'react';
import type { PropertyData } from '../types/property';

export interface UnderwritingResult {
  fundScore: number;
  dossierLight: 'Vert' | 'Orange' | 'Rouge';
  legalLight: 'Vert' | 'Orange' | 'Rouge';
  legalQualityScore: number;
  baseIntervention: number;
  netClientImmediat: number;
  referenceValue: number;
  securityMargin: number;
  reco: 'Go' | 'À revoir' | 'No Go';
  expertOpinion: string;
}

// ⚠️ ARCHITECTURE : Ce calcul DOIT être exécuté côté serveur en production.
// Le client ne reçoit que le résultat signé et validé par l'API.
function computeUnderwriting(property: PropertyData): UnderwritingResult {
  const baseScore = property.isComplete ? 85 : 40;
  const legalScore = property.status === 'validated' ? 95 : 30;
  const score = Math.min(100, Math.max(0, baseScore));
  const light = score >= 70 ? 'Vert' : score >= 40 ? 'Orange' : 'Rouge';
  const reco = score >= 70 ? 'Go' : score >= 40 ? 'À revoir' : 'No Go';

  return {
    fundScore: score,
    dossierLight: light,
    legalLight: legalScore >= 70 ? 'Vert' : legalScore >= 40 ? 'Orange' : 'Rouge',
    legalQualityScore: legalScore,
    baseIntervention: Math.round(property.estimatedValue * 0.85),
    netClientImmediat: Math.round(property.estimatedValue * 0.78),
    referenceValue: property.estimatedValue,
    securityMargin: 0.15,
    reco,
    expertOpinion: score >= 70 ? 'Dossier conforme aux critères institutionnels' : 'Analyse approfondie requise',
  };
}

export function usePropertyUnderwriting(property: PropertyData): UnderwritingResult {
  return useMemo(() => computeUnderwriting(property), [property.id, property.estimatedValue, property.isComplete, property.status]);
}
