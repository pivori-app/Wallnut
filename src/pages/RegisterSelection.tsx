
import React from 'react';
import { motion } from 'motion/react';
import { User, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RegisterSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-primary mb-4"
          >
            Bienvenue sur Wallnut
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-neutral-dark/60"
          >
            Choisissez votre espace pour commencer l'aventure immobilière
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Particulier */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="glass p-8 rounded-[2rem] border border-white/40 shadow-xl flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <User size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Je suis un Particulier</h2>
            <p className="text-neutral-dark/60 mb-8">
              Suivi de projet, coffre-fort numérique et outils d'aide à la décision pour vos projets personnels.
            </p>
            <Link 
              to="/register/particulier"
              className="mt-auto w-full py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
            >
              C'est mon cas <ArrowRight size={20} />
            </Link>
          </motion.div>

          {/* Professionnel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="glass p-8 rounded-[2rem] border border-white/40 shadow-xl flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
              <Briefcase size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Je suis un Professionnel</h2>
            <p className="text-neutral-dark/60 mb-8">
              Gestion de leads, publication d'annonces, outils inter-cabinet et services dédiés à votre métier.
            </p>
            <Link 
              to="/register/professionnel"
              className="mt-auto w-full py-4 rounded-2xl bg-secondary text-white font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all"
            >
              Accès Pro <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-primary font-medium hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
