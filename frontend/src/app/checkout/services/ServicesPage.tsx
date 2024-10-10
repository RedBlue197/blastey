// pages/checkout/services/page.tsx
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { CheckoutContext } from '../../../context/CheckoutContext';

const servicesList = [
  { id: 1, name: 'Meal', price: 10 },
  { id: 2, name: 'Extra Luggage', price: 20 },
];

const ServicesPage = () => {
  const router = useRouter();
  const { selectedServices, setSelectedServices } = useContext(CheckoutContext);

  const handleServiceToggle = (service) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleNext = () => {
    router.push('/checkout/payment');
  };

  return (
    <div>
      <h1>Select Additional Services</h1>
      {servicesList.map((service) => (
        <div key={service.id}>
          <label>
            <input
              type="checkbox"
              checked={selectedServices.includes(service)}
              onChange={() => handleServiceToggle(service)}
            />
            {service.name} (${service.price})
          </label>
        </div>
      ))}
      <button onClick={handleNext}>Next: Payment</button>
    </div>
  );
};

export default ServicesPage;
