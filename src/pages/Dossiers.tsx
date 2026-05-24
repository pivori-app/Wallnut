import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, cn } from '../lib/utils';
import { Search, Filter, MoreVertical, Plus, FileText, CheckCircle2, Clock, MapPin, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../features/particulier-dashboard/hooks/useProperties';
import { PropertyData } from '../components/PropertyCard';
import { PropertyDetailsView } from '../components/PropertyDetailsView';

export function Dossiers() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const { properties, isLoading } = useProperties();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);

  const STATUS_MAP: Record<string, { label: string, color: string, icon: any }> = {
    documents_pending: { label: 'Doc. Manquants', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400', icon: Clock },
    analysis: { label: 'Analyse IA', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: FileText },
    offer_issued: { label: 'Offre Émise', color: 'bg-green-500/10 text-green-600 dark:text-green-400', icon: CheckCircle2 },
    default: { label: 'Dossier', color: 'bg-neutral-dark/10 text-neutral-dark', icon: Building2 },
  };

  const filteredProperties = properties.filter(prop => {
    // Stage Filter
    if (filter === 'active' && prop.pipelineStage === 'closed') return false;
    if (filter === 'pending' && prop.isComplete) return false;
    if (filter === 'closed' && prop.pipelineStage !== 'closed') return false;
    
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      
      const getAddressString = (addr: any) => {
        if (!addr) return '';
        if (typeof addr === 'string') return addr;
        return addr.fullAddress || addr.city || '';
      };
      
      const matchSearch = 
        getAddressString(prop.address).toLowerCase().includes(q) ||
        (prop.city?.toLowerCase() || '').includes(q) ||
        (prop.clientName?.toLowerCase() || '').includes(q) ||
        (prop.referenceNumber?.toLowerCase() || '').includes(q);
      if (!matchSearch) return false;
    }
    return true;
  });

  if (selectedProperty) {
    return <PropertyDetailsView property={selectedProperty} onBack={() => setSelectedProperty(null)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-app-2xl font-display font-bold text-slate-900 dark:text-white">Mes Dossiers</h1>
          <p className="text-slate-500 dark:text-slate-400">Gérez et suivez l'avancement de vos demandes de portage.</p>
        </div>
        <button 
          onClick={() => navigate(profile?.role === 'professionnel' ? '/dashboard/pro' : '/dashboard/particulier')}
          className="bg-primary hover:scale-105 transition-transform text-white px-6 py-3 rounded-xl font-display font-bold flex items-center gap-2 self-start sm:self-center shadow-lg"
        >
          Nouveau Dossier <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 text-slate-800 dark:text-white" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une adresse, un client, une référence..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 font-medium"
          />
        </div>
        <div className="flex bg-white dark:bg-black/20 p-1 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
          {['all', 'active', 'pending', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                filter === f ? "bg-primary text-white shadow-md" : "text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10"
              )}
            >
              {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : f === 'pending' ? 'En attente' : 'Terminés'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-slate-500 dark:text-white/50">
          <Clock className="w-6 h-6 animate-spin mr-2" /> Chargement de vos dossiers...
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-20 glass-card-3d rounded-3xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 font-bold">
           Aucun dossier ne correspond à vos critères.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProperties.map((dossier, idx) => {
              const statusInfo = STATUS_MAP[dossier.status || 'documents_pending'] || STATUS_MAP.default;
              return (
                <motion.div
                  key={dossier.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 rounded-3xl hover:shadow-xl transition-all group flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-xs text-slate-400 dark:text-white/40 font-bold bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">ID: {dossier.referenceNumber || dossier.id.substring(0, 8)}</span>
                    <button className="p-2 -mr-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-display font-bold leading-tight line-clamp-2 text-slate-800 dark:text-white flex items-center gap-2">
                        <MapPin size={16} className="text-primary hidden sm:inline shrink-0" />
                        {typeof dossier.address === 'string' ? dossier.address : (dossier.address?.fullAddress || (typeof dossier.city === 'string' ? dossier.city : 'Adresse non renseignée') || 'Adresse non renseignée')}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-white/60 mt-1">{typeof dossier.city === 'string' ? dossier.city : 'Ville non renseignée'} • {dossier.type}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={cn("px-2 py-1 rounded-lg text-[10px] font-bold uppercase", statusInfo.color)}>
                        {statusInfo.label}
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-[10px] font-bold uppercase">
                        {dossier.completeness}% Complété
                      </span>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-white/40">Valeur estimée</p>
                        <p className="font-display font-bold text-slate-800 dark:text-white">{formatCurrency(dossier.estimatedValue)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-white/40">Créé le</p>
                        <p className="text-xs font-medium text-slate-600 dark:text-white/60">{new Date(dossier.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedProperty(dossier)}
                    className="w-full mt-6 py-3 rounded-xl bg-slate-50 dark:bg-white/5 font-bold text-sm text-slate-700 dark:text-white/80 hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    Voir les détails
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

