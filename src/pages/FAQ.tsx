import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';

export function FAQ() {
  const faqs = [
    {
      q: "Qu'est-ce que le portage immobilier ?",
      a: "Le portage immobilier est une solution de refinancement qui permet à un propriétaire de vendre temporairement son bien à un investisseur tout en continuant à l'occuper. Le propriétaire conserve une faculté de rachat exclusive, lui permettant d'annuler la vente à tout moment sur une période définie (souvent 24 mois)."
    },
    {
      q: "Est-ce sécurisé par un notaire ?",
      a: "Absolument. Toutes les transactions sans exception passent par un acte authentique signé devant notaire. Cela garantit la légalité de la procédure, la protection de vos droits et la sécurité des fonds."
    },
    {
      q: "Qui sont les investisseurs ?",
      a: "Wallnut travaille exclusivement avec des investisseurs institutionnels, des fonds spécialisés (OPCI, SCPI) et des entités professionnelles. Nous ne faisons pas de 'peer-to-peer' entre particuliers pour garantir une solidité financière et une déontologie irréprochable."
    },
    {
      q: "Que se passe-t-il si je ne peux pas racheter mon bien ?",
      a: "À la fin de la période de portage, si vous ne souhaitez pas ou ne pouvez pas racheter le bien, celui-ci est vendu sur le marché classique. Wallnut vous accompagne pour optimiser cette vente et vous permettre d'encaisser le complément de prix (la différence entre le prix de vente final et le prix de portage initial)."
    },
    {
      q: "Quels sont les délais de mise en place ?",
      a: "Dès que le dossier est complet, nous rendons une décision de principe sous 72h. Le déblocage des fonds dépend ensuite des délais légaux de purge du droit de préemption urbain, généralement 2 à 3 mois."
    },
    {
      q: "Combien ça coûte ?",
      a: "Les frais incluent l'indemnité d'occupation mensuelle et les frais de structuration du dossier. Chaque situation étant unique, nous fournissons une simulation détaillée et transparente dès l'ouverture du dossier."
    }
  ];

  const [activeIndex, setActiveIndex] = React.useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <header className="mb-16 text-center space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest">
               <HelpCircle size={14} /> Centre d'aide
             </div>
             <h1 className="text-4xl lg:text-6xl font-display font-bold text-primary">Questions <span className="text-secondary">Fréquentes</span></h1>
             <p className="text-neutral-dark/60 leading-relaxed max-w-xl mx-auto">
               Tout ce que vous devez savoir sur le portage immobilier institutionnel et la liquidité patrimoniale.
             </p>
          </header>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className={`glass border transition-all duration-300 ${activeIndex === idx ? 'border-primary/20 bg-white ring-4 ring-primary/5 shadow-xl' : 'border-black/5 hover:border-primary/10 rounded-[2rem]'}`}
                style={{ borderRadius: activeIndex === idx ? '2.5rem' : '1.5rem' }}
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                  className="w-full text-left p-8 flex items-center justify-between gap-4"
                >
                  <span className={`text-lg font-bold transition-colors ${activeIndex === idx ? 'text-primary' : 'text-primary/70'}`}>
                    {faq.q}
                  </span>
                  <div className={`p-2 rounded-xl transition-all ${activeIndex === idx ? 'bg-primary text-white rotate-180' : 'bg-primary/5 text-primary'}`}>
                    {activeIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {activeIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-neutral-dark/60 leading-relaxed text-base">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-20 glass p-12 rounded-[3rem] border border-black/5 flex flex-col md:flex-row items-center justify-between gap-8 bg-white shadow-sm">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-display font-bold text-primary">Vous ne trouvez pas votre réponse ?</h3>
              <p className="text-sm text-neutral-dark/60">Nos experts immobiliers et financiers vous répondent en direct.</p>
            </div>
            <button className="px-8 py-4 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/10">
              <MessageCircle size={20} /> Discuter avec un expert
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
