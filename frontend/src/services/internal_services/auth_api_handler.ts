import { makeAPIRequest } from './api'; // Adjust the import path
import { endpoints } from './endpoints'; // Adjust the import path
import { microservices } from './microservices';

export async function fetchToken(data:any , token: string | null) {
  try {
    // Make API request
    const response = await makeAPIRequest<{ result: any[] }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.auth.GET.GET_TOKEN, // Endpoint
      {
        method:"POST",
        version: 'v1', // Provide necessary options
        token, // Include the token if available
        data : data
      }
    );
    return response
  } catch (error: any) {
    console.error(error)
    return error;
  }
}
