// context/CheckoutContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';

export const CheckoutContext = createContext(null);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [passengers, setPassengers] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({});

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedPassengers = localStorage.getItem('passengers');
    const savedServices = localStorage.getItem('selectedServices');
    const savedPaymentDetails = localStorage.getItem('paymentDetails');
    
    if (savedPassengers) setPassengers(JSON.parse(savedPassengers));
    if (savedServices) setSelectedServices(JSON.parse(savedServices));
    if (savedPaymentDetails) setPaymentDetails(JSON.parse(savedPaymentDetails));
  }, []);

  // Save cart to localStorage on state change
  useEffect(() => {
    localStorage.setItem('passengers', JSON.stringify(passengers));
    localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
    localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
  }, [passengers, selectedServices, paymentDetails]);

  return (
    <CheckoutContext.Provider value={{ passengers, setPassengers, selectedServices, setSelectedServices, paymentDetails, setPaymentDetails }}>
      {children}
    </CheckoutContext.Provider>
  );
};
