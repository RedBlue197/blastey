import Link from 'next/link';
import styles from './TripCard.module.css'; // Import the CSS module

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
  contactPhone: string; // Add a contact phone number field
}

const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => {
  const whatsappLink = `https://wa.me/${trip.contactPhone}?text=Hello! I'm interested in your trip to ${trip.destination}.`;

  return (
    <div className={styles.tripCard}>
      <img src={trip.picture} alt={`${trip.name}'s picture`} className={styles.picture} />
      <div className={styles.details}>
        <h2>{trip.title}</h2>
        <p className={styles.description}>{trip.description}</p>
        <p className={styles.detailsParagraph}>
          <span className={styles.detailsStrong}>Traveller:</span> {trip.name}
        </p>
        <p className={styles.detailsParagraph}>
          <span className={styles.detailsStrong}>Origin:</span> {trip.origin}
        </p>
        <p className={styles.detailsParagraph}>
          <span className={styles.detailsStrong}>Destination:</span> {trip.destination}
        </p>
        <p className={styles.detailsParagraph}>
          <span className={styles.detailsStrong}>Departure Date:</span> {new Date(trip.departureDate).toLocaleDateString()}
        </p>
        <p className={styles.detailsParagraph}>
          <span className={styles.detailsStrong}>Arrival Date:</span> {new Date(trip.arrivalDate).toLocaleDateString()}
        </p>
        <p className={styles.detailsParagraph}>
          <span className={styles.detailsStrong}>Rating:</span> {trip.rating} / 5
        </p>
        <p className={styles.detailsParagraph}>
          <span className={styles.detailsStrong}>Price:</span> ${trip.price}
        </p>
        {/* Add buttons */}
        <div className={styles.buttonsContainer}>
          <a href={whatsappLink} target="_blank" className={styles.whatsappButton}>
            Contact via WhatsApp
          </a>
          <Link href={`/trips/${trip.id}`} className={styles.detailsButton}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
