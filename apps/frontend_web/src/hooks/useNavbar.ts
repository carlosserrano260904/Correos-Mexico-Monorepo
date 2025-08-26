// src/hooks/useNavbar.ts
'use client';

import { useEffect } from 'react';
import { useNavbarStore } from '@/stores/useNavbarStore';
import { useAuthStore } from '@/stores/useAuthStore';

export const useNavbar = () => {
  const {
    displayName,
    displayPhone,
    avatarUrl,
    isMenuOpen,
    updateUserDisplay,
    toggleMenu,
    setMenuOpen,
    refreshUserData
  } = useNavbarStore();

  const { isAuthenticated, user, profile } = useAuthStore();

  // Update navbar display when auth state changes
  useEffect(() => {
    updateUserDisplay();
  }, [isAuthenticated, user?.id, profile?.id, profile?.nombre, profile?.apellido, profile?.avatar, profile?.telefono]);

  // Listen for profile update events
  useEffect(() => {
    const handleProfileUpdate = () => {
      setTimeout(() => {
        refreshUserData();
      }, 100);
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [refreshUserData]);

  return {
    // User display data
    displayName,
    displayPhone,
    avatarUrl,
    
    // Menu state
    isMenuOpen,
    toggleMenu,
    setMenuOpen,
    
    // Auth state
    isAuthenticated,
    
    // Actions
    refreshUserData,
    
    // Helper functions
    getInitials: () => {
      if (!displayName || displayName === 'Usuario') {
        return 'U';
      }
      
      const names = displayName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      
      return displayName.slice(0, 2).toUpperCase();
    },
    
    hasRealUserData: () => {
      return displayName !== 'Usuario' && displayPhone !== 'No disponible';
    }
  };
};