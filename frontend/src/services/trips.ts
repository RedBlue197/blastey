// pages/api/trips.ts

import type { NextApiRequest, NextApiResponse } from 'next';

const trips = [
  {
    id: '1',
    name: 'Alice',
    picture: '/images/alice.jpg',
    origin: 'New York',
    destination: 'Paris',
    departureDate: '2024-09-15',
    arrivalDate: '2024-09-20',
    rating: 4.5,
  },
  // Add more trips here
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(trips);
}
