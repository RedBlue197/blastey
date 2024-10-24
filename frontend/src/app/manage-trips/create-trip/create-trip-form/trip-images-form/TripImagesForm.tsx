'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { useEffect } from 'react';
import styles from './TripImagesForm.module.css';

const MAX_IMAGES = 5; // Set a limit for the number of images

const TripImagesForm = () => {
  const { register, control, setValue, watch } = useFormContext(); // Access the form context
  const { fields: tripImagesFields, append: appendTripImage, remove: removeTripImage } = useFieldArray({
    control,
    name: 'trip_images'
  });

  const tripImages = watch('trip_images'); // Watch for changes in trip images

  // Ensure only one image can be marked as primary
  const handlePrimaryChange = (index: number) => {
    tripImagesFields.forEach((_, i) => {
      setValue(`trip_images.${i}.trip_image_is_primary`, i === index); // Only allow one primary image
    });
  };

  // Disable adding new images if max limit is reached
  const canAddMoreImages = tripImagesFields.length < MAX_IMAGES;

  return (
    <div className={styles.sectionBig}>
      <h2 className="section-title">Trip Images (Max {MAX_IMAGES} images)</h2>
      {tripImagesFields.map((image, index) => (
        <div key={image.id} className={styles.formGroup}>
          <label className={styles.formLabel}>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            className={styles.formInput}
            {...register(`trip_images.${index}.trip_image_file`, { required: 'Image file is required' })}
          />

          <label className={styles.formLabel}>Image URL</label>
          <input
            className={styles.formInput}
            {...register(`trip_images.${index}.trip_image_url`, { required: 'Image URL is required' })}
            placeholder="Image URL will be auto-filled after upload"
            readOnly
          />

          <label className={styles.formLabel}>
            <input
              type="checkbox"
              checked={!!tripImages[index].trip_image_is_primary}
              onChange={() => handlePrimaryChange(index)}
            />{' '}
            Set as Primary Image
          </label>

          {/* Button to remove the image */}
          <button 
            className={styles.formButton}
            type="button" 
            onClick={() => removeTripImage(index)}
          >
            Remove Image
          </button>
        </div>
      ))}

      {/* Add image button is disabled if the limit is reached */}
      <button
        className={styles.formButton}
        type="button"
        onClick={() => appendTripImage({ trip_image_url: '', trip_image_is_primary: false, trip_image_file: null })}
        disabled={!canAddMoreImages}
      >
        {canAddMoreImages ? 'Add Trip Image' : `Max ${MAX_IMAGES} images reached`}
      </button>
    </div>
  );
};

export default TripImagesForm;
