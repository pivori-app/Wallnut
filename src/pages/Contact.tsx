import React from 'react';
import { motion } from 'motion/react';
import { PublicHeader } from '../components/PublicHeader';
import { Footer } from '../components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <main className="pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-7xl font-display font-bold text-primary"
            >
              Contactez <span className="text-secondary">Wallnut</span>
            </motion.h1>
            <p className="text-xl text-neutral-dark/60 max-w-2xl mx-auto">
              Une question sur le portage ? Nos experts vous accompagnent dans la structuration de votre patrimoine.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Info Cards */}
            <div className="space-y-6">
              {[
                { icon: Mail, title: "Email", info: "contact@wallnut.immo", sub: "Réponse sous 24h" },
                { icon: Phone, title: "Téléphone", info: "01 84 60 40 20", sub: "Lun-Ven, 9h-18h" },
                { icon: MapPin, title: "Siège Social", info: "12 Rue de la Paix", sub: "75002 Paris, France" }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-[2rem] bg-slate-50 border border-black/5 space-y-4"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">{item.title}</h3>
                    <p className="text-lg font-display font-bold text-primary/80">{item.info}</p>
                    <p className="text-sm text-neutral-dark/60">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
              
              <div className="p-8 rounded-[2rem] bg-primary text-white space-y-4 shadow-xl shadow-primary/20">
                <div className="flex items-center gap-3">
                  <Clock className="text-secondary" />
                  <span className="font-bold">Support Prioritaire</span>
                </div>
                <p className="text-sm opacity-80">
                  Déjà client ? Utilisez votre messagerie sécurisée dans votre tableau de bord pour un traitement plus rapide.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 md:p-12 rounded-[3rem] border border-black/5 shadow-2xl relative"
              >
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary ml-1">Nom Complet</label>
                      <input 
                        type="text" 
                        placeholder="Jean Dupont"
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary ml-1">Email</label>
                      <input 
                        type="email" 
                        placeholder="jean@exemple.com"
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary ml-1">Sujet</label>
                    <select className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none appearance-none">
                      <option>Demande d'information portage</option>
                      <option>Partenariat Professionnel</option>
                      <option>Problème technique</option>
                      <option>Autre</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary ml-1">Message</label>
                    <textarea 
                      rows={6}
                      placeholder="Comment pouvons-nous vous aider ?"
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none"
                    ></textarea>
                  </div>

                  <button className="w-full py-5 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/95 hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                    Envoyer le message <Send size={20} />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
