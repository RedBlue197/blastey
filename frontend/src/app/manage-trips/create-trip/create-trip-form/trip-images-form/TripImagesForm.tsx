'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import styles from './TripImagesForm.module.css';

const TripImagesForm = () => {
  const { register, control } = useFormContext(); // Access the form context
  const { fields: tripImagesFields, append: appendTripImage } = useFieldArray({
    control,
    name: 'trip_images'
  });

  return (
    <div className={styles.sectionBig}>
      <h2 className="section-title">Trip Images</h2>
      {tripImagesFields.map((image, index) => (
        <div key={image.id} className={styles.formGroup}>
          <label className={styles.formLabel}>Image URL</label>
          <input 
            className={styles.formInput} 
            {...register(`trip_images.${index}.trip_image_url`, { required: 'Image URL is required' })} 
          />
          
          <label className={styles.formLabel}>
            <input 
              type="checkbox" 
              {...register(`trip_images.${index}.trip_image_is_primary`)} 
            />{' '}
            Is Primary Image
          </label>
        </div>
      ))}
      <button 
        className={styles.formButton} 
        type="button" 
        onClick={() => appendTripImage({ trip_image_url: '', trip_image_is_primary: false })}
      >
        Add Trip Image
      </button>
    </div>
  );
};

export default TripImagesForm;
