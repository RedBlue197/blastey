// pages/checkout/payment/page.tsx
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { CheckoutContext } from '../../../context/CheckoutContext';

const PaymentPage = () => {
  const router = useRouter();
  const { passengers, selectedServices } = useContext(CheckoutContext);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  const handlePayment = () => {
    // Perform payment logic here (e.g., using Stripe or other payment gateway)
    router.push('/checkout/confirmation');
  };

  return (
    <div>
      <h1>Payment Information</h1>
      <div>
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
      </div>
      <input
        type="text"
        placeholder="Card Number"
        value={cardDetails.number}
        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
      />
      <input
        type="text"
        placeholder="Expiry Date"
        value={cardDetails.expiry}
        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
      />
      <input
        type="text"
        placeholder="CVV"
        value={cardDetails.cvv}
        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
      />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;
