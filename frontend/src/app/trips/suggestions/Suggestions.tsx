"use client"

import React, { useState,Suspense } from 'react';
import styles from './Suggestions.module.css';
import LoadingSuggestions from './loading/LoadingSuggestions'; // Import the loading fallback component
import { PrimaryButton } from '@/app/components';
import { fetchTripById } from '@/services/trip_api_handler'; // Import the fetchTripById function from the API service

interface Suggestion {
  id: string;
  title: string;
  price: string;
  days: number;
  image: string;
}

const suggestions: Suggestion[] = [
  { id: '1', title: 'Explore the Sahara', price: '$500', days: 7, image: 'https://picsum.photos/300/300' },
  { id: '2', title: 'Discover Marrakech', price: '$300', days: 5, image: 'https://picsum.photos/300/300' },
  { id: '3', title: 'Atlas Mountains', price: '$400', days: 4, image: 'https://picsum.photos/300/300' },
  { id: '4', title: 'Essaouira Escape', price: '$250', days: 3, image: 'https://picsum.photos/300/300' },
  { id: '5', title: 'Tangier Tour', price: '$450', days: 6, image: 'https://picsum.photos/300/300' },
];
const Suggestions: React.FC = () => {

  const [loading, setLoading] = useState(false);

const handleClick = async () => {
  setLoading(true);

  const result = await fetchTripById(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoiaGFtemFnb3VicmFpbUBnbWFpbC5jb20iLCJpZCI6IjA5NDY1OTU2LTZmMmMtNGRhMC1iYjQ0LTAwZTI5NmQ0ODIxMCIsImV4cCI6MTcyNzYyNTIyN30.ryM4wJ0tCBLDMtgVxBVk8i2uTgFHNobD1Pq37xOKvZc',
     '978f9fbe-82ea-4cba-b180-e9ae7cde3470').then(
    (response) => {
      console.log('Trip fetched successfully:', response);
    },
    (error) => {
      console.error('Error fetching trip:', error);
});
  
  // Simulate an async action, such as a network request
  setTimeout(() => {
    setLoading(false); // Reset the loading state after action is complete
  }, 2000);
};

  return (
    <Suspense fallback={<LoadingSuggestions />}>
      <div className={styles.suggestionsWrapper}>
      <PrimaryButton 
        label="Submit" 
        onClick={handleClick} 
        loading={loading} 
        disabled={false} 
      />
        <div className={styles.suggestionsContainer}>
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className={styles.card} style={{ backgroundImage: `url(${suggestion.image})` }}>
              <div className={styles.cardContent}>
                <span className={styles.tag}>{suggestion.title}</span>
                <p className={styles.price}>{suggestion.price}</p>
                <p className={styles.days}>{suggestion.days} Days</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default Suggestions;
