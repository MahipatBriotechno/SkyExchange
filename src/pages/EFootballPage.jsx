import React from 'react';
import SportPageWithLayout from '../components/SportPage';

const efootballCompetitions = [
  'E-Football Bundesliga', 'E-Football Premier League', 'E-Football Champions League'
];
const efootballCountries = ['Germany', 'England', 'Spain'];

function EFootballPage() {
  return (
    <SportPageWithLayout
      sport="E-Football"
      kvImage="/images/kv_e-soccer.jpg"
      competitions={efootballCompetitions}
      countries={efootballCountries}
    />
  );
}

export default EFootballPage;
