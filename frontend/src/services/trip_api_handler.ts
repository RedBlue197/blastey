import { makeAPIRequest } from './api'; // Adjust the import path
import { endpoints } from './endpoints'; // Adjust the import path
import { microservices } from './microservices';

export async function fetchTrips(token: string | null) {
  try {
    // Make API request
    const response = await makeAPIRequest<{ result: any[] }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.GET_TRIPS, // Endpoint
      {
        version: 'v1', // Provide necessary options
        token, // Include the token if available
      }
    );

    // Check if the response was successful and has expected data
    if (!response || !response.result) {
      throw new Error('No trips found or invalid response structure');
    }

    console.log('Trips fetched successfully:', response.result);
    return response.result; // Return the fetched trips if needed elsewhere

  } catch (error: any) {
    // Log the full error details to get more information
    return error;
  }
}
