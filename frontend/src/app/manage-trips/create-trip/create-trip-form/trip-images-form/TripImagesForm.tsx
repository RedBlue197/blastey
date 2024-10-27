'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import styles from './TripImagesForm.module.css';
import { FaTrash, FaPlus } from 'react-icons/fa';
import LinkWithIconButton from '@/app/components/button/LinkWithIconButton';

const MAX_IMAGES = 5;

const TripImagesForm = () => {
  const { register, control, setValue, watch } = useFormContext();
  const { fields: tripImagesFields, append: appendTripImage, remove: removeTripImage } = useFieldArray({
    control,
    name: 'trip_images'
  });

  const [imagePreviews, setImagePreviews] = useState({});
  const tripImages = watch('trip_images');

  const handlePrimaryChange = (index) => {
    tripImagesFields.forEach((_, i) => {
      setValue(`trip_images.${i}.trip_image_is_primary`, i === index);
    });
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreviews((prev) => ({
        ...prev,
        [index]: URL.createObjectURL(file)
      }));
      setValue(`trip_images.${index}.trip_image_file`, file);
    }
  };

  const canAddMoreImages = tripImagesFields.length < MAX_IMAGES;

  return (
    <div className={styles.imageSection}>
      <h2 className="section-title">Trip Images (Max {MAX_IMAGES} images)</h2>
      <div className={styles.imagesContainer}>
        {tripImagesFields.map((image, index) => (
          <div key={image.id} className={styles.imageCard}>
            <div className={styles.imageUpload}>
              <input
                type="file"
                accept="image/*"
                className={styles.fileInput}
                {...register(`trip_images.${index}.trip_image_file`, { required: 'Image file is required' })}
                onChange={(event) => handleImageUpload(index, event)}
              />
              {imagePreviews[index] && (
                <img src={imagePreviews[index]} alt={`Trip Image ${index + 1}`} className={styles.imagePreview} />
              )}
            </div>
            <div className={styles.primarySection}>
              <label className={styles.primaryCheckbox}>
                <input
                  type="checkbox"
                  checked={!!tripImages[index].trip_image_is_primary}
                  onChange={() => handlePrimaryChange(index)}
                />
                <span className={styles.primaryLabel}>Set as Primary Image</span>
              </label>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  removeTripImage(index);
                  setImagePreviews((prev) => {
                    const newPreviews = { ...prev };
                    delete newPreviews[index];
                    return newPreviews;
                  });
                }}
                aria-label="Delete Image"
              >
                <FaTrash />
                <span className={styles.deleteLabel}>Delete Image</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {!canAddMoreImages ? `Max ${MAX_IMAGES} images reached` : null}

      <LinkWithIconButton
        label="Add Trip Image"
        icon={<FaPlus />}
        variant="success"
        onClick={() => appendTripImage({ trip_image_is_primary: false, trip_image_file: null })}
        disabled={!canAddMoreImages}
      />
    </div>
  );
};

export default TripImagesForm;
