'use client';

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';
import TripDetailsForm from '../create-trip/create-trip-form/trip-details-form/TripDetailsForm';
import TripItemsForm from '../create-trip/create-trip-form/trip-items-form/TripItemsForm';
import TripOpeningsForm from '../create-trip/create-trip-form/trip-openings-form/TripOpeningsForm';
import TripImagesForm from '../create-trip/create-trip-form/trip-images-form/TripImagesForm';
import styles from './UpdateTrip.module.css';
import Stepper from '../create-trip/create-trip-form/stepper/Stepper';

interface UpdateTripFormInputs {
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

const UpdateTripForm = () => {
  const { query } = useRouter();
  const { trip_id } = query; // Extract trip_id from the route
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState<UpdateTripFormInputs | null>(null);
  const methods = useForm<UpdateTripFormInputs>({
    defaultValues: {
      trip_title: '',
      activity_items: [{ trip_item_name: '', trip_item_category: '', trip_item_type: '' }],
      trip_images: [{ trip_image_url: '', trip_image_is_primary: true }],
      trip_openings: [{ trip_opening_date: '', trip_opening_price: 0, trip_opening_availability: 0 }],
    },
  });
  const { reset, handleSubmit } = methods;
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Trip Details', 'Trip Items', 'Trip Openings', 'Trip Images'];

  // Fetch trip details based on trip_id
  useEffect(() => {
    if (trip_id) {
      setLoading(true);
      axios
        .get(`/api/trips/${trip_id}`)
        .then((response) => {
          setTripData(response.data); // Store fetched trip data
          reset(response.data); // Reset form with fetched data
        })
        .catch((error) => console.error('Error fetching trip data:', error))
        .finally(() => setLoading(false));
    }
  }, [trip_id, reset]);

  const onSubmit = async (data: UpdateTripFormInputs) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/update-trip/${trip_id}`, data);
      if (response.status === 200) {
        alert('Trip updated successfully!');
      } else {
        alert('Failed to update trip');
      }
    } catch (error) {
      console.error('Error updating trip:', error);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tripData) {
    return <div>Loading trip data...</div>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <h2 className={styles.pageTitle}>Update Trip</h2>

          <Stepper steps={steps} currentStep={currentStep} />

          {currentStep === 0 && <TripDetailsForm />}
          {currentStep === 1 && <TripItemsForm />}
          {currentStep === 2 && <TripOpeningsForm />}
          {currentStep === 3 && <TripImagesForm />}

          <div className={styles.stepNavigation}>
            {currentStep > 0 && (
              <button type="button" className={styles.secondaryButton} onClick={handlePrevious}>
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button type="button" className={styles.primaryButton} onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="submit" className={styles.primaryButton} disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default UpdateTripForm;
