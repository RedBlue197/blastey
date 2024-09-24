import axios, { AxiosRequestConfig } from 'axios';
import CryptoJS from 'crypto-js'; // Import crypto-js for encryption

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
  version?: string; // default to 'v1' or 'v2'
  headers?: Record<string, string>;
  token?: string | null;
  data?: any;
  microservice?: string;
  [key: string]: any; // Allow for other Axios request options
}

// Define a secret key for encryption (make sure it matches with the backend)
const SECRET_KEY = 'your-secret-key';

// Function to encrypt data
const encryptData = (data: any) => {
  const stringifiedData = JSON.stringify(data); // Convert data to string before encryption
  return CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
};

export const makeAPIRequest = async <T>(
  microservice: string,
  endpoint: string,
  options: MakeAPIRequestOptions = {}
): Promise<T> => {
  const { version = 'v1', headers = {}, token = null, data = null, ...rest } = options;

  const url = `${BASE_URL}/${microservice}/${version}${endpoint}`;
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      ...headers, // Merge custom headers
    },
    url,
    ...rest, // Other options like method, params, etc.
  };

  if (data) {
    // Encrypt the data before sending it
    const encryptedData = encryptData(data);
    config.data = { data: encryptedData }; // Wrap the encrypted data inside a 'data' object
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Include the token if it exists
  }

  try {
    const response = await api(config);
    return response.data as T; // Return response data as the generic type T
  } catch (error) {
    throw error; // Throw error for handling in the calling component
  }
};
