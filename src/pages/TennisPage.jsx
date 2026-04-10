import React from 'react';
import SportPageWithLayout from '../components/SportPage';

const tennisCompetitions = [
  'ATP Australian Open', 'ATP Wimbledon', 'ATP French Open',
  'US Open', 'Davis Cup', 'ATP Finals'
];
const tennisCountries = ['Australia', 'UK', 'France', 'USA', 'Spain'];

const sampleTennisMatches = [
  { id: 1, name: 'Laura Pigossi(1) 0 - 0 (1)Lilli Tagger', status: 'In-Play', matched: 'PTE179K', back1: '', lay1: '', back3: '', lay3: '', hasC: true, hasF: true, hasP: true },
  { id: 2, name: 'Matteo Arnaldi(1) 0 - 2 (0)Hugo Gaston', status: 'In-Play', matched: 'PTE89,819', back1: '', lay1: '', back3: '', lay3: '', hasC: true, hasF: true, hasP: true },
  { id: 3, name: 'Storm Hunter v Malene Helgo', status: 'In-Play', matched: 'PTE6,009', back1: '', lay1: '', back3: '', lay3: '', hasC: true, hasF: true, hasP: true },
  { id: 4, name: 'Alex De Minaur v Casper Ruud', status: '13:30', matched: 'PTE120K', back1: '', lay1: '', back3: '', lay3: '', hasC: true, hasF: true, hasP: true },
];

function TennisPage() {
  return (
    <SportPageWithLayout
      sport="Tennis"
      kvImage="/images/kv_tennis.jpg"
      competitions={tennisCompetitions}
      countries={tennisCountries}
    />
  );
}

export default TennisPage;
