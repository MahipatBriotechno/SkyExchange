import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AccountLayout from './AccountLayout';

function BetsHistoryPage() {
  const [activeTab, setActiveTab] = useState('Current Bets');
  const [activeSubTab, setActiveSubTab] = useState('Exchange');
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam === 'history') {
      setActiveTab('Bets History');
    } else if (tabParam === 'pnl') {
      setActiveTab('Profit & Loss');
    } else {
      setActiveTab('Current Bets');
    }
  }, [location.search]);

  const renderCurrentBets = () => (
    <>
      <div className="sub-tabs">
        {['Exchange', 'FancyBet', 'Sportsbook', 'BookMaker'].map(tab => (
          <button 
            key={tab} 
            className={`sub-tab ${activeSubTab === tab ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bets-filter-box">
        <div className="filter-row" style={{ border: 'none', background: 'transparent', margin: 0 }}>
          <span>Bet Status: </span>
          <select style={{ padding: '2px 5px', border: '1px solid #ccc' }}>
            <option>All</option>
          </select>
          <span style={{ marginLeft: '10px' }}>Order By: </span>
          <label><input type="checkbox" checked readOnly /> Bet placed</label>
          <label><input type="checkbox" /> Market</label>
        </div>
      </div>

      <div className="unmatched-section">
        <div className="section-title">Unmatched</div>
        <table className="data-table balance-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Market</th>
              <th style={{ textAlign: 'right' }}>Selection</th>
              <th style={{ textAlign: 'center' }}>Type</th>
              <th style={{ textAlign: 'center' }}>Bet ID</th>
              <th style={{ textAlign: 'center' }}>Bet placed</th>
              <th style={{ textAlign: 'center' }}>Odds req.</th>
              <th style={{ textAlign: 'center' }}>Matched</th>
              <th style={{ textAlign: 'center' }}>Unmatched</th>
              <th style={{ textAlign: 'center' }}>Date matched</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="9" style={{ padding: '15px' }}>You have no bets in this time period.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="matched-section">
        <div className="section-title">Matched</div>
        <table className="data-table balance-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Market</th>
              <th style={{ textAlign: 'right' }}>Selection</th>
              <th style={{ textAlign: 'center' }}>Type</th>
              <th style={{ textAlign: 'center' }}>Bet ID</th>
              <th style={{ textAlign: 'center' }}>Bet placed</th>
              <th style={{ textAlign: 'center' }}>Odds req.</th>
              <th style={{ textAlign: 'center' }}>Matched</th>
              <th style={{ textAlign: 'center' }}>Avg. odds matched</th>
              <th style={{ textAlign: 'center' }}>Date matched</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="9" style={{ padding: '15px' }}>You have no bets in this time period.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  const renderBetsHistory = () => (
    <>
      <div className="sub-tabs">
        {['Exchange', 'FancyBet', 'Sportsbook', 'BookMaker'].map(tab => (
          <button 
            key={tab} 
            className={`sub-tab ${activeSubTab === tab ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bets-filter-box">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
          <span>Bet Status:</span>
          <select className="date-input">
            <option>Settled</option>
          </select>
          <span>Period</span>
          <input className="date-input" type="text" defaultValue="2026-04-07" style={{ width: '80px' }} />
          <span>09:00 to</span>
          <input className="date-input" type="text" defaultValue="2026-04-08" style={{ width: '80px' }} />
          <span>08:59</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="sub-tab">Just For Today</button>
          <button className="sub-tab">From Yesterday</button>
          <button className="btn-submit-bets">Get History</button>
        </div>
      </div>

      <div className="disclaimer-text">
        <p>Betting History enables you to review the bets you have placed.</p>
        <p>Specify the time period during which your bets were placed, the type of markets on which the bets were placed, and the sport.</p>
        <p>Betting History is available online for the past 62 days.</p>
        <p>User can search up to 14 days records per query only. However, when querying Fancybet with the bet status set to <b>voided</b>, the maximum query period is limited to 2 days.</p>
      </div>
    </>
  );

  const renderProfitAndLoss = () => (
    <div className="bets-pnl-wrapper">
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#3b5160', fontWeight: '700' }}>Profit & Loss - Main wallet</h4>
        <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '15px' }}>
          <span>👤 ndtv9963</span>
          <span>📅 2026-04-07 12:31</span>
        </div>
      </div>

      <div className="sub-tabs" style={{ flexWrap: 'wrap' }}>
        {['Exchange', 'FancyBet', 'Casino', 'Sportsbook', 'BookMaker', 'BPoker', 'SABA', 'MiniGame', 'Royal'].map(tab => (
          <button 
            key={tab} 
            className={`sub-tab ${activeSubTab === tab ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bets-filter-box">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <span>Period</span>
          <input className="date-input" type="text" defaultValue="2026-04-07" style={{ width: '80px' }} />
          <span>09:00 to</span>
          <input className="date-input" type="text" defaultValue="2026-04-08" style={{ width: '80px' }} />
          <span>08:59</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="sub-tab">Just For Today</button>
          <button className="sub-tab">From Yesterday</button>
          <button className="btn-submit-bets">Get P & L</button>
        </div>
      </div>

      <div className="disclaimer-text">
        <p>Betting Profit & Loss enables you to review the bets you have placed.</p>
        <p>Specify the time period during which your bets were placed, the type of markets on which the bets were placed, and the sport.</p>
        <p>Betting Profit & Loss is available online for the past 62 days.</p>
        <p>User can search up to 14 days records per query only .</p>
      </div>
    </div>
  );

  return (
    <AccountLayout title="My Bets">
      <div className="tabs-container">
        {['Current Bets', 'Bets History', 'Profit & Loss'].map(tab => (
          <button 
            key={tab} 
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'Profit & Loss') setActiveSubTab('Exchange');
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="content-area">
        {activeTab === 'Current Bets' && renderCurrentBets()}
        {activeTab === 'Bets History' && renderBetsHistory()}
        {activeTab === 'Profit & Loss' && renderProfitAndLoss()}
      </div>
    </AccountLayout>
  );
}

export default BetsHistoryPage;
