// src/stores/useNavbarStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';

interface NavbarState {
  // User data for navbar display
  displayName: string;
  displayPhone: string;
  avatarUrl: string;
  isMenuOpen: boolean;
  
  // Actions
  updateUserDisplay: () => void;
  toggleMenu: () => void;
  setMenuOpen: (open: boolean) => void;
  
  // Utilities
  refreshUserData: () => void;
}

export const useNavbarStore = create<NavbarState>()(
  devtools(
    (set, get) => ({
      // Initial state
      displayName: 'Usuario',
      displayPhone: 'No disponible',
      avatarUrl: 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
      isMenuOpen: false,
      
      // Update user display data from auth store
      updateUserDisplay: () => {
        const authState = useAuthStore.getState();
        const { user, profile } = authState;
        
        if (!user || !authState.isAuthenticated) {
          set({
            displayName: 'Usuario',
            displayPhone: 'No disponible',
            avatarUrl: 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'
          });
          return;
        }
        
        // Use profile data as priority, fallback to user data
        const firstName = profile?.nombre || user?.nombre || '';
        const lastName = profile?.apellido || user?.apellido || '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
        
        set({
          displayName: fullName || user.correo || 'Usuario',
          displayPhone: profile?.telefono || 'No disponible',
          avatarUrl: profile?.avatar || 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'
        });
      },
      
      // Menu toggle actions
      toggleMenu: () => {
        set((state) => ({ isMenuOpen: !state.isMenuOpen }));
      },
      
      setMenuOpen: (open: boolean) => {
        set({ isMenuOpen: open });
      },
      
      // Force refresh user data
      refreshUserData: () => {
        get().updateUserDisplay();
      }
    }),
    { name: 'NavbarStore' }
  )
);

// Subscribe to auth store changes
useAuthStore.subscribe((state) => {
  // Update navbar when auth state changes
  useNavbarStore.getState().updateUserDisplay();
});