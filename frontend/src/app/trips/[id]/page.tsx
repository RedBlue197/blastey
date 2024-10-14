import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Trip } from '@/types/trip'; // Importing Trip interface
import { fetchTripById } from '@/services/internal_services/trip_api_handler'; // Assuming you're fetching trip from your internal service

interface TripDetailProps {
  trip: Trip;
}

const TripDetails = ({ trip }: TripDetailProps) => {
  if (!trip) {
    return <div>Trip not found!</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{trip.trip_title}</h1>
      <img src={trip.trip_image} alt={trip.trip_title} className="w-full h-auto mt-4" />
      <p className="mt-4 text-lg">{trip.trip_description}</p>

      {/* Host information */}
      <div className="mt-4 p-4 border rounded-md shadow-sm bg-gray-100">
        <h2 className="text-2xl font-semibold">Host Information</h2>
        <p className="mt-2">Host Name: {trip.host.user_name}</p>
        <p className="mt-2">Host Email: {trip.host.user_email}</p>
        <p className="mt-2">Host Phone Number: {trip.host.user_phone_number}</p>
      </div>
    </div>
  );
};

// This will fetch the trip data on each request (for server-side rendering)
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string }; // Type for id param

  try {
    // Fetch the trip details using your API handler (use your own API service logic)
    const trip = await fetchTripById(id);

    if (!trip) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        trip,
      },
    };
  } catch (error) {
    console.error('Error fetching trip details:', error);
    return {
      notFound: true,
    };
  }
};

export default TripDetails;
