import { create } from 'zustand';

export const useCasinoStore = create((set) => ({
  games: [],
  loading: false,
  error: null,

  setGames: (res) => {
    let gamesData = [];
    if (Array.isArray(res)) {
      gamesData = res;
    } else if (res && res.data && Array.isArray(res.data)) {
      gamesData = res.data;
    } else if (res && typeof res === 'object') {
      gamesData = Object.values(res).filter(item => item && typeof item === 'object' && item.game_code);
    }
    set({ games: gamesData });
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Helper to get filtered games by provider or partial name
  getFilteredGames: (state, filter) => {
    if (!filter) return [];
    
    if (filter.provider) {
      return state.games.filter(g => g.provider === filter.provider);
    }
    
    if (filter.name) {
      const target = filter.name.toLowerCase().replace(/\s/g, '');
      return state.games.filter(g => {
        const gName = (g.name || '').toLowerCase().replace(/\s/g, '');
        return gName.includes(target);
      });
    }
    
    return [];
  }
}));
