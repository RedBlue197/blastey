'use client';
import { useEffect, useState, Suspense } from 'react';
import styles from './TripManagement.module.css'; // Custom CSS module
import { fetchTrips, deactivateTrip, createOrUpdateTrip } from '@/services/internal_services/trip_api_handler';
import TripCard from '../trip-card/TripCard';  // Displays trip details
import TripFormModal from '../trip-form-modal/TripFormModal'; // Form for create/update

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
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null); // For update form
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    setSelectedTrip(null); // Empty form for new trip
    setIsModalOpen(true);  // Open the modal
  };

  const handleUpdateTrip = (trip: Trip) => {
    setSelectedTrip(trip);  // Populate form for update
    setIsModalOpen(true);
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
              <button onClick={() => handleUpdateTrip(trip)} className={styles.updateButton}>
                Update
              </button>
              <button onClick={() => handleDeactivateTrip(trip.id)} className={styles.deactivateButton}>
                Deactivate
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal for creating/updating a trip */}
      {isModalOpen && (
        <TripFormModal 
          trip={selectedTrip} 
          closeModal={() => setIsModalOpen(false)} 
          refreshTrips={fetchAllTrips}
        />
      )}
    </div>
  );
};

export default TripManagementPage;
