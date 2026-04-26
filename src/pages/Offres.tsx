import React from 'react';
import { motion } from 'motion/react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Check, ArrowRight, Shield, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Offres() {
  const plans = [
    {
      name: "Prudente",
      price: "60%",
      description: "La sécurité avant tout pour stabiliser votre situation financière sans pression.",
      features: [
        "Jusqu'à 60% de la valeur vénale",
        "Durée flexible jusqu'à 24 mois",
        "Frais de dossier réduits",
        "Accompagnement administratif standard",
        "Rachat prioritaire garanti"
      ],
      color: "bg-slate-50",
      accent: "text-slate-500",
      btn: "border-primary text-primary"
    },
    {
      name: "Équilibre",
      price: "70%",
      description: "Le compromis idéal pour financer un nouveau projet tout en gardant une marge de manœuvre.",
      features: [
        "Jusqu'à 70% de la valeur vénale",
        "Audit technique inclus",
        "Expertise immobilière certifiée",
        "Sortie assistée (Vente ou Rachat)",
        "Support juridique dédié"
      ],
      current: true,
      color: "bg-primary text-white",
      accent: "text-secondary",
      btn: "bg-secondary text-primary"
    },
    {
      name: "Premium",
      price: "80%",
      description: "Une liquidité maximale pour les projets ambitieux ou les restructurations massives.",
      features: [
        "Jusqu'à 80% de la valeur vénale",
        "Analyse express en 24h",
        "Conciergerie juridique & fiscale",
        "Option complément de prix optimisée",
        "Disponibilité VIP 7j/7"
      ],
      color: "bg-slate-50",
      accent: "text-primary",
      btn: "border-primary text-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <main className="pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-4 lg:px-8 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-primary">
              Des offres <span className="text-secondary">adaptées</span> à vos besoins
            </h1>
            <p className="text-xl text-neutral-dark/60">
              Découvrez nos 3 niveaux d'intervention. Une transparence totale sur les taux de portage et les conditions de sortie.
            </p>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-10 rounded-[3rem] flex flex-col relative overflow-hidden ${plan.color} ${plan.current ? 'shadow-2xl shadow-primary/20 scale-105 z-10' : 'border border-black/5'}`}
              >
                {plan.current && (
                  <div className="absolute top-6 right-6 bg-secondary text-primary text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full">
                    Recommandé
                  </div>
                )}
                
                <h3 className={`text-2xl font-display font-bold mb-2`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-5xl font-display font-black ${plan.accent}`}>{plan.price}</span>
                  <span className="opacity-50 text-sm font-medium">LTV Max*</span>
                </div>
                
                <p className="text-sm opacity-70 mb-8 leading-relaxed">
                  {plan.description}
                </p>

                <ul className="space-y-4 mb-12 flex-1">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3 text-sm font-medium">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.current ? 'bg-secondary text-primary' : 'bg-primary/10 text-primary'}`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="opacity-80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/register/particulier"
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 ${plan.btn.includes('bg-') ? plan.btn : 'border-2 ' + plan.btn}`}
                >
                  Choisir cette offre <ArrowRight size={18} />
                </Link>
              </motion.div>
            ))}
          </div>
          <p className="mt-12 text-center text-xs text-neutral-dark/40 font-medium">
            *LTV (Loan-To-Value) : Ratio du financement accordé par rapport à la valeur vénale du bien expertisé.<br/>
            Toutes nos offres incluent une faculté de rachat de 24 mois maximum.
          </p>
        </section>

        {/* Benefits Grid */}
        <section className="bg-slate-50 mt-32 py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-display font-bold text-primary">Les engagements Wallnut</h2>
              <p className="text-neutral-dark/60">Nous structurons l'offre financière pour protéger votre patrimoine.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: "Juridiquement blindé", desc: "Contrats rédigés par nos experts et huissiers." },
                { icon: Zap, title: "Fonds rapides", desc: "Déblocage en 72h après signature authentique." },
                { icon: Star, title: "Zéro Frais Cachés", desc: "Une grille tarifaire transparente dès le premier jour." },
                { icon: Zap, title: "Évaluation Juste", desc: "Double expertise pour garantir le meilleur prix." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2rem] border border-black/5 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <item.icon size={24} />
                  </div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-xs text-neutral-dark/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
