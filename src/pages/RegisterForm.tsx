
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Briefcase, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building2, 
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { ProfessionalSubRole } from '../types';

export function RegisterForm() {
  const { type } = useParams<{ type: 'particulier' | 'professionnel' }>();
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password", "");
  const selectedSubRole = watch("subRole", "");

  const onSubmit = async (data: any) => {
    if (type === 'professionnel' && step === 1) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      // Flow: Sign in with Google first if not authenticated, then save profile
      let finalUser = user;
      if (!finalUser) {
        await signIn();
        // The signIn with popup will trigger the AuthProvider's onAuthStateChanged
        // which might try to create a default profile. 
        // We need to wait for the user to be available.
      }
      
      // Since signIn is async and sets state, we might need a small delay or a retry
      // But for the sake of this demo, we'll assume the user is now available via auth.currentUser
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Authentification requise");

      const profileData = {
        id: currentUser.uid,
        email: currentUser.email || data.email,
        displayName: data.firstName ? `${data.firstName} ${data.lastName}` : currentUser.displayName,
        role: type,
        phoneNumber: data.phone,
        city: data.city,
        createdAt: serverTimestamp(),
        isPro: type === 'professionnel',
        ...(type === 'professionnel' && {
          professionalData: {
            subRole: data.subRole,
            customSubRole: data.subRole === 'autre' ? data.customSubRole : undefined,
            companyName: data.companyName,
            siret: data.siret,
            professionalCard: data.professionalCard,
            address: data.address,
            isValidated: false
          }
        })
      };

      await setDoc(doc(db, 'users', currentUser.uid), profileData);
      
      setStep(3);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length > 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-12 rounded-[3rem] text-center max-w-md w-full shadow-2xl"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircle2 size={60} />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4">Compte créé !</h2>
          <p className="text-neutral-dark/60">
            Bienvenue dans l'écosystème Wallnut. Redirection vers votre dashboard en cours...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6 py-12">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/register" className="inline-flex items-center gap-2 text-primary hover:underline mb-6 font-medium">
            <ChevronLeft size={20} /> Retour au choix
          </Link>
          <h1 className="text-3xl font-display font-bold text-primary">
            Inscription {type === 'particulier' ? 'Particulier' : 'Professionnel'}
          </h1>
          {type === 'professionnel' && (
            <div className="flex justify-center mt-6 gap-2">
              <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 1 ? 'bg-secondary' : 'bg-slate-200'}`} />
              <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 2 ? 'bg-secondary' : 'bg-slate-200'}`} />
            </div>
          )}
        </div>

        <motion.div 
          layout
          className="glass p-8 md:p-10 rounded-[2.5rem] border border-white/40 shadow-2xl relative overflow-hidden"
        >
          {/* Glass background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 blur-3xl -z-10" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-dark ml-1">Prénom</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          {...register("firstName", { required: true })}
                          placeholder="Jean"
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-dark ml-1">Nom</label>
                      <input
                        {...register("lastName", { required: true })}
                        placeholder="Dupont"
                        className="w-full px-4 py-3.5 rounded-2xl bg-white/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-dark ml-1">Email professionnel</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        {...register("email", { 
                          required: "Email requis", 
                          pattern: { value: /^\S+@\S+$/i, message: "Email invalide" } 
                        })}
                        type="email"
                        placeholder="jean.dupont@email.com"
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message as string}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-dark ml-1">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          {...register("phone")}
                          placeholder="06 12 34 56 78"
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-dark ml-1">Ville</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          {...register("city")}
                          placeholder="Paris"
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-dark ml-1">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        {...register("password", { required: "Mot de passe requis", minLength: 8 })}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {/* Password Strength */}
                    <div className="h-1 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          getPasswordStrength() < 50 ? 'bg-red-400' : 
                          getPasswordStrength() < 100 ? 'bg-amber-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${getPasswordStrength()}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && type === 'professionnel' && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-dark ml-1">Votre métier</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                          {...register("subRole", { required: true })}
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 border border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none appearance-none"
                        >
                          <option value="">Sélectionnez votre profession</option>
                          <option value="agent_immobilier">Agent Immobilier</option>
                          <option value="notaire">Notaire</option>
                          <option value="cgp">CGP (Gestion de Patrimoine)</option>
                          <option value="courtier">Courtier</option>
                          <option value="avocat">Avocat</option>
                          <option value="diagnostiqueur">Diagnostiqueur</option>
                          <option value="architecte">Architecte</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedSubRole === 'autre' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <label className="text-sm font-semibold text-neutral-dark ml-1">Précisez votre profession</label>
                          <input
                            {...register("customSubRole", { required: selectedSubRole === 'autre' })}
                            placeholder="Ex: Expert Immobilier"
                            className="w-full px-4 py-3.5 rounded-2xl bg-white/50 border border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-dark ml-1">Nom de la société</label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            {...register("companyName", { required: true })}
                            placeholder="Wallnut Immobilier"
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 border border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-dark ml-1">SIRET</label>
                        <input
                          {...register("siret", { required: true })}
                          placeholder="123 456 789 00012"
                          className="w-full px-4 py-3.5 rounded-2xl bg-white/50 border border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-dark ml-1">N° Carte Pro / ORIAS</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        {...register("professionalCard")}
                        placeholder="CPI 7501 2024..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 border border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-dark ml-1">Adresse du cabinet/agence</label>
                    <input
                      {...register("address", { required: true })}
                      placeholder="12 rue de Rivoli, 75004 Paris"
                      className="w-full px-4 py-3.5 rounded-2xl bg-white/50 border border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                type === 'particulier' ? 'bg-primary text-white shadow-primary/20' : 'bg-secondary text-white shadow-secondary/20'
              } hover:scale-[1.02] active:scale-95 disabled:opacity-50`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {step === 1 && type === 'professionnel' ? 'Continuer' : 'Créer mon compte'}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          {step === 1 && (
            <div className="mt-8">
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/80 px-2 text-slate-400">Ou s'inscrire avec</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button 
                  onClick={signIn}
                  className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  <span className="text-sm font-bold text-neutral-dark">Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0077b5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <span className="text-sm font-bold text-neutral-dark">LinkedIn</span>
                </button>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-neutral-dark/60">
            Déjà un compte ? <Link to="/" onClick={signIn} className="text-primary font-bold hover:underline">Se connecter</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
