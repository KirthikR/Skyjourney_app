import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaUser, FaArrowLeft } from 'react-icons/fa';
import { createOrder } from '../../services/api';
import styles from './PassengerDetails.module.css';
import PassengerForm from '../../components/PassengerForm';
import { FaArrowRight } from 'react-icons/fa';

const PassengerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get flight and search params from location state
  const { flight, searchParams } = location.state || {};
  
  // Initialize passenger state based on search params
  const [passengers, setPassengers] = useState(() => {
    // Create initial passengers array based on search params
    const count = searchParams?.passengers?.adults || 1;
    return Array(count).fill(null).map((_, idx) => ({
      type: 'adult',
      details: {}
    }));
  });
  
  // Add children and infants if any
  useEffect(() => {
    if (searchParams?.passengers?.children) {
      const childPassengers = Array(searchParams.passengers.children).fill(null).map(() => ({
        type: 'child',
        details: {}
      }));
      setPassengers(prev => [...prev, ...childPassengers]);
    }
    
    if (searchParams?.passengers?.infants) {
      const infantPassengers = Array(searchParams.passengers.infants).fill(null).map(() => ({
        type: 'infant',
        details: {}
      }));
      setPassengers(prev => [...prev, ...infantPassengers]);
    }
  }, [searchParams]);

  // Handle passenger data changes
  const handlePassengerChange = (index, field, value) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        details: {
          ...updated[index].details,
          [field]: value
        }
      };
      return updated;
    });
  };

  // Add another passenger (optional functionality)
  const handleAddPassenger = () => {
    setPassengers(prev => [...prev, {
      type: 'adult',
      details: {}
    }]);
  };

  // Validate all passenger forms
  const validateAllPassengers = () => {
    // Basic validation - check if all required fields are filled
    return passengers.every(passenger => {
      const details = passenger.details;
      return details.given_name && 
             details.family_name && 
             details.born_on && 
             details.gender && 
             details.title;
    });
  };

  // Continue to seat selection
  const handleContinue = () => {
    // Validate passenger data
    if (!validateAllPassengers()) {
      alert("Please complete all required passenger information");
      return;
    }
    
    // Navigate to seats with all required data
    navigate("/booking/seats", {
      state: {
        flight,
        searchParams,
        passengers,
        order: location.state?.order
      }
    });
  };

  return (
    <div className={styles.container}>
      <h1>Passenger Information</h1>
      {flight && (
        <div className={styles.flightSummary}>
          <h3>Flight Summary</h3>
          <p>{flight.origin || flight.slices?.[0]?.origin?.iata_code} → 
             {flight.destination || flight.slices?.[0]?.destination?.iata_code}</p>
          <p>Date: {new Date(flight.departing_at || flight.slices?.[0]?.departing_at).toLocaleDateString()}</p>
        </div>
      )}

      {passengers.map((passenger, index) => (
        <PassengerForm
          key={index}
          index={index}
          passengerType={passenger.type}
          value={passenger.details}
          onChange={handlePassengerChange}
        />
      ))}

      <div className={styles.actions}>
        <button 
          className={styles.addPassenger} 
          onClick={handleAddPassenger}
        >
          Add Another Passenger
        </button>
        
        <button 
          className={styles.continueButton} 
          onClick={handleContinue}
        >
          Continue to Seat Selection <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default PassengerDetails;