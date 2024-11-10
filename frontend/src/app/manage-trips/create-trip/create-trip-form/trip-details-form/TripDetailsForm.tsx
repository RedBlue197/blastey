'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './TripDetailsForm.module.css';
import citiesData from '@/static/cities.json';

const TripDetailsForm = () => {
  const { register, setValue, formState: { errors } } = useFormContext();
  const [cities] = useState(citiesData);
  const [filteredOriginCities, setFilteredOriginCities] = useState([]);
  const [filteredDestinationCities, setFilteredDestinationCities] = useState([]);
  const [searchTermOrigin, setSearchTermOrigin] = useState('');
  const [searchTermDestination, setSearchTermDestination] = useState('');

  // Handle search term change for Origin
  const handleOriginSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTermOrigin(value);

    if (value.length >= 3) {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOriginCities(filtered.slice(0, 5)); // Limit to first 5
    } else {
      setFilteredOriginCities([]);
    }
  };

  // Handle search term change for Destination
  const handleDestinationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTermDestination(value);

    if (value.length >= 3) {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDestinationCities(filtered.slice(0, 5)); // Limit to first 5
    } else {
      setFilteredDestinationCities([]);
    }
  };

  // Set city value when clicked for Origin
  const handleOriginCitySelect = (cityName: string) => {
    setValue('trip_origin', cityName);
    setSearchTermOrigin(cityName);
    setFilteredOriginCities([]);
  };

  // Set city value when clicked for Destination
  const handleDestinationCitySelect = (cityName: string) => {
    setValue('trip_destination', cityName);
    setSearchTermDestination(cityName);
    setFilteredDestinationCities([]);
  };

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

        {/* Trip Origin */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Origin</label>
          <input
            type="text"
            className={styles.formInput}
            value={searchTermOrigin}
            onChange={handleOriginSearch}
            placeholder="Start typing a city..."
          />
          {searchTermOrigin && filteredOriginCities.length > 0 && (
            <div className={styles.filteredCitiesList}>
              {filteredOriginCities.map((city, index) => (
                <div
                  key={index}
                  className={styles.filteredCityItem}
                  onClick={() => handleOriginCitySelect(city.name)}
                >
                  {city.name}
                </div>
              ))}
            </div>
          )}
          {errors.trip_origin && <p className={styles.error}>{errors.trip_origin.message}</p>}
        </div>

        {/* Trip Destination */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Destination</label>
          <input
            type="text"
            className={styles.formInput}
            value={searchTermDestination}
            onChange={handleDestinationSearch}
            placeholder="Start typing a city..."
          />
          
          {searchTermDestination && filteredDestinationCities.length > 0 && (
            <div className={styles.filteredCitiesList}>
              {filteredDestinationCities.map((city, index) => (
                <div
                  key={index}
                  className={styles.filteredCityItem}
                  onClick={() => handleDestinationCitySelect(city.name)}
                >
                  {city.name}
                </div>
              ))}
            </div>
          )}
          {errors.trip_destination && <p className={styles.error}>{errors.trip_destination.message}</p>}
        </div>

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
