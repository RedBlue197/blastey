import Link from 'next/link';

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

const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <Link href={`/trips/${trip.id}`}>
      <div className="tripCard">
        <img src={trip.picture} alt={`${trip.name}'s picture`} className="picture" />
        <div className="details">
          <h2>{trip.title}</h2>
          <p className="description">{trip.description}</p>
          <p><strong>Traveller:</strong> {trip.name}</p>
          <p><strong>Origin:</strong> {trip.origin}</p>
          <p><strong>Destination:</strong> {trip.destination}</p>
          <p><strong>Departure Date:</strong> {new Date(trip.departureDate).toLocaleDateString()}</p>
          <p><strong>Arrival Date:</strong> {new Date(trip.arrivalDate).toLocaleDateString()}</p>
          <p><strong>Rating:</strong> {trip.rating} / 5</p>
          <p><strong>Price:</strong> ${trip.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
