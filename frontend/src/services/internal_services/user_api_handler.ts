import { UUID } from 'crypto';
import { makeAPIRequest } from './api'; // Adjust the import path
import { endpoints } from './endpoints'; // Adjust the import path
import { microservices } from './microservices';
import {
  CreateUserInterface,
  UpdateUserEmailVerificationStatus
} from "@/types/user"

//------------------------------------------------GET REQUESTS-------------------------------------


//------------------------------------------------CREATE REQUESTS-------------------------------------

export async function createUser(create_user_data:CreateUserInterface){
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.users.CREATE.CREATE_USER, // Endpoint
      {
        method: 'POST',
        data: create_user_data,
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

//------------------------------------------------UPDATE REQUESTS-------------------------------------

export async function updateUserEmailVerificationStatus(update_user_email_verification_status_data:UpdateUserEmailVerificationStatus){
  try {
    // Make API request
    const response = await makeAPIRequest<{ data: any }>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.users.UPDATE.UPDATE_USER_EMAIL_VERIFICATION_STATUS, // Endpoint
      {
        method: 'PUT',
        data: update_user_email_verification_status_data,
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