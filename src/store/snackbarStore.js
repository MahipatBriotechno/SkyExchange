import { create } from 'zustand';

export const useSnackbarStore = create((set) => ({
  message: '',
  type: 'success', // 'success' | 'error' | 'info'
  isVisible: false,
  show: (message, type = 'success') => {
    set({ message, type, isVisible: true });
    setTimeout(() => {
      set({ isVisible: false });
    }, 3000);
  },
  hide: () => set({ isVisible: false }),
}));
