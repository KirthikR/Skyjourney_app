import React from 'react';
import { FaUser, FaLuggageCart, FaCreditCard, FaCheck } from 'react-icons/fa';
import styles from './BookingProgress.module.css';

export default function BookingProgress({ currentStep }) {
  const steps = [
    { icon: <FaUser />, label: 'Passenger Details' },
    { icon: <FaLuggageCart />, label: 'Add-ons' },
    { icon: <FaCreditCard />, label: 'Payment' },
    { icon: <FaCheck />, label: 'Confirmation' }
  ];
  
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`${styles.step} ${currentStep > index ? styles.completed : ''} ${currentStep === index + 1 ? styles.active : ''}`}
          >
            <div className={styles.stepIcon}>
              {step.icon}
            </div>
            <div className={styles.stepLabel}>{step.label}</div>
            {index < steps.length - 1 && <div className={styles.connector} />}
          </div>
        ))}
      </div>
    </div>
  );
}