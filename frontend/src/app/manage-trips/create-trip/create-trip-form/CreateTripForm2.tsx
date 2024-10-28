// CreateTrip.js
'use client';

import React from 'react';
import { useTripContext } from '@/context/CreateTripContext'; // Adjust the import as necessary
import TripDetailsForm2 from './trip-details-form/TripDetailsForm2'; // Adjust the import as necessary
import Stepper from './stepper/Stepper';
import styles from './CreateTripForm.module.css';

const CreateTrip2 = () => {
    const { currentStep, nextStep, previousStep, updateTripData } = useTripContext();
  
  const steps = ['Trip Details', 'Trip Items', 'Trip Openings', 'Review'];

  const stepCompleted = Array(steps.length).fill(false);


  return (
    <div className={styles.createTripContainer}>
      <h1>Create Trip</h1>
      <Stepper steps={steps} currentStep={currentStep} stepCompleted={stepCompleted} />
      
      {currentStep === 0 && <TripDetailsForm2 />}
      {/* Render other forms based on currentStep */}
      {/* <TripItemsForm /> */}
      {/* <TripOpeningsForm /> */}
      {/* <ReviewForm /> */}

      <div className={styles.navigationButtons}>
        {currentStep > 0 && (
          <button onClick={previousStep} className={styles.prevButton}>
            Previous
          </button>
        )}
        {currentStep < steps.length - 1 && (
          <button onClick={nextStep} className={styles.nextButton}>
            Next
          </button>
        )}
        {currentStep === steps.length - 1 && (
          <button onClick={() => console.log('Submit')} className={styles.submitButton}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateTrip2;
