import { Suspense } from 'react';
import TripsList from './trips-list/TripsList';
import LoadingTripsList from './trips-list/loading/LoadingTripsList'; // Loading fallback for trips
import { Metadata } from 'next';

// Set page-specific metadata
export const metadata: Metadata = {
  title: 'Manage Trips - Blastey',
  description: 'Manage your trips on Blastey',
};

// Wrap the Trips component with the withAuth HOC
function Trips() {
  return (
    <main>
      <Suspense fallback={<LoadingTripsList />}>
        <TripsList />
      </Suspense>
    </main>
  );
}

// Export the wrapped component
export default Trips;
