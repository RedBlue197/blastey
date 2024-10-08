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
  imageUrl: string; // Add image field
}

const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <Link href={`/trips/${trip.id}`}>
      <div className={styles.card}>
        <img src={trip.imageUrl} alt={trip.title} className={styles.image} />
        <div className={styles.details}>
          <h2 className={styles.title}>{trip.title}</h2>

        </div>
      </div>
    </Link>
  );
};

export default TripCard;
