'use client';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import { PrimaryButton } from '@/app/components'; // Import PrimaryButton component
import axios from 'axios';
import styles from './CreateTripForm.module.css'; // Import your CSS module for styling

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
  trip_images?: { trip_image_url: string; trip_image_is_primary: boolean }[];
  trip_openings?: {
    trip_opening_date: string;
    trip_opening_price: number;
    trip_opening_availability: number;
  }[];
}

const CreateTripForm = () => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<CreateTripFormInputs>({
    defaultValues: {
      activity_items: [{ trip_item_name: '', trip_item_category: '', trip_item_type: '' }],
      trip_images: [{ trip_image_url: '', trip_image_is_primary: true }],
      trip_openings: [{ trip_opening_date: '', trip_opening_price: 0, trip_opening_availability: 0 }]
    }
  });

  const { fields: activityItemsFields, append: appendActivityItem, remove: removeActivityItem } = useFieldArray({
    control,
    name: 'activity_items'
  });

  const { fields: tripImagesFields, append: appendTripImage } = useFieldArray({
    control,
    name: 'trip_images'
  });

  const { fields: tripOpeningsFields, append: appendTripOpening, remove: removeTripOpening } = useFieldArray({
    control,
    name: 'trip_openings'
  });

  const [loading, setLoading] = useState(false);
  const [isTripSectionOpen, setIsTripSectionOpen] = useState(true);
  const [isItemsSectionOpen, setIsItemsSectionOpen] = useState(true);
  const [isImagesSectionOpen, setIsImagesSectionOpen] = useState(true);
  const [isOpeningsSectionOpen, setIsOpeningsSectionOpen] = useState(true);

  const [cityOptions, setCityOptions] = useState([]);

  // Separate states to handle dropdown for each trip item and trip opening
  const [itemsDropdownOpen, setItemsDropdownOpen] = useState<boolean[]>([]);
  const [openingsDropdownOpen, setOpeningsDropdownOpen] = useState<boolean[]>([]);

  // Fetch cities with country from the backend
  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch('/api/cities');
        const data = await response.json();
        setCityOptions(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    }

    fetchCities();
  }, []);

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

  const toggleItemDropdown = (index: number) => {
    const updatedState = [...itemsDropdownOpen];
    updatedState[index] = !updatedState[index];
    setItemsDropdownOpen(updatedState);
  };

  const toggleOpeningDropdown = (index: number) => {
    const updatedState = [...openingsDropdownOpen];
    updatedState[index] = !updatedState[index];
    setOpeningsDropdownOpen(updatedState);
  };

  const simulateAsyncOperation = async () => {
    // Simulate a network request or other async action
    return new Promise(resolve => setTimeout(resolve, 3000));
  };

  return (
    <div className={styles.container}>
      <h1 className={'page-title'}>Create New Trip</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        
        {/* Trip Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle} onClick={() => setIsTripSectionOpen(!isTripSectionOpen)}>
            <span>Trip Details</span>
            <span className={styles.dropdownIcon}>
              {isTripSectionOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </h2>
          {isTripSectionOpen && (
            <>
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
                <label>Origin</label>
                <select {...register('trip_origin', { required: true })}>
                  <option value="">Select City</option>
                  {cityOptions.map((city) => (
                    <option key={city.id} value={`${city.country}, ${city.name}`}>
                      {city.country}, {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Destination</label>
                <select {...register('trip_destination', { required: true })}>
                  <option value="">Select City</option>
                  {cityOptions.map((city) => (
                    <option key={city.id} value={`${city.country}, ${city.name}`}>
                      {city.country}, {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Trip Items Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle} onClick={() => setIsItemsSectionOpen(!isItemsSectionOpen)}>
            <span>Trip Items</span>
            <span className={styles.dropdownIcon}>
              {isItemsSectionOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </h2>
          {isItemsSectionOpen && (
            <>
              {activityItemsFields.map((item, index) => (
                <div key={item.id} className={styles.formGroup}>
                  <h3 onClick={() => toggleItemDropdown(index)} className={styles.itemDropdown}>
                    Trip Item {index + 1} 
                    <span>{itemsDropdownOpen[index] ? <FaChevronUp /> : <FaChevronDown />}</span>
                    <FaTrash className={styles.removeIcon} onClick={() => removeActivityItem(index)} />
                  </h3>
                  {itemsDropdownOpen[index] && (
                    <>
                      <label>Trip Item Name</label>
                      <input {...register(`activity_items.${index}.trip_item_name`, { required: true })} />
                      <label>Trip Item Category</label>
                      <input {...register(`activity_items.${index}.trip_item_category`, { required: true })} />
                      <label>Trip Item Type</label>
                      <input {...register(`activity_items.${index}.trip_item_type`, { required: true })} />
                      <label>Trip Item Address</label>
                      <input {...register(`activity_items.${index}.trip_item_address`)} />
                      <label>Traveler Reward</label>
                      <input type="number" {...register(`activity_items.${index}.trip_item_traveler_reward`)} />
                      <label>Trip Item Price</label>
                      <input type="number" step="0.01" {...register(`activity_items.${index}.trip_item_price`)} />
                    </>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => appendActivityItem({ trip_item_name: '', trip_item_category: '', trip_item_type: '' })}>
                Add Trip Item
              </button>
            </>
          )}
        </div>

        {/* Trip Openings Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle} onClick={() => setIsOpeningsSectionOpen(!isOpeningsSectionOpen)}>
            <span>Trip Openings</span>
            <span className={styles.dropdownIcon}>
              {isOpeningsSectionOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </h2>
          {isOpeningsSectionOpen && (
            <>
              {tripOpeningsFields.map((opening, index) => (
                <div key={opening.id} className={styles.formGroup}>
                  <h3 onClick={() => toggleOpeningDropdown(index)} className={styles.itemDropdown}>
                    Trip Opening {index + 1} 
                    <span>{openingsDropdownOpen[index] ? <FaChevronUp /> : <FaChevronDown />}</span>
                    <FaTrash className={styles.removeIcon} onClick={() => removeTripOpening(index)} />
                  </h3>
                  {openingsDropdownOpen[index] && (
                    <>
                      <label>Opening Date</label>
                      <input type="date" {...register(`trip_openings.${index}.trip_opening_date`, { required: true })} />
                      <label>Opening Price</label>
                      <input type="number" step="0.01" {...register(`trip_openings.${index}.trip_opening_price`, { required: true })} />
                      <label>Opening Availability</label>
                      <input type="number" {...register(`trip_openings.${index}.trip_opening_availability`, { required: true })} />
                    </>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => appendTripOpening({ trip_opening_date: '', trip_opening_price: 0, trip_opening_availability: 0 })}>
                Add Trip Opening
              </button>
            </>
          )}
        </div>

        <div>
        <PrimaryButton
        label="Submit"
        onClick={simulateAsyncOperation}
        disabled={false}
      />
    </div>
      </form>
    </div>
  );
};

export default CreateTripForm;
