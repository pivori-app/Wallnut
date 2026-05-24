import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import {
  validateName, formatName,
  validatePhone, formatPhone,
  validateSIRET, formatSIRET
} from '../utils/validators';

type ProfileType = 'particular' | 'professional' | null;

interface ParticularForm {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
}

interface ProfessionalForm extends ParticularForm {
  companyName: string;
  siret: string;
  subRole: string;
}

const SUB_ROLES = [
  'Agent immobilier', 'Notaire', 'Promoteur immobilier',
  'Architecte', 'Diagnostiqueur', 'Géomètre',
  'Courtier en crédit', 'Administrateur de biens',
  'Chasseur immobilier', 'Autre'
];

export function CompleteProfile() {
  const navigate = useNavigate();
  const [profileType, setProfileType] = useState<ProfileType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ProfessionalForm>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      city: '',
      companyName: '',
      siret: '',
      subRole: ''
    }
  });

  const onSubmit = async (formData: ProfessionalForm) => {
    setIsLoading(true);
    setGlobalError('');

    try {
      const { data: { user }, error: userError } = 
        await supabase.auth.getUser();

      if (userError || !user) {
        setGlobalError('Session expirée. Veuillez vous reconnecter.');
        navigate('/');
        return;
      }

      const isPro = profileType === 'professional';

      const profileData = {
        email: user.email,
        displayName: isPro && formData.companyName
          ? formData.companyName
          : `${formData.firstName} ${formData.lastName}`,
        role: profileType,
        phoneNumber: formData.phone,
        city: formData.city,
        isPro,
        professionalData: isPro ? {
          companyName: formData.companyName,
          siret: formData.siret.replace(/\s/g, ''),
          subRole: formData.subRole,
          isValidated: false
        } : null,
        createdAt: new Date().toISOString()
      };

      // Upsert dans public.users
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({ id: user.id, ...profileData });

      if (upsertError) {
        console.error('Erreur upsert:', upsertError);
        setGlobalError('Erreur lors de la sauvegarde. Veuillez réessayer.');
        return;
      }

      // Redirection selon le type
      navigate('/dashboard', { replace: true });

    } catch (err) {
      console.error('Erreur inattendue:', err);
      setGlobalError('Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  // Étape 1 : Choix du type de profil
  if (!profileType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
          <h1 className="text-app-xl font-bold text-gray-800 text-center mb-2">
            Bienvenue sur Wallnut 🏡
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Pour finaliser votre inscription, dites-nous qui vous êtes :
          </p>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setProfileType('particular')}
              className="p-6 border-2 border-gray-200 rounded-xl 
                         hover:border-blue-500 hover:bg-blue-50 
                         transition-all text-left group"
            >
              <div className="text-app-2xl mb-2">👤</div>
              <h3 className="font-bold text-gray-800 group-hover:text-blue-700">
                Particulier
              </h3>
              <p className="text-app-sm text-gray-500 mt-1">
                Je cherche ou vends un bien immobilier
              </p>
            </button>
            <button
              onClick={() => setProfileType('professional')}
              className="p-6 border-2 border-gray-200 rounded-xl 
                         hover:border-green-500 hover:bg-green-50 
                         transition-all text-left group"
            >
              <div className="text-app-2xl mb-2">🏢</div>
              <h3 className="font-bold text-gray-800 group-hover:text-green-700">
                Professionnel
              </h3>
              <p className="text-app-sm text-gray-500 mt-1">
                Je suis un professionnel de l'immobilier
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Étape 2 : Formulaire de complétion
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <button
          onClick={() => setProfileType(null)}
          className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-app-sm"
        >
          ← Retour
        </button>
        <h2 className="text-app-xl font-bold text-gray-800 mb-6">
          {profileType === 'professional'
            ? '🏢 Profil Professionnel'
            : '👤 Profil Particulier'}
        </h2>

        {globalError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-app-sm">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Prénom */}
          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block ml-1">
              Prénom *
            </label>
            <input
              {...register('firstName', {
                validate: validateName,
                onChange: (e) => {
                  e.target.value = formatName(e.target.value);
                }
              })}
              placeholder="Jean"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 
                focus:ring-blue-500 outline-none transition
                ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-app-xs mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block ml-1">
              Nom *
            </label>
            <input
              {...register('lastName', {
                validate: validateName,
                onChange: (e) => {
                  e.target.value = formatName(e.target.value);
                }
              })}
              placeholder="Dupont"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 
                focus:ring-blue-500 outline-none transition
                ${errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-app-xs mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block ml-1">
              Téléphone *
            </label>
            <input
              {...register('phone', {
                validate: (v) => validatePhone(v, profileType === 'professional'),
                onChange: (e) => {
                  e.target.value = formatPhone(e.target.value);
                }
              })}
              placeholder={profileType === 'professional' ? '01 23 45 67 89' : '06 12 34 56 78'}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 
                focus:ring-blue-500 outline-none transition
                ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-app-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Ville */}
          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block ml-1">
              Ville *
            </label>
            <input
              {...register('city', {
                required: 'La ville est requise',
                minLength: { value: 2, message: 'Ville trop courte' }
              })}
              placeholder="Paris"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 
                focus:ring-blue-500 outline-none transition
                ${errors.city ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.city && (
              <p className="text-red-500 text-app-xs mt-1">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* Champs professionnels uniquement */}
          {profileType === 'professional' && (
            <>
              {/* Nom de société */}
              <div>
                <label className="text-[13px] font-medium text-gray-700 mb-1 block ml-1">
                  Nom de la société *
                </label>
                <input
                  {...register('companyName', {
                    required: 'Le nom de la société est requis',
                    minLength: { value: 2, message: 'Minimum 2 caractères' }
                  })}
                  placeholder="Mon Agence Immobilière"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 
                    focus:ring-blue-500 outline-none transition
                    ${errors.companyName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-app-xs mt-1">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              {/* SIRET */}
              <div>
                <label className="text-[13px] font-medium text-gray-700 mb-1 block ml-1">
                  Numéro SIRET *
                </label>
                <input
                  {...register('siret', {
                    validate: validateSIRET,
                    onChange: (e) => {
                      const formatted = formatSIRET(e.target.value);
                      e.target.value = formatted;
                      setValue('siret', formatted, { shouldValidate: true });
                    }
                  })}
                  placeholder="732 829 320 00074"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 
                    focus:ring-blue-500 outline-none transition font-mono
                    ${errors.siret ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.siret && (
                  <p className="text-red-500 text-app-xs mt-1">
                    {errors.siret.message}
                  </p>
                )}
                <p className="text-gray-400 text-app-xs mt-1">14 chiffres</p>
              </div>

              {/* Métier */}
              <div>
                <label className="text-[13px] font-medium text-gray-700 mb-1 block ml-1">
                  Votre métier *
                </label>
                <select
                  {...register('subRole', {
                    required: 'Veuillez sélectionner votre métier'
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 
                    focus:ring-blue-500 outline-none transition bg-white
                    ${errors.subRole ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                >
                  <option value="">Sélectionnez votre métier</option>
                  {SUB_ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors.subRole && (
                  <p className="text-red-500 text-app-xs mt-1">
                    {errors.subRole.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl 
                       font-semibold hover:bg-blue-700 transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 
                                 border-b-2 border-white" />
                Enregistrement...
              </span>
            ) : (
              'Finaliser mon inscription'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

