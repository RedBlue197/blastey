import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Trip } from '@/types/trip'; // Importing Trip interface
import { fetchTripById } from '@/services/internal_services/trip_api_handler'; // Assuming you're fetching trip from your internal service
import { UUID } from 'crypto';

interface TripDetailProps {
  trip: Trip;
}

const TripDetails = ({ trip }: TripDetailProps) => {
  const router = useRouter();

  // WhatsApp contact link
  const whatsappLink = `https://wa.me/${trip.host.user_phone_number}?text=Hello! I'm interested in your trip to ${trip.trip_title}.`;

  if (!trip) {
    return <div>Trip not found!</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <button className="backButton" onClick={() => router.back()}>
        &larr; Back
      </button>

      <h1 className="text-3xl font-bold">{trip.trip_title}</h1>
      <img src={trip.trip_image} alt={trip.trip_title} className="w-full h-auto mt-4" />
      <p className="mt-4 text-lg">{trip.trip_description}</p>

      {/* Rating for the trip */}
      <p className="mt-4 text-lg">Rating: {trip.rating} / 5</p>

      {/* Trip Openings */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Trip Openings</h2>
        {trip.trip_openings.length > 0 ? (
          trip.trip_openings.map((opening, index) => (
            <div key={index} className="mt-4 p-4 border rounded-md shadow-sm bg-white">
              <h3 className="text-xl font-bold">{opening.opening_title}</h3>
              <p className="mt-2">Date: {opening.opening_date}</p>
              <p className="mt-2">Opening Price: ${opening.opening_price}</p>
              <p className="mt-2">Rating: {opening.opening_rating} / 5</p>

              {/* Trip Opening Items */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Available Items:</h4>
                {opening.items.length > 0 ? (
                  <ul className="list-disc pl-6 mt-2">
                    {opening.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="mt-2">
                        <p>
                          <strong>{item.item_name}:</strong> {item.item_description} (${item.price})
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No items available for this trip opening.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No trip openings available.</p>
        )}
      </div>

      {/* Host information */}
      <div className="mt-8 p-4 border rounded-md shadow-sm bg-gray-100">
        <h2 className="text-2xl font-semibold">Host Information</h2>
        <p className="mt-2">Host Name: {trip.host.user_name}</p>
        <p className="mt-2">Host Email: {trip.host.user_email}</p>
        <p className="mt-2">Host Phone Number: {trip.host.user_phone_number}</p>
        <p className="mt-2">Host Overall Rating: {trip.host.overall_rating} / 5</p>
      </div>

      {/* WhatsApp Contact Button */}
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsappButton">
        Contact via WhatsApp
      </a>
    </div>
  );
};

// This will fetch the trip data on each request (for server-side rendering)
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { trip_id } = context.params as { trip_id: UUID }; // Type for id param

  try {
    // Fetch the trip details using your API handler (use your own API service logic)
    const trip = await fetchTripById(trip_id);

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
