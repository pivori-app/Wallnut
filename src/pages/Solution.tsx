import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Shield, Zap, TrendingUp, Users, Building2, ArrowRight } from 'lucide-react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

export function Solution() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <main className="pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-app-3xl lg:text-6xl font-display font-bold text-primary leading-tight">
              Explication Pédagogique <br className="hidden sm:block" /> du <span className="text-secondary">Modèle Immobilier</span>
            </h1>
            <p className="text-app-lg text-neutral-dark/60 leading-relaxed">
              Comprendre les bases et les spécificités de l'intervention Wallnut.
            </p>
          </motion.div>
        </section>

        {/* Concept Section */}
        <section className="bg-slate-50 py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 dark:bg-white/10 pointer-events-none backdrop-blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-app-2xl lg:text-app-3xl font-display font-bold text-primary">Notre Solution</h2>
                <div className="space-y-6">
                  {[
                    { title: "Une vente immobilière structurée", desc: "Étudie l'acquisition directe de votre bien en apportant de la liquidité immédiate." },
                    { title: "Acquisition réelle", desc: "Si l'opération aboutit, le bien est vendu à WALLNUT via un processus notarié standard." },
                    { title: "Complément de prix", desc: "Le complément de prix est conditionnel à la revente dans d'excellentes conditions, encadré par des engagements clairs." },
                    { title: "Différé de jouissance", desc: "Selon le dossier, le vendeur peut rester temporairement locataire du bien le temps de finaliser son projet de transition." },
                    { title: "Sécurisation", desc: "Avant toute signature définitive, un accord de principe est délivré pour figer les conditions financières." },
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group flex gap-4 p-6 rounded-3xl bg-white shadow-sm border border-black/5 hover:border-secondary/30 hover:shadow-lg transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-bold font-display group-hover:bg-secondary group-hover:text-white transition-colors">
                        0{idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-primary">{item.title}</h3>
                        <p className="text-app-sm text-neutral-dark/60 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary to-primary/80 rounded-[4rem] overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white/10">
                    <Building2 size={300} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 p-12 flex flex-col justify-end">
                    <div className="glass p-8 rounded-3xl space-y-4 shadow-xl border border-white/20 transform transition-transform hover:-translate-y-2">
                      <div className="flex items-center gap-2 text-white">
                        <Shield className="w-6 h-6 text-secondary" />
                        <span className="font-bold text-app-sm uppercase tracking-wider">Modèle Sécurisé</span>
                      </div>
                      <p className="text-white/90 font-medium">L'intégralité du montage juridique et notarial est auditée par nos experts.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto p-12 lg:p-20 rounded-[3rem] text-center space-y-8 bg-primary shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* Subtle light effect for 3D/glassmorph feel without ruining contrast */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-50" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-app-2xl lg:text-app-3xl font-display font-bold text-white relative z-10">Démarrer une analyse ?</h2>
            <p className="max-w-2xl mx-auto text-app-md text-white/90 relative z-10">
              Obtenez une analyse personnalisée de votre situation, encadrée et transparente.
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10 pt-4">
              <Link to="/dossiers/new" className="px-10 py-5 rounded-3xl bg-secondary text-primary font-bold hover:scale-105 transition-all flex items-center gap-2">
                Faire étudier mon dossier <ArrowRight size={20} />
              </Link>
              <Link to="/comment-ca-marche" className="px-10 py-5 rounded-3xl border border-white/30 text-white font-bold hover:bg-white/10 transition-all">
                Voir les étapes
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
