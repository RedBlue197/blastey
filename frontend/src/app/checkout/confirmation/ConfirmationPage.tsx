// pages/checkout/confirmation/page.tsx
import { useContext } from 'react';
import { CheckoutContext } from '../../../context/CheckoutContext';

const ConfirmationPage = () => {
  const { passengers, selectedServices } = useContext(CheckoutContext);

  return (
    <div>
      <h1>Booking Confirmed!</h1>
      <h3>Passengers</h3>
      <ul>
        {passengers.map((passenger, index) => (
          <li key={index}>{passenger.name} - {passenger.email}</li>
        ))}
      </ul>
      <h3>Selected Services</h3>
      <ul>
        {selectedServices.map((service, index) => (
          <li key={index}>{service.name} - ${service.price}</li>
        ))}
      </ul>
      <h3>Total Price: ${selectedServices.reduce((total, service) => total + service.price, 0)}</h3>
      <p>Your booking has been confirmed. Thank you!</p>
    </div>
  );
};

export default ConfirmationPage;
