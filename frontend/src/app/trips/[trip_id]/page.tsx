"use client";
import { useEffect, useState } from 'react';
import { Trip } from '@/types/trip'; // Importing Trip interface
import { fetchTripById } from '@/services/internal_services/trip_api_handler'; // Assuming you're fetching trip from your internal service
import { UUID } from 'crypto';

interface TripDetailProps {
  params: { trip_id: UUID };
}

const TripDetails = ({ params }: TripDetailProps) => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    if (params.trip_id) {
      setLoading(true); // Set loading to true when fetching begins
      fetchTripById(params.trip_id)
        .then((response) => {
          setTrip(response.data); // Directly set the fetched data into the trip state
          setLoading(false); // Set loading to false once data is fetched
        })
        .catch((err) => {
          console.error('Error fetching trip details:', err);
          setError('Trip not found');
          setLoading(false); // Stop loading on error
        });
    }
  }, [params.trip_id]); // Include params.id in the dependency array

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error handling
  if (error) {
    return <div>{error}</div>;
  }

  // If trip data is null after loading
  if (!trip) {
    return <div>No trip found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="page-title">Trip Details</h1>
      <h1 className="text-3xl font-bold">{trip.trip_title || 'No Title Available'}</h1> {/* Use fallback in case title is missing */}
      <img
        src={trip.trip_image || '/placeholder-image.png'}  // Use a placeholder image if trip_image is missing
        alt={trip.trip_title || 'Trip Image'}
        className="w-full h-auto mt-4"
      />
      <p className="mt-4 text-lg">{trip.trip_description || 'No Description Available'}</p>

      {/* Host information */}
      {trip.host && (
        <div className="mt-4 p-4 border rounded-md shadow-sm bg-gray-100">
          <h2 className="text-2xl font-semibold">Host Information</h2>
          <p className="mt-2">Host Name: {trip.host.user_name || 'Unknown'}</p>
          <p className="mt-2">Host Email: {trip.host.user_email || 'Not provided'}</p>
          <p className="mt-2">Host Phone Number: {trip.host.user_phone_number || 'Not provided'}</p>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
