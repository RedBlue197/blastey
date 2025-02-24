import React from 'react';
import styles from './Stepper.module.css';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className={styles.stepperContainer}>
      {steps.map((step, index) => (
        <div key={index} className={styles.step}>
          <div
            className={`${styles.circle} ${
              index < currentStep ? styles.active : ''
            } ${index === currentStep ? styles.currentStep : ''}`} 
          >
            {index + 1}
          </div>
          <p
            className={`${styles.stepLabel} ${
              index < currentStep ? styles.activeLabel : ''
            } ${index === currentStep ? styles.currentLabel : ''}`}
          >
            {step}
          </p>
          {index !== steps.length - 1 && (
            <div className={styles.lineContainer}>
              <div
                className={`${styles.line} ${
                  index < currentStep ? styles.activeLine : ''
                }`}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
