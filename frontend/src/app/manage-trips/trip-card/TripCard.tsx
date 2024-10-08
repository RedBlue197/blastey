import Link from 'next/link';
import styles from './TripCard.module.css';

interface Trip {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
}

const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <Link href={`/trips/${trip.id}`}>
      <div className={styles.card}>
        <h2>{trip.title}</h2>
        <p>{trip.description}</p>
        <p><strong>Origin:</strong> {trip.origin}</p>
        <p><strong>Destination:</strong> {trip.destination}</p>
        <p><strong>Departure Date:</strong> {new Date(trip.departureDate).toLocaleDateString()}</p>
        <p><strong>Return Date:</strong> {new Date(trip.returnDate).toLocaleDateString()}</p>
        <p><strong>Price:</strong> ${trip.price}</p>
      </div>
    </Link>
  );
};

export default TripCard;
