import React from 'react';
import { motion } from 'motion/react';
import { User, Briefcase, ChevronRight, ScanLine } from 'lucide-react';
import { ClientType } from '../types';

interface Props {
  onSelect: (type: ClientType) => void;
}

export function ClientTypeSelector({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_60px_rgba(99,102,241,0.5)] mb-6">
            <ScanLine size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">DocScan Pro</h1>
          <p className="text-blue-300 text-lg font-medium">Scanner intelligent de documents</p>
          <p className="text-slate-500 text-sm mt-2">Guidage IA • PDF • Google Drive</p>
        </motion.div>

        {/* Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <p className="text-slate-400 text-center text-sm font-medium uppercase tracking-widest mb-6">
            Choisissez votre profil
          </p>

          {/* Particulier */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('particulier')}
            className="w-full group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-900/30 to-indigo-900/20 backdrop-blur-sm p-6 text-left transition-all hover:border-blue-400/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center text-3xl shrink-0">
                👤
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-xl">Particulier</h3>
                  <ChevronRight size={20} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-slate-400 text-sm mt-1">CNI, domicile, avis d'impôt, revenus…</p>
                <div className="flex gap-2 mt-3">
                  {['🪪', '🏠', '📋', '🏦', '💰'].map((icon, i) => (
                    <span key={i} className="text-lg">{icon}</span>
                  ))}
                  <span className="text-slate-500 text-sm self-center">+4</span>
                </div>
              </div>
            </div>
          </motion.button>

          {/* Professionnel */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('professionnel')}
            className="w-full group relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/30 to-purple-900/20 backdrop-blur-sm p-6 text-left transition-all hover:border-indigo-400/40 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/10 border border-indigo-500/30 flex items-center justify-center text-3xl shrink-0">
                🏢
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-xl">Professionnel</h3>
                  <ChevronRight size={20} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-slate-400 text-sm mt-1">Kbis, statuts, bilans, liasse fiscale…</p>
                <div className="flex gap-2 mt-3">
                  {['🏢', '📜', '🪪', '🏦', '📊'].map((icon, i) => (
                    <span key={i} className="text-lg">{icon}</span>
                  ))}
                  <span className="text-slate-500 text-sm self-center">+6</span>
                </div>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-slate-600 text-xs mt-8"
        >
          🔒 Vos documents restent confidentiels et sécurisés
        </motion.p>
      </div>
    </div>
  );
}
