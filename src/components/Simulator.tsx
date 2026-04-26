import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ShieldCheck, Zap, Info } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

interface SimulatorProps {
  onInitialize?: (data: { propertyValue: number; fundingNeed: number; offerId: string }) => void;
}

export function Simulator({ onInitialize }: SimulatorProps) {
  const [propertyValue, setPropertyValue] = useState(300000);
  const [fundingNeed, setFundingNeed] = useState(150000);
  const [selectedOffer, setSelectedOffer] = useState('equilibre');

  const offers = [
    { 
      id: 'premium', 
      name: 'Premium', 
      ratio: 0.8, 
      color: 'bg-primary', 
      textColor: 'text-secondary',
      description: 'Liquidité maximale pour projets ambitieux.'
    },
    { 
      id: 'equilibre', 
      name: 'Équilibre', 
      ratio: 0.7, 
      color: 'bg-secondary', 
      textColor: 'text-primary',
      description: 'L’accord parfait entre liquidité et sécurité.'
    },
    { 
      id: 'prudente', 
      name: 'Prudente', 
      ratio: 0.6, 
      color: 'bg-success', 
      textColor: 'text-white',
      description: 'Protection maximale de votre patrimoine.'
    }
  ];

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
            <label className="block text-sm font-medium mb-4 opacity-70">Valeur estimée du bien</label>
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
              <span className="sm:w-32 text-left sm:text-right font-display font-bold text-lg">{formatCurrency(propertyValue)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-4 opacity-70">Besoin en trésorerie</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <input 
                type="range" 
                min="2500" 
                max={Math.max(2500, propertyValue * 0.8)} 
                step="500"
                value={fundingNeed}
                onChange={(e) => setFundingNeed(Number(e.target.value))}
                className="flex-1 accent-primary cursor-pointer"
              />
              <span className="sm:w-32 text-left sm:text-right font-display font-bold text-lg">{formatCurrency(fundingNeed)}</span>
            </div>
          </div>

          <div className="p-4 bg-primary/5 rounded-2xl flex gap-3 italic text-sm">
            <Info className="w-5 h-5 shrink-0 text-primary" />
            <p>Cette simulation est donnée à titre indicatif selon les conditions actuelles du marché (ICM).</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-display font-bold mb-6">Nos Offres de Portage</h3>
          {offers.map((offer) => {
            const maxFunding = propertyValue * offer.ratio;
            const isFeasible = fundingNeed <= maxFunding;

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
                  <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase", offer.id === 'equilibre' || offer.id === 'prudente' ? "bg-secondary text-primary" : "bg-primary text-secondary")}>
                      {offer.name}
                    </span>
                    <span className="text-xs font-medium opacity-60">Jusqu'à {offer.ratio * 100}%</span>
                  </div>
                  <span className="text-lg font-bold">{formatCurrency(maxFunding)}</span>
                </div>
                <p className="text-xs opacity-70 mb-4">{offer.description}</p>
                
                {isFeasible && (
                  <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(fundingNeed / maxFunding) * 100}%` }}
                      className={cn("h-full", offer.id === 'equilibre' ? "bg-secondary" : "bg-primary")}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-10 flex justify-center">
        <button 
          onClick={handleInitialize}
          className="button-primary px-10 py-4 rounded-full bg-primary text-white font-display font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
        >
          Initialiser mon dossier <Zap className="w-5 h-5 fill-secondary text-secondary" />
        </button>
      </div>
    </div>
  );
}
