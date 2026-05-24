// ═══════════════════════════════════════════════════════════
// src/pages/AuthCallback.tsx
// Gestion du retour OAuth Google
// ═══════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Récupérer la session après redirection OAuth
        const { data: { session }, error: sessionError } = 
          await supabase.auth.getSession();

        if (sessionError || !session) {
          console.error('Erreur session:', sessionError);
          setErrorMessage('Erreur de connexion. Veuillez réessayer.');
          setStatus('error');
          return;
        }

        const user = session.user;

        // Vérifier si le profil existe dans public.users
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('id, role, isPro')
          .eq('id', user.id)
          .single();

        // PGRST116 = ligne non trouvée (profil inexistant)
        if (profileError && profileError.code === 'PGRST116') {
          // Nouvel utilisateur Google → complétion de profil
          navigate('/complete-profile', { replace: true });
          return;
        }

        if (profileError) {
          console.error('Erreur profil:', profileError);
          setErrorMessage('Erreur lors de la récupération du profil.');
          setStatus('error');
          return;
        }

        // Profil existant → redirection selon le rôle
        if (profile?.isPro) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }

      } catch (err) {
        console.error('Erreur inattendue AuthCallback:', err);
        setErrorMessage('Une erreur inattendue est survenue.');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-app-lg font-bold text-gray-800 mb-2">
            Erreur de connexion
          </h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg 
                       hover:bg-blue-700 transition-colors font-medium"
          >
            Retour à la page d'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">
          Connexion en cours...
        </p>
      </div>
    </div>
  );
}
