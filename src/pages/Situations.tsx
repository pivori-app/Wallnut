import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, FileX, SplitSquareHorizontal, Clock, ArrowRight } from 'lucide-react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

export function Situations() {
  const cases = [
    {
      title: "Prêt relais bloqué",
      desc: "Vous avez acheté un nouveau bien grâce à un crédit relais, mais votre ancien bien ne se vend pas. L'échéance approche et la banque menace de saisir la maison.",
      icon: Clock,
      color: "border-orange-500",
      bgBase: "bg-orange-50"
    },
    {
      title: "Succession ou indivision",
      desc: "Vous avez hérité d'un bien en indivision. Un ou plusieurs cohéritiers souhaitent récupérer leur part immédiatement. Le portage permet de dégager de la liquidité avant la vente finale.",
      icon: SplitSquareHorizontal,
      color: "border-blue-500",
      bgBase: "bg-blue-50"
    },
    {
      title: "Divorce ou séparation",
      desc: "Afin de désengager l'un des conjoints sans brader le bien, une vente structurée peut être organisée pour racheter la soulte ou clôturer l'emprunt commun.",
      icon: FileX,
      color: "border-purple-500",
      bgBase: "bg-purple-50"
    },
    {
      title: "Saisie ou vente forcée",
      desc: "Votre bien fait l'objet d'une saisie immobilière. Pour éviter la vente aux enchères (adjudication) à un prix dérisoire, nous soldons vos encours pour stopper la procédure.",
      icon: AlertCircle,
      color: "border-red-500",
      bgBase: "bg-red-50"
    },
    {
      title: "Vente longue / Bien bloqué",
      desc: "Votre bien est en vente depuis de nombreux mois. Vous avez besoin de liquidité immédiatement pour un autre projet sans vouloir accepter des offres sous-estimées.",
      icon: Clock,
      color: "border-emerald-500",
      bgBase: "bg-emerald-50"
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
              Cas d'usage et <span className="text-secondary">situations</span>
            </h1>
            <p className="text-app-lg text-neutral-dark/60 leading-relaxed">
              Découvrez comment la solution de portage Wallnut peut résoudre des situations apparemment sans issue.
            </p>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((scenario, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-3xl border-2 ${scenario.bgBase} ${scenario.color}/20 hover:${scenario.color}/50 glassmorph transition-all hover:-translate-y-2`}
              >
                <div className={`w-14 h-14 rounded-full ${scenario.bgBase} border border-white flex items-center justify-center mb-6`}>
                  <scenario.icon className={`w-7 h-7 text-primary`} />
                </div>
                <h3 className="text-app-xl font-display font-bold text-primary mb-4">{scenario.title}</h3>
                <p className="text-neutral-dark/70 leading-relaxed text-app-sm">{scenario.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 glass p-12 !bg-primary/5 rounded-[3rem]">
            <h2 className="text-app-2xl font-display font-bold text-primary">Votre situation n'est pas listée ?</h2>
            <p className="text-neutral-dark/70">Chaque dossier est unique, contactez-nous pour une analyse sur-mesure.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold hover:scale-105 transition-all shadow-xl">
              Nous contacter <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
