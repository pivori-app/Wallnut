import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Shield, BarChart3, Lock, Building, ArrowRight, Activity } from 'lucide-react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

export function Investisseurs() {
  const principles = [
    {
      title: "Analyse stricte",
      desc: "Processus d'audit rigoureux (valorisation, liquidité, urbanisme) assurant une décote à l'acquisition couvrante par rapport aux indicateurs du marché local. Chaque actif est décoté d'un minimum de 20 à 30%.",
      icon: BarChart3
    },
    {
      title: "Risque maîtrisé",
      desc: "Périmètre de perte en capital sécurisé par des actes notariés authentiques. L'appropriation de l'actif est définitive. Le rendement est assis sur la revente physique, non sur du papier commercial.",
      icon: Shield
    },
    {
      title: "Reporting trimestriel",
      desc: "Accès à un tableau de bord institutionnel détaillant la valorisation du portefeuille, les statuts d'occupation et l'avancement prévisionnel de sortie par actif.",
      icon: Activity
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <main className="pt-32">
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-white text-app-xs font-bold uppercase tracking-wider">
              Family Office / Institutionnel
            </div>
            <h1 className="text-app-3xl lg:text-5xl font-display font-bold text-primary leading-tight">
              Investissez <span className="text-secondary">dans la décote</span>
            </h1>
            <p className="text-app-lg text-neutral-dark/60 leading-relaxed">
              Modèle d'investissement sécurisé adossé à l'immobilier physique direct. Un positionnement défensif avec des rendements attractifs via la restructuration d'actifs décotés.
            </p>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {principles.map((p, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                  <p.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-app-xl font-display font-bold text-primary mb-4">{p.title}</h3>
                <p className="text-neutral-dark/70 leading-relaxed text-app-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 text-white py-24 my-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-app-2xl lg:text-app-3xl font-display font-bold">Un modèle asymétrique en faveur de l'investisseur.</h2>
                <p className="text-app-md text-white/70 leading-relaxed">
                  Contrairement au private equity cherchant de l'hyper croissance risquée, Wallnut opère un modèle garantissant un filet de sécurité structurel : l'achat se fait sous le prix du marché, couvrant la volatilité et garantissant techniquement la liquidité à la sortie.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-secondary text-white font-bold hover:scale-105 transition-all">
                  Prendre contact <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-secondary mb-2">-25%</div>
                  <div className="text-white/60 text-sm">Décote moyenne à l'acquisition LTV</div>
                </div>
                <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-secondary mb-2">~10%</div>
                  <div className="text-white/60 text-sm">TRI cible annualisé modélisé</div>
                </div>
                <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-secondary mb-2">12-24m</div>
                  <div className="text-white/60 text-sm">Horizon typique de liquidité de sortie</div>
                </div>
                <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-secondary mb-2">100%</div>
                  <div className="text-white/60 text-sm">Cadrage notarial sous-jacent certifié</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
