import UpdateTripForm from './update-trip-form/UpdateTripForm';
import { Metadata } from 'next';

// Set page-specific metadata
export const metadata: Metadata = {
  title: 'Create Trip - Blastey',
  description: 'Create your trip on Blastey',
};

// Wrap the Trips component with the withAuth HOC
function UpdateTrip() {
  return (
    <main>
    <UpdateTripForm />
    </main>
  );
}

// Export the wrapped component
export default UpdateTrip;
