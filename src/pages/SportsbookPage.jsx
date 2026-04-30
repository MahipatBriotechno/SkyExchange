import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { casinoController } from '../controllers/casino/casinoController';
import { useAuthStore } from '../store/authStore';

const SportsbookPage = () => {
  const { isLoggedIn, loginToken } = useAuthStore();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSportsbookUrl = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await casinoController.openSportsbook(loginToken);
        if (res && res.url) {
          setUrl(res.url);
        } else {
          setError(res?.msg || 'Failed to get sportsbook URL');
        }
      } catch (err) {
        console.error('Sportsbook fetch error:', err);
        setError('Error connecting to sportsbook');
      } finally {
        setLoading(false);
      }
    };

    fetchSportsbookUrl();
  }, [isLoggedIn, loginToken]);

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-xl font-black text-[#253845] uppercase mb-4">Login Required</h2>
            <p className="text-gray-500 mb-6 font-medium">Please login to access the Premium Sportsbook.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="w-full bg-[#ffb400] text-black font-black py-3 rounded-md uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="sportsbook-container bg-black min-h-screen relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/50 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-[#ffb400] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#ffb400] font-black uppercase tracking-widest animate-pulse">Initializing Sportsbook...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center text-white">
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white/10 rounded-full font-bold hover:bg-white/20 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {url && (
          <iframe 
            src={url} 
            className="w-full h-[calc(100vh-150px)] md:h-[calc(100vh-120px)] border-none"
            title="Premium Sportsbook"
            allowFullScreen
          />
        )}
      </div>
    </Layout>
  );
};

export default SportsbookPage;
