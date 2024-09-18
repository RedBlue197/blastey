// TripsForm.tsx
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import styles from './TripsForm.module.css'; // Import styles as needed

interface TripsFormProps {
  onSubmit: (data: any) => void;
}

const TripsForm: React.FC<TripsFormProps> = ({ onSubmit }) => {
  const [departureDate, setDepartureDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [routeType, setRouteType] = useState<'one-way' | 'round-trip'>('one-way');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ departureDate, returnDate, origin, destination, routeType });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.formGroup}>
        <TextField
          label="Origin"
          variant="outlined"
          fullWidth
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <TextField
          label="Destination"
          variant="outlined"
          fullWidth
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
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
      {routeType === 'round-trip' && (
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
      )}
      <div className={styles.searchButtonWrapper}>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Search
        </Button>
      </div>
    </form>
  );
};

export default TripsForm;
