# Chronos Indigo Theme System

## Overview

The **Chronos Indigo** theme is a refined, professional design language inspired by premium productivity tools. Deep indigo conveys trust and focus; teal accents signal action and progress.

## Design Philosophy

- **Precision**: Clean typography, consistent spacing, clear hierarchy
- **Professionalism**: Deep indigo primary builds trust and focus
- **Clarity**: Teal accents guide attention to actions and states
- **Craftsmanship**: Attention to detail in every interaction

## Typography

### Font Families

| Purpose | Font | Fallbacks |
|---------|------|-----------|
| Headings (H1–H4) | Playfair Display | Georgia, Times New Roman |
| Body / UI (H5–H6, body) | Inter | Roboto, Helvetica, Arial |
| Data / Time | JetBrains Mono | Fira Code, Monaco, Consolas |

### Usage Guidelines

- **H1-H4**: Playfair Display (serif) for page titles and major headings
- **H5-H6**: Inter (sans-serif) for section headers and labels
- **Body**: Inter for all body text
- **Time/Data**: JetBrains Mono for timestamps, durations, numerical data
- **Captions/Labels**: JetBrains Mono for small metadata

```tsx
// Time display
<Typography variant="h2" sx={{ fontFamily: 'fontFamilyMono' }}>
  08:45:32
</Typography>

// Page title
<Typography variant="h1">Time Entries</Typography>
```

## Color System

### Primary Palette (Indigo)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `primary.main` | `#4f46e5` | `#818cf8` | Buttons, active states |
| `primary.light` | `#818cf8` | `#a5b4fc` | Hover states, highlights |
| `primary.dark` | `#3730a3` | `#4f46e5` | Pressed states |

### Secondary Palette (Teal)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `secondary.main` | `#14b8a6` | `#5eead4` | Secondary actions |
| `text.primary` | `#0f172a` | `#f8fafc` | Primary text |
| `text.secondary` | `#475569` | `#94a3b8` | Secondary text |
| `background.default` | `#f8fafc` | `#020617` | Page background |
| `background.paper` | `#ffffff` | `#0f172a` | Card/surface background |

### Custom Chronos Colors

Access via `theme.palette.chronos`:

```tsx
<Box sx={{ color: 'chronos.indigo' }} />
<Paper sx={{ bgcolor: 'chronos.mist' }} />
```

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `chronos.indigo` | `#4f46e5` | `#818cf8` | Brand accent |
| `chronos.teal` | `#14b8a6` | `#5eead4` | Action accent |
| `chronos.sage` | `#22c55e` | `#86efac` | Success states |
| `chronos.slate` | `#64748b` | `#94a3b8` | Neutral accent |
| `chronos.cream` | `#faf9f6` | `#f1f5f9` | Soft backgrounds |
| `chronos.charcoal` | `#1e293b` | `#cbd5e1` | Dark elements |
| `chronos.mist` | `#f1f5f9` | `#1e293b` | Subtle backgrounds |

### Time State Colors

Access via `theme.palette.time`:

| Token | Color | Usage |
|-------|-------|-------|
| `time.running` | `#10b981` (emerald) | Active timer, in-progress |
| `time.paused` | `#f59e0b` (amber) | Paused timer, waiting |
| `time.complete` | `#06b6d4` (cyan) | Completed, finished |

```tsx
<Chip label="Running" sx={{ bgcolor: 'time.running', color: 'white' }} />
```

## Shadows

| Level | Usage |
|-------|-------|
| `1-3` | Subtle elevation (hover states) |
| `4-6` | Cards, buttons |
| `8-12` | Dropdowns, menus, dialogs |
| `16-24` | Modals, popovers |

## Shape & Spacing

### Border Radius

- Default: `10px`
- Cards: `14px`
- Buttons: `8px`
- Inputs: `10px`
- Chips/Badges: `6px`

### Spacing Scale

Based on 8px grid: `8, 16, 24, 32, 40, 48, 64`

## Component Patterns

### Buttons

```tsx
<Button variant="contained" size="large">Start Timer</Button>
<Button variant="outlined">Cancel</Button>
```

### Cards

```tsx
<Card elevation={3}>
  <CardContent>
    <Typography variant="h5" gutterBottom>Card Title</Typography>
    <Typography variant="body2" color="text.secondary">Content</Typography>
  </CardContent>
</Card>
```

### Time Display

```tsx
<Typography
  variant="h2"
  sx={{ fontFamily: 'fontFamilyMono', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}
>
  08:45:32
</Typography>
```

## Theme Toggle

```tsx
import { useTheme, useAppActions } from '@core/state/appStore'

const currentTheme = useTheme()
const { toggleTheme } = useAppActions()
```

## Creating Custom Components

1. Use MUI components as the base
2. Reference theme values via `sx` prop
3. Test in both light and dark modes

```tsx
<Box
  sx={{
    p: 3,
    borderRadius: 3,
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    boxShadow: 4,
    transition: 'all 0.3s ease',
    '&:hover': { boxShadow: 8, transform: 'translateY(-2px)' },
  }}
/>
```

## File Structure

```
frontend/src/core/theme/
├── themeConfig.ts      # Theme configuration and color tokens
├── ThemeProvider.tsx   # Theme provider component
└── index.ts            # Public exports
```

## Accessibility

- All color combinations meet WCAG 2.1 AA contrast requirements
- Focus states visible with indigo outline
- Interactive elements have minimum 44px touch targets
