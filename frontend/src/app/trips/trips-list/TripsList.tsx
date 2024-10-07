'use client'; // Ensure this component runs on the client side
import { useEffect, useState, Suspense } from 'react';
import styles from './TripsList.module.css'; // Import your CSS module for styling
import { fetchTrips } from '@/services/internal_services/trip_api_handler';
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
  const [page, setPage] = useState<number>(1); // Track current page
  const [hasMoreTrips, setHasMoreTrips] = useState<boolean>(true); // Flag to check if more trips exist
  const [loadingMore, setLoadingMore] = useState<boolean>(false); // Loading state for fetching more trips

  const getTrips = async (currentPage = 1) => {
    try {
      const response = await fetchTrips(currentPage);
      if (response.status === 200) {
        const newTrips = response.data;
        if (newTrips.length === 0) {
          setHasMoreTrips(false); // No more trips available
        } else {
          setTrips(prevTrips => [...prevTrips, ...newTrips]);
          setFilteredTrips(prevTrips => [...prevTrips, ...newTrips]); // Append new trips to existing trips
        }
      } else if (response.status === 404) {
        setHasMoreTrips(false);
      } else {
        console.error('Error fetching trips');
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  useEffect(() => {
    getTrips(); // Initial load
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

  const handleShowMore = async () => {
    setLoadingMore(true);
    await getTrips(page + 1); // Fetch next page
    setPage(prevPage => prevPage + 1); // Increment page
    setLoadingMore(false);
  };

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

        {/* Show More Button */}
        {hasMoreTrips && !loadingMore && (
          <button onClick={handleShowMore} className={styles.showMoreButton}>
            Show More
          </button>
        )}
        {loadingMore && <p>Loading more trips...</p>}
      </div>
    </Suspense>
  );
};

export default TripsList;
