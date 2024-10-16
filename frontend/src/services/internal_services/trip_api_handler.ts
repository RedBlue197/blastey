import { UUID } from 'crypto';
import { makeAPIRequest } from './api'; // Adjust the import path
import { endpoints } from './endpoints'; // Adjust the import path
import { microservices } from './microservices';

export async function fetchTrips(page: number, limit: number) {
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any[] }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.trips.GET_TRIPS+"?page="+page.toString()+"&items_per_page="+limit.toString(), // Endpoint
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
      endpoints.trips.GET_TRIP_BY_ID+tripId, // Endpoint
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