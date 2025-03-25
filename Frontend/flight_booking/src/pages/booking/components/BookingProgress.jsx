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

// In your BookingProcess.jsx file, when form is submitted:
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    // Process booking details...
    
    // Create booking details to pass to confirmation
    const bookingDetails = {
      bookingId: `BK${Math.floor(Math.random() * 1000000)}`,
      airline: selectedFlight.owner.name,
      departureCode: selectedFlight.slices[0].origin.iata_code,
      departureCity: selectedFlight.slices[0].origin.city || 'Departure City',
      arrivalCode: selectedFlight.slices[0].destination.iata_code,
      arrivalCity: selectedFlight.slices[0].destination.city || 'Arrival City',
      departureDate: formatDate(selectedFlight.slices[0].segments[0].departing_at),
      departureTime: formatTime(selectedFlight.slices[0].segments[0].departing_at),
      arrivalDate: formatDate(selectedFlight.slices[0].segments[0].arriving_at),
      arrivalTime: formatTime(selectedFlight.slices[0].segments[0].arriving_at),
      passengerName: `${passengers[0].firstName} ${passengers[0].lastName}`,
      totalAmount: selectedFlight.total_amount,
      currency: selectedFlight.total_currency
    };
    
    // Navigate to confirmation page with booking details
    navigate('/booking/confirmation', {
      state: { bookingDetails }
    });
  } catch (error) {
    console.error('Error processing booking:', error);
    setError('Failed to process booking. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};