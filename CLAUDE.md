# CLAUDE.md - Project Conventions

## Project Knowledge
Tech Stack: React, Typescript, MUI
File Structure/ Architecture:
src/modules/${moduleName}/index.tsx: contains the business logic of the module and handling of module state and side effects (apis etc)
src/modules/${moduleName}/types.ts: contains the interfaces, types to be defined for the module
src/modules/${moduleName}/${moduleNameView}.tsx: view layer of the module, only view related state might be managed here. Can be multiple
src/modules/${moduleName}/utils.tsx: utility functions for the module (only module related logic). Would mostly be imported in the index.js file of the project
src/logic/${logicModuleName.ts}: App specific business logic, rules and core calculations would be written here. It can be used in multiple modules through out the app.
src/shared/components/${reusableComponent}: reusable components which can be used throughout the app will be stored here
src/shared/utils/${utilsFolder or fileName}: shared utility functions/files that can be used through out the app will be stored here (dateUtils, formatters etc)

## Rules
Always remember to use MUI for creating components.
Make sure to keep the UI and theming consistent (you can lookup the ThemeContext for it)
Always follow the defined file/folder structure
Try to make reusable view components (where applicable) which are always consistent with the theme of the the app (buttons) and store them at shared/components/${reusableComponent}
For view layer changes always recommend reusable components stored at shared/components/${reusableComponent} if applicable
Utility functions that you think might be generic and can be used throughout the app (i.e dateUtils) must be stored at shared/utils/${utilsFolder or fileName}
Write as minimal code as possible and DRY!
No fancy architecture that confuses new developers.
You need to to follow the defined folder/file structure.
The src/context folder consists of all the states that need to persist globally throughout the app. So you need to use them if when required rather than creating new ones.
When in plan mode, always explain your solution thoroughly and ask follow up questions to explain your plan.
When in plan mode, mention all changes required to the files so the human engineer can review them before you actually implement them.
Any rules that are recurrent and defined by the user in the prompts needs to be added into the CLAUDE.md file under the rules section.
Specifically use the frontend-design skill while creating view components
Use any other skill to improve your productivity.
As the project will start to expand we need to store the core context in CLAUDE.md/AGENTS.md so each new agent session has all the context. Be sure to keep it concise and compact so it does not consume a lot of tokens

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
