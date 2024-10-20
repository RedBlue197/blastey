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
    <div>
      <h2>Trip Images</h2>
      {tripImagesFields.map((image, index) => (
        <div key={image.id} className={styles.formGroup}>
          <label>Image URL</label>
          <input {...register(`trip_images.${index}.trip_image_url`)} />
          <label>
            <input type="checkbox" {...register(`trip_images.${index}.trip_image_is_primary`)} />
            Is Primary Image
          </label>
        </div>
      ))}
      <button type="button" onClick={() => appendTripImage({ trip_image_url: '', trip_image_is_primary: true })}>
        Add Trip Image
      </button>
    </div>
  );
};

export default TripImagesForm;
