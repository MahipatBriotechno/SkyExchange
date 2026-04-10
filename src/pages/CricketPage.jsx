import React from 'react';
import SportPageWithLayout from '../components/SportPage';

const cricketCompetitions = [
  'Australia NCL Women', 'Bangladesh Premier League', 'BBL', 'CWI T20 Blaze',
  'Falcons Champions Trophy T20', 'ICC U19 World Cup', 'ICC Under 19 WC Warm Up Matches',
  'One Day Internationals', 'SA20', 'Super Smash T20', 'Vijay Hazare Trophy',
  "Women's Premier League", 'Womens Super Smash T20'
];

const cricketCountries = ['Australia', 'India', 'Pakistan', 'England', 'South Africa', 'New Zealand'];

function CricketPage() {
  return (
    <SportPageWithLayout
      sport="Cricket"
      kvImage="/images/kv_cricket.jpg"
      competitions={cricketCompetitions}
      countries={cricketCountries}
    />
  );
}

export default CricketPage;
