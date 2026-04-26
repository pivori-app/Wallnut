import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Shield, Download, Trash2, Camera, Mail, 
  MapPin, Phone, Lock, Eye, EyeOff, FileText, Database, Share2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'privacy'>('profile');
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profil & Coordonnées', icon: User },
    { id: 'security', label: 'Sécurité & Accès', icon: Shield },
    { id: 'privacy', label: 'Données & RGPD 2026', icon: Database },
  ] as const;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-4xl font-display font-bold text-primary">Paramètres du compte</h1>
        <p className="text-neutral-dark/60 mt-2 text-lg">Gérez vos préférences, votre sécurité et vos données personnelles.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2 shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all",
                  isActive 
                    ? "bg-primary text-white shadow-lg scale-105" 
                    : "bg-white/40 text-primary hover:bg-white/80 hover:scale-[1.02]"
                )}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-primary/60"} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[2rem] border border-black/5"
          >
            {activeTab === 'profile' && (
              <div className="space-y-10">
                <div>
                  <h2 className="text-2xl font-display font-bold text-primary mb-6">Photo de profil</h2>
                  <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden transition-transform group-hover:scale-105">
                        <User size={40} className="text-primary/40 group-hover:opacity-0 transition-opacity" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera size={24} className="text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-sm font-medium text-neutral-dark/80">Recommandé : Image carrée, max 5 Mo.</p>
                       <div className="flex gap-3">
                         <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all">Changer</button>
                         <button className="px-4 py-2 bg-white/60 text-primary rounded-xl text-sm font-bold border border-black/5 hover:bg-white transition-all">Supprimer</button>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-10">
                  <h2 className="text-2xl font-display font-bold text-primary mb-6">Coordonnées</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-primary">Prénom</label>
                      <input type="text" defaultValue="Jean" className="w-full bg-white/60 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-primary">Nom</label>
                      <input type="text" defaultValue="Dupont" className="w-full bg-white/60 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-primary">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                        <input type="email" defaultValue={user?.email === 'particulier@demo.com' ? 'jean.dupont@email.com' : user?.email || ''} className="w-full bg-white/60 border border-black/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-primary">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                        <input type="tel" defaultValue="+33 6 12 34 56 78" className="w-full bg-white/60 border border-black/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium" />
                      </div>
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-bold text-primary">Adresse (Norme 2026 CEDEX)</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                        <input type="text" defaultValue="12 Rue des Lilas, 69002 Lyon" className="w-full bg-white/60 border border-black/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-8">
                    <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10">
                <div>
                  <h2 className="text-2xl font-display font-bold text-primary mb-6">Changer le mot de passe</h2>
                  <div className="space-y-6 max-w-md">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-primary">Mot de passe actuel</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-white/60 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-primary">Nouveau mot de passe</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="8 caractères minimum" 
                          className="w-full bg-white/60 border border-black/10 rounded-xl pr-12 pl-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium" 
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                      Mettre à jour
                    </button>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-primary">Authentification Double Facteur (2FA)</h2>
                      <p className="text-neutral-dark/60 mt-2">Sécurisez votre compte avec un code envoyé sur votre mobile.</p>
                    </div>
                    <button className="px-6 py-3 bg-white/60 text-primary border border-black/10 rounded-xl font-bold hover:bg-white transition-all">
                      Activer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-10">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="text-accent" size={28} />
                    <h2 className="text-2xl font-display font-bold text-primary">Espace RGPD & Normes 2026</h2>
                  </div>
                  <p className="text-neutral-dark/80 mb-6">Conformément aux nouvelles directives européennes de 2026 sur la portabilité accrue et le droit à l'oubli absolu, vous avez le contrôle total sur vos données.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/40 p-5 rounded-2xl border border-black/5 flex flex-col items-start gap-4 hover:shadow-md transition-all">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary"><Download size={24} /></div>
                      <div>
                        <h3 className="font-bold text-primary text-lg">Portabilité 3.0</h3>
                        <p className="text-sm text-neutral-dark/70 mt-1">Téléchargez l'intégralité de votre vault chiffré incluant actes, DPE et historiques au format JSON/PDF.</p>
                      </div>
                      <button className="mt-auto px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-bold text-sm transition-all">
                        Télécharger mes données
                      </button>
                    </div>
                    
                    <div className="bg-white/40 p-5 rounded-2xl border border-black/5 flex flex-col items-start gap-4 hover:shadow-md transition-all">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary"><Share2 size={24} /></div>
                      <div>
                        <h3 className="font-bold text-primary text-lg">Interopérabilité Notaire</h3>
                        <p className="text-sm text-neutral-dark/70 mt-1">Générez un lien sécurisé éphémère (norme ANSSI 2026) pour transférer vos données à un office notarial.</p>
                      </div>
                      <button className="mt-auto px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-bold text-sm transition-all">
                        Créer un accès
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-10">
                   <h2 className="text-2xl font-display font-bold text-primary mb-2">Consentements</h2>
                   <div className="space-y-4 max-w-2xl mt-6">
                      {[
                        "Exploitation anonymisée pour statistiques territoriales",
                        "Partage avec nos partenaires de courtage certifiés",
                        "Réception de la newsletter technologique"
                      ].map((text, i) => (
                        <label key={i} className="flex items-center justify-between p-4 bg-white/40 border border-black/5 rounded-xl cursor-pointer hover:bg-white/60 transition-colors">
                          <span className="font-medium text-primary text-sm">{text}</span>
                          <div className="relative">
                            <input type="checkbox" className="peer sr-only" defaultChecked={i === 0} />
                            <div className="w-11 h-6 bg-black/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors"></div>
                          </div>
                        </label>
                      ))}
                   </div>
                </div>

                <div className="border-t border-red-500/20 pt-10 mt-10">
                  <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl">
                    <h2 className="text-xl font-display font-bold text-red-600 mb-2 flex items-center gap-2">
                       <Trash2 size={24} /> Droit à l'oubli (Zone de danger)
                    </h2>
                    <p className="text-red-600/80 mb-6 text-sm">La suppression de votre compte est définitive. Toutes vos données immobilières, vos contrats et votre coffre-fort seront détruits de manière irréversible sous 24h ouvrées.</p>
                    
                    <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 hover:shadow-xl hover:-translate-y-0.5 hover:bg-red-700 transition-all flex items-center gap-2">
                      Supprimer mon compte définitivement
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
