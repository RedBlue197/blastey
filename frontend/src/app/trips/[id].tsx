import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

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

interface TripDetailProps {
  trip: Trip;
}

const TripDetail = ({ trip }: TripDetailProps) => {
  if (!trip) {
    return <div>Trip not found!</div>;
  }

  return (
    <div>
      <h1>{trip.title}</h1>
      <img src={trip.picture} alt={trip.title} />
      <p>{trip.description}</p>
      <p>Price: ${trip.price}</p>
      <p>Rating: {trip.rating} / 5</p>
      <p>Departure Date: {new Date(trip.departureDate).toLocaleDateString()}</p>
      <p>Arrival Date: {new Date(trip.arrivalDate).toLocaleDateString()}</p>
    </div>
  );
};

// This will fetch the trip data on each request (for server-side rendering)
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params;

  const res = await fetch(`https://your-api-url.com/api/trips/${id}`);
  const trip = await res.json();

  if (!trip) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      trip,
    },
  };
};

export default TripDetail;
