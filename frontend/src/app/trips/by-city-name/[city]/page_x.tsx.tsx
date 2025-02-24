// trips/by-city-name/[city].tsx

"use client";
import { useRouter } from 'next/navigation';
import TripsList from '@/app/trips/trips-list/TripsList'; // Adjust the path as needed
import React from 'react';

function TripsByCity({ params }: { params: { city: string } }) {
  const router = useRouter();
  const { city } = params; // Access trip_id directly from params

  // You can use the `city` to fetch data or filter your trip list
  if (!city) return <div>Loading...</div>; // Show a loading state until `city` is available

  return (
    <div>
      {/* Pass the `city` to your `TripsList` component if needed */}
      <TripsList cityName={city as string} />
    </div>
  );
};

export default TripsByCity;
