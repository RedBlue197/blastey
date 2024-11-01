"use client"; // Ensures this component is treated as a client component
import React, { useEffect, useState } from "react";
import Head from "next/head";
import TripDetails from "./trip-details/TripDetails";
import { GetTripByIdResponse } from "@/schemas/tripSchemas"; // Adjust the import based on actual file path

function Trip({ params }: { params: { trip_id: string } }) {
  const { trip_id } = params; // Access trip_id directly from params
  const [trip, setTrip] = useState<GetTripByIdResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (trip_id) {
      import("@/services/internal_services/trip_api_handler").then(
        ({ getTripById }) => {
          setLoading(true);
          getTripById(trip_id)
            .then((response) => response.data)
            .then((data: GetTripByIdResponse) => {
              setTrip(data);
              setLoading(false);
            })
            .catch((err) => {
              setError("Failed to load trip details.");
              setLoading(false);
            });
        }
      );
    } else {
      setError("Trip ID not found in URL.");
      setLoading(false);
    }
  }, [trip_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Head>
        <title>{trip?.trip_title || "Trip Title"}</title>
        <meta
          name="description"
          content={trip?.trip_description || "Explore amazing trips with us."}
        />
        <meta property="og:title" content={trip?.trip_title || "Trip Title"} />
        <meta
          property="og:description"
          content={trip?.trip_description || "Explore amazing trips with us."}
        />
        <meta
          property="og:image"
          content={trip?.trip_image_url || "https://example.com/default-image.jpg"}
        />
        <meta
          property="og:url"
          content={`https://yourwebsite.com/trips/${trip_id}`}
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={trip?.trip_title || "Trip Title"} />
        <meta
          name="twitter:description"
          content={trip?.trip_description || "Explore amazing trips with us."}
        />
        <meta
          name="twitter:image"
          content={trip?.trip_image_url || "https://example.com/default-image.jpg"}
        />
      </Head>

      <main>
        {trip ? (
          <TripDetails trip={trip} />
        ) : (
          <div>Trip details not available.</div>
        )}
      </main>
    </>
  );
}

export default Trip;
