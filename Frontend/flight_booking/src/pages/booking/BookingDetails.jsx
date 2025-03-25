import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import styles from './BookingDetails.module.css';

export default function BookingDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get state data with localStorage fallback
  const locationState = location.state || {};
  const storedFlight = localStorage.getItem('selectedFlight') 
    ? JSON.parse(localStorage.getItem('selectedFlight')) 
    : null;
  const storedParams = localStorage.getItem('searchParams')
    ? JSON.parse(localStorage.getItem('searchParams'))
    : null;
  
  const selectedFlight = locationState.selectedFlight || storedFlight;
  const searchParams = locationState.searchParams || storedParams;
  
  const handleContinue = () => {
    // Store data in localStorage for persistence
    localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));
    localStorage.setItem('searchParams', JSON.stringify(searchParams));
    
    // Navigate to passenger details
    navigate('/booking/passengers', {
      state: {
        selectedFlight,
        searchParams
      }
    });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Redirect if no flight data available (from either location state or localStorage)
  useEffect(() => {
    if (!selectedFlight) {
      console.log('No flight selected, redirecting to flights page');
      navigate('/flights');
    }
  }, [selectedFlight, navigate]);

  // Show loading state until we confirm we have data
  if (!selectedFlight) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1><FaPlane className={styles.icon} /> Flight Details</h1>
        <p>Please review your flight details before proceeding</p>
      </div>
      
      <div className={styles.flightDetails}>
        {selectedFlight.slices.map((slice, index) => (
          <div key={index} className={styles.flightCard}>
            <div className={styles.flightHeader}>
              <h3>{index === 0 ? 'Outbound Flight' : 'Return Flight'}</h3>
              <span className={styles.airline}>{selectedFlight.owner?.name || 'Airline'}</span>
            </div>
            
            <div className={styles.flightRoute}>
              <div className={styles.routePoint}>
                <div className={styles.airportCode}>{slice.origin?.iata_code}</div>
                <div className={styles.time}>{formatTime(slice.departing_at)}</div>
                <div className={styles.date}>{formatDate(slice.departing_at)}</div>
              </div>
              
              <div className={styles.routeLine}>
                <div className={styles.duration}>
                  {Math.floor(slice.duration / 60)}h {slice.duration % 60}m
                </div>
                <div className={styles.line}></div>
                <FaPlane className={styles.planeIcon} />
              </div>
              
              <div className={styles.routePoint}>
                <div className={styles.airportCode}>{slice.destination?.iata_code}</div>
                <div className={styles.time}>{formatTime(slice.arriving_at)}</div>
                <div className={styles.date}>{formatDate(slice.arriving_at)}</div>
              </div>
            </div>
          </div>
        ))}
        
        <div className={styles.priceSection}>
          <h3>Price Summary</h3>
          <div className={styles.priceRow}>
            <span>Base Fare:</span>
            <span>${parseFloat(selectedFlight.total_amount).toFixed(2)}</span>
          </div>
          <div className={styles.priceRow}>
            <span>Taxes & Fees:</span>
            <span>Included</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total:</span>
            <span>${parseFloat(selectedFlight.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.actions}>
        <button onClick={handleContinue} className={styles.continueButton}>
          Continue to Passenger Details <FaArrowRight />
        </button>
      </div>
    </div>
  );
}