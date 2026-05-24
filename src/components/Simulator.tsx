import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ShieldCheck, Zap, Info } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

interface SimulatorProps {
  onInitialize?: (data: { propertyValue: number; fundingNeed: number; offerId: string }) => void;
}

export function Simulator({ onInitialize }: SimulatorProps) {
  const [propertyValue, setPropertyValue] = useState(250000);
  const [fundingNeed, setFundingNeed] = useState(50000);
  const [selectedOffer, setSelectedOffer] = useState('equilibre');

  const offers = [
    { 
      id: 'premium', 
      name: 'Premium', 
      ratio: 0.8, 
      feeYearly: 0.13,
      color: 'bg-primary', 
      textColor: 'text-secondary',
      description: 'Liquidité maximale pour projets ambitieux.'
    },
    { 
      id: 'equilibre', 
      name: 'Équilibre', 
      ratio: 0.7, 
      feeYearly: 0.13,
      color: 'bg-secondary', 
      textColor: 'text-primary',
      description: 'L’accord parfait entre liquidité et sécurité.'
    },
    { 
      id: 'prudente', 
      name: 'Prudente', 
      ratio: 0.6, 
      feeYearly: 0.13,
      color: 'bg-success', 
      textColor: 'text-white',
      description: 'Protection maximale de votre patrimoine.'
    }
  ];

  const maxBaseIntervention = propertyValue * 0.8;
  const maxPrepayeAppx = maxBaseIntervention * 0.13 * 2;
  const maxEstimatedNet = maxBaseIntervention - maxPrepayeAppx;
  const isTooHigh = fundingNeed > maxEstimatedNet;

  const handleInitialize = () => {
    if (onInitialize) {
      onInitialize({ propertyValue, fundingNeed, offerId: selectedOffer });
    }
  };

  return (
    <div className="glass rounded-3xl p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div>
            <label className="block text-app-sm font-medium mb-4 opacity-70">Valeur estimée du bien</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <input 
                type="range" 
                min="20000" 
                max="2000000" 
                step="5000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="flex-1 accent-secondary cursor-pointer"
              />
              <span className="sm:w-32 text-left sm:text-right font-display font-bold text-app-md">{formatCurrency(propertyValue)}</span>
            </div>
          </div>

          <div>
            <label className="block text-app-sm font-medium mb-4 opacity-70">Besoin en trésorerie</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <input 
                type="range" 
                min="2500" 
                max={propertyValue} 
                step="500"
                value={fundingNeed}
                onChange={(e) => setFundingNeed(Number(e.target.value))}
                className="flex-1 accent-primary cursor-pointer"
              />
              <span className="sm:w-32 text-left sm:text-right font-display font-bold text-app-md">{formatCurrency(fundingNeed)}</span>
            </div>
          </div>

          <div className="p-4 bg-primary/5 rounded-2xl flex gap-3 italic text-app-sm">
            <Info className="w-5 h-5 shrink-0 text-primary" />
            <p>Cette simulation est donnée à titre indicatif selon les conditions actuelles du marché (ICM).</p>
          </div>

          {isTooHigh && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex gap-3 text-app-sm border border-red-100">
              <Zap className="w-5 h-5 shrink-0 text-red-500" />
              <p className="font-semibold">Vous ne pouvez pas prétendre si le besoin est trop supérieur à la valeur du bien (voir le mode de calcul dans nos derniers échanges).</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-app-lg font-display font-bold mb-6">Montant d'intervention possible</h3>
          {offers.map((offer) => {
            const baseIntervention = propertyValue * offer.ratio;
            const netVendeur = baseIntervention * (1 - (offer.feeYearly * 2));
            const isFeasible = netVendeur >= fundingNeed;
            const ltvPercent = offer.ratio * 100;

            return (
              <motion.div 
                key={offer.id}
                layout
                onClick={() => isFeasible && setSelectedOffer(offer.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all p-relative overflow-hidden cursor-pointer",
                  isFeasible ? (selectedOffer === offer.id ? "border-primary dark:border-secondary bg-primary/5 shadow-inner" : "border-black/5 dark:border-white/5 opacity-80") : "opacity-30 border-transparent grayscale cursor-not-allowed"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase", offer.id === 'equilibre' || offer.id === 'prudente' ? "bg-secondary text-primary" : "bg-primary text-secondary")}>
                        {offer.name}
                      </span>
                      <span className="text-app-xs font-medium opacity-60">LTV {ltvPercent}%</span>
                    </div>
                    <p className="text-[10px] opacity-70 max-w-[200px] mt-1 line-clamp-2">{offer.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn("text-app-md font-bold", isFeasible ? "text-success" : "text-neutral-500")}>
                      {isFeasible ? formatCurrency(baseIntervention) : 'Refusé'}
                    </span>
                    <p className={cn("text-[10px] uppercase font-bold mt-1", isFeasible ? "text-success/60" : "text-neutral-500/60")}>
                      {isFeasible ? "Vente temporaire estimée" : "Critères non atteints"}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5">
                  <div className="flex justify-between items-center mb-1 text-[10px] font-bold uppercase transition-opacity">
                    <span className={isFeasible ? "opacity-70" : "text-red-500 opacity-100"}>Net vendeur disponible: {formatCurrency(netVendeur)}</span>
                    <span className="opacity-40 text-right">Frais: {offer.feeYearly * 100}%/an</span>
                  </div>
                  <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      key={`${offer.id}-${ltvPercent}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${ltvPercent}%` }}
                      className={cn("h-full", !isFeasible ? "bg-red-500" : offer.id === 'equilibre' ? "bg-secondary" : "bg-primary")}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-10 flex justify-center">
        <button 
          onClick={handleInitialize}
          disabled={isTooHigh}
          className={cn(
            "button-primary px-10 py-4 rounded-full font-display font-bold text-app-md transition-all shadow-xl flex items-center gap-2",
            isTooHigh 
              ? "bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none" 
              : "bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/20"
          )}
        >
          Initialiser mon dossier <Zap className={cn("w-5 h-5", isTooHigh ? "text-neutral-400" : "fill-secondary text-secondary")} />
        </button>
      </div>
    </div>
  );
}
