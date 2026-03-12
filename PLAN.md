# Enterprise Web Application Baseline Plan

## Context

Building a large-scale enterprise web application incrementally with:
- **Frontend**: React 18+ with TypeScript
- **Backend**: Node.js with Express
- **Architecture**: Layered architecture with view layer first, logic layer decoupled
- **Approach**: Incremental module-by-module development
- **State Management**: Zustand (lightweight, scalable)
- **Package Manager**: npm (workspace-based monorepo)
- **API Style**: REST over HTTP

## Phase 1: Project Baseline Structure

### Goals
- Set up monorepo structure with frontend/ and server/ directories
- Configure TypeScript for both frontend and server
- Set up build tools (Vite for frontend, ts-node/nodemon for server)
- Establish naming conventions and folder structure

### Directory Structure
```
timekeeping/
├── CLAUDE.md                    # Project context and conventions
├── .gitignore
├── package.json                 # Root package with npm workspaces
├── frontend/                    # React SPA
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts          # Build tool
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx            # Entry point
│   │   ├── App.tsx             # Root component
│   │   ├── App.css             # Global styles
│   │   ├── core/               # Core infrastructure
│   │   │   ├── routing/        # Router setup
│   │   │   ├── state/          # Global state (Zustand)
│   │   │   └── api/            # API client placeholder
│   │   ├── modules/            # Feature modules
│   │   └── shared/             # Shared UI components
│   └── public/
└── server/                      # Node.js + Express API
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    └── src/
        ├── index.ts            # Entry point
        ├── app.ts              # Express app setup
        ├── config/             # Configuration
        ├── modules/            # Feature modules
        └── shared/             # Shared utilities
```

### Key Files to Create

1. **Root package.json** - npm workspace configuration
2. **CLAUDE.md** - Project context, naming conventions, and architectural decisions
3. **Frontend**:
   - Vite + React + TypeScript + Zustand setup
   - React Router for SPA navigation
   - CSS modules with enterprise naming
   - Basic folder structure
4. **Server**:
   - Express + TypeScript
   - Basic middleware (cors, helmet, compression)
   - Health check endpoint
   - Project structure

## Phase 2: View Layer

### Goals
- Build UI components that manage their own state
- No business logic yet - just presentation
- Establish component patterns and state management approach

### State Management with Zustand
```typescript
// Global store example
import { create } from 'zustand'

interface AppState {
  // Global state here (theme, auth)
}
```

## Phase 3: Logic Layer (Business Rules)

### Goals
- Decouple business logic from UI
- Create services/hooks that contain business rules
- View layer consumes logic through hooks

## Phase 4: Server Implementation

### Goals
- Build RESTful API endpoints
- Connect to database (placeholder initially)
- CORS and security setup
- Environment-based configuration

## Phase 5: Integration

### Goals
- Connect frontend logic layer to backend API
- Handle loading states and errors
- Full end-to-end flow working

## Immediate Next Steps

1. **Move plan file** to project root (`timekeeping/PLAN.md`)
2. Create **CLAUDE.md** in project root for architectural conventions
3. Set up root package.json with npm workspaces
4. Initialize frontend with Vite + React + TS + Zustand
5. Initialize server with Express + TS
6. Create view layer folder structure

## File Locations

- **PLAN.md**: `C:\workProjects\timekeeping\PLAN.md` (project plan, version controlled)
- **CLAUDE.md**: `C:\workProjects\timekeeping\CLAUDE.md` (project conventions for agents)

## Dependencies

### Frontend
- react ^18.x
- react-dom ^18.x
- react-router-dom ^6.x
- zustand ^4.x
- vite ^5.x
- typescript ^5.x

### Server
- express ^4.x
- cors, helmet, compression
- dotenv
- typescript, ts-node, nodemon

---

**Status**: Phase 1 Complete ✅ - Ready for Phase 2
**Completed**:
- Monorepo structure with npm workspaces
- Frontend: React 18 + TypeScript + Vite + React Router + Zustand
- Server: Express + TypeScript with security middleware
- Core infrastructure: API client, state management, routing
- Home module with basic layout and navigation

**Next**: Phase 2 - View Layer (build UI components with presentation-only state)
