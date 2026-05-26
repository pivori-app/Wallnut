import React, { useCallback } from 'react';
import { cn } from '../../../lib/utils';
import type { PropertyData } from '../types/property';
import type { UnderwritingResult } from '../hooks/usePropertyUnderwriting';
import { usePropertyUnderwriting } from '../hooks/usePropertyUnderwriting';
import { formatCurrency, resolveAddress } from '../utils/helpers';
import { Building2, MapPin, ChevronRight, Activity, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface PropertyCardProps {
  property: PropertyData;
  onClick: () => void;
}

const LIGHT_STYLES = {
  Vert: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Orange: 'bg-amber-50 text-amber-700 border-amber-200',
  Rouge: 'bg-red-50 text-red-700 border-red-200',
};

const DOT_STYLES = {
  Vert: 'bg-emerald-500',
  Orange: 'bg-amber-500',
  Rouge: 'bg-red-500',
};

export const PropertyCard = React.memo(function PropertyCard({ property, onClick }: PropertyCardProps) {
  const results = usePropertyUnderwriting(property);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);

  const lightClass = LIGHT_STYLES[results.dossierLight];
  const dotClass = DOT_STYLES[results.dossierLight];
  const legalClass = LIGHT_STYLES[results.legalLight];
  const legalDot = DOT_STYLES[results.legalLight];

  return (
    <motion.article
      role="button"
      tabIndex={0}
      aria-label={`Dossier ${property.type} à ${property.city} - Score ${results.fundScore}/100 - ${results.reco}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        "group relative flex flex-col h-full rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
        results.dossierLight === 'Vert' && 'border-emerald-200 hover:border-emerald-300',
        results.dossierLight === 'Orange' && 'border-amber-200 hover:border-amber-300',
        results.dossierLight === 'Rouge' && 'border-red-200 hover:border-red-300'
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Building2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <span className="truncate">{property.type}</span>
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-300">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="truncate">{resolveAddress(property.address)}, {property.city}</span>
          </p>
        </div>
        <div className={cn("flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border", lightClass)}>
          <span className={cn("h-2 w-2 rounded-full", dotClass)} aria-hidden="true" />
          <span>Feu {results.dossierLight}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
        <MetricRow label="Score Global" value={`${results.fundScore}/100`} accent={results.fundScore >= 70} icon={<Activity className="h-4 w-4" />} />
        <MetricRow label="Avis Expert" value={results.expertOpinion} />
        <MetricRow label="Décision" value={results.reco} badge />
        <MetricRow label="Valeur Réf." value={formatCurrency(results.referenceValue)} />
        <MetricRow label="LTV Cible" value={`${Math.round(results.baseIntervention / results.referenceValue * 100)}%`} />
        <MetricRow label="Marge Sécur." value={`${Math.round(results.securityMargin * 100)}%`} accent />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-blue-50 p-3 text-center border border-blue-100">
          <span className="block text-[10px] font-semibold uppercase text-blue-600/70">Base Intervention</span>
          <span className="text-lg font-bold text-blue-700">{formatCurrency(results.baseIntervention)}</span>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 text-center border border-emerald-100">
          <span className="block text-[10px] font-semibold uppercase text-emerald-600/70">Net Client</span>
          <span className="text-lg font-bold text-emerald-700">{formatCurrency(results.netClientImmediat)}</span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between rounded-lg bg-gray-50 p-3 border border-gray-100">
        <div className={cn("flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium border", legalClass)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", legalDot)} />
          Légalité {results.legalLight}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-600 dark:text-neutral-300">Score: {results.legalQualityScore}/100</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.article>
  );
});

interface MetricRowProps {
  label: string;
  value: string;
  accent?: boolean;
  badge?: boolean;
  icon?: React.ReactNode;
}

function MetricRow({ label, value, accent, badge, icon }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-neutral-600 dark:text-neutral-300">{label}</span>
      <div className="flex items-center gap-1.5">
        {icon}
        {badge ? (
          <span className={cn(
            "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            value === 'Go' && 'bg-emerald-100 text-emerald-700',
            value === 'À revoir' && 'bg-amber-100 text-amber-700',
            value === 'No Go' && 'bg-red-100 text-red-700'
          )}>
            {value}
          </span>
        ) : (
          <span className={cn("text-sm font-semibold", accent ? 'text-emerald-600' : 'text-gray-900')}>
            {value}
          </span>
        )}
      </div>
    </div>
  );
}
