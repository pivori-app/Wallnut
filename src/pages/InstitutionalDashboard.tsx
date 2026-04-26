import React from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  Users, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

const OFFERS_DATA = [
  { name: 'Premium', value: 45, color: '#0A2B4E' },
  { name: 'Équilibre', value: 35, color: '#C79A2E' },
  { name: 'Prudente', value: 20, color: '#2E6F40' },
];

const REVENUE_DATA = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 59000 },
  { month: 'Jun', revenue: 72000 },
];

export function InstitutionalDashboard() {
  const kpis = [
    { label: 'Chiffre d\'Affaires (V4.1)', value: formatCurrency(342000), trend: '+18.5%', positive: true, icon: DollarSign },
    { label: 'Encours Total', value: formatCurrency(12450000), trend: '+5.2%', positive: true, icon: BarChart3 },
    { label: 'TRI Moyen', value: '14.2%', trend: '-0.3%', positive: false, icon: TrendingUp },
    { label: 'Partenaires Actifs', value: '38', trend: '+4', positive: true, icon: Users },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Pilotage Institutionnel</h1>
          <p className="text-neutral-dark/60 italic mt-1 font-medium">Vue consolidée finance et risques de la plateforme Wallnut.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-sm font-bold hover:bg-black/5 transition-all">
            <Download className="w-4 h-4" /> Export Audit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            Rapport Trimestriel
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-3xl border-l-4 border-l-primary"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className={cn("flex items-center gap-1 text-xs font-bold", kpi.positive ? "text-success" : "text-danger")}>
                {kpi.trend} {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <p className="text-sm font-medium opacity-60 mb-1">{kpi.label}</p>
            <p className="text-2xl font-display font-bold">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-display font-bold flex items-center gap-2">
               <DollarSign className="w-5 h-5 text-secondary" /> Volume d'affaires Mensuel
             </h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(v) => `${v/1000}k€`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(10, 43, 78, 0.05)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="#0A2B4E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Offer Distribution */}
        <div className="glass p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-display font-bold">Répartition des Offres</h2>
          <div className="h-[250px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={OFFERS_DATA}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {OFFERS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="space-y-4 pr-4">
              {OFFERS_DATA.map((offer) => (
                <div key={offer.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: offer.color }}></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{offer.name}</p>
                    <p className="text-xs opacity-60">{offer.value}% des dossiers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-danger/5 border border-danger/10 flex gap-3 text-xs text-danger">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p>Attention : Forte concentration sur l'offre Premium (45%). Envisager un réajustement des taux au T3.</p>
          </div>
        </div>
      </div>

      {/* Partner Performance Table */}
      <div className="glass overflow-hidden rounded-3xl">
        <div className="p-8 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
          <h2 className="text-xl font-display font-bold">Performance Partenaires Apporteurs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider opacity-40 px-8">
                <th className="py-6 pl-8">Partenaire</th>
                <th className="py-6 px-4">Nb Dossiers</th>
                <th className="py-6 px-4">Encours Géré</th>
                <th className="py-6 px-4">Commissions</th>
                <th className="py-6 px-4">Score Risque</th>
                <th className="py-6 pr-8 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {[
                { name: 'ImmoInvest Paris', count: 14, volume: 4200000, comms: 126000, risk: 'A+' },
                { name: 'Riviera Portafolio', count: 9, volume: 3100000, comms: 93000, risk: 'A' },
                { name: 'Catalunya Capital', count: 7, volume: 2400000, comms: 72000, risk: 'B+' },
                { name: 'Lyon Patrimoine', count: 4, volume: 1450000, comms: 43500, risk: 'A-' },
              ].map((p, i) => (
                <tr key={i} className="hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                  <td className="py-5 pl-8 font-bold">{p.name}</td>
                  <td className="py-5 px-4 font-medium">{p.count}</td>
                  <td className="py-5 px-4 font-bold">{formatCurrency(p.volume)}</td>
                  <td className="py-5 px-4 text-secondary font-bold">{formatCurrency(p.comms)}</td>
                  <td className="py-5 px-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold",
                      p.risk.startsWith('A') ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                    )}>
                      {p.risk}
                    </span>
                  </td>
                  <td className="py-5 pr-8 text-right">
                    <button className="text-primary hover:underline text-xs font-bold">Explorer ➜</button>
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
