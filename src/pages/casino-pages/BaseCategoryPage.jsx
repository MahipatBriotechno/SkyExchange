import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout, { useVirtualCricket } from '../../components/Layout';
import { casinoController } from '../../controllers/casino/casinoController';
import { useAuthStore } from '../../store/authStore';
import { useCasinoStore } from '../../store/casinoStore';

const BaseCategoryPage = ({ filter, title }) => {
  const navigate = useNavigate();
  const { games, setGames, loading, setLoading } = useCasinoStore();
  const { isLoggedIn } = useAuthStore();
  const { handleOpenCasinoGame } = useVirtualCricket() || {};

  useEffect(() => {
    const fetchGames = async () => {
      if (games.length > 0) return;
      try {
        setLoading(true);
        const res = await casinoController.getCasinoGames('ALL');
        setGames(res);
      } catch (err) {
        console.error('Failed to fetch games:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [games.length, setGames, setLoading]);

  const filteredGames = useMemo(() => {
    let result = games;
    
    if (filter.provider) {
      result = result.filter(g => g.provider === filter.provider);
    } else if (filter.name) {
      const target = filter.name.toLowerCase().replace(/\s/g, '');
      result = result.filter(g => {
        const gName = (g.name || '').toLowerCase().replace(/\s/g, '');
        return gName.includes(target);
      });
    }
    
    return result;
  }, [games, filter]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-[#ffb400] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="casino-category-page bg-[#eee] min-h-screen">
        <div className="bg-[#253845] text-white p-3 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/')}
                className="p-1 hover:bg-white/10 rounded"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <h1 className="text-sm font-black uppercase tracking-tight">{title}</h1>
            </div>
            <span className="text-[10px] font-bold text-[#ffb400] uppercase bg-black/20 px-2 py-1 rounded">
              {filteredGames.length} Games
            </span>
          </div>
        </div>

        <div className="p-2 md:p-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4">
            {filteredGames.map(game => (
              <GameCard 
                key={game.game_code} 
                game={game} 
                onLaunch={() => handleOpenCasinoGame && handleOpenCasinoGame(game)} 
              />
            ))}
            {filteredGames.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase text-xs">
                No games found for {title}
              </div>
            )}
          </div>
        </div>
        <div className="h-20"></div>
      </div>
    </Layout>
  );
};

const GameCard = ({ game, onLaunch }) => (
  <div 
    onClick={onLaunch}
    className="relative group bg-white rounded-md overflow-hidden shadow-sm border border-black/5 cursor-pointer active:scale-95 transition-all w-full aspect-[3/4]"
  >
    <img 
      src={game.image?.startsWith('/drmicon/') ? game.image : `/drmicon/${game.image}`}
      alt={game.name}
      className="w-full h-full object-cover pointer-events-none"
      loading="lazy"
      onError={(e) => {
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=253845&color=fff&size=128`;
      }}
    />
    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
      <button className="bg-[#ffb400] text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter">
        Play Now
      </button>
    </div>
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pointer-events-none">
      <p className="text-[9px] md:text-[10px] font-bold text-white truncate leading-tight">{game.name}</p>
      <p className="text-[7px] md:text-[8px] font-medium text-white/60 uppercase tracking-tighter">{game.provider}</p>
    </div>
  </div>
);

export default BaseCategoryPage;
