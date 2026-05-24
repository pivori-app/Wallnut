import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  // ⚠️ BYPASS AUTHENTICATION TEMPORAIRE ⚠️
  // Permet d'accéder directement aux dashboards sans connexion
  return <>{children}</>;
}
