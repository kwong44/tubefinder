'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { createClient } from '@/lib/services/supabase-client';
import { User, LogOut, Heart, MapPin } from 'lucide-react';
import UserProfileModal from './UserProfileModal';

interface UserMenuProps {
  onSignInClick: () => void;
}

export default function UserMenu({ onSignInClick }: UserMenuProps) {
  const { user, loading } = useAuthStore();
  const { isProfileModalOpen, openProfileModal, closeProfileModal } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const supabase = createClient();

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={onSignInClick}
        className="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition font-medium text-sm"
      >
        Sign In
      </button>
    );
  }

  // Get user initials from email
  const initials = user.email
    ?.split('@')[0]
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9 rounded-full bg-ocean-600 text-white flex items-center justify-center font-semibold text-sm hover:bg-ocean-700 transition"
        aria-label="User menu"
      >
        {initials}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[1000]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[1001]">
            {/* User info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Signed in
              </p>
            </div>

            {/* Menu items */}
            <div className="py-2">
              <button
                onClick={() => {
                  // TODO: Navigate to favorites
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
              >
                <Heart className="h-4 w-4" />
                My Favorites
                <span className="ml-auto text-xs text-gray-500">Coming soon</span>
              </button>

              <button
                onClick={() => {
                  // TODO: Navigate to my spots
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
              >
                <MapPin className="h-4 w-4" />
                My Spots
                <span className="ml-auto text-xs text-gray-500">Coming soon</span>
              </button>

              <button
                onClick={() => {
                  openProfileModal();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
              >
                <User className="h-4 w-4" />
                Profile & Settings
              </button>
            </div>

            {/* Sign out */}
            <div className="border-t border-gray-200 pt-2">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </>
      )}

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />
    </div>
  );
}
