import React, { useState } from 'react';
import './FullMarketCricket.css';
import BetSlip from '../components/BetSlip';
import Layout from '../components/Layout';

const FullMarketCricketPage = () => {
  const [selectedBet, setSelectedBet] = useState(null);
  const [activeInns, setActiveInns] = useState(1);

  const marketData = {
    matchOdds: [
      { id: 144197, name: 'Canada', back: [{ price: 3.8, size: '2,348' }, { price: 3.75, size: '553K' }, { price: 3.7, size: '114K' }], lay: [{ price: 3.85, size: '44,497' }, { price: 3.9, size: '523K' }, { price: 3.95, size: '431K' }] },
      { id: 247650, name: 'United Arab Emirates', back: [{ price: 1.35, size: '1.49M' }, { price: 1.34, size: '1.31M' }, { price: 1.33, size: '792K' }], lay: [{ price: 1.36, size: '1.4M' }, { price: 1.37, size: '321K' }, { price: 1.38, size: '579K' }] }
    ],
    winTheToss: [
      { id: 331, name: 'Canada', back: [{ price: 1.19, size: '24,872' }, { price: 1.18, size: '24,332' }, { price: 1.17, size: '213K' }], lay: [{ price: 1.2, size: '63,093' }, { price: 1.21, size: '85,088' }, { price: 1.22, size: '185K' }] },
      { id: 332, name: 'United Arab Emirates', back: [{ price: 6, size: '12,670' }, { price: 5.7, size: '18,485' }, { price: 5.6, size: '188' }], lay: [{ price: 6.4, size: '4,680' }, { price: 6.6, size: '4,347' }, { price: 6.8, size: '5' }] }
    ],
    lineMarket: [
      { id: 441, name: 'Canada', back: [{ price: 1.19, size: '24,872' }, { price: 1.18, size: '24,332' }, { price: 1.17, size: '213K' }], lay: [{ price: 1.2, size: '63,093' }, { price: 1.21, size: '85,088' }, { price: 1.22, size: '185K' }] },
      { id: 442, name: 'United Arab Emirates', back: [{ price: 6, size: '12,670' }, { price: 5.7, size: '18,485' }, { price: 5.6, size: '188' }], lay: [{ price: 6.4, size: '4,680' }, { price: 6.6, size: '4,347' }, { price: 6.8, size: '5' }] }
    ]
  };

  const handleBetClick = (runner, type, price, market = 'Match Odds') => {
    setSelectedBet({
      runner,
      type,
      price,
      market
    });
  };

  return (
    <Layout>
      <div className="full-market-container cricket-market">
        {/* Sidebar Navigation - Precise Levels */}
        <aside className="market-sidebar">
          <div className="sidebar-header">Sports</div>
          <nav className="sidebar-nav">
            <div className="nav-item level-sports">All Sports</div>
            <div className="nav-item level-cricket">Cricket</div>
            <div className="nav-item level-competition">ICC Men's T20 World Cup</div>
            <div className="nav-item level-match">Canada v United Arab Emirates</div>
            <div className="nav-item level-market">Match Odds</div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="market-main-content">
          {/* Scoreboard Section - Dark Theme */}
          <section className="scoreboard-section">
            <div className="score-top-bar">
              <div className="team-info">
                <div style={{ width: '24px', height: '16px', background: '#d32f2f' }}></div>
                <span>Canada</span>
              </div>
              <div className="match-scores-center">
                <div className="score-main">BRK 150/7 18.2 OV</div>
                <div className="score-sub">7.64 CRR | Yet to bat</div>
              </div>
              <div className="team-info">
                <span>United Arab Emirates</span>
                <div style={{ width: '24px', height: '16px', background: '#388e3c' }}></div>
              </div>
            </div>
            <div className="graph-area">
              <div className="run-rate-placeholder">
                RUN RATE
                <div className="run-rate-line"></div>
              </div>
              <div className="graph-controls">
                <button className={`inns-btn ${activeInns === 1 ? 'active' : ''}`} onClick={() => setActiveInns(1)}>CAN INNS</button>
                <button className={`inns-btn ${activeInns === 2 ? 'active' : ''}`} onClick={() => setActiveInns(2)}>UAE INNS</button>
              </div>
            </div>
          </section>

          {/* Center Control Bar */}
          <div className="market-control-bar">
            <div className="control-bar-inner">
              <i className="icon-pin" title="Pin Market"></i>
              <i className="icon-refresh" title="Refresh Odds"></i>
            </div>
          </div>

          {/* Market Odds Table */}
          <div className="market-section">
            <div className="market-header-bar">
              <h3>Match Odds <span className="tag-inplay">In-Play</span></h3>
              <div className="matched-info">
                <div className="max-pill">Max 8000</div>
                <div className="matched-amount">Matched: <strong>PTH 676,571,907</strong></div>
                <div className="btn-live-tv">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="white" style={{marginRight: '4px'}}>
                    <path d="M14.5 2h-13C.7 2 0 2.7 0 3.5v9c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-9c0-.8-.7-1.5-1.5-1.5zM14 12H2V4h12v8zM5 10l6-3-6-3v6z"/>
                  </svg>
                  Live
                </div>
              </div>
            </div>

            <table className="odds-table">
              <thead>
                <tr className="odds-header-labels">
                  <th className="runner-col" style={{ textAlign: 'left', paddingLeft: '15px' }}>2 selections</th>
                  <th colSpan="3"><div className="back-header-pill" style={{ margin: '0 auto' }}>Back all</div></th>
                  <th colSpan="3"><div className="lay-header-pill" style={{ margin: '0 auto' }}>Lay all</div></th>
                </tr>
              </thead>
              <tbody>
                {marketData.matchOdds.map((runner) => (
                  <tr key={runner.id} className="runner-row">
                    <td className="runner-info-cell">
                      <span className="runner-name">{runner.name}</span>
                    </td>
                    {runner.back.slice().reverse().map((b, i) => (
                      <td key={`b-${i}`} className={`odds-cell back-${3 - i}`} onClick={() => handleBetClick(runner.name, 'Back', b.price)}>
                        <span className="price">{b.price || '-'}</span>
                        <span className="size">{b.size || ''}</span>
                      </td>
                    ))}
                    {runner.lay.map((l, i) => (
                      <td key={`l-${i}`} className={`odds-cell lay-${i + 1}`} onClick={() => handleBetClick(runner.name, 'Lay', l.price)}>
                        <span className="price">{l.price || '-'}</span>
                        <span className="size">{l.size || ''}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bookmaker Market Section */}
          <div className="market-section">
            <div className="market-section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="add-pin">☆</span>
                <span>Bookmaker Market</span>
              </div>
              <span className="comm-tag">Zero Commission</span>
            </div>
            <div className="market-sub-labels">
              <div className="label-box">Min</div>
              <div className="label-val">5.00</div>
              <div className="label-box">Max</div>
              <div className="label-val">39,219.00</div>
            </div>
            <div className="market-sub-head" style={{ background: '#f5f5f5' }}>
              <h4>Bookmaker</h4>
            </div>
            <table className="odds-table bookmaker-table">
              <thead>
                <tr className="odds-header-labels">
                  <th className="runner-col"></th>
                  <th colSpan="3">Back</th>
                  <th colSpan="3">Lay</th>
                </tr>
              </thead>
              <tbody>
                <tr className="runner-row">
                  <td className="runner-info-cell"><span className="runner-name">Canada</span></td>
                  <td colSpan="6" style={{ padding: '0' }}>
                    <div className="suspend-overlay">Suspend</div>
                  </td>
                </tr>
                <tr className="runner-row">
                  <td className="runner-info-cell"><span className="runner-name">United Arab Emirates</span></td>
                  <td className="odds-cell back-3"></td>
                  <td className="odds-cell back-2"></td>
                  <td className="odds-cell back-1">
                    <span className="price">35</span>
                  </td>
                  <td className="odds-cell lay-1">
                    <span className="price">37</span>
                  </td>
                  <td className="odds-cell lay-2"></td>
                  <td className="odds-cell lay-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Win The Toss Section */}
          <div className="market-section">
            <div className="market-section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="add-pin">☆</span>
                <span>Win The Toss</span>
              </div>
              <span className="comm-tag">Zero Commission</span>
            </div>
            <div className="market-sub-labels">
              <div className="label-box">Min</div>
              <div className="label-val">10.00</div>
              <div className="label-box">Max</div>
              <div className="label-val">5,000.00</div>
            </div>
            <table className="odds-table">
              <thead>
                <tr className="odds-header-labels">
                  <th className="runner-col" style={{ textAlign: 'left', paddingLeft: '15px' }}>2 selections</th>
                  <th colSpan="3"><div className="back-header-pill" style={{ margin: '0 auto' }}>Back all</div></th>
                  <th colSpan="3"><div className="lay-header-pill" style={{ margin: '0 auto' }}>Lay all</div></th>
                </tr>
              </thead>
              <tbody>
                {marketData.winTheToss.map((runner) => (
                  <tr key={runner.id} className="runner-row">
                    <td className="runner-info-cell"><span className="runner-name">{runner.name}</span></td>
                    {runner.back.slice().reverse().map((b, i) => (
                      <td key={`b-${i}`} className={`odds-cell back-${3 - i}`} onClick={() => handleBetClick(runner.name, 'Back', b.price, 'Win The Toss')}>
                        <span className="price">{b.price || '-'}</span>
                        <span className="size">{b.size || ''}</span>
                      </td>
                    ))}
                    {runner.lay.map((l, i) => (
                      <td key={`l-${i}`} className={`odds-cell lay-${i + 1}`} onClick={() => handleBetClick(runner.name, 'Lay', l.price, 'Win The Toss')}>
                        <span className="price">{l.price || '-'}</span>
                        <span className="size">{l.size || ''}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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

export default FullMarketCricketPage;
