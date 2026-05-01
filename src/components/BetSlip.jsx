import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { bettingController } from '../controllers';

const BetSlip = () => {
  const { matchId } = useParams();
  const { loginToken, isLoggedIn } = useAuthStore();
  const [bets, setBets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && loginToken) {
      fetchBets();
    }
  }, [isLoggedIn, loginToken, matchId]);

  const fetchBets = async () => {
    try {
      setIsLoading(true);
      const res = await bettingController.getMyBets(loginToken);
      if (res && typeof res === 'object' && !res.error) {
        const betArray = Object.values(res).filter(item => typeof item === 'object' && item !== null);
        
        // Filter bets for the current match if possible
        const eventBets = betArray.filter(b => {
            const gid = b.gid || b.Gid || b.eventId || b.matchId || b.MatchId;
            return !gid || gid.toString() === matchId?.toString();
        });
        
        setBets(eventBets);
      }
    } catch (err) {
      console.error('Failed to fetch bets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300">
      <div className="bg-[#243a48] text-white text-[13px] font-bold py-2 px-3 flex justify-between items-center">
        <span>My Bets</span>
        <button onClick={fetchBets} className="text-xs text-gray-300 hover:text-white underline cursor-pointer">Refresh</button>
      </div>
      
      {!isLoggedIn ? (
        <div className="p-6 text-center text-[11px] text-gray-600">
          Please login to view your bets.
        </div>
      ) : isLoading ? (
        <div className="p-6 text-center text-[11px] text-gray-600">
          Loading bets...
        </div>
      ) : bets.length === 0 ? (
        <div className="p-6 text-center text-[11px] text-gray-600">
          You have no placed bets for this event.
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Header row */}
          <div className="flex bg-[#dce5ec] text-[#444] text-[11px] font-bold h-[25px] items-center border-b border-[#c8d1d8] px-1">
            <div className="w-[50%] px-1">Matched Bets</div>
            <div className="w-[15%] text-center">Odds</div>
            <div className="w-[15%] text-center">Stake</div>
            <div className="w-[20%] text-center">Profit</div>
          </div>
          
          <div className="overflow-y-auto max-h-[600px]">
             {bets.map((bet, idx) => {
               const sideRaw = bet.Side || bet.type || '';
               const isBack = sideRaw.toLowerCase() === 'back' || sideRaw.toLowerCase() === 'yes';
               
               const bgColor = isBack ? 'bg-[#e2f2ff]' : 'bg-[#fdf1f3]';
               
               const rateNum = parseFloat(bet.Rate || '0');
               const stakeNum = parseFloat(bet.Stake || '0');
               
               let profitStr = '0.00';
               if (bet.Type?.toUpperCase() === 'FANCY') {
                 // Fancy profit calculation is often just the stake or handled differently based on rate
                 profitStr = (stakeNum * (rateNum / 100)).toFixed(2);
               } else {
                 profitStr = isBack 
                   ? (stakeNum * (rateNum - 1)).toFixed(2)
                   : stakeNum.toFixed(2);
               }

               return (
                 <div key={idx} className={`flex items-center text-[11px] border-b border-gray-200 py-2 px-1 ${bgColor}`}>
                   <div className="w-[50%] flex flex-col px-1 overflow-hidden">
                     <span className="font-bold text-black truncate" title={bet.Selection}>{bet.Selection}</span>
                     <span className="text-gray-600 text-[10px] truncate">{bet.Game_Type || bet.Type || 'Match Odds'}</span>
                   </div>
                   <div className="w-[15%] text-center font-bold">{bet.Rate}</div>
                   <div className="w-[15%] text-center">{bet.Stake}</div>
                   <div className="w-[20%] text-center font-bold text-black">{profitStr}</div>
                 </div>
               )
             })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BetSlip;
