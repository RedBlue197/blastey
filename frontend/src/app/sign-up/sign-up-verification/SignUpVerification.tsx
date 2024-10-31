import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';

import {updateUserEmailVerificationStatus} from '@/services/internal_services/user_api_handler'

const Verification: React.FC = () => {
  const router = useRouter();
  const { email } = router.query; // Retrieve email from query parameters
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!email) {
      setError('Email is required for verification');
    }
  }, [email]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email) {
      setError('Email is required for verification');
      setLoading(false);
      return;
    }

    try {
      const response = await updateUserEmailVerificationStatus(
        email
      )

      if (response && response.status_code==202) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(response.data || 'Invalid verification code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <h1>Enter Verification Code</h1>
      <form onSubmit={handleSubmit} className="verification-form">
        <input
          type="text"
          placeholder="Verification Code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Verification successful!</p>}
    </div>
  );
};

export default Verification;
