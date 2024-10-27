'use client';

import { useFormContext } from 'react-hook-form';
import styles from './TripDetailsForm.module.css';

const TripDetailsForm = () => {
  const { register, formState: { errors } } = useFormContext(); // Access the form context

  return (
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

        {/* Trip Description */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Description</label>
          <textarea
            className={styles.formInput}
            {...register('trip_description', {
              maxLength: { value: 1000, message: 'Description must be less than 1000 characters' },
            })}
          />
          {errors.trip_description && <p className={styles.error}>{errors.trip_description.message}</p>}
        </div>

        {/* Trip Origin */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Origin</label>
          <select
            className={styles.formInput}
            {...register('trip_origin', {
              required: 'Origin is required',
              maxLength: { value: 100, message: 'Origin must be less than 100 characters' },
            })}
          >
            <option value="City 1">City 1</option>
            <option value="City 2">City 2</option>
          </select>
          {errors.trip_origin && <p className={styles.error}>{errors.trip_origin.message}</p>}
        </div>

        {/* Trip Destination */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Destination</label>
          <select
            className={styles.formInput}
            {...register('trip_destination', {
              required: 'Destination is required',
              maxLength: { value: 100, message: 'Destination must be less than 100 characters' },
            })}
          >
            <option value="City 1">City 1</option>
            <option value="City 2">City 2</option>
          </select>
          {errors.trip_destination && <p className={styles.error}>{errors.trip_destination.message}</p>}
        </div>

        {/* Trip Link URL */}
        {/* <div className={styles.formGroup}>
          <label className={styles.formLabel}>Trip Link URL</label>
          <input
            className={styles.formInput}
            {...register('trip_link_url', {
              pattern: {
                value: /^https?:\/\/\S+$/,
                message: 'Please enter a valid URL',
              },
            })}
          />
          {errors.trip_link_url && <p className={styles.error}>{errors.trip_link_url.message}</p>}
        </div> */}

        {/* Trip Base Price */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Trip Base Price</label>
          <input
            type="number"
            className={styles.formInput}
            {...register('trip_base_price', {
              min: { value: 0, message: 'Price cannot be negative' },
            })}
          />
          {errors.trip_base_price && <p className={styles.error}>{errors.trip_base_price.message}</p>}
        </div>

        {/* Trip Base Reward */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Trip Base Reward</label>
          <input
            type="number"
            className={styles.formInput}
            {...register('trip_base_reward', {
              min: { value: 0, message: 'Reward cannot be negative' },
            })}
          />
          {errors.trip_base_reward && <p className={styles.error}>{errors.trip_base_reward.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default TripDetailsForm;
