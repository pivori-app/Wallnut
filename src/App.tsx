/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';
import { Building2, Settings as SettingsIcon } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy loaded pages for Performance Optimization (Code Splitting)
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Dossiers = lazy(() => import('./pages/Dossiers').then(m => ({ default: m.Dossiers })));
const InstitutionalDashboard = lazy(() => import('./pages/InstitutionalDashboard').then(m => ({ default: m.InstitutionalDashboard })));
const NewDossier = lazy(() => import('./pages/NewDossier').then(m => ({ default: m.NewDossier })));
const RegisterSelection = lazy(() => import('./pages/RegisterSelection').then(m => ({ default: m.RegisterSelection })));
const RegisterForm = lazy(() => import('./pages/RegisterForm').then(m => ({ default: m.RegisterForm })));
const AuthCallback = lazy(() => import('./pages/AuthCallback').then(m => ({ default: m.AuthCallback })));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile').then(m => ({ default: m.CompleteProfile })));
const Solution = lazy(() => import('./pages/Solution').then(m => ({ default: m.Solution })));
const Offres = lazy(() => import('./pages/Offres').then(m => ({ default: m.Offres })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogPost = lazy(() => import('./pages/BlogPost').then(m => ({ default: m.BlogPost })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const HelpCenter = lazy(() => import('./pages/HelpCenter').then(m => ({ default: m.HelpCenter })));
const MobileScannerPage = lazy(() => import('./pages/MobileScannerPage').then(m => ({ default: m.MobileScannerPage })));
const MentionsLegales = lazy(() => import('./pages/Legal').then(m => ({ default: m.MentionsLegales })));
const RGPD = lazy(() => import('./pages/Legal').then(m => ({ default: m.RGPD })));
const CGU = lazy(() => import('./pages/Legal').then(m => ({ default: m.CGU })));
const Cookies = lazy(() => import('./pages/Legal').then(m => ({ default: m.Cookies })));
const MentionsImportantes = lazy(() => import('./pages/MentionsImportantes').then(m => ({ default: m.MentionsImportantes })));
const DocScanPage = lazy(() => import('./pages/DocScanPage').then(m => ({ default: m.DocScanPage })));
const HowItWorks = lazy(() => import('./pages/HowItWorks').then(m => ({ default: m.HowItWorks })));
const Situations = lazy(() => import('./pages/Situations').then(m => ({ default: m.Situations })));
const Partenaires = lazy(() => import('./pages/Partenaires').then(m => ({ default: m.Partenaires })));
const Investisseurs = lazy(() => import('./pages/Investisseurs').then(m => ({ default: m.Investisseurs })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const ParticulierDashboard = lazy(() => import('./pages/dashboard/ParticulierDashboard').then(m => ({ default: m.ParticulierDashboard })));
const ProDashboard = lazy(() => import('./pages/dashboard/ProDashboard').then(m => ({ default: m.ProDashboard })));
const SecureAccess = lazy(() => import('./pages/SecureAccess').then(m => ({ default: m.SecureAccess })));
const Settings = lazy(() => import('./pages/dashboard/Settings').then(m => ({ default: m.Settings })));
const Calendar = lazy(() => import('./pages/dashboard/Calendar').then(m => ({ default: m.Calendar })));
const Messages = lazy(() => import('./pages/dashboard/Messages').then(m => ({ default: m.Messages })));

// Placeholder Pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center">
      <Building2 className="w-10 h-10 text-primary opacity-20" />
    </div>
    <h2 className="text-app-xl font-display font-bold">{title}</h2>
    <p className="text-neutral-dark/40 italic">Module en cours de déploiement V4.1</p>
  </div>
);

const DashboardRedirect = () => {
  const { profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (profile?.role === 'professionnel') return <Navigate to="/dashboard/pro" replace />;
  if (profile?.role === 'institution' || profile?.role === 'gestionnaire') return <Navigate to="/institutional" replace />;
  
  // Default to particulier if no recognized role
  return <Navigate to="/dashboard/particulier" replace />;
};

// import removed

const DevNav = () => (
  <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
    <div className="bg-slate-900/90 dark:bg-white/90 backdrop-blur text-white dark:text-slate-900 p-2 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 dark:border-slate-900/10">
      <SettingsIcon className="w-4 h-4 opacity-50" />
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Dev:</span>
      <a href="/dashboard/pro" className="text-xs font-semibold hover:opacity-70 px-2 py-1 bg-white/10 rounded">Pro</a>
      <a href="/dashboard/particulier" className="text-xs font-semibold hover:opacity-70 px-2 py-1 bg-white/10 rounded">Particulier</a>
      <a href="/" className="text-xs font-semibold hover:opacity-70 px-2 py-1 bg-white/10 rounded">Home</a>
    </div>
  </div>
);

export default function App() {
  // Fallback Loading Display for Suspense (Enterprise Grade)
  const LoadingFallback = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="relative flex items-center justify-center">
        {/* Glowing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 blur-sm animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        {/* Premium Spinner */}
        <div className="w-16 h-16 border-4 border-slate-200 dark:border-white/10 border-t-primary dark:border-t-primary rounded-full animate-spin relative z-10 shadow-lg"></div>
        {/* Core Dot */}
        <div className="absolute w-4 h-4 bg-primary rounded-full z-20 shadow-[0_0_15px_rgba(8,112,184,0.8)]"></div>
      </div>
      <p className="mt-8 text-neutral-800 dark:text-white font-display font-bold tracking-tight text-lg">Initialisation de votre environnement</p>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300 dark:text-neutral-500 dark:text-neutral-400 font-medium text-sm">Chiffrement AES-256 actif • Protection Wallnut</p>
    </div>
  );

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <AuthProvider>
        <DevNav />
        <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Home />} />
          <Route path="/solution" element={<Solution />} />
          <Route path="/comment-ca-marche" element={<HowItWorks />} />
          <Route path="/offres" element={<Offres />} />
          <Route path="/situations" element={<Situations />} />
          <Route path="/partenaires" element={<Partenaires />} />
          <Route path="/investisseurs" element={<Investisseurs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/mentions-importantes" element={<MentionsImportantes />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/rgpd" element={<RGPD />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/register" element={<RegisterSelection />} />
          <Route path="/register/:type" element={<RegisterForm />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/mobile-scanner" element={<MobileScannerPage />} />
          <Route path="/doc-scan" element={<DocScanPage />} />
          <Route path="/secure-access" element={<SecureAccess />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/particulier"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ParticulierDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pro"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/institutional"
            element={
              <ProtectedRoute requireAdmin>
                <AppLayout>
                  <InstitutionalDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PlaceholderPage title="Gestion de Leads" />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ads"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PlaceholderPage title="Mes Annonces" />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dossiers"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dossiers />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dossiers/new"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <NewDossier />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Calendar />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Messages />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

