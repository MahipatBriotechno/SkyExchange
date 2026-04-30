import React, { useState, createContext, useContext } from 'react';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import LoginModal from './LoginModal';
import { casinoController } from '../controllers';
import { useAuthStore } from '../store/authStore';
import GameOverlay from './GameOverlay';

export const VirtualCricketContext = createContext();

export const useVirtualCricket = () => useContext(VirtualCricketContext);

function Layout({ children }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isLoggedIn, loginToken } = useAuthStore();
  const [overlayState, setOverlayState] = useState({ isOpen: false, url: '', title: '' });

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const handleVirtualCricket = async () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    try {
      setOverlayState({ isOpen: true, url: '', title: 'Virtual Cricket' });
      const res = await casinoController.openSportsbook(loginToken);
      if (res && res.error === '0' && res.url) {
        setOverlayState(prev => ({ ...prev, url: res.url }));
      } else {
        alert(res?.msg || 'Failed to launch Virtual Cricket');
        setOverlayState({ isOpen: false, url: '', title: '' });
      }
    } catch (err) {
      console.error('Virtual Cricket Error:', err);
      alert('Error launching Virtual Cricket');
      setOverlayState({ isOpen: false, url: '', title: '' });
    }
  };

  const handleOpenCasinoGame = async (gameData) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    try {
      setOverlayState({ isOpen: true, url: '', title: gameData.name });
      const res = await casinoController.openCasinoGame({
        ...gameData,
        loginToken
      });
      
      if (res && res.error === '0' && res.url) {
        setOverlayState(prev => ({ ...prev, url: res.url }));
      } else {
        alert(res?.msg || 'Failed to launch game');
        setOverlayState({ isOpen: false, url: '', title: '' });
      }
    } catch (err) {
      console.error('Casino Game Error:', err);
      alert('Error launching casino game');
      setOverlayState({ isOpen: false, url: '', title: '' });
    }
  };

  return (
    <VirtualCricketContext.Provider value={{ handleVirtualCricket, handleOpenCasinoGame }}>
      <GameOverlay 
        isOpen={overlayState.isOpen}
        url={overlayState.url}
        title={overlayState.title}
        onClose={() => setOverlayState({ isOpen: false, url: '', title: '' })}
      />

      {/* Desktop elements - hidden on mobile via CSS */}
      <div className="desktop-only">
        <DesktopHeader onVirtualCricketClick={handleVirtualCricket} />
      </div>

      {/* Mobile header - hidden on desktop via CSS */}
      <div className="mobile-only">
        <MobileHeader onVirtualCricketClick={handleVirtualCricket} />
      </div>

      {/* Login Modal (triggered by Virtual Cricket etc.) */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />

      {/* Page content */}
      {children}
    </VirtualCricketContext.Provider>
  );
}

export default Layout;
