import React from 'react';
import styles from './Stepper.module.css';

interface StepperProps {
  steps: string[];
  currentStep: number;
  stepCompleted: boolean[]; // Add stepCompleted prop to manage completion state
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, stepCompleted }) => {
  return (
    <div className={styles.stepperContainer}>
      {steps.map((step, index) => (
        <div key={index} className={styles.step}>
          <div
            className={`${styles.circle} ${
              stepCompleted[index] ? styles.completed : '' // Indicate completed steps
            } ${index < currentStep ? styles.active : ''} ${index === currentStep ? styles.currentStep : ''}`}
          >
            {index + 1}
          </div>
          <p
            className={`${styles.stepLabel} ${
              stepCompleted[index] ? styles.completedLabel : '' // Label for completed steps
            } ${index < currentStep ? styles.activeLabel : ''} ${index === currentStep ? styles.currentLabel : ''}`}
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
