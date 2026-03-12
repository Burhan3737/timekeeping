# CLAUDE.md - Project Conventions

## Project Overview

Enterprise web application for timekeeping/time tracking built with React 18+ and Node.js/Express.

## Architecture

### Layered Architecture
1. **View Layer**: React components (presentational only)
2. **Logic Layer**: Business rules in services/hooks (decoupled from UI)
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

## Current Project Status

**Phase**: 1 - Baseline Structure (Complete ✅)

### What's Implemented
- npm workspaces with frontend and server packages
- Vite + React 18 + TypeScript + Zustand + React Router
- Express + TypeScript + security middleware (helmet, cors, compression)
- Core infrastructure: API client, global state, routing
- Home page with navigation layout
- TypeScript configured for both frontend and server
- Path aliases for clean imports (`@/`, `@core/`, etc.)

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
│   ├── state/         # Global Zustand store (theme, sidebar)
│   └── routing/       # Route configuration
├── shared/
│   └── components/    # MainLayout with nav and footer
└── modules/
    └── home/          # Home page with feature cards

server/src/
├── config/           # Environment configuration
├── modules/          # Feature modules (placeholder)
└── shared/           # Shared utilities (placeholder)
```

---

Last updated: 2026-03-12
**Current Phase**: Phase 2 - View Layer (in progress)
