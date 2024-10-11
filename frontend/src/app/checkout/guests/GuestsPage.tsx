// pages/checkout/passengers/page.tsx
import { useEffect, useContext, useState } from 'react';
import { CheckoutContext } from '../../../context/CheckoutContext';
import { useRouter } from 'next/router';

const PassengersPage = () => {
  const router = useRouter();
  const { passengers, setPassengers } = useContext(CheckoutContext);
  const [newPassenger, setNewPassenger] = useState({ name: '', email: '' });

  useEffect(() => {
    if (passengers.length > 0) {
      // If passengers exist, pre-fill the form or navigate to the right step.
      setNewPassenger(passengers[0]); // Example for pre-filling the first passenger
    }
  }, [passengers]);

  const handleAddPassenger = () => {
    setPassengers([...passengers, newPassenger]);
    setNewPassenger({ name: '', email: '' });
  };

  const handleNext = () => {
    router.push('/checkout/services?step=services');
  };

  return (
    <div>
      <h1>Passenger Information</h1>
      <input
        type="text"
        placeholder="Name"
        value={newPassenger.name}
        onChange={(e) => setNewPassenger({ ...newPassenger, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={newPassenger.email}
        onChange={(e) => setNewPassenger({ ...newPassenger, email: e.target.value })}
      />
      <button onClick={handleAddPassenger}>Add Passenger</button>
      <button onClick={handleNext}>Next: Select Services</button>
    </div>
  );
};

export default PassengersPage;
