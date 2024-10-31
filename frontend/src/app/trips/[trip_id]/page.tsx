import TripDetails from './trip-details/TripDetails';
import { Metadata } from 'next';

// Set page-specific metadata
export const metadata: Metadata = {
  title: 'Sign up - Blastey',
  description: 'Create your account on Blastey and start earning points',
};

// Wrap the Trips component with the withAuth HOC
function Trip() {
  return (
    <main>
        <TripDetails />
    </main>
  );
}

// Export the wrapped component
export default Trip;
