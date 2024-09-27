import { Suspense } from 'react';
import TripsList from './trips-list/TripsList';
import Suggestions from './suggestions/Suggestions';
import LoadingSuggestions from './suggestions/loading/LoadingSuggestions'; // Loading fallback for suggestions
import LoadingTripsList from './trips-list/loading/LoadingTripsList'; // Loading fallback for trips
import { Metadata } from 'next';

// Set page-specific metadata
export const metadata: Metadata = {
  title: 'Trips - Blastey',
  description: 'Explore all available trips',
};

export default function Trips() {
  return (
    <main>
      <Suspense fallback={<LoadingSuggestions />}>
        <Suggestions />
      </Suspense>

      <Suspense fallback={<LoadingTripsList />}>
        <TripsList />
      </Suspense>
    </main>
  );
}
