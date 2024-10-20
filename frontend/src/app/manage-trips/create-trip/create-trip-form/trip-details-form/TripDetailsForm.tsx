'use client';

import { useFormContext } from 'react-hook-form';
import styles from './TripDetailsForm.module.css';

const TripDetailsForm = () => {
  const { register, formState: { errors } } = useFormContext(); // Access the form context

  return (
    <div className={styles.sectionBig}>
      <div className={styles.section}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Trip Title</label>
          <input
            className={styles.formInput}
            {...register('trip_title', { required: 'Trip title is required', minLength: 1, maxLength: 200 })}
          />
          {errors.trip_title && <p className={styles.error}>{errors.trip_title.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Description</label>
          <textarea
            className={styles.formInput}
            {...register('trip_description', { maxLength: 1000 })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Origin</label>
          <select
            className={styles.formInput}
            {...register('trip_origin', { required: true })}
          >
            <option value="">Select City</option>
            <option value="City 1">City 1</option>
            <option value="City 2">City 2</option>
          </select>
          {errors.trip_origin && <p className={styles.error}>Origin is required</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Destination</label>
          <select
            className={styles.formInput}
            {...register('trip_destination', { required: true })}
          >
            <option value="">Select City</option>
            <option value="City 1">City 1</option>
            <option value="City 2">City 2</option>
          </select>
          {errors.trip_destination && <p className={styles.error}>Destination is required</p>}
        </div>
      </div>
    </div>
  );
};

export default TripDetailsForm;
