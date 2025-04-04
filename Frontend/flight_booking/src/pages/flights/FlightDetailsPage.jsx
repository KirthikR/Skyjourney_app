import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import FlightDetails from './FlightDetails';
import styles from './FlightDetails.module.css';

const FlightDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Try to get flight from location state
    if (location.state?.selectedFlight) {
      setFlight(location.state.selectedFlight);
      setLoading(false);
      return;
    }
    
    // Try to get from localStorage
    const storedFlights = localStorage.getItem('searchResults');
    if (storedFlights) {
      try {
        const parsedFlights = JSON.parse(storedFlights);
        const foundFlight = parsedFlights.find(f => f.id === id);
        if (foundFlight) {
          setFlight(foundFlight);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Error parsing stored flights:", e);
      }
    }
    
    // If we get here, we couldn't find the flight
    setLoading(false);
  }, [id, location.state]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleContinue = (selectedFlight) => {
    navigate('/booking/passengers', { 
      state: { flight: selectedFlight }
    });
  };
  
  if (loading) {
    return <div className={styles.loading}>Loading flight details...</div>;
  }
  
  if (!flight) {
    return (
      <div className={styles.errorMessage}>
        <h2>Flight Not Found</h2>
        <p>Sorry, we couldn't find details for this flight.</p>
        <button onClick={handleBack} className={styles.button}>
          Back to Flights
        </button>
      </div>
    );
  }
  
  return (
    <FlightDetails 
      flight={flight}
      onBack={handleBack}
      onContinue={handleContinue}
    />
  );
};

export default FlightDetailsPage;