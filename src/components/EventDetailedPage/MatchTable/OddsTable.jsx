import React from 'react';

const OddsTable = ({ marketData, onBetClick, marketName = 'Match Odds' }) => {
  const oddsWidth = '114.688px';
  const uniformHeight = '35px';

  const baseFont = {
    fontFamily: 'Tahoma, Helvetica, sans-serif',
    fontSize: '12px',
    lineHeight: '15px',
    fontWeight: '400',
    letterSpacing: 'normal'
  };

  const cellStyle = (bgColor) => ({
    width: oddsWidth,
    minWidth: oddsWidth,
    height: uniformHeight,
    backgroundColor: bgColor,
    textAlign: 'center',
    cursor: 'pointer',
    borderRight: '1px solid #fff',
    borderBottom: '1px solid #fff',
    verticalAlign: 'middle',
    padding: '2px 0',
    ...baseFont
  });

  const headerTabStyle = (bgColor, textColor, isBack) => ({
    height: '20px',
    width: '100%',
    backgroundColor: bgColor,
    color: textColor || '#1e1e1e',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    marginTop: '0px',
    border: '1px solid rgba(0,0,0,0.08)',
    borderBottom: 'none',
    clipPath: isBack
      ? 'polygon(10px 0, 100% 0, 100% 100%, 0 100%)'
      : 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)'
  });

  return (
    <div style={{ width: '100%', marginBottom: '16px' }}>

      {/* HEADER SECTION */}
      {marketName === 'Match Odds' ? (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fff',
          border: '1px solid #d9d9d9',
          borderBottom: 'none',
          height: '42px',
          position: 'relative',
          ...baseFont
        }}>
          {/* Left Section */}
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <div style={{
              background: '#cfd8dc',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              fontWeight: '700',
              color: '#2b3a47'
            }}>
              Match Odds
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#2aa84a',
              fontWeight: '600',
              marginLeft: '15px'
            }}>
              <span style={{ width: '12px', height: '12px' }}>
                <img src="/icons/in-play.svg" alt="" style={{ width: '100%' }} />
              </span>
              In-Play
            </div>
          </div>

          {/* Center Section (Max 8000) */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#cfd8dc',
            padding: '2px 10px',
            borderRadius: '4px',
            fontFamily: 'Tahoma, Helvetica, sans-serif',
            fontSize: '12px',
            lineHeight: '16px',
            fontWeight: '400',
            letterSpacing: 'normal',
            color: '#1E1E1E'
          }}>
            Max 8000
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', paddingRight: '10px' }}>
            <div style={{ color: '#2b3a47', fontWeight: '400' }}>
              Matched <span style={{ fontWeight: '700' }}>PTH 676,521,907</span>
            </div>

            <div style={{
              background: '#1f6f8b',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '3px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <span style={{ fontSize: '14px' }}>📺</span>
              Live
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#1f2933] text-white flex items-center px-3 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          <span className="font-bold text-sm">{marketName}</span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="text-sm text-gray-300">Zero Commission</span>
        </div>
      )}

      {/* TABLE */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#e4e7ed',
        border: '1px solid #d9d9d9'
      }}>

        <thead>
          <tr style={{
            height: '32px',
            color: '#1e1e1e',
            borderBottom: '1px solid #d9d9d9',
            ...baseFont
          }}>
            <th style={{ textAlign: 'left', paddingLeft: '12px' }}>
              2 selections
            </th>
            <th style={{ width: oddsWidth, textAlign: 'center', fontWeight: '700' }}>
              100.7%
            </th>
            <th style={{ width: oddsWidth }}></th>
            <th style={{ width: oddsWidth, padding: 0, verticalAlign: 'bottom' }}>
              <div style={{ overflow: 'hidden', borderTopLeftRadius: '6px' }}>
                <div style={headerTabStyle('#72bbef', '#1e1e1e', true)}>
                  Back all
                </div>
              </div>
            </th>
            <th style={{ width: oddsWidth, padding: 0, verticalAlign: 'bottom' }}>
              <div style={{ overflow: 'hidden', borderTopRightRadius: '6px' }}>
                <div style={headerTabStyle('#faa9ba', '#1e1e1e', false)}>
                  Lay all
                </div>
              </div>
            </th>
            <th style={{ width: oddsWidth }}></th>
            <th style={{ width: oddsWidth, textAlign: 'right', paddingRight: '12px', fontWeight: '700' }}>
              99%
            </th>
          </tr>
        </thead>

        <tbody style={{ backgroundColor: 'white' }}>
          <tr style={{ height: uniformHeight, borderBottom: '1px solid #e4e7ed' }}>
            <td style={{ paddingLeft: '16px', fontWeight: '700', color: '#2b3a47', borderRight: '1px solid #e4e7ed' }}>
              Canada
            </td>
            <td style={cellStyle('#e2f2fe')}>
              <div style={{ fontWeight: '700' }}>1.17</div>
              <div style={{ fontSize: '10px', color: '#707c8a' }}>213K</div>
            </td>
            <td style={cellStyle('#add8f4')}>
              <div style={{ fontWeight: '700' }}>1.18</div>
              <div style={{ fontSize: '10px', color: '#707c8a' }}>24,332</div>
            </td>
            <td style={cellStyle('#72bbef')}>
              <div style={{ fontWeight: '700' }}>1.19</div>
              <div style={{ fontSize: '10px' }}>24,872</div>
            </td>
            <td style={cellStyle('#faa9ba')}>
              <div style={{ fontWeight: '700' }}>1.2</div>
              <div style={{ fontSize: '10px' }}>63,093</div>
            </td>
            <td style={cellStyle('#fbcbd5')}>
              <div style={{ fontWeight: '700' }}>1.21</div>
              <div style={{ fontSize: '10px', color: '#707c8a' }}>85,088</div>
            </td>
            <td style={{ ...cellStyle('#fde4ea'), borderRight: 'none' }}>
              <div style={{ fontWeight: '700' }}>1.22</div>
              <div style={{ fontSize: '10px', color: '#707c8a' }}>165K</div>
            </td>
          </tr>

          <tr style={{ height: uniformHeight }}>
            <td style={{ paddingLeft: '16px', fontWeight: '700', color: '#2b3a47', borderRight: '1px solid #e4e7ed' }}>
              United Arab Emirates
            </td>
            <td style={cellStyle('#e2f2fe')}>
              <div style={{ fontWeight: '700' }}>5.6</div>
              <div style={{ fontSize: '10px', color: '#707c8a' }}>188</div>
            </td>
            <td style={cellStyle('#add8f4')}>
              <div style={{ fontWeight: '700' }}>5.7</div>
              <div style={{ fontSize: '10px', color: '#707c8a' }}>18,483</div>
            </td>
            <td style={cellStyle('#72bbef')}>
              <div style={{ fontWeight: '700' }}>6</div>
              <div style={{ fontSize: '10px' }}>12,670</div>
            </td>
            <td style={cellStyle('#faa9ba')}>
              <div style={{ fontWeight: '700' }}>6.4</div>
              <div style={{ fontSize: '10px' }}>4,680</div>
            </td>
            <td style={cellStyle('#fbcbd5')}>
              <div style={{ fontWeight: '700' }}>6.6</div>
              <div style={{ fontSize: '10px', color: '#707c8a' }}>4,347</div>
            </td>
            <td style={{ ...cellStyle('#fde4ea'), borderRight: 'none' }}>
              <div style={{ fontWeight: '700' }}>6.8</div>
              <div style={{ fontSize: '10px', color: '#707c8a' }}>5</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OddsTable;