import React from 'react';
import { motion } from 'motion/react';
import { Home, CheckCircle2, Clock, AlertCircle, ChevronRight, Building2, Trees, MapPin } from 'lucide-react';
import { PropertyType } from '../constants/property';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export interface PropertyData {
  id: string;
  type: PropertyType;
  address: string;
  city: string;
  estimatedValue: number;
  status: 'draft' | 'documents_pending' | 'analysis' | 'validated' | 'rejected';
  isComplete: boolean;
  createdAt: Date;
}

export interface PropertyCardProps {
  property: PropertyData;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const getStatusDisplay = () => {
    switch(property.status) {
      case 'validated': return { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Validé' };
      case 'analysis': return { icon: Clock, color: 'text-secondary', bg: 'bg-secondary/10', label: 'En analyse' };
      case 'documents_pending': return { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10', label: 'Documents attendus' };
      case 'rejected': return { icon: AlertCircle, color: 'text-[#ff4444]', bg: 'bg-[#ff4444]/10', label: 'Refusé' };
      default: return { icon: Clock, color: 'text-neutral-dark/40', bg: 'bg-black/5', label: 'Brouillon' };
    }
  };

  const getIconForType = (type: PropertyType) => {
    if (['Appartement', 'Immeuble', 'Immeuble de rapport', 'Local commercial', "Local d'activité", 'Bureaux', 'Entrepôt / Local industriel', 'Murs', 'Fonds de commerce', 'Entreprise'].includes(type)) return Building2;
    if (['Terrain', 'Terrain de loisirs', 'Domaine forestier', 'Bois de chasse', 'Territoire de chasse', 'Etang'].includes(type)) return Trees;
    return Home; // Maison, Villa, Manoir, Château, Moulin, Péniche, etc.
  };

  const statusConfig = getStatusDisplay();
  const TypeIcon = getIconForType(property.type);

  return (
    <Link to={`/dashboard/property/${property.id}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="glass p-6 rounded-3xl border border-black/5 hover:border-secondary/20 transition-all cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
              <TypeIcon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary">{property.type}</h3>
              <p className="text-sm text-neutral-dark/60 flex items-center gap-1 mt-1">
                <MapPin size={14} /> {property.city}
              </p>
            </div>
          </div>
          
          <div className={cn("px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold", statusConfig.bg, statusConfig.color)}>
            <statusConfig.icon size={14} />
            {statusConfig.label}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-black/5 pb-4">
            <span className="text-sm opacity-60">Valeur estimée</span>
            <span className="font-display font-bold text-xl">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.estimatedValue)}</span>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", property.isComplete ? "bg-success" : "bg-warning animate-pulse")} />
              <span className="text-xs font-semibold opacity-80">
                {property.isComplete ? "Dossier Médical Complet" : "Documents requis"}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-colors">
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
