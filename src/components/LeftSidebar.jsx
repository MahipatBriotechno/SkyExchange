import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { marketController } from '../controllers';

function LeftSidebar({ sport, competitions = [], countries = [] }) {
  const [openAccordions, setOpenAccordions] = useState({});
  const [compMatches, setCompMatches] = useState({});

  const getDisplayName = (obj) => {
    if (!obj) return 'Unknown';
    if (typeof obj === 'string') return obj;
    return obj.Competition_Name || obj.CompetitionName || obj.name || obj.ename || obj.Competition || 'Unknown';
  };

  const toggleAccordion = async (key, code) => {
    const isOpening = !openAccordions[key];
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: isOpening,
    }));

    if (isOpening && code && !compMatches[key]) {
      try {
        const res = await marketController.getCompetitionGames(code);
        if (Array.isArray(res)) {
          setCompMatches(prev => ({ ...prev, [key]: res }));
        } else if (res && typeof res === 'object') {
          const list = Object.values(res).filter(v => typeof v === 'object' && v !== null);
          setCompMatches(prev => ({ ...prev, [key]: list }));
        }
      } catch (err) {
        console.error('Failed to fetch comp games:', err);
      }
    }
  };

  return (
    <aside className="sidebar sideNav">
      <div className="sideNav__head">Sports</div>
      <div className="sideNav__scroll">
        <Link className="sideNav__item" to="/in-play">All Sports</Link>
        <a className="sideNav__item sideNav__item--active" href="#">{sport}</a>

        {competitions.length > 0 && (
          <>
            <div className="sideNav__section">Top Competitions</div>
            {competitions.map((comp, idx) => {
              const compName = getDisplayName(comp);
              const compCode = comp.Competition_Code || comp.CompetitionCode || comp.code;
              const keyId = compCode || String(compName).replace(/\s+/g, '-').toLowerCase();
              const key = `comp-${keyId}-${idx}`;
              const isOpen = openAccordions[key];
              const matches = compMatches[key] || [];

              return (
                <div className="sideNav__acc" key={key}>
                  <button
                    className={`sideNav__item sideNav__toggle${isOpen ? ' open' : ''}`}
                    type="button"
                    onClick={() => toggleAccordion(key, compCode)}
                  >
                    {compName}
                    <span className="sideNav__arrow">{isOpen ? '▴' : '▾'}</span>
                  </button>
                  {isOpen && (
                    <div className="sideNav__sub">
                      {matches.length > 0 ? (
                        matches.map((m, mIdx) => (
                          <a key={mIdx} className="sideNav__subItem" href="#">
                            {getDisplayName(m)}
                          </a>
                        ))
                      ) : (
                        <div className="sideNav__subItem" style={{ opacity: 0.6 }}>Loading games...</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {countries.length > 0 && (
          <>
            <div className="sideNav__section">Top Countries</div>
            {countries.map((country, idx) => {
              const countryName = getDisplayName(country);
              const keyId = String(countryName).replace(/\s+/g, '-').toLowerCase();
              const key = `country-${keyId}-${idx}`;
              const isOpen = openAccordions[key];
              return (
                <div className="sideNav__acc" key={key}>
                  <button
                    className={`sideNav__item sideNav__toggle${isOpen ? ' open' : ''}`}
                    type="button"
                    onClick={() => toggleAccordion(key)}
                  >
                    {countryName}
                    <span className="sideNav__arrow">{isOpen ? '▴' : '▾'}</span>
                  </button>
                  {isOpen && (
                    <div className="sideNav__sub">
                      <div className="sideNav__subItem" style={{ opacity: 0.6 }}>No events available</div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </aside>
  );
}

export default LeftSidebar;
