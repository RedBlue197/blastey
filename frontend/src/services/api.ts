import axios, { AxiosRequestConfig } from 'axios';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

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
  token?: string | null;
  data?: any;
  microservice?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; // Specify HTTP method
  [key: string]: any; // Allow for other Axios request options
}

// Define your AES encryption key and initialization vector (IV)
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
    token = null,
    data = null,
    method = 'GET',
    ...rest
  } = options;

  const url = `${BASE_URL}/${microservice}/frontoffice/${version}${endpoint}`;
  console.log("Request URL:", url); // Log the request URL

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  };

  if (data) {
    try {
      const { iv, encryptedData } = encryptData(data);
      config.data = { iv, data: encryptedData }; // Wrap the encrypted data inside a 'data' object
      console.log("Encrypted Data:", { iv, encryptedData }); // Log encrypted data
    } catch (error) {
      console.error("Error encrypting data:", error);
      throw error;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await api(config);
    return response.data as T;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};
