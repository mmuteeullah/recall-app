/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // OLED True Black
        oled: {
          black: '#000000',
          'near-black': '#0A0A0A',
          card: '#121212',
          elevated: '#1A1A1A',
        },
        // Premium Cyan Brand
        brand: {
          50: '#E0F7FF',
          100: '#B3EAFF',
          200: '#80DDFF',
          300: '#4DD0FF',
          400: '#26C6FF',   // Primary
          500: '#00BFFF',   // Main
          600: '#00A8E6',
          700: '#008FCC',
          800: '#0077B3',
          900: '#005580',
        },
        // Electric Purple Accent
        accent: {
          50: '#F3E5FF',
          100: '#E0BFFF',
          200: '#CC95FF',
          300: '#B86BFF',
          400: '#A647FF',   // Primary
          500: '#9333EA',   // Main
          600: '#7E22CE',
          700: '#6B21A8',
          800: '#581C87',
          900: '#3B0764',
        },
        // Vibrant Green Success
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',   // Primary
          500: '#10B981',   // Main
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Energetic Orange Warning
        warning: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',   // Primary
          500: '#F97316',   // Main
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // Bold Red Error
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',   // Primary
          500: '#EF4444',   // Main
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Muted Neutrals (OLED-friendly)
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',   // Body text on OLED
          200: '#E5E5E5',   // Secondary text
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      backgroundImage: {
        // Premium gradients
        'gradient-cyber': 'linear-gradient(135deg, #00BFFF 0%, #9333EA 100%)',
        'gradient-neon': 'linear-gradient(135deg, #26C6FF 0%, #A647FF 100%)',
        'gradient-electric': 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
        'gradient-sunrise': 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
        'gradient-forest': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
        'gradient-cosmic': 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
        // NeoPOP-inspired
        'gradient-pop': 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 50%, #FFFF00 100%)',
        'gradient-retro': 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)',
        // Legacy (keeping for compatibility)
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-brand': 'linear-gradient(135deg, #00BFFF 0%, #9333EA 100%)', // Updated to cyber
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
      },
      boxShadow: {
        // Standard colored shadows
        'brand': '0 10px 40px -10px rgba(0, 191, 255, 0.4)',
        'accent': '0 10px 40px -10px rgba(147, 51, 234, 0.4)',
        'success': '0 10px 40px -10px rgba(16, 185, 129, 0.3)',
        'error': '0 10px 40px -10px rgba(239, 68, 68, 0.3)',
        // Elevation system
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'elevation-2': '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
        'elevation-3': '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
        'elevation-4': '0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
        'elevation-5': '0 20px 40px rgba(0, 0, 0, 0.2)',
        // OLED glows (for dark mode)
        'glow-brand': '0 0 20px rgba(0, 191, 255, 0.3), 0 0 40px rgba(0, 191, 255, 0.1)',
        'glow-accent': '0 0 20px rgba(147, 51, 234, 0.3), 0 0 40px rgba(147, 51, 234, 0.1)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)',
        'glow-warning': '0 0 20px rgba(249, 115, 22, 0.3), 0 0 40px rgba(249, 115, 22, 0.1)',
        'glow-error': '0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1)',
        // NeoPOP layered shadows
        'neopop-flat': '4px 4px 0px rgba(0, 0, 0, 0.25)',
        'neopop-layered': '6px 6px 0px rgba(0, 0, 0, 0.2), 12px 12px 0px rgba(0, 0, 0, 0.1)',
        'neopop-brand': '6px 6px 0px rgba(0, 191, 255, 0.4)',
        'neopop-accent': '6px 6px 0px rgba(147, 51, 234, 0.4)',
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Cascadia Code"', '"SF Mono"', 'Monaco', 'Consolas', 'monospace'],
      },
      fontWeight: {
        extrabold: '800',
        black: '900',
      },
      letterSpacing: {
        tighter: '-0.05em',
        widest: '0.1em',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      // Custom utilities for NeoPOP borders
      borderWidth: {
        '3': '3px',
        '6': '6px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
