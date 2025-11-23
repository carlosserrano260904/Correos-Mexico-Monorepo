// components/profile/UserProfile.tsx
'use client';

import React, { useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { profile, isLoading, error, fetchProfile } = useProfile();

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#DE1484] rounded-full flex items-center justify-center text-white font-medium text-sm">
        {profile?.avatar ? (
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          profile?.name?.charAt(0).toUpperCase() || 'U'
        )}
      </div>
      <div className="flex-col">
        <div className="font-semibold text-sm sm:text-base">
          {profile?.name || 'Usuario'}
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          {profile?.email || 'user@example.com'}
        </div>
      </div>
    </div>
  );
};