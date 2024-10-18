import Link from 'next/link';
import styles from './TripCard.module.css';
import { Trip } from '@/types/trip';
import { FaArrowRight } from 'react-icons/fa';

const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <div className={styles.tripCard}>
      <img src={trip.trip_image} alt={`${trip.trip_title}'s picture`} className={styles.picture} />
      <div className={styles.details}>
        <h2>{trip.trip_title}</h2>
        <p className={styles.description}>{trip.trip_description}</p>
        <div className={styles.tripInfo}>
          <p>{trip.trip_origin}</p>
          <FaArrowRight className={styles.arrowIcon} />
          <p>{trip.trip_destination}</p>
        </div>
        <p>
          <strong>From:</strong> ${trip.trip_lowest_trip_opening_price}
        </p>
        <div className={styles.buttonsContainer}>
          <Link href={`/trips/${trip.trip_id}`} className={`btn-secondary ${styles.detailsButton}`} onClick={() => {}}>
            View Details
          </Link>
          <Link href={`/manage-trips/${trip.trip_id}`} target="_blank" className={`btn-primary ${styles.whatsappButton}`} onClick={() => {}}>
            Update Trip
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default TripCard;
