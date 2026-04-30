import { fetchAPI } from '../../utils/api';

export const casinoController = {
  getCasinoGames: (provider = 'ALL') => fetchAPI('/casinolist', { provider }),
  openCasinoGame: (data) => fetchAPI('/csopen', data),
  openSportsbook: (loginToken) => fetchAPI('/sportsbook', { LoginToken: loginToken }),
};
