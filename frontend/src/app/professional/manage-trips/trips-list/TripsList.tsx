'use client'; // Add this at the top to make the component a Client Component

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // useRouter can be used after 'use client'
import styles from './TripsList.module.css'; 
import { fetchTripsByHostId } from '@/services/internal_services/trip_api_handler';
import TripCard from '../trip-card/TripCard';
import { Trip } from '@/types/trip';
import { UUID } from 'crypto';

const TripsList = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [hasMoreTrips, setHasMoreTrips] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);

  const getTrips = async (page: number) => {
    try {
      const response = await fetchTripsByHostId(page, limit);
      if (response.status_code === 200) {
        const newTrips = response.data.trips;
        const totalPages = response.pagination.total_pages;
        setTotalPages(totalPages);

        if (page >= totalPages) {
          setHasMoreTrips(false);
        }

        const uniqueTrips = newTrips.filter(newTrip => 
          !trips.some(existingTrip => existingTrip.trip_id === newTrip.trip_id)
        );

        if (uniqueTrips.length === 0) {
          setHasMoreTrips(false);
        } else {
          setTrips(prevTrips => [...prevTrips, ...uniqueTrips]);
        }
      } else {
        setHasMoreTrips(false);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  useEffect(() => {
    getTrips(page);
  }, []);

  const handleShowMore = async () => {
    setLoadingMore(true);
    await getTrips(page + 1);
    setPage(prevPage => prevPage + 1);
    setLoadingMore(false);
  };


  return (
    <div className={styles.container}>
      <h1 className={'page-title'}>Manage Trips</h1>

      <Link href={`/manage-trips/create-trip`} className={`btn-primary ${styles.createButton}`} onClick={() => {}}>
            Create new trip
        </Link>

      <div className={styles.tripList}>
        {trips.length === 0 ? (
          <p>No trips available</p>
        ) : (
          trips.map((trip) => (
              <TripCard trip={trip} />
          ))
        )}
      </div>

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
  );
};

export default TripsList;
