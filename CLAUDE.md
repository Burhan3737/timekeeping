# CLAUDE.md - Project Conventions

## Project Knowledge
Tech Stack: React, Typescript, MUI

## Theme System

The app uses a custom **"Chronos Indigo"** theme — deep indigo primary (#4f46e5), teal secondary (#14b8a6).

### Theme Documentation
See `prd/ui/themes.md` for complete documentation including:
- Typography (Playfair Display + Inter + JetBrains Mono)
- Color palette (indigo primary, teal secondary, slate neutrals)
- Custom palette extensions (`chronos.*`, `time.*`)
- Component styling patterns

### Quick Reference
```tsx
import { useTheme, useAppActions } from '@core/state/appStore'

const currentTheme = useTheme() // 'light' | 'dark'
const { toggleTheme } = useAppActions()

// Access theme colors
<Typography sx={{ color: 'chronos.indigo' }} />
<Box sx={{ bgcolor: 'time.running' }} />
```

### Key Files
- `frontend/src/core/theme/themeConfig.ts` - Theme configuration
- `frontend/src/core/theme/ThemeProvider.tsx` - Theme provider

## File Structure / Architecture

- `src/modules/${moduleName}/index.tsx` — Business logic, module state, and side effects (APIs etc.)
- `src/modules/${moduleName}/types.ts` — Interfaces and types for the module
- `src/modules/${moduleName}/${moduleNameView}.tsx` — View layer (only view-related state). Can be multiple files.
- `src/modules/${moduleName}/utils.tsx` — Module-specific utility functions
- `src/logic/${logicModuleName}.ts` — App-wide business logic, rules, and core calculations (used across modules)
- `src/shared/components/${reusableComponent}` — Reusable components used throughout the app
- `src/shared/utils/${utilsFolder or fileName}` — Shared utility functions (dateUtils, formatters, etc.)

## Navigation — Adding a New Page

**Single source of truth**: `src/core/routing/navigationConfig.ts`

To add a new page to the app:
1. Add a `NavItem` entry to `navigationConfig.ts` (label, path, icon, description, color, optional `requiredRole`)
2. Add a `<Route>` in `App.tsx` mapping the path to the page component

Sidebar and tile navigation update automatically. Do NOT hardcode nav items in `Sidebar.tsx` or `NavigationTiles.tsx`.

`requiredRole` values: `'ADMIN'` | `'SUPERVISOR'` | `'FIELD_WORKER'` | `'DATA_ENTRY_CLERK'` — omit to show to all authenticated users. Role filtering is enforced in Phase 3 (auth module).

## Rules

- Always use MUI for creating components
- Keep the UI and theming consistent (reference the ThemeProvider for tokens)
- Always follow the defined file/folder structure
- Make reusable view components (where applicable) consistent with the app theme, stored at `shared/components/${reusableComponent}`
- For view layer changes, recommend reusable components from `shared/components/` if applicable
- Generic utility functions (e.g., dateUtils) must be stored at `shared/utils/${utilsFolder or fileName}`
- Write as minimal code as possible and DRY
- No fancy architecture that confuses new developers
- Follow the defined folder/file structure
- The `src/context` folder holds globally persistent state — use existing stores rather than creating new ones
- When in plan mode, explain your solution thoroughly and ask follow-up questions
- When in plan mode, mention all file changes so the engineer can review before implementation
- Recurrent rules defined by the user in prompts should be added to this Rules section
- Use the frontend-design skill when creating view components
- Use any other skill to improve productivity
- Store core context in CLAUDE.md/AGENTS.md so each new agent session has full context; keep it concise to minimize token usage

## Project Overview

Enterprise web application for timekeeping/time tracking built with React 18+ and Node.js/Express.

## Architecture

### Layered Architecture
1. **View Layer**: React components (presentational only)
2. **Logic Layer**: Business rules in src/logic (decoupled from UI)
3. **Data Layer**: API clients and state management

### Monorepo Structure
- npm workspaces for package management
- `frontend/`: React SPA with Vite
- `server/`: Express API with TypeScript

## Naming Conventions

### Files
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities/Hooks: camelCase (e.g., `useAuth.ts`)
- Styles: ComponentName.module.css or `ComponentName.css`
- Constants: camelCase (e.g., `apiEndpoints.ts`)

### Folders
- Feature modules: camelCase (e.g., `timeTracking/`, `userManagement/`)
- Shared/core: lowercase (e.g., `shared/`, `core/`)

### Code
- Variables/functions: camelCase
- Classes/interfaces/types: PascalCase
- Constants: UPPER_SNAKE_CASE or camelCase
- Private methods: _leadingUnderscore (when needed)

## State Management

### Zustand Pattern
- Global stores in `core/state/`
- Feature stores in module folders: `modules/feature/store.ts`
- Keep stores focused and small
- Use selectors to subscribe to specific slices

```typescript
// Preferred pattern
import { create } from 'zustand'

interface FeatureState {
  data: DataType[]
  loading: boolean
  error: Error | null
  actions: {
    fetchData: () => Promise<void>
    reset: () => void
  }
}

export const useFeatureStore = create<FeatureState>()((set, get) => ({
  data: [],
  loading: false,
  error: null,
  actions: {
    fetchData: async () => {
      set({ loading: true, error: null })
      // fetch logic
    },
    reset: () => set({ data: [], loading: false, error: null })
  }
}))

// Usage in components
const { data, loading } = useFeatureStore()
const { fetchData } = useFeatureStore(state => state.actions)
```

## API Communication

### REST Pattern
- GET for reads
- POST for creates
- PUT for updates
- DELETE for removals
- Standard HTTP status codes
- JSON request/response bodies

### Error Handling
- Client: Handle errors in logic layer, propagate to UI
- Server: Standard error response format `{ error: string, code?: string }`

## Component Patterns

### View Components
- Own local state for UI concerns
- Receive business data via props
- Delegate user actions to callbacks
- No direct API calls

```typescript
interface Props {
  data: DataType
  onAction: (payload: Payload) => void
  loading?: boolean
  error?: Error | null
}

export function FeatureView({ data, onAction, loading, error }: Props) {
  // UI state only
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    // JSX
  )
}
```

## Development Commands

```bash
# Install all dependencies
npm install

# Run frontend only
npm run dev --workspace=frontend

# Run server only
npm run dev --workspace=server

# Run both (concurrently)
npm run dev

# Build all
npm run build

# Lint all
npm run lint
```

## Technology Stack

### Frontend
- React 18+ with TypeScript
- Vite for build tooling
- React Router v6 for routing
- Zustand for state management
- CSS Modules for styling

### Backend
- Node.js with Express
- TypeScript with ts-node
- CORS, Helmet, Compression middleware
- dotenv for configuration

## Environment Variables

### Server (.env)
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: development/production
- `CORS_ORIGIN`: Frontend URL for CORS

### Frontend
- `VITE_API_URL`: Backend API base URL

## Module Organization

Each feature module should be self-contained:

```
modules/featureName/
├── components/        # View components
├── hooks/            # Logic layer hooks
├── store.ts          # Zustand store (if needed)
├── types.ts          # Module-specific types
└── index.ts          # Public API exports
```

## Shared Components

Located in `shared/`:
- Reusable UI primitives
- Layout components
- Utility hooks
- Type definitions

## API Client

Located in `core/api/`:
- Base fetch wrapper
- Request/response interceptors
- Error handling
- Type-safe endpoints

## PRD Documentation

All feature requirements are documented in `prd/`:
- **`prd/_index.md`** — Master index: build order, dependency graph, module registry
- **`prd/_data-models.md`** — All entity TypeScript interfaces & relationships (single source of truth)
- **`prd/_shared-components.md`** — Reusable component specs (DataTable, FormDialog, TimeGrid24hr, etc.)
- **`prd/_shared-utilities.md`** — Shared utils & business logic specs
- **`prd/modules/`** — Individual module PRDs (14 modules, Phases 2–6)

### Build Order
Phase 2 (Admin Setup): locations → charge-codes → job-roles → users
Phase 3 (Auth & Nav): auth → navigation
Phase 4 (Core): user-shifts → time-sessions → overtime
Phase 5 (Reporting): time-sheets → overtime-requests → employees → summary-sheet
Phase 6 (Notifications): alerts

## Current Project Status

**Phase 1**: Baseline Structure (Complete ✅)
**Phase 2**: Admin Setup (In Progress)

### What's Implemented
- npm workspaces with frontend and server packages
- Vite + React 18 + TypeScript + Zustand + React Router
- Express + TypeScript + security middleware (helmet, cors, compression)
- Core infrastructure: API client, global state, routing
- Home page with navigation layout
- TypeScript configured for both frontend and server
- Path aliases for clean imports (`@/`, `@core/`, etc.)
- PRD documentation structure (all 14 module PRDs + foundation docs)
- Navigation config (`src/core/routing/navigationConfig.ts`) — single source of truth for all nav items
- Sidebar: 3-section structure (Time Keeping / Reporting / Setup), collapsible, active state highlighting
- All routes registered in `App.tsx` (placeholders for unbuilt modules)
- Shared components (view layer): PageHeader, StatusBadge, ConfirmDialog, FormDialog, StatCard, DataTable, FilterBar, TimeGrid24hr
- **2a Locations** (view layer): LocationsPage, LocationFormDialog — CRUD with mock data
- **2b Charge Codes** (view layer): ChargeCodesPage, ChargeCodeFormDialog — CRUD with mock data
- **2c Job Roles** (view layer): JobRolesPage, JobRoleFormDialog — CRUD + sortOrder reordering with Up/Down buttons
- **2d Users** (view layer): UsersPage, UserFormDialog, UserProfilePage — CRUD + FilterBar + PIN + multi-location assignment
- **4a User Shifts** (view layer): UserShiftsPage, ShiftFormDialog — weekly TimeGrid24hr per day, employee selector, shift chips
- **4b Time Sessions** (view layer): TimeSessionsPage, TimeEntryList, TimeEntryFormDialog, SessionHistoryPage — StatCards, entry CRUD, submit flow, history with filters

### Running the Project
```bash
# Install dependencies
npm install

# Run both frontend and server
cd frontend && npm run dev    # Frontend on http://localhost:3000
cd server && npm run dev      # Server on http://localhost:3001
```

### File Structure (Implemented)
```
frontend/src/
├── core/
│   ├── api/           # API client with CRUD methods
│   ├── state/         # Global Zustand store (theme, sidebar, navigationMode)
│   └── routing/
│       ├── navigationConfig.ts  # ← Single source of truth for all nav items
│       └── routes.ts            # Route-to-component mapping (App.tsx)
├── shared/
│   └── components/
│       ├── layout/    # MainLayout (AppBar + Sidebar/Tiles + Footer)
│       └── navigation/  # Sidebar, NavigationTile, NavigationTiles
└── modules/
    ├── home/          # Home page (tile mode + sidebar mode)
    ├── locations/     # 2a — LocationsPage, LocationFormDialog (view layer ✅)
    ├── chargeCodes/   # 2b — ChargeCodesPage, ChargeCodeFormDialog (view layer ✅)
    ├── jobRoles/      # 2c — JobRolesPage, JobRoleFormDialog (view layer ✅)
    ├── users/         # 2d — UsersPage, UserFormDialog, UserProfilePage (view layer ✅)
    ├── userShifts/    # 4a — UserShiftsPage, ShiftFormDialog (view layer ✅)
    └── timeSessions/  # 4b — TimeSessionsPage, TimeEntryList, TimeEntryFormDialog, SessionHistoryPage (view layer ✅)

server/src/
├── config/           # Environment configuration
├── modules/          # Feature modules (placeholder)
└── shared/           # Shared utilities (placeholder)
```

---

Last updated: 2026-03-13
**Current strategy**: View layer first across ALL phases before any business logic or API wiring.
**Phase 2 view layer**: ✅ Complete (Locations, Charge Codes, Job Roles, Users)
**Next step**: Phase 4 view layer — Overtime (4c)
**Then**: Phase 5 view layer (Reporting) → Phase 6 (Alerts) → Phase 3 Auth views → API wiring pass
