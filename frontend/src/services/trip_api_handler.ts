// ExampleComponent.tsx
import { makeAPIRequest } from './api'; // Adjust the import path

async function fetchBrands(token: string | null) {
  try {
    const data = await makeAPIRequest<{ result: any[] }>(
      'yourMicroserviceName', // Replace with your actual microservice name
      '/brands', // Endpoint
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
