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
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-primary leading-tight">
              Le portage immobilier <span className="text-secondary">réinventé</span>
            </h1>
            <p className="text-xl text-neutral-dark/60 leading-relaxed">
              Une solution de liquidité moderne pour les propriétaires, alliant sécurité institutionnelle et flexibilité totale. Wallnut redéfinit les codes de la vente temporaire.
            </p>
          </motion.div>
        </section>

        {/* Concept Section */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-display font-bold text-primary">Comment ça marche ?</h2>
                <div className="space-y-6">
                  {[
                    { title: "Transformation d'actifs", desc: "Vous vendez temporairement tout ou partie de votre patrimoine à wallnut pour dégager des fonds immédiats." },
                    { title: "Convention d'occupation", desc: "Vous restez chez vous en versant une indemnité d'occupation, tout en conservant une faculté de rachat exclusive." },
                    { title: "Rachat ou cession", desc: "À tout moment (jusqu'à 24 mois), vous rachetez votre bien ou le vendez sur le marché pour encaisser la plus-value." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-6 rounded-3xl bg-white shadow-sm border border-black/5">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-bold font-display">
                        0{idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-primary">{item.title}</h3>
                        <p className="text-sm text-neutral-dark/60 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary to-primary/80 rounded-[4rem] overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white/10">
                    <Building2 size={300} />
                  </div>
                  <div className="absolute inset-0 p-12 flex flex-col justify-end">
                    <div className="glass p-8 rounded-3xl space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Shield className="w-5 h-5 text-secondary" />
                        <span className="font-bold text-sm uppercase tracking-wider">Sécurité Maximale</span>
                      </div>
                      <p className="text-primary font-medium">Contrats supervisés par huissiers et cadres institutionnels pour une tranquillité d'esprit totale.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-24 max-w-4xl mx-auto px-4">
          <div className="prose prose-slate lg:prose-xl">
            <h2 className="text-3xl font-display font-bold text-primary mb-8 text-center">Pourquoi choisir Wallnut pour votre portage immobilier ?</h2>
            <p className="text-lg text-neutral-dark/70 mb-6">
              Le <strong>portage immobilier</strong> est une solution de <strong>liquidité immobilière</strong> permettant à un propriétaire d’obtenir rapidement une avance de trésorerie adossée à la valeur de son bien avant sa vente définitive.
            </p>
            <p className="text-lg text-neutral-dark/70 mb-6">
              Contrairement aux mécanismes classiques de vente à réméré principalement centrés sur la faculté de rachat du bien, l’approche développée par Wallnut vise prioritairement la revente du bien sur le marché dans les meilleures conditions possibles.
            </p>
            <p className="text-lg text-neutral-dark/70 mb-6">
              Avec Wallnut, vous pouvez percevoir une avance immédiate en numéraire pouvant atteindre jusqu’à 80 % de la valeur estimée du bien (selon éligibilité). Une fois le bien vendu à un acquéreur tiers, vous percevez le solde restant après déduction des frais et engagements convenus.
            </p>
            <p className="text-lg text-neutral-dark/70 mb-6">
              Cette solution structurée peut permettre de débloquer rapidement des liquidités pour solder des dettes, éviter une vente contrainte ou financer un nouveau projet, sans recourir à un crédit bancaire classique.
            </p>
            <p className="text-lg text-neutral-dark/70 mb-12">
              Wallnut assure directement la gestion et le suivi des opérations, avec un traitement confidentiel des dossiers et un accompagnement dédié tout au long du processus.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12 font-bold text-primary">
              <div className="flex items-center gap-3">
                <Zap className="text-secondary" /> Rapidité d'exécution (72h)
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-secondary" /> Discrétion absolue
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="text-secondary" /> Valorisation optimisée
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-secondary" /> Accompagnement Pro
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-24 px-4">
          <div className="max-w-5xl mx-auto glass p-12 lg:p-20 rounded-[3rem] text-center space-y-8 bg-primary text-white">
            <h2 className="text-4xl font-display font-bold">Prêt à transformer votre patrimoine ?</h2>
            <p className="max-w-2xl mx-auto text-lg opacity-80">
              Obtenez une analyse personnalisée de votre dossier en moins de 24 heures. Nos experts sont à votre disposition pour vous conseiller.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register/particulier" className="px-10 py-5 rounded-3xl bg-secondary text-primary font-bold hover:scale-105 transition-all flex items-center gap-2">
                Démarrer mon dossier <ArrowRight size={20} />
              </Link>
              <Link to="/" className="px-10 py-5 rounded-3xl border-2 border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                Simuler mon projet
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
