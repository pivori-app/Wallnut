import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Shield, 
  Clock, 
  HandCoins, 
  Building2, 
  Globe, 
  ArrowRight,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Users
} from 'lucide-react';
import { Simulator } from '../components/Simulator';
import { useAuth } from '../contexts/AuthContext';
import { ChatAssistant } from '../components/ChatAssistant';
import { Footer } from '../components/Footer';
import { PublicHeader } from '../components/PublicHeader';

const ProCard = ({ item }: { item: any, key?: React.Key }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div 
      className="group h-[240px] perspective-[1000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div 
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d cursor-pointer"
      >
        {/* Front */}
        <div className="absolute inset-0 p-8 rounded-3xl bg-white/40 border border-white/60 flex flex-col items-center justify-center text-center gap-4 backface-hidden shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
            <item.icon className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold opacity-80">{item.label}</span>
        </div>

        {/* Back */}
        <div className="absolute inset-0 p-6 rounded-3xl bg-primary text-white flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] backface-hidden shadow-2xl">
          <p className="text-[11px] leading-relaxed mb-3 opacity-90">{item.desc}</p>
          <div className="h-px w-full bg-white/20 mb-3" />
          <p className="text-[12px] font-bold text-secondary mb-3">{item.advantage}</p>
          {item.link && (
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold transition-all flex items-center gap-1 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              Découvrir notre solution <ChevronRight size={12} />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export function Home() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [showSolutions, setShowSolutions] = useState(false);

  const handleStart = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      signIn();
    }
  };

  const steps = [
    { icon: Globe, title: "Simulation", text: "Estimez votre capacité de liquidité en 2 minutes." },
    { icon: Building2, title: "Analyse", text: "Notre IA analyse vos documents instantanément." },
    { icon: Shield, title: "Signature", text: "Signature sécurisée via Yousign sous 48h." },
    { icon: HandCoins, title: "Liquidité", text: "Fonds débloqués sur votre compte rapidement." },
  ];

  const handleInitialize = (data: any) => {
    if (user) {
      navigate('/dossiers/new', { state: data });
    } else {
      signIn().then(() => {
        navigate('/dossiers/new', { state: data });
      });
    }
  };

  return (
    <div className="space-y-24 pb-20 pt-20">
      <PublicHeader />
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-medium text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            Solution de liquidité immobilière V4.1
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-primary leading-tight px-2"
          >
            Libérez la valeur de <br className="hidden sm:block" />
            <span className="text-secondary italic">votre patrimoine</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-neutral-dark/70 max-w-2xl mx-auto px-4"
          >
            Wallnut propose une solution de portage immobilier structuré pour obtenir des fonds rapidement sans vendre votre bien immédiatement.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:justify-center gap-4 sm:gap-6 px-4"
          >
            <Link 
              to="/register/particulier"
              className="touch-target px-6 py-4 sm:px-8 sm:py-5 rounded-3xl bg-primary text-white font-display font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all flex flex-col items-center sm:items-start sm:min-w-[240px] group"
            >
              <span className="text-secondary text-[10px] sm:text-xs uppercase tracking-widest mb-1">Espace Propriétaire</span>
              <span className="flex items-center gap-2">Faire une demande <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
            <Link 
              to="/register/professionnel"
              className="touch-target px-6 py-4 sm:px-8 sm:py-5 rounded-3xl bg-white border-2 border-secondary/20 text-primary font-display font-bold text-base sm:text-lg hover:border-secondary hover:shadow-2xl hover:shadow-secondary/10 transition-all flex flex-col items-center sm:items-start sm:min-w-[240px] group"
            >
              <span className="text-secondary text-[10px] sm:text-xs uppercase tracking-widest mb-1">Espace Professionnel</span>
              <span className="flex items-center gap-2 text-secondary">Nous solliciter <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" /></span>
            </Link>
          </motion.div>
        </div>
        
        {/* Background Decorative Rings */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square pointer-events-none -z-0">
          <div className="absolute inset-0 border border-primary/5 rounded-full rotate-45 scale-125"></div>
          <div className="absolute inset-0 border border-secondary/5 rounded-full -rotate-12 scale-150"></div>
        </div>
      </section>

      {/* Simulator Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 overflow-x-hidden">
        <div className="text-center mb-8 sm:mb-16 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-display font-bold">Simulez votre portage</h2>
          <p className="text-sm sm:text-base text-neutral-dark/60 px-4">Obtenez une première estimation de votre net client.</p>
        </div>
        <div className="sm:px-0">
          <Simulator onInitialize={handleInitialize} />
        </div>
      </section>

      {/* Professionals Section */}
      <section id="solution" className="max-w-7xl mx-auto px-4 lg:px-8 py-20 relative">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card-3d p-6 sm:p-12 lg:p-20 rounded-[2rem] sm:rounded-[3rem] relative"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] sm:rounded-[3rem] -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px]" />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Espace Partenaires
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-primary leading-tight">
                L'écosystème <br className="hidden sm:block" /> <span className="text-secondary">Wallnut Pro</span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-dark/70 leading-relaxed">
                Vous êtes Agent Immobilier, Notaire, CGP ou Courtier ? Wallnut est votre partenaire technique 
                pour apporter de la liquidité à vos clients. Nous ne mettons jamais en relation directe les particuliers entre eux. 
                Nous structurons l'offre financière pour vos mandats.
              </p>
              
              <ul className="space-y-3 sm:space-y-4">
                {[
                  "Gestion de leads qualifiés",
                  "Publication d'annonces inter-cabinet",
                  "Vérification instantanée des agréments (ORIAS, CPI)",
                  "Coffre-fort documents sécurisé"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm sm:text-base font-semibold text-primary/80">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" /> <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register/professionnel"
                  className="touch-target inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-secondary text-white font-bold hover:scale-105 transition-all shadow-xl shadow-secondary/20"
                >
                  Rejoindre le réseau Pro <ChevronRight className="w-5 h-5" />
                </Link>
                <div className="relative group">
                  <button 
                    onClick={() => setShowSolutions(!showSolutions)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-secondary border-2 border-secondary font-bold transition-all shadow-xl w-full sm:w-auto hover:bg-slate-50 touch-manipulation"
                  >
                    Découvrir notre solution <ChevronRight className={`w-5 h-5 transition-transform ${showSolutions ? 'rotate-90' : ''}`} />
                  </button>
                  {showSolutions && (
                  <div className="absolute left-0 top-full mt-2 w-full sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 transition-all z-50 flex flex-col p-2">
                    <a href="/presentation-agents.html" target="_blank" rel="noopener noreferrer" className="px-4 py-3 hover:bg-slate-50 rounded-xl text-primary font-semibold text-sm transition-colors flex items-center justify-between group/link">
                      Agents Immobiliers <ChevronRight size={16} className="text-secondary opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                    </a>
                    <a href="/presentation-cgp.html" target="_blank" rel="noopener noreferrer" className="px-4 py-3 hover:bg-slate-50 rounded-xl text-primary font-semibold text-sm transition-colors flex items-center justify-between group/link">
                      Gestion de Patrimoine <ChevronRight size={16} className="text-secondary opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                    </a>
                    <a href="/presentation-notaires.html" target="_blank" rel="noopener noreferrer" className="px-4 py-3 hover:bg-slate-50 rounded-xl text-primary font-semibold text-sm transition-colors flex items-center justify-between group/link">
                      Notaires & Avocats <ChevronRight size={16} className="text-secondary opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                    </a>
                    <a href="/presentation-courtiers.html" target="_blank" rel="noopener noreferrer" className="px-4 py-3 hover:bg-slate-50 rounded-xl text-primary font-semibold text-sm transition-colors flex items-center justify-between group/link">
                      Courtiers & Experts <ChevronRight size={16} className="text-secondary opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                    </a>
                  </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { 
                  label: "Agents Immobiliers", 
                  icon: Building2,
                  desc: "Spécialistes de la transaction. Wallnut débloque vos ventes en offrant une liquidité immédiate à vos vendeurs.",
                  advantage: "Fidélisez vos mandats.",
                  link: "/presentation-agents.html"
                },
                { 
                  label: "Gestion de Patrimoine", 
                  icon: TrendingUp,
                  desc: "Expertise et stratégie. Wallnut propose un support sécurisé pour l'arbitrage patrimonial de vos clients.",
                  advantage: "Optimisez les actifs.",
                  link: "/presentation-cgp.html"
                },
                { 
                  label: "Notaires & Avocats", 
                  icon: Shield,
                  desc: "Sécurité juridique. Wallnut facilite les successions et partages sans vente immobilière forcée.",
                  advantage: "Accélérez les dossiers.",
                  link: "/presentation-notaires.html"
                },
                { 
                  label: "Courtiers & Experts", 
                  icon: Users,
                  desc: "Financement sur mesure. Wallnut est l'alternative aux refus de crédits bancaires via le portage.",
                  advantage: "Solutionnez le refus.",
                  link: "/presentation-courtiers.html"
                }
              ].map((item, idx) => (
                <ProCard key={idx} item={item} />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Workflow Section */}
      <section className="bg-primary py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-6 text-center lg:text-left"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto lg:mx-0">
                  <step.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-display font-bold">{step.title}</h3>
                <p className="text-white/60 leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <blockquote className="text-2xl lg:text-4xl font-display font-medium text-primary italic leading-relaxed">
          "Wallnut simplifie radicalement l'accès à la liquidité pour les propriétaires immobiliers, 
          avec une transparence totale et une rapidité d'exécution sans précédent sur le marché français."
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="w-12 h-12 bg-neutral-dark rounded-full overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Founder" />
          </div>
          <div className="text-left">
            <p className="font-bold">Jean-Marc Valois</p>
            <p className="text-sm opacity-60">Directeur Immobilier Institutionnel</p>
          </div>
        </div>
      </section>

      <ChatAssistant />
      <Footer />
    </div>
  );
}
