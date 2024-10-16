import Link from 'next/link';
import styles from './TripCard.module.css'; // Import the CSS module
import { Trip } from '@/types/trip';  // Adjust the import path as needed
import trackEvent from"@/utils/track_event"

const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => {
  const whatsappLink = `https://wa.me/${trip.contactPhone}?text=Hello! I'm interested in your trip to ${trip.trip_destination}.`;

  const TrackViewDetails = () => {
    trackEvent("trip_view_details", {
      trip_id: trip.trip_id,
      trip_title: trip.trip_title,
  });

  const TrackContactWhatsapp = () => {
    trackEvent("trip_contact_whatsapp", {
      trip_id: trip.trip_id,
      trip_title: trip.trip_title,
  });
  };

  return (
    <div className={styles.tripCard}>
      <img src={trip.trip_image} alt={`${trip.trip_title}'s picture`} className={styles.picture} />
      <div className={styles.details}>
        <h2>{trip.trip_title}</h2>
        <p className={styles.description}>{trip.trip_description}</p>
        <p className={styles.detailsParagraph}>
          <span className={styles.detailsStrong}>Origin:</span> {trip.trip_origin}
        </p>
        <p className={styles.detailsParagraph}>
          <span className={styles.detailsStrong}>Destination:</span> {trip.trip_destination}
        </p>
        <p className={styles.detailsParagraph}>
          <span className={styles.detailsStrong}>From:</span> ${trip.price}
        </p>
        {/* Add buttons */}
        <div className={styles.buttonsContainer}>
          <Link href={`/trips/${trip.trip_id}`} className={`btn-secondary ${styles.detailsButton}`} onClick={() => TrackViewDetails()}>
            View Details
          </Link>
          <Link href={whatsappLink} target="_blank" className={`btn-primary ${styles.whatsappButton}`} onClick={() => TrackContactWhatsapp()}>
            Contact via WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
