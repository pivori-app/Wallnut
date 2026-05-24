
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
            className="text-app-xl md:text-app-2xl font-display font-bold text-primary mb-4"
          >
            Bienvenue sur Wallnut
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-app-base text-neutral-dark/60"
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
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <User size={32} />
            </div>
            <h2 className="text-app-lg font-bold mb-3">Je suis un Particulier</h2>
            <p className="text-app-sm text-neutral-dark/60 mb-6">
              Suivi de projet, coffre-fort numérique et outils d'aide à la décision pour vos projets personnels.
            </p>
            <Link 
              to="/dashboard/particulier"
              className="mt-auto w-full min-h-[44px] px-6 py-3 rounded-2xl bg-primary text-white text-app-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              C'est mon cas <ArrowRight size={18} />
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
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
              <Briefcase size={32} />
            </div>
            <h2 className="text-app-lg font-bold mb-3">Je suis un Professionnel</h2>
            <p className="text-app-sm text-neutral-dark/60 mb-6">
              Gestion de leads, publication d'annonces, outils inter-cabinet et services dédiés à votre métier.
            </p>
            <Link 
              to="/dashboard/pro"
              className="mt-auto w-full min-h-[44px] px-6 py-3 rounded-2xl bg-secondary text-white text-app-sm font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
            >
              Accès Pro <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-primary text-app-sm font-medium hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
