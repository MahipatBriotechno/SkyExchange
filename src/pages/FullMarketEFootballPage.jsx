import React, { useState } from 'react';
import Layout from '../components/Layout';
import BetSlip from '../components/BetSlip';
import './FullMarketFootball.css'; // Reusing Football CSS for common elements

const FullMarketEFootballPage = () => {
  const [selectedBet, setSelectedBet] = useState(null);

  const marketData = {
    matchOdds: [
      { id: 101, name: 'England (nikkitta) (E)', back: { price: 13.34, size: '10M' }, lay: { price: 1.09, size: '10M' } },
      { id: 102, name: 'France (mko1919)', back: { price: 1.09, size: '10M' }, lay: { price: 1.14, size: '10M' } },
      { id: 103, name: 'Draw', back: { price: 10.3, size: '10M' }, lay: { price: 8.5, size: '10M' } }
    ]
  };

  const handleBetClick = (runner, type, price, market = 'Match Odds') => {
    setSelectedBet({ runner, type, price, market });
  };

  return (
    <Layout>
      <div className="full-market-container football-market">
        {/* Sidebar Navigation - E-Football Path */}
        <aside className="market-sidebar">
          <div className="sidebar-header">Sports</div>
          <nav className="sidebar-nav">
            <div className="nav-item level-sports">All Sports</div>
            <div className="nav-item level-football">E-Football</div>
            <div className="nav-item level-competition">E-Football</div>
            <div className="nav-item level-match">Borussia Dortmund (Rossi) v SC Freiburg (Baba)</div>
            <div className="nav-item level-market">Match Odds</div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="market-main-content" style={{ flex: 1 }}>
          {/* Football Scoreboard (6 min format) */}
          <section className="scoreboard-section">
            <div className="score-top-bar">
              <div className="team-name" style={{ color: '#fff' }}>Borussia Dortmund (Rossi)</div>
              <div className="live-score-center">
                <div className="score-digits">1 : 1</div>
                <div className="match-status-text">HT | Ended</div>
              </div>
              <div className="team-name" style={{ color: '#fff' }}>SC Freiburg (Baba)</div>
            </div>
            <div className="timeline-graph-area">
              <div style={{ textAlign: 'right', fontSize: '10px', color: '#aaa', marginBottom: '5px' }}>(2x6 Min) FT</div>
              <div className="attack-graph">
                <div className="attack-line"></div>
              </div>
              <div className="graph-markers">
                <span>0'</span>
                <span>15'</span>
                <span>30'</span>
                <span>45'</span>
              </div>
            </div>
          </section>

          {/* Center Control Bar */}
          <div className="market-control-bar">
            <div className="control-bar-inner">
               📌 Refresh
            </div>
          </div>

          {/* Match Odds Market (1 Back / 1 Lay) */}
          <div className="market-section">
            <div className="market-header-bar">
              <h3 style={{ margin: 0, fontSize: '15px' }}>Match Odds <span className="tag-inplay" style={{ marginLeft: '10px' }}>In-Play</span></h3>
              <div className="matched-info">
                <div style={{ background: '#243a48', color: '#fff', padding: '3px 10px', borderRadius: '15px', fontSize: '11px' }}>Live</div>
                <div className="matched-amount" style={{ fontSize: '12px', marginLeft: '10px' }}>Matched: <strong>PTH 0</strong></div>
              </div>
            </div>

            {/* Special grey bar for Max: 1L in E-Football */}
            <div style={{ background: '#eee', padding: '5px 15px', fontSize: '11px', fontWeight: 'bold', display: 'flex', justifyContent: 'flex-start' }}>
              Max: 1L
            </div>

            <table className="odds-table">
              <thead>
                <tr style={{ height: '30px' }}>
                  <th style={{ textAlign: 'left', paddingLeft: '15px', fontSize: '11px' }}>3 selections</th>
                  <th style={{ width: '60px', textAlign: 'center', background: '#72bbef', fontWeight: 'bold' }}>Back</th>
                  <th style={{ width: '60px', textAlign: 'center', background: '#faa9ba', fontWeight: 'bold' }}>Lay</th>
                </tr>
              </thead>
              <tbody>
                {marketData.matchOdds.map((runner) => (
                  <tr key={runner.id} className="runner-row">
                    <td className="runner-info-cell">
                      <span className="runner-name">{runner.name}</span>
                    </td>
                    <td className="odds-cell back-1" onClick={() => handleBetClick(runner.name, 'Back', runner.back.price)}>
                      <span className="price">{runner.back.price}</span>
                      <span className="size">{runner.back.size}</span>
                    </td>
                    <td className="odds-cell lay-1" onClick={() => handleBetClick(runner.name, 'Lay', runner.lay.price)}>
                      <span className="price">{runner.lay.price}</span>
                      <span className="size">{runner.lay.size}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <aside className="betslip-sidebar">
          <BetSlip />
        </aside>
      </div>
    </Layout>
  );
};

export default FullMarketEFootballPage;
