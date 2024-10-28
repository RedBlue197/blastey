import React, { createContext, useContext, useState } from 'react';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tripData, setTripData] = useState({}); // You can define the structure based on your needs
  const [stepCompleted, setStepCompleted] = useState([false, false, false, false]); // Assuming 4 steps

  const nextStep = () => {
    if (!stepCompleted[currentStep]) {
      // If the current step isn't completed, mark it as completed
      setStepCompleted((prev) => {
        const newCompleted = [...prev];
        newCompleted[currentStep] = true;
        return newCompleted;
      });
    }
    setCurrentStep((prevStep) => Math.min(prevStep + 1, stepCompleted.length - 1)); // Move to the next step
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const updateTripData = (data) => {
    setTripData((prevData) => ({ ...prevData, ...data }));
  };

  return (
    <TripContext.Provider value={{ currentStep, tripData, stepCompleted, nextStep, previousStep, updateTripData }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  return useContext(TripContext);
};
