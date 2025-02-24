import { makeAPIRequest } from '@/services/internal_services/api'; // Adjust the import path
import { endpoints } from '@/services/internal_services/endpoints'; // Adjust the import path
import { microservices } from '@/services/internal_services/microservices'; // Adjust the import path
import Cookies from 'js-cookie'; // Import js-cookie
import { LoginRequest } from '@/types/anonymous/request/auth'; // Adjust the import path
import { LoginResponse } from '@/types/anonymous/response/auth'; // Adjust the import path
import { APIResponse } from '@/types/base_api'; // Adjust the import path

export async function postUserLoginRequest(data: LoginRequest, token: string | null) : Promise<APIResponse<LoginResponse>> {
  try {
    // Make API request
    const response = await makeAPIRequest<LoginResponse>(
      microservices.CORE, // Replace with your actual microservice name
      endpoints.anonymous.auth.POST.POST_USER_LOGIN_REQUEST, // Endpoint
      {
        method: "POST",
        version: 'v1', // Provide necessary options
        token, // Include the token if available
        data: data
      }
    );

    // Assuming the token is in response.result (adjust according to actual response structure)
    if (response.data && response.data.token) {
      const fetchedToken = response.data.token;
      // Store token in cookies with a 7-day expiration
      Cookies.set('token', fetchedToken, { expires: 7 });
    }

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}