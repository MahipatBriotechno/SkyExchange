import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import BetSlip from '../components/BetSlip';

function MultiMarketsPage() {

  return (
    <Layout>
      <main className="main">
        {/* Left sidebar - simple sports list (no accordion, just links) */}
        <aside className="sidebar sideNav">
          <div className="sideNav__head">Sports</div>
          <div className="sideNav__scroll">
            <Link className="sideNav__item sideNav__item--link" to="/">All Sports</Link>
            <Link className="sideNav__item sideNav__item--link" to="/cricket">Cricket</Link>
            <Link className="sideNav__item sideNav__item--link" to="/soccer">Soccer</Link>
            <Link className="sideNav__item sideNav__item--link" to="/tennis">Tennis</Link>
            <Link className="sideNav__item sideNav__item--link" to="/e-soccer">Esoccer</Link>
            <a className="sideNav__item sideNav__item--link" href="#">Fancybet</a>
            <a className="sideNav__item sideNav__item--link" href="#">Horse Racing</a>
            <a className="sideNav__item sideNav__item--link" href="#">Election</a>
          </div>
        </aside>

        {/* Center column */}
        <div className="center">
          {/* Multi Markets header */}
          <div className="multi-markets-board">
            <h4 className="multi-markets-title">Multi Markets</h4>
            <div className="multi-markets-body">
              <p className="multi-markets-empty">There are currently no followed multi markets.</p>
            </div>
          </div>
        </div>

        {/* Right Bet Slip */}
        <div className="betslip">
          <BetSlip />
        </div>
      </main>
    </Layout>
  );
}

export default MultiMarketsPage;
