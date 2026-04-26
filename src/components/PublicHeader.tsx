import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signIn, user } = useAuth();

  const links = [
    { label: 'Solution', href: '/solution' },
    { label: 'Offres', href: '/offres' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.label}
                to={link.href}
                className="text-sm font-semibold opacity-70 hover:opacity-100 hover:text-primary transition-all underline-offset-8 hover:underline"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-4 w-px bg-black/10 mx-2"></div>
            {user ? (
              <Link 
                to="/dashboard"
                className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  onClick={signIn}
                  className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Se connecter
                </button>
                <Link 
                  to="/register"
                  className="px-5 py-2.5 rounded-full bg-secondary text-white text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-secondary/20"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-black/5 rounded-xl transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar / Sandwich Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-[280px] bg-white dark:bg-[#121826] shadow-2xl z-50 p-6 flex flex-col md:hidden"
          >
            <div className="flex justify-between items-center mb-10">
              <span className="font-display font-bold text-primary dark:text-white">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-black/5 rounded-xl">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block p-4 rounded-2xl bg-black/5 dark:bg-white/5 text-lg font-bold hover:bg-primary hover:text-white transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-black/5 space-y-4">
              {user ? (
                <Link 
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-bold"
                >
                  Accéder au Dashboard
                </Link>
              ) : (
                <>
                  <button 
                    onClick={() => { signIn(); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-primary text-primary font-bold"
                  >
                    <LogIn className="w-5 h-5" /> Connexion
                  </button>
                  <Link 
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-secondary text-white font-bold"
                  >
                    Créer un compte
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </nav>
  );
}
