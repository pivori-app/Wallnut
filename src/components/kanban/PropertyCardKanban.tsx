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
    <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-4 rounded-3xl shadow-lg relative group">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shrink-0">
            <TypeIcon size={14} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-primary leading-tight truncate px-1">{property.type}</h4>
            </div>
            <p className="text-[10px] text-neutral-dark/60 font-medium truncate px-1">ID: {property.referenceNumber || property.id.slice(0,8)}</p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 text-primary/40 hover:text-primary hover:bg-black/5 rounded-full transition-colors"
          >
            <MoreHorizontal size={16} />
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
                  className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-black/5 z-50 overflow-hidden"
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onOpenAgrafe();
                    }}
                    className="w-full text-left px-4 py-3 text-xs font-bold text-primary hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FileText size={14} className="text-secondary" /> Voir le dossier agrafé
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-xs font-bold text-primary hover:bg-slate-50 flex items-center gap-2 border-t border-black/5"
                  >
                    <Phone size={14} className="text-primary/60" /> Contacter le client
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Body: Location & Financials */}
      <div className="mb-4">
        <p className="text-xs text-neutral-dark/70 flex items-center gap-1 mb-2">
          <MapPin size={12} className="shrink-0" /> {property.city}
        </p>
        <div className="bg-primary/5 rounded-xl p-2.5 border border-primary/10">
          <p className="text-[10px] text-primary/60 font-bold uppercase tracking-wider mb-0.5">Valeur estimée</p>
          <p className="font-display font-bold text-lg text-primary">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.estimatedValue)}
          </p>
        </div>
      </div>

      {/* Footer: Completeness Progress */}
      <div className="space-y-1.5 pt-3 border-t border-black/5">
        <div className="flex justify-between items-center text-[10px] font-bold">
          <span className="text-primary/60">Smart Scanner Client</span>
          <span className={cn(
            completeness === 100 ? "text-success" : "text-secondary"
          )}>{completeness}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              completeness === 100 ? "bg-success" : "bg-gradient-to-r from-secondary to-primary/60"
            )}
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>
    </div>
  );
};
