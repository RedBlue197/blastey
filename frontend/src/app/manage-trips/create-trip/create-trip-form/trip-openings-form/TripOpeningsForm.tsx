'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import styles from './TripOpeningsForm.module.css';
import { FaChevronUp, FaChevronDown, FaPlus  } from 'react-icons/fa';
import LinkWithIconButton from '@/app/components/button/LinkWithIconButton';

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
      <LinkWithIconButton
        label="Add Trip opening"
        icon={<FaPlus />}  // Adding the plus icon before the label
        variant="success"
        onClick={() => {
          appendActivityItem({
            trip_item_name: '',
            trip_item_category: '',
            trip_item_type: '',
            trip_item_address: '',
            trip_item_traveler_reward: '',
            trip_item_price: '',
          });
          setItemsDropdownOpen((prev) => [...prev, false]); // Add new entry for the new item, default to closed
        }}
      />
    </div>
  );
};

export default TripOpeningsForm;
