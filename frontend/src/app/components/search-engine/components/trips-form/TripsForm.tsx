import React, { use, useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { fr, enUS } from 'date-fns/locale'; // Import locales for different languages
import { TextField } from '@mui/material';
import styles from './TripsForm.module.css';
import PrimaryButton from '@/app/components/button/PrimaryButton';

interface TripsFormProps {
  onSubmit: (data: any) => void;
}

const TripsForm: React.FC<TripsFormProps> = ({ onSubmit }) => {
  const { t, i18n } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange<Date>>([null, null]);
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
      departureDate: dateRange[0],
      returnDate: dateRange[1],
      origin,
      destination,
    });
  };

  useEffect((
  ) => {
    console.log('Language changed to: ', i18n.language)
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
          <DateRangePicker
            startText={t('trips.departureDate')}
            endText={t('trips.returnDate')}
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} fullWidth variant="outlined" />
                <TextField {...endProps} fullWidth variant="outlined" style={{ marginLeft: 10 }} />
              </>
            )}
          />
        </LocalizationProvider>
      </div>

      <div className={styles.formGroupButton}>
        <PrimaryButton
          label={t('trips.Submit')}
          disabled={!origin || !destination || !dateRange[0]}
        />
      </div>
    </form>
  );
};

export default TripsForm;
