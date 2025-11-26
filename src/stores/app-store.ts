import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Interface pour l'état de l'application
 */
interface AppState {
  // Thème
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // Paramètres audio
  audioEnabled: boolean
  setAudioEnabled: (enabled: boolean) => void
  
  // Dernière méditation
  lastMeditationDate: string | null
  setLastMeditationDate: (date: string) => void
  
  // Streak de méditation
  meditationStreak: number
  incrementStreak: () => void
  resetStreak: () => void
}

/**
 * Store Zustand pour l'état global de l'application
 * Persisté dans le localStorage
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Thème par défaut : system
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      // Audio activé par défaut
      audioEnabled: true,
      setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
      
      // Pas de dernière méditation
      lastMeditationDate: null,
      setLastMeditationDate: (date) => set({ lastMeditationDate: date }),
      
      // Streak à 0
      meditationStreak: 0,
      incrementStreak: () => set((state) => ({ meditationStreak: state.meditationStreak + 1 })),
      resetStreak: () => set({ meditationStreak: 0 }),
    }),
    {
      name: 'psaumes365-app-storage',
    }
  )
)

