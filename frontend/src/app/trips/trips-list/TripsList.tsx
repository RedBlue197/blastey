// app/trips/page.tsx
"use client"
import { useEffect, useState } from 'react';
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
}

const TripsList = () => {
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      name: 'Alice',
      picture: '/images/alice.jpg',
      origin: 'New York',
      destination: 'Paris',
      departureDate: '2024-09-15',
      arrivalDate: '2024-09-20',
      rating: 4.5,
    },
    {
        id: '2',
        name: 'Alice',
        picture: '/images/alice.jpg',
        origin: 'New York',
        destination: 'Paris',
        departureDate: '2024-09-15',
        arrivalDate: '2024-09-20',
        rating: 4.5,
    },
      {
        id: '3',
        name: 'Alice',
        picture: '/images/alice.jpg',
        origin: 'New York',
        destination: 'Paris',
        departureDate: '2024-09-15',
        arrivalDate: '2024-09-20',
        rating: 4.5,
      },
      {
        id: '4',
        name: 'Alice',
        picture: '/images/alice.jpg',
        origin: 'New York',
        destination: 'Paris',
        departureDate: '2024-09-15',
        arrivalDate: '2024-09-20',
        rating: 4.5,
      },    // Add more trips here
  ]);

  // Fetch trips data from an API or static source
  useEffect(() => {
    // Replace with your API endpoint or static data
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
            <div key={trip.id} className={styles.tripCard}>
              <img src={trip.picture} alt={`${trip.name}'s picture`} className={styles.picture} />
              <div className={styles.details}>
                <h2>{trip.name}</h2>
                <p><span className={styles.strong}>Origin:</span> {trip.origin}</p>
                <p><span className={styles.strong}>Destination:</span> {trip.destination}</p>
                <p><span className={styles.strong}>Departure Date:</span> {new Date(trip.departureDate).toLocaleDateString()}</p>
                <p><span className={styles.strong}>Arrival Date:</span> {new Date(trip.arrivalDate).toLocaleDateString()}</p>
                <p><span className={styles.strong}>Rating:</span> {trip.rating} / 5</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default TripsList;