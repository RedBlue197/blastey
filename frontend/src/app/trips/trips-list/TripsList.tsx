"use client";
import { useEffect, useState, Suspense } from 'react';
import styles from './TripsList.module.css';
import { fetchTrips, getTripsByCityName } from '@/services/internal_services/trip_api_handler';
import FilterAndSearch from '../filter-and-search/FilterAndSearch';
import TripCard from '../trip-card/TripCard';
import LoadingTripsList from './loading/LoadingTripsList';
import { Trip } from '@/types/trip';

const TripsList = ({ cityName }: { cityName: string }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('');
  const [filterOption, setFilterOption] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [hasMoreTrips, setHasMoreTrips] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [limit] = useState<number>(10); 
  const [totalPages, setTotalPages] = useState<number>(0);
  
  const getTrips = async (cityName:string,page: number) => {
    console.log('Fetching trips...');
    try {
      if (cityName) {
        const response = await getTripsByCityName(cityName,page, limit);
        if (response.status_code === 200) {
          const newTrips = response.data.trips;
          const totalPages = response.pagination.total_pages;

          setTotalPages(totalPages);

          if (page >= totalPages) {
            setHasMoreTrips(false);
          }

          setTrips(prevTrips => {
            // Filter out trips that are already in the state
            const uniqueTrips = newTrips.filter(newTrip => 
              !prevTrips.some(existingTrip => existingTrip.trip_id === newTrip.trip_id)
            );
            return [...prevTrips, ...uniqueTrips];
          });
        } else {
          setHasMoreTrips(false);
        }
      } else {
        const response = await fetchTrips(page, limit);
        if (response.status_code === 200) {
          const newTrips = response.data.trips;
          const totalPages = response.pagination.total_pages;

          setTotalPages(totalPages);

          if (page >= totalPages) {
            setHasMoreTrips(false);
          }

          setTrips(prevTrips => {
            // Filter out trips that are already in the state
            const uniqueTrips = newTrips.filter(newTrip => 
              !prevTrips.some(existingTrip => existingTrip.trip_id === newTrip.trip_id)
            );
            return [...prevTrips, ...uniqueTrips];
          });
        } else {
          setHasMoreTrips(false);
        }
    }} catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  // Fetch trips on initial render (only once)
  useEffect(() => {
    getTrips(cityName,page); 
  }, [page]); 

  // Fetch trips when "Show More" is clicked
  const handleShowMore = () => {
    setLoadingMore(true);
    setPage(prevPage => prevPage + 1); // Update the page state to trigger getTrips
    setLoadingMore(false);
  };

  // Filter and sort trips when search, sort, or filter options change
  useEffect(() => {
    let filtered = trips.filter(trip =>
      trip.trip_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.trip_destination.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterOption) {
      filtered = filtered.filter(trip =>
        trip.trip_origin.toLowerCase() === filterOption.toLowerCase() ||
        trip.trip_destination.toLowerCase() === filterOption.toLowerCase()
      );
    }

    if (sortOption) {
      filtered.sort((a, b) => {
        if (sortOption === 'price') {
          return a.trip_lowest_trip_opening_price - b.trip_lowest_trip_opening_price;
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
        <h1 className="page-title">Traveller Trips</h1>
        <h2 className="section-title">Modify Your Search</h2>

        <FilterAndSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOption={sortOption}
          setSortOption={setSortOption}
          filterOption={filterOption}
          setFilterOption={setFilterOption}
        />

        {filteredTrips.length === 0 ? (
          <p>No trips are available.</p>
        ) : (
          <div className={styles.tripList}>
            {filteredTrips.map(trip => (
              <TripCard key={trip.trip_id} trip={trip} />
            ))}
          </div>
        )}

        {hasMoreTrips && (
          <button
            onClick={handleShowMore}
            className={`btn-secondary ${styles.showMoreButton}`}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Show More'}
          </button>
        )}
      </div>
    </Suspense>
  );
};

export default TripsList;
