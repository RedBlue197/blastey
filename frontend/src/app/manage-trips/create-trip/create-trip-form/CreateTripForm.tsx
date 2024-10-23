'use client';

import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import TripDetailsForm from './trip-details-form/TripDetailsForm';
import TripItemsForm from './trip-items-form/TripItemsForm';
import TripOpeningsForm from './trip-openings-form/TripOpeningsForm';
import TripImagesForm from './trip-images-form/TripImagesForm';
import Stepper from './stepper/Stepper';
import axios from 'axios';
import styles from './CreateTripForm.module.css';
import Toast from '@/app/components/toast/Toast';
import { CreateTripInterface, CreateTripItemsInterface } from '@/types/trip';
import { createTrip, createTripItems, createTripOpenings } from "@/services/internal_services/trip_api_handler";

interface CreateTripFormInputs {
  trip_title: string;
  trip_description?: string;
  trip_departure_date?: string;
  trip_return_date?: string;
  trip_origin?: string;
  trip_destination?: string;
  trip_total_availability?: number;
  trip_total_booking?: number;
  trip_base_price?: number;
  trip_base_reward?: number;
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
    is_limited_availability: boolean;
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
  const { reset, getValues } = methods;
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [tripId, setTripId] = useState<string | null>(null); // Store the trip_id
  const [stepCompleted, setStepCompleted] = useState([false, false, false, false]); // Array to track completed steps
  const steps = ['Trip Details', 'Trip Items', 'Trip Openings', 'Trip Images'];

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null); 
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [toastMessage]);

  const handleNext = async () => {
    try {
      setLoading(true);
      let response;

      // Only make the API call if the step has not been completed
      if (!stepCompleted[currentStep]) {
        // API call for each step
        if (currentStep === 0) {
          const tripData: CreateTripInterface = {
            trip_title: getValues('trip_title'),
            trip_description: getValues('trip_description'),
            trip_origin: getValues('trip_origin'),
            trip_destination: getValues('trip_destination'),
            trip_base_price: parseFloat(getValues('trip_base_price') || '0'), 
            trip_base_reward: parseFloat(getValues('trip_base_reward') || '0'), 
          };  

          response = await createTrip(tripData);

          if (response && response.status_code === 201) {
            setTripId(response.data.trip_id); // Store trip_id
            setStepCompleted((prev) => {
              const newSteps = [...prev];
              newSteps[0] = true;
              return newSteps;
            });
          }

        } else if (currentStep === 1 && tripId) {
          const tripItemsData: CreateTripItemsInterface = {
            trip_items: getValues('trip_items').map((item) => ({
              trip_item_name: item.trip_item_name,
              trip_item_description: item.trip_item_description,
              trip_item_category: item.trip_item_category,
              trip_item_address: item.trip_item_address,
              trip_item_traveler_reward: parseFloat(item.trip_item_traveler_reward),
              trip_item_type: item.trip_item_type,
              trip_item_price: parseFloat(item.trip_item_price),
              trip_item_image: item.trip_item_image,
            })),
            trip_id: tripId,
          };
          console.log('tripItemsData:', tripItemsData);

          response = await createTripItems(tripItemsData);

          if (response && response.status_code === 201) {
            setStepCompleted((prev) => {
              const newSteps = [...prev];
              newSteps[1] = true;
              return newSteps;
            });
          }

        } else if (currentStep === 2 && tripId) {
          const tripOpeningsData = {
            ...getValues(),
            trip_id: tripId,
          };

          response = await createTripOpenings(tripOpeningsData);

          if (response && response.status_code === 201) {
            setStepCompleted((prev) => {
              const newSteps = [...prev];
              newSteps[2] = true;
              return newSteps;
            });
          }

        } else if (currentStep === 3 && tripId) {
          const tripImagesData = {
            ...getValues(),
            trip_id: tripId,
          };

          response = await axios.post('/api/create-trip-images', tripImagesData);

          if (response && response.status_code === 201) {
            setStepCompleted((prev) => {
              const newSteps = [...prev];
              newSteps[3] = true;
              return newSteps;
            });
          }
        }
      }

      if (response && response.status_code === 201) {
        setToastMessage({ type: 'success', message: `Step ${currentStep + 1} completed successfully!` });
        if (currentStep < steps.length - 1) {
          setCurrentStep((prevStep) => prevStep + 1);
        }
      }        
      else if (stepCompleted[currentStep]) {
        setToastMessage({ type: 'success', message: `Step ${currentStep + 1} already completed!` });
        if (currentStep < steps.length - 1) {
          setCurrentStep((prevStep) => prevStep + 1);
        }
      } 
      else {
        setToastMessage({ type: 'error', message: `Failed to complete step ${currentStep + 1}` });
      }

    } catch (error) {
      console.error(`Error on step ${currentStep + 1}:`, error);
      setToastMessage({ type: 'error', message: `Error on step ${currentStep + 1}` });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <form>
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
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Next'}
              </button>
            ) : (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>

        {toastMessage && <Toast type={toastMessage.type} message={toastMessage.message} />}
      </form>
    </FormProvider>
  );
};

export default CreateTripForm;
