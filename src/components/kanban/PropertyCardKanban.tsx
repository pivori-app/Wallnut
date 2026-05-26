import React from 'react';
import { PropertyData } from '../PropertyCard';
import { Building2, Trees, MapPin, MoreHorizontal, FileText, Phone, Euro } from 'lucide-react';
import { PROPERTY_TYPES } from '../../constants/property';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface PropertyCardKanbanProps {
  property: PropertyData;
  onOpenAgrafe: () => void;
}

export const PropertyCardKanban: React.FC<PropertyCardKanbanProps> = ({ property, onOpenAgrafe }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  
  const TypeIcon = property.type === 'Terrain' ? Trees : Building2;
  const completeness = property.completeness || 0;

  return (
    <div className="bg-white dark:bg-white/10 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-5 rounded-3xl shadow-xl relative group overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity">
      {/* Header */}
      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] shrink-0">
            <TypeIcon size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm text-neutral-900 dark:text-white/90 leading-tight truncate">{property.type}</h4>
            </div>
            <p className="text-[10px] text-neutral-600 dark:text-neutral-300 dark:text-white/50 font-medium truncate mt-0.5">Réf: {property.referenceNumber || property.id.slice(0,8)}</p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:text-white rounded-full transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-[#1a1a24]/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onOpenAgrafe();
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-neutral-900 dark:text-white hover:bg-gray-100 dark:bg-white/10 flex items-center gap-3 transition-colors"
                  >
                    <FileText size={16} className="text-blue-400" /> Voir le dossier
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-neutral-900 dark:text-white hover:bg-gray-100 dark:bg-white/10 flex items-center gap-3 border-t border-white/5 transition-colors"
                  >
                    <Phone size={16} className="text-neutral-500 dark:text-neutral-400" /> Contacter
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Body: Location & Financials */}
      <div className="relative z-10 mb-5 pl-1">
        <p className="text-xs text-neutral-900 dark:text-white/70 flex items-center gap-1.5 mb-3">
          <MapPin size={12} className="text-neutral-500 dark:text-neutral-400" /> {typeof property.city === 'string' ? property.city : 'Ville inconnue'}
        </p>
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest">Valeur</span>
            <div className="flex-1 border-b border-gray-200 dark:border-white/10 border-dashed mx-2"></div>
            <p className="font-mono font-bold text-blue-400">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.estimatedValue)}
            </p>
        </div>
      </div>

      {/* Footer: Completeness Progress */}
      <div className="relative z-10 space-y-2 pt-4 border-t border-gray-200 dark:border-white/10">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
          <span className="text-neutral-500 dark:text-neutral-400">Status Dossier</span>
          <span className={cn(
            completeness === 100 ? "text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" : "text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]"
          )}>{completeness === 100 ? 'COMPLET' : `${completeness}%`}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-50 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              completeness === 100 ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" : "bg-gradient-to-r from-yellow-500/50 to-yellow-400"
            )}
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>
    </div>
  );
};
