// pages/checkout/page.tsx
import { useRouter } from 'next/router';
import GuestsPage from './guests/GuestsPage';
import ServicesPage from './services/ServicesPage';
import PaymentPage from './payment/PaymentPage';
import ConfirmationPage from './confirmation/ConfirmationPage';
import { useEffect } from 'react';

const CheckoutPage = () => {
  const router = useRouter();
  const { step } = router.query;

  useEffect(() => {
    // If no step is provided in the URL, default to the passengers step
    if (!step) {
      router.push('/checkout?step=guests');
    }
  }, [step, router]);

  // Conditional rendering based on the step in the URL query
  const renderStep = () => {
    switch (step) {
      case 'guests':
        return <GuestsPage />;
      case 'services':
        return <ServicesPage />;
      case 'payment':
        return <PaymentPage />;
      case 'confirmation':
        return <ConfirmationPage />;
      default:
        return <GuestsPage />;
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-steps">
        {/* Display the current step based on the query param */}
        {renderStep()}
      </div>
    </div>
  );
};

export default CheckoutPage;
