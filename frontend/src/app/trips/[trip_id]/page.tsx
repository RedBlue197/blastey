"use client"; // Ensures this component is treated as a client component
import React, { useEffect, useState } from 'react';
import TripDetails from './trip-details/TripDetails';

function Trip({ params }: { params: { trip_id: string } }) {
  const { trip_id } = params; // Access trip_id directly from params
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (trip_id) {
      import('@/services/internal_services/trip_api_handler').then(({ getTripById }) => {
        setLoading(true);
        getTripById(trip_id)
          .then((response) => response.data)
          .then((data) => {
            setTrip(data);
            setLoading(false);
          })
          .catch((err) => {
            setError('Failed to load trip details.');
            setLoading(false);
          });
      });
    } else {
      setError('Trip ID not found in URL.');
      setLoading(false);
    }
  }, [trip_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main>
      {trip ? <TripDetails trip={trip} /> : <div>Trip details not available.</div>}
    </main>
  );
}

export default Trip;
