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

// Dummy Data for Trips
const dummyTrips: Trip[] = [
  {
    id: '1',
    name: 'Summer Adventure',
    picture: 'https://picsum.photos/350/800',
    origin: 'Los Angeles',
    destination: 'New York',
    departureDate: '2024-07-01T00:00:00Z',
    arrivalDate: '2024-07-07T00:00:00Z',
    rating: 4.5,
    title: 'Exciting Summer Trip to NYC',
    description: 'Explore the vibrant city life, visit famous landmarks, and enjoy local cuisines.',
    price: 1500,
  },
  {
    id: '2',
    name: 'Beach Getaway',
    picture: 'https://picsum.photos/350/800',
    origin: 'San Francisco',
    destination: 'Miami',
    departureDate: '2024-08-15T00:00:00Z',
    arrivalDate: '2024-08-22T00:00:00Z',
    rating: 4.8,
    title: 'Relaxing Beach Vacation',
    description: 'Relax on the beautiful beaches of Miami and enjoy the sun.',
    price: 1200,
  },
  {
    id: '3',
    name: 'Cultural Journey',
    picture: 'https://picsum.photos/350/800',
    origin: 'Chicago',
    destination: 'Washington, D.C.',
    departureDate: '2024-09-10T00:00:00Z',
    arrivalDate: '2024-09-17T00:00:00Z',
    rating: 4.7,
    title: 'Discover the History of the U.S.',
    description: 'Visit museums, monuments, and immerse yourself in American history.',
    price: 800,
  },
];

const TripsList = () => {
  const [trips, setTrips] = useState<Trip[]>(dummyTrips); // Set initial state to dummy data
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
        <Suspense fallback={<LoadingTripsList />}>
          {filteredTrips.length === 0 ? (
            <p>No trips are available.</p>
          ) : (
            <div className={styles.tripList}>
              {filteredTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </Suspense>

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
