import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useProperties } from '../features/particulier-dashboard/hooks/useProperties';
import { 
  DollarSign, 
  Users, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ChevronDown
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
import { calculateAssetUnderwriting, synthesizePortfolio, AssetData } from '../lib/underwritingEngine';
import { PropertyDetailsView } from '../components/PropertyDetailsView';

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

// Mock data representant les onglets D01 à D10
const mockAssets: AssetData[] = [
  {
    id: "D01", clientId: "CL01", clientName: "Jean Dupont", clientType: "PP", clientStatus: "Particulier",
    city: "Paris", propertyType: "Appartement", referenceValue: 400000, surface: 65, offerTarget: "Premium",
    existingDebt: 120000, agencyFees: 15000, actFees: 8000, marketLiquidityDelay: 35, legalQualityScore: 85,
    assetQuality: 4, exitReadability: 4, sellerProfile: 3, complexity: 2, benchmarkPrice: 6200,
    distanceLargeCity: 2, accessTimeLargeCity: 10, population: 2000000
  },
  {
    id: "D02", clientId: "CL02", clientName: "SCI Le Phare", clientType: "PM", clientStatus: "SCI",
    city: "Lyon", propertyType: "Maison", referenceValue: 600000, surface: 140, offerTarget: "Équilibre",
    existingDebt: 250000, agencyFees: 20000, actFees: 12000, marketLiquidityDelay: 60, legalQualityScore: 90,
    assetQuality: 5, exitReadability: 3, sellerProfile: 4, complexity: 3, benchmarkPrice: 4200,
    distanceLargeCity: 10, accessTimeLargeCity: 25, population: 500000
  },
  {
    id: "D03", clientId: "CL03", clientName: "Marie Dubois", clientType: "PP", clientStatus: "Particulier",
    city: "Bordeaux", propertyType: "Appartement", referenceValue: 250000, surface: 45, offerTarget: "Prudente",
    existingDebt: 80000, agencyFees: 10000, actFees: 5000, marketLiquidityDelay: 120, legalQualityScore: 60,
    assetQuality: 3, exitReadability: 3, sellerProfile: 2, complexity: 4, benchmarkPrice: 5500,
    distanceLargeCity: 5, accessTimeLargeCity: 15, population: 250000
  },
  {
    id: "D04", clientId: "CL03", clientName: "Marie Dubois", clientType: "PP", clientStatus: "Particulier",
    city: "Bordeaux", propertyType: "Maison", referenceValue: 350000, surface: 110, offerTarget: "Premium",
    existingDebt: 100000, agencyFees: 12000, actFees: 7000, marketLiquidityDelay: 40, legalQualityScore: 70,
    assetQuality: 4, exitReadability: 4, sellerProfile: 3, complexity: 2, benchmarkPrice: 3200,
    distanceLargeCity: 40, accessTimeLargeCity: 50, population: 15000
  }
];

export function InstitutionalDashboard() {
  const [activeTab, setActiveTab] = useState<'comite' | 'fonds' | 'clients'>('comite');
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<any>(null);
  const { properties, isLoading } = useProperties();
  
  const mergedAssets = useMemo(() => {
    // Convert real properties to AssetData shape, fallback/append to mockAssets if needed.
    // For now we map real properties and append existing mock assets for a rich dashboard.
    const realAssets: AssetData[] = properties.map(p => ({
      id: "D" + p.id.substring(0, 4).toUpperCase(),
      clientId: "CL_" + p.id.substring(0, 3).toUpperCase(),
      clientName: "Client " + p.id.substring(0, 3),
      clientType: "PP",
      clientStatus: "Particulier",
      city: p.city || p.address?.city || 'Paris',
      propertyType: p.type || 'Appartement',
      referenceValue: typeof p.estimatedValue === 'number' ? p.estimatedValue : parseFloat((p.estimatedValue as any) || '250000'),
      surface: typeof p.surface === 'number' ? p.surface : parseFloat((p.surface as any) || '65'),
      offerTarget: 'Équilibre',
      existingDebt: p.estimatedValue * 0.1, // mock assumption
      agencyFees: 10000,
      actFees: 5000,
      marketLiquidityDelay: 45,
      legalQualityScore: 85,
      assetQuality: 4, exitReadability: 4, sellerProfile: 3, complexity: 2, benchmarkPrice: 6200,
      distanceLargeCity: 2, accessTimeLargeCity: 10, population: 2000000
    }));
    return [...realAssets, ...mockAssets];
  }, [properties]);

  const underwrittenAssets = useMemo(() => mergedAssets.map(calculateAssetUnderwriting), [mergedAssets]);
  const synthesis = useMemo(() => synthesizePortfolio(underwrittenAssets), [underwrittenAssets]);

  const clients = useMemo(() => {
    const map = new Map<string, any>();
    underwrittenAssets.forEach(a => {
      if (!map.has(a.clientId)) {
        map.set(a.clientId, {
          clientId: a.clientId, clientName: a.clientName, clientType: a.clientType, clientStatus: a.clientStatus,
          assets: [], totalRefValue: 0, totalBaseIntervention: 0, totalDebt: 0, avgLiquidity: 0, avgFundScore: 0
        });
      }
      const c = map.get(a.clientId);
      c.assets.push(a);
      c.totalRefValue += a.referenceValue;
      c.totalBaseIntervention += a.baseIntervention;
      c.totalDebt += a.existingDebt;
    });

    return Array.from(map.values()).map(c => {
      c.avgLiquidity = c.assets.reduce((sum: number, a: any) => sum + a.liquidityIndex, 0) / c.assets.length;
      c.avgFundScore = c.assets.reduce((sum: number, a: any) => sum + a.fundScore, 0) / c.assets.length;
      c.LTV = c.totalBaseIntervention / c.totalRefValue;
      
      let decision = "No-Go";
      if (c.avgFundScore >= 75) decision = "Go";
      else if (c.avgFundScore >= 60) decision = "Go sous conditions";
      else if (c.avgFundScore >= 50) decision = "À revoir";

      c.decision = decision;
      return c;
    });
  }, [underwrittenAssets]);

  const topKpis = [
    { label: 'Biens Saisis', value: synthesis.seizedAssetsCount, icon: BarChart3, positive: true },
    { label: 'Dossiers Actifs', value: synthesis.activeClientsCount, icon: Users, positive: true },
    { label: 'Valeur Totale (€)', value: formatCurrency(synthesis.totalValue), icon: DollarSign, positive: true },
    { label: 'Score Fonds Moyen', value: `${synthesis.avgFundScore.toFixed(1)}/100`, icon: ShieldCheck, positive: synthesis.avgFundScore >= 75 },
    { label: 'Nb Feu Vert', value: synthesis.nbFeuVert, icon: CheckCircle2, positive: true, color: 'text-success' },
    { label: 'Nb Feu Orange', value: synthesis.nbFeuOrange, icon: Clock, positive: false, color: 'text-warning' },
    { label: 'Nb Feu Rouge', value: synthesis.nbFeuRouge, icon: XCircle, positive: false, color: 'text-danger' },
    { label: 'Marge Sécurité Moy.', value: `${(synthesis.avgSecurityMargin * 100).toFixed(1)}%`, icon: TrendingUp, positive: synthesis.avgSecurityMargin >= 0.2 },
  ];

  if (selectedPropertyDetails) {
    return (
       <div className="relative min-h-[90vh] bg-[#0A0A0E] text-white p-4 sm:p-10 xs:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 rounded-[2.5rem]">
          <PropertyDetailsView property={selectedPropertyDetails} onBack={() => setSelectedPropertyDetails(null)} />
       </div>
    );
  }

  return (
    <div className="relative min-h-[90vh] bg-[#0A0A0E] text-white p-4 sm:p-10 xs:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 rounded-[2.5rem]">
      {/* 3D Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/40 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">Pilotage Institutionnel & Comité</h1>
            <p className="text-white/50 italic mt-1 font-medium">Validation, Synthèse Fonds et Consolidation Clients (V4.1) — Accès Habilité.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="touch-target flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <Download className="w-4 h-4" /> Exporter Data
            </button>
          </div>
        </div>

        <div className="flex gap-2 p-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl w-fit overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('comite')} 
            className={cn("px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap", activeTab === 'comite' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white hover:bg-white/10")}
          >
            Page Comité
          </button>
          <button 
            onClick={() => setActiveTab('fonds')} 
            className={cn("px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap", activeTab === 'fonds' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white hover:bg-white/10")}
          >
            Synthèse Fonds (Biens)
          </button>
          <button 
            onClick={() => setActiveTab('clients')} 
            className={cn("px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap", activeTab === 'clients' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white hover:bg-white/10")}
          >
            Dossiers Clients Consol.
          </button>
        </div>

      {activeTab === 'comite' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Synthesis Grid - as defined in formulas 1. Page comité */}
          <div className="@container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topKpis.map((kpi, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card-3d p-6 rounded-3xl border-l-4 border-l-primary"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                  </div>
                </div>
                <p className="text-app-sm font-medium opacity-60 mb-1">{kpi.label}</p>
                <p className="text-app-xl font-display font-bold">{kpi.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="@container grid lg:grid-cols-2 gap-8">
            {/* Synthèse Financière */}
            <div className="glass-card-3d p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-app-lg font-display font-bold flex items-center gap-2">
                   <DollarSign className="w-5 h-5 text-secondary" /> Base d'Intervention Consolidée
                 </h2>
              </div>
              <div className="space-y-4 pt-4">
                   <div className="flex justify-between border-b border-black/5 pb-2">
                     <span className="font-bold">Base intervention totale :</span>
                     <span className="font-display font-bold text-primary">{formatCurrency(synthesis.totalBaseIntervention)}</span>
                   </div>
                   <div className="flex justify-between border-b border-black/5 pb-2">
                     <span className="font-bold">Passif total (Dettes) :</span>
                     <span className="font-display font-bold text-danger">{formatCurrency(synthesis.totalDebt)}</span>
                   </div>
                   <div className="flex justify-between border-b border-black/5 pb-2">
                     <span className="font-bold">Net client immédiat total :</span>
                     <span className="font-display font-bold text-success">{formatCurrency(synthesis.totalNetClient)}</span>
                   </div>
                   <div className="flex justify-between border-b border-black/5 pb-2">
                     <span className="font-bold">Liquidité moyenne /100 :</span>
                     <span className="font-display font-bold">{synthesis.avgLiquidity.toFixed(1)}</span>
                   </div>
                   <div className="flex justify-between pb-2">
                     <span className="font-bold">Attractivité moyenne /100 :</span>
                     <span className="font-display font-bold">{synthesis.avgAttractiveness.toFixed(1)}</span>
                   </div>
              </div>
            </div>

            {/* Decisions Dashboard */}
            <div className="glass-card-3d p-8 rounded-3xl space-y-6">
              <h2 className="text-app-lg font-display font-bold">Répartition Décisions (Portfolio)</h2>
              <div className="h-[250px] flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={[
                        { name: 'Go', value: synthesis.nbGo, color: '#2E6F40' },
                        { name: 'À revoir', value: synthesis.nbARevoir, color: '#C79A2E' },
                        { name: 'No-Go', value: synthesis.nbNoGo, color: '#A32A2A' },
                      ]}
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {[
                        { name: 'Go', value: synthesis.nbGo, color: '#2E6F40' },
                        { name: 'À revoir', value: synthesis.nbARevoir, color: '#C79A2E' },
                        { name: 'No-Go', value: synthesis.nbNoGo, color: '#A32A2A' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }} />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="space-y-4 pr-4">
                  {[
                    { name: 'Go', value: synthesis.nbGo, color: '#2E6F40' },
                    { name: 'À revoir', value: synthesis.nbARevoir, color: '#C79A2E' },
                    { name: 'No-Go', value: synthesis.nbNoGo, color: '#A32A2A' },
                  ].map((offer) => (
                    <div key={offer.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: offer.color }}></div>
                      <div className="flex-1">
                        <p className="text-app-sm font-bold">{offer.name}</p>
                        <p className="text-app-xs opacity-60">{offer.value} dossiers</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Exposition au Risque (LTV vs Passif) Graph */}
            <div className="glass-card-3d p-8 rounded-3xl space-y-6 lg:col-span-2">
              <h2 className="text-app-lg font-display font-bold">Exposition au Risque par Dossier (Base vs Passif)</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={underwrittenAssets.slice(0, 10)}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                    <XAxis dataKey="id" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.6 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.6 }} tickFormatter={(val) => `€${val / 1000}k`} />
                    <Tooltip 
                      cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                      contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} 
                      formatter={(val: number) => formatCurrency(val)} 
                    />
                    <Bar dataKey="baseIntervention" name="Base Intervention" fill="#0A2B4E" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="existingDebt" name="Passif (Dettes)" fill="#A32A2A" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'fonds' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-3d rounded-3xl overflow-hidden">
           <div className="p-8 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/10">
             <h2 className="text-app-lg font-display font-bold">Consolidation des biens D01 à D10</h2>
           </div>
           <div className="overflow-x-auto w-full">
            <table className="w-full text-left whitespace-nowrap text-app-sm">
              <thead>
                <tr className="font-bold uppercase tracking-wider opacity-40 px-4 bg-black/5">
                  <th className="py-4 pl-6 pr-4">ID Bien</th>
                  <th className="py-4 px-4">Client</th>
                  <th className="py-4 px-4">Ville</th>
                  <th className="py-4 px-4">Valeur Réf.</th>
                  <th className="py-4 px-4">Base Interv.</th>
                  <th className="py-4 px-4">Passif</th>
                  <th className="py-4 px-4">Net Immédiat</th>
                  <th className="py-4 px-4">Score Fonds</th>
                  <th className="py-4 px-4">Reco</th>
                  <th className="py-4 px-4">Feu Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {underwrittenAssets.map((asset, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                    key={i} 
                    className="hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedPropertyDetails(asset)}
                  >
                    <td className="py-4 pl-6 pr-4 font-bold">{asset.id}</td>
                    <td className="py-4 px-4">{asset.clientId} - {asset.clientName}</td>
                    <td className="py-4 px-4">{asset.city}</td>
                    <td className="py-4 px-4 font-bold">{formatCurrency(asset.referenceValue)}</td>
                    <td className="py-4 px-4 font-bold text-primary">{formatCurrency(asset.baseIntervention)}</td>
                    <td className="py-4 px-4 text-danger font-bold">{formatCurrency(asset.existingDebt)}</td>
                    <td className="py-4 px-4 text-success font-bold">{formatCurrency(asset.netClientImmediat)}</td>
                    <td className="py-4 px-4 font-bold">{asset.fundScore}/100</td>
                    <td className="py-4 px-4 font-bold">{asset.reco}</td>
                    <td className="py-4 px-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold text-white",
                        asset.dossierLight === 'Vert' ? "bg-success" : 
                        asset.dossierLight === 'Orange' ? "bg-warning" : "bg-danger"
                      )}>
                        {asset.dossierLight}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
           </div>
        </motion.div>
      )}

      {activeTab === 'clients' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-3d rounded-3xl overflow-hidden">
           <div className="p-8 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/10">
             <h2 className="text-app-lg font-display font-bold">Consolidation Multi-Biens (Dossiers Clients)</h2>
           </div>
           <div className="overflow-x-auto w-full">
            <table className="w-full text-left whitespace-nowrap text-app-sm">
              <thead>
                <tr className="font-bold uppercase tracking-wider opacity-40 px-4 bg-black/5">
                  <th className="py-4 pl-6 pr-4">ID Client</th>
                  <th className="py-4 px-4">Nom</th>
                  <th className="py-4 px-4">Nb Biens</th>
                  <th className="py-4 px-4">Valeur Réf. Globale</th>
                  <th className="py-4 px-4">LTV Globale</th>
                  <th className="py-4 px-4">Liquidité M.</th>
                  <th className="py-4 px-4">Score Fonds M.</th>
                  <th className="py-4 px-4">Décision Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {clients.map((client, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                    key={i} 
                    className="hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedPropertyDetails(client.assets[0] || null)}
                  >
                    <td className="py-4 pl-6 pr-4 font-bold">{client.clientId}</td>
                    <td className="py-4 px-4">{client.clientName}</td>
                    <td className="py-4 px-4 font-bold">{client.assets.length}</td>
                    <td className="py-4 px-4 font-bold text-primary">{formatCurrency(client.totalRefValue)}</td>
                    <td className="py-4 px-4 font-bold">{(client.LTV * 100).toFixed(1)}%</td>
                    <td className="py-4 px-4 font-bold">{client.avgLiquidity.toFixed(1)}/100</td>
                    <td className="py-4 px-4 font-bold">{client.avgFundScore.toFixed(1)}/100</td>
                    <td className="py-4 px-4 font-bold text-secondary">{client.decision}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
           </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}
