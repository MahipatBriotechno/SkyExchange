import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import InPlayPage from './pages/InPlayPage';
import MultiMarketsPage from './pages/MultiMarketsPage';
import CricketPage from './pages/CricketPage';
import SoccerPage from './pages/SoccerPage';
import TennisPage from './pages/TennisPage';
import ESoccerPage from './pages/ESoccerPage';
import SportsPage from './pages/SportsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/Account/ProfilePage';
import BalanceOverviewPage from './pages/Account/BalanceOverviewPage';
import BetsHistoryPage from './pages/Account/BetsHistoryPage';
import AccountStatementPage from './pages/Account/AccountStatementPage';
import ActivityLogPage from './pages/Account/ActivityLogPage';
import HorseRacingPage from './pages/HorseRacingPage';
import FullMarketHorseRacingPage from './pages/FullMarketHorseRacingPage';
import FullMarketCricketPage from './pages/FullMarketCricketPage';
import FullMarketSoccerPage from './pages/FullMarketSoccerPage';
import FullMarketTennisPage from './pages/FullMarketTennisPage';
import FullMarketESoccerPage from './pages/FullMarketESoccerPage';
import EventDetailedPage from './pages/EventDetailedPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/index" element={<HomePage />} />
        <Route path="/in-play" element={<InPlayPage />} />
        <Route path="/multi-markets" element={<MultiMarketsPage />} />
        <Route path="/cricket" element={<CricketPage />} />
        <Route path="/soccer" element={<SoccerPage />} />
        <Route path="/tennis" element={<TennisPage />} />
        <Route path="/e-soccer" element={<ESoccerPage />} />
        <Route path="/horse-racing" element={<HorseRacingPage />} />
        <Route path="/full-market-horse-racing" element={<FullMarketHorseRacingPage />} />
        <Route path="/full-market-cricket" element={<FullMarketCricketPage />} />
        <Route path="/full-market-soccer" element={<FullMarketSoccerPage />} />
        <Route path="/full-market-tennis" element={<FullMarketTennisPage />} />
        <Route path="/full-market-e-soccer" element={<FullMarketESoccerPage />} />
        <Route path="/event-detail/:matchId" element={<EventDetailedPage />} />
        <Route path="/:sport/:matchId" element={<EventDetailedPage />} />
        <Route path="/sports" element={<SportsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/balance-overview" element={<BalanceOverviewPage />} />
        <Route path="/bets" element={<BetsHistoryPage />} />
        <Route path="/statement" element={<AccountStatementPage />} />
        <Route path="/activity-log" element={<ActivityLogPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
