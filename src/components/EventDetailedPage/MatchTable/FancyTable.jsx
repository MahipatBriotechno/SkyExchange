import React, { useState } from 'react';

/**
 * FancyTable Component
 *
 * Matches the Sky247 Fancy Bet table UI:
 * - Teal header bar with "Fancy Bet" title and info icon
 * - Filter tabs: All | Fancy | Ball by Ball | Khadda | Lottery | Odd/Even
 * - Dark pinned sub-header "Fancy Bet"
 * - Column labels: Nos (pink/lay) | Yess (blue/back)
 * - Each row: market name | Nos cell (pink) | Yess cell (blue) | Min/Max info
 */

const FILTER_TABS = ['All', 'Fancy', 'Ball by Ball', 'Khadda', 'Lottery', 'Odd/Even'];

const DEMO_MARKETS = [
  { id: 1, name: '20 Over UAE', nos: 137, nosRate: 100, yess: 139, yessRate: 100, min: '1.00', max: '781.00' },
  { id: 2, name: '18 Over NEP', nos: 102, nosRate: 100, yess: 103, yessRate: 100, min: '1.00', max: '500.00' },
  { id: 3, name: '6 Over Run UAE', nos: 42, nosRate: 100, yess: 44, yessRate: 100, min: '1.00', max: '300.00' },
];

const FancyTable = ({ fancyData, onBetClick }) => {
  const [activeTab, setActiveTab] = useState('All');

  const markets = fancyData && fancyData.length > 0 ? fancyData : DEMO_MARKETS;

  return (
    <div style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '13px', marginBottom: '8px' }}>

      {/* ── Header row: dark outer, limited-width teal badge ── */}
      <div style={{
        background: '#243a48',
        display: 'flex',
        alignItems: 'center',
        padding: '4px 8px',
        gap: '6px',
      }}>
        {/* Limited-width teal badge containing clock + label */}
        <div style={{
          background: '#1a8a8a',
          color: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 10px 3px 6px',
          borderRadius: '2px',
        }}>
          {/* Green clock icon */}
          <span style={{
            background: '#4caf50',
            borderRadius: '50%',
            width: '17px',
            height: '17px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            flexShrink: 0,
          }}>⏱</span>
          <span style={{ fontWeight: 'bold', fontSize: '13px', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
            Fancy Bet
          </span>
        </div>
        {/* Info icon — outside the badge */}
        <span style={{
          border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: '50%',
          width: '16px',
          height: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.75)',
          flexShrink: 0,
        }}>i</span>
      </div>

      {/* ── Filter tabs row (matches special_bets-tab reference) ── */}
      <div style={{
        background: '#1a8a8a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 8px', // Symmetrical padding for vertical centering
        minHeight: '32px',
      }}>
        {/* Auto-width pill container: rgba(255,255,255,0.5), border-radius 5px */}
        <ul style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'auto',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '5px',
          margin: '0', // Removed asymmetrical margin
          padding: '0',
          listStyle: 'none',
          gap: '0',
          height: '24px', // Fixed height to prevent shaking
        }}>
          {FILTER_TABS.map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                borderRadius: '5px',
                background: activeTab === tab ? '#ffffff' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <a style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 12px',
                fontSize: '12px',
                fontWeight: '600', // Constant font weight to prevent horizontal shaking
                color: activeTab === tab ? '#1a8a8a' : '#076875',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                userSelect: 'none',
                height: '100%',
              }}>
                {tab}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Dark pinned sub-header ── */}
      <div style={{
        background: '#243a48',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '5px 8px',
        gap: '6px',
        fontWeight: 'bold',
        fontSize: '13px',
      }}>
        <span style={{ fontSize: '14px' }}>📌</span>
        <span>Fancy Bet</span>
      </div>

      {/* ── Column header row ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
      }}>
        {/* Left spacer (market name column) */}
        <div style={{ flex: 1 }} />
        {/* Nos header */}
        <div style={{
          width: '72px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '12px',
          color: '#333',
          padding: '4px 0',
        }}>
          Nos
        </div>
        {/* Yess header */}
        <div style={{
          width: '72px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '12px',
          color: '#333',
          padding: '4px 0',
        }}>
          Yess
        </div>
        {/* Min/Max spacer */}
        <div style={{ width: '80px' }} />
      </div>

      {/* ── Market rows ── */}
      <div style={{ background: '#fff' }}>
        {markets.map((market, idx) => (
          <div
            key={market.id ?? idx}
            style={{
              display: 'flex',
              alignItems: 'stretch',
              borderBottom: '1px solid #e8e8e8',
              minHeight: '40px',
            }}
          >
            {/* Market name */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              padding: '4px 8px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#222',
            }}>
              {market.name}
            </div>

            {/* Nos (Lay / pink) cell */}
            <div
              onClick={() => onBetClick && onBetClick({ ...market, side: 'nos' })}
              style={{
                width: '72px',
                background: '#faa9ba',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderLeft: '1px solid #fff',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <span style={{ fontWeight: 'bold', fontSize: '14px', lineHeight: 1.1, color: '#000' }}>
                {market.nos}
              </span>
              <span style={{ fontSize: '11px', color: '#444', lineHeight: 1.1 }}>
                {market.nosRate}
              </span>
            </div>

            {/* Yess (Back / blue) cell */}
            <div
              onClick={() => onBetClick && onBetClick({ ...market, side: 'yess' })}
              style={{
                width: '72px',
                background: '#72bbef',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderLeft: '1px solid #fff',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <span style={{ fontWeight: 'bold', fontSize: '14px', lineHeight: 1.1, color: '#000' }}>
                {market.yess}
              </span>
              <span style={{ fontSize: '11px', color: '#444', lineHeight: 1.1 }}>
                {market.yessRate}
              </span>
            </div>

            {/* Min/Max info */}
            <div style={{
              width: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              fontSize: '10px',
              color: '#777',
              textAlign: 'center',
              lineHeight: 1.4,
            }}>
              Min/Max
              <br />
              {market.min} / {market.max}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FancyTable;
