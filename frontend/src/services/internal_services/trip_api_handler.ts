import { UUID } from 'crypto';
import { makeAPIRequest } from './api'; // Adjust the import path
import { endpoints } from './endpoints'; // Adjust the import path
import { microservices } from './microservices';
import {
  CreateTripInterface,
  CreateTripItemsInterface,
  CreateTripOpeningsInterface,
  CreateTripSearchInterface,
  UpdateTripInterface,
  UpdateTripItemsInterface,
  UpdateTripOpeningsInterface
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

export async function getTripById(tripId: UUID) {
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

export async function getTripsByCityName(cityName: string, page: number, limit: number) {
  try {
    // Make API request
    const endpoint = `${endpoints.trips.GET.GET_TRIPS_BY_CITY_NAME}?city_name=${encodeURIComponent(cityName)}&page=${page.toString()}&items_per_page=${limit.toString()}`;
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoint, // Endpoint
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

export async function createTripImages(formData: FormData) {
  try {

    // Make API request
    console.log("Creating trip images with form data:", formData);
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.CREATE.CREATE_TRIP_IMAGES, // Endpoint URL
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData, // Send FormData as request data
        withCredentials: true,
        version: 'v1',
        encrypt: false, // Disable encryption for file uploads
      }
    );

    // Check if the response was successful
    if (!response || !response.data) {
      throw new Error('Failed to create trip images or invalid response structure');
    }

    return response.data; // Return response data if successful
  } catch (error: any) {
    console.error("Error creating trip images:", error);
    throw error; // Re-throw error for handling by the caller
  }
}

export async function createTripSearch(create_trip_search_data:CreateTripSearchInterface,page: number, limit: number){
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.CREATE.CREATE_TRIP_SEARCH+"?page="+page.toString()+"&items_per_page="+limit.toString(), // Endpoint
      {
        method: 'POST',
        data: create_trip_search_data,
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
//------------------------------------------------UPDATE REQUESTS-------------------------------------

export async function updateTripById(update_trip_data:UpdateTripInterface){
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.UPDATE.UPDATE_TRIP, // Endpoint
      {
        method: 'PUT',
        data: update_trip_data,
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

export async function updateTripItems(update_trip_items_data:UpdateTripItemsInterface){
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.UPDATE.UPDATE_TRIP_ITEMS, // Endpoint
      {
        method: 'PUT',
        data: update_trip_items_data,
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

export async function updateTripOpenings(update_trip_openings_data:UpdateTripOpeningsInterface){
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.UPDATE.UPDATE_TRIP_OPENINGS, // Endpoint
      {
        method: 'PUT',
        data: update_trip_openings_data,
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