import { createTheme, ThemeOptions, alpha, type Shadows } from '@mui/material/styles'

// =============================================================================
// CHRONOS INDIGO THEME SYSTEM
// Inspired by premium productivity tools - refined, professional, focused
// Primary: Deep Indigo (trust, professionalism)
// Secondary: Teal/Emerald accents (action, progress)
// =============================================================================

// Custom palette augmentation
declare module '@mui/material/styles' {
  interface Palette {
    chronos: {
      indigo: string
      teal: string
      sage: string
      slate: string
      cream: string
      charcoal: string
      mist: string
    }
    time: {
      running: string
      paused: string
      complete: string
    }
  }
  interface PaletteOptions {
    chronos?: {
      indigo?: string
      teal?: string
      sage?: string
      slate?: string
      cream?: string
      charcoal?: string
      mist?: string
    }
    time?: {
      running?: string
      paused?: string
      complete?: string
    }
  }
}

// Color tokens
const colors = {
  // Primary: Deep Indigo
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  // Secondary: Teal for accents
  teal: {
    light: '#5eead4',
    main: '#14b8a6',
    dark: '#0f766e',
  },
  // Neutral: Cool slate
  slate: {
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
    950: '#020617',
  },
  // Functional colors for time states
  time: {
    running: '#10b981', // Emerald
    paused: '#f59e0b', // Amber
    complete: '#06b6d4', // Cyan
  },
  // Success sage
  sage: {
    light: '#86efac',
    main: '#22c55e',
    dark: '#15803d',
  },
}

// Typography
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontFamilySerif: '"Playfair Display", "Georgia", "Times New Roman", serif',
  fontFamilyMono: '"JetBrains Mono", "Fira Code", "Monaco", "Consolas", monospace',
  h1: {
    fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
    fontWeight: 600,
  },
  h4: {
    fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
    fontWeight: 600,
  },
  h5: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontWeight: 600,
    letterSpacing: '0.01em',
  },
  h6: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontWeight: 600,
    letterSpacing: '0.01em',
    textTransform: 'uppercase' as const,
    fontSize: '0.875rem',
  },
  subtitle1: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontWeight: 500,
    letterSpacing: '0.01em',
  },
  subtitle2: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontWeight: 500,
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const,
    fontSize: '0.75rem',
  },
  body1: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  button: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontWeight: 600,
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '0.75rem',
    letterSpacing: '0.02em',
  },
  overline: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    fontSize: '0.6875rem',
  },
}

// Shadow system
const shadows: Shadows = [
  'none',
  '0 1px 2px 0 rgb(0 0 0 / 0.04)',
  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
  '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
  '0 6px 8px -2px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
  '0 8px 12px -4px rgb(0 0 0 / 0.06), 0 4px 8px -6px rgb(0 0 0 / 0.04)',
  '0 12px 16px -6px rgb(0 0 0 / 0.06), 0 6px 12px -8px rgb(0 0 0 / 0.05)',
  '0 16px 24px -8px rgb(0 0 0 / 0.08), 0 8px 16px -12px rgb(0 0 0 / 0.04)',
  '0 20px 32px -12px rgb(0 0 0 / 0.1), 0 12px 20px -16px rgb(0 0 0 / 0.06)',
  '0 24px 40px -16px rgb(0 0 0 / 0.12), 0 16px 24px -20px rgb(0 0 0 / 0.08)',
  '0 0 0 1px rgb(0 0 0 / 0.05)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 4px 6px -1px rgb(0 0 0 / 0.05)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 8px 12px -4px rgb(0 0 0 / 0.06)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 12px 16px -6px rgb(0 0 0 / 0.08)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 16px 24px -8px rgb(0 0 0 / 0.1)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 20px 32px -12px rgb(0 0 0 / 0.12)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 24px 40px -16px rgb(0 0 0 / 0.14)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 32px 48px -20px rgb(0 0 0 / 0.16)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 40px 64px -24px rgb(0 0 0 / 0.18)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 48px 80px -32px rgb(0 0 0 / 0.2)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 64px 96px -40px rgb(0 0 0 / 0.22)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 80px 120px -48px rgb(0 0 0 / 0.24)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 96px 144px -56px rgb(0 0 0 / 0.26)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 112px 168px -64px rgb(0 0 0 / 0.28)',
  '0 0 0 1px rgb(0 0 0 / 0.05), 0 128px 192px -72px rgb(0 0 0 / 0.3)',
]

// Shape
const shape = {
  borderRadius: 10,
}

// Spacing
const spacing = 8

// Component overrides
const getComponentOverrides = (mode: 'light' | 'dark'): ThemeOptions['components'] => {
  const isLight = mode === 'light'
  const borderColor = isLight ? colors.slate[200] : colors.slate[700]
  const hoverBg = isLight ? colors.slate[50] : colors.slate[800]

  return {
    MuiCssBaseline: {
      styleOverrides: {
        '@import': [
          'url(https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@500;600;700&display=swap)',
        ],
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: shadows[4],
          },
        },
        contained: {
          boxShadow: shadows[2],
          '&:hover': {
            boxShadow: shadows[6],
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        sizeLarge: {
          padding: '14px 28px',
          fontSize: '0.9375rem',
        },
        sizeSmall: {
          padding: '6px 14px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: hoverBg,
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: shadows[3],
        },
        elevation2: {
          boxShadow: shadows[5],
        },
        elevation3: {
          boxShadow: shadows[8],
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: shadows[8],
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${borderColor}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '4px 12px',
          padding: '10px 16px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: hoverBg,
          },
          '&.Mui-selected': {
            backgroundColor: isLight
              ? alpha(colors.indigo[500], 0.12)
              : alpha(colors.indigo[400], 0.2),
            '&:hover': {
              backgroundColor: isLight
                ? alpha(colors.indigo[500], 0.18)
                : alpha(colors.indigo[400], 0.28),
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontFamily: typography.fontFamilyMono,
          fontSize: '0.75rem',
          height: 28,
        },
        filled: {
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: hoverBg,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 3px ${alpha(colors.indigo[500], 0.15)}`,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
        notchedOutline: {
          borderColor: borderColor,
          borderWidth: '1.5px',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          padding: '8px 14px',
          fontSize: '0.8125rem',
          fontWeight: 500,
          backgroundColor: isLight ? colors.slate[900] : colors.slate[100],
          color: isLight ? colors.slate[50] : colors.slate[900],
        },
        arrow: {
          color: isLight ? colors.slate[900] : colors.slate[100],
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontFamily: typography.fontFamilyMono,
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${borderColor}`,
          padding: '16px 20px',
        },
        head: {
          fontFamily: typography.fontFamilyMono,
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: isLight ? colors.slate[500] : colors.slate[400],
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: borderColor,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: `2px solid ${borderColor}`,
          fontFamily: typography.fontFamilySerif,
          fontWeight: 600,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
          backgroundColor: isLight ? colors.slate[200] : colors.slate[700],
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: isLight
            ? alpha(colors.slate[400], 0.2)
            : alpha(colors.slate[600], 0.2),
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '14px 18px',
        },
        standardSuccess: {
          backgroundColor: isLight
            ? alpha(colors.sage.main, 0.12)
            : alpha(colors.sage.main, 0.15),
          color: isLight ? colors.sage.dark : colors.sage.light,
          '& .MuiAlert-icon': {
            color: isLight ? colors.sage.dark : colors.sage.light,
          },
        },
        standardWarning: {
          backgroundColor: isLight
            ? alpha(colors.time.paused, 0.12)
            : alpha(colors.time.paused, 0.15),
          color: isLight ? colors.slate[900] : colors.slate[100],
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 8,
        },
        track: {
          borderRadius: 22 / 2,
          backgroundColor: colors.slate[400],
          opacity: 1,
        },
        thumb: {
          boxShadow: shadows[2],
        },
        switchBase: {
          '&.Mui-checked': {
            '& + .MuiSwitch-track': {
              backgroundColor: colors.indigo[500],
              opacity: 1,
            },
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 6,
        },
        thumb: {
          width: 18,
          height: 18,
          boxShadow: shadows[3],
          '&:hover': {
            boxShadow: shadows[5],
          },
        },
        track: {
          borderRadius: 3,
        },
        rail: {
          borderRadius: 3,
          opacity: 0.4,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: shadows[8],
          '&:hover': {
            boxShadow: shadows[12],
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: shadows[8],
          border: `1px solid ${borderColor}`,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '10px 16px',
          borderRadius: 8,
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: hoverBg,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: shadows[16],
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            borderRadius: 12,
          },
        },
      },
    },
  }
}

// Light theme configuration
const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.indigo[600],
      light: colors.indigo[400],
      dark: colors.indigo[800],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.teal.main,
      light: colors.teal.light,
      dark: colors.teal.dark,
      contrastText: '#ffffff',
    },
    background: {
      default: colors.slate[50],
      paper: '#ffffff',
    },
    text: {
      primary: colors.slate[900],
      secondary: colors.slate[600],
      disabled: colors.slate[400],
    },
    divider: colors.slate[200],
    error: {
      main: '#ef4444',
      light: '#fca5a5',
      dark: '#b91c1c',
    },
    warning: {
      main: colors.time.paused,
      light: '#fcd34d',
      dark: '#d97706',
    },
    info: {
      main: '#0ea5e9',
      light: '#7dd3fc',
      dark: '#0369a1',
    },
    success: {
      main: colors.sage.main,
      light: colors.sage.light,
      dark: colors.sage.dark,
    },
    grey: colors.slate,
    chronos: {
      indigo: colors.indigo[600],
      teal: colors.teal.main,
      sage: colors.sage.main,
      slate: colors.slate[500],
      cream: '#faf9f6',
      charcoal: colors.slate[800],
      mist: colors.slate[100],
    },
    time: colors.time,
  },
  typography,
  shadows,
  shape,
  spacing,
  components: getComponentOverrides('light'),
}

// Dark theme configuration
const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: colors.indigo[400],
      light: colors.indigo[300],
      dark: colors.indigo[600],
      contrastText: colors.slate[950],
    },
    secondary: {
      main: colors.teal.light,
      light: '#99f6e4',
      dark: colors.teal.main,
      contrastText: colors.slate[900],
    },
    background: {
      default: colors.slate[950],
      paper: colors.slate[900],
    },
    text: {
      primary: colors.slate[50],
      secondary: colors.slate[400],
      disabled: colors.slate[600],
    },
    divider: colors.slate[700],
    error: {
      main: '#f87171',
      light: '#fca5a5',
      dark: '#dc2626',
    },
    warning: {
      main: '#fbbf24',
      light: '#fcd34d',
      dark: '#d97706',
    },
    info: {
      main: '#38bdf8',
      light: '#7dd3fc',
      dark: '#0284c7',
    },
    success: {
      main: '#4ade80',
      light: '#86efac',
      dark: '#16a34a',
    },
    grey: colors.slate,
    chronos: {
      indigo: colors.indigo[400],
      teal: colors.teal.light,
      sage: colors.sage.light,
      slate: colors.slate[400],
      cream: colors.slate[100],
      charcoal: colors.slate[300],
      mist: colors.slate[800],
    },
    time: {
      running: '#34d399',
      paused: '#fbbf24',
      complete: '#22d3ee',
    },
  },
  typography,
  shadows,
  shape,
  spacing,
  components: getComponentOverrides('dark'),
}

// Theme creators
export const createLightTheme = () => createTheme(lightThemeOptions)
export const createDarkTheme = () => createTheme(darkThemeOptions)

// Export colors for use in components (when needed)
export { colors }

// Type exports
export type ChronosTheme = ReturnType<typeof createLightTheme>
