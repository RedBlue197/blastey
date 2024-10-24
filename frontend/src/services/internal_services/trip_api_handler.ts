import { UUID } from 'crypto';
import { makeAPIRequest } from './api'; // Adjust the import path
import { endpoints } from './endpoints'; // Adjust the import path
import { microservices } from './microservices';
import {
  CreateTripInterface,
  CreateTripItemsInterface,
  CreateTripOpeningsInterface,
  CreateTripImagesInterface
} from "@/types/trip"

export async function fetchTrips(page: number, limit: number) {
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any[] }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.GET.GET_TRIPS+"?page="+page.toString()+"&items_per_page="+limit.toString(), // Endpoint
      {
        withCredentials: true, // Use withCredentials to send the token in the request
        version: 'v1', // Provide necessary options
      }
    );

    // Check if the response was successful and has expected data
    if (!response || !response.data) {
      throw new Error('No trips found or invalid response structure');
    }

    return response; // Return the fetched trips if needed elsewhere

  } catch (error: any) {
    // Log the full error details to get more information
    return error;
  }
}


// function to get a specific trip by trip id

export async function fetchTripById(tripId: UUID) {
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.GET.GET_TRIP_BY_ID+tripId, // Endpoint
      {
        withCredentials: true, // Use withCredentials to send the token in the request
        version: 'v1', // Provide necessary options
      }
    );

    // Check if the response was successful and has expected data
    if (!response || !response.data) {
      throw new Error('No trips found or invalid response structure');
    }

    return response; // Return the fetched trips if needed elsewhere

  } catch (error: any) {
    // Log the full error details to get more information
    return error;
  }
}

// function to get trips by host id

export async function fetchTripsByHostId(page: number, limit: number) {
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.GET.GET_TRIPS_BY_HOST_ID+"?page="+page.toString()+"&items_per_page="+limit.toString(), // Endpoint
      {
        withCredentials: true, // Use withCredentials to send the token in the request
        version: 'v1', // Provide necessary options
      }
    );

    // Check if the response was successful and has expected data
    if (!response || !response.data) {
      throw new Error('No trips found or invalid response structure');
    }

    return response; // Return the fetched trips if needed elsewhere

  } catch (error: any) {
    // Log the full error details to get more information
    return error;
  }
}


//------------------------------------------------CREATE REQUESTS-------------------------------------

export async function createTrip(create_trip_data:CreateTripInterface){
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.CREATE.CREATE_TRIP, // Endpoint
      {
        method: 'POST',
        data: create_trip_data,
        withCredentials: true, // Use withCredentials to send the token in the request
        version: 'v1', // Provide necessary options
      }
    );

    // Check if the response was successful and has expected data
    if (!response || !response.data) {
      throw new Error('No trips found or invalid response structure');
    }

    return response; // Return the fetched trips if needed elsewhere

  } catch (error: any) {
    // Log the full error details to get more information
    return error;
  }
}

export async function createTripItems(create_trip_items_data:CreateTripItemsInterface){
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.CREATE.CREATE_TRIP_ITEMS, // Endpoint
      {
        method: 'POST',
        data: create_trip_items_data,
        withCredentials: true, // Use withCredentials to send the token in the request
        version: 'v1', // Provide necessary options
      }
    );

    // Check if the response was successful and has expected data
    if (!response || !response.data) {
      throw new Error('No trips found or invalid response structure');
    }

    return response; // Return the fetched trips if needed elsewhere

  } catch (error: any) {
    // Log the full error details to get more information
    return error;
  }
}

export async function createTripOpenings(create_trip_openings_data:CreateTripOpeningsInterface){
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.CREATE.CREATE_TRIP_OPENINGS, // Endpoint
      {
        method: 'POST',
        data: create_trip_openings_data,
        withCredentials: true, // Use withCredentials to send the token in the request
        version: 'v1', // Provide necessary options
      }
    );

    // Check if the response was successful and has expected data
    if (!response || !response.data) {
      throw new Error('No trips found or invalid response structure');
    }

    return response; // Return the fetched trips if needed elsewhere

  } catch (error: any) {
    // Log the full error details to get more information
    return error;
  }
}

export async function createTripImages(create_trip_images_data:CreateTripImagesInterface){
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.CREATE.CREATE_TRIP_IMAGES, // Endpoint
      {
        method: 'POST',
        data: create_trip_images_data,
        withCredentials: true, // Use withCredentials to send the token in the request
        version: 'v1', // Provide necessary options
      }
    );

    // Check if the response was successful and has expected data
    if (!response || !response.data) {
      throw new Error('No trips found or invalid response structure');
    }

    return response; // Return the fetched trips if needed elsewhere

  } catch (error: any) {
    // Log the full error details to get more information
    return error;
  }
}