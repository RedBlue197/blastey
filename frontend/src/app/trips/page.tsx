import TripsList from "./trips-list/TripsList";
import Suggestions from "./suggestions/Suggestions";
import { Metadata } from 'next';

// Set page-specific metadata
export const metadata: Metadata = {
  title: "Trips - Blastey",
  description: "Explore all available trips",
};


export default function Trips() {
    return (
      <main>
        <Suggestions/>
        <TripsList/>
      </main>
    );
  }
  