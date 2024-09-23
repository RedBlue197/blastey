// ExampleComponent.tsx
import { makeAPIRequest } from './api'; // Adjust the import path
import {endpoints} from './endpoints'; // Adjust the import path
import { microservices } from './microservices';

export async function fetchTrips(token: string | null) {
  try {
    const data = await makeAPIRequest<{ result: any[] }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.GET_TRIPS, // Endpoint
      {
        version: 'v1', // Provide necessary options
        token, // Include the token if available
      }
    );
    console.log(data);
  } catch (error) {
    console.error('Error fetching brands:', error);
  }
}
