'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';  // Import useRouter for navigation
import styles from './TripManagement.module.css'; 
import { fetchTrips, deactivateTrip } from '@/services/internal_services/trip_api_handler';
import TripCard from './trip-card/TripCard';  // Displays trip details

interface Trip {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
  isActive: boolean;
}

const TripManagementPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const router = useRouter(); // Initialize the router for page navigation

  const fetchAllTrips = async () => {
    const response = await fetchTrips();  // Get trips from API
    if (response.status === 200) {
      setTrips(response.data);
    }
  };

  useEffect(() => {
    fetchAllTrips(); // Load trips on page load
  }, []);

  const handleCreateTrip = () => {
    router.push('/trips/create');  // Navigate to create trip page
  };

  const handleUpdateTrip = (tripId: string) => {
    router.push(`/trips/update/${tripId}`);  // Navigate to update trip page with tripId
  };

  const handleDeactivateTrip = async (tripId: string) => {
    await deactivateTrip(tripId);  // Call API to deactivate trip
    fetchAllTrips();  // Reload trips after deactivation
  };

  return (
    <div className={styles.container}>
      <h1>Manage Trips</h1>
      
      {/* Button to create a new trip */}
      <button onClick={handleCreateTrip} className={styles.createButton}>
        Create New Trip
      </button>

      {/* Trip List */}
      <div className={styles.tripList}>
        {trips.length === 0 ? (
          <p>No trips available</p>
        ) : (
          trips.map((trip) => (
            <div key={trip.id} className={styles.tripCard}>
              <TripCard trip={trip} />
              <button onClick={() => handleUpdateTrip(trip.id)} className={styles.updateButton}>
                Update
              </button>
              <button onClick={() => handleDeactivateTrip(trip.id)} className={styles.deactivateButton}>
                Deactivate
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TripManagementPage;
