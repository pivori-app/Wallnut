import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { posts } from '../data/posts';
import Markdown from 'react-markdown';

export function BlogPost() {
  const { id } = useParams();
  const post = posts.find((p) => p.slug === id || p.id.toString() === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <PublicHeader />
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-primary mb-4">Article introuvable</h1>
          <p className="text-neutral-dark/60 mb-8">Cet article n'existe pas ou a été déplacé.</p>
          <Link to="/blog" className="text-secondary font-bold hover:underline">
            Retour au blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors mb-12">
            <ArrowLeft size={18} /> Retour aux articles
          </Link>

          <article>
            <header className="mb-12">
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-primary mb-6">
                <span className="px-3 py-1 bg-primary/5 rounded-full">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 opacity-50"><Calendar size={14} /> {post.date}</span>
                <span className="flex items-center gap-1 opacity-50"><User size={14} /> {post.readTime}</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-display font-bold text-primary leading-tight mb-8">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-primary">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-primary">{post.author}</p>
                  <p className="text-sm text-neutral-dark/60">Auteur</p>
                </div>
              </div>
            </header>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-[21/9] rounded-[2rem] overflow-hidden mb-12 shadow-2xl relative border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent mix-blend-multiply" />
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="prose prose-slate lg:prose-lg prose-headings:font-display prose-headings:font-bold prose-headings:text-primary prose-a:text-secondary prose-p:text-neutral-dark/80 max-w-none glass p-8 md:p-12 rounded-[2rem] border-white/20 shadow-xl relative z-10 backdrop-blur-xl bg-white/60">
              <Markdown>{post.content}</Markdown>
            </div>
            
            <div className="mt-16 pt-8 border-t border-black/5 flex justify-between items-center">
              <p className="font-bold text-primary">Partager cet article :</p>
              <div className="flex gap-4">
                <button className="p-3 bg-white hover:bg-slate-100 rounded-full shadow-sm transition-colors text-primary font-bold uppercase text-xs tracking-wider">Twitter / X</button>
                <button className="p-3 bg-white hover:bg-slate-100 rounded-full shadow-sm transition-colors text-primary font-bold uppercase text-xs tracking-wider">LinkedIn</button>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
