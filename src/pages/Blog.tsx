import React from 'react';
import { motion } from 'motion/react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Blog() {
  const posts = [
    {
      id: 1,
      title: "Portage immobilier : Le guide complet 2024",
      excerpt: "Découvrez comment le portage immobilier peut sauver votre patrimoine et offrir une liquidité immédiate sans passer par les banques.",
      category: "Guide",
      date: "24 Mars 2024",
      author: "Équipe Wallnut",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Vente à réméré VS Portage : Quelles différences ?",
      excerpt: "Analyse comparative des deux solutions phares de la liquidité immobilière. Sécurité, délais et fiscalité passés au crible.",
      category: "Finance",
      date: "12 Mars 2024",
      author: "Marc Lefebvre",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1454165833767-1306d644633b?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "Comment sortir du surendettement grâce à l'immobilier ?",
      excerpt: "Le portage n'est pas seulement une solution financière, c'est un levier de restructuration pour repartir sur des bases saines.",
      category: "Conseils",
      date: "05 Mars 2024",
      author: "Sarah Mendy",
      readTime: "10 min",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 4,
      title: "Investir en portage : Opportunités institutionnelles",
      excerpt: "Pourquoi les fonds immobiliers se tournent massivement vers le portage structuré. Rendement et impact social.",
      category: "Investissement",
      date: "01 Mars 2024",
      author: "Gestion Wallnut",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1460472178825-e51c0621995a?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <header className="mb-16 text-center max-w-2xl mx-auto space-y-6">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
               <BookOpen size={14} /> Le Blog Wallnut
             </div>
             <h1 className="text-4xl lg:text-6xl font-display font-bold text-primary">Réflexions sur la <span className="text-secondary"> liquidité</span></h1>
             <p className="text-neutral-dark/60 leading-relaxed">
               Expertises, guides et actualités pour comprendre le portage immobilier et optimiser la gestion de vos actifs.
             </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-black/5"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-neutral-dark/40 mb-4">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {post.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl font-display font-bold text-primary mb-4 group-hover:text-secondary transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h2>
                  
                  <p className="text-sm text-neutral-dark/60 line-clamp-3 mb-8 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <button className="mt-auto flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-4 transition-all">
                    Lire l'article <ArrowRight size={18} className="text-secondary" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-20 text-center">
            <button className="px-8 py-4 rounded-full border-2 border-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all">
              Afficher plus d'articles
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
