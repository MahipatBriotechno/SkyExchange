import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { marketController } from '../controllers';

function EventRow({ evt }) {
  const isLive = evt.status === 'In-Play';
  return (
    <tr>
      <td className="col-event custom-pl">
        <span className="dot" style={{ display: isLive ? 'inline-block' : 'none' }}></span>
        <a className="event-name" href="#">{evt.name}</a>
        <div className="event-meta">
          <span style={{color: isLive ? '#2a9c39' : '#333'}}>{evt.status}</span>
          {evt.hasE && <span className="tag tag-gray">E</span>}
          {evt.hasS && <span className="tag">S</span>}
          {evt.hasC && <span className="tag">C</span>}
          {evt.hasF && <span className="tag">F</span>}
          {evt.hasP && <span className="tag tag-orange">P</span>}
        </div>
      </td>
      <td className="col-matched custom-w">{evt.matched}</td>
      <td className="col-plus"><span className="plus-btn">+</span></td>
    </tr>
  );
}

function InPlayPage() {
  const [activeTab, setActiveTab] = useState('inplay');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const res = await marketController.getGameList('Cricket,Soccer,Tennis');
        let matchData = [];
        if (res && typeof res === 'object') {
          matchData = Object.values(res).filter(v => typeof v === 'object' && v !== null && (v.MarketId || v.marketid || v.Gid || v.gid));
        } else if (Array.isArray(res)) {
          matchData = res;
        }
        setMatches(matchData);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const parseDate = (str) => {
    if (!str) return null;
    const dateVal = str.includes('T') ? str : str.replace(' ', 'T');
    let d = new Date(dateVal);
    if (isNaN(d.getTime())) {
      const parts = str.split(/[-/ :]/);
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (day <= 31 && month <= 11) {
          const hour = parseInt(parts[3] || '0', 10);
          const minute = parseInt(parts[4] || '0', 10);
          const second = parseInt(parts[5] || '0', 10);
          d = new Date(year, month, day, hour, minute, second);
        }
      }
    }
    return d && !isNaN(d.getTime()) ? d : null;
  };

  const getTimeGroups = () => {
    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const inplay = {};
    const today = {};
    const tomorrow = {};

    matches.forEach(m => {
      let startTimeStr = m.DateTime || m.dateTime || m.Datetime || m.staredtime || m.StartTime || '';
      const startTime = parseDate(startTimeStr);

      if (!startTime) return;

      const isExpired = now.getTime() - startTime.getTime() > 24 * 60 * 60 * 1000;
      if (isExpired) return;

      const sport = m.sportname || m.Type || 'Other';
      
      const team1 = m.Team1 || m.team1;
      const team2 = m.Team2 || m.team2;
      const gName = m.Game_name || m.GameName || m.ename || m.name || m.Competition;
      
      let name = 'Match';
      if (team1 && team2) {
        name = team2 === 'TOURNAMENT_WINNER' ? team1 : `${team1} vs ${team2}`;
      } else if (gName) {
        name = gName;
      }

      const id = m.gid || m.Gid || m.Event_Id || m.eid || m.MarketId || m.marketid;

      const evtObj = {
        id: id || Math.random(),
        name,
        matched: 'PTH0',
        hasE: false, hasS: false, hasC: false, hasF: false, hasP: false
      };

      if (startTime <= now) {
        if (!inplay[sport]) inplay[sport] = [];
        inplay[sport].push({ ...evtObj, status: 'In-Play' });
      } else if (startTime > now && startTime <= todayEnd) {
        if (!today[sport]) today[sport] = [];
        today[sport].push({ ...evtObj, status: startTimeStr.split(' ')[1] || startTimeStr });
      } else if (startTime > todayEnd) {
        if (!tomorrow[sport]) tomorrow[sport] = [];
        tomorrow[sport].push({ ...evtObj, status: startTimeStr.split(' ')[1] || startTimeStr });
      }
    });

    return { inplay, today, tomorrow };
  };

  const groupedMatches = useMemo(() => getTimeGroups(), [matches]);

  const renderGroup = (groupMap) => {
    const sports = Object.keys(groupMap);
    if (sports.length === 0) {
      return <div style={{ padding: '20px', fontWeight: '800' }}>No {loading ? 'events loading...' : 'events found'}</div>;
    }

    return sports.map((sport) => (
      <div key={sport} className="sport-block">
        <div className="sport-head">
          <span>{sport}</span>
          <span className="sport-toggle">▢</span>
        </div>
        <table className="inplay-table">
          <thead>
            <tr>
              <th className="col-event custom-pl">&nbsp;</th>
              <th className="col-matched custom-w">Matched</th>
              <th className="col-plus"></th>
            </tr>
          </thead>
          <tbody>
            {groupMap[sport].map((evt) => (
              <EventRow key={evt.id} evt={evt} />
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  return (
    <Layout>
      <main className="main inplay-layout">
        <section className="left-area padding-btm">
          <div className="subtabs">
            <div className={`subtab ${activeTab === 'inplay' ? 'active' : ''}`} onClick={() => setActiveTab('inplay')}>In-Play</div>
            <div className={`subtab ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>Today</div>
            <div className={`subtab ${activeTab === 'tomorrow' ? 'active' : ''}`} onClick={() => setActiveTab('tomorrow')}>Tomorrow</div>
            <div className="subtab-search"></div>
          </div>

          <div className="tab-content" style={{ display: activeTab === 'inplay' ? 'block' : 'none' }}>
            {renderGroup(groupedMatches.inplay)}
          </div>

          <div className="tab-content" style={{ display: activeTab === 'today' ? 'block' : 'none' }}>
            {renderGroup(groupedMatches.today)}
          </div>

          <div className="tab-content" style={{ display: activeTab === 'tomorrow' ? 'block' : 'none' }}>
             {renderGroup(groupedMatches.tomorrow)}
          </div>
        </section>

        <aside className="right-area">
          <div className="betslip-head">
            <div>Bet Slip</div>
            <div className="minimize">−</div>
          </div>
          <div className="betslip-body">
            Click on the odds to add selections to the betslip.
          </div>
        </aside>
      </main>
    </Layout>
  );
}

export default InPlayPage;

