import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import BetSlip from '../components/BetSlip';
import { useAuthStore } from '../store/authStore';
import { marketController } from '../controllers';
import MultiMarketTable from '../components/MultiMarketTable';

function MultiMarketsPage() {
  const navigate = useNavigate();
  const { isLoggedIn, loginToken } = useAuthStore();
  const [favorites, setFavorites] = useState([]);
  const [liveRates, setLiveRates] = useState({});
  const [loading, setLoading] = useState(true);

  // 1. Fetch Followed Markets (Favorites)
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn || !loginToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await marketController.getMultiMarketList(loginToken);
        if (response) {
          let dataArray = [];
          const rawData = response.data || response.list || response.BankList || response;

          if (Array.isArray(rawData)) {
            dataArray = rawData;
          } else if (typeof rawData === 'object' && rawData !== null) {
            if (rawData.eid || rawData.Eid || rawData.MarketId) {
              dataArray = [rawData];
            } else {
              dataArray = Object.values(rawData).filter(v =>
                v && typeof v === 'object' && (v.eid || v.Eid || v.gid || v.Gid || v.MarketId)
              );
            }
          }
          
          setFavorites(dataArray);
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isLoggedIn, loginToken]);

  // 2. Polling for Live Rates
  useEffect(() => {
    if (favorites.length === 0) return;

    const marketIds = favorites
      .map(f => f.MarketId || f.marketid || f.eid || f.Eid || '')
      .filter(id => id !== '')
      .join(',');

    const ids = favorites
      .map(f => {
        const gkey = f.gkey || f.gid || f.Gid || '';
        const ekey = f.ekey || f.eid || f.Eid || f.MarketId || '';
        return { gkey, ekey };
      })
      .filter(id => id.ekey);

    if (ids.length === 0 || !marketIds) return;

    let isMounted = true;
    let timeoutId;

    const pollRates = async () => {
      try {
        const res = await marketController.getMultiMarketRate(marketIds, ids);
        if (res && typeof res === 'object' && isMounted) {
          if (res.error === undefined || res.error === '0') {
            setLiveRates(prev => ({ ...prev, ...res }));
          }
        }
      } catch (err) {
        console.error('Failed to poll multi-market rates:', err);
      }

      if (isMounted) {
        timeoutId = setTimeout(pollRates, 1000);
      }
    };

    pollRates();
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [favorites]);

  const handleToggleFav = async (eid) => {
    if (!loginToken) return;
    try {
      const res = await marketController.toggleFavourite(loginToken, eid);
      // Backend might return success or error field
      if (res.error === '0' || res.status === 'Success' || !res.error) {
        setFavorites(prev => prev.filter(f => (f.eid || f.Eid || f.MarketId) !== eid));
      }
    } catch (err) {
      console.error('Failed to untoggle fav:', err);
    }
  };

  return (
    <Layout>
      <main className="main">
        {/* Left sidebar */}
        <aside className="sidebar sideNav">
          <div className="sideNav__head">Sports</div>
          <div className="sideNav__scroll">
            <Link className="sideNav__item sideNav__item--link" to="/">All Sports</Link>
            <Link className="sideNav__item sideNav__item--link" to="/cricket">Cricket</Link>
            <Link className="sideNav__item sideNav__item--link" to="/football">Football</Link>
            <Link className="sideNav__item sideNav__item--link" to="/tennis">Tennis</Link>
            <Link className="sideNav__item sideNav__item--link" to="/horse-racing">Horse Racing</Link>
            <Link className="sideNav__item sideNav__item--link" to="/greyhound-racing">Greyhound Racing</Link>
            <a className="sideNav__item sideNav__item--link" href="#">Fancybet</a>
            <a className="sideNav__item sideNav__item--link" href="#">Election</a>
          </div>
        </aside>

        {/* Center column */}
        <div className="center">
          <div className="multi-markets-board">
            <h4 className="multi-markets-title">Multi Markets</h4>
            <div className="multi-markets-body" style={{ background: '#f0f0f0', padding: '10px' }}>
              {!isLoggedIn ? (
                <div className="bg-white p-6 text-center border rounded">
                  <p className="text-gray-600 mb-4">Please login to view your multi markets.</p>
                  <button onClick={() => navigate('/')} className="bg-[#243a48] text-white px-6 py-2 rounded font-bold">LOGIN</button>
                </div>
              ) : loading ? (
                <div className="text-center py-10">
                   <p className="text-gray-500 font-bold">Loading followed markets...</p>
                </div>
              ) : favorites.length === 0 ? (
                <div className="bg-white p-4 border rounded">
                   <p className="multi-markets-empty">There are currently no followed multi markets.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {favorites.map((market) => {
                    const mIds = [
                      market.MarketId, market.marketid,
                      market.eid, market.Eid, market.ekey,
                      market.gid, market.Gid, market.gkey
                    ].filter(id => !!id);

                    let marketRate = null;
                    for (const id of mIds) {
                      if (liveRates[id]) {
                        marketRate = liveRates[id];
                        break;
                      }
                    }

                    if (!marketRate) {
                      marketRate = Object.values(liveRates).find((r) =>
                        r && (mIds.includes(r.MarketId) || mIds.includes(r.marketid) || mIds.includes(r.eid) || mIds.includes(r.Eid))
                      );
                    }

                    const staticRunners = Array.isArray(market.runners) ? market.runners : Object.values(market.runners || {});
                    const liveRunnersMap = marketRate?.runners || marketRate?.runner || {};
                    const liveRunners = Array.isArray(liveRunnersMap) ? liveRunnersMap : Object.values(liveRunnersMap);

                    const runnersArray = staticRunners.map((sr, idx) => {
                      const liveData = liveRunners.find((lr) => lr.SelectionId === sr.SelectionId) || liveRunners[idx] || {};
                      return { ...sr, ...liveData };
                    });

                    const matchName = market.name || 
                                     (market.Team1 && market.Team2 ? `${market.Team1} vs ${market.Team2}` : 
                                      market.Event_Name || market.Game_Name || 'Main Market');

                    const sport = (market.Event_Type || market.sport || 'Cricket');

                    return (
                      <MultiMarketTable
                        key={market.eid || market.Eid || market.MarketId}
                        sportName={sport}
                        matchName={matchName}
                        marketName={market.name || 'Winner'}
                        runners={runnersArray}
                        rateData={marketRate || {}}
                        onToggleFav={() => handleToggleFav(market.eid || market.Eid || market.MarketId)}
                        onHeaderClick={() => {
                           const s = sport.toLowerCase();
                           const mid = market.gid || market.Gid || marketRate?.gid || marketRate?.Gid;
                           if (mid) {
                             navigate(`/${s}/${mid}`);
                           } else {
                             // Fallback to MarketId if gid is not available
                             navigate(`/${s}/${market.eid || market.Eid || market.MarketId}`);
                           }
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Bet Slip */}
        <div className="betslip">
          <BetSlip />
        </div>
      </main>
    </Layout>
  );
}

export default MultiMarketsPage;
