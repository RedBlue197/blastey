'use client'; // Ensure this component runs on the client side
import { useEffect, useState ,Suspense } from 'react';
import styles from './TripsList.module.css'; // Import your CSS module for styling
import { fetchTrips } from '@/services/trip_api_handler';
import FilterAndSearch from '../filter-and-search/FilterAndSearch';
import TripCard from '../trip-card/TripCard';
import LoadingTripsList from './loading/LoadingTripsList'; // Import the loading fallback

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
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>(''); // State for sort option
  const [filterOption, setFilterOption] = useState<string>(''); // State for filter option

  useEffect(() => {
    const token = null; // Replace with actual token logic if needed
    const getTrips = async () => {
      try {
        const response = await fetchTrips(token);
        if (response.status === 200) {
          setTrips(response.data);
          setFilteredTrips(response.data); // Initialize filtered trips with all trips
        } else if (response.status === 404) {
          setTrips([]);
          setFilteredTrips([]); // No trips available
        } else {
          console.error('Error fetching trips');
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    getTrips();
  }, []);

  useEffect(() => {
    let filtered = trips.filter(trip =>
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterOption) {
      filtered = filtered.filter(trip =>
        trip.origin.toLowerCase() === filterOption.toLowerCase() ||
        trip.destination.toLowerCase() === filterOption.toLowerCase()
      );
    }

    if (sortOption) {
      filtered.sort((a, b) => {
        if (sortOption === 'price') {
          return a.price - b.price;
        } else if (sortOption === 'rating') {
          return b.rating - a.rating;
        }
        return 0;
      });
    }

    setFilteredTrips(filtered);
  }, [searchQuery, sortOption, filterOption, trips]);

  return (
    <Suspense fallback={<LoadingTripsList />}>
      <div className={styles.container}>
        <h1>Traveller Trips</h1>

        {/* Filter and Search Section */}
        <FilterAndSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOption={sortOption}
          setSortOption={setSortOption}
          filterOption={filterOption}
          setFilterOption={setFilterOption}
        />

        {/* Trip List */}
        {filteredTrips.length === 0 ? (
          <p>No trips are available.</p>
        ) : (
          <div className={styles.tripList}>
            {filteredTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default TripsList;

