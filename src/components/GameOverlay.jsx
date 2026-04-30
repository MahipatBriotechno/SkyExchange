import React from 'react';

const GameOverlay = ({ isOpen, url, title, onClose }) => {
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col bg-black ${isFullScreen ? 'p-0' : 'p-2 md:p-4'}`}>
      <div className="flex items-center justify-between h-12 px-4 bg-[#1a1a1a] border-b border-white/10 rounded-t-lg">
        <h3 className="text-white font-bold truncate pr-4">{title}</h3>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="text-white hover:text-[#ffb400] transition-colors"
          >
            {isFullScreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v5H3M21 8h-5V3M3 16h5v5M16 21v-5h5"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            )}
          </button>
          <button 
            onClick={onClose}
            className="text-white hover:text-red-500 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      <div className="flex-1 bg-black relative rounded-b-lg overflow-hidden">
        {url ? (
          <iframe 
            src={url} 
            className="w-full h-full border-none"
            allowFullScreen
            title={title}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4">
            <div className="w-12 h-12 border-4 border-[#ffb400] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold uppercase tracking-widest">Launching Game...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameOverlay;
