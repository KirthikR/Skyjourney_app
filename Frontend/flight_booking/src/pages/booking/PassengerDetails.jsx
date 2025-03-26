import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaUser, FaArrowLeft } from 'react-icons/fa';
import { createOrder } from '../../services/api';
import styles from './PassengerDetails.module.css';
import PassengerForm from '../../components/PassengerForm';

export default function PassengerDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!location.state?.selectedFlight) {
      navigate('/booking');
      return;
    }
    
    setSelectedFlight(location.state.selectedFlight);
    setSearchParams(location.state.searchParams);
    
    // Create initial passenger forms based on search parameters
    const initialPassengers = [];
    
    // Create adult passengers
    for (let i = 0; i < searchParams?.passengers?.adults || 1; i++) {
      initialPassengers.push({ type: 'adult' });
    }
    
    // Create child passengers
    for (let i = 0; i < searchParams?.passengers?.children || 0; i++) {
      initialPassengers.push({ type: 'child' });
    }
    
    // Create infant passengers
    for (let i = 0; i < searchParams?.passengers?.infants || 0; i++) {
      initialPassengers.push({ type: 'infant_in_seat' });
    }
    
    setPassengers(initialPassengers);
  }, [location.state, navigate, searchParams?.passengers]);
  
  const handlePassengerChange = (index, updatedPassenger) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = updatedPassenger;
    setPassengers(updatedPassengers);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create order with Duffel API
      const orderResponse = await createOrder(
        selectedFlight.id,
        passengers
      );
      
      // Navigate to confirmation page
      navigate('/booking/confirmation', { 
        state: { 
          order: orderResponse.data,
          flight: selectedFlight
        }
      });
    } catch (error) {
      console.error('Booking error:', error);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  if (!selectedFlight) {
    return <div className={styles.loading}>Loading...</div>;
  }
  
  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBack}>
        <FaArrowLeft /> Back
      </button>
      
      <header className={styles.header}>
        <h1>
          <FaUser /> Passenger Details
        </h1>
        <p className={styles.subtitle}>
          Enter passenger information to complete your booking
        </p>
      </header>
      
      <div className={styles.flightSummary}>
        <h3>Flight Summary</h3>
        <div className={styles.flightInfo}>
          <div className={styles.route}>
            {selectedFlight.slices.map((slice, index) => (
              <div key={index} className={styles.segment}>
                <div className={styles.airports}>
                  <span>{slice.origin.iata_code}</span>
                  <FaPlane className={styles.planeIcon} />
                  <span>{slice.destination.iata_code}</span>
                </div>
                <div className={styles.date}>
                  {new Date(slice.departing_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.price}>
            <span>Total Price: </span>
            <strong>{selectedFlight.total_currency} {selectedFlight.total_amount}</strong>
          </div>
        </div>
      </div>
      
      {error && (
        <div className={styles.error}>{error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.passengerForms}>
          {passengers.map((passenger, index) => (
            <PassengerForm 
              key={index}
              index={index}
              passengerType={passenger.type}
              onChange={handlePassengerChange}
            />
          ))}
        </div>
        
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.continueButton}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Complete Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}