// config.ts
const config = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    jwtSecret: process.env.JWT_SECRET,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  };
  
  export default config;
  
const environment = process.env.NEXT_PUBLIC_ENV;

  if (environment === 'production') {
      console.log('Production environment');
      // Apply production-specific logic
  } else if (environment === 'development') {
      console.log('Development environment');
      // Apply development-specific logic
  } else {
      console.log('Test or other environment');
  }