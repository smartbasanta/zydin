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
  description: 'Cutting-edge biotech palette anchored in deep blues and cool cyan accents',
  colors: {
    primary: {
      50: '#f4f8ff',
      100: '#e6f0ff',
      200: '#cfdfff',
      300: '#b1ceff',
      400: '#8db5ff',
      500: '#6398ff',
      600: '#3a7bff',
      700: '#1c60e8',
      800: '#124cc4',
      900: '#0f3da0',
      1000: '#0b2e79',
      1100: '#09245c',
      1200: '#061a3f',
      1250: '#03112a'
    },
    secondary: {
      0: '#f0fbff',
      50: '#d9f5ff',
      100: '#c0ecff',
      200: '#a0e0ff',
      300: '#7ed0ff',
      400: '#56bdff',
      500: '#2ba8f5',
      600: '#0e8ad6',
      700: '#086ca9',
      800: '#054d79',
      900: '#033454',
      1000: '#02263d',
      1100: '#021b2b',
      1200: '#01121c',
      1250: '#000a11'
    },
    accent: {
      50: '#f6f4ff',
      100: '#e8e4ff',
      200: '#d4cfff',
      300: '#b8b1ff',
      400: '#9a8cff',
      500: '#826df7',
      600: '#6a53e0',
      700: '#513fcc',
      800: '#3b2da3',
      900: '#2a1f75'
    },
    gray: {
      0: '#f8fafc',
      50: '#eef2f7',
      100: '#dfe5ec',
      200: '#cfd6de',
      300: '#b9c0c8',
      400: '#9ea7b1',
      500: '#87909a',
      600: '#6c747f',
      700: '#535b66',
      800: '#3d4550',
      900: '#2c333d',
      1000: '#222832',
      1100: '#181e26',
      1200: '#11161c',
      1250: '#0b1014'
    },
    success: '#16c47f',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #3a7bff 0%, #124cc4 55%, #061a3f 100%)',
    secondary: 'linear-gradient(135deg, #2ba8f5 0%, #0e8ad6 100%)',
    accent: 'linear-gradient(135deg, #826df7 0%, #513fcc 100%)',
    hero: 'linear-gradient(120deg, rgba(6, 26, 63, 0.95) 0%, rgba(10, 76, 186, 0.9) 55%, rgba(43, 168, 245, 0.9) 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 247, 255, 0.9) 100%)',
    button: 'linear-gradient(135deg, #3a7bff 0%, #124cc4 100%)'
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
  description: 'Warm editorial palette with modern amber gradients and vibrant accents',
  colors: {
    primary: {
      50: '#fff9f2',
      100: '#ffeddc',
      200: '#ffd6b0',
      300: '#ffb97a',
      400: '#ff9941',
      500: '#ff7c1a',
      600: '#e26105',
      700: '#b94a03',
      800: '#8f3604',
      900: '#662603',
      1000: '#4a1b02',
      1100: '#331302',
      1200: '#200b01',
      1250: '#120600'
    },
    secondary: {
      0: '#fff9f3',
      50: '#fff3e2',
      100: '#ffe4c5',
      200: '#ffd0a3',
      300: '#ffbc80',
      400: '#ffa65c',
      500: '#ff9145',
      600: '#e47432',
      700: '#bb5925',
      800: '#8f411a',
      900: '#653012',
      1000: '#4a230d',
      1100: '#331709',
      1200: '#221005',
      1250: '#170a03'
    },
    accent: {
      50: '#fff4f7',
      100: '#ffe1ea',
      200: '#ffc2d5',
      300: '#ff9fbe',
      400: '#ff7aa5',
      500: '#ff568f',
      600: '#e13d79',
      700: '#b62c60',
      800: '#8a2049',
      900: '#5f1533'
    },
    gray: {
      0: '#fffdfb',
      50: '#fef6f0',
      100: '#fbeadf',
      200: '#f3d9c7',
      300: '#e3c5ae',
      400: '#c8a88f',
      500: '#ad8e77',
      600: '#8c715e',
      700: '#6d5547',
      800: '#503b31',
      900: '#38271f',
      1000: '#291b15',
      1100: '#1c110d',
      1200: '#120a07',
      1250: '#0a0503'
    },
    success: '#1fbf8f',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #ff7c1a 0%, #b94a03 55%, #662603 100%)',
    secondary: 'linear-gradient(135deg, #ff9145 0%, #e47432 100%)',
    accent: 'linear-gradient(135deg, #ff568f 0%, #b62c60 100%)',
    hero: 'linear-gradient(120deg, rgba(32, 11, 1, 0.95) 0%, rgba(185, 74, 3, 0.9) 55%, rgba(255, 145, 69, 0.9) 100%)',
    card: 'linear-gradient(135deg, rgba(255, 249, 242, 0.95) 0%, rgba(255, 237, 220, 0.9) 100%)',
    button: 'linear-gradient(135deg, #ff7c1a 0%, #b94a03 100%)'
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
  description: 'Clinical palette with crisp medical blues balanced by restorative greens',
  colors: {
    primary: {
      50: '#f2f7ff',
      100: '#dce8ff',
      200: '#bfd4ff',
      300: '#9bbaff',
      400: '#759dff',
      500: '#4a7dff',
      600: '#2c63ed',
      700: '#1b4ccc',
      800: '#123aa6',
      900: '#0c2a7d',
      1000: '#081d59',
      1100: '#051440',
      1200: '#030c29',
      1250: '#010614'
    },
    secondary: {
      0: '#effff8',
      50: '#d4fee9',
      100: '#aefad4',
      200: '#84f0bd',
      300: '#59e2a5',
      400: '#32ce8d',
      500: '#12b074',
      600: '#00925f',
      700: '#007349',
      800: '#005737',
      900: '#003c26',
      1000: '#002b1c',
      1100: '#001f14',
      1200: '#00140c',
      1250: '#000b06'
    },
    accent: {
      50: '#eefcfe',
      100: '#d4f7fb',
      200: '#abecf7',
      300: '#7ee0f1',
      400: '#52d1ea',
      500: '#27bedf',
      600: '#159fba',
      700: '#0f7c8f',
      800: '#0b5b66',
      900: '#083b43'
    },
    gray: {
      0: '#ffffff',
      50: '#f5f7fa',
      100: '#e9edf2',
      200: '#d7dfe6',
      300: '#c1cbd3',
      400: '#a1acb6',
      500: '#818d97',
      600: '#66727d',
      700: '#4c5862',
      800: '#353f48',
      900: '#252c33',
      1000: '#1b2026',
      1100: '#13171c',
      1200: '#0c1013',
      1250: '#070a0c'
    },
    success: '#00a772',
    warning: '#f59e0b',
    error: '#dc2626',
    info: '#1b4ccc'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #4a7dff 0%, #1b4ccc 60%, #081d59 100%)',
    secondary: 'linear-gradient(135deg, #12b074 0%, #00925f 100%)',
    accent: 'linear-gradient(135deg, #27bedf 0%, #0f7c8f 100%)',
    hero: 'linear-gradient(120deg, rgba(3, 12, 41, 0.95) 0%, rgba(18, 58, 166, 0.9) 55%, rgba(39, 190, 223, 0.9) 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 247, 250, 0.95) 100%)',
    button: 'linear-gradient(135deg, #12b074 0%, #00925f 100%)'
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
