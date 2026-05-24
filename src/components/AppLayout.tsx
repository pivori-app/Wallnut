/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { checkSupabaseConnection } from '../lib/supabase';
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Building2,
  Megaphone,
  TrendingUp,
  HelpCircle,
  ChevronRight,
  Database,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';

const SupabaseConnectionBadge = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setStatus('testing');
    const result = await checkSupabaseConnection();
    if (result.success) {
      setStatus('success');
      setMessage(result.message);
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setMessage(result.message);
    }
  };

  return (
    <div className="relative group flex flex-col items-end">
      <button 
        onClick={testConnection}
        disabled={status === 'testing'}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${
          status === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
          status === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
          'bg-slate-50 text-slate-600 dark:text-white/70 border-slate-200 hover:bg-slate-100'
        }`}
      >
        {status === 'testing' ? <Loader2 size={12} className="animate-spin" /> : 
         status === 'success' ? <CheckCircle2 size={12} /> :
         status === 'error' ? <AlertTriangle size={12} /> :
         <Database size={12} />}
        <span>Supabase</span>
      </button>
      {status === 'error' && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100 shadow-lg z-50">
          <p className="font-bold mb-1">Erreur de connexion</p>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  proOnly?: boolean;
  adminOnly?: boolean;
  children?: { label: string; path: string }[];
}

// ─────────────────────────────────────────────────────────
// NAVIGATION CONFIG
// ─────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    label: 'Tableau de bord',
    path: '/dashboard',
    icon: <LayoutDashboard size={17} />,
  },
  {
    label: 'Mes Dossiers',
    path: '/dossiers',
    icon: <FolderOpen size={17} />,
  },
  {
    label: 'Mes Annonces',
    path: '/ads',
    icon: <Megaphone size={17} />,
    proOnly: true,
  },
  {
    label: 'Leads',
    path: '/leads',
    icon: <TrendingUp size={17} />,
    proOnly: true,
  },
  {
    label: 'Calendrier',
    path: '/calendar',
    icon: <Calendar size={17} />,
  },
  {
    label: 'Messages',
    path: '/messages',
    icon: <MessageSquare size={17} />,
    badge: 3,
  },
  {
    label: 'Institutionnel',
    path: '/institutional',
    icon: <Building2 size={17} />,
    adminOnly: true,
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  {
    label: 'Centre d\'aide',
    path: '/help',
    icon: <HelpCircle size={17} />,
  },
  {
    label: 'Paramètres',
    path: '/settings',
    icon: <Settings size={17} />,
  },
];

// Map des titres de page par route
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/dashboard/particulier': 'Mon Espace',
  '/dashboard/pro': 'Espace Professionnel',
  '/institutional': 'Dashboard Institutionnel',
  '/dossiers': 'Mes Dossiers',
  '/dossiers/new': 'Nouveau Dossier',
  '/ads': 'Mes Annonces',
  '/leads': 'Gestion des Leads',
  '/calendar': 'Calendrier',
  '/messages': 'Messages',
  '/settings': 'Paramètres',
  '/help': "Centre d'aide",
};

// ─────────────────────────────────────────────────────────
// HOOK : click outside
// ─────────────────────────────────────────────────────────
function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// ─────────────────────────────────────────────────────────
// SOUS-COMPOSANT : Item de navigation
// ─────────────────────────────────────────────────────────
const NavItemLink = ({
  item,
  targetPath,
  active,
}: {
  item: NavItem;
  targetPath: string;
  active: boolean;
}) => (
  <Link
    to={targetPath}
    className={`
      flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl
      text-[13.5px] font-medium transition-all duration-150
      \${
        active
          ? 'bg-primary/8 text-primary font-semibold'
          : 'text-slate-500 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:text-white/90'
      }
    `}
  >
    <span
      className={`flex-shrink-0 transition-colors
        \${active ? 'text-primary' : 'text-slate-400'}`}
    >
      {item.icon}
    </span>
    <span className="flex-1 leading-none">{item.label}</span>
    {item.badge != null && item.badge > 0 && (
      <span
        className="flex-shrink-0 min-w-[20px] h-5 px-1.5
                   flex items-center justify-center
                   bg-primary text-white rounded-full
                   text-[11px] font-bold leading-none"
      >
        {item.badge > 99 ? '99+' : item.badge}
      </span>
    )}
  </Link>
);

// ─────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────
export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fermer dropdown user si clic dehors
  useClickOutside(userMenuRef, () => setUserMenuOpen(false));

  // Rôles
  const isProPath = location.pathname.includes('/dashboard/pro') || location.pathname.includes('/leads') || location.pathname.includes('/ads');
  
  const isPro =
    profile?.isPro ||
    profile?.role === 'professionnel' || 
    isProPath;
    
  const isAdmin =
    profile?.role === 'institution' ||
    profile?.role === 'gestionnaire';

  // Dashboard path selon rôle
  const dashboardPath = isAdmin
    ? '/institutional'
    : isPro
    ? '/dashboard/pro'
    : '/dashboard/particulier';

  // Titre de page courant
  const pageTitle =
    PAGE_TITLES[location.pathname] ||
    NAV_ITEMS.find((i) => location.pathname.startsWith(i.path) && i.path !== '/dashboard')
      ?.label ||
    BOTTOM_ITEMS.find((i) => location.pathname.startsWith(i.path))?.label ||
    'Wallnut';

  // Fermer sidebar sur changement de route
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Fermer dropdown sur changement de route
  useEffect(() => {
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = useCallback(async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/');
  }, [logout, navigate]);

  const isActive = useCallback(
    (path: string) => {
      if (path === '/dashboard') {
        return (
          location.pathname === '/dashboard' ||
          location.pathname === '/dashboard/particulier' ||
          location.pathname === '/dashboard/pro'
        );
      }
      return location.pathname === path ||
             location.pathname.startsWith(path + '/');
    },
    [location.pathname]
  );

  // Items filtrés selon rôle
  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.proOnly && !isPro && !isAdmin) return false;
    return true;
  });

  // Avatar initiale
  const avatarLetter =
    profile?.displayName?.[0]?.toUpperCase() ||
    profile?.email?.[0]?.toUpperCase() ||
    'U';

  // Badge rôle
  const roleBadge = isPro
    ? { label: 'Pro', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    : isAdmin
    ? { label: 'Institution', cls: 'bg-primary/8 text-primary border-primary/20' }
    : { label: 'Particulier', cls: 'bg-slate-100 text-slate-500 dark:text-white/60 border-slate-200' };

  // ─────────────────────────────────────────────────────
  // SIDEBAR CONTENT
  // ─────────────────────────────────────────────────────
  const SidebarContent = () => (
    <>
      {/* ── Logo ── */}
      <div className="flex items-center justify-between 
                      px-5 py-3 border-b border-slate-100 flex-shrink-0">
        <Link
          to={dashboardPath}
          className="flex items-center justify-center group w-full py-1"
          onClick={() => setSidebarOpen(false)}
        >
          <img 
            src="/logo-wallnut-2026.png" 
            alt="Wallnut Logo" 
            className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </Link>

        {/* Bouton fermeture mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="w-8 h-8 flex items-center justify-center 
                     rounded-lg text-slate-400 hover:text-slate-600 dark:text-white/70 
                     hover:bg-slate-100 transition-colors"
          aria-label="Fermer le menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Profil utilisateur ── */}
      <div className="px-3 py-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 
                        rounded-xl bg-slate-50 border border-slate-100">
          {/* Avatar */}
          <div className={`
            w-9 h-9 rounded-full flex items-center justify-center 
            flex-shrink-0 font-bold text-[15px] shadow-sm
            \${isPro
              ? 'bg-emerald-100 text-emerald-700'
              : isAdmin
              ? 'bg-primary/10 text-primary'
              : 'bg-slate-200 text-slate-600 dark:text-white/70'
            }
          `}>
            {avatarLetter}
          </div>

          {/* Infos */}
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-slate-800 dark:text-white/90 
                          truncate leading-tight">
              {profile?.displayName || profile?.email || (isPro ? 'Mon compte Pro' : 'Mon compte Particulier')}
            </p>
            <span className={`
              inline-flex items-center text-[10.5px] font-semibold 
              px-1.5 py-0.5 rounded-md border mt-1
              leading-none \${roleBadge.cls}
            `}>
              {roleBadge.label}
            </span>
          </div>

          {/* Lien settings */}
          <Link
            to="/settings"
            className="w-7 h-7 flex items-center justify-center 
                       rounded-lg text-slate-400 hover:text-slate-600 dark:text-white/70 
                       hover:bg-white transition-colors flex-shrink-0"
            title="Paramètres"
          >
            <Settings size={14} />
          </Link>
        </div>
      </div>

      {/* ── Navigation principale ── */}
      <nav className="flex-1 overflow-y-auto py-3 
                      scrollbar-thin scrollbar-thumb-slate-200">
        {/* Label section */}
        <p className="px-5 mb-1.5 text-[10px] font-bold 
                      uppercase tracking-[0.1em] text-slate-400">
          Navigation
        </p>

        <div className="space-y-0.5">
          {filteredNavItems.map((item) => (
            <NavItemLink
              key={item.path}
              item={item}
              targetPath={
                item.path === '/dashboard' ? dashboardPath : item.path
              }
              active={isActive(item.path)}
            />
          ))}
        </div>

        {/* Séparateur */}
        <div className="mx-5 my-3 border-t border-slate-100" />

        {/* Label section compte */}
        <p className="px-5 mb-1.5 text-[10px] font-bold 
                      uppercase tracking-[0.1em] text-slate-400">
          Compte
        </p>

        <div className="space-y-0.5">
          {BOTTOM_ITEMS.map((item) => (
            <NavItemLink
              key={item.path}
              item={item}
              targetPath={item.path}
              active={isActive(item.path)}
            />
          ))}
        </div>
      </nav>

      {/* ── Déconnexion ── */}
      <div className="px-3 py-3 border-t border-slate-100 flex-shrink-0">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 mx-0
                     rounded-xl text-[13.5px] font-medium
                     text-red-500 hover:bg-red-50 hover:text-red-600
                     transition-all duration-150"
        >
          <LogOut size={17} className="flex-shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-slate-50 dark:bg-[#0A0F1C] text-slate-900 dark:text-white">

      {/* ══════════════════════════════════════════════
          SIDEBAR MOBILE & DESKTOP (drawer)
          ══════════════════════════════════════════════ */}
      <>
        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Drawer */}
        <aside
          className={`
            fixed top-0 left-0 z-50 h-full w-[272px]
            bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl border-r border-slate-100 dark:border-white/5
            flex flex-col shadow-2xl
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          aria-label="Menu de navigation"
        >
          <SidebarContent />
        </aside>
      </>

      {/* ══════════════════════════════════════════════
          ZONE PRINCIPALE
          ══════════════════════════════════════════════ */}
      <div className={`
        flex flex-col flex-1 h-full min-w-0
        transition-all duration-300
        ml-0
      `}>

        {/* ── TOP HEADER ── */}
        <header className="
          sticky top-0 z-30 h-[60px] bg-white/95 dark:bg-[#0A0F1C]/80 backdrop-blur-xl
          border-b border-slate-100 
          flex items-center justify-between
          px-4 sm:px-6 gap-4
          shadow-sm shadow-slate-100/60
          flex-shrink-0
        ">
          {/* Gauche : Burger + Titre */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Burger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 flex items-center justify-center 
                         rounded-xl text-slate-500 dark:text-white/60 hover:text-slate-800 dark:text-white/90
                         hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Ouvrir le menu"
            >
              <Menu size={20} />
            </button>

            {/* Titre de page */}
            <div className="min-w-0">
              <h1 className="text-[16px] font-bold text-slate-800 dark:text-white/90 
                             leading-tight truncate">
                {pageTitle}
              </h1>
            </div>
          </div>

            <div className="flex items-center gap-2 flex-shrink-0">
             {/* Retrait de SupabaseConnectionBadge */}
             
             <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

            {/* Notifications */}
            <button
              className="relative w-9 h-9 flex items-center justify-center 
                         rounded-xl text-slate-500 dark:text-white/60 hover:text-slate-800 dark:text-white/90
                         hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={19} />
              {/* Badge notification */}
              <span className="absolute top-1.5 right-1.5 
                               w-2 h-2 bg-red-500 rounded-full 
                               ring-2 ring-white" />
            </button>

            {/* Séparateur */}
            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Menu utilisateur */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 
                           rounded-xl hover:bg-slate-100 
                           transition-colors"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                {/* Avatar */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center 
                  font-bold text-[13px] flex-shrink-0
                  \${isPro
                    ? 'bg-emerald-100 text-emerald-700'
                    : isAdmin
                    ? 'bg-primary/10 text-primary'
                    : 'bg-slate-200 text-slate-600 dark:text-white/70'
                  }
                `}>
                  {avatarLetter}
                </div>

                {/* Nom — tablette et + */}
                <div className="hidden sm:block text-left min-w-0">
                  <p className="text-[13px] font-semibold text-slate-800 dark:text-white/90 
                                leading-tight truncate max-w-[130px]">
                    {profile?.displayName?.split(' ')[0] || (isPro ? 'Mon compte Pro' : 'Mon compte Particulier')}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-white/60 leading-none mt-1 font-medium">
                    {roleBadge.label}
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className={`
                    text-slate-400 transition-transform duration-200
                    hidden sm:block flex-shrink-0
                    \${userMenuOpen ? 'rotate-180' : ''}
                  `}
                />
              </button>

              {/* ── Dropdown menu ── */}
              {userMenuOpen && (
                <div className="
                  absolute right-0 top-full mt-2 w-52
                  bg-white rounded-2xl 
                  shadow-xl shadow-slate-200/60
                  border border-slate-100
                  z-50 overflow-hidden
                  animate-in fade-in slide-in-from-top-2 duration-150
                ">
                  {/* Entête dropdown */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <p className="text-[13px] font-semibold text-slate-800 dark:text-white/90 truncate">
                      {profile?.displayName || (isPro ? 'Mon compte Pro' : 'Mon compte Particulier')}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {profile?.email || (isPro ? 'Espace Professionnel' : 'Espace Propriétaire')}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="py-1.5">
                    <Link
                      to={dashboardPath}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5
                                 text-[13px] text-slate-600 dark:text-white/70 font-medium
                                 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white dark:text-white
                                 transition-colors"
                    >
                      <LayoutDashboard size={14} className="text-slate-400" />
                      Mon tableau de bord
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5
                                 text-[13px] text-slate-600 dark:text-white/70 font-medium
                                 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white dark:text-white
                                 transition-colors"
                    >
                      <Settings size={14} className="text-slate-400" />
                      Paramètres
                    </Link>

                    <Link
                      to="/help"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5
                                 text-[13px] text-slate-600 dark:text-white/70 font-medium
                                 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white dark:text-white
                                 transition-colors"
                    >
                      <HelpCircle size={14} className="text-slate-400" />
                      Centre d'aide
                    </Link>
                  </div>

                  {/* Séparateur */}
                  <div className="border-t border-slate-100" />

                  {/* Déconnexion */}
                  <div className="py-1.5">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 px-4 py-2.5 w-full
                                 text-[13px] text-red-600 font-medium
                                 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── ZONE DE DÉFILEMENT (scroll area) ── */}
        <div className="flex-1 overflow-y-auto w-full 
                        scrollbar-thin scrollbar-thumb-slate-200 relative">
          {/* ── CONTENU PRINCIPAL ── */}
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 
                           lg:px-8 lg:py-8 max-w-[1400px] mx-auto w-full">
            {children}
          </main>

          {/* ── FOOTER ── */}
          <footer className="px-4 sm:px-6 lg:px-8 py-4 
                             border-t border-slate-100 bg-white
                             flex items-center justify-between gap-4
                             flex-shrink-0 relative z-10">
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} Wallnut — Tous droits réservés
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/mentions-legales"
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:text-white/70 
                           transition-colors"
              >
                Mentions légales
              </Link>
              <span className="text-slate-200">·</span>
              <Link
                to="/rgpd"
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:text-white/70 
                           transition-colors"
              >
                RGPD
              </Link>
              <span className="text-slate-200">·</span>
              <Link
                to="/cgu"
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:text-white/70 
                           transition-colors"
              >
                CGU
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

