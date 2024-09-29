import { Suspense } from 'react';
import TripsList from './trips-list/TripsList';
import Suggestions from './suggestions/Suggestions';
import LoadingSuggestions from './suggestions/loading/LoadingSuggestions'; // Loading fallback for suggestions
import LoadingTripsList from './trips-list/loading/LoadingTripsList'; // Loading fallback for trips
import { Metadata } from 'next';
import withAuth from '@/hoc/withAuth'; // Adjust the path to your HOC

// Set page-specific metadata
export const metadata: Metadata = {
  title: 'Trips - Blastey',
  description: 'Explore all available trips',
};

function Trips() {
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
console.log("///////////////////////////////////////////////")
console.log('withAuth:', withAuth); // Add this line
export default withAuth(Trips); // Wrap the component with the withAuth HOC
