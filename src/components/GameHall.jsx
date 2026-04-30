import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVirtualCricket } from './Layout';
import { casinoController } from '../controllers';
import { useCasinoStore } from '../store/casinoStore';

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
    href: '/casino',
    filter: { provider: 'Evolution' }
  },
  {
    cls: 'entrance-half',
    title: 'Smartsoft',
    subtitle: 'Play Now',
    img: '/images/banner_smartsoft-half.png',
    href: '/casino',
    filter: { provider: 'SmartSoft' }
  },
  {
    cls: '',
    title: 'Royal Gaming',
    subtitle: 'Play Now',
    img: '/images/banner_royalgaming.png',
    href: '/casino',
    filter: { provider: 'RoyalGaming' }
  },
  {
    cls: 'entrance-half',
    title: 'EZUGI',
    subtitle: 'Play Now',
    img: '/images/banner_ezugi-half.png',
    href: '/casino',
    filter: { provider: 'Ezugi' }
  },
  {
    cls: 'entrance-half mobile-only',
    title: 'SKYCASINO',
    subtitle: 'Play Now',
    img: '/images/banner_skycasino-half.png',
    href: '/casino',
  },
  {
    cls: 'entrance-half',
    title: 'Live Casino',
    subtitle: 'Play Now',
    img: '/images/banner_casino-half.png',
    href: '/casino',
  },
  {
    cls: 'entrance-half',
    title: 'AVIATORX',
    subtitle: 'Play Now',
    img: '/images/banner_aviator_xtreme-half.png',
    href: '#',
    filter: { name: 'Aviator' }
  },
  {
    cls: 'entrance-half',
    title: 'Mines',
    subtitle: 'Play Now',
    img: '/images/banner_mines-half.png',
    href: '#',
    filter: { name: 'Mines' }
  },
  {
    cls: 'entrance-half',
    title: 'KiteX',
    subtitle: 'Play Now',
    img: '/images/banner_kitex-half.png',
    href: '#',
    filter: { name: 'Kite' }
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
    filter: { provider: 'Spribe' }
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
    filter: { name: '7 Up 7 Down' }
  },
  {
    cls: 'entrance-half',
    title: 'Andar Bahar VR',
    subtitle: 'Play Now',
    img: '/images/banner_andarBaharVR-half.png',
    href: '#',
    filter: { name: 'Super Andar Bahar' }
  },
  {
    cls: 'entrance-half',
    title: 'Supernowa',
    subtitle: 'Play Now',
    img: '/images/banner_supernowa-half.png',
    href: '/casino',
    filter: { provider: 'SuperNowa' }
  },

  {
    cls: 'entrance-half',
    title: 'HORSEBOOK',
    subtitle: 'Play Now',
    img: '/images/banner_horsebook-half.png',
    href: '#',
    filter: { provider: 'HORSEBOOK' }
  },
  {
    cls: 'entrance-half',
    title: 'Minesweeper',
    subtitle: 'Play Now',
    img: '/images/banner_minesweeper-half.png',
    href: '#',
    filter: { name: 'Casino Minesweeper' }
  },
  {
    cls: 'entrance-half',
    title: 'Teen Patti',
    subtitle: 'Play Now',
    img: '/images/banner_teenPatti-half.png',
    href: '#',
    filter: { name: '1 Day Teen Patti' }
  },
  {
    cls: 'entrance-half',
    title: 'Super Over VR',
    subtitle: 'Play Now',
    img: '/images/banner_superOverVR-half.png',
    href: '#',
    filter: { name: 'Super Over VR' }
  },
  {
    cls: 'entrance-half',
    title: 'TeenPatti 20-20',
    subtitle: 'Play Now',
    img: '/images/banner_TeenPatti2020-half.png',
    href: '#',
    filter: { name: 'TeenPatti 20-20' }
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
    filter: { name: 'TeenPatti Joker' }
  },
  {
    cls: 'entrance-half',
    title: '7up7down',
    subtitle: 'Play Now',
    img: '/images/mobile/gamehall/banner_7up7down-half.png',
    href: '#',
    filter: { name: '7 Up 7 Down' }
  },
  {
    cls: 'entrance-half',
    title: 'Dragon & Tiger',
    subtitle: 'Play Now',
    img: '/images/banner_DragonNTiger-half.png',
    href: '#',
    filter: { name: 'Dragon & Tiger' }
  },
  {
    cls: 'entrance-half',
    title: 'Auto Roulette',
    subtitle: 'Play Now',
    img: '/images/banner_autoRoulette-half.png',
    href: '#',
    filter: { name: 'VR Auto Roulette' }
  },
  {
    cls: 'entrance-half',
    title: 'Dus Ka Dum ',
    subtitle: 'Play Now',
    img: '/images/banner_DusKaDumVR-half.png',
    href: '#',
    filter: { name: 'VR Auto Roulette' }
  },
  {
    cls: 'entrance-half',
    title: 'Callbreak Quick',
    subtitle: 'Play Now',
    img: '/images/banner_CallbreakQuick-half.png',
    href: '#',
    filter: { name: 'Callbreak Quick' }
  },
  {
    cls: 'entrance-half',
    title: 'Sic Bo',
    subtitle: 'Play Now',
    img: '/images/banner_SicBo-Jili-half.png',
    href: '#',
    filter: { name: 'Thai Sic Bo' }
  },
  {
    cls: 'entrance-half',
    title: 'Baccarat',
    subtitle: 'Play Now',
    img: '/images/banner_Baccarat-half.png',
    href: '#',
    filter: { name: 'Baccarat Insurance' }
  },
  {
    cls: 'entrance-half',
    title: 'Bonus Dice',
    subtitle: 'Play Now',
    img: '/images/banner_BonusDice-half.png',
    href: '#',
    filter: { name: 'Bonus Dice' }
  },
  {
    cls: 'entrance-half',
    title: 'Heist',
    subtitle: 'Play Now',
    img: '/images/banner_Heist-half.png',
    href: '#',
    filter: { name: 'Heist' }
  },
  {
    cls: 'entrance-half',
    title: '5 Card Poker',
    subtitle: 'Play Now',
    img: '/images/banner_5CardPoker-half.png',
    href: '#',
    filter: { name: '5 Card Poker' }
  },
  {
    cls: 'entrance-half',
    title: 'Color Game',
    subtitle: 'Play Now',
    img: '/images/banner_ColorGame-half.png',
    href: '#',
    filter: { name: 'Color Game' }
  },
  {
    cls: 'entrance-half',
    title: '32 Cards',
    subtitle: 'Play Now',
    img: '/images/banner_32card-half.png',
    href: '#',
    filter: { name: '32 Cards' }
  },
  {
    cls: 'entrance-half',
    title: 'Rummy',
    subtitle: 'Play Now',
    img: '/images/banner_rummy-half.png',
    href: '#',
    filter: { name: 'Rummy' }
  },
  {
    cls: 'entrance-half',
    title: 'Dragon Tiger',
    subtitle: 'Play Now',
    img: '/images/banner_dragonTiger-half.png',
    href: '#',
    filter: { name: 'VR Dragon Tiger' }
  },
  {
    cls: 'entrance-half',
    title: 'Worli Matka VR',
    subtitle: 'Play Now',
    img: '/images/banner_worliMatkaVR-half.png',
    href: '#',
    filter: { name: 'Worli Matka VR' }
  },
  {
    cls: 'entrance-half',
    title: 'BetGames',
    subtitle: 'Play Now',
    img: '/images/banner_betgames-half.png',
    href: '/casino',
    filter: { provider: 'BetGames.TV' }
  },
  {
    cls: 'entrance-half',
    title: 'Andar Bahar',
    subtitle: 'Play Now',
    img: '/images/banner_andarBahar-half.png',
    href: '#',
    filter: { name: 'Super Andar Bahar' }
  },
  {
    cls: 'entrance-half',
    title: 'Sicbo',
    subtitle: 'Play Now',
    img: '/images/banner_sicbo-half.png',
    href: '#',
    filter: { name: 'Sic Bo' }
  },

  {
    cls: 'entrance-half',
    title: 'Coin Toss',
    subtitle: 'Play Now',
    img: '/images/banner_CoinToss-half.png',
    href: '#',
    filter: { name: 'Coin Toss' }
  },

  {
    cls: 'entrance-half',
    title: 'Number Matka',
    subtitle: 'Play Now',
    img: '/images/banner_numberMatka-half.png',
    href: '#',
    filter: { name: 'NumberMatka' }
  },

];

function GameHall() {
  const { handleVirtualCricket, handleOpenCasinoGame } = useVirtualCricket() || {};
  const navigate = useNavigate();
  const { games, setGames } = useCasinoStore();

  useEffect(() => {
    const fetchGames = async () => {
      if (games.length > 0) return;
      try {
        const res = await casinoController.getCasinoGames();
        setGames(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Failed to pre-fetch games:', err);
      }
    };
    fetchGames();
  }, [games.length, setGames]);

  const handleItemClick = (e, game) => {
    e.preventDefault();

    if (game.title === 'Virtual Cricket') {
      handleVirtualCricket && handleVirtualCricket();
      return;
    }

    if (game.external && game.href) {
      window.open(game.href, '_blank');
      return;
    }

    if (game.filter) {
      let filtered = [];
      
      if (game.filter.provider) {
        filtered = games.filter(g => g.provider === game.filter.provider);
      } else if (game.filter.name) {
        const target = game.filter.name.toLowerCase().replace(/\s/g, '');
        filtered = games.filter(g => {
          const gName = (g.name || '').toLowerCase().replace(/\s/g, '');
          return gName.includes(target);
        });
      }

      if (filtered.length === 1) {
        handleOpenCasinoGame && handleOpenCasinoGame(filtered[0]);
      } else if (filtered.length > 1 || game.filter.provider) {
        // Create a slug from provider or name
        const slug = (game.filter.provider || game.filter.name)
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        
        navigate(`/${slug}`, { state: { filter: game.filter } });
      } else {
        navigate('/casino');
      }
    } else {
      navigate(game.href || '/casino');
    }
  };

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
            <span id="count"></span>
          </dd>
          <dd id="onLiveCount_SOCCER">
            <p>Soccer</p>
            <span id="count"></span>
          </dd>
          <dd id="onLiveCount_TENNIS">
            <p>Tennis</p>
            <span id="count"></span>
          </dd>
          <dd id="onLiveCount_E_SOCCER">
            <p>E-Soccer</p>
            <span id="count"></span>
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
          onClick={(e) => handleItemClick(e, game)}
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
