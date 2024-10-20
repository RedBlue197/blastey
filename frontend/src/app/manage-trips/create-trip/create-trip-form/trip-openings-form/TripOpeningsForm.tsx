'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import styles from './TripOpeningsForm.module.css';
import { PrimaryButton } from '@/app/components';

const TripOpeningsForm = () => {
  const { register, control, formState: { errors } } = useFormContext(); // Access the form context
  const { fields: tripOpeningsFields, append: appendTripOpening } = useFieldArray({
    control,
    name: 'trip_openings'
  });

  return (
    <div className={styles.sectionBig}>
      <h2 className="section-title">Trip Openings</h2>
      {tripOpeningsFields.map((opening, index) => (
        <div key={opening.id} className={styles.formGroup}>
          <label className={styles.formLabel}>Opening Date</label>
          <input 
            className={styles.formInput} 
            type="date" 
            {...register(`trip_openings.${index}.trip_opening_date`, { required: 'Opening date is required' })} 
          />
          {errors?.trip_openings?.[index]?.trip_opening_date && (
            <p className={styles.error}>{errors.trip_openings[index].trip_opening_date.message}</p>
          )}

          <label className={styles.formLabel}>Opening Price</label>
          <input 
            className={styles.formInput} 
            type="number" 
            step="0.01" 
            {...register(`trip_openings.${index}.trip_opening_price`, { required: 'Opening price is required' })} 
          />
          {errors?.trip_openings?.[index]?.trip_opening_price && (
            <p className={styles.error}>{errors.trip_openings[index].trip_opening_price.message}</p>
          )}

          <label className={styles.formLabel}>Opening Availability</label>
          <input 
            className={styles.formInput} 
            type="number" 
            {...register(`trip_openings.${index}.trip_opening_availability`, { required: 'Opening availability is required' })} 
          />
          {errors?.trip_openings?.[index]?.trip_opening_availability && (
            <p className={styles.error}>{errors.trip_openings[index].trip_opening_availability.message}</p>
          )}
        </div>
      ))}
      <PrimaryButton
        label="Add Trip Opening"
        type="button"
        onClick={() => appendTripOpening({ trip_opening_date: '', trip_opening_price: 0, trip_opening_availability: 0 })}
      />
    </div>
  );
};

export default TripOpeningsForm;
