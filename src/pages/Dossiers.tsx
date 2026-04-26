import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, cn } from '../lib/utils';
import { Search, Filter, MoreVertical, Plus, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function Dossiers() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const STATUS_MAP: Record<string, { label: string, color: string, icon: any }> = {
    draft: { label: 'Brouillon', color: 'bg-neutral-dark/10 text-neutral-dark', icon: FileText },
    submitted: { label: 'Soumis', color: 'bg-primary/10 text-primary', icon: Clock },
    in_review: { label: 'En cours', color: 'bg-warning/10 text-warning', icon: Clock },
    approved: { label: 'Approuvé', color: 'bg-success/10 text-success', icon: CheckCircle2 },
    active: { label: 'Actif', color: 'bg-primary text-secondary', icon: CheckCircle2 },
  };

  useEffect(() => {
    if (!user) return;

    const fetchDossiers = async () => {
      setLoading(true);
      try {
        let q;
        if (profile?.role === 'institution' || profile?.role === 'gestionnaire') {
          // Admins see everything
          q = query(collection(db, 'dossiers'), orderBy('createdAt', 'desc'));
        } else {
          // Clients only see their own dossiers
          q = query(
            collection(db, 'dossiers'), 
            where('clientId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
        }
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          ...(doc.data() as any),
          id: doc.id
        }));
        setDossiers(data);
      } catch (error) {
        console.error("Error fetching dossiers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDossiers();
  }, [user, profile]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Mes Dossiers</h1>
          <p className="text-neutral-dark/60">Gérez et suivez l'avancement de vos demandes de portage.</p>
        </div>
        <button 
          onClick={() => navigate('/dossiers/new')}
          className="bg-primary text-white px-6 py-3 rounded-xl font-display font-bold flex items-center gap-2 self-start sm:self-center"
        >
          Nouveau Dossier <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
          <input 
            type="text" 
            placeholder="Rechercher une adresse, un client, un ID..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1a2234] border border-black/5 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
        <div className="flex bg-white dark:bg-[#1a2234] p-1 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
          {['all', 'active', 'pending', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                filter === f ? "bg-primary text-white" : "hover:bg-black/5 dark:hover:bg-white/5 opacity-60"
              )}
            >
              {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : f === 'pending' ? 'En attente' : 'Terminés'}
            </button>
          ))}
        </div>
        <button className="p-3 bg-white dark:bg-[#1a2234] border border-black/5 dark:border-white/5 rounded-2xl shadow-sm hover:bg-black/5 transition-all">
          <Filter className="w-5 h-5 opacity-60" />
        </button>
      </div>

      {/* Dossier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dossiers.map((dossier, idx) => {
          const statusInfo = STATUS_MAP[dossier.status] || STATUS_MAP.draft;
          return (
            <motion.div
              key={dossier.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-6 rounded-3xl hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="font-mono text-xs opacity-40">{dossier.id}</span>
                <button className="p-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-display font-bold leading-tight line-clamp-2">{dossier.address}</h3>
                  <p className="text-sm opacity-60 mt-1">{dossier.client}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={cn("px-2 py-1 rounded-lg text-[10px] font-bold uppercase", statusInfo.color)}>
                    {statusInfo.label}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-secondary/10 text-primary text-[10px] font-bold uppercase">
                    {dossier.offer}
                  </span>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-40">Valeur estimée</p>
                    <p className="font-display font-bold">{formatCurrency(dossier.value)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold opacity-40">Dernière MAJ</p>
                    <p className="text-xs font-medium">Il y a 2h</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 py-3 rounded-xl bg-primary/5 dark:bg-white/5 font-bold text-sm hover:bg-primary hover:text-white transition-all">
                Voir les détails
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
