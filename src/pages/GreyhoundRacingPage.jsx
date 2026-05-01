import React from 'react';
import SportPageWithLayout from '../components/SportPage';

const greyhoundCompetitions = [
  'Greyhound Racing - Today’s Card', 'ANTEPOST'
];

const greyhoundCountries = ['Australia', 'United Kingdom', 'Ireland', 'United States', 'New Zealand'];

function GreyhoundRacingPage() {
  return (
    <SportPageWithLayout
      sport="Greyhound Racing"
      kvImage="/images/banner_horsebook-half.png" // Reusing similar banner if specific one not available
      competitions={greyhoundCompetitions}
      countries={greyhoundCountries}
    />
  );
}

export default GreyhoundRacingPage;
