import React from 'react';
import { motion } from 'motion/react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { posts } from '../data/posts';

export function Blog() {
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
                className="group flex flex-col bg-white/70 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/40 hover:-translate-y-2 relative"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                <div className="aspect-[16/10] overflow-hidden relative border-b border-white/20">
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-500" />
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-white/80 backdrop-blur-md shadow-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-primary border border-white/50">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1 relative z-20">
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
                  
                  <Link to={`/blog/${post.slug || post.id}`} className="mt-auto inline-flex items-center w-full justify-between gap-2 px-6 py-4 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-2xl font-bold text-sm transition-all duration-300">
                    <span>Lire l'article</span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Link>
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
