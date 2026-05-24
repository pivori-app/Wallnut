import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Building2, Scale, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

export function Partenaires() {
  const parts = [
    {
      title: "Agents immobiliers",
      icon: Building2,
      desc: "Débloquez les ventes longues, transformez les mandats difficiles en signatures réelles et anticipez les attentes de liquidité de vos clients vendeurs.",
      list: ["Protection de vos mandats exclusifs", "Liquidité immédiate pour le vendeur", "Honoraires sécurisés"]
    },
    {
      title: "Notaires",
      icon: Scale,
      desc: "Trouvez une alternative viable aux impasses financières (successions complexes, indivisions litigieuses, risques de saisie) pour vos clients.",
      list: ["Méthodologie juridique stricte", "Transparence totale", "Respect des chartes déontologiques"]
    },
    {
      title: "Avocats",
      icon: ShieldCheck,
      desc: "Protégez le patrimoine de vos clients. Face à une saisie immobilière ou un divorce conflictuel, le portage offre une sortie par le haut, au bon prix.",
      list: ["Arrêt des procédures de saisie", "Solder les dettes", "Maintien de la valeur patrimoniale"]
    },
    {
      title: "Courtiers / Conseils",
      icon: Briefcase,
      desc: "Face à un refus bancaire, un prêt relais impossible ou un endettement complexe, offrez une vraie solution de financement alternatif basée sur l'actif.",
      list: ["Processus sans scoring bancaire", "Analyse sur la valeur métrique du bien", "Décision en 72h"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      
      <main className="pt-32">
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-app-xs font-bold uppercase tracking-wider">
              B2B / Institutionnels
            </div>
            <h1 className="text-app-3xl lg:text-5xl font-display font-bold text-primary leading-tight">
              L'écosystème <span className="text-secondary">Partenaires</span>
            </h1>
            <p className="text-app-lg text-neutral-dark/60 leading-relaxed">
              Wallnut ne se substitue pas à vos missions, nous sommes la brique technologique et financière qui rend l'opération réalisable.
            </p>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <div className="grid md:grid-cols-2 gap-8">
            {parts.map((p, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 sm:p-10 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <p.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-app-2xl font-display font-bold text-primary mb-4">{p.title}</h3>
                <p className="text-neutral-dark/70 leading-relaxed mb-8 flex-1">{p.desc}</p>
                <ul className="space-y-3">
                  {p.list.map((l, i) => (
                     <li key={i} className="flex items-center gap-3 text-app-sm font-semibold text-primary/80">
                       <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" /> {l}
                     </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto p-12 lg:p-20 border border-primary/20 bg-primary/5 rounded-[3rem] space-y-8 glassmorph">
            <h2 className="text-app-2xl font-display font-bold text-primary">Le Cadre Partenaire</h2>
            <p className="text-neutral-dark/70 text-app-md mb-8">
              Devenez un relais certifié Wallnut et offrez des solutions innovantes à vos clients tout en sécurisant votre rémunération via des conventions inter-cabinets claires.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register/professionnel" className="px-8 py-4 rounded-full bg-primary text-white font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                Créer un compte Pro <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="px-8 py-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-white transition-all">
                Nous contacter
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
