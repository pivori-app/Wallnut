import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-light dark:bg-[#121826]">
        <div className="w-12 h-12 border-4 border-primary border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If authenticated but no profile, force registration completion
  if (!profile && !window.location.pathname.startsWith('/register')) {
    return <Navigate to="/register" replace />;
  }

  // Enforce Email Verification for access
  if (user && !user.email_confirmed_at && !window.location.pathname.startsWith('/register')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-3xl rounded-full" />
        
        <div className="glass p-10 py-12 rounded-[2.5rem] border border-white/40 shadow-2xl relative max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
             </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-primary mb-4">Veuillez valider votre compte</h2>
          <p className="text-neutral-dark/80 mb-6 font-medium leading-relaxed">
            Un email de confirmation a été envoyé à l'adresse <br/><span className="font-bold text-primary">{user.email}</span>
          </p>
          <div className="bg-amber-50 rounded-2xl p-4 mb-8 border border-amber-100">
            <p className="text-sm font-bold text-amber-800">Consultez votre boîte mail</p>
            <p className="text-xs text-amber-700/80 mt-1">Cliquez sur le lien de validation pour débloquer votre accès au tableau de bord.</p>
          </div>
          <button 
             onClick={() => { window.location.reload(); }}
             className="w-full py-4 rounded-2xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            J'ai validé mon email, rafraîchir
          </button>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
