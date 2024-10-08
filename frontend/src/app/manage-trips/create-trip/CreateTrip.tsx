'use client';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import styles from './CreateTrip.module.css'; // Import your CSS module for styling
import axios from 'axios';

interface CreateTripFormInputs {
  trip_title: string;
  trip_description?: string;
  trip_departure_date?: string;
  trip_return_date?: string;
  trip_origin?: string;
  trip_destination?: string;
  trip_total_availability?: number;
  trip_total_booking?: number;
  host_id: string;
  trip_link_url?: string;
  trip_price?: number;
  activity_items: {
    trip_item_name: string;
    trip_item_description?: string;
    trip_item_category: string;
    trip_item_address?: string;
    trip_item_traveler_reward?: number;
    trip_item_type: string;
    trip_item_price?: number;
  }[];
  trip_images?: { trip_image_is_primary: boolean }[];
}

const CreateTrip = () => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<CreateTripFormInputs>({
    defaultValues: {
      activity_items: [{ trip_item_name: '', trip_item_category: '', trip_item_type: '' }],
      trip_images: [{ trip_image_is_primary: true }],
    }
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CreateTripFormInputs) => {
    try {
      setLoading(true);
      const hostId = uuidv4(); // Example: Generate host_id if not provided
      const formData = {
        ...data,
        host_id: hostId, // Replace with actual host ID if needed
      };

      const response = await axios.post('/api/create-trip', formData); // Adjust API endpoint
      if (response.status === 201) {
        alert('Trip created successfully!');
        reset(); // Reset form on success
      } else {
        alert('Failed to create trip');
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('An error occurred while creating the trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create New Trip</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
          <label>Departure Date</label>
          <input type="date" {...register('trip_departure_date')} />
        </div>

        <div className={styles.formGroup}>
          <label>Return Date</label>
          <input type="date" {...register('trip_return_date')} />
        </div>

        <div className={styles.formGroup}>
          <label>Origin</label>
          <input {...register('trip_origin', { maxLength: 100 })} />
        </div>

        <div className={styles.formGroup}>
          <label>Destination</label>
          <input {...register('trip_destination', { maxLength: 100 })} />
        </div>

        <div className={styles.formGroup}>
          <label>Total Availability</label>
          <input type="number" {...register('trip_total_availability')} />
        </div>

        <div className={styles.formGroup}>
          <label>Total Bookings</label>
          <input type="number" {...register('trip_total_booking')} />
        </div>

        <div className={styles.formGroup}>
          <label>Trip Price</label>
          <input type="number" step="0.01" {...register('trip_price', { min: 0 })} />
        </div>

        <div className={styles.formGroup}>
          <label>Trip URL</label>
          <input type="url" {...register('trip_link_url', { pattern: /^https?:\/\/\S+$/ })} />
        </div>

        <h2>Trip Items</h2>
        <Controller
          control={control}
          name="activity_items"
          render={({ field }) => (
            <>
              {field.value.map((item, index) => (
                <div key={index} className={styles.formGroup}>
                  <label>Trip Item Name</label>
                  <input {...register(`activity_items.${index}.trip_item_name`, { required: true })} />
                  <label>Trip Item Category</label>
                  <input {...register(`activity_items.${index}.trip_item_category`, { required: true })} />
                  <label>Trip Item Type</label>
                  <input {...register(`activity_items.${index}.trip_item_type`, { required: true })} />
                </div>
              ))}
            </>
          )}
        />

        <h2>Images</h2>
        <Controller
          control={control}
          name="trip_images"
          render={({ field }) => (
            <>
              {field.value.map((image, index) => (
                <div key={index} className={styles.formGroup}>
                  <label>Primary Image</label>
                  <input type="checkbox" {...register(`trip_images.${index}.trip_image_is_primary`)} />
                </div>
              ))}
            </>
          )}
        />

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Creating...' : 'Create Trip'}
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;
