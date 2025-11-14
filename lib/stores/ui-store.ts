import { create } from 'zustand';

interface UIState {
  isSignInModalOpen: boolean;
  signInPromptMessage: string | null;
  isCreateSpotModalOpen: boolean;
  isProfileModalOpen: boolean;

  openSignInModal: (message?: string) => void;
  closeSignInModal: () => void;
  openCreateSpotModal: () => void;
  closeCreateSpotModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSignInModalOpen: false,
  signInPromptMessage: null,
  isCreateSpotModalOpen: false,
  isProfileModalOpen: false,

  openSignInModal: (message) => set({
    isSignInModalOpen: true,
    signInPromptMessage: message || null
  }),

  closeSignInModal: () => set({
    isSignInModalOpen: false,
    signInPromptMessage: null
  }),

  openCreateSpotModal: () => set({ isCreateSpotModalOpen: true }),
  closeCreateSpotModal: () => set({ isCreateSpotModalOpen: false }),

  openProfileModal: () => set({ isProfileModalOpen: true }),
  closeProfileModal: () => set({ isProfileModalOpen: false }),
}));
