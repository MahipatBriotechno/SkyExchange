import React from 'react';
import SportPageWithLayout from '../components/SportPage';

const racingCompetitions = [
  'Horse Racing - Today’s Card', 'ANTEPOST', 'Greyhound Racing'
];

const racingCountries = ['Australia', 'France', 'Ireland', 'New Zealand', 'South Africa', 'UAE', 'United Kingdom', 'United States'];

function HorseRacingPage() {
  return (
    <SportPageWithLayout
      sport="Horse Racing"
      kvImage="/images/banner_horsebook-half.png"
      competitions={racingCompetitions}
      countries={racingCountries}
    />
  );
}

export default HorseRacingPage;