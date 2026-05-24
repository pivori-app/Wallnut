/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // ═══════════════════════════════════════════════════════
    // BREAKPOINTS RESPONSIVE UNIFIÉS
    // ═══════════════════════════════════════════════════════
    screens: {
      'xs': '375px',   // Mobile petit
      'sm': '640px',   // Mobile large
      'md': '768px',   // Tablette
      'lg': '1024px',  // Desktop petit
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Grand écran
    },

    extend: {
      // ═════════════════════════════════════════════════════
      // SYSTÈME TYPOGRAPHIQUE STRICT ET HIÉRARCHISÉ
      // WCAG & Enterprise-grade scaling
      // ═════════════════════════════════════════════════════
      fontSize: {
        // Micro (badges, labels, footnotes)
        'app-xs':   ['11px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500' }],
        // Small (captions, helper text, metrics labels)
        'app-sm':   ['13px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '400' }],
        // Base (texte courant, formulaires, data grids)
        'app-base': ['15px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '400' }],
        // Medium (sous-titres, composants interactifs)
        'app-md':   ['17px', { lineHeight: '26px', letterSpacing: '-0.01em', fontWeight: '500' }],
        // Large (titres de section, cards headers)
        'app-lg':   ['20px', { lineHeight: '30px', letterSpacing: '-0.02em', fontWeight: '600' }],
        // XL (titres de page)
        'app-xl':   ['24px', { lineHeight: '32px', letterSpacing: '-0.02em', fontWeight: '700' }],
        // 2XL (héros, KPI metrics)
        'app-2xl':  ['32px', { lineHeight: '40px', letterSpacing: '-0.03em', fontWeight: '700' }],
        // 3XL (landing page, extreme emphasis)
        'app-3xl':  ['40px', { lineHeight: '48px', letterSpacing: '-0.03em', fontWeight: '800' }],
      },

      // ═════════════════════════════════════════════════════
      // FAMILLES DE POLICES (Synchronized with CSS constraints)
      // ═════════════════════════════════════════════════════
      fontFamily: {
        'display': ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        'body':    ['Inter', 'system-ui', 'sans-serif'],
        'mono':    ['"Fira Code"', 'Consolas', 'monospace'],
      },

      // ═════════════════════════════════════════════════════
      // COULEURS SÉMANTIQUES ET DARK MODE TOKENS
      // ═════════════════════════════════════════════════════
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#0A2B4E', // WCAG AAA on White
          light:   '#16417A',
          dark:    '#051833',
          50:      '#F4F7FB',
          100:     '#E2EAFC',
          500:     '#0A2B4E',
          600:     '#082444',
          700:     '#051833',
        },
        secondary: {
          DEFAULT: '#C79A2E', // Caution: Low contrast on white. Use on Dark/Primary.
          light:   '#E5B23B',
          dark:    '#94721C',
          50:      '#FDF9F0',
          500:     '#C79A2E',
        },
        
        // Semantic Tokens
        success: {
          DEFAULT: '#059669', // Changed for WCAG AA (4.5:1)
          light:   '#D1FAE5',
          dark:    '#065F46',
        },
        warning: {
          DEFAULT: '#D97706', // Changed for WCAG AA
          light:   '#FEF3C7',
          dark:    '#92400E',
        },
        danger: {
          DEFAULT: '#DC2626',
          light:   '#FEE2E2',
          dark:    '#991B1B',
        },
        info: {
          DEFAULT: '#2563EB',
          light:   '#DBEAFE',
          dark:    '#1E40AF',
        },

        // Surface / Dark Mode System
        surface: {
          light: '#FFFFFF',
          dark: '#0B0C10',        // Deepest bg
          card: '#FFFFFF',
          'card-dark': '#13151A', // Elevated dark
          hover: '#F3F4F6',
          'hover-dark': '#1F2937',
        },
        neutral: {
          // Retro-compatibility tokens
          dark:    '#1A1A2E',
          medium:  '#6B7280',
          light:   '#F3F4F6',
          border:  '#E5E7EB',
          // New tokens
          900: '#111827', // High contrast text light mode
          800: '#1F2937',
          700: '#374151',
          600: '#4B5563', // Medium text
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB', // Borders
          200: '#E5E7EB', // Dividers
          100: '#F3F4F6', // Off-white
          50:  '#F9FAFB', // Background
        },
      },

      // ═════════════════════════════════════════════════════
      // ESPACEMENTS RHYTHMIQUES (SPACING SCALE)
      // ═════════════════════════════════════════════════════
      spacing: {
        // Layout metrics
        'sidebar': '280px',
        'sidebar-sm': '240px',
        'header': '64px',
        'header-sm': '56px',
      },

      // ═════════════════════════════════════════════════════
      // BORDER RADIUS UNIFIÉS
      // ═════════════════════════════════════════════════════
      borderRadius: {
          // Retro-compatibility
        'app-sm':  '8px',
        'app-md':  '12px',
        'app-lg':  '16px',
        'app-xl':  '24px',
        'app-2xl': '32px',
        // New tokens
        'sm':  '6px',
        'md':  '10px',
        'lg':  '14px',
        'xl':  '20px',
        '2xl': '28px',
      },

      // ═════════════════════════════════════════════════════
      // OMBRES HIÉRARCHISÉES ET SÉCURISÉES
      // ═════════════════════════════════════════════════════
      boxShadow: {
        // Retro-compatibility
        'app-sm':  '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'app-md':  '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'app-lg':  '0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.04)',
        'app-xl':  '0 16px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)',
        'popup':   '0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)',
        // New tokens
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        // Dark mode specific shadows (glow instead of drop shadow to ensure visibility)
        'glow-primary': '0 0 15px rgba(10, 43, 78, 0.5)',
        'glow-secondary': '0 0 15px rgba(199, 154, 46, 0.4)',
      },
      
      // ═════════════════════════════════════════════════════
      // OPACITY POUR GLASSMORPHISM CONTRÔLÉ
      // ═════════════════════════════════════════════════════
      opacity: {
        'glass': '0.85', // Safe minimum for readability
        'glass-dark': '0.75', // Safe minimum for dark
      }
    },
  },
  plugins: [],
};
