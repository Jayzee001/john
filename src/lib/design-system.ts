// Design System Configuration
// Change these values to customize your store's appearance

export const designSystem = {
  // Brand Colors - Change these to customize your store
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    // Alternative color schemes - uncomment and modify as needed
    
    // Purple theme
    // primary: {
    //   50: '#faf5ff',
    //   100: '#f3e8ff',
    //   200: '#e9d5ff',
    //   300: '#d8b4fe',
    //   400: '#c084fc',
    //   500: '#a855f7',
    //   600: '#9333ea',
    //   700: '#7c3aed',
    //   800: '#6b21a8',
    //   900: '#581c87',
    //   950: '#3b0764',
    // },

    // Green theme
    // primary: {
    //   50: '#f0fdf4',
    //   100: '#dcfce7',
    //   200: '#bbf7d0',
    //   300: '#86efac',
    //   400: '#4ade80',
    //   500: '#22c55e',
    //   600: '#16a34a',
    //   700: '#15803d',
    //   800: '#166534',
    //   900: '#14532d',
    //   950: '#052e16',
    // },

    // Red theme
    // primary: {
    //   50: '#fef2f2',
    //   100: '#fee2e2',
    //   200: '#fecaca',
    //   300: '#fca5a5',
    //   400: '#f87171',
    //   500: '#ef4444',
    //   600: '#dc2626',
    //   700: '#b91c1c',
    //   800: '#991b1b',
    //   900: '#7f1d1d',
    //   950: '#450a0a',
    // },

    // Orange theme
    // primary: {
    //   50: '#fff7ed',
    //   100: '#ffedd5',
    //   200: '#fed7aa',
    //   300: '#fdba74',
    //   400: '#fb923c',
    //   500: '#f97316',
    //   600: '#ea580c',
    //   700: '#c2410c',
    //   800: '#9a3412',
    //   900: '#7c2d12',
    //   950: '#431407',
    // },
  },

  // Store Information
  store: {
    name: 'John Store',
    description: 'Your Online Shopping Destination',
    tagline: 'Discover amazing products at great prices',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  // Border Radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
};

// Helper function to generate CSS variables
export function generateCSSVariables() {
  const { colors } = designSystem;
  const cssVars: Record<string, string> = {};

  // Generate primary color variables
  Object.entries(colors.primary).forEach(([shade, color]) => {
    cssVars[`--primary-${shade}`] = color;
  });

  return cssVars;
}

// Helper function to get primary color
export function getPrimaryColor(shade: keyof typeof designSystem.colors.primary) {
  return designSystem.colors.primary[shade];
}

// Helper function to get store info
export function getStoreInfo() {
  return designSystem.store;
} 