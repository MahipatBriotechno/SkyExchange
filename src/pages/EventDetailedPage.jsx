import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BetSlip from '../components/BetSlip';
import Layout from '../components/Layout';
import EventLayout from '../components/Layout/EventLayout';
import ScoreboardRender from '../components/EventDetailedPage/ScoreboardRender';
import SportCompetition from '../components/EventDetailedPage/SportCompetition';
import OddsTable from '../components/EventDetailedPage/MatchTable/OddsTable';
import BookmakerTable from '../components/EventDetailedPage/MatchTable/BookmakerTable';
import FancyTable from '../components/EventDetailedPage/MatchTable/FancyTable';
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
        <div className="flex justify-center items-center h-[60vh] text-gray-500 font-bold">
          Loading Event Details...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <EventLayout
        left={
          <SportCompetition
            sport={sport}
            competition={gameData?.Competition}
            matchName={gameData?.Game_name || `${gameData?.Team1} v ${gameData?.Team2}`}
          />
        }
        right={
          <div className="h-full flex flex-col">

            <div className="p-1 flex-1 overflow-y-auto">
              <BetSlip selectedBet={selectedBet} setSelectedBet={setSelectedBet} />
            </div>
          </div>
        }
      >
        {/* Middle Main Content */}
        <div className="flex flex-col h-full">
          {/* Scoreboard Section with integrated controls */}
          <ScoreboardRender
            html={scoreboardHtml}
            onPin={handleToggleFavourite}
            onRefresh={fetchGameData}
          />
          <ul className="match-btn flex justify-center">
            <li>
              <a id="liveMultiMarketPin" class="btn-pin"
                title="Add to Multi Markets" onClick={(e) => {
                  e.preventDefault();
                  handleToggleFavourite();
                }}  > </a>
            </li>
            <li>
              <a class="btn-refresh" onClick={(e) => {
                e.preventDefault();
                fetchGameData();
              }}
              > </a>
            </li>
          </ul>
          {/* Market content area */}
          <div className="p-4 flex-1 overflow-y-auto">
            {/* Odds Table */}
            <OddsTable
              marketData={{}}
              onBetClick={(runner, type, price) => handleBetClick(runner, type, price, 'Match Odds')}
            />

            {/* Bookmaker Table */}
            <BookmakerTable
              onBetClick={(runner, type, price) => handleBetClick(runner, type, price, 'Bookmaker')}
            />

            <OddsTable
              marketName="Win The Toss"
              marketData={{}}
              onBetClick={(runner, type, price) => handleBetClick(runner, type, price, 'Win The Toss')}
            />

            <OddsTable
              marketName="Line Market"
              marketData={{}}
              onBetClick={(runner, type, price) => handleBetClick(runner, type, price, 'Line Market')}
            />
            <OddsTable
              marketName="Tied Match"
              marketData={{}}
              onBetClick={(runner, type, price) => handleBetClick(runner, type, price, 'Line Market')}
            />
            <FancyTable />
          </div>
        </div>
      </EventLayout>
    </Layout>
  );
};

export default EventDetailedPage;
