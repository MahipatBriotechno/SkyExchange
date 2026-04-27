import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FullMarketCricket.css';
import BetSlip from '../components/BetSlip';
import Layout from '../components/Layout';
import { marketController } from '../controllers';
import { useAuthStore } from '../store/authStore';

const EventDetailedPage = () => {
  const { sport, matchId } = useParams();
  const navigate = useNavigate();
  const { loginToken, isLoggedIn } = useAuthStore();
  
  const [selectedBet, setSelectedBet] = useState(null);
  const [activeInns, setActiveInns] = useState(1);
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scoreboardHtml, setScoreboardHtml] = useState(null);
  const pollingRef = useRef(null);

  const fetchGameData = async () => {
    try {
      setIsLoading(true);
      let res;
      if (isLoggedIn && loginToken) {
        console.log('Calling getGameDataLogin for gid:', matchId);
        res = await marketController.getGameDataLogin(loginToken, matchId);
      } else {
        console.log('Calling getGameData for gid:', matchId);
        res = await marketController.getGameData(matchId);
      }

      if (res && !res.error) {
        let parsed = typeof res === 'string' ? JSON.parse(res) : res;
        // Handle nested "0" key common in this API
        if (parsed && parsed["0"]) parsed = parsed["0"];
        setGameData(parsed);
      } else {
        console.error('API Error:', res?.msg || 'Unknown error');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavourite = async () => {
    if (!isLoggedIn || !loginToken) {
      alert('Please login to add to favourites');
      return;
    }

    try {
      // Correct extraction of EID as per betting-pwa logic
      const eidToUse = gameData?.events?.['0']?.eid || 
                      gameData?.events?.[0]?.eid ||
                      gameData?.Event_Id || 
                      gameData?.eventid || 
                      gameData?.eid || 
                      matchId;

      console.log('Toggling favourite for EID:', eidToUse);
      const res = await marketController.toggleFavourite(loginToken, eidToUse.toString());
      if (res && res.error === '0') {
        alert(res.msg || 'Favourite updated');
      } else {
        alert(res?.msg || 'Failed to update favourite');
      }
    } catch (err) {
      console.error('Favourite error:', err);
    }
  };

  useEffect(() => {
    if (matchId) {
      fetchGameData();
    }
  }, [matchId, isLoggedIn, loginToken]);

  useEffect(() => {
    if (!matchId || !gameData) return;

    let isMounted = true;
    const pollScoreboard = async () => {
      try {
        // We find the primary market (usually Match Odds) to poll rates for scoreboard
        const primaryMarket = (gameData.ODDS && (gameData.ODDS[0] || Object.values(gameData.ODDS)[0])) || 
                            (gameData.marketData && gameData.marketData.matchOdds?.[0]) ||
                            (gameData.events && (gameData.events[0] || Object.values(gameData.events)[0]));
        
        if (!primaryMarket && !matchId) return;

        // Precise ID logic matching betting-pwa
        const mid = (primaryMarket?.MarketId?.toString().startsWith('1.') || primaryMarket?.marketid?.toString().startsWith('1.'))
          ? (primaryMarket?.MarketId || primaryMarket?.marketid)
          : (primaryMarket?.eid || primaryMarket?.MarketId || primaryMarket?.marketid || matchId);
        
        if (!mid) return;

        const res = await marketController.getGameRate({
          gid: matchId,
          MarketId: mid.toString(),
          eventid: gameData.Event_Id || gameData.eventid || matchId,
          gkey: primaryMarket?.gkey || '',
          ekey: primaryMarket?.ekey || ''
        });

        if (res && !res.error) {
          // Recursive search for scoreboard HTML to be 100% sure we find it
          const findHtml = (obj, depth = 0) => {
            if (!obj || typeof obj !== 'object' || depth > 3) return null;
            
            // Priority keys for scoreboard
            const priorityKeys = ["2", "1", "3", 2, 1, 3];
            for (const k of priorityKeys) {
              const val = obj[k];
              if (val && typeof val === 'string' && (val.includes('<div') || val.includes('<style'))) {
                return val;
              }
            }

            // Depth search
            for (const key in obj) {
              if (obj[key] && typeof obj[key] === 'object') {
                const result = findHtml(obj[key], depth + 1);
                if (result) return result;
              }
            }
            return null;
          };

          const foundHtml = findHtml(res);
          if (foundHtml && isMounted) {
            setScoreboardHtml(foundHtml);
          }
        }
      } catch (err) {
        console.error('Scoreboard poll error:', err);
      }

      if (isMounted) {
        pollingRef.current = setTimeout(pollScoreboard, 333);
      }
    };

    pollScoreboard();
    return () => {
      isMounted = false;
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, [matchId, gameData]);

  const handleBetClick = (runner, type, price, market = 'Match Odds') => {
    setSelectedBet({
      runner,
      type,
      price,
      market
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#666', fontWeight: 'bold' }}>
          Loading Event Details...
        </div>
      </Layout>
    );
  }

  // Fallback for UI if API fails or returns empty for now
  const displayMarketData = gameData?.marketData || {
    matchOdds: [
      { id: 144197, name: gameData?.Team1 || 'Canada', back: [{ price: 3.8, size: '2,348' }, { price: 3.75, size: '553K' }, { price: 3.7, size: '114K' }], lay: [{ price: 3.85, size: '44,497' }, { price: 3.9, size: '523K' }, { price: 3.95, size: '431K' }] },
      { id: 247650, name: gameData?.Team2 || 'United Arab Emirates', back: [{ price: 1.35, size: '1.49M' }, { price: 1.34, size: '1.31M' }, { price: 1.33, size: '792K' }], lay: [{ price: 1.36, size: '1.4M' }, { price: 1.37, size: '321K' }, { price: 1.38, size: '579K' }] }
    ],
    winTheToss: [],
    lineMarket: []
  };

  return (
    <Layout>
      <div className="full-market-container cricket-market">
        {/* Sidebar Navigation - Precise Levels */}
        <aside className="market-sidebar">
          <div className="sidebar-header">Sports</div>
          <nav className="sidebar-nav">
            <div className="nav-item level-sports">All Sports</div>
            <div className="nav-item level-cricket" style={{ textTransform: 'capitalize' }}>{sport || 'Cricket'}</div>
            <div className="nav-item level-competition">{gameData?.Competition || 'ICC Men\'s T20 World Cup'}</div>
            <div className="nav-item level-match">{gameData?.Game_name || `${gameData?.Team1} v ${gameData?.Team2}`}</div>
            <div className="nav-item level-market">Match Odds</div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="market-main-content">
          {/* Scoreboard Section - Only visible when data is ready */}
          {scoreboardHtml && (
            <section className="scoreboard-section">
              <div 
                className="dynamic-scoreboard-wrapper"
                dangerouslySetInnerHTML={{ __html: scoreboardHtml }} 
              />
            </section>
          )}

          {/* Center Control Bar */}
          <div className="market-control-bar">
            <div className="control-bar-inner">
              <div className="icon-btn" title="Pin Market" onClick={handleToggleFavourite}>
                <i className="icon-pin"></i>
              </div>
              <div className="icon-btn" title="Refresh Odds" onClick={fetchGameData}>
                <i className="icon-refresh"></i>
              </div>
            </div>
          </div>

          {/* Market Odds Table */}
          <div className="market-section">
            <div className="market-header-bar">
              <h3>Match Odds <span className="tag-inplay">In-Play</span></h3>
              <div className="matched-info">
                <div className="max-pill">Max {gameData?.MaxLimit || '8000'}</div>
                <div className="matched-amount">Matched: <strong>PTH {gameData?.MatchedAmount || '676,571,907'}</strong></div>
                <div className="btn-live-tv">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="white" style={{marginRight: '4px'}}>
                    <path d="M14.5 2h-13C.7 2 0 2.7 0 3.5v9c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-9c0-.8-.7-1.5-1.5-1.5zM14 12H2V4h12v8zM5 10l6-3-6-3v6z"/>
                  </svg>
                  Live
                </div>
              </div>
            </div>

            <table className="odds-table">
              <thead>
                <tr className="odds-header-labels">
                  <th className="runner-col" style={{ textAlign: 'left', paddingLeft: '15px' }}>{displayMarketData.matchOdds.length} selections</th>
                  <th colSpan="3"><div className="back-header-pill" style={{ margin: '0 auto' }}>Back all</div></th>
                  <th colSpan="3"><div className="lay-header-pill" style={{ margin: '0 auto' }}>Lay all</div></th>
                </tr>
              </thead>
              <tbody>
                {displayMarketData.matchOdds.map((runner) => (
                  <tr key={runner.id} className="runner-row">
                    <td className="runner-info-cell">
                      <span className="runner-name">{runner.name}</span>
                    </td>
                    {runner.back?.slice().reverse().map((b, i) => (
                      <td key={`b-${i}`} className={`odds-cell back-${3 - i}`} onClick={() => handleBetClick(runner.name, 'Back', b.price)}>
                        <span className="price">{b.price || '-'}</span>
                        <span className="size">{b.size || ''}</span>
                      </td>
                    ))}
                    {runner.lay?.map((l, i) => (
                      <td key={`l-${i}`} className={`odds-cell lay-${i + 1}`} onClick={() => handleBetClick(runner.name, 'Lay', l.price)}>
                        <span className="price">{l.price || '-'}</span>
                        <span className="size">{l.size || ''}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bookmaker Market Section */}
          <div className="market-section">
            <div className="market-section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="add-pin">☆</span>
                <span>Bookmaker Market</span>
              </div>
              <span className="comm-tag">Zero Commission</span>
            </div>
            <div className="market-sub-labels">
              <div className="label-box">Min</div>
              <div className="label-val">5.00</div>
              <div className="label-box">Max</div>
              <div className="label-val">39,219.00</div>
            </div>
            <div className="market-sub-head" style={{ background: '#f5f5f5' }}>
              <h4>Bookmaker</h4>
            </div>
            <table className="odds-table bookmaker-table">
              <thead>
                <tr className="odds-header-labels">
                  <th className="runner-col"></th>
                  <th colSpan="3">Back</th>
                  <th colSpan="3">Lay</th>
                </tr>
              </thead>
              <tbody>
                <tr className="runner-row">
                  <td className="runner-info-cell"><span className="runner-name">{gameData?.Team1 || 'Canada'}</span></td>
                  <td colSpan="6" style={{ padding: '0' }}>
                    <div className="suspend-overlay">Suspend</div>
                  </td>
                </tr>
                <tr className="runner-row">
                  <td className="runner-info-cell"><span className="runner-name">{gameData?.Team2 || 'United Arab Emirates'}</span></td>
                  <td className="odds-cell back-3"></td>
                  <td className="odds-cell back-2"></td>
                  <td className="odds-cell back-1">
                    <span className="price">35</span>
                  </td>
                  <td className="odds-cell lay-1">
                    <span className="price">37</span>
                  </td>
                  <td className="odds-cell lay-2"></td>
                  <td className="odds-cell lay-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Win The Toss Section */}
          {displayMarketData.winTheToss?.length > 0 && (
            <div className="market-section">
              <div className="market-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="add-pin">☆</span>
                  <span>Win The Toss</span>
                </div>
                <span className="comm-tag">Zero Commission</span>
              </div>
              <div className="market-sub-labels">
                <div className="label-box">Min</div>
                <div className="label-val">10.00</div>
                <div className="label-box">Max</div>
                <div className="label-val">5,000.00</div>
              </div>
              <table className="odds-table">
                <thead>
                  <tr className="odds-header-labels">
                    <th className="runner-col" style={{ textAlign: 'left', paddingLeft: '15px' }}>2 selections</th>
                    <th colSpan="3"><div className="back-header-pill" style={{ margin: '0 auto' }}>Back all</div></th>
                    <th colSpan="3"><div className="lay-header-pill" style={{ margin: '0 auto' }}>Lay all</div></th>
                  </tr>
                </thead>
                <tbody>
                  {displayMarketData.winTheToss.map((runner) => (
                    <tr key={runner.id} className="runner-row">
                      <td className="runner-info-cell"><span className="runner-name">{runner.name}</span></td>
                      {runner.back?.slice().reverse().map((b, i) => (
                        <td key={`b-${i}`} className={`odds-cell back-${3 - i}`} onClick={() => handleBetClick(runner.name, 'Back', b.price, 'Win The Toss')}>
                          <span className="price">{b.price || '-'}</span>
                          <span className="size">{b.size || ''}</span>
                        </td>
                      ))}
                      {runner.lay?.map((l, i) => (
                        <td key={`l-${i}`} className={`odds-cell lay-${i + 1}`} onClick={() => handleBetClick(runner.name, 'Lay', l.price, 'Win The Toss')}>
                          <span className="price">{l.price || '-'}</span>
                          <span className="size">{l.size || ''}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* Right Sidebar - BetSlip */}
        <aside className="betslip-sidebar">
          <div className="betslip-header">Bet Slip</div>
          <BetSlip selectedBet={selectedBet} setSelectedBet={setSelectedBet} />
        </aside>
      </div>
    </Layout>
  );
};

export default EventDetailedPage;
