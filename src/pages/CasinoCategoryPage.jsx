import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Layout, { useVirtualCricket } from '../components/Layout';
import { casinoController } from '../controllers/casino/casinoController';
import { useAuthStore } from '../store/authStore';
import { useCasinoStore } from '../store/casinoStore';

const CasinoCategoryPage = () => {
  const { categorySlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { games, setGames, loading, setLoading } = useCasinoStore();

  const { isLoggedIn, loginToken } = useAuthStore();
  const { handleOpenCasinoGame } = useVirtualCricket() || {};

  useEffect(() => {
    const fetchGames = async () => {
      if (games.length > 0) return;
      try {
        setLoading(true);
        const res = await casinoController.getCasinoGames();
        setGames(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Failed to fetch games:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [games.length, setGames, setLoading]);

  // Derived filter from slug if not provided in location state
  const currentFilter = useMemo(() => {
    if (location.state?.filter) return location.state.filter;
    
    // Fallback: try to find a provider or game that matches the slug
    // This is useful for direct navigation
    const slugLower = categorySlug.toLowerCase().replace(/-/g, '');
    
    // 1. Try to find a matching provider
    const uniqueProviders = [...new Set(games.map(g => g.provider))];
    const matchedProvider = uniqueProviders.find(p => 
      p?.toLowerCase().replace(/\s+/g, '').replace(/[^\w-]/g, '') === slugLower
    );
    if (matchedProvider) return { provider: matchedProvider };

    // 2. Otherwise treat it as a name search
    return { name: categorySlug.replace(/-/g, ' ') };
  }, [categorySlug, location.state, games]);

  const filteredGames = useMemo(() => {
    let result = games;
    
    if (currentFilter.provider) {
      result = result.filter(g => g.provider === currentFilter.provider);
    } else if (currentFilter.name) {
      const target = currentFilter.name.toLowerCase().replace(/\s/g, '');
      result = result.filter(g => {
        const gName = (g.name || '').toLowerCase().replace(/\s/g, '');
        return gName.includes(target);
      });
    }
    
    return result;
  }, [games, currentFilter]);

  const pageTitle = currentFilter.provider || currentFilter.name || 'Casino Games';

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
        {/* Header/Breadcrumb */}
        <div className="bg-[#253845] text-white p-3 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate(-1)}
                className="p-1 hover:bg-white/10 rounded"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <h1 className="text-sm font-black uppercase tracking-tight">{pageTitle}</h1>
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
              <div className="col-span-full py-20 text-center">
                <div className="mb-4 text-[#253845]/20">
                   <svg className="mx-auto" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </div>
                <p className="text-gray-500 font-bold uppercase text-xs">No games found in this category</p>
                <button 
                  onClick={() => navigate('/casino')}
                  className="mt-4 bg-[#ffb400] text-black text-xs font-bold px-6 py-2 rounded-full uppercase"
                >
                  Back to Casino
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="h-20"></div>
      </div>
    </Layout>
  );
};

const GameCard = ({ game, onLaunch }) => {
  return (
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
};

export default CasinoCategoryPage;
