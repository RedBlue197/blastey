import axios, { AxiosRequestConfig } from 'axios';
import { createCipheriv, randomBytes } from 'crypto';

const URL = 'localhost:8000'; // Replace with your actual URL
const BASE_URL = 'http://' + URL;
export const WS_BASE_URL = 'ws://' + URL + '/mobile-app/v1/messages/ws/';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

interface MakeAPIRequestOptions {
  version?: string; // Default to 'v1' or 'v2'
  headers?: Record<string, string>;
  withCredentials?: boolean; // To indicate if the request needs credentials
  data?: any;
  microservice?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; // Specify HTTP method
  encrypt?: boolean; // New parameter to specify whether encryption is needed
  [key: string]: any; // Allow for other Axios request options
}

// Define your AES encryption key (32 bytes for AES-256) and initialization vector (IV)
const AES_SECRET_KEY = Buffer.from('04f5e5332f60cbe3f35f4a7d2525b9ce2678e3590db173ad281d85954e9463bf', 'hex'); // Must be 32 bytes
const IV = randomBytes(16); // IV should be 16 bytes

// Function to encrypt data
const encryptData = (data: any) => {
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

export const makeAPIRequest = async <T>(
  microservice: string,
  endpoint: string,
  options: MakeAPIRequestOptions = {}
): Promise<T> => {
  const {
    version = 'v1',
    headers = {},
    withCredentials = false, // Default value for withCredentials
    data = null,
    method = 'GET',
    encrypt = true, // Default to encrypting data unless specified otherwise
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

  // Get the token from local storage if withCredentials is true
  if (withCredentials) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; // Access local storage only in the browser context
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else if (options.token && config.headers) {
    // If a token was passed in options, use that
    config.headers.Authorization = `Bearer ${options.token}`;
  }

  // Encrypt data if encryption is enabled
  if (data) {
    if (encrypt) {
      try {
        const { iv, encryptedData } = encryptData(data);
        config.data = { iv, data: encryptedData }; // Wrap the encrypted data inside a 'data' object
      } catch (error) {
        console.error("Error encrypting data:", error);
        throw error;
      }
    } else {
      // Send data as-is without encryption
      config.data = data;
    }
  }

  try {
    const response = await api(config);
    return response.data as T;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};
