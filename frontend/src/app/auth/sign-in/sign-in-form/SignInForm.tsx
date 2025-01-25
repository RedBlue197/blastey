import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import styles from './SignInForm.module.css'; // Import the CSS module

const SignInForm: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation hook
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the sign-in logic here
    console.log({ email, password });
  };

  return (
    <div className={styles.signInContainer}>
      <div className={styles.signInBox}>
        <Typography variant="h4" className={styles.title}>
          {t('signIn')}
        </Typography>
        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            label={t('email')}
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.inputField}
          />
          <TextField
            label={t('password')}
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.inputField}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={styles.signInButton}
          >
            {t('signIn')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
