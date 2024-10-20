'use client';

import { useFormContext } from 'react-hook-form';
import styles from './TripDetailsForm.module.css';

const TripDetailsForm = () => {
  const { register, formState: { errors } } = useFormContext(); // Access the form context

  return (
    <div>
      <h2>Trip Details</h2>
      <div className={styles.formGroup}>
        <label>Title</label>
        <input {...register('trip_title', { required: 'Trip title is required', minLength: 1, maxLength: 200 })} />
        {errors.trip_title && <p className={styles.error}>{errors.trip_title.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Description</label>
        <textarea {...register('trip_description', { maxLength: 1000 })} />
      </div>

      <div className={styles.formGroup}>
        <label>Origin</label>
        <select {...register('trip_origin', { required: true })}>
          <option value="">Select City</option>
          {/* Replace with dynamic city options */}
          <option value="City 1">City 1</option>
          <option value="City 2">City 2</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Destination</label>
        <select {...register('trip_destination', { required: true })}>
          <option value="">Select City</option>
          {/* Replace with dynamic city options */}
          <option value="City 1">City 1</option>
          <option value="City 2">City 2</option>
        </select>
      </div>
    </div>
  );
};

export default TripDetailsForm;
