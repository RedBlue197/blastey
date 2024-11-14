import { UUID } from 'crypto';
import { makeAPIRequest } from './api'; // Adjust the import path
import { endpoints } from './endpoints'; // Adjust the import path
import { microservices } from './microservices';
import {
  CreateNewsletterEmailRequest,
} from "@/types/newsletter";



//------------------------------------------------CREATE REQUESTS-------------------------------------

export async function createNewsletter(create_newsletter_data:CreateNewsletterEmailRequest){
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.newsletters.CREATE.CREATE_NEWSLETTER, // Endpoint
      {
        method: 'POST',
        data: create_newsletter_data,
        withCredentials: false, // Use withCredentials to send the token in the request
        version: 'v1', // Provide necessary options
      }
    );

    // Check if the response was successful and has expected data
    if (!response || !response.data) {
      throw new Error('No Users found or invalid response structure');
    }

    return response; // Return the fetched trips if needed elsewhere

  } catch (error: any) {
    // Log the full error details to get more information
    return error;
  }
}