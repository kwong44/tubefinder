'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import UserMenu from './auth/UserMenu';
import SignInModal from './auth/SignInModal';
import CreateSpotModal from './spots/CreateSpotModal';
import { useUIStore } from '@/lib/stores/ui-store';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function Header() {
  const {
    isSignInModalOpen,
    openSignInModal,
    closeSignInModal,
    signInPromptMessage,
    isCreateSpotModalOpen,
    openCreateSpotModal,
    closeCreateSpotModal,
  } = useUIStore();
  const { user } = useAuthStore();

  const handleCreateSpotClick = () => {
    if (!user) {
      openSignInModal('Sign in to create your own custom surf spots! 🏄');
      return;
    }
    openCreateSpotModal();
  };

  return (
    <>
      <header className="bg-ocean-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold">🌊</div>
              <h1 className="text-2xl font-bold">Tube Finder</h1>
            </div>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="hover:text-ocean-200 transition">
                  Map
                </Link>
                <Link
                  href="/spots"
                  className="hover:text-ocean-200 transition opacity-50 cursor-not-allowed"
                  onClick={(e) => e.preventDefault()}
                >
                  Spots
                </Link>
                <Link
                  href="/forecast"
                  className="hover:text-ocean-200 transition opacity-50 cursor-not-allowed"
                  onClick={(e) => e.preventDefault()}
                >
                  Forecast
                </Link>
              </nav>
              <button
                onClick={handleCreateSpotClick}
                className="flex items-center gap-2 px-4 py-2 bg-white text-ocean-700 font-medium rounded-lg hover:bg-ocean-50 transition shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Spot</span>
              </button>
              <UserMenu onSignInClick={() => openSignInModal()} />
            </div>
          </div>
        </div>
      </header>

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
        promptMessage={signInPromptMessage}
      />

      <CreateSpotModal
        isOpen={isCreateSpotModalOpen}
        onClose={closeCreateSpotModal}
      />
    </>
  );
}
