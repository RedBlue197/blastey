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
    contactPhone: string;
    host: Host;
  }
  