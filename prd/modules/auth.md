# Authentication

## Overview

Authentication provides two login modes: standard login (email/password) for supervisors and admins, and Field Mode (PIN entry) for quick field worker access. Field Mode presents a stripped-down interface showing only Time Sessions and Overtime modules. JWT tokens manage session state.

## Dependencies

- **Data Models**: `User`, `SystemRole`
- **Modules**: users (user accounts must exist)

## User Stories

1. As a supervisor/admin, I want to log in with email and password to access the full system.
2. As a field worker, I want to enter my PIN quickly to start recording time.
3. As any user, I want to stay logged in until I explicitly log out.
4. As a supervisor, I want to switch between standard and field mode views.

## View Layer

### Components

**LoginPage** (`modules/auth/components/LoginPage.tsx`)
- Two tabs or toggle: "Standard Login" | "Field Mode"
- Standard: Email + Password fields, Submit button
- Field Mode: PIN input (4-6 digit numeric keypad-style), Submit button
- App branding/logo at top
- Error messages for invalid credentials

**FieldModeGuard** (`modules/auth/components/FieldModeGuard.tsx`)
- Route wrapper that redirects field mode users away from restricted pages
- Field Mode users can only access: Time Sessions, Overtime, Profile

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/login` | LoginPage | Public |

## Business Logic

### Rules

1. Standard login: email + password validated against server.
2. Field Mode login: PIN matched against user records. PIN must be unique system-wide.
3. JWT token stored in localStorage/memory. Includes: userId, systemRole, isFieldMode.
4. Token expiry: 24 hours (configurable).
5. Field Mode flag persists in token — determines navigation scope.
6. Supervisors/admins can switch to Field Mode from the sidebar (see navigation module).
7. Inactive users (`isActive: false`) cannot log in.
8. Route guards: unauthenticated users redirect to `/login`. Role-based guards for admin pages.

### State

**Store**: `core/state/authStore.ts` (global, not module-scoped)

```typescript
interface AuthState {
  user: User | null
  token: string | null
  isFieldMode: boolean
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  actions: {
    login: (email: string, password: string) => Promise<void>
    loginWithPIN: (pin: string) => Promise<void>
    logout: () => void
    setFieldMode: (enabled: boolean) => void
    refreshUser: () => Promise<void>
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user }` | Public |
| POST | `/api/auth/field-login` | `{ pin }` | `{ token, user }` | Public |
| POST | `/api/auth/logout` | — | `{ success: true }` | Authenticated |
| GET | `/api/auth/me` | — | `User` | Authenticated |

## Acceptance Criteria

- [ ] Users can log in with email/password
- [ ] Field workers can log in with PIN
- [ ] Invalid credentials show clear error messages
- [ ] JWT token is stored and sent with subsequent requests
- [ ] Inactive users cannot log in
- [ ] Unauthenticated users are redirected to login
- [ ] Field Mode restricts navigation to Time Sessions + Overtime
- [ ] Logout clears token and redirects to login
- [ ] Theme-consistent styling (Chronos Indigo)
- [ ] Mobile-optimized PIN entry
