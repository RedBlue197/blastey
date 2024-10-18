import CreateTripForm from './create-trip-form/CreateTripForm';
import { Metadata } from 'next';

// Set page-specific metadata
export const metadata: Metadata = {
  title: 'Create Trip - Blastey',
  description: 'Create your trip on Blastey',
};

// Wrap the Trips component with the withAuth HOC
function CreateTrip() {
  return (
    <main>
    <CreateTripForm />
    </main>
  );
}

// Export the wrapped component
export default CreateTrip;
