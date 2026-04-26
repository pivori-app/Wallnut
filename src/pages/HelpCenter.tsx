import React from 'react';
import { motion } from 'motion/react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Search, Book, Shield, Wallet, Scale, LifeBuoy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HelpCenter() {
  const categories = [
    {
      icon: Wallet,
      title: "Financement & Portage",
      desc: "Tout savoir sur les taux, la LTV et le déblocage des fonds.",
      articles: ["Comment est calculé le prix de rachat ?", "Délais de versement des fonds", "L'indemnité d'occupation"]
    },
    {
      icon: Scale,
      title: "Juridique & Notarial",
      desc: "Comprendre le cadre légal et les garanties offertes.",
      articles: ["Le rôle du notaire", "La clause de rachat exclusif", "Sécurité des contrats"]
    },
    {
      icon: Shield,
      title: "Sécurité & Confidentialité",
      desc: "Comment Wallnut protège vos données et votre patrimoine.",
      articles: ["RGPD et discrétion", "Vérification des investisseurs", "Coffre-fort numérique"]
    },
    {
      icon: Book,
      title: "Guides Pratiques",
      desc: "Accompagnement pas à pas pour votre dossier.",
      articles: ["Pièces justificatives requises", "Utiliser le simulateur", "Suivre son dossier"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest leading-none">
              <LifeBuoy size={14} /> Centre d'aide
            </div>
            <h1 className="text-4xl lg:text-7xl font-display font-bold text-primary">Comment pouvons-nous <span className="text-secondary">vous aider ?</span></h1>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-secondary transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="Rechercher un article, un guide..."
                className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white border border-black/5 shadow-xl shadow-primary/5 focus:ring-4 focus:ring-secondary/10 outline-none transition-all placeholder:text-primary/20"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {categories.map((cat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-10 rounded-[3rem] border border-black/5 hover:border-secondary/20 transition-all group"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                    <cat.icon size={32} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-display font-bold text-primary">{cat.title}</h3>
                    <p className="text-neutral-dark/60 leading-relaxed">{cat.desc}</p>
                    <ul className="space-y-3 pt-4">
                      {cat.articles.map((art, aIdx) => (
                        <li key={aIdx}>
                          <Link to="/faq" className="flex items-center justify-between text-sm font-semibold text-primary/70 hover:text-secondary transition-colors group/link p-2 -mx-2 rounded-xl hover:bg-white">
                            {art}
                            <ArrowRight size={16} className="opacity-0 group-hover/link:opacity-100 transition-all -translate-x-2 group-hover/link:translate-x-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Need more help? */}
          <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[100px] -z-0" />
            <div className="relative z-10 space-y-4 text-center md:text-left">
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-white">Toujours des questions ?</h2>
              <p className="text-white/60 text-lg max-w-lg">Notre équipe d'experts est disponible pour vous accompagner personnellement dans votre projet.</p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="px-10 py-5 rounded-2xl bg-secondary text-primary font-bold hover:scale-105 transition-all text-center">
                Nous contacter
              </Link>
              <button className="px-10 py-5 rounded-2xl border-2 border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                Démarrer un chat
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
