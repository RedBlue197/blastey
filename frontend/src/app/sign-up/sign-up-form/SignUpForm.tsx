"use client";

import React, { useState, FormEvent } from 'react';
import styles from './SignUpForm.module.css';
import { createUser, updateUserEmailVerificationStatus } from '@/services/internal_services/user_api_handler';
import { useRouter } from 'next/router';

const countryCodes = [
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'IN' },
  { code: '+61', country: 'AU' },
  // Add more country codes as needed
];

const SignUpForm = () => {
  const router = useRouter();

  // State to manage signup form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState(countryCodes[0].code);
  const [error, setError] = useState('');
  
  // State for verification form
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);  // State to switch between signup and verification

  // Handle signup form submission
  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const userData = {
      user_email: email,
      user_password: password,
      user_phone_number: countryCode + phoneNumber,
    };

    const response = await createUser(userData);
    if (response && response.status_code === 201) {
      setIsVerifying(true);  // Switch to verification form view
      setError('');
    } else {
      setError('Error creating user. Please try again later.');
    }
  };

  // Handle verification form submission
  const handleVerificationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await updateUserEmailVerificationStatus(email);
      if (response && response.status_code === 202) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {!isVerifying ? (
        <div className={styles.signUpContainer}>
          <h1>Sign Up</h1>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSignUpSubmit} className={styles.signUpForm}>
            {/* Signup form fields */}
            {/* ... other fields */}
            <button type="submit" className={styles.submitButton}>Sign Up</button>
          </form>
        </div>
      ) : (
        <div className={styles.verificationContainer}>
          <h1>Enter Verification Code</h1>
          <form onSubmit={handleVerificationSubmit} className={styles.verificationForm}>
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
      )}
    </div>
  );
};

export default SignUpForm;
