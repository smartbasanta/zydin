export interface ThemeColors {
  // Primary colors
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    1000: string;
    1100: string;
    1200: string;
    1250: string;
  };

  // Secondary colors
  secondary: {
    0: string;
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    1000: string;
    1100: string;
    1200: string;
    1250: string;
  };

  // Accent colors
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Neutral colors
  gray: {
    0: string;
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    1000: string;
    1100: string;
    1200: string;
    1250: string;
  };

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeGradients {
  primary: string;
  secondary: string;
  accent: string;
  hero: string;
  card: string;
  button: string;
}

export interface ThemeTypography {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
}

export interface ThemeSpacing {
  container: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  section: {
    py: string;
    px: string;
  };
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

export interface ThemePreset {
  name: string;
  description: string;
  colors: ThemeColors;
  gradients: ThemeGradients;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      linear: string;
      in: string;
      out: string;
      inOut: string;
    };
  };
}

// Biotech Theme (Current)
export const biotechTheme: ThemePreset = {
  name: 'Biotech',
  description: 'Professional biotech theme with purple and orange accents',
  colors: {
    primary: {
      50: '#fbf9fc',
      100: '#f6f2f9',
      200: '#edeaf2',
      300: '#e4e1ec',
      400: '#dcd9e6',
      500: '#d3d0df',
      600: '#cac8d9',
      700: '#c1bfd2',
      800: '#b9b7cc',
      900: '#b0afc5',
      1000: '#a7a6bf',
      1100: '#9e9eb8',
      1200: '#9596b2',
      1250: '#8c8eab'
    },
    secondary: {
      0: '#fffaf0',
      50: '#fef6e6',
      100: '#fef2dc',
      200: '#fdedd2',
      300: '#fde9c8',
      400: '#fde5bf',
      500: '#fce1b5',
      600: '#fcddab',
      700: '#fcd9a1',
      800: '#fcd597',
      900: '#fcd18d',
      1000: '#fccc83',
      1100: '#fcc879',
      1200: '#fcc46f',
      1250: '#fcbc5b'
    },
    accent: {
      50: '#fef7f6',
      100: '#fce7e5',
      200: '#f9d7d4',
      300: '#f7c7c2',
      400: '#f5b6b1',
      500: '#f3a6a0',
      600: '#f0968e',
      700: '#ee867d',
      800: '#ec766b',
      900: '#ea665a'
    },
    gray: {
      0: '#fbfbfb',
      50: '#f1f1f1',
      100: '#e7e7e7',
      200: '#dedede',
      300: '#d4d4d4',
      400: '#cacaca',
      500: '#c0c0c0',
      600: '#b6b6b6',
      700: '#adadad',
      800: '#a3a3a3',
      900: '#999999',
      1000: '#8f8f8f',
      1100: '#858585',
      1200: '#7c7c7c',
      1250: '#727272'
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #8971a6 0%, #5f638b 100%)',
    secondary: 'linear-gradient(135deg, #fcb13a 0%, #fb9801 100%)',
    accent: 'linear-gradient(135deg, #e75549 0%, #c8281a 100%)',
    hero: 'linear-gradient(135deg, rgba(137, 113, 166, 0.9) 0%, rgba(95, 99, 139, 0.9) 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    button: 'linear-gradient(135deg, #fcb13a 0%, #fb9801 100%)'
  },
  typography: {
    fontFamily: {
      heading: '"Space Grotesk", sans-serif',
      body: '"Poppins", sans-serif',
      mono: '"JetBrains Mono", monospace'
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
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },
  spacing: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    section: {
      py: '5rem',
      px: '1rem'
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none'
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      linear: 'linear',
      in: 'ease-in',
      out: 'ease-out',
      inOut: 'ease-in-out'
    }
  }
};

// Modern Storytelling Theme
export const storytellingTheme: ThemePreset = {
  name: 'Storytelling',
  description: 'Modern storytelling theme with deep blues and warm accents',
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      1000: '#0f3a57',
      1100: '#0f2f45',
      1200: '#0e2538',
      1250: '#0d1f2e'
    },
    secondary: {
      0: '#fefefe',
      50: '#fdfdfe',
      100: '#fbfbfc',
      200: '#f7f7f9',
      300: '#f1f1f4',
      400: '#e8e8ec',
      500: '#d9d9e0',
      600: '#c7c7d1',
      700: '#a8a8b8',
      800: '#8b8ba3',
      900: '#6f6f8a',
      1000: '#585875',
      1100: '#454562',
      1200: '#36364f',
      1250: '#2a2a3d'
    },
    accent: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12'
    },
    gray: {
      0: '#ffffff',
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      1000: '#0a0f1c',
      1100: '#05080f',
      1200: '#020406',
      1250: '#010203'
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    secondary: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    accent: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)',
    hero: 'linear-gradient(135deg, rgba(14, 165, 233, 0.95) 0%, rgba(3, 105, 161, 0.95) 50%, rgba(15, 42, 69, 0.98) 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)',
    button: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
  },
  typography: {
    fontFamily: {
      heading: '"Inter", sans-serif',
      body: '"Inter", sans-serif',
      mono: '"JetBrains Mono", monospace'
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
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },
  spacing: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    section: {
      py: '6rem',
      px: '2rem'
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none'
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px'
  },
  animations: {
    duration: {
      fast: '200ms',
      normal: '400ms',
      slow: '600ms'
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
};

// Pharmaceutical Theme (Professional)
export const pharmaceuticalTheme: ThemePreset = {
  name: 'Pharmaceutical',
  description: 'Professional pharmaceutical theme with modern medical aesthetics and perfect contrast',
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
      1000: '#1e293b',
      1100: '#172554',
      1200: '#0f172a',
      1250: '#0f1419'
    },
    secondary: {
      0: '#f0fdf4',
      50: '#dcfce7',
      100: '#bbf7d0',
      200: '#86efac',
      300: '#4ade80',
      400: '#22c55e',
      500: '#16a34a',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      1000: '#052e16',
      1100: '#041f0f',
      1200: '#03150a',
      1250: '#020f06'
    },
    accent: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    gray: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      1000: '#0f0f0f',
      1100: '#09090b',
      1200: '#060607',
      1250: '#030303'
    },
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#2563eb'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
    secondary: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    accent: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
    hero: 'linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(29, 78, 216, 0.95) 50%, rgba(30, 58, 138, 0.98) 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
    button: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
  },
  typography: {
    fontFamily: {
      heading: '"Inter", sans-serif',
      body: '"Inter", sans-serif',
      mono: '"JetBrains Mono", monospace'
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
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },
  spacing: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    section: {
      py: '6rem',
      px: '2rem'
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none'
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px'
  },
  animations: {
    duration: {
      fast: '200ms',
      normal: '400ms',
      slow: '600ms'
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
};

// Available theme presets
export const themePresets = {
  biotech: biotechTheme,
  storytelling: storytellingTheme,
  pharmaceutical: pharmaceuticalTheme
} as const;

export type ThemePresetKey = keyof typeof themePresets;
