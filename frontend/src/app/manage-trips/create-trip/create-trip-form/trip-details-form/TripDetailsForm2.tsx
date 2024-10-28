// TripDetailsForm.js
'use client';

import { useForm } from 'react-hook-form';
import { useTripContext } from './TripContext'; // Adjust the import as necessary
import styles from './TripDetailsForm.module.css';

const TripDetailsForm2 = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { nextStep, updateTripData } = useTripContext();

  const onSubmit = async (data) => {
    updateTripData(data); // Update context with form data
    nextStep(); // Move to the next step after successful submission
  };

  return (
    <form className={styles.tripDetailsForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.sectionBig}>
        <div className={styles.section}>
          {/* Trip Title */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Trip Title</label>
            <input
              className={styles.formInput}
              {...register('trip_title', {
                required: 'Trip title is required',
                minLength: { value: 1, message: 'Trip title must be at least 1 character' },
                maxLength: { value: 200, message: 'Trip title must be less than 200 characters' },
              })}
            />
            {errors.trip_title && <p className={styles.error}>{errors.trip_title.message}</p>}
          </div>

          {/* Additional form fields... */}

          {/* Submit Button */}
          <button type="submit" className={styles.submitButton}>
            Submit Trip Details
          </button>
        </div>
      </div>
    </form>
  );
};

export default TripDetailsForm2;
