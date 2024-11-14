import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import styles from './TripsForm.module.css';
import cityData from '@/static/cities.json'; // Import your JSON data
import PrimaryButton from '@/app/components/button/PrimaryButton';

interface City {
  id: string;
  name: string;
  country: string;
  admin1: string;
  lat: string;
  lon: string;
  pop: string;
}

interface TripsFormProps {
  onSubmit: (data: any) => void;
}

const TripsForm: React.FC<TripsFormProps> = ({ onSubmit }) => {
  const [departureDate, setDepartureDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [originSuggestions, setOriginSuggestions] = useState<City[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<City[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState<boolean>(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState<boolean>(false);

  const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrigin(value);

    if (value.length >= 3) {
      const filteredSuggestions = cityData.filter((city) =>
        city.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setOriginSuggestions(filteredSuggestions);
      setShowOriginSuggestions(true);
    } else {
      setShowOriginSuggestions(false);
    }
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);

    if (value.length >= 3) {
      const filteredSuggestions = cityData.filter((city) =>
        city.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setDestinationSuggestions(filteredSuggestions);
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  const handleSuggestionClick = (type: 'origin' | 'destination', city: City) => {
    if (type === 'origin') {
      setOrigin(city.name);
      setShowOriginSuggestions(false);
    } else {
      setDestination(city.name);
      setShowDestinationSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ departureDate, returnDate, origin, destination });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.formGroup}>
        <TextField
          label="Origin"
          variant="outlined"
          fullWidth
          value={origin}
          onChange={handleOriginChange}
          required
        />
        {showOriginSuggestions && (
          <List className={styles.suggestionsList}>
            {originSuggestions.map((city) => (
              <ListItem
                key={city.id}
                button
                onClick={() => handleSuggestionClick('origin', city)}
              >
                <ListItemText primary={city.name} secondary={`${city.admin1}, ${city.country}`} />
              </ListItem>
            ))}
          </List>
        )}
      </div>
      <div className={styles.formGroup}>
        <TextField
          label="Destination"
          variant="outlined"
          fullWidth
          value={destination}
          onChange={handleDestinationChange}
          required
        />
        {showDestinationSuggestions && (
          <List className={styles.suggestionsList}>
            {destinationSuggestions.map((city) => (
              <ListItem
                key={city.id}
                button
                onClick={() => handleSuggestionClick('destination', city)}
              >
                <ListItemText primary={city.name} secondary={`${city.admin1}, ${city.country}`} />
              </ListItem>
            ))}
          </List>
        )}
      </div>
      <div className={styles.formGroup}>
        <TextField
          label="Departure Date"
          type="date"
          variant="outlined"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <TextField
          label="Return Date"
          type="date"
          variant="outlined"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          required
        />
      </div>
      <button className={styles.searchButton}>
        Search
      </button>
    </form>
  );
};

export default TripsForm;
