import { create } from 'zustand';

type UIState = {
  isServiceModalOpen: boolean;
  toggleModal: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isServiceModalOpen: false,
  toggleModal: () => set((state) => ({ isServiceModalOpen: !state.isServiceModalOpen })),
}));
