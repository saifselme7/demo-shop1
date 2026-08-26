import { create } from 'zustand'

interface UIState {
  mobileMenuOpen: boolean
  setMobileMenu: (v: boolean) => void
}

export const useUI = create<UIState>((set) => ({
  mobileMenuOpen: false,
  setMobileMenu: (v) => set({ mobileMenuOpen: v }),
}))
