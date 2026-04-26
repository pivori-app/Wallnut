import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, Linkedin, Instagram, Twitter } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Navigation",
      links: [
        { label: "Notre Solution", href: "/solution" },
        { label: "Nos Offres", href: "/offres" },
        { label: "Simulateur", href: "/#simulateur" },
        { label: "Blog", href: "/blog" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Centre d'aide", href: "/help" },
      ]
    },
    {
      title: "Légal",
      links: [
        { label: "Mentions légales", href: "/mentions-legales" },
        { label: "RGPD", href: "/rgpd" },
        { label: "CGU / CGV", href: "/cgu" },
        { label: "Cookies", href: "/cookies" },
      ]
    }
  ];

  return (
    <footer className="mt-20 border-t border-black/5 dark:border-white/5 pt-16 pb-8 bg-black/2 dark:bg-white/2">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Logo />
            <p className="text-sm opacity-60 leading-relaxed max-w-sm">
              Wallnut redéfinit la liquidité immobilière par le portage structuré. 
              Une approche institutionnelle accessible à tous les propriétaires.
            </p>
            <div className="flex gap-4">
              <button className="p-2 bg-primary/5 hover:bg-primary/10 rounded-full transition-colors">
                <Linkedin className="w-5 h-5 text-primary" />
              </button>
              <button className="p-2 bg-primary/5 hover:bg-primary/10 rounded-full transition-colors">
                <Instagram className="w-5 h-5 text-primary" />
              </button>
              <button className="p-2 bg-primary/5 hover:bg-primary/10 rounded-full transition-colors">
                <Twitter className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-display font-bold text-sm uppercase tracking-wider opacity-40">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm hover:text-primary transition-colors opacity-70 hover:opacity-100">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium opacity-50">
          <div className="flex items-center gap-4">
             <p>© {currentYear} Wallnut Technologies SAS. Tous droits réservés.</p>
             <div className="h-4 w-px bg-black/20 dark:bg-white/20"></div>
             <p className="flex items-center gap-1"><Globe className="w-3 h-3" /> Paris, France</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Données sécurisées AES-256</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
