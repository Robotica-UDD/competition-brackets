import React from 'react';
import { BracketPage, generateMockData, Track, Match } from 'simple-beautiful-bracket';

// Let's manually define some initial tracks for a small bracket (e.g., 4 tracks)
const myTracks: Track[] = [
  {
    id: 'track_alpha',
    name: 'Alpha Song',
    images: [{ url: 'https://placehold.co/200x200/FF0000/ffffff?text=A' }],
    artists: [{ name: 'Artist One' }],
  },
  {
    id: 'track_beta',
    name: 'Beta Tune',
    images: [{ url: 'https://placehold.co/200x200/00FF00/ffffff?text=B' }],
    artists: [{ name: 'Artist Two' }],
  },
  {
    id: 'track_gamma',
    name: 'Gamma Groove',
    images: [{ url: 'https://placehold.co/200x200/0000FF/ffffff?text=C' }],
    artists: [{ name: 'Artist Three' }],
  },
  {
    id: 'track_delta',
    name: 'Delta Beat',
    images: [{ url: 'https://placehold.co/200x200/FFFF00/000000?text=D' }],
    artists: [{ name: 'Artist Four' }],
  },
];
// Assuming BracketPage, generateMockData, Track, Match are imported from 'simple-beautiful-bracket'

function MyCustomBracketApp() {
  const [bracketData, setBracketData] = React.useState<{ rounds: Match[][]; winners: Track[][] } | null>(null);

  React.useEffect(() => {
    // Generate data for 8 tracks when the component mounts
    setBracketData(generateMockData(8)); //
  }, []);

  if (!bracketData) {
    return <div>Loading bracket...</div>;
  }

  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ textAlign: 'center', padding: '20px', fontSize: '2em' }}>My Tournament</h1>
      <BracketPage rounds={bracketData.rounds} winners={bracketData.winners} />
    </div>
  );
}

export default MyCustomBracketApp;