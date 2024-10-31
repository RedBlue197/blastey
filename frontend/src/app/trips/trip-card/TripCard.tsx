import Link from 'next/link';
import styles from './TripCard.module.css'; // Import the CSS module
import { GetTripInterface } from '@/types/trip'; // Adjust the import path as needed
import { FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa'; // Import the arrow and map marker icons
import trackEvent from "@/utils/track_event";

// Adjusted to match GetTripInterface type
const TripCard: React.FC<{ trip: GetTripInterface }> = ({ trip }) => {
  const whatsappLink = `https://wa.me/${trip.host.user_phone_number}?text=Hello! I'm interested in your trip to ${trip.trip_destination}.`;

  const trackViewDetails = () => {
    trackEvent("user_engagement", {
      trip_id: trip.trip_id,
      trip_title: trip.trip_title,
    });
  };

  const trackContactWhatsapp = () => {
    trackEvent("user_engagement", {
      trip_id: trip.trip_id,
      trip_title: trip.trip_title,
    });
  };

  return (
    <div className={styles.tripCard}>
      <img src={
        trip.trip_image_url
          ? trip.trip_image_url
          : 'https://picsum.photos/2400/300'
       } alt={`${trip.trip_title}'s picture`} className={styles.picture} />
      <div className={styles.details}>
        <h2>{trip.trip_title}</h2>
        <p className={styles.description}>{trip.trip_description}</p>
        <div className={styles.tripInfo}>
          <p className={styles.detailsParagraph}>{trip.trip_origin}</p>
          <FaArrowRight className={styles.arrowIcon} />
          <p className={styles.detailsParagraph}>{trip.trip_destination}</p>
        </div>
        <p className={styles.detailsParagraph}>
          <span className={styles.detailsStrong}>From:</span> ${trip.trip_lowest_trip_opening_price}
        </p>
        {/* Add buttons */}
        <div className={styles.buttonsContainer}>
          <Link
            href={`/trips/${trip.trip_id}`}
            className={`btn-secondary ${styles.detailsButton}`}
            onClick={trackViewDetails}
          >
            View Details
          </Link>
          <Link
            href={whatsappLink}
            target="_blank"
            className={`btn-primary ${styles.whatsappButton}`}
            onClick={trackContactWhatsapp}
          >
            Contact via WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
