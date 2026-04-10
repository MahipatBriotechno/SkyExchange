import React from 'react';
import SportPageWithLayout from '../components/SportPage';

const soccerCompetitions = [
  'England Premier League', 'UEFA Champions League', 'La Liga', 'Bundesliga',
  'Serie A', 'Ligue 1', 'FIFA World Cup'
];
const soccerCountries = ['England', 'Spain', 'Germany', 'Italy', 'France'];

const sampleSoccerMatches = [
  { id: 1, name: 'Brisbane Roar v Wellington Phoenix', status: 'In-Play', matched: 'PTE139K', back1: '2.32', lay1: '2.36', back2: '3.35', lay2: '3.4', back3: '3.55', lay3: '3.65', hasC: true, hasF: true, hasP: true },
  { id: 2, name: 'Melbourne City v Sydney FC', status: '14:05', matched: 'PTE17,776', back1: '2.14', lay1: '2.16', back2: '3.8', lay2: '3.85', back3: '3.55', lay3: '3.65', hasC: true, hasF: true, hasP: true },
  { id: 3, name: 'Atalanta BC SRL v AS Roma SRL', status: '14:30', matched: 'PTE0', back1: '', lay1: '', back2: '--', lay2: '--', back3: '', lay3: '', hasC: true, hasF: true, hasP: true },
];

function SoccerPage() {
  return (
    <SportPageWithLayout
      sport="Soccer"
      kvImage="/images/kv_soccer.jpg"
      competitions={soccerCompetitions}
      countries={soccerCountries}
    />
  );
}

export default SoccerPage;
