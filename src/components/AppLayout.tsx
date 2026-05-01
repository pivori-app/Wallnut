import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  Bell, 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut, 
  HelpCircle, 
  Sun, 
  Moon, 
  BarChart3,
  Users,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatRole } from '../lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  subRole?: string;
  isExternal?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Mes Dossiers', href: '/dossiers', icon: FileText },
  { label: 'Mes Leads', href: '/leads', icon: Users, roles: ['professionnel', 'institution'] },
  { label: 'Outils Marketing', href: '/presentation-agents.html', icon: FileText, roles: ['professionnel'], subRole: 'agent_immobilier', isExternal: true },
  { label: 'Mes Annonces', href: '/ads', icon: Globe, roles: ['professionnel', 'institution'] },
  { label: 'Institutionnel', href: '/institutional', icon: BarChart3, roles: ['institution', 'gestionnaire'] },
  { label: 'Calendrier', href: '/calendar', icon: Calendar },
  { label: 'Messagerie', href: '/messages', icon: MessageSquare },
  { label: 'Paramètres', href: '/settings', icon: Settings },
];

import { ChatAssistant } from './ChatAssistant';
import { Logo } from './Logo';
import { Footer } from './Footer';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-200", isDarkMode ? "dark bg-[#121826] text-white" : "bg-neutral-light text-neutral-dark")}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 h-16 glass flex items-center justify-between px-4 lg:px-8 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:block p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white dark:border-[#121826]"></span>
          </button>
          
          <div className="h-8 w-px bg-black/10 dark:bg-white/10 hidden sm:block mx-2"></div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium leading-none">{profile?.displayName}</p>
              <p className="text-xs text-primary/60 dark:text-white/60 mt-1 capitalize">
                {profile?.isPro ? formatRole(profile.professionalData?.subRole || '') : profile?.role}
              </p>
            </div>
            <button className="w-10 h-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
              <User className="w-6 h-6" />
            </button>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar Desktop */}
        <aside 
          className={cn(
            "hidden lg:flex flex-col bg-white dark:bg-[#1a2234] border-r border-black/5 dark:border-white/5 transition-all duration-300",
            isSidebarOpen ? "w-64" : "w-20"
          )}
        >
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {NAV_ITEMS.filter(item => {
              if (item.roles && (!profile || !item.roles.includes(profile.role))) return false;
              if (item.subRole && profile?.professionalData?.subRole !== item.subRole) return false;
              return true;
            }).map((item) => {
              const LinkComponent = item.isExternal ? 'a' : Link;
              const linkProps = item.isExternal 
                ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                : { to: item.href };

              return (
              <LinkComponent
                key={item.href}
                {...linkProps as any}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all group relative",
                  "hover:bg-primary/5 dark:hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", "text-black/60 dark:text-white/60 group-hover:text-primary dark:group-hover:text-secondary")} />
                {isSidebarOpen ? (
                  <span className="font-medium">{item.label}</span>
                ) : (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </LinkComponent>
            )})}
          </nav>
          
          <div className="p-4 border-t border-black/5 dark:border-white/5">
            <button 
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-danger/10 text-danger transition-all",
                !isSidebarOpen && "justify-center"
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="font-medium">Déconnexion</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-light/50 dark:bg-[#121826] flex flex-col @container">
          <div className="flex-1 p-4 lg:p-8">
            <div className="max-w-[70rem] mx-auto w-full">
              {children}
            </div>
          </div>
          <Footer />
        </main>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-[#1a2234] lg:hidden flex flex-col p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">
                  <Logo />
                </div>
                <div className="text-right mr-4">
                  <p className="text-xs font-bold text-primary">{profile?.displayName}</p>
                  <p className="text-[10px] opacity-60 uppercase">{profile?.isPro ? formatRole(profile.professionalData?.subRole || '') : profile?.role}</p>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {NAV_ITEMS.filter(item => {
                  if (item.roles && (!profile || !item.roles.includes(profile.role))) return false;
                  if (item.subRole && profile?.professionalData?.subRole !== item.subRole) return false;
                  return true;
                }).map((item) => {
                  const LinkComponent = item.isExternal ? 'a' : Link;
                  const linkProps = item.isExternal 
                    ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                    : { to: item.href };

                  return (
                  <LinkComponent
                    key={item.href}
                    {...linkProps as any}
                    onClick={item.isExternal ? undefined : () => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-white transition-all group"
                  >
                    <item.icon className="w-6 h-6 text-primary dark:text-secondary group-hover:text-white" />
                    <span className="text-lg font-bold">{item.label}</span>
                  </LinkComponent>
                )})}
              </nav>

              <div className="pt-6 border-t border-black/5 dark:border-white/5">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-danger/10 text-danger font-bold"
                >
                  <LogOut className="w-6 h-6" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Help Chat Assistant */}
      <ChatAssistant />
    </div>
  );
}
