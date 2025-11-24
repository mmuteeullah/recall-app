/**
 * RE-CA-LL Design System v2.0 - Premium OLED Edition
 * Inspired by CRED's NeoPOP, Behance/Dribbble 2025 trends
 *
 * Philosophy:
 * - "Visual design has to be bloody great" (CRED)
 * - Joy & delight = as important as functionality
 * - Bold, confident design choices
 * - NeoPOP aesthetic: layered depth, bold outlines, vibrant colors
 * - True OLED black (#000000) for premium high-end displays
 */

// ============================================================================
// COLORS - Premium Palette with OLED Support
// ============================================================================

export const colors = {
  // OLED True Black Mode (for power savings on OLED screens)
  oled: {
    black: '#000000',         // Pure black for OLED
    nearBlack: '#0A0A0A',     // Subtle variation
    card: '#121212',          // Elevated surfaces
    elevated: '#1A1A1A',      // Higher elevation
    border: 'rgba(255, 255, 255, 0.1)',  // Subtle borders
  },

  // Primary Brand - Vibrant Cyan (Premium, Tech-forward)
  brand: {
    50: '#E0F7FF',
    100: '#B3EAFF',
    200: '#80DDFF',
    300: '#4DD0FF',
    400: '#26C6FF',   // Primary brand color
    500: '#00BFFF',   // Main
    600: '#00A8E6',
    700: '#008FCC',
    800: '#0077B3',
    900: '#005580',
  },

  // Accent - Electric Purple (Bold, Eye-catching)
  accent: {
    50: '#F3E5FF',
    100: '#E0BFFF',
    200: '#CC95FF',
    300: '#B86BFF',
    400: '#A647FF',   // Primary accent
    500: '#9333EA',   // Main
    600: '#7E22CE',
    700: '#6B21A8',
    800: '#581C87',
    900: '#3B0764',
  },

  // Success - Vibrant Green (Positive, Growth)
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',   // Primary success
    500: '#10B981',   // Main
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Warning - Energetic Orange (Attention, Energy)
  warning: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',   // Primary warning
    500: '#F97316',   // Main
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Error - Bold Red (Critical, Urgent)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',   // Primary error
    500: '#EF4444',   // Main
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Neutral - Muted Whites for OLED (prevents halation effect)
  neutral: {
    50: '#FAFAFA',    // Lightest
    100: '#F5F5F5',   // Body text on OLED (NOT pure white)
    200: '#E5E5E5',   // Secondary text on OLED
    300: '#D4D4D4',   // Tertiary text
    400: '#A3A3A3',   // Placeholder
    500: '#737373',   // Disabled
    600: '#525252',   // Borders on OLED
    700: '#404040',   // Dark borders
    800: '#262626',   // Elevated dark
    900: '#171717',   // Near black (light mode dark)
  },
};

// ============================================================================
// GRADIENTS - Premium, Vibrant Combinations
// ============================================================================

export const gradients = {
  // Primary gradients (brand identity)
  cyber: 'linear-gradient(135deg, #00BFFF 0%, #9333EA 100%)',        // Cyan to Purple
  neon: 'linear-gradient(135deg, #26C6FF 0%, #A647FF 100%)',         // Lighter Cyber
  electric: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',     // Purple to Pink

  // Accent gradients
  sunrise: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',      // Orange to Red
  ocean: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',        // Sky to Cyan
  forest: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',       // Green shades

  // Special effects
  gold: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',         // Premium gold
  cosmic: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',       // Deep purple to indigo

  // NeoPOP-inspired bold gradients
  pop: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 50%, #FFFF00 100%)',  // Vibrant multi-color
  retro: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)', // Retro wave

  // Subtle backgrounds
  subtle: {
    blue: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
    purple: 'linear-gradient(135deg, #fae8ff 0%, #fdf4ff 100%)',
    green: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
  },
};

// ============================================================================
// SHADOWS - Layered Depth System (NeoPOP-inspired)
// ============================================================================

export const shadows = {
  // Standard elevation (for light mode)
  elevation: {
    1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    2: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    3: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
    4: '0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
    5: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },

  // OLED-specific shadows (subtle glows instead of shadows)
  oled: {
    brand: '0 0 20px rgba(0, 191, 255, 0.3), 0 0 40px rgba(0, 191, 255, 0.1)',
    accent: '0 0 20px rgba(147, 51, 234, 0.3), 0 0 40px rgba(147, 51, 234, 0.1)',
    success: '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)',
    warning: '0 0 20px rgba(249, 115, 22, 0.3), 0 0 40px rgba(249, 115, 22, 0.1)',
    error: '0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1)',
  },

  // NeoPOP-inspired layered shadows
  neopop: {
    flat: '4px 4px 0px rgba(0, 0, 0, 0.25)',                          // Flat bold shadow
    layered: '6px 6px 0px rgba(0, 0, 0, 0.2), 12px 12px 0px rgba(0, 0, 0, 0.1)', // Double layer
    colorBrand: '6px 6px 0px rgba(0, 191, 255, 0.4)',                 // Colored shadow
    colorAccent: '6px 6px 0px rgba(147, 51, 234, 0.4)',               // Purple shadow
  },

  // Colored shadows for vibrant UI
  colored: {
    brand: '0 4px 14px 0 rgba(0, 191, 255, 0.39)',
    accent: '0 4px 14px 0 rgba(147, 51, 234, 0.39)',
    success: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
    warning: '0 4px 14px 0 rgba(249, 115, 22, 0.39)',
    error: '0 4px 14px 0 rgba(239, 68, 68, 0.39)',
  },

  // Soft shadows for light mode cards
  brand: '0 10px 40px -10px rgba(0, 191, 255, 0.4)',
  accent: '0 10px 40px -10px rgba(147, 51, 234, 0.4)',
  success: '0 10px 40px -10px rgba(16, 185, 129, 0.3)',
  error: '0 10px 40px -10px rgba(239, 68, 68, 0.3)',
};

// ============================================================================
// BORDERS - NeoPOP Bold Outlines
// ============================================================================

export const borders = {
  // Bold borders for NeoPOP aesthetic
  neopop: {
    thin: '2px solid',
    medium: '3px solid',
    thick: '4px solid',
    extraThick: '6px solid',
  },

  // Subtle borders for OLED
  oled: {
    subtle: '1px solid rgba(255, 255, 255, 0.1)',
    medium: '1px solid rgba(255, 255, 255, 0.2)',
    strong: '2px solid rgba(255, 255, 255, 0.3)',
  },
};

// ============================================================================
// TYPOGRAPHY - Premium Hierarchy
// ============================================================================

export const typography = {
  // Font families
  fontFamily: {
    display: "'Inter', system-ui, -apple-system, sans-serif",  // Bold headlines
    body: "'Inter', system-ui, -apple-system, sans-serif",     // Body text
    mono: "'JetBrains Mono', 'Fira Code', monospace",          // Code, numbers
  },

  // Font weights (bolder for premium feel)
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Size scale
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Line height
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

// ============================================================================
// SPACING - Consistent Scale
// ============================================================================

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px

  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
  '4xl': '6rem',  // 96px
  '5xl': '8rem',  // 128px
};

// ============================================================================
// BORDER RADIUS - Modern, Rounded
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  base: '0.5rem',   // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
};

// ============================================================================
// ANIMATIONS - Smooth, Premium Motion
// ============================================================================

export const animations = {
  // Entrance animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },

  // 3D effects
  flipX: {
    initial: { opacity: 0, rotateX: 90 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: -90 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },

  flipY: {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: -90 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },

  // Spring animations (playful, premium feel)
  spring: {
    type: 'spring',
    stiffness: 260,
    damping: 20,
  },

  springGentle: {
    type: 'spring',
    stiffness: 200,
    damping: 24,
  },

  springBouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },

  // Celebration effects
  confetti: {
    initial: { y: -20, x: 0, opacity: 1, rotate: 0, scale: 1 },
    animate: (_custom: number) => ({
      y: [null, 300],
      x: [null, (Math.random() - 0.5) * 200],
      opacity: [null, 0],
      rotate: [null, Math.random() * 360],
      scale: [null, 0.5],
    }),
    transition: { duration: 2, ease: 'easeOut' },
  },

  // Hover effects
  hoverLift: {
    whileHover: { y: -4, scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  },

  hoverGrow: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 },
  },

  hoverRotate: {
    whileHover: { rotate: 5, scale: 1.1 },
    transition: { duration: 0.2 },
  },

  // Loading/pulse
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// GLASSMORPHISM - Modern, Layered UI
// ============================================================================

export const glass = {
  light: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },

  medium: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },

  strong: {
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },

  // OLED-specific glassmorphism (darker backgrounds with glow)
  oled: {
    light: {
      background: 'rgba(18, 18, 18, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    medium: {
      background: 'rgba(18, 18, 18, 0.8)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    },
    strong: {
      background: 'rgba(18, 18, 18, 0.9)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
  },

  brand: {
    background: 'rgba(0, 191, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 191, 255, 0.2)',
  },

  accent: {
    background: 'rgba(147, 51, 234, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(147, 51, 234, 0.2)',
  },
};

// ============================================================================
// EASING CURVES - Professional Motion
// ============================================================================

export const easings = {
  // Material Design
  standard: [0.4, 0, 0.2, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],

  // Custom
  smooth: [0.25, 0.1, 0.25, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
};

export const transitions = {
  duration: {
    instant: '75ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
  },

  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// ============================================================================
// Z-INDEX SCALE - Layering System
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
  toast: 1500,
};

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export default {
  colors,
  gradients,
  shadows,
  borders,
  typography,
  spacing,
  borderRadius,
  animations,
  glass,
  easings,
  transitions,
  zIndex,
  breakpoints,
};
