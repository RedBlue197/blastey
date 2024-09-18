// ActivitiesForm.tsx
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import styles from './ActivitiesForm.module.css';

const ActivitiesForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [activityType, setActivityType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ activityType, location, date });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.formGroup}>
        <TextField
          label="Activity Type"
          variant="outlined"
          fullWidth
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <TextField
          label="Location"
          variant="outlined"
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <TextField
          label="Date"
          type="date"
          variant="outlined"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <Button type="submit" variant="contained" color="primary">
        Search
      </Button>
    </form>
  );
};

export default ActivitiesForm;
