import React from 'react';
import SportPageWithLayout from '../components/SportPage';

const footballCompetitions = [
  'England Premier League', 'UEFA Champions League', 'La Liga', 'Bundesliga',
  'Serie A', 'Ligue 1', 'FIFA World Cup'
];
const footballCountries = ['England', 'Spain', 'Germany', 'Italy', 'France'];

function FootballPage() {
  return (
    <SportPageWithLayout
      sport="Football"
      kvImage="/images/kv_soccer.jpg"
      competitions={footballCompetitions}
      countries={footballCountries}
    />
  );
}

export default FootballPage;
