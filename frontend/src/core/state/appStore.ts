import { create } from 'zustand'

interface AppState {
  // Global UI state
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean

  // Actions
  actions: {
    toggleTheme: () => void
    toggleSidebar: () => void
    setTheme: (theme: 'light' | 'dark') => void
  }
}

export const useAppStore = create<AppState>()((set, get) => ({
  theme: 'light',
  sidebarCollapsed: false,

  actions: {
    toggleTheme: () => {
      const newTheme = get().theme === 'light' ? 'dark' : 'light'
      set({ theme: newTheme })
    },
    toggleSidebar: () => {
      set({ sidebarCollapsed: !get().sidebarCollapsed })
    },
    setTheme: (theme) => set({ theme }),
  },
}))

// Selector hooks for better performance
export const useTheme = () => useAppStore((state) => state.theme)
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed)
export const useAppActions = () => useAppStore((state) => state.actions)
