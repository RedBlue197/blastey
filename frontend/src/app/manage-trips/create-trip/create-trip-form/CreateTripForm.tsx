'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import TripDetailsForm from './trip-details-form/TripDetailsForm';
import TripItemsForm from './trip-items-form/TripItemsForm';
import TripOpeningsForm from './trip-openings-form/TripOpeningsForm';
import TripImagesForm from './trip-images-form/TripImagesForm';
import Stepper from './stepper/Stepper';
import axios from 'axios';
import styles from './CreateTripForm.module.css';

interface CreateTripFormInputs {
  trip_title: string;
  trip_description?: string;
  trip_departure_date?: string;
  trip_return_date?: string;
  trip_origin?: string;
  trip_destination?: string;
  trip_total_availability?: number;
  trip_total_booking?: number;
  host_id: string;
  trip_link_url?: string;
  trip_price?: number;
  activity_items: {
    trip_item_name: string;
    trip_item_category: string;
    trip_item_type: string;
  }[];
  trip_images?: { trip_image_url: string; trip_image_is_primary: boolean }[];
  trip_openings?: {
    trip_opening_date: string;
    trip_opening_price: number;
    trip_opening_availability: number;
  }[];
}

const CreateTripForm = () => {
  const methods = useForm<CreateTripFormInputs>({
    defaultValues: {
      activity_items: [{ trip_item_name: '', trip_item_category: '', trip_item_type: '' }],
      trip_images: [{ trip_image_url: '', trip_image_is_primary: true }],
      trip_openings: [{ trip_opening_date: '', trip_opening_price: 0, trip_opening_availability: 0 }],
    },
  });
  const { handleSubmit, reset } = methods;
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Trip Details', 'Trip Items', 'Trip Openings', 'Trip Images'];

  const onSubmit = async (data: CreateTripFormInputs) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/create-trip', data);
      if (response.status === 201) {
        alert('Trip created successfully!');
        reset();
        setCurrentStep(0); // Reset to the first step
      } else {
        alert('Failed to create trip');
      }
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <h2 className={'page-title'}>Create a New Trip</h2>

          <div className={styles.stepNavigation}>
          <Stepper steps={steps} currentStep={currentStep} />
          </div>

          {currentStep === 0 && <TripDetailsForm />}
          {currentStep === 1 && <TripItemsForm />}
          {currentStep === 2 && <TripOpeningsForm />}
          {currentStep === 3 && <TripImagesForm />}

          <div className={styles.stepNavigationButton}>
            {currentStep > 0 && (
              <button
                type="button"
                className={`btn-secondary ${styles.secondaryButton}`}
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                className={`btn-primary ${styles.primaryButton}`}
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button type="submit" className={styles.primaryButton} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateTripForm;
