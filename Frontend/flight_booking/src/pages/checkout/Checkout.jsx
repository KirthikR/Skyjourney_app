import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Checkout.module.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedFlight, setSelectedFlight] = useState(null);
  
  useEffect(() => {
    if (location.state?.selectedFlight) {
      setSelectedFlight(location.state.selectedFlight);
    }
  }, [location.state]);
  
  if (!selectedFlight) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>No flight selected</h2>
          <p>Please select a flight first</p>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/booking')}
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  const handleContinue = () => {
    navigate('/booking/payment');
  };
  
  return (
    <div className={styles.container}>
      <h1>Checkout</h1>
      <div className={styles.flightSummary}>
        <h2>Flight Details</h2>
        <div className={styles.flightCard}>
          <div className={styles.airline}>
            {selectedFlight.owner.name} ({selectedFlight.owner.iata_code})
          </div>
          <div className={styles.price}>
            ${selectedFlight.total_amount} {selectedFlight.total_currency}
          </div>
          
          {selectedFlight.slices.map((slice, index) => (
            <div key={index} className={styles.slice}>
              <h3>{index === 0 ? 'Outbound' : 'Return'}</h3>
              <div>
                <strong>From:</strong> {slice.origin.iata_code} 
                <strong> To:</strong> {slice.destination.iata_code}
              </div>
              <div><strong>Duration:</strong> {Math.floor(slice.duration/60)}h {slice.duration%60}m</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.paymentSection}>
        <h2>Payment Information</h2>
        <p>This is a demo application. No actual payment will be processed.</p>
        <button 
          className={styles.confirmButton}
          onClick={handleContinue}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;