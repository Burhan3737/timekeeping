import { create } from 'zustand'

type NavigationMode = 'sidebar' | 'tiles'

interface AppState {
  // Global UI state
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
  navigationMode: NavigationMode

  // Actions
  actions: {
    toggleTheme: () => void
    toggleSidebar: () => void
    setTheme: (theme: 'light' | 'dark') => void
    toggleNavigationMode: () => void
    setNavigationMode: (mode: NavigationMode) => void
  }
}

export const useAppStore = create<AppState>()((set, get) => ({
  theme: 'light',
  sidebarCollapsed: false,
  navigationMode: 'tiles',

  actions: {
    toggleTheme: () => {
      const newTheme = get().theme === 'light' ? 'dark' : 'light'
      set({ theme: newTheme })
    },
    toggleSidebar: () => {
      set({ sidebarCollapsed: !get().sidebarCollapsed })
    },
    setTheme: (theme) => set({ theme }),
    toggleNavigationMode: () => {
      const newMode = get().navigationMode === 'sidebar' ? 'tiles' : 'sidebar'
      set({ navigationMode: newMode })
    },
    setNavigationMode: (mode) => set({ navigationMode: mode }),
  },
}))

// Selector hooks for better performance
export const useTheme = () => useAppStore((state) => state.theme)
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed)
export const useNavigationMode = () => useAppStore((state) => state.navigationMode)
export const useAppActions = () => useAppStore((state) => state.actions)
