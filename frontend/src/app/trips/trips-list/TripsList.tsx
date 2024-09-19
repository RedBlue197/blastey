"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './TripsList.module.css'; // Import your CSS module for styling

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
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      name: 'Alice',
      picture: 'https://picsum.photos/800/300',
      origin: 'New York',
      destination: 'Paris',
      departureDate: '2024-09-15',
      arrivalDate: '2024-09-20',
      rating: 4.5,
      title: 'Amazing Trip to Paris',
      description: 'Discover the wonders of Paris in a unique and memorable trip.',
      price: 1200,
    },
    {
      id: '2',
      name: 'Bob',
      picture: 'https://picsum.photos/800/300',
      origin: 'London',
      destination: 'Tokyo',
      departureDate: '2024-10-05',
      arrivalDate: '2024-10-12',
      rating: 4.7,
      title: 'Journey to Japan',
      description: 'Experience the culture and beauty of Japan.',
      price: 1500,
    },
    // Add more trips here...
  ]);

  // Fetch trips data from an API or static source
  useEffect(() => {
    fetch('/api/trips')
      .then(response => response.json())
      .then(data => setTrips(data))
      .catch(error => console.error('Error fetching trips:', error));
  }, []);

  return (
    <div className={styles.container}>
      <h1>Traveller Trips</h1>
      <div className={styles.tripList}>
        {trips.map(trip => (
          <Link key={trip.id} href={`/trips/${trip.id}`}>
          <div key={trip.id} className={styles.tripCard}>
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
