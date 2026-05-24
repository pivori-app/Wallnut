import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Users, Search, Download, BarChart3, Receipt, LayoutDashboard, Send, Clock, AlertTriangle, FileCheck, Phone, CheckCircle2, Briefcase, Calculator, FileSignature, Landmark, X, Sun, Moon, Laptop } from 'lucide-react';
import { PropertyData } from '../../components/PropertyCard';
import { PropertyType } from '../../constants/property';
import { motion, AnimatePresence } from 'motion/react';
import { PropertyCreationWizard } from '../../components/PropertyCreationWizard';
import { B2BSimulator } from '../../components/B2BSimulator';
import { cn } from '../../lib/utils';
import { exportToDenonciationPDF } from '../../lib/pdfExporter';
import { BoardKanban } from '../../components/kanban/BoardKanban';
import { DropResult } from '@hello-pangea/dnd';
import { triggerWebhook } from '../../services/webhook';
import { calculateAssetUnderwriting, synthesizePortfolio, AssetData } from '../../lib/underwritingEngine';
import { PropertyDetailsView } from '../../components/PropertyDetailsView';
import { useProperties } from '../../features/particulier-dashboard/hooks/useProperties';
import { supabase } from '../../lib/supabase';
import { PartnerPackGenerator } from '../../components/PartnerPackGenerator';
import { useTheme } from '../../hooks/useTheme';

import { DataRoom } from '../../components/DataRoom';

export function ProDashboard() {
  const { profile } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  
  // Real properties state from Supabase
  const { properties, isLoading, createProperty, updateProperty, refetch } = useProperties();

  // Internal component states
  const [activeTab, setActiveTab] = useState<'overview' | 'kanban' | 'crm' | 'synthese' | 'outils'>('overview');
  const [activeTool, setActiveTool] = useState<'simulator' | 'partner_pack' | 'dataroom' | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState<PropertyData | null>(null);
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<PropertyData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // CRM Analytics
  const dossierAVerifier = properties.filter(p => !p.isComplete && p.completeness > 50).length;
  const attenteScan = properties.filter(p => p.pipelineStage === 'collecte' || p.pipelineStage === 'leads').length;
  const signaturesPending = properties.filter(p => p.pipelineStage === 'notaire').length;

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      // Optimistic update
      updateProperty(draggableId, { pipelineStage: destination.droppableId });
      
      try {
        await supabase
          .from('properties')
          .update({ pipeline_stage: destination.droppableId })
          .eq('id', draggableId);
      } catch (err) {
        console.warn("Mise à jour Supabase ignorée (mode démo)");
      }
      setToastMessage(`Statut mis à jour !`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleCreateProperty = async (data: any) => {
    try {
      await createProperty({
        type: data.type as PropertyType,
        address: data.address?.fullAddress || typeof data.address === 'string' ? data.address : 'Adresse à préciser',
        city: data.address?.city || 'Ville inconnue',
        estimatedValue: data.estimatedValue || 300000,
        status: 'analysis',
        isComplete: false,
        referenceNumber: `REF-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        pipelineStage: 'leads',
        completeness: 20,
        surface: data.surface,
        rooms: data.rooms,
      });
      setToastMessage(`Nouveau dossier créé avec succès !`);
      setTimeout(() => setToastMessage(null), 3000);
      setShowNewForm(false);
    } catch (e) {
      console.error("Creation error", e);
    }
  };

  const relancerClient = (id: string, methodName: string) => {
    setToastMessage(`Relance envoyée par ${methodName} !`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (selectedPropertyDetails) {
    return <PropertyDetailsView property={selectedPropertyDetails} onBack={() => setSelectedPropertyDetails(null)} />;
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-[#050505] p-4 sm:p-8 overflow-hidden rounded-[2.5rem] transition-colors duration-300">
      {/* 3D Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 dark:bg-blue-600/30 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 dark:bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200 dark:border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <button 
                onClick={() => window.history.back()}
                className="w-8 h-8 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 flex items-center justify-center text-slate-900 dark:!text-white hover:bg-gray-50 dark:hover:bg-white/20 transition-all shadow-sm shrink-0"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <span className="px-3 py-1 bg-secondary/10 dark:bg-secondary/20 text-secondary-dark dark:text-secondary rounded-lg text-xs font-bold uppercase tracking-wider border border-secondary/20 dark:border-secondary/30 shrink-0">
                {profile?.professionalData?.subRole || 'Agent Immobilier / Partenaire'}
              </span>
              <span className="px-3 py-1 bg-gray-200 dark:bg-white/10 text-gray-700 dark:!text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-gray-300 dark:border-white/20 shrink-0 hidden sm:inline-flex">
                ID: {profile?.id?.substring(0, 8) || 'PRO-' + Math.floor(Math.random() * 9000 + 1000)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:!text-white tracking-tight">Espace Professionnel</h1>
            <p className="text-slate-500 dark:!text-white/60 font-medium mt-1 text-sm">Centralisez vos mandats, pilotez vos commissions et structurez la liquidité de vos clients.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-200 dark:bg-white/5 p-0.5 rounded-xl border border-gray-300 dark:border-white/10">
              <button onClick={() => setTheme('light')} className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white shadow-sm text-yellow-500' : 'text-gray-500 dark:!text-white/40 hover:text-gray-900 dark:hover:text-white'}`}>
                <Sun size={14} />
              </button>
              <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-[#1a1f2e] text-blue-400 border border-white/10' : 'text-gray-500 dark:!text-white/40 hover:text-gray-900 dark:hover:text-white'}`}>
                <Moon size={14} />
              </button>
              <button onClick={() => setTheme('auto')} className={`p-1.5 rounded-lg transition-all ${theme === 'auto' ? 'bg-white dark:bg-white/10 text-slate-900 dark:!text-white shadow-sm' : 'text-gray-500 dark:!text-white/40 hover:text-gray-900 dark:hover:text-white'}`}>
                <Laptop size={14} />
              </button>
            </div>
            <button 
              onClick={() => setShowNewForm(true)}
              className="px-6 py-3 rounded-2xl bg-secondary text-white dark:text-primary font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_0_30px_rgba(234,179,8,0.3)] text-sm shrink-0"
            >
              <Plus size={18} /> <span className="hidden sm:inline">Nouveau Mandat</span>
            </button>
          </div>
        </header>

        {/* Navigation */}
        {!showNewForm && (
          <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl w-full lg:w-fit overflow-x-auto no-scrollbar shadow-sm dark:shadow-none">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={LayoutDashboard} label="Vue d'ensemble" />
            <TabButton active={activeTab === 'outils'} onClick={() => setActiveTab('outils')} icon={Briefcase} label="Outils de l'Expert" />
            <TabButton active={activeTab === 'kanban'} onClick={() => setActiveTab('kanban')} icon={BarChart3} label="Pipeline Opérationnel" />
            <TabButton active={activeTab === 'crm'} onClick={() => setActiveTab('crm')} icon={Users} label="CRM & Relances" />
            <TabButton active={activeTab === 'synthese'} onClick={() => setActiveTab('synthese')} icon={Receipt} label="Synthèse Actifs" />
          </div>
        )}

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {showNewForm ? (
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -30 }}
               className="bg-white dark:bg-white/5 backdrop-blur-3xl border border-gray-200 dark:border-white/10 p-8 rounded-[2rem] shadow-2xl"
               style={{ perspective: 1000 }}
             >
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-display font-bold text-slate-900 dark:!text-white">Nouveau Dossier</h2>
                 <button onClick={() => setShowNewForm(false)} className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-slate-900 dark:!text-white rounded-xl transition-colors font-medium">Annuler</button>
               </div>
               {/* Note: In a real implementation we would adjust PropertyCreationWizard strictly to dark theme, but we render it here */}
               <div className="w-full">
                 <PropertyCreationWizard onComplete={handleCreateProperty} onCancel={() => setShowNewForm(false)} />
               </div>
             </motion.div>
          ) : isLoading ? (
             <div className="flex justify-center py-20 text-slate-500 dark:text-white/50 font-bold text-lg animate-pulse">Chargement des données...</div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={activeTab}
              className="space-y-8"
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Dashboard Analytics KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <GlassCard className="group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
                          <Landmark size={24} />
                        </div>
                        <span className="text-2xl font-display font-bold text-slate-900 dark:!text-white">{properties.length}</span>
                      </div>
                      <h3 className="text-slate-900 dark:!text-white font-bold text-sm mb-1">Dossiers Actifs</h3>
                      <p className="opacity-60 text-[10px] uppercase tracking-wider font-medium text-slate-900 dark:!text-white">Volume global en cours</p>
                    </GlassCard>

                    <GlassCard className="group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary-dark dark:text-secondary flex items-center justify-center border border-secondary/30 group-hover:scale-110 transition-transform">
                          <Calculator size={24} />
                        </div>
                        <span className="text-2xl font-display font-bold text-slate-900 dark:!text-white">42k€</span>
                      </div>
                      <h3 className="text-slate-900 dark:!text-white font-bold text-sm mb-1">Commissions (Est.)</h3>
                      <p className="opacity-60 text-[10px] uppercase tracking-wider font-medium text-slate-900 dark:!text-white">Honoraires prévisionnels</p>
                    </GlassCard>

                    <GlassCard className="group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 flex items-center justify-center border border-yellow-500/30 group-hover:scale-110 transition-transform">
                          <AlertTriangle size={24} />
                        </div>
                        <span className="text-2xl font-display font-bold text-slate-900 dark:!text-white">{dossierAVerifier}</span>
                      </div>
                      <h3 className="text-slate-900 dark:!text-white font-bold text-sm mb-1">À Compléter</h3>
                      <p className="opacity-60 text-[10px] uppercase tracking-wider font-medium text-slate-900 dark:!text-white">Pièces manquantes</p>
                    </GlassCard>

                    <GlassCard className="group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform">
                          <FileCheck size={24} />
                        </div>
                        <span className="text-2xl font-display font-bold text-slate-900 dark:!text-white">{signaturesPending}</span>
                      </div>
                      <h3 className="text-slate-900 dark:!text-white font-bold text-sm mb-1">Prêts Notaire</h3>
                      <p className="opacity-60 text-[10px] uppercase tracking-wider font-medium text-slate-900 dark:!text-white">Signatures en attente</p>
                    </GlassCard>
                  </div>

                  {/* Recent Activity Mini-CRM */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h3 className="text-lg font-display font-bold text-slate-900 dark:!text-white tracking-tight">Clients nécessitant une action</h3>
                      <button onClick={() => setActiveTab('crm')} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors self-start sm:self-auto">Voir tout le CRM →</button>
                    </div>
                    <div className="space-y-3">
                      {properties.filter(p => !p.isComplete).slice(0, 3).map(prop => (
                        <GlassCard key={prop.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4" hoverEffect={false}>
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-primary/5 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:!text-white/70 font-bold border border-primary/10 dark:border-white/5 shrink-0">
                               {prop.clientName?.charAt(0) || 'C'}
                             </div>
                             <div>
                               <div className="text-slate-900 dark:!text-white font-bold text-sm">{prop.clientName || 'Client inconnu'}</div>
                               <div className="text-slate-400 dark:!text-white/40 text-[11px] sm:text-xs font-medium">Dossier: {prop.referenceNumber} • Complété à {prop.completeness}%</div>
                             </div>
                           </div>
                           <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                             <button 
                               onClick={() => relancerClient(prop.id, 'Email')}
                               className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                             >
                               <Send size={14} /> Relancer
                             </button>
                             <button 
                               onClick={() => {
                                 navigator.clipboard.writeText(`${window.location.origin}/dashboard/particulier?mandat=${prop.id}`);
                                 relancerClient(prop.id, 'Lien copié');
                               }}
                               className="flex-1 sm:flex-none px-4 py-2 bg-purple-50 dark:bg-purple-500/20 hover:bg-purple-100 dark:hover:bg-purple-500/30 text-purple-600 dark:text-purple-400 rounded-xl text-sm font-bold border border-purple-200 dark:border-purple-500/30 transition-colors flex items-center justify-center gap-2"
                             >
                               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                               Lien
                             </button>
                           </div>
                        </GlassCard>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'crm' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h2 className="text-lg font-display font-bold text-slate-900 dark:!text-white tracking-tight mb-6">Mini-CRM & Relances</h2>
                   <div className="grid gap-4">
                     {properties.map(prop => {
                       const daysSinceContact = prop.lastContacted ? Math.floor((Date.now() - new Date(prop.lastContacted).getTime()) / (1000 * 3600 * 24)) : 0;
                       const statusColor = prop.isComplete ? "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30" : daysSinceContact > 5 ? "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30" : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
                       
                       return (
                       <GlassCard key={prop.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6">
                         <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/5 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:!text-white font-bold text-lg border border-primary/10 dark:border-white/5 shrink-0">
                               {prop.clientName?.charAt(0) || 'C'}
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-base font-bold text-slate-900 dark:!text-white flex flex-wrap items-center gap-2 sm:gap-3">
                                <span className="truncate max-w-[200px]">{prop.clientName || 'Client inconnu'}</span>
                                <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider", statusColor)}>
                                  {prop.isComplete ? 'Complet' : daysSinceContact > 5 ? 'Urgent' : 'En attente'}
                                </span>
                              </h3>
                              <p className="text-primary/60 dark:!text-white/50 text-sm">Réf: {prop.referenceNumber} • {prop.type} à {prop.city}</p>
                              {prop.clientPhone && <p className="text-slate-400 dark:!text-white/40 text-xs flex items-center gap-1 mt-2 font-medium"><Phone size={10} /> {prop.clientPhone}</p>}
                            </div>
                         </div>
                         
                         <div className="flex flex-col sm:items-end justify-center gap-3 w-full sm:w-auto">
                            <div className="text-slate-400 dark:!text-white/40 text-[11px] uppercase tracking-wider font-bold">
                               Dernier contact : {daysSinceContact === 0 ? "Aujourd'hui" : `Il y a ${daysSinceContact} jours`}
                            </div>
                            {!prop.isComplete && (
                              <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                                <button onClick={() => relancerClient(prop.id, 'SMS')} className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-100/50 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-slate-900 dark:!text-white rounded-lg text-xs font-bold border border-gray-200 dark:border-white/10 transition-colors flex items-center justify-center gap-1.5">
                                  <Phone size={12} /> SMS
                                </button>
                                <button onClick={() => relancerClient(prop.id, 'Email')} className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-colors flex items-center justify-center gap-1.5 border border-blue-500/30">
                                  <Send size={12} /> Email
                                </button>
                                <button onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/dashboard/particulier?mandat=${prop.id}`);
                                  relancerClient(prop.id, 'Lien copié');
                                }} className="flex-1 sm:flex-none px-3 py-1.5 bg-purple-50 dark:bg-purple-500/20 hover:bg-purple-100 dark:hover:bg-purple-500/30 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-bold border border-purple-200 dark:border-purple-500/30 transition-colors flex items-center justify-center gap-1.5">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                  Lien Client
                                </button>
                              </div>
                            )}
                         </div>
                       </GlassCard>
                     )})}
                   </div>
                </div>
              )}

              {activeTab === 'kanban' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h2 className="text-lg font-display font-bold text-slate-900 dark:!text-white tracking-tight mb-6">Pipeline des mandats</h2>
                   <div className="relative">
                     {/* Overlay dark adjustments for BoardKanban if needed */}
                     <BoardKanban 
                       properties={properties} 
                       onDragEnd={handleDragEnd} 
                       onOpenAgrafe={(prop) => setShowTransferModal(prop)}
                       onSelectProperty={(prop) => setSelectedPropertyDetails(prop)}
                     />
                   </div>
                </div>
              )}

              {activeTab === 'outils' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-lg font-display font-bold text-slate-900 dark:!text-white tracking-tight mb-6 flex items-center gap-2 lg:text-xl">
                    <Briefcase className="w-6 h-6 text-primary dark:text-secondary" />
                    Outils & Services Back-Office
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <GlassCard className="flex flex-col h-full group cursor-pointer hover:border-secondary/50 dark:hover:border-secondary/50 transition-colors" onClick={() => setActiveTool('simulator')}>
                      <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-secondary/20 shrink-0">
                        <Calculator size={28} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:!text-white mb-2">Simulateur B2B</h3>
                      <p className="text-slate-500 dark:!text-white/60 text-sm mb-6 flex-grow leading-relaxed">Calculez instantanément la liquidité maximale (LTV), les frais intégrés et vos honoraires pour structurer une offre percutante.</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveTool('simulator'); }}
                        className="mt-auto w-full py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-slate-900 dark:!text-white font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none text-sm"
                      >
                        Lancer une simulation
                      </button>
                    </GlassCard>

                    <GlassCard className="flex flex-col h-full group cursor-pointer hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors" onClick={() => setActiveTool('partner_pack')}>
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-blue-200 dark:border-blue-500/20 shrink-0">
                        <FileSignature size={28} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:!text-white mb-2">Gérer les documents</h3>
                      <p className="text-slate-500 dark:!text-white/60 text-sm mb-6 flex-grow leading-relaxed">Générez l'accord de principe Hilios Capital, gérez vos documents de partenariat et pilotez le dossier.</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveTool('partner_pack'); }}
                        className="mt-auto w-full py-3 rounded-xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 dark:hover:bg-blue-600/30 transition-colors border border-blue-200 dark:border-blue-500/20 shadow-sm dark:shadow-none text-sm"
                      >
                        Pack Partenaire
                      </button>
                    </GlassCard>

                    <GlassCard className="flex flex-col h-full group cursor-pointer hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-colors" onClick={() => setActiveTool('dataroom')}>
                      <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-purple-200 dark:border-purple-500/20 shrink-0">
                        <Landmark size={28} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:!text-white mb-2">Data Room Notaire</h3>
                      <p className="text-slate-500 dark:!text-white/60 text-sm mb-6 flex-grow leading-relaxed">Partage sécurisé pour vos clercs : état daté, diagnostics, titres de propriété et projets d'actes authentiques.</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveTool('dataroom'); }}
                        className="mt-auto w-full py-3 rounded-xl bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-100 dark:hover:bg-purple-500/30 transition-colors border border-purple-200 dark:border-purple-500/20 shadow-sm dark:shadow-none text-sm"
                      >
                        Accéder à la Data Room
                      </button>
                    </GlassCard>
                  </div>
                </div>
              )}

              {activeTab === 'synthese' && (
                <SynthesePortefeuilleView properties={properties} onSelectProp={(p) => setSelectedPropertyDetails(p)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tool Modals */}
        <AnimatePresence>
          {activeTool && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setActiveTool(null)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                      {activeTool === 'simulator' && <Calculator size={24} className="text-secondary" />}
                      {activeTool === 'partner_pack' && <FileSignature size={24} className="text-blue-500 dark:text-blue-400" />}
                      {activeTool === 'dataroom' && <Landmark size={24} className="text-purple-500 dark:text-purple-400" />}
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 dark:!text-white/90">
                        {activeTool === 'simulator' && 'Simulateur B2B (LTV & Frais)'}
                        {activeTool === 'partner_pack' && 'Pack Partenaire - Accord de Principe'}
                        {activeTool === 'dataroom' && 'Data Room Notaire Sécurisée'}
                      </h2>
                      <p className="text-gray-500 dark:!text-white/50 text-sm">
                        {activeTool === 'simulator' && 'Calculez la liquidité et structurez votre offre.'}
                        {activeTool === 'partner_pack' && "Éditez et transmettez les documents liés à l'offre."}
                        {activeTool === 'dataroom' && 'Espace de partage pour clercs et notaires.'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTool(null)}
                    className="p-2 text-gray-400 hover:text-gray-900 dark:!text-white/50 dark:hover:text-white bg-white dark:bg-white/5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none border border-gray-200 dark:border-transparent"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className={`p-6 overflow-y-auto w-full max-h-[70vh] ${activeTool !== 'simulator' && activeTool !== 'partner_pack' && activeTool !== 'dataroom' ? 'flex flex-col items-center justify-center text-center' : ''}`}>
                  {activeTool === 'simulator' ? (
                    <B2BSimulator />
                  ) : activeTool === 'partner_pack' ? (
                    <PartnerPackGenerator properties={properties} onClose={() => setActiveTool(null)} />
                  ) : activeTool === 'dataroom' ? (
                    <DataRoom properties={properties} onClose={() => setActiveTool(null)} />
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 border border-gray-200 dark:border-white/10 text-gray-400 dark:!text-white/40 mx-auto">
                        <Clock size={32} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:!text-white/90 mb-2">Module en cours d'intégration</h3>
                      <p className="text-gray-500 dark:!text-white/50 max-w-md mx-auto">
                        Cet outil expert est actuellement en phase de développement. 
                        Il sera disponible dans la prochaine mise à jour de votre espace professionnel Wallnut.
                      </p>
                      <button 
                        onClick={() => setActiveTool(null)}
                        className="mt-8 px-8 py-3 bg-gray-100 dark:bg-white/10 text-gray-900 dark:!text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors border border-gray-200 dark:border-white/10 mx-auto shadow-sm dark:shadow-none"
                      >
                        Retour aux outils
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#1a1a24]/90 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 size={20} className="text-green-400" />
            <span className="font-bold text-sm tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────────────────

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap",
        active ? "bg-gray-900 text-white dark:bg-white dark:text-black shadow-lg" : "text-gray-500 dark:!text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
      )}
    >
      <Icon size={16} /> {label}
    </button>
  );
}

function GlassCard({ children, className, hoverEffect = true, onClick }: { children: React.ReactNode, className?: string, hoverEffect?: boolean, onClick?: () => void }) {
  return (
    <motion.div 
      whileHover={hoverEffect ? { scale: 1.02, rotateX: 2, rotateY: -2 } : {}}
      style={hoverEffect ? { perspective: 1000 } : {}}
      className={cn(
        "bg-white dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 shadow-xl",
        "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/5 dark:before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity text-gray-900 dark:!text-white",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("relative z-10 w-full", className?.includes("flex-col") ? "flex flex-col flex-1 h-full" : "h-full")}>{children}</div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// PORTFOLIO SYNTHESIS VIEW
// ─────────────────────────────────────────────────────────
function SynthesePortefeuilleView({ properties, onSelectProp }: { properties: PropertyData[], onSelectProp: (p: PropertyData) => void }) {
  const assets: AssetData[] = properties.map((prop, i) => ({
    id: prop.id,
    clientId: 'client-' + i,
    clientName: prop.clientName || 'Client ' + i,
    clientType: 'PP',
    clientStatus: 'Particulier',
    city: prop.city,
    propertyType: prop.type,
    referenceValue: prop.estimatedValue,
    surface: (prop.surface as number) || 100,
    offerTarget: prop.estimatedValue > 1000000 ? 'Premium' : 'Équilibre',
    existingDebt: prop.estimatedValue * 0.15,
    agencyFees: prop.estimatedValue * 0.05,
    actFees: prop.estimatedValue * 0.02,
    marketLiquidityDelay: 90,
    legalQualityScore: prop.isComplete ? 95 : 45,
    assetQuality: 4,
    exitReadability: 4,
    sellerProfile: 3,
    complexity: 2,
    benchmarkPrice: prop.estimatedValue / ((prop.surface as number) || 100) * 0.95,
    distanceLargeCity: 15,
    accessTimeLargeCity: 30,
    population: 250000
  }));

  const underwrittenAssets = assets.map(a => calculateAssetUnderwriting(a));
  const summary = synthesizePortfolio(underwrittenAssets);

  const formatEur = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Valeur totale ref.', value: formatEur(summary.totalValue) },
          { label: 'Base intervention', value: formatEur(summary.totalBaseIntervention) },
          { label: 'Score moyen', value: (summary.avgFundScore).toFixed(1) + '/100' },
          { label: 'Dossiers Actifs', value: summary.seizedAssetsCount.toString() },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-5">
             <div className="text-[10px] font-bold text-slate-400 dark:!text-white/40 uppercase tracking-widest">{stat.label}</div>
             <div className="text-2xl font-black text-slate-900 dark:!text-white mt-1">{stat.value}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="overflow-hidden p-0 border-t-0 border-x-0 rounded-t-[2rem]">
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <h3 className="text-lg font-bold text-slate-900 dark:!text-white">Synthèse Financière</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 text-[10px] uppercase font-bold text-slate-400 dark:!text-white/40 tracking-wider">
                <th className="py-4 px-6">Dossier</th>
                <th className="py-4 px-6">Valeur Réf.</th>
                <th className="py-4 px-6">Base Int.</th>
                <th className="py-4 px-6">Score</th>
                <th className="py-4 px-6">Statut</th>
                <th className="py-4 px-6">Avis Expert</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {underwrittenAssets.map((asset) => {
                const prop = properties.find(p => p.id === asset.id);
                return (
                  <tr key={asset.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer transition-colors" onClick={() => prop && onSelectProp(prop)}>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 dark:!text-white">{asset.city}</div>
                      <div className="text-slate-400 dark:!text-white/40 text-xs">#{prop?.referenceNumber}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-700 dark:!text-white/80">{formatEur(asset.referenceValue)}</td>
                    <td className="py-4 px-6 font-bold text-blue-600 dark:text-blue-400">{formatEur(asset.baseIntervention)}</td>
                    <td className="py-4 px-6">
                      <span className={cn("px-2 py-1 rounded-md text-[10px] font-bold border", asset.fundScore >= 70 ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30' : asset.fundScore >= 55 ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30' : 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30')}>
                         {asset.fundScore}/100
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", asset.dossierLight === 'Vert' ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : asset.dossierLight === 'Orange' ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]')} />
                        <span className="font-bold text-slate-700 dark:!text-white/80 tracking-wide text-xs">{asset.dossierLight}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs font-medium text-slate-500 dark:!text-white/60">{asset.expertOpinion}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

