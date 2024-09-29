// pages/api/setAuthToken.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchToken } from '@/services/auth_api_handler'; // Import the fetchToken function from the API service

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Call fetchToken to get the auth token from your backend service
      const response = await fetchToken({ username, password }, null);
      console.log("Response:", response);

      if (response && response.data && response.data.length > 0) {
        const token = response.data; // Adjust as per your actual token structure
        // Set the token in an HTTP-only cookie
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; Path=/; SameSite=Strict`);
        return res.status(200).json({ message: 'Token set in cookie' });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error fetching token:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
