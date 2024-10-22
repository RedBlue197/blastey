// src/types/trip.ts
import { UUID } from 'crypto';

export interface Host {
    user_id: UUID;
    user_name: string;
    user_email: string;
    user_phone_number : string;

}

export interface Trip {
    trip_id: UUID;
    trip_title: string;
    trip_description: string;
    trip_origin: string;
    trip_destination: string;
    trip_image: string;
    host: Host;
    trip_lowest_trip_opening_price: number;
    trip_downvotes: number;
    trip_upvotes: number;
    trip_link_url: string;
  }
  

export interface CreateTrip {
    trip_title: string;
    trip_description?: string;
    trip_origin?: string;
    trip_destination?: string;
    host_id: UUID;  // UUID format
    trip_link_url?: string;
    trip_base_price?: number;
    trip_base_reward?: number;
  }