import { create } from 'zustand';

interface UIState {
  isSignInModalOpen: boolean;
  signInPromptMessage: string | null;

  openSignInModal: (message?: string) => void;
  closeSignInModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSignInModalOpen: false,
  signInPromptMessage: null,

  openSignInModal: (message) => set({
    isSignInModalOpen: true,
    signInPromptMessage: message || null
  }),

  closeSignInModal: () => set({
    isSignInModalOpen: false,
    signInPromptMessage: null
  }),
}));
