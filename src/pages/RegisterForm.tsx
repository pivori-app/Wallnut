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
  Building2,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';
import { AddressSearchInput } from '../components/AddressSearchInput';
import {
  validateName,
  formatName,
  validatePhone,
  formatPhone,
  validateSIRET,
  formatSIRET,
} from '../utils/validators';

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
type RegisterType = 'particulier' | 'professionnel';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  subRole: string;
  customSubRole: string;
  companyName: string;
  siret: string;
  professionalCard: string;
}

// ─────────────────────────────────────────────────────────
// SOUS-COMPOSANTS UI UNIFIÉS
// ─────────────────────────────────────────────────────────

/** Label unifié */
const FieldLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block text-[13px] font-semibold text-neutral-dark/80 mb-1.5 ml-1">
    {children}
    {required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

/** Message d'erreur unifié */
const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="flex items-center gap-1 text-[12px] text-red-500 mt-1 ml-1">
      <AlertCircle size={11} className="flex-shrink-0" />
      {message}
    </p>
  ) : null;

/** Input de base unifié */
const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-3 rounded-2xl text-[14px] leading-snug
   bg-white/60 border transition-all outline-none
   placeholder:text-slate-400 placeholder:text-[13px]
   ${
     hasError
       ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
       : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
   }`;

/** Input avec icône gauche */
const inputWithIconClass = (hasError?: boolean) =>
  `${inputClass(hasError)} pl-11`;

// ─────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────
export function RegisterForm() {
  const { type } = useParams<{ type: RegisterType }>();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [attestationStatus, setAttestationStatus] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      subRole: '',
      customSubRole: '',
      companyName: '',
      siret: '',
      professionalCard: '',
    },
  });

  const password = watch('password', '');
  const selectedSubRole = watch('subRole', '');
  const isPro = type === 'professionnel';

  // ── Attestation simulée ──────────────────────────────
  const simulateAttestation = async () => {
    setAttestationStatus('Calcul de la preuve DPoP...');
    await new Promise((r) => setTimeout(r, 700));
    setAttestationStatus('Génération attestation cryptographique...');
    await new Promise((r) => setTimeout(r, 700));
    setAttestationStatus('Score validé (0.98).');
    await new Promise((r) => setTimeout(r, 400));
    setAttestationStatus(null);
  };

  // ── Google OAuth ─────────────────────────────────────
  const handleGoogleSignIn = async () => {
    if (window.top !== window.self) {
      setError(
        "L'Aperçu (iFrame) peut bloquer Google Auth. Veuillez ouvrir l'application dans un nouvel onglet, et surtout, assurez-vous d'avoir configuré le provider Google dans Supabase."
      );
      return;
    }
    
    // Check if the user really wants to proceed since Google Auth requires a configured client_id
    const confirmGoogle = window.confirm("ATTENTION: Pour que la connexion Google fonctionne, vous DEVEZ d'abord obtenir un 'Client ID' depuis Google Cloud Console et le configurer dans 'Supabase > Authentication > Providers > Google'.\\n\\nSi c'est fait (ou pour vérifier), cliquez sur OK. Sinon, cliquez sur Annuler et utilisez l'inscription par Email en dessous.");
    
    if (!confirmGoogle) return;

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (oauthError) {
      setError('Erreur de connexion Google. Veuillez réessayer.');
    }
  };

  // ── Force du mot de passe ────────────────────────────
  const getPasswordStrength = (): number => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };

  const strengthColor = () => {
    const s = getPasswordStrength();
    if (s < 50) return 'bg-red-400';
    if (s < 75) return 'bg-amber-400';
    if (s < 100) return 'bg-blue-400';
    return 'bg-green-400';
  };

  const strengthLabel = () => {
    const s = getPasswordStrength();
    if (!password) return '';
    if (s < 50) return 'Faible';
    if (s < 75) return 'Moyen';
    if (s < 100) return 'Fort';
    return 'Très fort';
  };

  // ── Soumission ────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (
        !import.meta.env.VITE_SUPABASE_URL ||
        !import.meta.env.VITE_SUPABASE_URL.startsWith('https')
      ) {
        setError(
          'Configuration Supabase manquante. Vérifiez vos variables d\'environnement.'
        );
        return;
      }

      await simulateAttestation();

      const profileData = isPro
        ? {
            displayName:
              data.companyName ||
              `${data.firstName} ${data.lastName}`.trim(),
            role: 'professional',
            phoneNumber: data.phone,
            city: selectedAddress?.city || '',
            isPro: true,
            professionalData: JSON.stringify({
              proId: `WP-PRO-${Math.floor(Math.random() * 90000 + 10000)}`,
              subRole: data.subRole,
              activity: data.customSubRole || data.subRole,
              companyName: data.companyName,
              siret: data.siret.replace(/\s/g, ''),
              professionalCard: data.professionalCard || '',
              address: selectedAddress?.fullAddress || '',
              isValidated: false,
            }),
          }
        : {
            displayName: `${data.firstName} ${data.lastName}`.trim(),
            role: 'particular',
            phoneNumber: data.phone,
            city: selectedAddress?.city || '',
            isPro: false,
            professionalData: null,
          };

      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: profileData,
          },
        });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erreur lors de la création du compte.');

      setStep(3);
    } catch (err: any) {
      console.error('Registration error:', err);
      let msg = err.message || "Erreur lors de l'inscription.";
      if (msg === 'Failed to fetch') {
        msg = 'Erreur réseau. Vérifiez votre connexion et la configuration Supabase.';
      } else if (msg.includes('already registered')) {
        msg = 'Cet email est déjà utilisé. Essayez de vous connecter.';
      } else if (msg.includes('Password should be')) {
        msg = 'Le mot de passe doit contenir au moins 8 caractères.';
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Confetti sur succès ───────────────────────────────
  React.useEffect(() => {
    if (step !== 3) return;
    const duration = 3000;
    const end = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };
    const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
    const interval = setInterval(() => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const count = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount: count, origin: { x: rnd(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount: count, origin: { x: rnd(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
    return () => clearInterval(interval);
  }, [step]);

  // ── Popup succès ──────────────────────────────────────
  const SuccessPopup = () => (
    <AnimatePresence>
      {step === 3 && (
        <motion.div
          key="success-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center 
                     p-4 bg-slate-900/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 32 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-[2rem] shadow-2xl 
                       w-full max-w-md mx-auto p-8 overflow-hidden
                       border border-white/60"
          >
            {/* Déco arrière-plan */}
            <div className="absolute top-0 right-0 w-40 h-40 
                            bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 
                            bg-secondary/5 blur-3xl pointer-events-none" />

            {/* Icône */}
            <div className="w-20 h-20 bg-green-50 rounded-full 
                            flex items-center justify-center mx-auto mb-5
                            ring-4 ring-green-100">
              <CheckCircle2 size={44} className="text-green-500" />
            </div>

            {/* Titre */}
            <h2 className="text-[22px] font-bold text-center text-neutral-dark 
                           mb-2 tracking-tight">
              Inscription réussie ! 🎉
            </h2>
            <p className="text-[14px] text-center text-neutral-dark/60 mb-6">
              Bienvenue dans l'écosystème Wallnut
              {isPro ? ' Pro' : ''}.
            </p>

            {/* Bloc email */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl 
                            p-5 mb-5">
              <p className="text-[15px] font-bold text-primary mb-1">
                Validez votre adresse email
              </p>
              <p className="text-[13px] text-neutral-dark/70 leading-relaxed">
                Rendez-vous dans votre boîte mail et cliquez sur le
                lien de confirmation pour activer votre accès au dashboard.
              </p>
            </div>

            {/* Bloc sécurité */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl 
                            p-4 mb-7 flex items-start gap-3">
              <Shield size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-bold text-blue-900 
                               uppercase tracking-wider mb-1">
                  Sécurité Anti-Phishing
                </p>
                <p className="text-[12px] text-blue-800/70 leading-relaxed">
                  Recherchez le logo Wallnut certifié dans votre client
                  mail pour garantir l'authenticité de l'expéditeur.
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center gap-2
                         min-h-[48px] py-3 px-6 rounded-2xl
                         text-[15px] font-bold text-white
                         bg-gradient-to-r from-primary to-primary/90
                         hover:from-primary/90 hover:to-primary
                         shadow-lg shadow-primary/20
                         transition-all hover:scale-[1.02] active:scale-95"
            >
              Aller au dashboard
              <ChevronRight size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-slate-50 to-slate-100 
                    px-4 py-10 sm:px-6">
      <SuccessPopup />

      <div className="w-full max-w-lg">
        {/* ── En-tête ── */}
        <div className="text-center mb-6">
          <Link
            to="/register"
            className="inline-flex items-center justify-center 
                       w-10 h-10 rounded-full text-primary 
                       hover:bg-slate-100 transition-colors mb-3"
            aria-label="Retour"
          >
            <ChevronLeft size={22} />
          </Link>

          <h1 className="text-[22px] sm:text-[26px] font-bold 
                         text-primary tracking-tight">
            Inscription{' '}
            {isPro ? 'Professionnel' : 'Particulier'}
          </h1>

          <p className="text-[13px] text-neutral-dark/50 mt-1">
            {isPro
              ? 'Accédez à tous les outils pros Wallnut'
              : 'Créez votre espace personnel gratuit'}
          </p>

          {/* Stepper pro */}
          {isPro && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-7 h-7 
                                rounded-full text-[12px] font-bold
                                transition-all duration-300
                                ${
                                  step >= s
                                    ? 'bg-secondary text-white shadow-md shadow-secondary/30'
                                    : 'bg-slate-200 text-slate-400'
                                }`}
                  >
                    {s}
                  </div>
                  <span
                    className={`text-[12px] font-medium transition-colors
                                ${step >= s ? 'text-secondary' : 'text-slate-400'}`}
                  >
                    {s === 1 ? 'Informations' : 'Société'}
                  </span>
                  {s < 2 && (
                    <ChevronRight size={14} className="text-slate-300 mx-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Carte principale ── */}
        <div className="relative bg-white/80 backdrop-blur-sm 
                        rounded-[2rem] border border-white/60
                        shadow-xl shadow-slate-200/60 p-6 sm:p-8">
          {/* Déco */}
          <div className="absolute inset-0 rounded-[2rem] 
                          overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-0 right-0 w-32 h-32 
                            bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 
                            bg-secondary/5 blur-3xl" />
          </div>

          {/* ── Erreur globale ── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-4 mb-5
                         bg-red-50 border border-red-200 
                         rounded-2xl text-[13px] text-red-700"
            >
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* ── Bouton Google ── */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3
                       min-h-[48px] px-5 py-3
                       bg-white border border-slate-200 rounded-2xl
                       text-[14px] font-semibold text-slate-700
                       hover:border-slate-300 hover:bg-slate-50
                       shadow-sm transition-all hover:shadow-md
                       active:scale-[0.98]"
          >
            {/* SVG Google */}
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuer avec Google
          </button>

          {/* Séparateur */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white/80 text-[12px] 
                               text-slate-400 font-medium">
                ou créez un compte
              </span>
            </div>
          </div>

          {/* ── FORMULAIRE ── */}
          <form
            onSubmit={handleSubmit(onSubmit, (errs) =>
              console.log('Validation errors:', errs)
            )}
            noValidate
          >
            {/* ════════════════════════════════════════
                ÉTAPE 1 — Infos personnelles
                ════════════════════════════════════════ */}
            <div className={step === 1 ? 'block' : 'hidden'}>
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Prénom + Nom */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Prénom</FieldLabel>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 
                                   text-slate-400 pointer-events-none"
                      />
                      <input
                        {...register('firstName', {
                          required: 'Prénom requis',
                          validate: validateName,
                          onChange: (e) => {
                            e.target.value = formatName(e.target.value);
                          },
                        })}
                        placeholder="Jean"
                        autoComplete="given-name"
                        className={inputWithIconClass(!!errors.firstName)}
                      />
                    </div>
                    <FieldError message={errors.firstName?.message as string} />
                  </div>

                  <div>
                    <FieldLabel required>Nom</FieldLabel>
                    <input
                      {...register('lastName', {
                        required: 'Nom requis',
                        validate: validateName,
                        onChange: (e) => {
                          e.target.value = formatName(e.target.value);
                        },
                      })}
                      placeholder="Dupont"
                      autoComplete="family-name"
                      className={inputClass(!!errors.lastName)}
                    />
                    <FieldError message={errors.lastName?.message as string} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <FieldLabel required>
                    Email{isPro ? ' professionnel' : ''}
                  </FieldLabel>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 
                                 text-slate-400 pointer-events-none"
                    />
                    <input
                      {...register('email', {
                        required: 'Email requis',
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Format d'email invalide",
                        },
                      })}
                      type="email"
                      placeholder="jean.dupont@email.com"
                      autoComplete="email"
                      className={inputWithIconClass(!!errors.email)}
                    />
                  </div>
                  <FieldError message={errors.email?.message as string} />
                </div>

                {/* Téléphone */}
                <div>
                  <FieldLabel required>Téléphone</FieldLabel>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 
                                 text-slate-400 pointer-events-none"
                    />
                    <input
                      {...register('phone', {
                        required: 'Téléphone requis',
                        validate: (v) =>
                          validatePhone(v, isPro),
                        onChange: (e) => {
                          e.target.value = formatPhone(e.target.value);
                        },
                      })}
                      placeholder={isPro ? '01 23 45 67 89' : '06 12 34 56 78'}
                      autoComplete="tel"
                      className={inputWithIconClass(!!errors.phone)}
                    />
                  </div>
                  <FieldError message={errors.phone?.message as string} />
                </div>

                {/* Adresse — Particulier seulement */}
                {!isPro && (
                  <div className="relative z-50">
                    <FieldLabel>Adresse</FieldLabel>
                    <AddressSearchInput
                      onAddressSelect={(addr) => setSelectedAddress(addr)}
                      placeholder="Saisissez votre adresse..."
                    />
                  </div>
                )}

                {/* Mot de passe */}
                <div>
                  <FieldLabel required>Mot de passe</FieldLabel>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 
                                 text-slate-400 pointer-events-none"
                    />
                    <input
                      {...register('password', {
                        required: 'Mot de passe requis',
                        minLength: {
                          value: 8,
                          message: '8 caractères minimum',
                        },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={inputWithIconClass(!!errors.password)}
                      style={{ paddingRight: '44px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 
                                 text-slate-400 hover:text-primary 
                                 transition-colors p-1"
                      aria-label={
                        showPassword
                          ? 'Masquer le mot de passe'
                          : 'Afficher le mot de passe'
                      }
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <FieldError message={errors.password?.message as string} />

                  {/* Barre de force */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[25, 50, 75, 100].map((threshold) => (
                          <div
                            key={threshold}
                            className={`h-1 flex-1 rounded-full transition-all duration-500
                              ${
                                getPasswordStrength() >= threshold
                                  ? strengthColor()
                                  : 'bg-slate-100'
                              }`}
                          />
                        ))}
                      </div>
                      <p className="text-[12px] text-slate-500 text-right">
                        {strengthLabel()}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* ════════════════════════════════════════
                ÉTAPE 2 — Infos professionnelles
                ════════════════════════════════════════ */}
            {isPro && (
              <div className={step === 2 ? 'block' : 'hidden'}>
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {/* Métier */}
                  <div>
                    <FieldLabel required>Votre métier</FieldLabel>
                    <div className="relative">
                      <Briefcase
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 
                                   text-slate-400 pointer-events-none z-10"
                      />
                      <select
                        {...register('subRole', {
                          required: 'Veuillez sélectionner un métier',
                        })}
                        className={`${inputWithIconClass(!!errors.subRole)} 
                                    appearance-none bg-white/60 cursor-pointer`}
                      >
                        <option value="">Sélectionnez votre profession</option>
                        <option value="agent_immobilier">Agent Immobilier</option>
                        <option value="notaire">Notaire</option>
                        <option value="cgp">CGP — Gestion de Patrimoine</option>
                        <option value="courtier">Courtier</option>
                        <option value="avocat">Avocat</option>
                        <option value="diagnostiqueur">Diagnostiqueur</option>
                        <option value="architecte">Architecte</option>
                        <option value="geometre">Géomètre</option>
                        <option value="promoteur">Promoteur Immobilier</option>
                        <option value="autre">Autre profession</option>
                      </select>
                    </div>
                    <FieldError message={errors.subRole?.message as string} />
                  </div>

                  {/* Autre profession */}
                  <AnimatePresence>
                    {selectedSubRole === 'autre' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FieldLabel required>Précisez votre profession</FieldLabel>
                        <input
                          {...register('customSubRole', {
                            required:
                              selectedSubRole === 'autre'
                                ? 'Précision requise'
                                : false,
                          })}
                          placeholder="Ex: Expert en évaluation immobilière"
                          className={inputClass(!!errors.customSubRole)}
                        />
                        <FieldError
                          message={errors.customSubRole?.message as string}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Nom société */}
                  <div>
                    <FieldLabel required>Nom de la société</FieldLabel>
                    <div className="relative">
                      <Building2
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 
                                   text-slate-400 pointer-events-none"
                      />
                      <input
                        {...register('companyName', {
                          required: 'Nom de société requis',
                          minLength: {
                            value: 2,
                            message: 'Nom trop court',
                          },
                          pattern: {
                            value:
                              /^[^!@#$%^&*()_=+[\]{};':"\\|<>/?]+$/,
                            message: 'Caractères spéciaux interdits',
                          },
                        })}
                        placeholder="Mon Agence Immobilière"
                        autoComplete="organization"
                        className={inputWithIconClass(!!errors.companyName)}
                      />
                    </div>
                    <FieldError
                      message={errors.companyName?.message as string}
                    />
                  </div>

                  {/* SIRET */}
                  <div>
                    <FieldLabel required>Numéro SIRET</FieldLabel>
                    <input
                      {...register('siret', {
                        required: 'SIRET requis',
                        validate: validateSIRET,
                        onChange: (e) => {
                          const formatted = formatSIRET(e.target.value);
                          e.target.value = formatted;
                          setValue('siret', formatted, { shouldValidate: true });
                        },
                      })}
                      placeholder="732 829 320 00074"
                      inputMode="numeric"
                      className={`${inputClass(!!errors.siret)} font-mono tracking-wider`}
                    />
                    <FieldError message={errors.siret?.message as string} />
                    <p className="text-[11px] text-slate-400 mt-1 ml-1">
                      14 chiffres — Validé par l'algorithme 
                    </p>
                  </div>
                  
                  {/* Carte PRO */}
                  {['agent_immobilier', 'cgp', 'courtier'].includes(selectedSubRole) && (
                  <div>
                    <FieldLabel>N° Carte Pro / ORIAS (Optionnel)</FieldLabel>
                    <div className="relative">
                      <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        {...register('professionalCard')}
                        placeholder="CPI 7501 2024..."
                        className={inputWithIconClass()}
                      />
                    </div>
                  </div>
                  )}

                  {/* Adresse */}
                  <div className="relative z-40">
                    <FieldLabel>Adresse du cabinet/agence</FieldLabel>
                    <AddressSearchInput
                      onAddressSelect={(addr) => setSelectedAddress(addr)}
                      placeholder="Recherche automatique..."
                    />
                  </div>
                </motion.div>
              </div>
            )}

            {/* BUTTONS */}
            <div className="mt-8 flex gap-3">
              {isPro && step === 1 ? (
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await trigger(['firstName', 'lastName', 'email', 'phone', 'password']);
                    if (ok) setStep(2);
                  }}
                  className="w-full flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 bg-secondary text-white font-bold rounded-2xl transition-all shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95"
                >
                  Suivant
                  <ChevronRight size={18} />
                </button>
              ) : (
                <div className="w-full flex gap-3">
                  {isPro && step === 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center justify-center w-12 min-h-[48px] bg-slate-100 text-slate-600 rounded-2xl transition-all hover:bg-slate-200"
                    >
                      <ChevronLeft size={18} />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 text-white font-bold rounded-2xl transition-all shadow-lg ${
                      isPro 
                        ? 'bg-secondary shadow-secondary/20 hover:bg-secondary/90' 
                        : 'bg-primary shadow-primary/20 hover:bg-primary/90'
                    } hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100`}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Terminer l'inscription
                        <CheckCircle2 size={18} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            
            {/* Simulation attestation */}
            <AnimatePresence>
              {attestationStatus && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 text-[12px] text-center text-slate-500 flex items-center justify-center gap-2"
                >
                  <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  {attestationStatus}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Footer form */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-[13px] text-slate-500">
              Déjà un compte ?{' '}
              <Link to="/" onClick={signIn} className="text-primary font-bold hover:underline">
                Se connecter
              </Link>
            </p>
            <div className="mt-4 text-[11px] text-slate-400 flex flex-col items-center gap-1">
              <p>Protégé par reCAPTCHA — Wallnut Technologies SAS</p>
              <div className="flex gap-2">
                <Link to="/legal" className="hover:text-slate-600 transition-colors">Confidentialité</Link>
                <span>•</span>
                <Link to="/legal" className="hover:text-slate-600 transition-colors">CGU</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
