import React from 'react';
import { motion } from 'motion/react';
import { Building2, Award, Users, CheckCircle } from 'lucide-react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';

export function About() {
  const method = [
    { text: "Rigueur institutionnelle dans chaque analyse." },
    { text: "Neutralité totale dans le processus." },
    { text: "Alignement d'intérêts direct." },
    { text: "Pas de création de dette additionnelle." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <main className="pt-32">
        <section className="max-w-4xl mx-auto px-4 lg:px-8 mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-app-3xl lg:text-5xl font-display font-bold text-primary leading-tight">
              À Propos <span className="text-secondary">de Wallnut</span>
            </h1>
            <p className="text-app-primary text-neutral-dark/60 leading-relaxed text-app-lg">
              Wallnut est né d'un constat simple : la vente immobilière est lente, parfois rigide, et ne répond pas toujours aux urgences de trésorerie de certains propriétaires.
            </p>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-app-2xl font-display font-bold text-primary">Notre Mission</h2>
              <p className="text-app-md text-neutral-dark/70 leading-relaxed">
                Apporter une ingénierie de pointe au service d'opérations immobilières structurées. Nous transformons une illiquidité temporaire (une maison, un appartement) en liquidité immédiate via un rachat sec avec engagement de reversement de plus-value. C'est une restructuration par la propriété.
              </p>
              
              <div className="space-y-4 pt-4 mt-8 border-t border-slate-100">
                <h3 className="font-bold text-primary text-app-md mb-4">Notre approche en 4 points :</h3>
                {method.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                    <span className="font-medium text-neutral-dark/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col justify-center items-center text-center space-y-4 shadow-sm">
                <Building2 className="w-10 h-10 text-primary" />
                <h3 className="font-bold text-primary">Un Acteur Physique</h3>
                <p className="text-app-sm text-neutral-dark/60">Une vraie contrepartie engagée via ses propres fonds de portage.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col justify-center items-center text-center space-y-4 shadow-sm">
                <Award className="w-10 h-10 text-primary" />
                <h3 className="font-bold text-primary">Des Normes Strictes</h3>
                <p className="text-app-sm text-neutral-dark/60">Contrôle interne et conformité notariée à chaque signature.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col justify-center items-center text-center space-y-4 shadow-sm sm:col-span-2">
                <Users className="w-10 h-10 text-primary" />
                <h3 className="font-bold text-primary">Fondateurs Experts</h3>
                <p className="text-app-sm text-neutral-dark/60">Des dirigeants issus de la finance institutionnelle, du M&A, de la gestion de fonds et de l'immobilier d'un point de vue transactionnel et notarial.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
