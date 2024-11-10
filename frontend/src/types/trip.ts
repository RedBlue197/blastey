// src/types/trip.ts
import { UUID } from 'crypto';

//--------------------------------------------ENUMS--------------------------------------------

export enum TripItemCategory {
  ACTIVITY="activity",
  FOOD="food",
  TRANSPORTATION="transportation",
  STAY="stay",
  OTHER="other",
}
  
export enum TripItemType {
  INCLUDED="included",
  OPTIONAL="optional",
  EXCLUDED="excluded",
}

//--------------------------------------------GET INTERFACE--------------------------------------------

export interface GetTripHost {
    user_id: UUID;
    user_name: string;
    user_email: string;
    user_phone_number : string;

}

export interface GetTripInterface {
    trip_id: UUID;
    trip_title: string;
    trip_description: string;
    trip_origin: string;
    trip_destination: string;
    trip_image: string;
    host: GetTripHost;
    trip_lowest_trip_opening_price: number;
    trip_downvotes: number;
    trip_upvotes: number;
    trip_link_url: string;
    trip_image_url: string;
}

//--------------------------------------------CREATE INTERFACE--------------------------------------------

export interface CreateTripInterface {
  trip_title: string;
  trip_description?: string;
  trip_origin?: string;
  trip_destination?: string;
  trip_link_url?: string;
  trip_base_price?: number;
  trip_base_reward?: number;
}

export interface CreateTripItemsInterface {
    trip_item_name: string;
    trip_item_description: string;
    trip_item_category: TripItemCategory;
    trip_item_address: string;
    trip_item_traveler_reward: number;
    trip_item_type: TripItemType;
    trip_item_price: number;
    trip_item_image: string;
    trip_id: UUID;
}

export interface CreateTripOpeningsInterface {
    trip_opening_start_date: string;
    trip_opening_end_date: string;
    trip_opening_total_reward: number;
    is_limited_availability: boolean;
    trip_opening_total_availability: number;
    trip_opening_price: number;
    trip_id: UUID;
}

export interface CreateTripImagesInterface {
    trip_image_is_primary: boolean;
    trip_id: UUID;
    trip_images: File[];
}

export interface CreateTripSearchInterface {
    trip_search_origin: string;
    trip_search_destination: string;
    trip_search_start_date?: string;
    trip_search_end_date?: string;
    trip_search_comment?: string;
}

//--------------------------------------------UPDATE INTERFACE--------------------------------------------

export interface UpdateTripInterface {
  trip_id: UUID;
  trip_title: string;
  trip_description: string;
  trip_origin: string;
  trip_destination: string;
  trip_base_price: number;
  trip_base_reward: number;
}

export interface UpdateTripItemsInterface {
  trip_item_name: string;
  trip_item_description: string;
  trip_item_category: TripItemCategory;
  trip_item_address: string;
  trip_item_traveler_reward: number;
  trip_item_type: TripItemType;
  trip_item_price: number;
  trip_item_image: string;
  trip_id: UUID;
  trip_item_id: UUID;
}

export interface UpdateTripOpeningsInterface {
  trip_opening_start_date: string;
  trip_opening_end_date: string;
  trip_opening_total_reward: number;
  is_limited_availability: boolean;
  trip_opening_total_availability: number;
  trip_opening_price: number;
  trip_id: UUID;
}
