import axios, { AxiosRequestConfig } from 'axios';
import { createCipheriv, randomBytes } from 'crypto';
import Cookies from 'js-cookie'; // Import js-cookie

import config from "@/config";

export const BASE_URL = config.apiUrl;
export const WS_BASE_URL = 'ws://' + BASE_URL + '/mobile-app/v1/messages/ws/';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

interface MakeAPIRequestOptions {
  version?: string; // Default to 'v1' or 'v2'
  headers?: Record<string, string>;
  withCredentials?: boolean; // To indicate if the request needs credentials
  data?: unknown;
  microservice?: string;
  encrypt?: boolean; // To indicate if the request data should be encrypted
  method?: 'GET' | 'POST' | 'PATCH' |'PUT' | 'DELETE'; // Specify HTTP method
  [key: string]: unknown; // Allow for other Axios request options
}

// Define your AES encryption key (32 bytes for AES-256) and initialization vector (IV)
const AES_SECRET_KEY = Buffer.from('04f5e5332f60cbe3f35f4a7d2525b9ce2678e3590db173ad281d85954e9463bf', 'hex'); // Must be 32 bytes
const IV = randomBytes(16); // IV should be 16 bytes

// Function to encrypt data
const encryptData = (data: unknown) => {
  if (data === undefined || data === null) {
    throw new Error("Data to encrypt cannot be undefined or null");
  }
  
  const stringifiedData = JSON.stringify(data); // Convert data to string before encryption
  const cipher = createCipheriv('aes-256-cbc', AES_SECRET_KEY, IV);
  
  let encrypted = cipher.update(stringifiedData, 'utf8', 'base64'); // Change 'hex' to 'base64'
  encrypted += cipher.final('base64'); // Change 'hex' to 'base64'

  // Return both the encrypted data and the IV used
  return { iv: IV.toString('hex'), encryptedData: encrypted };
};

interface PaginationMetadata {
  total_count: number;
  current_page: number;
  total_pages: number;
  items_per_page: number;
}

interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination: PaginationMetadata;
  status_code?: number;
  cacheable?: boolean;
}

export const makeAPIRequest = async <T>(
  microservice: string,
  endpoint: string,
  options: MakeAPIRequestOptions = {}
): Promise<APIResponse<T>> => {
  const {
    version = 'v1',
    headers = {},
    withCredentials = false,
    data = null,
    method = 'GET',
    encrypt = true,
    ...rest
  } = options;

  const url = `${BASE_URL}/${microservice}/frontoffice/${version}${endpoint}`;
  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  };

  // Add token to headers if necessary
  if (withCredentials) {
    const token = typeof window !== 'undefined' ? Cookies.get('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else if (options.token && config.headers) {
    config.headers.Authorization = `Bearer ${options.token}`;
  }

  // Encrypt data if required
  if (data) {
    if (encrypt) {
      try {
        const { iv, encryptedData } = encryptData(data);
        config.data = { iv, data: encryptedData };
      } catch (error) {
        console.error("Error encrypting data:", error);
        throw error;
      }
    } else {
      config.data = data;
    }
  }

  try {
    const response = await api(config);

    // The response is expected to match the APIResponse structure
    const apiResponse: APIResponse<T> = response.data;

    // Optionally handle pagination, success, and other response properties here

    return apiResponse;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};