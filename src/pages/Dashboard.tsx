import React from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  FileText,
  Users,
  Wallet,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, cn, formatRole } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const isPro = profile?.role === 'professionnel';
  const isAdmin = profile?.role === 'institution' || profile?.role === 'gestionnaire';

  const stats = [
    { label: isAdmin ? 'Total Dossiers' : 'Dossiers Actifs', value: '12', icon: Briefcase, color: 'text-primary' },
    { label: isAdmin ? 'Total Fonds' : 'Fonds Engagés', value: formatCurrency(1240000), icon: Wallet, color: 'text-secondary' },
    { label: 'Taux de Sortie', value: '94%', icon: TrendingUp, color: 'text-success' },
    { label: 'Documents à Valider', value: '5', icon: FileText, color: 'text-warning' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Bonjour, {profile?.displayName}</h1>
          <p className="text-neutral-dark/60">
            {profile?.isPro 
              ? `Espace Professionnel (${formatRole(profile.professionalData?.subRole || '')}) - Gestion de vos dossiers et leads.`
              : 'Espace Particulier - Suivez l\'avancement de votre projet immobilier.'}
          </p>
        </div>
        <button 
          onClick={() => navigate('/dossiers/new')}
          className="bg-primary text-white px-6 py-3 rounded-xl font-display font-bold hover:scale-105 transition-transform flex items-center gap-2 self-start sm:self-center"
        >
          Nouveau Dossier +
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-3xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl bg-black/5 dark:bg-white/5", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-success flex items-center gap-1">
                +12% <TrendingUp className="w-3 h-3" />
              </span>
            </div>
            <p className="text-sm font-medium opacity-60">{stat.label}</p>
            <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">Performance Financière</h2>
            <select className="bg-transparent border border-black/10 dark:border-white/10 rounded-lg px-3 py-1 text-sm font-medium focus:outline-none">
              <option>6 derniers mois</option>
              <option>12 derniers mois</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A2B4E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0A2B4E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}€`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '16px', 
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area type="monotone" dataKey="value" stroke="#0A2B4E" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Needed */}
        <div className="glass p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-display font-bold">Actions Requises</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 group hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-white dark:bg-[#1a2234] rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                  <AlertCircle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="font-bold text-sm">Document Manquant</p>
                  <p className="text-xs opacity-60">Dossier #782 - Diagnostic ERP</p>
                  <p className="text-[10px] uppercase font-bold text-primary mt-2 flex items-center gap-1 cursor-pointer hover:underline">
                    Uploader <FileText className="w-3 h-3" />
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 rounded-2xl border-2 border-black/5 dark:border-white/5 font-display font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            Voir tous les dossiers
          </button>
        </div>
      </div>
      
      {/* Active Pipeline */}
      <div className="glass p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-xl font-display font-bold">Pipeline Dossiers</h2>
           <div className="flex gap-2">
             {['Tous', 'En cours', 'Validés'].map(filter => (
               <button key={filter} className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", filter === 'Tous' ? "bg-primary text-white" : "hover:bg-black/5 dark:hover:bg-white/5 opacity-60")}>
                 {filter}
               </button>
             ))}
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm font-medium opacity-60">
                <th className="pb-4 pr-4">ID</th>
                <th className="pb-4 px-4">Bien / Adresse</th>
                <th className="pb-4 px-4">Offre</th>
                <th className="pb-4 px-4">Valeur Prise</th>
                <th className="pb-4 px-4">Statut</th>
                <th className="pb-4 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="py-4 pr-4 font-mono text-sm">#WN-00{i}</td>
                  <td className="py-4 px-4">
                    <p className="font-bold">Villa Mediterranean</p>
                    <p className="text-xs opacity-60">Barcelone, Espagne</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded bg-secondary/20 text-primary text-[10px] font-bold uppercase transition-colors group-hover:bg-secondary group-hover:text-white">
                      Équilibre
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold">{formatCurrency(450000)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-sm font-medium">Validé</span>
                    </div>
                  </td>
                  <td className="py-4 pl-4 text-right">
                    <button className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];
