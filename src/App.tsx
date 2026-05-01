/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Dossiers } from './pages/Dossiers';
import { InstitutionalDashboard } from './pages/InstitutionalDashboard';
import { NewDossier } from './pages/NewDossier';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RegisterSelection } from './pages/RegisterSelection';
import { RegisterForm } from './pages/RegisterForm';
import { Solution } from './pages/Solution';
import { Offres } from './pages/Offres';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { HelpCenter } from './pages/HelpCenter';

import { MentionsLegales, RGPD, CGU, Cookies } from './pages/Legal';
import { ScrollToTop } from './components/ScrollToTop';

import { ParticulierDashboard } from './pages/dashboard/ParticulierDashboard';
import { ProDashboard } from './pages/dashboard/ProDashboard';

import { Settings } from './pages/dashboard/Settings';
import { Calendar } from './pages/dashboard/Calendar';
import { Messages } from './pages/dashboard/Messages';

import { Building2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Placeholder Pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center">
      <Building2 className="w-10 h-10 text-primary opacity-20" />
    </div>
    <h2 className="text-2xl font-display font-bold">{title}</h2>
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

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Home />} />
          <Route path="/solution" element={<Solution />} />
          <Route path="/offres" element={<Offres />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/rgpd" element={<RGPD />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/register" element={<RegisterSelection />} />
          <Route path="/register/:type" element={<RegisterForm />} />

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
      </AuthProvider>
    </Router>
  );
}

