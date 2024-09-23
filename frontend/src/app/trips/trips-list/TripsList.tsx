"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './TripsList.module.css'; // Import your CSS module for styling
import { fetchTrips } from '@/services/trip_api_handler'; // Adjust the import path

// Define TypeScript interfaces for your data
interface Trip {
  id: string;
  name: string;
  picture: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  rating: number;
  title: string;
  description: string;
  price: number;
}

const TripsList = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch trips data from the API
  useEffect(() => {
    const token = null; // Replace with actual token logic if needed
    const getTrips = async () => {
      try {
        const data = await fetchTrips(token).then(
          (response) => {
            setTrips(response.data); // Set the fetched trips
          }
        ); // Call the fetchTrips function
      } catch (error) {
        setError('Error fetching trips.'); // Set error message
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    getTrips(); // Call the async function
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <p>Loading trips...</p>; // Loading state
  if (error) return <p>{error}</p>; // Error handling

  return (
    <div className={styles.container}>
      <h1>Traveller Trips</h1>
      <div className={styles.tripList}>
        {trips.map(trip => (
          <Link key={trip.id} href={`/trips/${trip.id}`}>
            <div className={styles.tripCard}>
              <img src={trip.picture} alt={`${trip.name}'s picture`} className={styles.picture} />
              <div className={styles.details}>
                <h2>{trip.title}</h2>
                <p className={styles.description}>{trip.description}</p>
                <p><span className={styles.strong}>Traveller:</span> {trip.name}</p>
                <p><span className={styles.strong}>Origin:</span> {trip.origin}</p>
                <p><span className={styles.strong}>Destination:</span> {trip.destination}</p>
                <p><span className={styles.strong}>Departure Date:</span> {new Date(trip.departureDate).toLocaleDateString()}</p>
                <p><span className={styles.strong}>Arrival Date:</span> {new Date(trip.arrivalDate).toLocaleDateString()}</p>
                <p><span className={styles.strong}>Rating:</span> {trip.rating} / 5</p>
                <p><span className={styles.strong}>Price:</span> ${trip.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TripsList;
