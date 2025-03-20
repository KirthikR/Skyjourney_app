import React from 'react';
import { FaPlane, FaUser, FaChair, FaSuitcase, FaCreditCard, FaCheck } from 'react-icons/fa';
import styles from '../styles/BookingSteps.module.css';

export default function BookingSteps({ currentStep }) {
  const steps = [
    { id: 1, name: 'Flights', icon: <FaPlane /> },
    { id: 2, name: 'Passengers', icon: <FaUser /> },
    { id: 3, name: 'Seats', icon: <FaChair /> },
    { id: 4, name: 'Add-ons', icon: <FaSuitcase /> },
    { id: 5, name: 'Payment', icon: <FaCreditCard /> },
    { id: 6, name: 'Confirmation', icon: <FaCheck /> }
  ];

  return (
    <div className={styles.stepsContainer}>
      {steps.map((step) => (
        <div 
          key={step.id} 
          className={`${styles.step} ${step.id === currentStep ? styles.active : ''} 
                     ${step.id < currentStep ? styles.completed : ''}`}
        >
          <div className={styles.stepIcon}>
            {step.id < currentStep ? <FaCheck /> : step.icon}
          </div>
          <div className={styles.stepName}>{step.name}</div>
          {step.id < steps.length && (
            <div className={styles.connector}></div>
          )}
        </div>
      ))}
    </div>
  );
}