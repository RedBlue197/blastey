import CreateTripForm from './create-trip-form/CreateTripForm';
import { Metadata } from 'next';
import { TripProvider } from '@/context/CreateTripContext'; // Adjust the import based on your file structure

// Set page-specific metadata
export const metadata: Metadata = {
  title: 'Create Trip - Blastey',
  description: 'Create your trip on Blastey',
};

// Wrap the CreateTripForm with TripProvider to manage state
function CreateTrip() {
  return (
    <TripProvider>
      <main>
        <CreateTripForm />
      </main>
    </TripProvider>
  );
}

// Export the wrapped component
export default CreateTrip;
