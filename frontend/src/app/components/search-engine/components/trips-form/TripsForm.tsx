import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { fr, enUS } from 'date-fns/locale';
import { TextField } from '@mui/material';
import styles from './TripsForm.module.css';
import PrimaryButton from '@/app/components/button/PrimaryButton';

interface TripsFormProps {
  onSubmit: (data: any) => void;
}

const TripsForm: React.FC<TripsFormProps> = ({ onSubmit }) => {
  const { t, i18n } = useTranslation();
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');

  // Dynamically set the locale based on the i18next language code
  const getLocale = () => {
    switch (i18n.language) {
      case 'fr':
        return fr;
      default:
        return enUS;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      departureDate: departureDate,
      returnDate: returnDate,
      origin,
      destination,
    });
  };

  useEffect(() => {
  }, [i18n.language]);


  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.formGroup}>
        <TextField
          label={t('trips.origin')}
          variant="outlined"
          fullWidth
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <TextField
          label={t('trips.destination')}
          variant="outlined"
          fullWidth
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getLocale()}>
          <TextField
            label={t('trips.departureDate')}
            type="date"
            variant="outlined"
            fullWidth
            value={departureDate ? formatDate(departureDate) : ''}
            onChange={(e) => setDepartureDate(parseDate(e.target.value))}
            InputLabelProps={{ shrink: true }}
            required
          />
        </LocalizationProvider>
      </div>

      <div className={styles.formGroup}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getLocale()}>
          <TextField
            label={t('trips.returnDate')}
            type="date"
            variant="outlined"
            fullWidth
            value={returnDate ? formatDate(returnDate) : ''}
            onChange={(e) => setReturnDate(parseDate(e.target.value))}
            InputLabelProps={{ shrink: true }}
          />
        </LocalizationProvider>
      </div>

      <div className={styles.formGroupButton}>
        <PrimaryButton
          label={t('trips.Submit')}
          disabled={!origin || !destination || !departureDate}
        />
      </div>
    </form>
  );
};

export default TripsForm;

// Helper function to format dates to YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to parse dates from YYYY-MM-DD
function parseDate(dateString: string): Date | null {
  try {
    return new Date(dateString);
  } catch (error) {
    return null;
  }
}