import React from 'react';
import { motion } from 'motion/react';
import { FileEdit, Search, Scale, FileCheck, Landmark, ArrowRight, ArrowDown } from 'lucide-react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

export function HowItWorks() {
  const steps = [
    {
      icon: FileEdit,
      title: "1. Dépôt du dossier",
      desc: "Remplissez les informations concernant votre bien immobilier et votre situation. Ces éléments permettent une première estimation de la valeur et de la liquidité.",
    },
    {
      icon: Search,
      title: "2. Analyse immobilière",
      desc: "Nos experts examinent le marché local, évaluent la pertinence du bien, son état et son potentiel de revente à court ou moyen terme.",
    },
    {
      icon: Scale,
      title: "3. Analyse juridique et financière",
      desc: "Étude complète des contraintes (dettes, indivision, saisie) pour s'assurer que notre solution soldera la totalité des engagements.",
    },
    {
      icon: FileCheck,
      title: "4. Accord de principe",
      desc: "Si le dossier est éligible, nous vous transmettons une offre formelle incluant la valorisation, le prix d'achat, le complément éventuel et le coût de l'occupation.",
    },
    {
      icon: Landmark,
      title: "5. Transmission au notaire",
      desc: "Dès validation de votre part, tous les éléments sont transmis à notre étude notariale pour la rédaction de l'acte authentique et le transfert de propriété sécurisé.",
    }
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
              Parcours <span className="text-secondary">Opérationnel</span>
            </h1>
            <p className="text-app-lg text-neutral-dark/60 leading-relaxed">
              Un processus transparent, en 5 étapes clés, piloté de bout en bout par nos équipes et encadré par des notaires.
            </p>
          </motion.div>
        </section>

        <section className="max-w-3xl mx-auto px-4 lg:px-8 py-10 relative">
          <div className="absolute left-[39px] sm:left-1/2 sm:-translate-x-px top-20 bottom-10 w-0.5 bg-gradient-to-b from-primary/10 via-primary/20 to-transparent z-0"></div>

          <div className="space-y-12 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12 ${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}
              >
                <div className={`flex-1 w-full p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-lg hover:border-secondary/20 transition-all ${idx % 2 === 0 ? 'sm:text-right' : 'sm:text-left'} glassmorph`}>
                  <h3 className="text-app-xl font-display font-bold text-primary mb-3">{step.title}</h3>
                  <p className="text-neutral-dark/70 leading-relaxed">{step.desc}</p>
                </div>
                
                <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-50 shadow-xl flex items-center justify-center shrink-0 relative z-20">
                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <div className="flex-1 hidden sm:block"></div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-app-2xl font-display font-bold text-primary">Prêt à démarrer l'étape 1 ?</h2>
            <Link to="/dossiers/new" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-secondary text-white font-bold hover:scale-105 transition-all shadow-xl shadow-secondary/20">
              Déposer mon dossier <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
