import React, { useState, useEffect } from 'react';
import { marketController } from '../controllers';

// All game banners from the original index.html gamehall-wrap-simple section
const gameItems = [
  {
    cls: '',
    title: 'Sports',
    subtitle: 'Play Now',
    img: '/images/banner_sports.png',
    href: '/in-play',
    isInPlay: true,
  },
  {
    cls: 'entrance',
    title: null,
    img: '/images/banner_skyexchangeBlog.png',
    href: 'https://go.wa.link/skyexchange',
    external: true,
  },
  {
    cls: '',
    title: 'Virtual Cricket',
    subtitle: 'Play Now',
    img: '/images/banner_virtualsports.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'EVO',
    subtitle: 'Play Now',
    img: '/images/banner_evo-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Smartsoft',
    subtitle: 'Play Now',
    img: '/images/banner_smartsoft-half.png',
    href: '#',
  },
  {
    cls: '',
    title: 'Royal Gaming',
    subtitle: 'Play Now',
    img: '/images/banner_royalgaming.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'EZUGI',
    subtitle: 'Play Now',
    img: '/images/banner_ezugi-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half mobile-only',
    title: 'SKYCASINO',
    subtitle: 'Play Now',
    img: '/images/banner_skycasino-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Live Casino',
    subtitle: 'Play Now',
    img: '/images/banner_casino-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'AVIATORX',
    subtitle: 'Play Now',
    img: '/images/banner_aviator_xtreme-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Mines',
    subtitle: 'Play Now',
    img: '/images/banner_mines-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'KiteX',
    subtitle: 'Play Now',
    img: '/images/banner_kitex-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Turbo Vortex',
    subtitle: 'Play Now',
    img: '/images/banner_turbo_vortex-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Spribe',
    subtitle: 'Play Now',
    img: '/images/banner_spribe.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Blackjack',
    subtitle: 'Play Now',
    img: '/images/banner_blackjack-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: '7 Up Down',
    subtitle: 'Play Now',
    img: '/images/banner_7up7down-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Andar Bahar VR',
    subtitle: 'Play Now',
    img: '/images/banner_andarBaharVR-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Supernowa',
    subtitle: 'Play Now',
    img: '/images/banner_supernowa-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: '7mojos',
    subtitle: 'Play Now',
    img: '/images/banner_7mojos-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'HORSEBOOK',
    subtitle: 'Play Now',
    img: '/images/banner_horsebook-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Minesweeper',
    subtitle: 'Play Now',
    img: '/images/banner_minesweeper-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Teen Patti',
    subtitle: 'Play Now',
    img: '/images/banner_teenPatti-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Super Over VR',
    subtitle: 'Play Now',
    img: '/images/banner_superOverVR-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'TeenPatti 20-20',
    subtitle: 'Play Now',
    img: '/images/banner_TeenPatti2020-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'NumberKing',
    subtitle: 'Play Now',
    img: '/images/banner_NumberKing-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Big small',
    subtitle: 'Play Now',
    img: '/images/banner_BigSmall-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'TeenPatti Joker',
    subtitle: 'Play Now',
    img: '/images/banner_TeenPattiJoker-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: '7up7down',
    subtitle: 'Play Now',
    img: '/images/mobile/gamehall/banner_7up7down-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Dragon & Tiger',
    subtitle: 'Play Now',
    img: '/images/banner_DragonNTiger-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Auto Roulette',
    subtitle: 'Play Now',
    img: '/images/banner_autoRoulette-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Dus Ka Dum (Cards) VR',
    subtitle: 'Play Now',
    img: '/images/banner_DusKaDumVR-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Callbreak Quick',
    subtitle: 'Play Now',
    img: '/images/banner_CallbreakQuick-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Sic Bo',
    subtitle: 'Play Now',
    img: '/images/banner_SicBo-Jili-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Baccarat',
    subtitle: 'Play Now',
    img: '/images/banner_Baccarat-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Bonus Dice',
    subtitle: 'Play Now',
    img: '/images/banner_BonusDice-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Heist',
    subtitle: 'Play Now',
    img: '/images/banner_Heist-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: '5 Card Poker',
    subtitle: 'Play Now',
    img: '/images/banner_5CardPoker-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Color Game',
    subtitle: 'Play Now',
    img: '/images/banner_ColorGame-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: '32 Cards',
    subtitle: 'Play Now',
    img: '/images/banner_32card-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Rummy',
    subtitle: 'Play Now',
    img: '/images/banner_rummy-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Dragon Tiger',
    subtitle: 'Play Now',
    img: '/images/banner_dragonTiger-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Worli Matka VR',
    subtitle: 'Play Now',
    img: '/images/banner_worliMatkaVR-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'BetGames',
    subtitle: 'Play Now',
    img: '/images/banner_betgames-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Andar Bahar',
    subtitle: 'Play Now',
    img: '/images/banner_andarBahar-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Sicbo',
    subtitle: 'Play Now',
    img: '/images/banner_sicbo-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: '7 UP 7 Down',
    subtitle: 'Play Now',
    img: '/images/banner_sevenUpDown-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Coin Toss',
    subtitle: 'Play Now',
    img: '/images/banner_CoinToss-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Teen Patti (JILI)',
    subtitle: 'Play Now',
    img: '/images/mobile/gamehall/banner_teenPatti-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Card Matka',
    subtitle: 'Play Now',
    img: '/images/banner_cardMatka-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Number Matka',
    subtitle: 'Play Now',
    img: '/images/banner_numberMatka-half.png',
    href: '#',
  },
  {
    cls: 'entrance-half',
    title: 'Bpoker',
    subtitle: 'Play Now',
    img: '/images/mobile/gamehall/banner_bpoker-half.png',
    href: '#',
  },
];

function GameHall() {
  const [matchCounts, setMatchCounts] = useState({
    Cricket: 0,
    Football: 0,
    Tennis: 0
  });

  useEffect(() => {
    const fetchMatchCounts = async () => {
      try {
        const sports = ['Cricket', 'Football', 'Tennis'];
        const res = await marketController.getGameList(sports.join(','));
        
        let matchData = [];
        if (res && res.matches) {
          matchData = res.matches;
        } else if (res && typeof res === 'object') {
          matchData = Object.values(res).filter(v => typeof v === 'object' && v !== null && (v.MarketId || v.marketid || v.Gid || v.gid));
        } else if (Array.isArray(res)) {
          matchData = res;
        }

        const counts = { Cricket: 0, Football: 0, Tennis: 0 };
        const now = new Date();

        const parseDate = (str) => {
          if (!str) return null;
          const dateVal = str.includes('T') ? str : str.replace(' ', 'T');
          let d = new Date(dateVal);
          if (isNaN(d.getTime())) {
            const parts = str.split(/[-/ :]/);
            if (parts.length >= 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const year = parseInt(parts[2], 10);
              if (day <= 31 && month <= 11) {
                const hour = parseInt(parts[3] || '0', 10);
                const minute = parseInt(parts[4] || '0', 10);
                const second = parseInt(parts[5] || '0', 10);
                d = new Date(year, month, day, hour, minute, second);
              }
            }
          }
          return d && !isNaN(d.getTime()) ? d : null;
        };

        matchData.forEach(m => {
          const sport = m.sportname || m.Type || m.sport || 'Other';
          const startTimeStr = m.DateTime || m.dateTime || m.Datetime || m.staredtime || m.StartTime || '';
          const startTime = parseDate(startTimeStr);
          const isWinnerMarket = (m.Game_Type || m.GameType || '').toLowerCase() === 'winner' || 
                               (m.Team2 || '').includes('TOURNAMENT_WINNER');
          
          if ((startTime && startTime <= now) || isWinnerMarket) {
            if (sport === 'Cricket') counts.Cricket++;
            else if (sport === 'Football' || sport === 'Soccer') counts.Football++;
            else if (sport === 'Tennis') counts.Tennis++;
          }
        });

        setMatchCounts(counts);
      } catch (err) {
        console.error('Failed to fetch GameHall match counts:', err);
      }
    };

    fetchMatchCounts();
    const interval = setInterval(fetchMatchCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gamehall-wrap-simple">
      {/* Sports Live Board */}
      <a href="/in-play" style={{ cursor: 'pointer' }}>
        <dl id="onLiveBoard" className="on_live">
          <dt>
            <p className="live_icon"><span></span> LIVE</p>
          </dt>
          <dd id="onLiveCount_CRICKET">
            <p>Cricket</p>
            <span id="count">{matchCounts.Cricket}</span>
          </dd>
          <dd id="onLiveCount_SOCCER">
            <p>Football</p>
            <span id="count">{matchCounts.Football}</span>
          </dd>
          <dd id="onLiveCount_TENNIS">
            <p>Tennis</p>
            <span id="count">{matchCounts.Tennis}</span>
          </dd>
        </dl>
        <dl className="entrance-title">
          <dt>Sports</dt>
          <dd>Play Now</dd>
        </dl>
        <img src="/images/banner_sports.png" alt="" draggable="false" />
      </a>

      {/* Blog */}
      <a className="entrance" href="https://go.wa.link/skyexchange" target="_blank" rel="noreferrer">
        <img src="/images/banner_skyexchangeBlog.png" alt="" draggable="false" />
      </a>

      {/* All other game items */}
      {gameItems.slice(2).map((game, idx) => (
        <a
          key={idx}
          className={game.cls}
          href={game.href}
          style={{ cursor: 'pointer' }}
          rel="noreferrer"
        >
          {game.title && (
            <dl className="entrance-title">
              <dt>{game.title}</dt>
              <dd>{game.subtitle}</dd>
            </dl>
          )}
          <img src={game.img} alt="" draggable="false" />
        </a>
      ))}
    </div>
  );
}

export default GameHall;
