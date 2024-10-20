'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import styles from './TripOpeningsForm.module.css';
import { PrimaryButton } from '@/app/components';

const TripOpeningsForm = () => {
  const { register, control } = useFormContext(); // Access the form context
  const { fields: tripOpeningsFields, append: appendTripOpening } = useFieldArray({
    control,
    name: 'trip_openings'
  });

  return (
    <div>
      <h2>Trip Openings</h2>
      {tripOpeningsFields.map((opening, index) => (
        <div key={opening.id} className={styles.formGroup}>
          <label>Opening Date</label>
          <input type="date" {...register(`trip_openings.${index}.trip_opening_date`, { required: true })} />
          <label>Opening Price</label>
          <input type="number" step="0.01" {...register(`trip_openings.${index}.trip_opening_price`, { required: true })} />
          <label>Opening Availability</label>
          <input type="number" {...register(`trip_openings.${index}.trip_opening_availability`, { required: true })} />
        </div>
      ))}
      <PrimaryButton 
      label='Add Trip Opening'
      type="button" onClick={() => appendTripOpening({ trip_opening_date: '', trip_opening_price: 0, trip_opening_availability: 0 })}>
      </PrimaryButton>
    </div>
  );
};

export default TripOpeningsForm;
