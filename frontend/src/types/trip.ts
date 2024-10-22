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
  

export interface CreateTripInterface {
    trip_title: string;
    trip_description?: string;
    trip_origin?: string;
    trip_destination?: string;
    trip_link_url?: string;
    trip_base_price?: number;
    trip_base_reward?: number;
  }

export interface CreateTripItems {
    trip_item_name: string;
    trip_item_description: string;
    trip_item_category: string;
    trip_item_address: string;
    trip_item_traveler_reward: number;
    trip_item_type: string;
    trip_item_price: number;
    trip_item_image: string;
    trip_id: UUID;
  }

export interface CreateTripOpenings {
    trip_opening_start_date: string;
    trip_opening_end_date: string;
    trip_opening_total_reward: number;
    is_limited_availability: boolean;
    trip_opening_total_availability: number;
    trip_opening_price: number;
    trip_id: UUID;
  }