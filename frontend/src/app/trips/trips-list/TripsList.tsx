'use client'; // Ensure this component runs on the client side
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './TripsList.module.css'; // Import your CSS module for styling
import { fetchTrips } from '@/services/trip_api_handler'; // Adjust the import path
import { FaSearch } from 'react-icons/fa'; // Import the search icon

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
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>(''); // State for sort option
  const [filterOption, setFilterOption] = useState<string>(''); // State for filter option

  // Fetch trips data from the API
  useEffect(() => {
    const token = null; // Replace with actual token logic if needed
    const getTrips = async () => {
      try {
        const response = await fetchTrips(token);
        if (response.status === 200) {
          setTrips(response.data); // Set the fetched trips
          setFilteredTrips(response.data); // Initialize filtered trips with all trips
        } else if (response.status === 404) {
          setTrips([]); // No trips available
          setFilteredTrips([]); // No filtered trips either
        } else {
          setError('Error fetching trips.'); // Handle unexpected status codes
        }
      } catch (error) {
        setError('Error fetching trips.'); // Set error message
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    getTrips(); // Call the async function
  }, []); // Empty dependency array means this runs once on mount

  // Filter and sort trips when search query, sort option, or filter option changes
  useEffect(() => {
    let filtered = trips.filter(trip =>
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply filtering by destination or origin if specified
    if (filterOption) {
      filtered = filtered.filter(trip =>
        trip.origin.toLowerCase() === filterOption.toLowerCase() ||
        trip.destination.toLowerCase() === filterOption.toLowerCase()
      );
    }

    // Sort filtered trips based on the selected sort option
    if (sortOption) {
      filtered.sort((a, b) => {
        if (sortOption === 'price') {
          return a.price - b.price; // Sort by price ascending
        } else if (sortOption === 'rating') {
          return b.rating - a.rating; // Sort by rating descending
        }
        return 0; // Default case
      });
    }

    setFilteredTrips(filtered);
  }, [searchQuery, sortOption, filterOption, trips]);

  if (loading) return <p>Loading trips...</p>; // Loading state
  if (error) return <p>{error}</p>; // Error handling

  return (
    <div className={styles.container}>
      <h1>Traveller Trips</h1>
      {/* Filter section with search bar, sort and filter buttons */}
      <div className={styles.filterSection}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by trip name or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchBar}
          />
        </div>
        <div className={styles.filterControls}>
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Destinations</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Chicago">Chicago</option>
            {/* Add more destinations as needed */}
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="">Sort By</option>
            <option value="price">Price: Low to High</option>
            <option value="rating">Rating: High to Low</option>
          </select>
        </div>
      </div>
      {filteredTrips.length === 0 && !loading && <p>No trips are available.</p>} {/* Message for no trips */}
      <div className={styles.tripList}>
        {filteredTrips.map(trip => (
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
