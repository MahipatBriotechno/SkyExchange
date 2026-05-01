import React, { useState } from 'react';
import Layout from '../components/Layout';
import BetSlip from '../components/BetSlip';
import './FullMarketFootball.css';

const FullMarketFootballPage = () => {
  const [selectedBet, setSelectedBet] = useState(null);

  const marketData = {
    matchOdds: [
      { id: 101, name: 'England (nikkitta) (E)', back: { price: 13.34, size: '10M' }, lay: { price: 1.09, size: '10M' } },
      { id: 102, name: 'France (mko1919)', back: { price: 1.09, size: '10M' }, lay: { price: 1.14, size: '10M' } },
      { id: 103, name: 'Draw', back: { price: 10.3, size: '10M' }, lay: { price: 8.5, size: '10M' } }
    ],
    overUnder: [
      { id: 201, name: 'Under 5.5', back: { price: 1.37, size: '5M' }, lay: { price: 1.41, size: '5M' } },
      { id: 202, name: 'Over 5.5', back: { price: 3.42, size: '5M' }, lay: { price: 3.72, size: '5M' } }
    ]
  };

  const handleBetClick = (runner, type, price, market = 'Match Odds') => {
    setSelectedBet({ runner, type, price, market });
  };

  return (
    <Layout>
      <div className="full-market-container football-market">
        {/* Sidebar Navigation */}
        <aside className="market-sidebar">
          <div className="sidebar-header">Sports</div>
          <nav className="sidebar-nav">
            <div className="nav-item level-sports">All Sports</div>
            <div className="nav-item level-football">Football</div>
            <div className="nav-item level-competition">Cyber Live Arena</div>
            <div className="nav-item level-match">England (nikkitta) v France (mko1919)</div>
            <div className="nav-item level-market">Match Odds</div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="market-main-content" style={{ flex: 1 }}>
          {/* Football Scoreboard */}
          <section className="scoreboard-section">
            <div className="score-top-bar">
              <div className="team-name" style={{ color: '#fff' }}>England (nikkitta) (E)</div>
              <div className="live-score-center">
                <div className="score-digits">1 : 0</div>
                <div className="match-status-text">1st | 45:00 (+03:48)</div>
              </div>
              <div className="team-name" style={{ color: '#fff' }}>France (mko1919)</div>
            </div>
            <div className="timeline-graph-area">
              <div className="attack-graph">
                <div className="attack-line"></div>
                <div style={{ position: 'absolute', top: '10px', left: '15%', width: '2px', height: '20px', background: 'red' }} title="Goal"></div>
              </div>
              <div className="graph-markers">
                <span>0'</span>
                <span>15'</span>
                <span>30'</span>
                <span>45'</span>
                <span>60'</span>
                <span>75'</span>
                <span>90'</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: '10px', color: '#ffb80c', fontWeight: 'bold', marginTop: '5px' }}>(2x45 Min) FT</div>
            </div>
          </section>

          {/* Center Control Bar */}
          <div className="market-control-bar">
            <div className="control-bar-inner">
              <i className="icon-pin" title="Pin Market"></i>
              <i className="icon-refresh" title="Refresh Odds"></i>
            </div>
          </div>

          {/* Match Odds Market */}
          <div className="market-section">
            <div className="market-header-bar">
              <h3 style={{ margin: 0, fontSize: '15px' }}>Match Odds <span className="tag-inplay" style={{ marginLeft: '10px' }}>In-Play</span></h3>
              <div className="matched-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="max-pill">Max 100K</div>
                <div className="matched-amount" style={{ fontSize: '12px' }}>Matched: <strong>PTH 676,571</strong></div>
                <div className="btn-live-tv" style={{ background: '#243a48', color: '#fff', padding: '3px 10px', borderRadius: '15px', fontSize: '11px', cursor: 'pointer' }}>
                   Live
                </div>
              </div>
            </div>

            <table className="odds-table">
              <thead>
                <tr style={{ background: '#eee', height: '25px' }}>
                  <th style={{ textAlign: 'left', paddingLeft: '15px', fontSize: '11px' }}>3 selections</th>
                  <th colSpan="1" style={{ width: '60px', textAlign: 'center', background: '#72bbef', fontWeight: 'bold', fontSize: '12px' }}>Back</th>
                  <th colSpan="1" style={{ width: '60px', textAlign: 'center', background: '#faa9ba', fontWeight: 'bold', fontSize: '12px' }}>Lay</th>
                  <th style={{ width: '120px' }}></th> {/* Offset for layout parity if needed */}
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
                    <td style={{ background: '#f9f9f0' }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Under/Over Market Section */}
          <div className="market-section" style={{ marginTop: '12px' }}>
            <div className="market-header-bar" style={{ background: '#243a48', color: '#fff', height: '35px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', color: '#fff' }}>Under/Over 5.5</h3>
            </div>
            <div className="market-sub-labels">
              <div className="label-box">Max</div>
              <div className="label-val">10K</div>
            </div>
            <div style={{ position: 'relative' }}>
              <table className="odds-table" style={{ opacity: 0.5 }}>
                <tbody>
                  {marketData.overUnder.map((runner) => (
                    <tr key={runner.id} className="runner-row">
                      <td className="runner-info-cell"><span className="runner-name">{runner.name}</span></td>
                      <td className="odds-cell back-1" style={{ filter: 'grayscale(1)' }}>
                        <span className="price">{runner.back.price}</span>
                      </td>
                      <td className="odds-cell lay-1" style={{ filter: 'grayscale(1)' }}>
                        <span className="price">{runner.lay.price}</span>
                      </td>
                      <td style={{ background: '#f9f9f0' }}></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.1)', color: '#d0021b', fontWeight: '800', fontSize: '20px', zIndex: 10 }}>
                SUSPENDED
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - BetSlip */}
        <aside className="betslip-sidebar">
          <BetSlip />
        </aside>
      </div>
    </Layout>
  );
};

export default FullMarketFootballPage;
